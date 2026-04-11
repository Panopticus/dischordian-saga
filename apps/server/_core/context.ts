import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../db/schema";
import { sdk } from "./sdk";
import { getUserByOpenId } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Test-mode authentication bypass for Playwright E2E suites.
 *
 * Activation requires ALL of:
 *   1. `TEST_AUTH_BYPASS_OPEN_ID` env var set server-side
 *   2. Request carries an `x-test-auth-bypass: 1` header
 *
 * Two independent signals so the bypass cannot fire in production
 * (where the env var is never set) or via a stray header on a dev
 * server (where the env var needs explicit opt-in). When it does
 * fire, we load the matching user from the DB exactly like the
 * real auth path — no synthetic user objects, so downstream code
 * sees a genuine user row.
 *
 * Intended use: CI-only Playwright runs that need an authenticated
 * session without going through Google OAuth. Seed a test user
 * row with a known `openId`, set the env var to that id, and
 * Playwright's `beforeEach` hook adds the header to every request.
 */
async function tryTestAuthBypass(
  req: CreateExpressContextOptions["req"],
): Promise<User | null> {
  const openId = process.env.TEST_AUTH_BYPASS_OPEN_ID;
  if (!openId) return null;
  const headerValue = req.headers["x-test-auth-bypass"];
  if (headerValue !== "1") return null;
  const user = await getUserByOpenId(openId);
  return user ?? null;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Check the test bypass first — it's gated by an env var that's
  // never set in production, so the branch is dead code outside CI.
  user = await tryTestAuthBypass(opts.req);

  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
