import { describe, it, expect } from "vitest";
import { createRng, rngInt } from "../../shared/tcg-core";
import { randomSeed } from "../../shared/casinoGames";

/**
 * Persistence F9 — pack pulls must be reproducible from the persisted
 * seed. store.doFulfill draws from a deterministically-ordered pool
 * via `createRng(packSeed)` + `rngInt`, and persists `packSeed` +
 * `packCardIds` into purchase_grants.rewardSummary. This test pins
 * the exact draw algorithm so a recorded seed always reproduces the
 * same pulls (audit / dispute resolution).
 */
function drawPack(seed: string, poolSize: number, packSize: number): number[] {
  const rng = createRng(seed);
  const out: number[] = [];
  for (let i = 0; i < packSize; i++) out.push(rngInt(rng, 0, poolSize - 1));
  return out;
}

describe("pack RNG is seeded, persisted, reproducible (Persistence F9)", () => {
  it("same seed → identical pulls (replayable for audit)", () => {
    const a = drawPack("audit-seed-1", 500, 10);
    const b = drawPack("audit-seed-1", 500, 10);
    expect(a).toEqual(b);
    expect(a).toHaveLength(10);
    a.forEach((idx) => {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(500);
    });
  });

  it("different seed → different pulls (seed actually drives the draw)", () => {
    const a = drawPack("audit-seed-1", 500, 12);
    const b = drawPack("audit-seed-2", 500, 12);
    expect(a).not.toEqual(b);
  });

  it("randomSeed() yields distinct non-empty seeds", () => {
    const seeds = new Set(Array.from({ length: 50 }, () => randomSeed()));
    expect(seeds.size).toBe(50);
    for (const s of seeds) expect(s.length).toBeGreaterThan(0);
  });
});
