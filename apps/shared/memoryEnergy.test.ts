import { describe, it, expect } from "vitest";
import {
  MEMORY_ENERGY_MIN,
  MEMORY_ENERGY_CAP_BASE,
  MEMORY_ENERGY_CAP_TRADE_EMPIRE,
  MEMORY_ENERGY_STARTING,
  MEMORY_ENERGY_COSTS,
  MEMORY_ENERGY_EARN_RATES,
  clampMemoryEnergy,
  adjustMemoryEnergy,
  computeMemoryEnergyCap,
  getMemoryEnergyCostForRarity,
  canAffordMemoryEnergy,
  earnMemoryEnergy,
} from "./memoryEnergy";

describe("memoryEnergy — clamping", () => {
  it("clamps to [0, cap]", () => {
    expect(clampMemoryEnergy(-5, 50)).toBe(MEMORY_ENERGY_MIN);
    expect(clampMemoryEnergy(120, 50)).toBe(50);
    expect(clampMemoryEnergy(25, 50)).toBe(25);
  });

  it("treats non-finite values as 0", () => {
    expect(clampMemoryEnergy(Number.NaN, 50)).toBe(MEMORY_ENERGY_MIN);
    expect(clampMemoryEnergy(Number.POSITIVE_INFINITY, 50)).toBe(50);
  });

  it("falls back to base cap on invalid cap", () => {
    expect(clampMemoryEnergy(100, 0)).toBe(MEMORY_ENERGY_CAP_BASE);
    expect(clampMemoryEnergy(100, Number.NaN)).toBe(MEMORY_ENERGY_CAP_BASE);
  });
});

describe("memoryEnergy — adjust", () => {
  it("applies positive deltas up to cap", () => {
    expect(adjustMemoryEnergy(10, 5, 50)).toBe(15);
    expect(adjustMemoryEnergy(48, 10, 50)).toBe(50);
  });

  it("applies negative deltas clamped at 0", () => {
    expect(adjustMemoryEnergy(10, -3, 50)).toBe(7);
    expect(adjustMemoryEnergy(2, -10, 50)).toBe(0);
  });

  it("treats non-finite current as 0", () => {
    expect(adjustMemoryEnergy(Number.NaN, 5, 50)).toBe(5);
  });
});

describe("memoryEnergy — cap derivation", () => {
  it("returns base cap without trade_empire_unlocked", () => {
    expect(computeMemoryEnergyCap({})).toBe(MEMORY_ENERGY_CAP_BASE);
    expect(computeMemoryEnergyCap({ act_2_complete: true })).toBe(
      MEMORY_ENERGY_CAP_BASE,
    );
  });

  it("lifts cap when trade_empire_unlocked is true", () => {
    expect(computeMemoryEnergyCap({ trade_empire_unlocked: true })).toBe(
      MEMORY_ENERGY_CAP_TRADE_EMPIRE,
    );
  });

  it("handles null/undefined flags", () => {
    expect(computeMemoryEnergyCap(null)).toBe(MEMORY_ENERGY_CAP_BASE);
    expect(computeMemoryEnergyCap(undefined)).toBe(MEMORY_ENERGY_CAP_BASE);
  });
});

describe("memoryEnergy — recipe costs", () => {
  it("returns the cost for each known rarity", () => {
    expect(getMemoryEnergyCostForRarity("common")).toBe(
      MEMORY_ENERGY_COSTS.common,
    );
    expect(getMemoryEnergyCostForRarity("legendary")).toBe(
      MEMORY_ENERGY_COSTS.legendary,
    );
    expect(getMemoryEnergyCostForRarity("mythic")).toBe(
      MEMORY_ENERGY_COSTS.mythic,
    );
  });

  it("falls back to common for unknown rarities", () => {
    expect(getMemoryEnergyCostForRarity("gilded")).toBe(
      MEMORY_ENERGY_COSTS.common,
    );
    expect(getMemoryEnergyCostForRarity(null)).toBe(
      MEMORY_ENERGY_COSTS.common,
    );
  });
});

describe("memoryEnergy — affordability", () => {
  it("accepts exactly-sufficient balance", () => {
    expect(canAffordMemoryEnergy(10, 10)).toBe(true);
  });

  it("rejects insufficient balance", () => {
    expect(canAffordMemoryEnergy(9, 10)).toBe(false);
  });

  it("rejects non-finite current", () => {
    expect(canAffordMemoryEnergy(Number.NaN, 10)).toBe(false);
  });
});

describe("memoryEnergy — earn", () => {
  it("adds the configured rate for the source", () => {
    const res = earnMemoryEnergy("cardBattleWin", 10, 50);
    expect(res.delta).toBe(MEMORY_ENERGY_EARN_RATES.cardBattleWin);
    expect(res.next).toBe(10 + MEMORY_ENERGY_EARN_RATES.cardBattleWin);
  });

  it("respects the cap when earning", () => {
    const res = earnMemoryEnergy("recordingDiscovery", 48, 50);
    expect(res.next).toBe(50);
    expect(res.delta).toBe(2);
  });

  it("honors an override delta", () => {
    const res = earnMemoryEnergy("dev", 20, 50, 7);
    expect(res.delta).toBe(7);
    expect(res.next).toBe(27);
  });
});

describe("memoryEnergy — constants", () => {
  it("starts below the base cap", () => {
    expect(MEMORY_ENERGY_STARTING).toBeLessThan(MEMORY_ENERGY_CAP_BASE);
    expect(MEMORY_ENERGY_STARTING).toBeGreaterThan(0);
  });

  it("keeps the base cap strictly less than the trade-empire cap", () => {
    expect(MEMORY_ENERGY_CAP_BASE).toBeLessThan(MEMORY_ENERGY_CAP_TRADE_EMPIRE);
  });
});
