import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the transmissions router (Meme broadcast rewards).
 *
 * These run without a DB connection (DATABASE_URL unset in tests),
 * so they verify the router's graceful-degradation path: when the
 * DB is unavailable the mutation returns { newlyGranted: false }
 * instead of throwing, and the query returns an empty list.
 *
 * Integration coverage (with a real DB) belongs in e2e tests.
 */

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 777,
      openId: "test-transmission-user",
      email: "tester@example.com",
      name: "Transmission Tester",
      loginMethod: "oauth",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      deletedAt: null,
    signupWeek: null,
    installSource: null,
    abVariant: null,
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("transmissions.recordWatched", () => {
  it("returns { newlyGranted: false } gracefully when DB is unavailable", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.transmissions.recordWatched({
      transmissionId: "ep1-0",
      xp: 100,
      dream: 10,
      achievement: "first_transmission",
      loredexEntries: ["entity_architect"],
    });
    expect(result.newlyGranted).toBe(false);
  }, 15000);

  it("rejects empty transmissionId", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.transmissions.recordWatched({
        transmissionId: "",
        xp: 0,
        dream: 0,
      }),
    ).rejects.toThrow();
  }, 15000);

  it("rejects absurdly large reward values", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.transmissions.recordWatched({
        transmissionId: "ep1-0",
        xp: 99_999_999,
        dream: 0,
      }),
    ).rejects.toThrow();
  }, 15000);

  it("accepts undefined achievement and empty loredexEntries", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.transmissions.recordWatched({
      transmissionId: "ep1-1",
      xp: 150,
      dream: 15,
    });
    // Graceful degradation without DB — not thrown.
    expect(result).toBeDefined();
    expect("newlyGranted" in result).toBe(true);
  }, 15000);
});

describe("transmissions.listWatched", () => {
  it("returns an empty list when DB is unavailable", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.transmissions.listWatched();
    expect(result).toBeDefined();
    expect(Array.isArray(result.watched)).toBe(true);
    expect(result.watched).toHaveLength(0);
  }, 15000);
});
