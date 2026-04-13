import { describe, expect, it } from "vitest";
import {
  getLevelForXp,
  getTitleForLevel,
  LEVEL_THRESHOLDS,
  TITLES,
  DEFAULT_PROGRESS,
  DEFAULT_GAME_SAVE,
  DISCHORDIAN_ACHIEVEMENTS,
  ARK_THEMES,
  type AchievementDef,
  type UserProgressData,
  type GameSaveData,
  type ArkThemeDef,
} from "../shared/gamification";

describe("getLevelForXp", () => {
  it("returns level 1 for 0 XP", () => {
    expect(getLevelForXp(0)).toBe(1);
  });

  it("returns level 1 for XP below first threshold", () => {
    expect(getLevelForXp(50)).toBe(1);
  });

  it("returns level 2 at exactly 100 XP", () => {
    expect(getLevelForXp(100)).toBe(2);
  });

  it("returns level 3 at exactly 300 XP", () => {
    expect(getLevelForXp(300)).toBe(3);
  });

  it("returns correct level for mid-range XP", () => {
    expect(getLevelForXp(1200)).toBe(5);
  });

  it("returns max level for very high XP", () => {
    expect(getLevelForXp(100000)).toBe(LEVEL_THRESHOLDS.length);
  });

  it("returns level 1 for negative XP", () => {
    expect(getLevelForXp(-100)).toBe(1);
  });
});

describe("getTitleForLevel", () => {
  it("returns Recruit for level 1", () => {
    expect(getTitleForLevel(1)).toBe("Recruit");
  });

  it("returns Operative for level 3", () => {
    expect(getTitleForLevel(3)).toBe("Operative");
  });

  it("returns Agent for level 5", () => {
    expect(getTitleForLevel(5)).toBe("Agent");
  });

  it("returns Specialist for level 8", () => {
    expect(getTitleForLevel(8)).toBe("Specialist");
  });

  it("returns Commander for level 10", () => {
    expect(getTitleForLevel(10)).toBe("Commander");
  });

  it("returns Archon for level 13", () => {
    expect(getTitleForLevel(13)).toBe("Archon");
  });

  it("returns Architect of Reality for level 20", () => {
    expect(getTitleForLevel(20)).toBe("Architect of Reality");
  });

  it("returns highest applicable title for levels between thresholds", () => {
    expect(getTitleForLevel(7)).toBe("Agent");
    expect(getTitleForLevel(12)).toBe("Commander");
  });
});

describe("DEFAULT_PROGRESS", () => {
  it("has empty discovered entries", () => {
    expect(DEFAULT_PROGRESS.discoveredEntries).toEqual([]);
  });

  it("has empty watched episodes", () => {
    expect(DEFAULT_PROGRESS.watchedEpisodes).toEqual([]);
  });

  it("has zero fight stats", () => {
    expect(DEFAULT_PROGRESS.fightWins).toBe(0);
    expect(DEFAULT_PROGRESS.fightLosses).toBe(0);
    expect(DEFAULT_PROGRESS.perfectWins).toBe(0);
  });

  it("has timeline and board unexplored", () => {
    expect(DEFAULT_PROGRESS.timelineExplored).toBe(false);
    expect(DEFAULT_PROGRESS.boardExplored).toBe(false);
  });

  it("has zero doom scroll reads", () => {
    expect(DEFAULT_PROGRESS.doomScrollRead).toBe(0);
  });
});

describe("DEFAULT_GAME_SAVE", () => {
  it("has empty unlocked fighters", () => {
    expect(DEFAULT_GAME_SAVE.unlockedFighters).toEqual([]);
  });

  it("has zero fight points", () => {
    expect(DEFAULT_GAME_SAVE.fightPoints).toBe(0);
  });

  it("has zero win streak", () => {
    expect(DEFAULT_GAME_SAVE.winStreak).toBe(0);
    expect(DEFAULT_GAME_SAVE.bestWinStreak).toBe(0);
  });
});

describe("DISCHORDIAN_ACHIEVEMENTS", () => {
  it("has at least 20 achievements", () => {
    expect(DISCHORDIAN_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(20);
  });

  it("all achievements have required fields", () => {
    for (const ach of DISCHORDIAN_ACHIEVEMENTS) {
      expect(ach.achievementId).toBeTruthy();
      expect(ach.name).toBeTruthy();
      expect(ach.description).toBeTruthy();
      expect(ach.icon).toBeTruthy();
      expect(["explore", "watch", "fight", "discover", "collect", "social", "master"]).toContain(ach.category);
      expect(["bronze", "silver", "gold", "platinum", "legendary"]).toContain(ach.tier);
      expect(ach.xpReward).toBeGreaterThanOrEqual(0);
      // Level achievements give points instead of XP, but all should give something
      expect(ach.xpReward + ach.pointsReward).toBeGreaterThan(0);
      expect(ach.condition).toBeTruthy();
      expect(ach.condition.type).toBeTruthy();
    }
  });

  it("all achievement IDs are unique", () => {
    const ids = DISCHORDIAN_ACHIEVEMENTS.map((a) => a.achievementId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has achievements in multiple categories", () => {
    const categories = new Set(DISCHORDIAN_ACHIEVEMENTS.map((a) => a.category));
    expect(categories.size).toBeGreaterThanOrEqual(4);
  });

  it("has achievements in multiple tiers", () => {
    const tiers = new Set(DISCHORDIAN_ACHIEVEMENTS.map((a) => a.tier));
    expect(tiers.size).toBeGreaterThanOrEqual(3);
  });
});

describe("ARK_THEMES", () => {
  it("has at least 5 themes", () => {
    expect(ARK_THEMES.length).toBeGreaterThanOrEqual(5);
  });

  it("has a default theme at unlock level 1", () => {
    const defaultTheme = ARK_THEMES.find((t) => t.id === "default");
    expect(defaultTheme).toBeTruthy();
    expect(defaultTheme!.unlockLevel).toBe(1);
  });

  it("all themes have required color fields", () => {
    for (const theme of ARK_THEMES) {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.colors.primary).toBeTruthy();
      expect(theme.colors.bg).toBeTruthy();
      expect(theme.colors.text).toBeTruthy();
      expect(theme.colors.glow).toBeTruthy();
    }
  });

  it("all theme IDs are unique", () => {
    const ids = ARK_THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("themes are ordered by unlock level", () => {
    for (let i = 1; i < ARK_THEMES.length; i++) {
      expect(ARK_THEMES[i].unlockLevel).toBeGreaterThanOrEqual(ARK_THEMES[i - 1].unlockLevel);
    }
  });
});

describe("LEVEL_THRESHOLDS", () => {
  it("starts at 0", () => {
    expect(LEVEL_THRESHOLDS[0]).toBe(0);
  });

  it("is monotonically increasing", () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i]).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1]);
    }
  });

  it("has at least 10 levels", () => {
    expect(LEVEL_THRESHOLDS.length).toBeGreaterThanOrEqual(10);
  });
});
