import { COOKIE_NAME, REFRESH_COOKIE_NAME, ACCESS_TOKEN_MS, REFRESH_TOKEN_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

const VALID_PROVIDERS = new Set(["google", "discord", "github"] as const);
type OAuthProvider = "google" | "discord" | "github";

function isValidProvider(value: string): value is OAuthProvider {
  return VALID_PROVIDERS.has(value as OAuthProvider);
}

export function registerOAuthRoutes(app: Express) {
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
        res.status(401).json({ error: "Missing refresh token" });
        return;
      }

      const tokens = await sdk.rotateTokens(oldRefreshToken);
      if (!tokens) {
        // Clear stale cookies
        const cookieOptions = getSessionCookieOptions(req);
        res.clearCookie(COOKIE_NAME, cookieOptions);
        res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
        res.status(401).json({ error: "Invalid or expired refresh token" });
        return;
      }

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, tokens.accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MS });
      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MS });

      res.json({ ok: true });
    } catch (error: any) {
      console.error("[Auth] Refresh token error:", error?.message || error);
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

    try {
      const proto = req.get("x-forwarded-proto") || req.protocol;
      const callbackPath = provider === "google"
        ? "/api/oauth/callback"
        : `/api/oauth/callback/${provider}`;
      const redirectUri = `${proto}://${req.get("host")}${callbackPath}`;

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

      res.redirect(302, "/");
    } catch (error: any) {
      console.error(`[OAuth] ${provider} callback failed:`, error?.message || error);
      res.status(500).json({
        error: "OAuth callback failed",
        detail: error?.message || "Unknown error",
      });
    }
  });
}
