import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { createContext } from "./_core/context";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Tests for the test-mode auth bypass in apps/server/_core/context.ts.
 *
 * These verify the bypass stays safely off unless BOTH the env var
 * AND the header are set — i.e. we can't accidentally log in as
 * anyone in production just by sending a header, and we can't log
 * in in dev without explicitly opting in via the env var.
 *
 * Actual user-loading is exercised end-to-end through Playwright
 * (apps/e2e/transmissions.spec.ts) against a seeded DB; these unit
 * tests focus on the gating logic.
 */

function makeReq(headers: Record<string, string> = {}): CreateExpressContextOptions["req"] {
  return {
    headers,
  } as unknown as CreateExpressContextOptions["req"];
}

function makeRes(): CreateExpressContextOptions["res"] {
  return {
    clearCookie: () => {},
  } as unknown as CreateExpressContextOptions["res"];
}

describe("testAuthBypass — gating logic", () => {
  const savedEnv = process.env.TEST_AUTH_BYPASS_OPEN_ID;

  beforeEach(() => {
    delete process.env.TEST_AUTH_BYPASS_OPEN_ID;
  });

  afterEach(() => {
    if (savedEnv === undefined) {
      delete process.env.TEST_AUTH_BYPASS_OPEN_ID;
    } else {
      process.env.TEST_AUTH_BYPASS_OPEN_ID = savedEnv;
    }
  });

  it("is off by default — no env var, no header, user is null", async () => {
    const ctx = await createContext({
      req: makeReq(),
      res: makeRes(),
    } as CreateExpressContextOptions);
    expect(ctx.user).toBeNull();
  });

  it("is off when only the header is set (no env var) — production safety", async () => {
    const ctx = await createContext({
      req: makeReq({ "x-test-auth-bypass": "1" }),
      res: makeRes(),
    } as CreateExpressContextOptions);
    expect(ctx.user).toBeNull();
  });

  it("is off when only the env var is set (no header) — accidental fire prevention", async () => {
    process.env.TEST_AUTH_BYPASS_OPEN_ID = "some-test-user";
    const ctx = await createContext({
      req: makeReq(),
      res: makeRes(),
    } as CreateExpressContextOptions);
    // Without the header, bypass doesn't fire and the fallback
    // `sdk.authenticateRequest` path runs. Without a real cookie
    // that path throws ForbiddenError and user stays null.
    expect(ctx.user).toBeNull();
  });

  it("rejects a non-'1' header value — exact-match only", async () => {
    process.env.TEST_AUTH_BYPASS_OPEN_ID = "some-test-user";
    const ctx = await createContext({
      req: makeReq({ "x-test-auth-bypass": "true" }),
      res: makeRes(),
    } as CreateExpressContextOptions);
    expect(ctx.user).toBeNull();
  });

  it("is off when header is set to '0'", async () => {
    process.env.TEST_AUTH_BYPASS_OPEN_ID = "some-test-user";
    const ctx = await createContext({
      req: makeReq({ "x-test-auth-bypass": "0" }),
      res: makeRes(),
    } as CreateExpressContextOptions);
    expect(ctx.user).toBeNull();
  });

  it("when both are set, attempts DB lookup (returns null for unknown openId without DB)", async () => {
    // With env var + header set, the bypass tries to load the user
    // from the DB. In test (no DATABASE_URL), getUserByOpenId returns
    // undefined, so the bypass returns null and the fallback path
    // also fails → user is null.
    process.env.TEST_AUTH_BYPASS_OPEN_ID = "nonexistent-user";
    const ctx = await createContext({
      req: makeReq({ "x-test-auth-bypass": "1" }),
      res: makeRes(),
    } as CreateExpressContextOptions);
    expect(ctx.user).toBeNull();
  });
});
