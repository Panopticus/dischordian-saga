/**
 * Pure ELO math (#7).
 *
 * Behavioural tests for the pvpElo module. Both server (writes new
 * ratings on match end) and client (renders projected MMR shifts on
 * the matchmaking screen) consume these helpers, so the contracts
 * below are the load-bearing ones.
 *
 * Key properties locked in:
 *   - Symmetric expected scores (E(a,b) + E(b,a) = 1).
 *   - Equal MMRs against equal MMRs gain/lose the same amount.
 *   - Beating a stronger opponent gains more than beating an equal
 *     one (and vice versa for losing).
 *   - K-factor is 32 for new accounts (< 30 matches), 16 for
 *     established.
 *   - Rank tier table covers the full MMR range.
 */
import { describe, it, expect } from "vitest";
import {
  STARTING_MMR,
  K_FACTOR_NEW,
  K_FACTOR_ESTABLISHED,
  NEW_PLAYER_MATCH_THRESHOLD,
  SEASON_RANK_TIERS,
  computeMatchOutcome,
  computeMmrDelta,
  expectedScore,
  kFactorFor,
  rankTierForMmr,
} from "./pvpElo";

describe("expectedScore", () => {
  it("returns 0.5 for equal MMRs", () => {
    expect(expectedScore(1500, 1500)).toBeCloseTo(0.5, 4);
  });

  it("is symmetric: E(a,b) + E(b,a) = 1", () => {
    for (const [a, b] of [
      [1000, 1500],
      [1200, 1800],
      [2000, 1300],
    ]) {
      expect(expectedScore(a, b) + expectedScore(b, a)).toBeCloseTo(1, 6);
    }
  });

  it("favors the higher-rated player", () => {
    expect(expectedScore(1700, 1500)).toBeGreaterThan(0.5);
    expect(expectedScore(1300, 1500)).toBeLessThan(0.5);
  });

  it("400-point gap maps to ~0.91 expected for the higher-rated", () => {
    // The classic ELO calibration point: 400 MMR = ~10x more
    // likely to win. 1 / (1 + 10^(-1)) = 0.909...
    expect(expectedScore(1500, 1100)).toBeCloseTo(0.909, 2);
  });
});

describe("kFactorFor", () => {
  it("returns K_FACTOR_NEW for new accounts (< 30 matches)", () => {
    expect(kFactorFor(0)).toBe(K_FACTOR_NEW);
    expect(kFactorFor(NEW_PLAYER_MATCH_THRESHOLD - 1)).toBe(K_FACTOR_NEW);
  });

  it("returns K_FACTOR_ESTABLISHED at the threshold and above", () => {
    expect(kFactorFor(NEW_PLAYER_MATCH_THRESHOLD)).toBe(K_FACTOR_ESTABLISHED);
    expect(kFactorFor(500)).toBe(K_FACTOR_ESTABLISHED);
  });

  it("K_FACTOR_NEW > K_FACTOR_ESTABLISHED (faster convergence for new)", () => {
    expect(K_FACTOR_NEW).toBeGreaterThan(K_FACTOR_ESTABLISHED);
  });
});

describe("computeMmrDelta", () => {
  it("equal-MMR win at K=16 yields +8", () => {
    expect(
      computeMmrDelta({
        myMmr: 1500,
        oppMmr: 1500,
        didWin: true,
        k: K_FACTOR_ESTABLISHED,
      }),
    ).toBe(8);
  });

  it("equal-MMR loss at K=16 yields -8", () => {
    expect(
      computeMmrDelta({
        myMmr: 1500,
        oppMmr: 1500,
        didWin: false,
        k: K_FACTOR_ESTABLISHED,
      }),
    ).toBe(-8);
  });

  it("beating a +400 opponent yields more than beating an equal one", () => {
    const easyWin = computeMmrDelta({
      myMmr: 1500,
      oppMmr: 1500,
      didWin: true,
      k: K_FACTOR_ESTABLISHED,
    });
    const hardWin = computeMmrDelta({
      myMmr: 1500,
      oppMmr: 1900,
      didWin: true,
      k: K_FACTOR_ESTABLISHED,
    });
    expect(hardWin).toBeGreaterThan(easyWin);
  });

  it("losing to a -400 opponent costs more than losing to an equal one", () => {
    const expectedLoss = computeMmrDelta({
      myMmr: 1500,
      oppMmr: 1500,
      didWin: false,
      k: K_FACTOR_ESTABLISHED,
    });
    const upsetLoss = computeMmrDelta({
      myMmr: 1500,
      oppMmr: 1100,
      didWin: false,
      k: K_FACTOR_ESTABLISHED,
    });
    expect(upsetLoss).toBeLessThan(expectedLoss); // more negative
  });

  it("K=32 (new player) doubles the absolute delta vs K=16", () => {
    const newK = computeMmrDelta({
      myMmr: 1500,
      oppMmr: 1500,
      didWin: true,
      k: K_FACTOR_NEW,
    });
    const oldK = computeMmrDelta({
      myMmr: 1500,
      oppMmr: 1500,
      didWin: true,
      k: K_FACTOR_ESTABLISHED,
    });
    expect(newK).toBe(oldK * 2);
  });
});

describe("rankTierForMmr", () => {
  it("STARTING_MMR maps to the Silver tier (1100..1299)", () => {
    expect(STARTING_MMR).toBe(1200);
    expect(rankTierForMmr(STARTING_MMR).name).toBe("Silver");
  });

  it("Bronze for very low MMR", () => {
    expect(rankTierForMmr(0).name).toBe("Bronze");
    expect(rankTierForMmr(800).name).toBe("Bronze");
    expect(rankTierForMmr(1099).name).toBe("Bronze");
  });

  it("crosses tier boundaries cleanly", () => {
    expect(rankTierForMmr(1099).name).toBe("Bronze");
    expect(rankTierForMmr(1100).name).toBe("Silver");
    expect(rankTierForMmr(1299).name).toBe("Silver");
    expect(rankTierForMmr(1300).name).toBe("Gold");
    expect(rankTierForMmr(1500).name).toBe("Platinum");
    expect(rankTierForMmr(1700).name).toBe("Diamond");
    expect(rankTierForMmr(1900).name).toBe("Master");
    expect(rankTierForMmr(2100).name).toBe("Grandmaster");
  });

  it("returns Grandmaster (the open-ended top tier) for any MMR ≥ 2100", () => {
    expect(rankTierForMmr(2100).name).toBe("Grandmaster");
    expect(rankTierForMmr(99999).name).toBe("Grandmaster");
  });

  it("tiers are declared in ascending order with no gaps", () => {
    let prev = -1;
    for (const tier of SEASON_RANK_TIERS) {
      expect(tier.minMmr).toBeGreaterThan(prev);
      prev = tier.minMmr;
    }
  });

  it("tier numbers are sequential 0..N", () => {
    SEASON_RANK_TIERS.forEach((t, i) => {
      expect(t.tier).toBe(i);
    });
  });
});

describe("computeMatchOutcome", () => {
  it("preserves zero-sum at equal MMR (winnerDelta == -loserDelta)", () => {
    const out = computeMatchOutcome({
      winnerMmr: 1500,
      winnerMatchesPlayed: 100,
      loserMmr: 1500,
      loserMatchesPlayed: 100,
    });
    expect(out.winnerDelta).toBe(-out.loserDelta);
  });

  it("clamps loser MMR at the floor (default 0) — equal-MMR upset against a low-MMR pair", () => {
    // Equal MMR yields ~-8 delta on K=16. Pre-floor result would be
    // 5 - 8 = -3; the floor clamps at 0, so the post-floor delta is
    // just -5 (5 → 0).
    const out = computeMatchOutcome({
      winnerMmr: 5,
      winnerMatchesPlayed: 100,
      loserMmr: 5,
      loserMatchesPlayed: 100,
    });
    expect(out.loserNewMmr).toBe(0);
    expect(out.loserDelta).toBe(-5);
  });

  it("derives the correct tier for both winner and loser", () => {
    const out = computeMatchOutcome({
      winnerMmr: 1295, // about to cross into Gold
      winnerMatchesPlayed: 100,
      loserMmr: 1500,
      loserMatchesPlayed: 100,
    });
    // Winner gained MMR; check the tier reflects the new value.
    expect(out.winnerNewTier.name).toBe(rankTierForMmr(out.winnerNewMmr).name);
    expect(out.loserNewTier.name).toBe(rankTierForMmr(out.loserNewMmr).name);
  });

  it("uses the per-player K-factor (new vs established asymmetric match)", () => {
    // New-account winner against established loser: winner moves
    // by ~32 points scaled, loser moves by ~16 points scaled.
    const out = computeMatchOutcome({
      winnerMmr: 1500,
      winnerMatchesPlayed: 0, // new
      loserMmr: 1500,
      loserMatchesPlayed: 200, // established
    });
    expect(Math.abs(out.winnerDelta)).toBeGreaterThan(Math.abs(out.loserDelta));
  });

  it("respects an explicit floor (custom minimum MMR)", () => {
    const out = computeMatchOutcome({
      winnerMmr: 1500,
      winnerMatchesPlayed: 100,
      loserMmr: 1100,
      loserMatchesPlayed: 100,
      floor: 1100,
    });
    expect(out.loserNewMmr).toBe(1100);
    expect(out.loserDelta).toBe(0);
  });
});
