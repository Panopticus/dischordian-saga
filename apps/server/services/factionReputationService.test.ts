import { describe, it, expect } from "vitest";
import {
  REP_BOUND,
  MAX_TRADE_DISCOUNT,
  DECAY_PER_TICK,
  boundReputation,
  computeTradePriceMultiplier,
  getFactionReputation,
  getReputationFor,
  runFactionReputationDecayTick,
  applyDeltaToGameData,
  applyFactionReputationDelta,
} from "./factionReputationService";

/* ═══════════════════════════════════════════════════════
   factionReputationService.test.ts

   Pure-helper coverage for the bounded-math + discount
   calculation. The DB-touching paths (read, decay sweep)
   get a smoke test against the no-DB graceful fallback;
   integration coverage lands when an integration harness
   is set up.
   ═══════════════════════════════════════════════════════ */

describe("constants match the doc", () => {
  it("REP_BOUND is 1000 (matches TRADE_DIPLOMACY §2 'Bounded math')", () => {
    expect(REP_BOUND).toBe(1000);
  });
  it("MAX_TRADE_DISCOUNT is 15% (legacy ceiling)", () => {
    expect(MAX_TRADE_DISCOUNT).toBeCloseTo(0.15);
  });
  it("DECAY_PER_TICK is 1 (linear decay)", () => {
    expect(DECAY_PER_TICK).toBe(1);
  });
});

describe("boundReputation", () => {
  it("passes through values inside the range", () => {
    expect(boundReputation(0)).toBe(0);
    expect(boundReputation(500)).toBe(500);
    expect(boundReputation(-500)).toBe(-500);
    expect(boundReputation(1000)).toBe(1000);
    expect(boundReputation(-1000)).toBe(-1000);
  });

  it("clamps over-the-top values into the bounded range", () => {
    expect(boundReputation(99999)).toBe(REP_BOUND);
    expect(boundReputation(-99999)).toBe(-REP_BOUND);
  });

  it("truncates fractional values toward zero", () => {
    expect(boundReputation(123.7)).toBe(123);
    expect(boundReputation(-123.7)).toBe(-123);
  });

  it("returns 0 for non-finite inputs", () => {
    expect(boundReputation(NaN)).toBe(0);
    expect(boundReputation(Infinity)).toBe(0);
    expect(boundReputation(-Infinity)).toBe(0);
  });
});

describe("computeTradePriceMultiplier", () => {
  it("zero reputation leaves the price unchanged", () => {
    expect(computeTradePriceMultiplier(0)).toBe(1);
  });

  it("max positive reputation yields the maximum discount (1 - 0.15 = 0.85)", () => {
    expect(computeTradePriceMultiplier(REP_BOUND)).toBeCloseTo(1 - MAX_TRADE_DISCOUNT);
  });

  it("max negative reputation yields the maximum markup (1 + 0.15 = 1.15)", () => {
    expect(computeTradePriceMultiplier(-REP_BOUND)).toBeCloseTo(1 + MAX_TRADE_DISCOUNT);
  });

  it("scales linearly between 0 and ±REP_BOUND", () => {
    expect(computeTradePriceMultiplier(500)).toBeCloseTo(1 - 0.075);
    expect(computeTradePriceMultiplier(-500)).toBeCloseTo(1 + 0.075);
    expect(computeTradePriceMultiplier(250)).toBeCloseTo(1 - 0.0375);
  });

  it("clamps over-the-top reputations to the bound (no spoof discount)", () => {
    // The legacy attack: client sent { empire: 99999 } and got 15%
    // discount with no server check. With clamping, 99999 collapses
    // to the same multiplier as 1000 — same ceiling, no escalation.
    expect(computeTradePriceMultiplier(99999)).toBeCloseTo(
      computeTradePriceMultiplier(REP_BOUND),
    );
    expect(computeTradePriceMultiplier(-99999)).toBeCloseTo(
      computeTradePriceMultiplier(-REP_BOUND),
    );
  });
});

describe("no-DB fallback", () => {
  // The test environment runs without DATABASE_URL → getDb() → null.
  // Each function must return its empty-shape default without throwing.

  it("getFactionReputation returns {} when DB is unavailable", async () => {
    const result = await getFactionReputation(42);
    expect(result).toEqual({});
  });

  it("getReputationFor returns 0 when DB is unavailable", async () => {
    const result = await getReputationFor(42, "empire");
    expect(result).toBe(0);
  });

  it("runFactionReputationDecayTick returns rowsTouched: 0 when DB is unavailable", async () => {
    const result = await runFactionReputationDecayTick();
    expect(result).toEqual({ rowsTouched: 0 });
  });

  it("applyFactionReputationDelta returns null when DB is unavailable", async () => {
    const result = await applyFactionReputationDelta(42, "empire", 100);
    expect(result).toBeNull();
  });
});

describe("applyDeltaToGameData (pure transform)", () => {
  // Round-trip the read-modify-write the legacy tradeContracts code
  // did inline. The audit flagged this path as unbounded; these tests
  // pin the bounded behavior the service helper now enforces.

  it("seeds the faction key when no prior gameData exists", () => {
    const r = applyDeltaToGameData(undefined, "empire", 100);
    expect(r.previousValue).toBe(0);
    expect(r.nextValue).toBe(100);
    expect(r.nextGameData.factionReputation).toEqual({ empire: 100 });
  });

  it("seeds the faction key when gameData exists but has no factionReputation", () => {
    const r = applyDeltaToGameData({ otherKey: "preserved" }, "empire", 50);
    expect(r.nextValue).toBe(50);
    expect(r.nextGameData.factionReputation).toEqual({ empire: 50 });
    expect(r.nextGameData.otherKey).toBe("preserved");
  });

  it("preserves sibling faction keys", () => {
    const r = applyDeltaToGameData(
      { factionReputation: { empire: 100, rebels: -50 } },
      "empire",
      25,
    );
    expect(r.nextValue).toBe(125);
    expect(r.nextGameData.factionReputation).toEqual({ empire: 125, rebels: -50 });
  });

  it("preserves sibling gameData keys", () => {
    const r = applyDeltaToGameData(
      { factionReputation: { empire: 100 }, narrativeFlags: { x: true } },
      "empire",
      10,
    );
    expect(r.nextGameData.narrativeFlags).toEqual({ x: true });
  });

  it("clamps the result to +REP_BOUND when delta would exceed it", () => {
    const r = applyDeltaToGameData(
      { factionReputation: { empire: 950 } },
      "empire",
      9999,
    );
    expect(r.nextValue).toBe(REP_BOUND);
  });

  it("clamps the result to -REP_BOUND when delta would exceed it", () => {
    const r = applyDeltaToGameData(
      { factionReputation: { empire: -950 } },
      "empire",
      -9999,
    );
    expect(r.nextValue).toBe(-REP_BOUND);
  });

  it("clamps a corrupted prior value before adding the delta", () => {
    // Defense-in-depth: even if some other code path wrote 99999,
    // the read clamps to REP_BOUND before applying the delta.
    const r = applyDeltaToGameData(
      { factionReputation: { empire: 99999 } },
      "empire",
      -100,
    );
    expect(r.previousValue).toBe(REP_BOUND);
    expect(r.nextValue).toBe(REP_BOUND - 100);
  });

  it("ignores non-finite deltas (treats as zero) rather than corrupting state", () => {
    const r = applyDeltaToGameData(
      { factionReputation: { empire: 100 } },
      "empire",
      NaN,
    );
    expect(r.nextValue).toBe(100);
  });

  it("zero delta is a no-op on the bounded value", () => {
    const r = applyDeltaToGameData(
      { factionReputation: { empire: 250 } },
      "empire",
      0,
    );
    expect(r.previousValue).toBe(250);
    expect(r.nextValue).toBe(250);
  });

  it("does not mutate the input gameData (returns a new object)", () => {
    const input = { factionReputation: { empire: 100 } };
    const r = applyDeltaToGameData(input, "empire", 50);
    expect(input.factionReputation.empire).toBe(100);
    expect(r.nextGameData).not.toBe(input);
    expect(r.nextGameData.factionReputation).not.toBe(input.factionReputation);
  });
});
