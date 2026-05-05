import { describe, it, expect } from "vitest";

import { charismaTrustMultiplier } from "./charismaTrustService";

describe("charismaTrustMultiplier", () => {
  it("returns 1.0 at default charisma 5", () => {
    expect(charismaTrustMultiplier(5)).toBe(1.0);
  });

  it("scales up linearly above 5", () => {
    expect(charismaTrustMultiplier(6)).toBeCloseTo(1.05);
    expect(charismaTrustMultiplier(7)).toBeCloseTo(1.10);
    expect(charismaTrustMultiplier(9)).toBeCloseTo(1.20);
  });

  it("scales down linearly below 5", () => {
    expect(charismaTrustMultiplier(3)).toBeCloseTo(0.90);
    expect(charismaTrustMultiplier(1)).toBeCloseTo(0.80);
  });

  it("hits the documented per-class endpoints", () => {
    // Spy seed: charisma 6 → ×1.05
    expect(charismaTrustMultiplier(6)).toBeCloseTo(1.05);
    // Oracle seed: charisma 7 → ×1.10
    expect(charismaTrustMultiplier(7)).toBeCloseTo(1.10);
    // Assassin seed: charisma 3 → ×0.90
    expect(charismaTrustMultiplier(3)).toBeCloseTo(0.90);
  });
});
