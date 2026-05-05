import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for fight mechanics server-side components:
 * - Fight leaderboard (public + protected)
 * - Match recording
 */

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 999,
      openId: "test-fight-user",
      email: "fighter@test.com",
      name: "Test Fighter",
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

describe("fightLeaderboard.getLeaderboard", () => {
  it("returns leaderboard data with entries and total (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.fightLeaderboard.getLeaderboard({ limit: 10 });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("entries");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.entries)).toBe(true);
  }, 15000);
});

describe("fightLeaderboard.getMyStats", () => {
  it("returns stats for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.fightLeaderboard.getMyStats();
    expect(result).toBeDefined();
  }, 15000);
});

describe("fightLeaderboard.getMatchHistory", () => {
  it("returns match history with matches and total for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.fightLeaderboard.getMatchHistory({ limit: 5 });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("matches");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.matches)).toBe(true);
  }, 15000);
});

/* FightEngine3D module structure tests removed — 3D engine was deleted in favor of FightEngine2D */
