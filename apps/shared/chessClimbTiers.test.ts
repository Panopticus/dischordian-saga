import { describe, it, expect } from "vitest";
import {
  CHESS_CLIMB_TIERS,
  CHESS_CLIMB_TIER_LIST,
  getUnlockedClimbTiers,
  isClimbTierUnlocked,
  evaluateClimbSeries,
} from "./chessClimbTiers";

describe("chessClimbTiers — static data", () => {
  it("has four tiers ordered 0..3 by rank", () => {
    expect(CHESS_CLIMB_TIER_LIST).toHaveLength(4);
    CHESS_CLIMB_TIER_LIST.forEach((tier, i) => {
      expect(tier.rank).toBe(i);
    });
  });

  it("Tier 3 (Labyrinth Wager) does not unlock further tiers", () => {
    expect(CHESS_CLIMB_TIERS.tier_3_labyrinth_wager.unlocksNextTier).toBe(false);
  });

  it("Tier 0 has no stakes and no rewards", () => {
    const t0 = CHESS_CLIMB_TIERS.tier_0_exhibition;
    expect(t0.lossStakes).toEqual(["none"]);
    expect(t0.winRewards).toEqual(["none"]);
  });

  it("higher tiers escalate AI difficulty", () => {
    const ranks = CHESS_CLIMB_TIER_LIST.map((t) => t.aiDifficulty);
    // Difficulty is monotonically non-decreasing.
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1]);
    }
  });
});

describe("chessClimbTiers.getUnlockedClimbTiers", () => {
  it("grants Tier 0 by default", () => {
    const tiers = getUnlockedClimbTiers({
      highestClearedRank: -1,
      princesGameCompleted: false,
    });
    expect(tiers.map((t) => t.id)).toEqual(["tier_0_exhibition"]);
  });

  it("unlocks Tier 1 after clearing Tier 0", () => {
    const tiers = getUnlockedClimbTiers({
      highestClearedRank: 0,
      princesGameCompleted: false,
    });
    expect(tiers.map((t) => t.id)).toEqual([
      "tier_0_exhibition",
      "tier_1_wagered",
    ]);
  });

  it("unlocks Tier 2 after clearing Tier 1", () => {
    const tiers = getUnlockedClimbTiers({
      highestClearedRank: 1,
      princesGameCompleted: false,
    });
    expect(tiers.map((t) => t.id)).toContain("tier_2_hierarchy_table");
    expect(tiers.map((t) => t.id)).not.toContain("tier_3_labyrinth_wager");
  });

  it("Tier 3 requires BOTH clearing Tier 2 AND completing the Prince's Game", () => {
    const withoutPrince = getUnlockedClimbTiers({
      highestClearedRank: 2,
      princesGameCompleted: false,
    });
    expect(withoutPrince.map((t) => t.id)).not.toContain(
      "tier_3_labyrinth_wager",
    );

    const withPrince = getUnlockedClimbTiers({
      highestClearedRank: 2,
      princesGameCompleted: true,
    });
    expect(withPrince.map((t) => t.id)).toContain("tier_3_labyrinth_wager");
  });

  it("never unlocks out-of-order tiers", () => {
    // Player at rank 0 cannot skip to tier 2.
    const tiers = getUnlockedClimbTiers({
      highestClearedRank: 0,
      princesGameCompleted: true,
    });
    expect(tiers.map((t) => t.id)).not.toContain("tier_2_hierarchy_table");
  });
});

describe("chessClimbTiers.isClimbTierUnlocked", () => {
  it("matches getUnlockedClimbTiers", () => {
    expect(
      isClimbTierUnlocked("tier_2_hierarchy_table", {
        highestClearedRank: 1,
        princesGameCompleted: false,
      }),
    ).toBe(true);
    expect(
      isClimbTierUnlocked("tier_3_labyrinth_wager", {
        highestClearedRank: 1,
        princesGameCompleted: true,
      }),
    ).toBe(false);
  });
});

describe("chessClimbTiers.evaluateClimbSeries", () => {
  it("is ongoing at 0-0", () => {
    expect(evaluateClimbSeries([])).toBe("ongoing");
  });

  it("is ongoing at 1-0", () => {
    expect(evaluateClimbSeries(["win"])).toBe("ongoing");
  });

  it("is won at 2-0", () => {
    expect(evaluateClimbSeries(["win", "win"])).toBe("won");
  });

  it("is won at 2-1", () => {
    expect(evaluateClimbSeries(["win", "loss", "win"])).toBe("won");
  });

  it("is lost at 0-2", () => {
    expect(evaluateClimbSeries(["loss", "loss"])).toBe("lost");
  });

  it("is ongoing at 1-1", () => {
    expect(evaluateClimbSeries(["win", "loss"])).toBe("ongoing");
  });

  it("draws count as half-points and do not end the series", () => {
    // Two draws each side = 1-1, still ongoing.
    expect(evaluateClimbSeries(["draw", "draw"])).toBe("ongoing");
    // Three draws = 1.5-1.5, still ongoing (need 2 full wins).
    expect(evaluateClimbSeries(["draw", "draw", "draw"])).toBe("ongoing");
  });
});
