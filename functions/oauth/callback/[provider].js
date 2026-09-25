import {
  randomToken,
  sha256Base64Url
} from "../../_shared/crypto.js";

import {
  getCookie,
  sessionCookie,
  clearTransactionCookie
} from "../../_shared/cookies.js";

import { getProviderConfig } from "../../_shared/providers.js";
import { verifyGoogleIdToken } from "../../_shared/oidc.js";

function errorResponse(message, status = 400) {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function onRequestGet(context) {
  const provider = context.params.provider;

  if (provider !== "google" && provider !== "github") {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }

  const url = new URL(context.request.url);

  const providerError = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (providerError) {
    return errorResponse("Autenticação recusada pelo provedor.");
  }

  if (!code || !state) {
    return errorResponse(
      "Código de autorização ou state não encontrado."
    );
  }

  const transactionId = getCookie(
    context.request,
    "__Host-oauth-tx"
  );

  if (!transactionId) {
    return errorResponse(
      "Cookie temporário da transação não encontrado."
    );
  }

  const transactionHash =
    await sha256Base64Url(transactionId);

  const now = Math.floor(Date.now() / 1000);

  const transaction = await context.env.DB
    .prepare(`
      SELECT
        provider,
        state_hash,
        nonce,
        code_verifier,
        expires_at
      FROM oauth_transactions
      WHERE id_hash = ?
        AND provider = ?
        AND expires_at > ?
    `)
    .bind(
      transactionHash,
      provider,
      now
    )
    .first();

  if (!transaction) {
    return errorResponse(
      "Transação inexistente, expirada ou já utilizada."
    );
  }

  const receivedStateHash =
    await sha256Base64Url(state);

  if (receivedStateHash !== transaction.state_hash) {
    return errorResponse("State inválido.");
  }

  /*
   * A transação é apagada ANTES da troca do código.
   * Isso impede a reutilização da mesma transação OAuth.
   */
  await context.env.DB
    .prepare(`
      DELETE FROM oauth_transactions
      WHERE id_hash = ?
    `)
    .bind(transactionHash)
    .run();

  const config =
    getProviderConfig(provider, context.env);

  try {
    const tokenBody = new URLSearchParams();

    tokenBody.set("client_id", config.clientId);
    tokenBody.set(
      "client_secret",
      config.clientSecret
    );
    tokenBody.set("code", code);
    tokenBody.set(
      "redirect_uri",
      config.redirectUri
    );
    tokenBody.set(
      "code_verifier",
      transaction.code_verifier
    );

    if (provider === "google") {
      tokenBody.set(
        "grant_type",
        "authorization_code"
      );
    }

    const tokenResponse = await fetch(
      config.tokenUrl,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: tokenBody
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(
        "Falha na troca do código de autorização."
      );
    }

    const tokenData =
      await tokenResponse.json();

    let identity;

    /*
     * GOOGLE
     */
    if (provider === "google") {
      if (!tokenData.id_token) {
        throw new Error(
          "Google não devolveu id_token."
        );
      }

      identity =
        await verifyGoogleIdToken(
          tokenData.id_token,
          config.clientId,
          transaction.nonce
        );
    }

    /*
     * GITHUB
     */
    if (provider === "github") {
      if (!tokenData.access_token) {
        throw new Error(
          "GitHub não devolveu access_token."
        );
      }

      if (
        !tokenData.token_type ||
        tokenData.token_type.toLowerCase() !==
          "bearer"
      ) {
        throw new Error(
          "Tipo de token do GitHub inválido."
        );
      }

      const userResponse = await fetch(
        config.userUrl,
        {
          headers: {
            Authorization:
              `Bearer ${tokenData.access_token}`,
            Accept:
              "application/vnd.github+json",
            "X-GitHub-Api-Version":
              "2026-03-10",
            "User-Agent":
              "oauth-pages-lab"
          }
        }
      );

      if (!userResponse.ok) {
        throw new Error(
          "Falha ao consultar identidade no GitHub."
        );
      }

      const githubUser =
        await userResponse.json();

      if (
        !Number.isInteger(githubUser.id)
      ) {
        throw new Error(
          "Identificador do GitHub inválido."
        );
      }

      identity = {
        issuer: "https://github.com",
        subject: String(githubUser.id),
        email:
          githubUser.email ?? null,
        displayName:
          githubUser.name ??
          githubUser.login ??
          null
      };

      /*
       * Revoga a autorização do GitHub
       * antes de criar a sessão local.
       */
      const basicCredentials =
        btoa(
          `${config.clientId}:${config.clientSecret}`
        );

      const revokeResponse = await fetch(
        `https://api.github.com/applications/${config.clientId}/grant`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Basic ${basicCredentials}`,
            Accept:
              "application/vnd.github+json",
            "Content-Type":
              "application/json",
            "X-GitHub-Api-Version":
              "2026-03-10",
            "User-Agent":
              "oauth-pages-lab"
          },
          body: JSON.stringify({
            access_token:
              tokenData.access_token
          })
        }
      );

      if (revokeResponse.status !== 204) {
        throw new Error(
          "Falha ao revogar autorização do GitHub."
        );
      }
    }

    /*
     * Criação da sessão local
     */
    const sessionId = randomToken();

    const sessionHash =
      await sha256Base64Url(sessionId);

    const createdAt =
      Math.floor(Date.now() / 1000);

    const expiresAt =
      createdAt + 28800;

    await context.env.DB
      .prepare(`
        INSERT INTO sessions (
          id_hash,
          issuer,
          subject,
          email,
          display_name,
          expires_at,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        sessionHash,
        identity.issuer,
        identity.subject,
        identity.email,
        identity.displayName,
        expiresAt,
        createdAt
      )
      .run();

    const headers = new Headers();

    headers.set(
      "Location",
      context.env.PUBLIC_BASE_URL
    );

    headers.set(
      "Cache-Control",
      "no-store"
    );

    headers.append(
      "Set-Cookie",
      sessionCookie(sessionId)
    );

    headers.append(
      "Set-Cookie",
      clearTransactionCookie()
    );

    return new Response(null, {
      status: 302,
      headers
    });

 } catch (error) {
  console.error("OAuth callback:", error.message);

  return Response.json(
    {
      error:
        "Falha ao concluir a autenticação."
    },
    {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
        "Set-Cookie":
          clearTransactionCookie()
      }
    }
  );
}
}
