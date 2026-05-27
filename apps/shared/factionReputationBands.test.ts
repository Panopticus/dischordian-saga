import { describe, it, expect } from "vitest";
import {
  REP_BAND_BOUND,
  REP_BAND_IDS,
  clampReputation,
  getReputationBand,
  getReputationBandProgress,
  combineRepDeltas,
  applyFactionDeltaMap,
} from "./factionReputationBands";

// The matching server-side test
// `apps/server/services/factionReputationService.test.ts`
// asserts that REP_BOUND equals REP_BAND_BOUND so the bounded
// math layer and the band classifier can never drift. This
// file stays in the pure-shared tier and does not import the
// server module.
describe("REP_BAND_BOUND value", () => {
  it("is the canonical 1000-point clamp", () => {
    expect(REP_BAND_BOUND).toBe(1000);
  });
});

describe("REP_BAND_IDS shape", () => {
  it("declares the five canonical bands in ascending order", () => {
    expect(REP_BAND_IDS).toEqual([
      "hostile",
      "wary",
      "neutral",
      "allied",
      "sworn",
    ]);
  });
});

describe("clampReputation", () => {
  it("passes through in-range values", () => {
    expect(clampReputation(0)).toBe(0);
    expect(clampReputation(500)).toBe(500);
    expect(clampReputation(-1000)).toBe(-1000);
  });
  it("clamps out-of-range values to the bound", () => {
    expect(clampReputation(50_000)).toBe(REP_BAND_BOUND);
    expect(clampReputation(-50_000)).toBe(-REP_BAND_BOUND);
  });
  it("truncates fractions and rejects NaN / Infinity", () => {
    expect(clampReputation(123.9)).toBe(123);
    expect(clampReputation(-0.7)).toBe(0);
    expect(clampReputation(NaN)).toBe(0);
    expect(clampReputation(Infinity)).toBe(0);
  });
});

describe("getReputationBand boundaries", () => {
  it("0 is neutral (symmetric default)", () => {
    expect(getReputationBand(0)).toBe("neutral");
  });
  it("classifies inclusive band floors", () => {
    expect(getReputationBand(-1000)).toBe("hostile");
    expect(getReputationBand(-601)).toBe("hostile");
    expect(getReputationBand(-600)).toBe("wary");
    expect(getReputationBand(-201)).toBe("wary");
    expect(getReputationBand(-200)).toBe("neutral");
    expect(getReputationBand(200)).toBe("neutral");
    expect(getReputationBand(201)).toBe("allied");
    expect(getReputationBand(600)).toBe("allied");
    expect(getReputationBand(601)).toBe("sworn");
    expect(getReputationBand(1000)).toBe("sworn");
  });
  it("clamps out-of-range values before classifying", () => {
    expect(getReputationBand(99_999)).toBe("sworn");
    expect(getReputationBand(-99_999)).toBe("hostile");
  });
});

describe("getReputationBandProgress", () => {
  it("reports band ceilings and neighbours for neutral", () => {
    const p = getReputationBandProgress(0);
    expect(p.band).toBe("neutral");
    expect(p.bandFloor).toBe(-200);
    expect(p.bandCeiling).toBe(200);
    expect(p.nextBandUp).toBe("allied");
    expect(p.nextBandDown).toBe("wary");
    expect(p.pointsToNextBandUp).toBe(201);
    expect(p.pointsToNextBandDown).toBe(201);
  });

  it("reports correct next-band distances for allied", () => {
    const p = getReputationBandProgress(400);
    expect(p.band).toBe("allied");
    expect(p.bandFloor).toBe(201);
    expect(p.bandCeiling).toBe(600);
    expect(p.nextBandUp).toBe("sworn");
    expect(p.pointsToNextBandUp).toBe(201); // 601 - 400
    expect(p.nextBandDown).toBe("neutral");
    expect(p.pointsToNextBandDown).toBe(200); // 400 - 200
  });

  it("sworn has no next band up", () => {
    const p = getReputationBandProgress(1000);
    expect(p.band).toBe("sworn");
    expect(p.nextBandUp).toBeNull();
    expect(p.pointsToNextBandUp).toBe(0);
    expect(p.bandFillFraction).toBeCloseTo(1);
  });

  it("hostile has no next band down", () => {
    const p = getReputationBandProgress(-1000);
    expect(p.band).toBe("hostile");
    expect(p.nextBandDown).toBeNull();
    expect(p.pointsToNextBandDown).toBe(0);
    expect(p.bandFillFraction).toBeCloseTo(0);
  });

  it("bandFillFraction is monotonically increasing within a band", () => {
    const a = getReputationBandProgress(-200).bandFillFraction;
    const b = getReputationBandProgress(0).bandFillFraction;
    const c = getReputationBandProgress(200).bandFillFraction;
    expect(a).toBeLessThanOrEqual(b);
    expect(b).toBeLessThanOrEqual(c);
  });
});

describe("combineRepDeltas", () => {
  it("sums multiple deltas for the same key", () => {
    expect(
      combineRepDeltas([
        { factionKey: "insurgency", delta: 5 },
        { factionKey: "insurgency", delta: -2 },
      ]),
    ).toEqual({ insurgency: 3 });
  });

  it("drops zero / non-finite deltas", () => {
    expect(
      combineRepDeltas([
        { factionKey: "insurgency", delta: 0 },
        { factionKey: "new_babylon", delta: NaN },
        { factionKey: "architect", delta: Infinity },
        { factionKey: "dreamer", delta: 4 },
      ]),
    ).toEqual({ dreamer: 4 });
  });
});

describe("applyFactionDeltaMap", () => {
  it("adds deltas onto a fresh map, clamping to bound", () => {
    const next = applyFactionDeltaMap({}, { insurgency: 9_999, new_babylon: -3 });
    expect(next).toEqual({ insurgency: REP_BAND_BOUND, new_babylon: -3 });
  });

  it("preserves untouched keys", () => {
    const current = { insurgency: 200, architect: 100 };
    const next = applyFactionDeltaMap(current, { insurgency: 50 });
    expect(next).toEqual({ insurgency: 250, architect: 100 });
  });

  it("ignores zero / NaN / undefined deltas", () => {
    const current = { insurgency: 200 };
    const next = applyFactionDeltaMap(current, {
      insurgency: 0,
      new_babylon: undefined,
      architect: NaN,
    });
    expect(next).toEqual({ insurgency: 200 });
  });
});
