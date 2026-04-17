import { describe, it, expect } from "vitest";
import {
  NARRATOR_BOND_MIN,
  NARRATOR_BOND_MAX,
  NARRATOR_BOND_THRESHOLDS,
  adjustNarratorBond,
  clampNarratorBond,
  deriveNarratorBond,
} from "./narratorBond";

describe("narratorBond — clampNarratorBond", () => {
  it("passes through values inside the range", () => {
    expect(clampNarratorBond(0)).toBe(0);
    expect(clampNarratorBond(40)).toBe(40);
    expect(clampNarratorBond(100)).toBe(100);
  });

  it("clamps below 0 to 0", () => {
    expect(clampNarratorBond(-1)).toBe(0);
    expect(clampNarratorBond(-9999)).toBe(0);
  });

  it("clamps above 100 to 100", () => {
    expect(clampNarratorBond(101)).toBe(100);
    expect(clampNarratorBond(9999)).toBe(100);
  });

  it("treats NaN and Infinity as 0", () => {
    expect(clampNarratorBond(Number.NaN)).toBe(0);
    expect(clampNarratorBond(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clampNarratorBond(Number.NEGATIVE_INFINITY)).toBe(0);
  });
});

describe("narratorBond — adjustNarratorBond", () => {
  it("adds positive deltas", () => {
    expect(adjustNarratorBond(10, 5)).toBe(15);
  });

  it("subtracts negative deltas", () => {
    expect(adjustNarratorBond(10, -5)).toBe(5);
  });

  it("clamps at 0 on under-flow", () => {
    expect(adjustNarratorBond(5, -10)).toBe(0);
  });

  it("clamps at 100 on over-flow", () => {
    expect(adjustNarratorBond(95, 20)).toBe(100);
  });

  it("falls back to 0 when current is non-finite", () => {
    expect(adjustNarratorBond(Number.NaN, 10)).toBe(10);
  });

  it("zero delta is idempotent", () => {
    expect(adjustNarratorBond(42, 0)).toBe(42);
  });
});

describe("narratorBond — deriveNarratorBond (fallback semantics)", () => {
  it("prefers explicit narratorBond when finite", () => {
    expect(
      deriveNarratorBond({
        narratorBond: 55,
        fallbackElara: 10,
        fallbackHuman: 10,
      }),
    ).toBe(55);
  });

  it("treats narratorBond 0 as a valid, explicit value (not a fallback trigger)", () => {
    expect(
      deriveNarratorBond({
        narratorBond: 0,
        fallbackElara: 80,
        fallbackHuman: 80,
      }),
    ).toBe(0);
  });

  it("falls back to min(fallbackElara, fallbackHuman) when narratorBond is undefined", () => {
    expect(
      deriveNarratorBond({ fallbackElara: 60, fallbackHuman: 40 }),
    ).toBe(40);
    expect(
      deriveNarratorBond({ fallbackElara: 10, fallbackHuman: 80 }),
    ).toBe(10);
  });

  it("falls back when narratorBond is null", () => {
    expect(
      deriveNarratorBond({
        narratorBond: null,
        fallbackElara: 30,
        fallbackHuman: 50,
      }),
    ).toBe(30);
  });

  it("falls back when narratorBond is NaN", () => {
    expect(
      deriveNarratorBond({
        narratorBond: Number.NaN,
        fallbackElara: 30,
        fallbackHuman: 50,
      }),
    ).toBe(30);
  });

  it("treats missing fallbacks as 0 (so bond starts at 0 on fresh saves)", () => {
    expect(deriveNarratorBond({})).toBe(0);
    expect(deriveNarratorBond({ fallbackElara: 100 })).toBe(0);
  });

  it("clamps derived values above 100", () => {
    expect(
      deriveNarratorBond({ fallbackElara: 150, fallbackHuman: 200 }),
    ).toBe(100);
  });

  it("clamps explicit narratorBond outside [0, 100]", () => {
    expect(deriveNarratorBond({ narratorBond: -5 })).toBe(0);
    expect(deriveNarratorBond({ narratorBond: 250 })).toBe(100);
  });
});

describe("narratorBond — constants", () => {
  it("bond range is 0..100", () => {
    expect(NARRATOR_BOND_MIN).toBe(0);
    expect(NARRATOR_BOND_MAX).toBe(100);
  });

  it("§14.1 thresholds match the Witnessing Narrative Proposal", () => {
    expect(NARRATOR_BOND_THRESHOLDS.remember).toBe(40);
    expect(NARRATOR_BOND_THRESHOLDS.silence).toBe(60);
    expect(NARRATOR_BOND_THRESHOLDS.meet).toBe(80);
  });

  it("thresholds are monotonically increasing", () => {
    const { remember, silence, meet } = NARRATOR_BOND_THRESHOLDS;
    expect(remember).toBeLessThan(silence);
    expect(silence).toBeLessThan(meet);
  });
});
