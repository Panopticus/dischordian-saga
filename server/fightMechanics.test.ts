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
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 999,
      openId: "test-fight-user",
      email: "fighter@test.com",
      name: "Test Fighter",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
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

describe("FightEngine3D module structure", () => {
  it("should export FightEngine3D class and TouchInput type", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightEngine3D.ts", "utf-8");
    // Core class export
    expect(content).toContain("export class FightEngine3D");
    // MCOC-style touch input type
    expect(content).toContain("export interface TouchInput");
    // New API methods
    expect(content).toContain("pushTouchInput");
    expect(content).toContain("setBlockHold");
    expect(content).toContain("setHeavyHold");
  });

  it("should have MCOC-style combat mechanics", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightEngine3D.ts", "utf-8");
    // Parry system
    expect(content).toContain("parryWindow");
    expect(content).toContain("isParrying");
    // Dexterity / Evade
    expect(content).toContain("dexActive");
    // Intercept
    expect(content).toContain("onIntercept");
    // Guard break
    expect(content).toContain("onGuardBreak");
    // MLLLM combo chain
    expect(content).toContain("comboChain");
    // Heavy charge
    expect(content).toContain("heavyChargeTime");
    // 3-bar special meter
    expect(content).toContain("specialMeter");
  });

  it("should have adaptive AI system", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightEngine3D.ts", "utf-8");
    // AI behavior styles
    expect(content).toContain("aggressive");
    expect(content).toContain("defensive");
    expect(content).toContain("evasive");
    // AI difficulty profiles
    expect(content).toContain("recruit");
    expect(content).toContain("archon");
    // AI update method
    expect(content).toContain("updateAI");
    // AI style methods
    expect(content).toContain("aiAggressive");
    expect(content).toContain("aiDefensive");
    expect(content).toContain("aiEvasive");
    expect(content).toContain("aiBalanced");
  });

  it("should have split-screen touch control zones in FightArena3D", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightArena3D.tsx", "utf-8");
    // MCOC-style gesture recognition
    expect(content).toContain("GestureTracker");
    expect(content).toContain("SWIPE_THRESHOLD");
    // Split screen zones
    expect(content).toContain("side: \"left\" | \"right\"");
    // Touch handlers
    expect(content).toContain("handleTouchStart");
    expect(content).toContain("handleTouchEnd");
    // Event flash system for parry/evade/intercept
    expect(content).toContain("PARRY!");
    expect(content).toContain("EVADE!");
    expect(content).toContain("INTERCEPT!");
    expect(content).toContain("GUARD BREAK!");
  });

  it("should have 3-segment special meter in HUD", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightArena3D.tsx", "utf-8");
    // 3-bar special meter segments
    expect(content).toContain("[0, 1, 2].map");
    // Special ready indicator
    expect(content).toContain("SPECIAL READY");
    // Gesture-based touch controls
    expect(content).toContain("HOLD: BLOCK");
    expect(content).toContain("TAP: LIGHT");
  });
});
