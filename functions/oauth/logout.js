import {
  getCookie,
  clearSessionCookie
} from "../_shared/cookies.js";

import {
  sha256Base64Url
} from "../_shared/crypto.js";

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin");

  if (origin !== context.env.PUBLIC_BASE_URL) {
    return Response.json(
      { error: "Origem inválida." },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const sessionId = getCookie(
    context.request,
    "__Host-session"
  );

  if (sessionId) {
    const sessionHash =
      await sha256Base64Url(sessionId);

    await context.env.DB
      .prepare(`
        DELETE FROM sessions
        WHERE id_hash = ?
      `)
      .bind(sessionHash)
      .run();
  }

  const headers = new Headers();

  headers.set(
    "Location",
    context.env.PUBLIC_BASE_URL
  );

  headers.set(
    "Cache-Control",
    "no-store"
  );

  headers.set(
    "Set-Cookie",
    clearSessionCookie()
  );

  return new Response(null, {
    status: 303,
    headers
  });
}

export function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response(
      "Method Not Allowed",
      {
        status: 405,
        headers: {
          Allow: "POST",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  return onRequestPost(context);
}
