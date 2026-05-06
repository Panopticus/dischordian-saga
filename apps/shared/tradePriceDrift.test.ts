import { describe, it, expect } from "vitest";
import {
  DEFAULT_PRICE_MODIFIERS,
  applyPriceModifiers,
  computePriceModifiers,
} from "./tradePriceDrift";

describe("computePriceModifiers", () => {
  it("returns 1.0 across the board for an empty pressure snapshot", () => {
    expect(computePriceModifiers({})).toEqual(DEFAULT_PRICE_MODIFIERS);
  });

  it("inflates fuelOre when deaths and viralExposures are high", () => {
    const m = computePriceModifiers({ deaths: 50, viralExposures: 30 });
    expect(m.fuelOre).toBeGreaterThan(1);
  });

  it("inflates organics on viralExposures and deflates on healing", () => {
    expect(computePriceModifiers({ viralExposures: 40 }).organics).toBeGreaterThan(1);
    expect(computePriceModifiers({ healingDone: 80 }).organics).toBeLessThan(1);
  });

  it("inflates voidCrystals when cycleNet is negative (dark ascendant)", () => {
    expect(computePriceModifiers({ cycleNet: -50 }).voidCrystals).toBeGreaterThan(1);
    expect(computePriceModifiers({ cycleNet: 50 }).voidCrystals).toBeLessThan(1);
  });

  it("clamps every modifier to [0.5, 2.0]", () => {
    const wild = computePriceModifiers({
      deaths: 99999,
      viralExposures: 99999,
      truthRevealed: -99999,
      cycleNet: -99999,
    });
    for (const value of Object.values(wild)) {
      expect(value).toBeGreaterThanOrEqual(0.5);
      expect(value).toBeLessThanOrEqual(2);
    }
  });

  it("rounds to two decimals (clean DB writes)", () => {
    const m = computePriceModifiers({ deaths: 17 });
    for (const value of Object.values(m)) {
      const decimals = String(value).split(".")[1] ?? "";
      expect(decimals.length).toBeLessThanOrEqual(2);
    }
  });
});

describe("applyPriceModifiers", () => {
  it("multiplies base prices and rounds to whole units", () => {
    const base = {
      credits: 1, fuelOre: 100, organics: 50, equipment: 200, voidCrystals: 1000, salvage: 30,
    } as const;
    const modifiers = {
      fuelOre: 1.5, organics: 0.8, equipment: 1, voidCrystals: 0.6, salvage: 1.25,
    };
    const out = applyPriceModifiers(base, modifiers);
    expect(out.fuelOre).toBe(150);
    expect(out.organics).toBe(40);
    expect(out.equipment).toBe(200);
    expect(out.voidCrystals).toBe(600);
    expect(out.salvage).toBe(38);
  });

  it("never modifies credits (the unit of account)", () => {
    const base = {
      credits: 1, fuelOre: 100, organics: 50, equipment: 200, voidCrystals: 1000, salvage: 30,
    } as const;
    const out = applyPriceModifiers(base, DEFAULT_PRICE_MODIFIERS);
    expect(out.credits).toBe(1);
  });
});
