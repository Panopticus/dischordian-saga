// apps/shared/tradeEmpire/__tests__/routeMarkets.test.ts

import { describe, it, expect } from "vitest";
import {
  nextSaturation,
  rewardMultiplierForSaturation,
  saturationLabel,
  SATURATION_CEILING,
  SATURATION_OVERSUPPLY_THRESHOLD,
  SATURATION_PER_MISSION,
} from "../routeMarkets";

describe("routeMarkets — Phase D.5", () => {
  it("rewardMultiplier is 1 below the oversupply threshold", () => {
    expect(rewardMultiplierForSaturation(0)).toBe(1);
    expect(rewardMultiplierForSaturation(50)).toBe(1);
    expect(rewardMultiplierForSaturation(SATURATION_OVERSUPPLY_THRESHOLD)).toBe(1);
  });

  it("rewardMultiplier decays toward 0.4 at the ceiling", () => {
    expect(rewardMultiplierForSaturation(SATURATION_CEILING)).toBe(0.4);
    const mid = rewardMultiplierForSaturation(
      SATURATION_OVERSUPPLY_THRESHOLD +
        (SATURATION_CEILING - SATURATION_OVERSUPPLY_THRESHOLD) / 2,
    );
    expect(mid).toBeCloseTo(0.7, 1);
  });

  it("nextSaturation adds the per-mission delta when no time elapsed", () => {
    expect(
      nextSaturation({ currentSaturation: 0, msSinceLastUpdate: 0 }),
    ).toBe(SATURATION_PER_MISSION);
  });

  it("nextSaturation decays over real time", () => {
    const after = nextSaturation({
      currentSaturation: 100,
      msSinceLastUpdate: 86_400_000, // 1 day
      addOnDelivery: 0,
    });
    expect(after).toBeLessThan(100);
  });

  it("nextSaturation never exceeds the ceiling", () => {
    expect(
      nextSaturation({
        currentSaturation: 200,
        msSinceLastUpdate: 0,
        addOnDelivery: 100,
      }),
    ).toBe(SATURATION_CEILING);
  });

  it("nextSaturation never goes below 0", () => {
    expect(
      nextSaturation({
        currentSaturation: 5,
        msSinceLastUpdate: 86_400_000 * 30,
        addOnDelivery: 0,
      }),
    ).toBe(0);
  });

  it("saturationLabel buckets sensibly", () => {
    expect(saturationLabel(0)).toBe("frontier-fresh");
    expect(saturationLabel(60)).toBe("well-supplied");
    expect(saturationLabel(120)).toBe("oversupplied");
    expect(saturationLabel(180)).toBe("glutted");
  });
});
