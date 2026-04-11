import { describe, it, expect } from "vitest";
import {
  getMasteryRank,
  getXpToNextRank,
  getUnlockedPerks,
  getNextPerk,
  calculateClassXp,
  CLASS_PERKS,
  MASTERY_RANKS,
  CLASS_XP_ACTIONS,
  type CharacterClass,
  type MasteryRank,
} from "../shared/classMastery";

/* ═══════════════════════════════════════════════════════
   MASTERY RANK CALCULATION
   ═══════════════════════════════════════════════════════ */

describe("getMasteryRank", () => {
  it("returns rank 0 for 0 XP", () => {
    expect(getMasteryRank(0)).toBe(0);
  });

  it("returns rank 0 for XP below first threshold", () => {
    expect(getMasteryRank(99)).toBe(0);
  });

  it("returns rank 1 at exactly 100 XP", () => {
    expect(getMasteryRank(100)).toBe(1);
  });

  it("returns rank 2 at 500 XP", () => {
    expect(getMasteryRank(500)).toBe(2);
  });

  it("returns rank 3 at 2000 XP", () => {
    expect(getMasteryRank(2000)).toBe(3);
  });

  it("returns rank 4 at 8000 XP", () => {
    expect(getMasteryRank(8000)).toBe(4);
  });

  it("returns rank 5 (Grandmaster) at 25000 XP", () => {
    expect(getMasteryRank(25000)).toBe(5);
  });

  it("returns rank 5 for XP far above max threshold", () => {
    expect(getMasteryRank(999999)).toBe(5);
  });

  it("returns rank 1 for XP between rank 1 and rank 2 thresholds", () => {
    expect(getMasteryRank(250)).toBe(1);
  });

  it("returns rank 4 for XP just below rank 5 threshold", () => {
    expect(getMasteryRank(24999)).toBe(4);
  });
});

/* ═══════════════════════════════════════════════════════
   XP TO NEXT RANK
   ═══════════════════════════════════════════════════════ */

describe("getXpToNextRank", () => {
  it("returns correct progress for 0 XP", () => {
    const result = getXpToNextRank(0);
    expect(result.current).toBe(0);
    expect(result.next).toBe(100);
    expect(result.remaining).toBe(100);
    expect(result.progress).toBe(0);
  });

  it("returns correct progress for mid-rank XP", () => {
    const result = getXpToNextRank(50);
    expect(result.current).toBe(50);
    expect(result.next).toBe(100);
    expect(result.remaining).toBe(50);
    expect(result.progress).toBe(0.5);
  });

  it("returns correct progress at rank boundary", () => {
    const result = getXpToNextRank(100);
    expect(result.current).toBe(100);
    expect(result.next).toBe(500);
    expect(result.remaining).toBe(400);
    expect(result.progress).toBe(0);
  });

  it("returns full progress at max rank", () => {
    const result = getXpToNextRank(25000);
    expect(result.current).toBe(25000);
    expect(result.remaining).toBe(0);
    expect(result.progress).toBe(1);
  });

  it("returns full progress for XP above max", () => {
    const result = getXpToNextRank(50000);
    expect(result.current).toBe(50000);
    expect(result.remaining).toBe(0);
    expect(result.progress).toBe(1);
  });
});

/* ═══════════════════════════════════════════════════════
   PERK UNLOCKING
   ═══════════════════════════════════════════════════════ */

describe("getUnlockedPerks", () => {
  it("returns empty array for rank 0", () => {
    const perks = getUnlockedPerks("engineer", 0);
    expect(perks).toHaveLength(0);
  });

  it("returns 1 perk for rank 1", () => {
    const perks = getUnlockedPerks("engineer", 1);
    expect(perks).toHaveLength(1);
    expect(perks[0].key).toBe("eng_efficient_forge");
  });

  it("returns 3 perks for rank 3", () => {
    const perks = getUnlockedPerks("oracle", 3);
    expect(perks).toHaveLength(3);
    expect(perks.map(p => p.rank)).toEqual([1, 2, 3]);
  });

  it("returns all 5 perks for rank 5", () => {
    const perks = getUnlockedPerks("assassin", 5);
    expect(perks).toHaveLength(5);
    expect(perks[4].key).toBe("ass_phantom_strike");
  });

  it("returns correct perks for each class at max rank", () => {
    const classes: CharacterClass[] = ["engineer", "oracle", "assassin", "soldier", "spy"];
    for (const cls of classes) {
      const perks = getUnlockedPerks(cls, 5);
      expect(perks).toHaveLength(5);
      // Verify all ranks 1-5 are represented
      const ranks = perks.map(p => p.rank).sort();
      expect(ranks).toEqual([1, 2, 3, 4, 5]);
    }
  });
});

describe("getNextPerk", () => {
  it("returns rank 1 perk for rank 0", () => {
    const perk = getNextPerk("engineer", 0);
    expect(perk).not.toBeNull();
    expect(perk!.rank).toBe(1);
  });

  it("returns rank 2 perk for rank 1", () => {
    const perk = getNextPerk("oracle", 1);
    expect(perk).not.toBeNull();
    expect(perk!.rank).toBe(2);
  });

  it("returns null for max rank", () => {
    const perk = getNextPerk("soldier", 5);
    expect(perk).toBeNull();
  });
});

/* ═══════════════════════════════════════════════════════
   CLASS XP CALCULATION
   ═══════════════════════════════════════════════════════ */

describe("calculateClassXp", () => {
  it("returns base XP for non-aligned class", () => {
    // win_fight is aligned with soldier and assassin, not engineer
    const xp = calculateClassXp("win_fight", "engineer");
    expect(xp).toBe(10); // base XP, no bonus
  });

  it("returns 2x XP for aligned class", () => {
    // win_fight is aligned with soldier
    const xp = calculateClassXp("win_fight", "soldier");
    expect(xp).toBe(20); // 10 * 2
  });

  it("returns 2x XP for assassin on win_fight", () => {
    const xp = calculateClassXp("win_fight", "assassin");
    expect(xp).toBe(20); // 10 * 2
  });

  it("returns 0 for unknown action", () => {
    const xp = calculateClassXp("nonexistent_action", "engineer");
    expect(xp).toBe(0);
  });

  it("returns correct XP for craft_item as engineer (aligned)", () => {
    const xp = calculateClassXp("craft_item", "engineer");
    expect(xp).toBe(20); // 10 * 2
  });

  it("returns base XP for craft_item as soldier (not aligned)", () => {
    const xp = calculateClassXp("craft_item", "soldier");
    expect(xp).toBe(10); // base, no bonus
  });

  it("returns correct XP for win_chess as oracle (aligned)", () => {
    const xp = calculateClassXp("win_chess", "oracle");
    expect(xp).toBe(30); // 15 * 2
  });

  it("returns correct XP for guild_war_contribute as spy (aligned)", () => {
    const xp = calculateClassXp("guild_war_contribute", "spy");
    expect(xp).toBe(16); // 8 * 2
  });
});

/* ═══════════════════════════════════════════════════════
   PERK DEFINITIONS INTEGRITY
   ═══════════════════════════════════════════════════════ */

describe("CLASS_PERKS integrity", () => {
  const classes: CharacterClass[] = ["engineer", "oracle", "assassin", "soldier", "spy"];

  it("has exactly 5 classes defined", () => {
    expect(Object.keys(CLASS_PERKS)).toHaveLength(5);
  });

  it("each class has exactly 5 perks", () => {
    for (const cls of classes) {
      expect(CLASS_PERKS[cls]).toHaveLength(5);
    }
  });

  it("each class has perks for ranks 1-5", () => {
    for (const cls of classes) {
      const ranks = CLASS_PERKS[cls].map(p => p.rank).sort();
      expect(ranks).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it("all perk keys are unique", () => {
    const allKeys = classes.flatMap(cls => CLASS_PERKS[cls].map(p => p.key));
    const uniqueKeys = new Set(allKeys);
    expect(uniqueKeys.size).toBe(allKeys.length);
  });

  it("all perks have required fields", () => {
    for (const cls of classes) {
      for (const perk of CLASS_PERKS[cls]) {
        expect(perk.key).toBeTruthy();
        expect(perk.name).toBeTruthy();
        expect(perk.description).toBeTruthy();
        expect(perk.rank).toBeGreaterThanOrEqual(1);
        expect(perk.rank).toBeLessThanOrEqual(5);
        expect(perk.effect).toBeDefined();
        expect(["multiplier", "flat", "unlock", "passive"]).toContain(perk.effect.type);
        expect(perk.effect.target).toBeTruthy();
        expect(typeof perk.effect.value).toBe("number");
      }
    }
  });
});

/* ═══════════════════════════════════════════════════════
   MASTERY RANKS INTEGRITY
   ═══════════════════════════════════════════════════════ */

describe("MASTERY_RANKS integrity", () => {
  it("has exactly 6 ranks (0-5)", () => {
    expect(MASTERY_RANKS).toHaveLength(6);
  });

  it("ranks are in ascending order", () => {
    for (let i = 1; i < MASTERY_RANKS.length; i++) {
      expect(MASTERY_RANKS[i].xpRequired).toBeGreaterThan(MASTERY_RANKS[i - 1].xpRequired);
    }
  });

  it("rank 0 requires 0 XP", () => {
    expect(MASTERY_RANKS[0].xpRequired).toBe(0);
  });

  it("all ranks have titles and colors", () => {
    for (const rank of MASTERY_RANKS) {
      expect(rank.title).toBeTruthy();
      expect(rank.color).toBeTruthy();
      expect(rank.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   XP ACTIONS INTEGRITY
   ═══════════════════════════════════════════════════════ */

describe("CLASS_XP_ACTIONS integrity", () => {
  it("has at least 15 actions defined", () => {
    expect(CLASS_XP_ACTIONS.length).toBeGreaterThanOrEqual(15);
  });

  it("all actions have unique names", () => {
    const actions = CLASS_XP_ACTIONS.map(a => a.action);
    const unique = new Set(actions);
    expect(unique.size).toBe(actions.length);
  });

  it("all actions have positive base XP", () => {
    for (const action of CLASS_XP_ACTIONS) {
      expect(action.baseXp).toBeGreaterThan(0);
    }
  });

  it("all actions have at least one aligned class", () => {
    for (const action of CLASS_XP_ACTIONS) {
      expect(action.alignedClasses.length).toBeGreaterThan(0);
    }
  });

  it("all aligned classes are valid CharacterClass values", () => {
    const validClasses = ["spy", "oracle", "assassin", "engineer", "soldier"];
    for (const action of CLASS_XP_ACTIONS) {
      for (const cls of action.alignedClasses) {
        expect(validClasses).toContain(cls);
      }
    }
  });

  it("every class has at least 2 aligned actions", () => {
    const classes: CharacterClass[] = ["engineer", "oracle", "assassin", "soldier", "spy"];
    for (const cls of classes) {
      const aligned = CLASS_XP_ACTIONS.filter(a => a.alignedClasses.includes(cls));
      expect(aligned.length).toBeGreaterThanOrEqual(2);
    }
  });
});
