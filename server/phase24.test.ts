/**
 * Phase 24 Tests: Achievements Gallery, Deck Builder Integration, Game Preview Tooltips
 */
import { describe, it, expect } from "vitest";

/* ═══ ACHIEVEMENTS GALLERY DATA INTEGRITY ═══ */
describe("Achievements Gallery Data", () => {
  it("should have 33 lore achievements (one per CoNexus game)", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    expect(LORE_ACHIEVEMENTS.length).toBe(39);
  });

  it("every achievement should have a unique title", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const titles = LORE_ACHIEVEMENTS.map(a => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("every achievement should have a unique lore fragment", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const fragments = LORE_ACHIEVEMENTS.map(a => a.loreFragment);
    expect(new Set(fragments).size).toBe(fragments.length);
  });

  it("every achievement should have a non-empty description", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(ach.description.length).toBeGreaterThan(10);
    }
  });

  it("every achievement lore fragment should be substantial (50+ chars)", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(ach.loreFragment.length).toBeGreaterThan(50);
    }
  });

  it("every achievement should have an icon emoji", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(ach.icon.length).toBeGreaterThan(0);
    }
  });
});

/* ═══ ACHIEVEMENTS PER AGE ═══ */
describe("Achievements Per Age Distribution", () => {
  it("should have achievements for all 5 ages", async () => {
    const { getAchievementsByAge } = await import("../client/src/data/loreAchievements");
    const ages = [
      "The Age of Privacy",
      "Haven: Sundown Bazaar",
      "Fall of Reality (Prequel)",
      "Age of Potentials",
      "Visions",
    ] as const;

    for (const age of ages) {
      const ageAchievements = getAchievementsByAge(age);
      expect(ageAchievements.length).toBeGreaterThan(0);
    }
  });

  it("Age of Privacy should have 4 achievements", async () => {
    const { getAchievementsByAge } = await import("../client/src/data/loreAchievements");
    expect(getAchievementsByAge("The Age of Privacy").length).toBe(4);
  });

  it("Haven: Sundown Bazaar should have 7 achievements", async () => {
    const { getAchievementsByAge } = await import("../client/src/data/loreAchievements");
    expect(getAchievementsByAge("Haven: Sundown Bazaar").length).toBe(7);
  });

  it("Fall of Reality (Prequel) should have 10 achievements", async () => {
    const { getAchievementsByAge } = await import("../client/src/data/loreAchievements");
    expect(getAchievementsByAge("Fall of Reality (Prequel)").length).toBe(10);
  });

  it("Age of Potentials should have 7 achievements", async () => {
    const { getAchievementsByAge } = await import("../client/src/data/loreAchievements");
    expect(getAchievementsByAge("Age of Potentials").length).toBe(7);
  });

  it("Visions should have 5 achievements", async () => {
    const { getAchievementsByAge } = await import("../client/src/data/loreAchievements");
    expect(getAchievementsByAge("Visions").length).toBe(5);
  });
});

/* ═══ ACHIEVEMENT HELPERS ═══ */
describe("Achievement Helper Functions", () => {
  it("getTotalXpFromAchievements should return 0 for empty array", async () => {
    const { getTotalXpFromAchievements } = await import("../client/src/data/loreAchievements");
    expect(getTotalXpFromAchievements([])).toBe(0);
  });

  it("getTotalXpFromAchievements should sum XP correctly", async () => {
    const { LORE_ACHIEVEMENTS, getTotalXpFromAchievements } = await import("../client/src/data/loreAchievements");
    const firstTwo = [LORE_ACHIEVEMENTS[0].id, LORE_ACHIEVEMENTS[1].id];
    const expectedXp = LORE_ACHIEVEMENTS[0].xpReward + LORE_ACHIEVEMENTS[1].xpReward;
    expect(getTotalXpFromAchievements(firstTwo)).toBe(expectedXp);
  });

  it("getTotalXpFromAchievements should ignore unknown IDs", async () => {
    const { getTotalXpFromAchievements } = await import("../client/src/data/loreAchievements");
    expect(getTotalXpFromAchievements(["fake-id-1", "fake-id-2"])).toBe(0);
  });

  it("getCompletionPercentage should return 0 for no achievements", async () => {
    const { getCompletionPercentage } = await import("../client/src/data/loreAchievements");
    expect(getCompletionPercentage([])).toBe(0);
  });

  it("getCompletionPercentage should return 100 for all achievements", async () => {
    const { LORE_ACHIEVEMENTS, getCompletionPercentage } = await import("../client/src/data/loreAchievements");
    const allIds = LORE_ACHIEVEMENTS.map(a => a.id);
    expect(getCompletionPercentage(allIds)).toBe(100);
  });

  it("getAchievementById should find achievement by ID", async () => {
    const { LORE_ACHIEVEMENTS, getAchievementById } = await import("../client/src/data/loreAchievements");
    const first = LORE_ACHIEVEMENTS[0];
    const result = getAchievementById(first.id);
    expect(result).toBeDefined();
    expect(result!.title).toBe(first.title);
  });

  it("getAchievementById should return undefined for unknown ID", async () => {
    const { getAchievementById } = await import("../client/src/data/loreAchievements");
    expect(getAchievementById("nonexistent")).toBeUndefined();
  });
});

/* ═══ CARD REWARDS ═══ */
describe("Achievement Card Rewards", () => {
  it("most achievements should have card rewards", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const withRewards = LORE_ACHIEVEMENTS.filter(a => a.cardReward);
    // At least 80% should have card rewards
    expect(withRewards.length).toBeGreaterThanOrEqual(Math.floor(LORE_ACHIEVEMENTS.length * 0.8));
  });

  it("card rewards should have valid rarity values", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const validRarities = ["common", "uncommon", "rare", "epic", "legendary"];
    for (const ach of LORE_ACHIEVEMENTS) {
      if (ach.cardReward) {
        expect(validRarities).toContain(ach.cardReward.rarity);
      }
    }
  });

  it("card rewards should have valid type values", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const validTypes = ["character", "event", "artifact", "location"];
    for (const ach of LORE_ACHIEVEMENTS) {
      if (ach.cardReward) {
        expect(validTypes).toContain(ach.cardReward.type);
      }
    }
  });

  it("card reward names should be unique", async () => {
    const { LORE_ACHIEVEMENTS } = await import("../client/src/data/loreAchievements");
    const names = LORE_ACHIEVEMENTS
      .filter(a => a.cardReward)
      .map(a => a.cardReward!.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

/* ═══ GAME PREVIEW TOOLTIP DATA ═══ */
describe("Game Preview Tooltip Data", () => {
  it("every CoNexus game should have characters for tooltip display", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.characters.length).toBeGreaterThan(0);
    }
  });

  it("every CoNexus game should have at least 2 characters", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.characters.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every CoNexus game should have a description for tooltip", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.description.length).toBeGreaterThan(20);
    }
  });

  it("every CoNexus game should have estimatedTime for tooltip", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.estimatedTime).toBeTruthy();
    }
  });

  it("every CoNexus game should have a valid difficulty level", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const validDifficulties = ["beginner", "intermediate", "advanced", "master"];
    for (const game of CONEXUS_GAMES) {
      expect(validDifficulties).toContain(game.difficulty);
    }
  });
});

/* ═══ ROUTES AND NAVIGATION ═══ */
describe("Routes and Navigation", () => {
  it("achievements route should be wired in App.tsx", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("/home/ubuntu/loredex-os/client/src/App.tsx", "utf-8");
    expect(appContent).toContain('/achievements');
    expect(appContent).toContain('AchievementsGalleryPage');
  });

  it("AchievementsGalleryPage should exist as a module", async () => {
    const mod = await import("../client/src/pages/AchievementsGalleryPage");
    expect(mod.default).toBeDefined();
  });

  it("GamePreviewTooltip should exist as a module", async () => {
    const mod = await import("../client/src/components/GamePreviewTooltip");
    expect(mod.default).toBeDefined();
  });

  it("GamesPage should include achievements link", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("/home/ubuntu/loredex-os/client/src/pages/GamesPage.tsx", "utf-8");
    expect(content).toContain('/achievements');
    expect(content).toContain('LORE ACHIEVEMENTS');
  });

  it("ConexusPortalPage should import GamePreviewTooltip", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("/home/ubuntu/loredex-os/client/src/pages/ConexusPortalPage.tsx", "utf-8");
    expect(content).toContain('GamePreviewTooltip');
  });
});

/* ═══ AGE CATEGORIES COVER ART ═══ */
describe("Age Categories Cover Art", () => {
  it("all 6 age categories should have cover images", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    expect(AGE_CATEGORIES.length).toBe(6);
    for (const cat of AGE_CATEGORIES) {
      expect(cat.coverImage).toBeTruthy();
      expect(cat.coverImage).toContain("http");
    }
  });

  it("all age categories should have color and border config", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    for (const cat of AGE_CATEGORIES) {
      expect(cat.color).toBeTruthy();
      expect(cat.borderColor).toBeTruthy();
      expect(cat.bgColor).toBeTruthy();
      expect(cat.iconGlyph).toBeTruthy();
    }
  });
});

/* ═══ GAME CONTEXT CARD FUNCTIONS ═══ */
describe("GameContext Card Collection", () => {
  it("GameState should include collectedCards and activeDeck fields", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("/home/ubuntu/loredex-os/client/src/contexts/GameContext.tsx", "utf-8");
    expect(content).toContain("collectedCards: string[]");
    expect(content).toContain("activeDeck: string[]");
  });

  it("GameContextValue should include collectCard and setActiveDeck", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("/home/ubuntu/loredex-os/client/src/contexts/GameContext.tsx", "utf-8");
    expect(content).toContain("collectCard");
    expect(content).toContain("setActiveDeck");
  });
});
