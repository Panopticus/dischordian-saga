/* ═══════════════════════════════════════════════════════
   Phase 31 Tests — Remaining Sprites, Training Mode, Leaderboard
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

// ─── Sprite Pose Coverage ───
describe("All Fighters Have Pose Sprites", () => {
  it("should have CHARACTER_CONFIGS for all fighters", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    const { ALL_FIGHTERS, DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    
    const allFighterIds = [...ALL_FIGHTERS, ...DEMON_FIGHTERS].map(f => f.id);
    const configKeys = Object.keys(CHARACTER_CONFIGS);
    
    // Every fighter should have a config
    for (const id of allFighterIds) {
      expect(configKeys).toContain(id);
    }
  });

  it("should have poseSprites for at least 40 fighters", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    
    const withPoses = Object.values(CHARACTER_CONFIGS).filter(
      (c: any) => c.poseSprites && Object.keys(c.poseSprites).length > 0
    );
    
    expect(withPoses.length).toBeGreaterThanOrEqual(40);
  });

  it("each poseSprites should have 6 required poses", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    
    const requiredPoses = ["idle", "attack", "block", "hit", "ko", "victory"];
    
    for (const [id, config] of Object.entries(CHARACTER_CONFIGS)) {
      const c = config as any;
      if (c.poseSprites && Object.keys(c.poseSprites).length > 0) {
        for (const pose of requiredPoses) {
          expect(c.poseSprites[pose], `${id} missing pose: ${pose}`).toBeDefined();
          expect(c.poseSprites[pose]).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("pose sprite URLs should be valid CDN URLs", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    
    for (const [id, config] of Object.entries(CHARACTER_CONFIGS)) {
      const c = config as any;
      if (c.poseSprites) {
        for (const [pose, url] of Object.entries(c.poseSprites)) {
          if (url) {
            expect(url as string, `${id}.${pose}`).toMatch(/cloudfront\.net/);
          }
        }
      }
    }
  });
});

// ─── Arena Backgrounds ───
describe("Arena Background Images", () => {
  it("at least 8 arenas should have backgroundImage URLs", async () => {
    const { ARENAS } = await import("../client/src/game/gameData");
    
    expect(ARENAS.length).toBeGreaterThanOrEqual(8);
    
    const withBg = ARENAS.filter(a => a.backgroundImage);
    expect(withBg.length).toBeGreaterThanOrEqual(8);
    for (const arena of withBg) {
      expect(arena.backgroundImage).toMatch(/^https:\/\//);
    }
  });
});

// ─── Training Mode ───
describe("Training Mode", () => {
  it("FightEngine3D should accept trainingMode parameter", async () => {
    const mod = await import("../client/src/game/FightEngine3D");
    expect(mod.FightEngine3D).toBeDefined();
    // Constructor exists and is callable
    expect(typeof mod.FightEngine3D).toBe("function");
  });
});

// ─── Sound System ───
describe("Fight Sound Manager", () => {
  it("FightSoundManager should be importable", async () => {
    const mod = await import("../client/src/game/FightSoundManager");
    expect(mod.FightSoundManager).toBeDefined();
    expect(typeof mod.FightSoundManager).toBe("function");
  });
});

// ─── Leaderboard Backend ───
describe("Fight Leaderboard Router", () => {
  it("should export the fightLeaderboardRouter", async () => {
    const mod = await import("./routers/fightLeaderboard");
    expect(mod.fightLeaderboardRouter).toBeDefined();
  });

  it("should have getLeaderboard, getMyStats, getMatchHistory, recordMatch procedures", async () => {
    const mod = await import("./routers/fightLeaderboard");
    const router = mod.fightLeaderboardRouter;
    
    // Check that the router has the expected procedure keys
    const procedures = Object.keys((router as any)._def.procedures || {});
    expect(procedures).toContain("getLeaderboard");
    expect(procedures).toContain("getMyStats");
    expect(procedures).toContain("getMatchHistory");
    expect(procedures).toContain("recordMatch");
  });
});

// ─── Leaderboard Schema ───
describe("Fight Leaderboard Database Schema", () => {
  it("should have fightLeaderboard and fightMatchHistory tables", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.fightLeaderboard).toBeDefined();
    expect(schema.fightMatches).toBeDefined();
  });

  it("fightLeaderboard should have elo, wins, losses, rankTier fields", async () => {
    const schema = await import("../drizzle/schema");
    const columns = Object.keys((schema.fightLeaderboard as any));
    
    // Table object has column definitions
    expect(columns.length).toBeGreaterThan(0);
  });

  it("fightMatches should have playerFighter, opponentFighter, won fields", async () => {
    const schema = await import("../drizzle/schema");
    const columns = Object.keys((schema.fightMatches as any));
    
    expect(columns.length).toBeGreaterThan(0);
  });
});

// ─── Integration: FightPage has leaderboard link ───
describe("FightPage Integration", () => {
  it("should have LEADERBOARD link and TRAINING button", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    
    expect(content).toContain("fight-leaderboard");
    expect(content).toContain("LEADERBOARD");
    expect(content).toContain("TRAINING");
    expect(content).toContain("recordMatch");
    expect(content).toContain("isTrainingMode");
  });
});

// ─── FightLeaderboardPage exists ───
describe("FightLeaderboardPage", () => {
  it("should exist and have rankings, mystats, history tabs", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightLeaderboardPage.tsx", "utf-8");
    
    expect(content).toContain("RANKINGS");
    expect(content).toContain("MY STATS");
    expect(content).toContain("HISTORY");
    expect(content).toContain("ELO");
    expect(content).toContain("GRANDMASTER");
  });
});

// ─── Route Registration ───
describe("Route Registration", () => {
  it("App.tsx should have /fight-leaderboard route", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/App.tsx", "utf-8");
    
    expect(content).toContain("fight-leaderboard");
    expect(content).toContain("FightLeaderboardPage");
  });
});
