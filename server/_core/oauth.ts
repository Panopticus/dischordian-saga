import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
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

      // Create session JWT and set cookie
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

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
