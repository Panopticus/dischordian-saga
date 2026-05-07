import { COOKIE_NAME, REFRESH_COOKIE_NAME, ACCESS_TOKEN_MS, REFRESH_TOKEN_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { randomBytes, timingSafeEqual } from "crypto";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";
import { logAuthEvent } from "../services/authAudit";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

const VALID_PROVIDERS = new Set(["google", "discord", "github"] as const);
type OAuthProvider = "google" | "discord" | "github";

function isValidProvider(value: string): value is OAuthProvider {
  return VALID_PROVIDERS.has(value as OAuthProvider);
}

const STATE_COOKIE_PREFIX = "oauth_state_";
const STATE_TTL_MS = 10 * 60 * 1000; // 10 min — long enough for slow user, short enough to limit replay window
// Read per-request so tests can flip the env mid-suite. Defaults to
// required in production, optional in dev (eases the client rollout
// of the new /api/oauth/start route).
function isStateRequired(): boolean {
  const raw = process.env.OAUTH_STATE_REQUIRED;
  if (raw === undefined) return ENV.isProduction;
  return raw === "true";
}

const PROVIDER_AUTHORIZE_URLS: Record<OAuthProvider, string> = {
  google: "https://accounts.google.com/o/oauth2/v2/auth",
  discord: "https://discord.com/api/oauth2/authorize",
  github: "https://github.com/login/oauth/authorize",
};

const PROVIDER_SCOPES: Record<OAuthProvider, string> = {
  google: "openid email profile",
  discord: "identify email",
  github: "read:user user:email",
};

function getClientId(provider: OAuthProvider): string {
  switch (provider) {
    case "google":
      return ENV.googleClientId;
    case "discord":
      return ENV.discordClientId;
    case "github":
      return ENV.githubClientId;
  }
}

function buildRedirectUri(req: Request, provider: OAuthProvider): string {
  const proto = req.get("x-forwarded-proto") || req.protocol;
  const callbackPath = provider === "google"
    ? "/api/oauth/callback"
    : `/api/oauth/callback/${provider}`;
  return `${proto}://${req.get("host")}${callbackPath}`;
}

/**
 * Generate a CSRF-resistant `state` value: 32 bytes of randomness,
 * base64url-encoded (43 chars). The same value is sent to the
 * provider AND set in a short-lived HttpOnly cookie. On callback,
 * cookie and query must match in constant time.
 */
function generateState(): string {
  return randomBytes(32).toString("base64url");
}

function timingSafeEquals(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function registerOAuthRoutes(app: Express) {
  // ── OAuth start endpoint ──
  // Generates a state nonce, stores it in an HttpOnly cookie, and
  // redirects the user to the provider authorize URL with the same
  // state. The callback handler (below) requires the state in the
  // query to match the state in the cookie — defeats CSRF on auth.
  //
  // GET /api/oauth/start/:provider?returnTo=/foo
  app.get("/api/oauth/start/:provider?", async (req: Request, res: Response) => {
    const provider = (req.params.provider || "google").toLowerCase();
    if (!isValidProvider(provider)) {
      res.status(400).send(`Unknown OAuth provider: ${provider}`);
      return;
    }
    const clientId = getClientId(provider);
    if (!clientId) {
      res.status(503).send(`Provider ${provider} not configured`);
      return;
    }

    const state = generateState();
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(`${STATE_COOKIE_PREFIX}${provider}`, state, {
      ...cookieOptions,
      maxAge: STATE_TTL_MS,
    });

    // Optional: persist a returnTo path, scoped to same-origin.
    const rawReturnTo = getQueryParam(req, "returnTo") ?? "/";
    const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/";
    res.cookie(`${STATE_COOKIE_PREFIX}return_${provider}`, returnTo, {
      ...cookieOptions,
      maxAge: STATE_TTL_MS,
    });

    const redirectUri = buildRedirectUri(req, provider);
    const authUrl = new URL(PROVIDER_AUTHORIZE_URLS[provider]);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", PROVIDER_SCOPES[provider]);
    authUrl.searchParams.set("state", state);
    if (provider === "google") {
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
    }
    res.redirect(authUrl.toString());
  });

  // ── Refresh token endpoint ──
  // Validates the refresh token, rotates it, and issues new access + refresh tokens.
  app.post("/api/refresh", async (req: Request, res: Response) => {
    try {
      const { parse: parseCookieHeader } = await import("cookie");
      const cookies = req.headers.cookie
        ? new Map(Object.entries(parseCookieHeader(req.headers.cookie)))
        : new Map<string, string>();

      const oldRefreshToken = cookies.get(REFRESH_COOKIE_NAME);
      if (!oldRefreshToken) {
        logAuthEvent(req, "token_refresh_missing");
        res.status(401).json({ error: "Missing refresh token" });
        return;
      }

      const tokens = await sdk.rotateTokens(oldRefreshToken);
      if (!tokens) {
        // Clear stale cookies
        const cookieOptions = getSessionCookieOptions(req);
        res.clearCookie(COOKIE_NAME, cookieOptions);
        res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
        logAuthEvent(req, "token_refresh_failure", { reason: "invalid_or_expired" });
        res.status(401).json({ error: "Invalid or expired refresh token" });
        return;
      }

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, tokens.accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MS });
      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MS });

      logAuthEvent(req, "token_refresh_success");
      res.json({ ok: true });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("[Auth] Refresh token error:", errMsg);
      logAuthEvent(req, "token_refresh_failure", { reason: errMsg });
      res.status(500).json({ error: "Token refresh failed" });
    }
  });

  // Unified callback: /api/oauth/callback/:provider
  // Also keeps /api/oauth/callback for backward-compat (defaults to Google)
  app.get("/api/oauth/callback/:provider?", async (req: Request, res: Response) => {
    const provider = (req.params.provider || "google").toLowerCase();

    if (!isValidProvider(provider)) {
      res.status(400).json({ error: `Unknown OAuth provider: ${provider}` });
      return;
    }

    const code = getQueryParam(req, "code");

    if (!code) {
      res.status(400).json({ error: "authorization code is required" });
      return;
    }

    // ── State validation (CSRF defense) ──
    // Pulled from cookie set by /api/oauth/start. If the client did
    // not go through /start, the cookie is absent — that's the
    // legacy path. Production requires it; dev allows it but warns.
    try {
      const { parse: parseCookieHeader } = await import("cookie");
      const cookies = req.headers.cookie
        ? parseCookieHeader(req.headers.cookie)
        : {};
      const expectedState = cookies[`${STATE_COOKIE_PREFIX}${provider}`];
      const queryState = getQueryParam(req, "state");

      if (expectedState || queryState) {
        if (!expectedState || !queryState || !timingSafeEquals(expectedState, queryState)) {
          console.warn(`[OAuth] ${provider} state mismatch — possible CSRF`, {
            hasCookie: Boolean(expectedState),
            hasQuery: Boolean(queryState),
          });
          logAuthEvent(req, "csrf_state_mismatch", {
            provider,
            hasCookie: Boolean(expectedState),
            hasQuery: Boolean(queryState),
          });
          res.status(400).json({ error: "OAuth state mismatch" });
          return;
        }
      } else if (isStateRequired()) {
        console.warn(`[OAuth] ${provider} missing state — rejecting`);
        logAuthEvent(req, "csrf_state_missing", { provider });
        res.status(400).json({ error: "OAuth state required" });
        return;
      } else {
        console.warn(`[OAuth] ${provider} legacy callback without state — accepting under OAUTH_isStateRequired()=false`);
        logAuthEvent(req, "csrf_state_legacy", { provider });
      }

      // Always clear state cookies after read, regardless of outcome.
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(`${STATE_COOKIE_PREFIX}${provider}`, cookieOptions);
    } catch (err) {
      console.error(`[OAuth] ${provider} state-check error:`, err);
      // Fail closed in production, open in dev.
      if (isStateRequired()) {
        res.status(500).json({ error: "OAuth state check failed" });
        return;
      }
    }

    try {
      const redirectUri = buildRedirectUri(req, provider);

      // Resolve user info from the provider
      const userInfo = await sdk.resolveOAuthUser(provider, code, redirectUri);

      // Upsert user into database
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email,
        loginMethod: provider,
        lastSignedIn: new Date(),
      });

      // Issue short-lived access token (15 min) and refresh token (30 days)
      const accessToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name,
        expiresInMs: ACCESS_TOKEN_MS,
      });
      const refreshToken = await sdk.createRefreshToken(userInfo.openId, userInfo.name);

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MS });
      res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MS });

      logAuthEvent(req, "login_success", {
        provider,
        openId: userInfo.openId,
      });

      // If the flow was initiated from a popup, signal the opener and
      // close the window so the title page (and its music) keeps
      // playing in the background. Otherwise fall back to a normal
      // redirect for users who hit the callback directly.
      //
      // Production CSP forbids inline <script> globally, which used to
      // freeze this response on a white popup (script blocked → no
      // postMessage, no close, no redirect). Override the CSP for this
      // single response with a nonce so the inline script is allowed
      // here without weakening the global policy.
      const nonce = randomBytes(16).toString("base64");
      res.setHeader(
        "Content-Security-Policy",
        `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'`,
      );
      res.type("html").send(`<!doctype html>
<html><body><script nonce="${nonce}">
(function () {
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "oauth:success", provider: ${JSON.stringify(provider)} }, window.location.origin);
      window.close();
      return;
    }
  } catch (e) { /* fall through to redirect */ }
  window.location.replace("/");
})();
</script></body></html>`);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(`[OAuth] ${provider} callback failed:`, errMsg);
      logAuthEvent(req, "login_failure", { provider, reason: errMsg });
      res.status(500).json({
        error: "OAuth callback failed",
        detail: errMsg || "Unknown error",
      });
    }
  });
}
