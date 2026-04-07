export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate Google OAuth login URL at runtime so redirect URI reflects the current origin.
export const getGoogleLoginUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return url.toString();
};

/** @deprecated Use getGoogleLoginUrl instead */
export const getLoginUrl = getGoogleLoginUrl;

export const getDiscordLoginUrl = () => {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  if (!clientId) return null;

  const redirectUri = `${window.location.origin}/api/oauth/callback/discord`;

  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify email");

  return url.toString();
};

export const getGitHubLoginUrl = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  if (!clientId) return null;

  const redirectUri = `${window.location.origin}/api/oauth/callback/github`;

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user user:email");

  return url.toString();
};
