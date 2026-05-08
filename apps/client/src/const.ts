export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** True iff a `VITE_GOOGLE_CLIENT_ID` is configured in this build.
 *  UI surfaces should gate the Google login button on this so a
 *  misconfigured deployment doesn't render a button that leads to a
 *  broken Google OAuth page (`client_id=undefined`). */
export const isGoogleLoginAvailable = (): boolean =>
  Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

/**
 * Routes go through `/api/oauth/start/<provider>` rather than building
 * the provider URL on the client. The server generates a `state`
 * nonce, stores it in an HttpOnly cookie, and redirects to the
 * provider — this is what defeats CSRF on the OAuth callback.
 *
 * `returnTo` is preserved across the round-trip so a user who
 * clicks "Sign in" from a deep page lands back on the same page.
 */
const buildStartUrl = (provider: "google" | "discord" | "github") => {
  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const url = new URL(`/api/oauth/start/${provider}`, window.location.origin);
  if (returnTo && returnTo !== "/") url.searchParams.set("returnTo", returnTo);
  return url.toString();
};

export const getGoogleLoginUrl = () => buildStartUrl("google");

export const getDiscordLoginUrl = () => {
  if (!import.meta.env.VITE_DISCORD_CLIENT_ID) return null;
  return buildStartUrl("discord");
};

export const getGitHubLoginUrl = () => {
  if (!import.meta.env.VITE_GITHUB_CLIENT_ID) return null;
  return buildStartUrl("github");
};
