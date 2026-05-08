/**
 * Colony Commerce — economics + milestone-resolution invariants.
 *
 * Pure-function coverage: vessel catalog shape, sector eligibility,
 * tariff math (founding discount + founder reputation compounding),
 * tier resolution, milestone crossing detection. Router-level
 * behavior is exercised through integration testing once a real DB
 * is in scope.
 */
import { describe, it, expect } from "vitest";
import {
  COLONY_VESSEL_SPECS,
  COLONY_ELIGIBLE_SECTORS,
  isColonyEligibleSector,
  computeFoundingTariff,
  resolveFounderTier,
  crossedMilestone,
  founderDiscountBps,
  FOUNDING_TARIFF_DISCOUNT_PCT,
  FOUNDER_DISCOUNT_PER_COLONY_BPS,
  FOUNDER_DISCOUNT_CAP_BPS,
  FOUNDING_MILESTONE_TIERS,
  FIRST_EXPORT_GENERATION,
  PER_GENERATION_EXPORT_VALUE,
  BLOODLINE_MATURITY_GEN,
} from "../colonyCommerce";

describe("Vessel catalog", () => {
  it("registers three canonical vessel classes", () => {
    expect(Object.keys(COLONY_VESSEL_SPECS)).toEqual([
      "colony_ship_basic",
      "colony_ship_arkforge",
      "colony_ship_panoptic",
    ]);
  });

  it("every vessel has a positive base tariff and voyage duration", () => {
    for (const v of Object.values(COLONY_VESSEL_SPECS)) {
      expect(v.baseTariffDream, v.id).toBeGreaterThan(0);
      expect(v.voyageDurationMs, v.id).toBeGreaterThan(0);
    }
  });

  it("vessel tiers gate on increasing founder tier (basic = 0, arkforge = 1, panoptic = 3)", () => {
    expect(COLONY_VESSEL_SPECS.colony_ship_basic.requiredFounderTier).toBe(0);
    expect(COLONY_VESSEL_SPECS.colony_ship_arkforge.requiredFounderTier).toBe(1);
    expect(COLONY_VESSEL_SPECS.colony_ship_panoptic.requiredFounderTier).toBe(3);
  });

  it("voyage duration scales with vessel tier (longer = more capacity)", () => {
    expect(COLONY_VESSEL_SPECS.colony_ship_arkforge.voyageDurationMs)
      .toBeGreaterThan(COLONY_VESSEL_SPECS.colony_ship_basic.voyageDurationMs);
    expect(COLONY_VESSEL_SPECS.colony_ship_panoptic.voyageDurationMs)
      .toBeGreaterThan(COLONY_VESSEL_SPECS.colony_ship_arkforge.voyageDurationMs);
  });
});

describe("Sector eligibility", () => {
  it("registers exactly five eligible sectors", () => {
    expect(COLONY_ELIGIBLE_SECTORS).toEqual([
      "fringe", "reef", "verdant", "ash", "crystal",
    ]);
  });

  it("isColonyEligibleSector accepts canonical and rejects non-canonical", () => {
    for (const s of COLONY_ELIGIBLE_SECTORS) {
      expect(isColonyEligibleSector(s)).toBe(true);
    }
    expect(isColonyEligibleSector("core")).toBe(false);
    expect(isColonyEligibleSector("whisper")).toBe(false);
    expect(isColonyEligibleSector("reach")).toBe(false);
    expect(isColonyEligibleSector("not_a_sector")).toBe(false);
  });
});

describe("Founding tariff math", () => {
  it("a fresh founder pays exactly half the base tariff (50% off)", () => {
    const basic = COLONY_VESSEL_SPECS.colony_ship_basic;
    const tariff = computeFoundingTariff(basic, 0);
    expect(tariff).toBe(Math.round(basic.baseTariffDream * 0.5));
    expect(FOUNDING_TARIFF_DISCOUNT_PCT).toBe(50);
  });

  it("founder discount compounds on top of founding discount", () => {
    const basic = COLONY_VESSEL_SPECS.colony_ship_basic;
    // 100 bps = 1% off after the founding 50%-off baseline.
    const founderBps = 100;
    const expected = Math.round((basic.baseTariffDream * 0.5) * (1 - founderBps / 10000));
    expect(computeFoundingTariff(basic, founderBps)).toBe(expected);
  });

  it("founder discount caps so tariff never reaches zero", () => {
    const basic = COLONY_VESSEL_SPECS.colony_ship_basic;
    const huge = 99_999;
    const tariff = computeFoundingTariff(basic, huge);
    expect(tariff).toBeGreaterThan(0);
    // Cap = 500 bps = 5% off after founding discount.
    const expectedAtCap = Math.round((basic.baseTariffDream * 0.5) * (1 - FOUNDER_DISCOUNT_CAP_BPS / 10000));
    expect(tariff).toBe(expectedAtCap);
  });

  it("more founded colonies → larger discount (compounding direction)", () => {
    const basic = COLONY_VESSEL_SPECS.colony_ship_basic;
    const fresh = computeFoundingTariff(basic, founderDiscountBps(0));
    const seasoned = computeFoundingTariff(basic, founderDiscountBps(5));
    expect(seasoned).toBeLessThan(fresh);
  });
});

describe("Founder discount bps", () => {
  it("zero colonies → zero bps", () => {
    expect(founderDiscountBps(0)).toBe(0);
  });

  it("each colony adds the canonical bps (50)", () => {
    expect(founderDiscountBps(1)).toBe(FOUNDER_DISCOUNT_PER_COLONY_BPS);
    expect(founderDiscountBps(3)).toBe(3 * FOUNDER_DISCOUNT_PER_COLONY_BPS);
  });

  it("caps at FOUNDER_DISCOUNT_CAP_BPS", () => {
    expect(founderDiscountBps(100)).toBe(FOUNDER_DISCOUNT_CAP_BPS);
    expect(founderDiscountBps(10)).toBe(FOUNDER_DISCOUNT_CAP_BPS);
  });
});

describe("Founder tier resolution", () => {
  it("zero colonies → tier 0", () => {
    expect(resolveFounderTier(0)).toBe(0);
  });

  it("crosses each milestone in order", () => {
    expect(resolveFounderTier(1)).toBe(1);
    expect(resolveFounderTier(3)).toBe(2);
    expect(resolveFounderTier(5)).toBe(3);
    expect(resolveFounderTier(10)).toBe(4);
  });

  it("never decreases as colonies founded grows", () => {
    let prev = 0;
    for (let n = 0; n <= 20; n++) {
      const tier = resolveFounderTier(n);
      expect(tier, `n=${n}`).toBeGreaterThanOrEqual(prev);
      prev = tier;
    }
  });

  it("tier ceiling matches FOUNDING_MILESTONE_TIERS length", () => {
    expect(resolveFounderTier(1000)).toBe(FOUNDING_MILESTONE_TIERS.length);
  });
});

describe("Milestone crossing detection", () => {
  it("0 → 1 crosses (tier 0 → tier 1)", () => {
    expect(crossedMilestone(0, 1)).toBe(true);
  });

  it("1 → 2 does NOT cross (still tier 1)", () => {
    expect(crossedMilestone(1, 2)).toBe(false);
  });

  it("2 → 3 crosses (tier 1 → tier 2)", () => {
    expect(crossedMilestone(2, 3)).toBe(true);
  });

  it("crossing is direction-sensitive (same count → no crossing)", () => {
    expect(crossedMilestone(5, 5)).toBe(false);
  });
});

describe("Export economics", () => {
  it("first export starts at generation 2", () => {
    expect(FIRST_EXPORT_GENERATION).toBe(2);
  });

  it("per-generation export value is positive", () => {
    expect(PER_GENERATION_EXPORT_VALUE).toBeGreaterThan(0);
  });

  it("a basic vessel pays back its founding tariff after roughly 5 generations of mature colony exports", () => {
    const basic = COLONY_VESSEL_SPECS.colony_ship_basic;
    const founding = computeFoundingTariff(basic, 0);
    const fiveGenerationsValue = 5 * PER_GENERATION_EXPORT_VALUE;
    // 5 generations of exports should at least cover the founding tariff.
    expect(fiveGenerationsValue).toBeGreaterThanOrEqual(founding);
  });
});

describe("Maturity gate", () => {
  it("BLOODLINE_MATURITY_GEN is the canonical 3rd generation threshold", () => {
    expect(BLOODLINE_MATURITY_GEN).toBe(3);
  });
});
