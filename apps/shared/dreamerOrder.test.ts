import { describe, expect, it } from "vitest";

import {
  DREAMER_DOLLARS_PER_LEVEL,
  DREAMER_MAIN_TIER_LEVELS,
  DREAMER_MAX_LEVEL,
  DREAMER_PROGRESS_BADGES,
  DREAMER_PROGRESS_BADGE_LEVELS,
  DREAMER_TIERS,
  calculateLevelFromTotalUsd,
  createEmptyDreamerProfile,
  getDreamerBadge,
  getDreamerTier,
  getDreamerTierByLevel,
  getMythicInscriptionPrompt,
  nextTierLevel,
  trophiesNewlyCrossed,
} from "./dreamerOrder";

describe("ladder invariants", () => {
  it("declares exactly 10 main tiers aligned to the main-level array", () => {
    expect(DREAMER_TIERS.length).toBe(DREAMER_MAIN_TIER_LEVELS.length);
    expect(DREAMER_TIERS.length).toBe(10);
    for (let i = 0; i < DREAMER_TIERS.length; i++) {
      expect(DREAMER_TIERS[i].unlocksAtLevel).toBe(DREAMER_MAIN_TIER_LEVELS[i]);
    }
  });

  it("declares exactly 5 progress badges aligned to the badge-level array", () => {
    expect(DREAMER_PROGRESS_BADGES.length).toBe(
      DREAMER_PROGRESS_BADGE_LEVELS.length,
    );
    expect(DREAMER_PROGRESS_BADGES.length).toBe(5);
    for (let i = 0; i < DREAMER_PROGRESS_BADGES.length; i++) {
      expect(DREAMER_PROGRESS_BADGES[i].level).toBe(
        DREAMER_PROGRESS_BADGE_LEVELS[i],
      );
    }
  });

  it("marks only the final tier as the one-of-one mythic", () => {
    const mythics = DREAMER_TIERS.filter((t) => t.isMythicOneOfOne);
    expect(mythics.length).toBe(1);
    expect(mythics[0].unlocksAtLevel).toBe(100);
  });

  it("produces unique trophy and badge ids across the catalog", () => {
    const trophyIds = DREAMER_TIERS.map((t) => t.trophyId);
    expect(new Set(trophyIds).size).toBe(trophyIds.length);
    const badgeIds = DREAMER_PROGRESS_BADGES.map((b) => b.badgeId);
    expect(new Set(badgeIds).size).toBe(badgeIds.length);
  });
});

describe("calculateLevelFromTotalUsd", () => {
  it("returns 0 for zero or negative donation totals", () => {
    expect(calculateLevelFromTotalUsd(0)).toBe(0);
    expect(calculateLevelFromTotalUsd(-100)).toBe(0);
  });

  it("floors to an integer level at $100-per-level", () => {
    expect(calculateLevelFromTotalUsd(DREAMER_DOLLARS_PER_LEVEL)).toBe(1);
    expect(calculateLevelFromTotalUsd(999)).toBe(9);
    expect(calculateLevelFromTotalUsd(1000)).toBe(10);
  });

  it("clamps at DREAMER_MAX_LEVEL", () => {
    expect(calculateLevelFromTotalUsd(10_000)).toBe(DREAMER_MAX_LEVEL);
    expect(calculateLevelFromTotalUsd(50_000)).toBe(DREAMER_MAX_LEVEL);
  });
});

describe("trophiesNewlyCrossed", () => {
  it("returns the first-tier trophy id when crossing 9 → 10", () => {
    const { trophies, badges } = trophiesNewlyCrossed(9, 10);
    expect(trophies).toEqual(["dreamer-tier-1-quill"]);
    expect(badges).toEqual([]);
  });

  it("fires all 5 progress badges at their exact levels in a 0 → 100 climb", () => {
    const { badges, trophies } = trophiesNewlyCrossed(0, 100);
    expect(badges.length).toBe(5);
    expect(trophies.length).toBe(10);
  });

  it("fires the level-1 badge as the very first reward", () => {
    const { badges } = trophiesNewlyCrossed(0, 1);
    expect(badges).toEqual(["dreamer-badge-first-light"]);
  });

  it("fires the level-5 badge exactly when level reaches 5", () => {
    const { badges: at4 } = trophiesNewlyCrossed(3, 4);
    expect(at4).toEqual([]);
    const { badges: at5 } = trophiesNewlyCrossed(4, 5);
    expect(at5).toEqual(["dreamer-badge-kindling"]);
  });

  it("returns nothing when the level did not increase", () => {
    const { trophies, badges } = trophiesNewlyCrossed(42, 42);
    expect(trophies).toEqual([]);
    expect(badges).toEqual([]);
  });

  it("clamps negative or over-max levels before computing", () => {
    const { trophies: t1, badges: b1 } = trophiesNewlyCrossed(-5, 1);
    expect(b1).toEqual(["dreamer-badge-first-light"]);
    expect(t1).toEqual([]);

    const { trophies: t2 } = trophiesNewlyCrossed(95, 500);
    expect(t2).toEqual(["dreamer-tier-10-mythic"]);
  });
});

describe("getMythicInscriptionPrompt", () => {
  it("includes the engraved name in the prompt body", () => {
    const prompt = getMythicInscriptionPrompt("Ada Lovelace");
    expect(prompt).toContain("Ada Lovelace");
  });

  it("strips embedded double quotes to avoid breaking CSV pipelines", () => {
    const prompt = getMythicInscriptionPrompt('"The" Host');
    expect(prompt).not.toContain('"The"');
    expect(prompt).toContain("'The' Host");
  });
});

describe("lookup helpers", () => {
  it("getDreamerTier resolves by trophy id", () => {
    expect(getDreamerTier("dreamer-tier-3-orrery")?.tierNumber).toBe(3);
    expect(getDreamerTier("nope")).toBeUndefined();
  });

  it("getDreamerTierByLevel resolves by unlock level", () => {
    expect(getDreamerTierByLevel(60)?.trophyName).toBe(
      "Anvil of Unmade Futures",
    );
    expect(getDreamerTierByLevel(47)).toBeUndefined();
  });

  it("getDreamerBadge resolves by badge id", () => {
    expect(getDreamerBadge("dreamer-badge-half-moon")?.level).toBe(50);
  });

  it("nextTierLevel returns the next main-level threshold or null at cap", () => {
    expect(nextTierLevel(0)).toBe(10);
    expect(nextTierLevel(10)).toBe(20);
    expect(nextTierLevel(95)).toBe(100);
    expect(nextTierLevel(100)).toBeNull();
  });
});

describe("createEmptyDreamerProfile", () => {
  it("produces a zeroed profile tied to a citizen id", () => {
    const profile = createEmptyDreamerProfile("citizen-7");
    expect(profile.citizenId).toBe("citizen-7");
    expect(profile.currentLevel).toBe(0);
    expect(profile.totalLcifDonatedUsd).toBe(0);
    expect(profile.unlockedTrophyIds).toEqual([]);
    expect(profile.unlockedBadgeIds).toEqual([]);
    expect(profile.mythicEngraving).toBeUndefined();
  });
});
