import {
  COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_TOKEN_EXPIRY_MS,
  REFRESH_TOKEN_EXPIRY_MS,
} from "@shared/const";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Access token failed — attempt silent refresh via refresh token
    user = null;

    try {
      const refreshCookie = sdk.getRefreshCookie(opts.req);
      if (refreshCookie) {
        const tokens = await sdk.rotateTokens(refreshCookie);
        if (tokens) {
          // Set new cookies on the response
          const cookieOptions = getSessionCookieOptions(opts.req);
          opts.res.cookie(COOKIE_NAME, tokens.accessToken, {
            ...cookieOptions,
            maxAge: ACCESS_TOKEN_EXPIRY_MS,
          });
          opts.res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
            ...cookieOptions,
            path: "/api/auth",
            maxAge: REFRESH_TOKEN_EXPIRY_MS,
          });

          // Resolve the user from the refreshed session
          const dbUser = await db.getUserByOpenId(tokens.openId);
          if (dbUser) {
            await db.upsertUser({
              openId: dbUser.openId,
              lastSignedIn: new Date(),
            });
            user = dbUser;
          }
        }
      }
    } catch (refreshError) {
      // Silent refresh failed — user remains null
      console.warn("[Auth] Silent token refresh failed", String(refreshError));
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
