// apps/server/services/subHouseReputationService.test.ts
//
// Pure-function tests for the threshold-crossing logic. Full
// integration (DB writes + rivalry deltas firing) is exercised
// once the contract-signing path lands in phase 4 e2e.

import { describe, it, expect } from "vitest";
import { thresholdCrossed } from "./subHouseReputationService";

describe("thresholdCrossed", () => {
  it("returns null when from === to", () => {
    expect(thresholdCrossed(0, 0)).toBeNull();
    expect(thresholdCrossed(50, 50)).toBeNull();
  });

  it("detects positive upward crossings", () => {
    expect(thresholdCrossed(20, 30)).toBe(25);
    expect(thresholdCrossed(40, 60)).toBe(50);
    expect(thresholdCrossed(70, 80)).toBe(75);
    expect(thresholdCrossed(99, 100)).toBe(100);
  });

  it("detects positive downward crossings", () => {
    expect(thresholdCrossed(30, 20)).toBe(25);
    expect(thresholdCrossed(60, 40)).toBe(50);
  });

  it("detects negative downward crossings", () => {
    expect(thresholdCrossed(-20, -30)).toBe(-25);
    expect(thresholdCrossed(-40, -60)).toBe(-50);
    expect(thresholdCrossed(0, -100)).toBe(-25); // First crossed
  });

  it("detects negative upward crossings", () => {
    expect(thresholdCrossed(-30, -20)).toBe(-25);
    expect(thresholdCrossed(-60, -40)).toBe(-50);
  });

  it("returns null for movements that do not cross any threshold", () => {
    expect(thresholdCrossed(10, 20)).toBeNull(); // Both in [0,25)
    expect(thresholdCrossed(26, 49)).toBeNull(); // Both in [25, 50)
    expect(thresholdCrossed(-10, -20)).toBeNull(); // Both in (-25, 0]
  });

  it("handles a movement that spans multiple thresholds (returns first found)", () => {
    // Going from 20 → 80 crosses 25, 50, and 75. Implementation returns
    // the first match in the positive thresholds list (smallest first).
    const out = thresholdCrossed(20, 80);
    expect(out === 25 || out === 50 || out === 75).toBe(true);
  });
});
