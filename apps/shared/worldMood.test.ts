import { describe, it, expect } from "vitest";
import {
  composeWorldMood,
  sumContributions,
  SEAL_HORSEMAN_BASELINE,
} from "./worldMood";

describe("composeWorldMood", () => {
  it("clamps each axis to [0, 1]", () => {
    const m = composeWorldMood({ conquest: 1.5, war: -0.3 });
    expect(m.conquest).toBe(1);
    expect(m.war).toBe(0);
    expect(m.famine).toBe(0);
    expect(m.death).toBe(0);
  });

  it("picks the dominant axis", () => {
    expect(
      composeWorldMood({ conquest: 0.1, war: 0.2, famine: 0.3, death: 0.05 })
        .dominantAxis,
    ).toBe("famine");
    expect(composeWorldMood({ death: 0.9 }).dominantAxis).toBe("death");
  });

  it("ties break in declaration order (conquest first)", () => {
    const m = composeWorldMood({ conquest: 0.5, war: 0.5 });
    expect(m.dominantAxis).toBe("conquest");
  });

  it("preserves contributingSeals + mercyOffset metadata", () => {
    const m = composeWorldMood(
      { conquest: 0.3 },
      { contributingSeals: [1, 2], mercyOffset: 0.04 },
    );
    expect(m.contributingSeals).toEqual([1, 2]);
    expect(m.mercyOffset).toBe(0.04);
  });
});

describe("sumContributions", () => {
  it("sums signed contributions across parts", () => {
    const out = sumContributions([
      { conquest: 0.2, famine: 0.1 },
      { conquest: 0.1, famine: -0.05 },
      { war: 0.3 },
    ]);
    expect(out.conquest).toBeCloseTo(0.3, 5);
    expect(out.famine).toBeCloseTo(0.05, 5);
    expect(out.war).toBeCloseTo(0.3, 5);
  });

  it("returns empty when no parts", () => {
    expect(sumContributions([])).toEqual({});
  });

  it("clamping happens in composeWorldMood, not sumContributions", () => {
    const out = sumContributions([{ death: 0.8 }, { death: 0.6 }]);
    expect(out.death).toBeCloseTo(1.4, 5); // unclamped
    const composed = composeWorldMood(out);
    expect(composed.death).toBe(1); // clamped only at compose time
  });
});

describe("SEAL_HORSEMAN_BASELINE", () => {
  it("seals I–IV map to one horseman each", () => {
    expect(SEAL_HORSEMAN_BASELINE[1]).toEqual({ conquest: 0.1 });
    expect(SEAL_HORSEMAN_BASELINE[2]).toEqual({ war: 0.15 });
    expect(SEAL_HORSEMAN_BASELINE[3]).toEqual({ famine: 0.2 });
    expect(SEAL_HORSEMAN_BASELINE[4]).toEqual({ death: 0.25 });
  });

  it("seal V tilts both famine and death (souls under the altar)", () => {
    const v = SEAL_HORSEMAN_BASELINE[5];
    expect(v.famine).toBeGreaterThan(0);
    expect(v.death).toBeGreaterThan(0);
  });

  it("seal VII contributes nothing (silence)", () => {
    expect(SEAL_HORSEMAN_BASELINE[7]).toEqual({});
  });
});
