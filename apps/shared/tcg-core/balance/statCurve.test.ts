import { describe, expect, it } from "vitest";
import {
  STAT_CURVE,
  KEYWORD_TAX,
  getExpectedStats,
  getToleranceForCost,
  getStatEfficiency,
  avgKeywords,
} from "./statCurve";

describe("STAT_CURVE invariants", () => {
  it("expectedTotalStats grows monotonically with cost", () => {
    for (let i = 1; i < STAT_CURVE.length; i++) {
      expect(STAT_CURVE[i]!.expectedTotalStats).toBeGreaterThanOrEqual(
        STAT_CURVE[i - 1]!.expectedTotalStats,
      );
    }
  });

  it("tolerance is in (0, 1) for every entry", () => {
    for (const point of STAT_CURVE) {
      expect(point.tolerance).toBeGreaterThan(0);
      expect(point.tolerance).toBeLessThan(1);
    }
  });
});

describe("getExpectedStats", () => {
  it("returns the curve value at known cost", () => {
    expect(getExpectedStats(3, 0)).toBe(7);
    expect(getExpectedStats(5, 0)).toBe(11);
  });

  it("applies KEYWORD_TAX (currently 0)", () => {
    expect(getExpectedStats(3, 2)).toBe(7 - 2 * KEYWORD_TAX);
  });

  it("falls back to a heuristic for off-curve cost", () => {
    expect(getExpectedStats(99, 0)).toBe(99 * 2 + 1);
  });
});

describe("getToleranceForCost", () => {
  it("returns the curve tolerance at known cost", () => {
    expect(getToleranceForCost(3)).toBe(0.20);
    expect(getToleranceForCost(8)).toBe(0.30);
  });

  it("falls back to 0.15 for off-curve cost", () => {
    expect(getToleranceForCost(99)).toBe(0.15);
  });
});

describe("getStatEfficiency (audit/16 PR 14 TCG5)", () => {
  it("ratio = 1.0 for on-curve stats", () => {
    const result = getStatEfficiency(3, 7, 0);
    expect(result.ratio).toBe(1.0);
    expect(result.bucket).toBe("within");
  });

  it("ratio > 1 for above-curve stats", () => {
    const result = getStatEfficiency(3, 10, 0);
    expect(result.ratio).toBeGreaterThan(1);
    expect(result.bucket).toBe("above");
  });

  it("ratio < 1 for below-curve stats", () => {
    const result = getStatEfficiency(3, 4, 0);
    expect(result.ratio).toBeLessThan(1);
    expect(result.bucket).toBe("below");
  });

  it("respects per-cost tolerance for the within bucket", () => {
    // Cost 3 has tolerance 0.20; ratio 0.85 is still within.
    const expected = getExpectedStats(3, 0);
    const totalStats = Math.round(expected * 0.85);
    const result = getStatEfficiency(3, totalStats, 0);
    expect(result.bucket).toBe("within");
  });

  it("label is a percentage", () => {
    const result = getStatEfficiency(3, 7, 0);
    expect(result.label).toMatch(/^\d+% of curve$/);
  });

  it("expectedStats reflects the curve", () => {
    const result = getStatEfficiency(5, 11, 0);
    expect(result.expectedStats).toBe(11);
  });

  it("clamps zero-expected to 1 to avoid Infinity ratios", () => {
    // cost 0 with KEYWORD_TAX=0 expects 1; not currently zero,
    // but verify the defence by passing wildly off-curve cost.
    const result = getStatEfficiency(0, 5, 0);
    expect(Number.isFinite(result.ratio)).toBe(true);
  });
});

describe("avgKeywords (audit/16 PR 14 TCG1)", () => {
  it("returns 0 for an empty deck", () => {
    expect(avgKeywords([])).toBe(0);
  });

  it("computes the mean keyword count", () => {
    const deck = [
      { keywords: ["rush"] },
      { keywords: ["provoke", "lifesteal"] },
      { keywords: [] },
      { keywords: ["rush", "shielded", "ranged"] },
    ];
    // (1 + 2 + 0 + 3) / 4 = 1.5
    expect(avgKeywords(deck)).toBe(1.5);
  });

  it("treats missing keywords as 0", () => {
    const deck = [{}, {}, { keywords: ["rush"] }];
    // (0 + 0 + 1) / 3 = 0.333…
    expect(avgKeywords(deck)).toBeCloseTo(1 / 3, 6);
  });

  it("handles a single-card deck", () => {
    expect(avgKeywords([{ keywords: ["rush", "ranged"] }])).toBe(2);
  });
});
