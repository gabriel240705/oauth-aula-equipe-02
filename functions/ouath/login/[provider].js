import {
  randomToken,
  sha256Base64Url,
  pkceChallenge
} from "../../_shared/crypto.js";

import { transactionCookie } from "../../_shared/cookies.js";
import { getProviderConfig } from "../../_shared/providers.js";

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

  const config = getProviderConfig(provider, context.env);

  const transactionId = randomToken();
  const state = randomToken();
  const codeVerifier = randomToken();
  const nonce = provider === "google" ? randomToken() : null;

  const transactionHash = await sha256Base64Url(transactionId);
  const stateHash = await sha256Base64Url(state);
  const codeChallenge = await pkceChallenge(codeVerifier);

  const expiresAt = Math.floor(Date.now() / 1000) + 600;

  await context.env.DB
    .prepare(`
      INSERT INTO oauth_transactions (
        id_hash,
        provider,
        state_hash,
        nonce,
        code_verifier,
        expires_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(
      transactionHash,
      provider,
      stateHash,
      nonce,
      codeVerifier,
      expiresAt
    )
    .run();

  const authorizationUrl = new URL(config.authorizeUrl);

  authorizationUrl.searchParams.set(
    "client_id",
    config.clientId
  );

  authorizationUrl.searchParams.set(
    "redirect_uri",
    config.redirectUri
  );

  authorizationUrl.searchParams.set(
    "response_type",
    "code"
  );

  authorizationUrl.searchParams.set(
    "state",
    state
  );

  authorizationUrl.searchParams.set(
    "code_challenge",
    codeChallenge
  );

  authorizationUrl.searchParams.set(
    "code_challenge_method",
    "S256"
  );

  if (provider === "google") {
    authorizationUrl.searchParams.set(
      "scope",
      "openid email profile"
    );

    authorizationUrl.searchParams.set(
      "nonce",
      nonce
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl.toString(),
      "Set-Cookie": transactionCookie(transactionId),
      "Cache-Control": "no-store"
    }
  });
}
