import { describe, it, expect } from "vitest";
import {
  NEUTRAL_MODIFIERS,
  computeMinigameModifiers,
} from "./worldMinigameModifiers";

describe("computeMinigameModifiers", () => {
  it("returns neutral output for an empty pressure snapshot", () => {
    expect(computeMinigameModifiers({})).toEqual(NEUTRAL_MODIFIERS);
  });

  it("light cycle inflates defensive bonuses", () => {
    const m = computeMinigameModifiers({ cycleNet: 50 });
    expect(m.cardGeneralHp).toBeGreaterThan(1);
    expect(m.towerDamageBonus).toBeGreaterThan(1);
    expect(m.cardStartingHandBonus).toBe(0);
  });

  it("dark cycle (≤ -50) grants the aggressive +1 hand size", () => {
    expect(computeMinigameModifiers({ cycleNet: -50 }).cardStartingHandBonus).toBe(1);
    expect(computeMinigameModifiers({ cycleNet: -100 }).cardStartingHandBonus).toBe(1);
    expect(computeMinigameModifiers({ cycleNet: -49 }).cardStartingHandBonus).toBe(0);
  });

  it("deaths drive chess climb harder, truth makes it easier", () => {
    expect(computeMinigameModifiers({ deaths: 50 }).chessClimbDifficultyDelta).toBeGreaterThan(0);
    expect(computeMinigameModifiers({ truthRevealed: 50 }).chessClimbDifficultyDelta).toBeLessThan(0);
  });

  it("exploration translates linearly into daily-credits bonus", () => {
    expect(computeMinigameModifiers({ exploration: 0 }).tradeDailyCreditsBonus).toBe(0);
    expect(computeMinigameModifiers({ exploration: 10 }).tradeDailyCreditsBonus).toBe(20);
  });

  it("drivenBy reports the dominant dimension", () => {
    expect(computeMinigameModifiers({ cycleNet: 100 }).drivenBy).toBe("light_energy");
    expect(computeMinigameModifiers({ cycleNet: -100 }).drivenBy).toBe("dark_energy");
    expect(computeMinigameModifiers({ deaths: 200 }).drivenBy).toBe("deaths");
    expect(computeMinigameModifiers({}).drivenBy).toBe("neutral");
  });

  it("clamps card HP to a sensible range even at extreme cycle values", () => {
    const lo = computeMinigameModifiers({ cycleNet: -10000 });
    const hi = computeMinigameModifiers({ cycleNet: 10000 });
    expect(lo.cardGeneralHp).toBeGreaterThanOrEqual(0.85);
    expect(hi.cardGeneralHp).toBeLessThanOrEqual(1.15);
  });
});
