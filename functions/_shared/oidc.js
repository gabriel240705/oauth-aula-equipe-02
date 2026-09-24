function decodeBase64Url(value) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function decodeJson(value) {
  const bytes = decodeBase64Url(value);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

export async function verifyGoogleIdToken(
  idToken,
  clientId,
  expectedNonce
) {
  const parts = idToken.split(".");

  if (parts.length !== 3) {
    throw new Error("Formato de id_token inválido.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  const header = decodeJson(encodedHeader);
  const payload = decodeJson(encodedPayload);

  if (header.alg !== "RS256") {
    throw new Error("Algoritmo do id_token inválido.");
  }

  if (!header.kid) {
    throw new Error("kid ausente no id_token.");
  }

  const discoveryResponse = await fetch(
    "https://accounts.google.com/.well-known/openid-configuration"
  );

  if (!discoveryResponse.ok) {
    throw new Error("Falha ao obter configuração OIDC do Google.");
  }

  const discovery = await discoveryResponse.json();

  if (discovery.issuer !== "https://accounts.google.com") {
    throw new Error("Emissor OIDC inesperado.");
  }

  const jwksResponse = await fetch(discovery.jwks_uri);

  if (!jwksResponse.ok) {
    throw new Error("Falha ao obter chaves públicas do Google.");
  }

  const jwks = await jwksResponse.json();

  const jwk = jwks.keys.find((key) => key.kid === header.kid);

  if (!jwk) {
    throw new Error("Chave pública correspondente não encontrada.");
  }

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    },
    false,
    ["verify"]
  );

  const signedData = new TextEncoder().encode(
    `${encodedHeader}.${encodedPayload}`
  );

  const signature = decodeBase64Url(encodedSignature);

  const validSignature = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signature,
    signedData
  );

  if (!validSignature) {
    throw new Error("Assinatura do id_token inválida.");
  }

  const now = Math.floor(Date.now() / 1000);

  if (payload.iss !== discovery.issuer) {
    throw new Error("Emissor do id_token inválido.");
  }

  const audienceValid = Array.isArray(payload.aud)
    ? payload.aud.includes(clientId)
    : payload.aud === clientId;

  if (!audienceValid) {
    throw new Error("Audiência do id_token inválida.");
  }

  if (typeof payload.exp !== "number" || payload.exp <= now) {
    throw new Error("id_token expirado.");
  }

  if (
    typeof payload.iat !== "number" ||
    payload.iat > now + 300
  ) {
    throw new Error("iat do id_token inválido.");
  }

  if (!payload.nonce || payload.nonce !== expectedNonce) {
    throw new Error("Nonce inválido.");
  }

  if (!payload.sub) {
    throw new Error("Identificador do utilizador ausente.");
  }

  return {
    issuer: payload.iss,
    subject: String(payload.sub),
    email: payload.email ?? null,
    displayName: payload.name ?? null
  };
}
