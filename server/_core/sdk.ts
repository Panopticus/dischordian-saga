import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import type {
  GoogleTokenResponse,
  GoogleUserInfo,
} from "./types/googleTypes";
import type {
  DiscordTokenResponse,
  DiscordUserInfo,
} from "./types/discordTypes";
import type {
  GitHubTokenResponse,
  GitHubUserInfo,
} from "./types/githubTypes";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

/** Normalized user info returned by all OAuth providers */
export type OAuthUserInfo = {
  openId: string;
  name: string;
  email: string | null;
  provider: "google" | "discord" | "github";
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USERINFO_URL = "https://discord.com/api/users/@me";

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USERINFO_URL = "https://api.github.com/user";

class GoogleOAuthService {
  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<GoogleTokenResponse> {
    const body = new URLSearchParams({
      code,
      client_id: ENV.googleClientId,
      client_secret: ENV.googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google token exchange failed: ${response.status} – ${errorText}`);
    }

    return (await response.json()) as GoogleTokenResponse;
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google userinfo failed: ${response.status} – ${errorText}`);
    }

    return (await response.json()) as GoogleUserInfo;
  }
}

class DiscordOAuthService {
  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<DiscordTokenResponse> {
    const body = new URLSearchParams({
      code,
      client_id: ENV.discordClientId,
      client_secret: ENV.discordClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const response = await fetch(DISCORD_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord token exchange failed: ${response.status} – ${errorText}`);
    }

    return (await response.json()) as DiscordTokenResponse;
  }

  async getUserInfo(accessToken: string): Promise<DiscordUserInfo> {
    const response = await fetch(DISCORD_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord userinfo failed: ${response.status} – ${errorText}`);
    }

    return (await response.json()) as DiscordUserInfo;
  }
}

class GitHubOAuthService {
  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<GitHubTokenResponse> {
    const body = new URLSearchParams({
      code,
      client_id: ENV.githubClientId,
      client_secret: ENV.githubClientSecret,
      redirect_uri: redirectUri,
    });

    const response = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub token exchange failed: ${response.status} – ${errorText}`);
    }

    return (await response.json()) as GitHubTokenResponse;
  }

  async getUserInfo(accessToken: string): Promise<GitHubUserInfo> {
    const response = await fetch(GITHUB_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub userinfo failed: ${response.status} – ${errorText}`);
    }

    return (await response.json()) as GitHubUserInfo;
  }
}

class SDKServer {
  private readonly google: GoogleOAuthService;
  private readonly discord: DiscordOAuthService;
  private readonly github: GitHubOAuthService;

  constructor() {
    this.google = new GoogleOAuthService();
    this.discord = new DiscordOAuthService();
    this.github = new GitHubOAuthService();
  }

  /**
   * Exchange authorization code for normalized user info, per provider.
   */
  async resolveOAuthUser(
    provider: "google" | "discord" | "github",
    code: string,
    redirectUri: string
  ): Promise<OAuthUserInfo> {
    switch (provider) {
      case "google": {
        const token = await this.google.exchangeCodeForToken(code, redirectUri);
        const info = await this.google.getUserInfo(token.access_token);
        if (!info.sub) throw new Error("Google user ID missing from user info");
        return {
          openId: info.sub,
          name: info.name || "",
          email: info.email ?? null,
          provider: "google",
        };
      }
      case "discord": {
        const token = await this.discord.exchangeCodeForToken(code, redirectUri);
        const info = await this.discord.getUserInfo(token.access_token);
        if (!info.id) throw new Error("Discord user ID missing from user info");
        return {
          openId: `discord:${info.id}`,
          name: info.global_name || info.username,
          email: info.email ?? null,
          provider: "discord",
        };
      }
      case "github": {
        const token = await this.github.exchangeCodeForToken(code, redirectUri);
        const info = await this.github.getUserInfo(token.access_token);
        if (!info.id) throw new Error("GitHub user ID missing from user info");
        return {
          openId: `github:${info.id}`,
          name: info.name || info.login,
          email: info.email ?? null,
          provider: "github",
        };
      }
    }
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }

  /**
   * Create a session token for an authenticated user's openId.
   */
  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      {
        openId,
        appId: ENV.googleClientId || "dischordian-saga",
        name: options.name || "",
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (
        !isNonEmptyString(openId) ||
        !isNonEmptyString(appId) ||
        !isNonEmptyString(name)
      ) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }

      return {
        openId,
        appId,
        name,
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const sessionUserId = session.openId;
    const signedInAt = new Date();
    let user = await db.getUserByOpenId(sessionUserId);

    if (!user) {
      throw ForbiddenError("User not found");
    }

    await db.upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt,
    });

    return user;
  }
}

export const sdk = new SDKServer();
