export function getProviderConfig(provider, env) {
  const baseUrl = env.PUBLIC_BASE_URL;

  if (provider === "google") {
    return {
      name: "google",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      redirectUri: `${baseUrl}/oauth/callback/google`,
      discoveryUrl: "https://accounts.google.com/.well-known/openid-configuration"
    };
  }

  if (provider === "github") {
    return {
      name: "github",
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorizeUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      redirectUri: `${baseUrl}/oauth/callback/github`,
      userUrl: "https://api.github.com/user"
    };
  }

  return null;
}
