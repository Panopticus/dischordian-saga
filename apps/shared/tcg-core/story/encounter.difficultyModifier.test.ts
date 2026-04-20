import { describe, expect, it } from "vitest";
import { computeBossDifficultyBonuses } from "./encounter";

/**
 * Step 7 contract: the hidden difficulty scalar (sourced from
 * dreamBalance.difficultyModifier) is translated into the safe,
 * clamped startingBonuses the tcg-core engine already supports.
 * These tests lock the formula so callers (encounter runner, future
 * event handlers) agree on what a "point" of difficulty costs the
 * player.
 */
describe("computeBossDifficultyBonuses", () => {
  it("returns zeros for 0 points", () => {
    expect(computeBossDifficultyBonuses(0)).toEqual({
      extraGeneralHp: 0,
      extraCards: 0,
    });
  });

  it("gives +1 HP per point below the cap", () => {
    for (let dm = 1; dm <= 10; dm++) {
      expect(computeBossDifficultyBonuses(dm).extraGeneralHp).toBe(dm);
    }
  });

  it("caps extra HP at +10 (engine clamp)", () => {
    for (const dm of [11, 25, 100]) {
      expect(computeBossDifficultyBonuses(dm).extraGeneralHp).toBe(10);
    }
  });

  it("gives +1 starting card per 3 points, capped at +2", () => {
    expect(computeBossDifficultyBonuses(0).extraCards).toBe(0);
    expect(computeBossDifficultyBonuses(1).extraCards).toBe(0);
    expect(computeBossDifficultyBonuses(2).extraCards).toBe(0);
    expect(computeBossDifficultyBonuses(3).extraCards).toBe(1);
    expect(computeBossDifficultyBonuses(5).extraCards).toBe(1);
    expect(computeBossDifficultyBonuses(6).extraCards).toBe(2);
    expect(computeBossDifficultyBonuses(100).extraCards).toBe(2);
  });

  it("clamps negative and NaN inputs defensively to zero", () => {
    expect(computeBossDifficultyBonuses(-1)).toEqual({
      extraGeneralHp: 0,
      extraCards: 0,
    });
    expect(computeBossDifficultyBonuses(Number.NaN)).toEqual({
      extraGeneralHp: 0,
      extraCards: 0,
    });
  });

  it("floors fractional inputs (no off-by-half exploits)", () => {
    expect(computeBossDifficultyBonuses(2.9)).toEqual({
      extraGeneralHp: 2,
      extraCards: 0,
    });
  });
});
