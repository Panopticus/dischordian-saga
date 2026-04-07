import {
  COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_TOKEN_EXPIRY_MS,
  REFRESH_TOKEN_EXPIRY_MS,
} from "@shared/const";
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

export function registerAuthRoutes(app: Express) {
  // Token refresh endpoint — rotates refresh token and issues new access token
  app.post("/api/auth/refresh", async (req: Request, res: Response) => {
    try {
      const refreshCookie = sdk.getRefreshCookie(req);
      const tokens = await sdk.rotateTokens(refreshCookie);

      if (!tokens) {
        res.status(401).json({ error: "Invalid or expired refresh token" });
        return;
      }

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, tokens.accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_EXPIRY_MS,
      });
      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
        ...cookieOptions,
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      });

      res.status(200).json({ ok: true });
    } catch (error: any) {
      console.error("[Auth] Token refresh failed:", error?.message || error);
      res.status(401).json({ error: "Token refresh failed" });
    }
  });
}

export function registerOAuthRoutes(app: Express) {
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

      // Create access + refresh tokens
      const accessToken = await sdk.createAccessToken(userInfo.openId, {
        name: userInfo.name,
      });
      const refreshToken = await sdk.createRefreshToken(userInfo.openId);

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_EXPIRY_MS,
      });
      res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
        ...cookieOptions,
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      });

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
