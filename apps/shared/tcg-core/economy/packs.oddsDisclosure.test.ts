import { describe, it, expect } from "vitest";
import {
  PACK_RARITY_ODDS,
  PITY_PACK_INTERVAL,
  PITY_PACKS_THRESHOLD,
  PITY_GUARANTEE_MIN_RARITY,
} from "./packs";

/**
 * Balance F5 — the in-client disclosure must show the odds the
 * engine actually rolls. These assertions pin the derivation so a
 * change to RARITY_THRESHOLDS without updating intent fails loudly,
 * and the disclosed pity rule stays the enforced one.
 */
describe("pack odds disclosure (Balance F5)", () => {
  it("publishes a probability for every rarity tier, summing to 1", () => {
    expect(PACK_RARITY_ODDS.length).toBe(5);
    const total = PACK_RARITY_ODDS.reduce((s, r) => s + r.probability, 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it("matches the documented per-card distribution", () => {
    const map = Object.fromEntries(
      PACK_RARITY_ODDS.map((r) => [r.rarity, r.probability]),
    );
    expect(map.legendary).toBeCloseTo(0.01, 6);
    expect(map.epic).toBeCloseTo(0.04, 6);
    expect(map.rare).toBeCloseTo(0.1, 6);
    expect(map.uncommon).toBeCloseTo(0.2, 6);
    expect(map.common).toBeCloseTo(0.65, 6);
  });

  it("every probability is a valid 0..1 fraction", () => {
    for (const { probability } of PACK_RARITY_ODDS) {
      expect(probability).toBeGreaterThan(0);
      expect(probability).toBeLessThanOrEqual(1);
    }
  });

  it("disclosed pity interval is the enforced threshold + 1", () => {
    expect(PITY_PACK_INTERVAL).toBe(PITY_PACKS_THRESHOLD + 1);
    expect(PITY_PACK_INTERVAL).toBe(5); // "every 5th pack"
    expect(PITY_GUARANTEE_MIN_RARITY).toBe("rare");
  });
});
