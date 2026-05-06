import { describe, it, expect } from "vitest";
import {
  applyDriftToControlPoints,
  computeFactionDriftBatch,
  computeFactionDriftDelta,
  DEFAULT_DRIFT_CONFIG,
  leanFactionFor,
  makeRng,
  type FactionDriftTerritoryView,
} from "./factionDriftService";

describe("makeRng", () => {
  it("produces a stable sequence for the same seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    for (let i = 0; i < 5; i++) {
      expect(a()).toBe(b());
    }
  });

  it("emits values in [0, 1)", () => {
    const rng = makeRng(1);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("produces different sequences for different seeds", () => {
    const a = makeRng(1);
    const b = makeRng(2);
    expect(a()).not.toBe(b());
  });
});

describe("applyDriftToControlPoints", () => {
  it("clamps to 0 on the low side", () => {
    expect(applyDriftToControlPoints(2, -10)).toBe(0);
  });

  it("clamps to 100 on the high side", () => {
    expect(applyDriftToControlPoints(98, 10)).toBe(100);
  });

  it("returns the sum within range", () => {
    expect(applyDriftToControlPoints(50, 3)).toBe(53);
    expect(applyDriftToControlPoints(50, -3)).toBe(47);
  });
});

describe("leanFactionFor", () => {
  it("returns null at exactly 50 (contested)", () => {
    expect(leanFactionFor(50)).toBeNull();
  });

  it("returns insurgency above 50 (matches warMap convention)", () => {
    expect(leanFactionFor(51)).toBe("insurgency");
    expect(leanFactionFor(100)).toBe("insurgency");
  });

  it("returns empire below 50", () => {
    expect(leanFactionFor(49)).toBe("empire");
    expect(leanFactionFor(0)).toBe("empire");
  });
});

describe("computeFactionDriftDelta", () => {
  it("never exceeds maxStep in either direction", () => {
    const rng = makeRng(7);
    for (let i = 0; i < 200; i++) {
      const delta = computeFactionDriftDelta(
        { controlPoints: 50, contestCount: 10 },
        rng,
      );
      expect(delta).toBeGreaterThanOrEqual(-DEFAULT_DRIFT_CONFIG.maxStep);
      expect(delta).toBeLessThanOrEqual(DEFAULT_DRIFT_CONFIG.maxStep);
    }
  });

  it("is deterministic given the same rng seed", () => {
    const territory = { controlPoints: 60, contestCount: 5 };
    const rng1 = makeRng(99);
    const rng2 = makeRng(99);
    expect(computeFactionDriftDelta(territory, rng1)).toBe(
      computeFactionDriftDelta(territory, rng2),
    );
  });

  it("returns integer deltas (rounded for tidy DB reads)", () => {
    const rng = makeRng(13);
    for (let i = 0; i < 50; i++) {
      const d = computeFactionDriftDelta(
        { controlPoints: 50 + i, contestCount: i },
        rng,
      );
      expect(Number.isInteger(d)).toBe(true);
    }
  });

  it("over many ticks, a leaning sector tends to polarise (momentum > regression)", () => {
    // Strong-momentum config so the bias is visible inside 100 ticks.
    const cfg = { ...DEFAULT_DRIFT_CONFIG, momentumStrength: 1.5, jitter: 0 };
    const rng = makeRng(2024);
    let cp = 70;
    for (let i = 0; i < 100; i++) {
      const delta = computeFactionDriftDelta(
        { controlPoints: cp, contestCount: 0 },
        rng,
        cfg,
      );
      cp = applyDriftToControlPoints(cp, delta);
    }
    // Started at 70 (insurgency lean); momentum should pull it
    // closer to 100, not back to 50.
    expect(cp).toBeGreaterThan(70);
  });
});

describe("computeFactionDriftBatch", () => {
  const territories: FactionDriftTerritoryView[] = [
    { id: 1, sectorId: 100, faction: null, controlPoints: 50, contestCount: 0 },
    { id: 2, sectorId: 200, faction: "empire", controlPoints: 30, contestCount: 5 },
    { id: 3, sectorId: 300, faction: "insurgency", controlPoints: 75, contestCount: 12 },
  ];

  it("emits one result per input territory in order", () => {
    const results = computeFactionDriftBatch(territories, makeRng(1));
    expect(results.length).toBe(territories.length);
    expect(results.map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it("computes a clamped newControlPoints + correct lean for each", () => {
    const results = computeFactionDriftBatch(territories, makeRng(7));
    for (const r of results) {
      expect(r.newControlPoints).toBeGreaterThanOrEqual(0);
      expect(r.newControlPoints).toBeLessThanOrEqual(100);
      expect(r.newFaction).toBe(leanFactionFor(r.newControlPoints));
    }
  });

  it("is fully deterministic given the same seed", () => {
    const a = computeFactionDriftBatch(territories, makeRng(42));
    const b = computeFactionDriftBatch(territories, makeRng(42));
    expect(a).toEqual(b);
  });
});
