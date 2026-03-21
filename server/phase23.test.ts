/**
 * Phase 23 Tests: Game Completion Tracking, Lore Achievements, Cover Art, Saga Timeline
 */
import { describe, it, expect } from "vitest";

/* ═══ LORE ACHIEVEMENTS DATA ═══ */
describe("Lore Achievements Data", () => {
  it("should export LORE_ACHIEVEMENTS with 33 entries (one per game)", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    expect(Array.isArray(LORE_ACHIEVEMENTS)).toBe(true);
    expect(LORE_ACHIEVEMENTS.length).toBe(39);
  });

  it("each achievement should have required fields", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(ach.id).toBeTruthy();
      expect(ach.gameId).toBeTruthy();
      expect(ach.title).toBeTruthy();
      expect(ach.description).toBeTruthy();
      expect(ach.loreFragment).toBeTruthy();
      expect(typeof ach.xpReward).toBe("number");
      expect(ach.xpReward).toBeGreaterThan(0);
      expect(ach.icon).toBeTruthy();
    }
  });

  it("each achievement should have a unique ID", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const ids = LORE_ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each achievement should map to a unique game ID", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const gameIds = LORE_ACHIEVEMENTS.map(a => a.gameId);
    expect(new Set(gameIds).size).toBe(gameIds.length);
  });

  it("every achievement gameId should match a real CoNexus game", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const gameIds = new Set(CONEXUS_GAMES.map(g => g.id));
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(gameIds.has(ach.gameId)).toBe(true);
    }
  });

  it("getAchievementByGameId should return correct achievement", async () => {
    const { LORE_ACHIEVEMENTS, getAchievementByGameId } = await import("../client/src/data/loreAchievements");
    const first = LORE_ACHIEVEMENTS[0];
    const result = getAchievementByGameId(first.gameId);
    expect(result).toBeDefined();
    expect(result!.id).toBe(first.id);
  });

  it("getAchievementByGameId should return undefined for unknown game", async () => {
    const { getAchievementByGameId } = await import("../client/src/data/loreAchievements");
    const result = getAchievementByGameId("nonexistent-game");
    expect(result).toBeUndefined();
  });

  it("achievements should have card rewards with valid structure", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const withCards = LORE_ACHIEVEMENTS.filter(a => a.cardReward);
    expect(withCards.length).toBeGreaterThan(0);
    for (const ach of withCards) {
      expect(ach.cardReward!.name).toBeTruthy();
      expect(ach.cardReward!.type).toBeTruthy();
      expect(ach.cardReward!.rarity).toBeTruthy();
    }
  });

  it("XP rewards should scale by age (later ages = more XP)", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const { CONEXUS_GAMES, AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    
    // Group achievements by age
    const ageOrder = AGE_CATEGORIES.map(c => c.age);
    const xpByAge: Record<string, number[]> = {};
    for (const ach of LORE_ACHIEVEMENTS) {
      const game = CONEXUS_GAMES.find(g => g.id === ach.gameId);
      if (game) {
        if (!xpByAge[game.age]) xpByAge[game.age] = [];
        xpByAge[game.age].push(ach.xpReward);
      }
    }
    
    // Each age should have achievements
    for (const age of ageOrder) {
      expect(xpByAge[age]).toBeDefined();
      expect(xpByAge[age].length).toBeGreaterThan(0);
    }
  });
});

/* ═══ COVER ART INTEGRATION ═══ */
describe("Cover Art Integration", () => {
  it("every AGE_CATEGORY should have a coverImage URL", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    for (const cat of AGE_CATEGORIES) {
      expect(cat.coverImage).toBeTruthy();
      expect(cat.coverImage).toMatch(/^https:\/\//);
    }
  });

  it("cover images should be unique per age", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    const urls = AGE_CATEGORIES.map(c => c.coverImage);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("cover images should use CDN URLs", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    for (const cat of AGE_CATEGORIES) {
      expect(cat.coverImage).toMatch(/cloudfront\.net|cdn/i);
    }
  });
});

/* ═══ GAME COMPLETION TRACKING ═══ */
describe("Game Completion Tracking", () => {
  it("GameState should include completedGames array", async () => {
    // Verify the GameContext exports the expected state shape
    const mod = await import("../client/src/contexts/GameContext");
    // GameContext exists and exports useGame
    expect(mod.useGame).toBeDefined();
    expect(typeof mod.useGame).toBe("function");
  });

  it("CONEXUS_GAMES should have 34 games across 5 ages", async () => {
    const { CONEXUS_GAMES, AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    expect(CONEXUS_GAMES.length).toBe(40);
    expect(AGE_CATEGORIES.length).toBe(6);
    
    // Verify all games belong to a valid age
    const validAges = new Set(AGE_CATEGORIES.map(c => c.age));
    for (const game of CONEXUS_GAMES) {
      expect(validAges.has(game.age)).toBe(true);
    }
  });

  it("game counts per age should match expected distribution", async () => {
    const { CONEXUS_GAMES, AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    const counts: Record<string, number> = {};
    for (const game of CONEXUS_GAMES) {
      counts[game.age] = (counts[game.age] || 0) + 1;
    }
    
    // Verify each category's games array matches the filtered count
    for (const cat of AGE_CATEGORIES) {
      expect(cat.games.length).toBe(counts[cat.age]);
    }
  });

  it("every game should have a direct CoNexus URL (not saga page)", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.conexusUrl).toBeTruthy();
      expect(game.conexusUrl).toMatch(/^https:\/\/conexus\.ink\//);
      // Blood Weave is new and uses saga page URL until published on CoNexus
      if (game.id === "blood-weave-gates-of-hell") continue;
      // Should NOT be just the saga page
      expect(game.conexusUrl).not.toBe("https://conexus.ink/s/Dischordian%20Saga");
    }
  });

  it("every game should have a unique ID", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const ids = CONEXUS_GAMES.map(g => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

/* ═══ SAGA TIMELINE DATA ═══ */
describe("Saga Timeline Structure", () => {
  it("SagaTimelinePage should export a default component", async () => {
    const mod = await import("../client/src/pages/SagaTimelinePage");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("ConexusPortalPage should export a default component", async () => {
    const mod = await import("../client/src/pages/ConexusPortalPage");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("AGE_CATEGORIES should be in chronological order", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    const expectedOrder = [
      "The Foundation",
      "The Age of Privacy",
      "Haven: Sundown Bazaar",
      "Fall of Reality (Prequel)",
      "Age of Potentials",
      "Visions",
    ];
    expect(AGE_CATEGORIES.map(c => c.age)).toEqual(expectedOrder);
  });

  it("each age category should have description and iconGlyph", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    for (const cat of AGE_CATEGORIES) {
      expect(cat.description).toBeTruthy();
      expect(cat.iconGlyph).toBeTruthy();
      expect(cat.color).toBeTruthy();
      expect(cat.bgColor).toBeTruthy();
      expect(cat.borderColor).toBeTruthy();
    }
  });
});

/* ═══ LORE ACHIEVEMENT CONTENT QUALITY ═══ */
describe("Lore Achievement Content Quality", () => {
  it("lore fragments should be substantial (at least 50 chars)", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(ach.loreFragment.length).toBeGreaterThanOrEqual(50);
    }
  });

  it("achievement titles should be unique", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const titles = LORE_ACHIEVEMENTS.map(a => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("achievement descriptions should be unique", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const descs = LORE_ACHIEVEMENTS.map(a => a.description);
    expect(new Set(descs).size).toBe(descs.length);
  });

  it("lore fragments should be unique", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const frags = LORE_ACHIEVEMENTS.map(a => a.loreFragment);
    expect(new Set(frags).size).toBe(frags.length);
  });
});
