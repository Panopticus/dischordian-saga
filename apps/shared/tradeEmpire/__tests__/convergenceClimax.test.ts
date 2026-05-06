// apps/shared/tradeEmpire/__tests__/convergenceClimax.test.ts

import { describe, it, expect } from "vitest";
import {
  CLIMAX_RESOLUTIONS,
  CLIMAX_THRESHOLD,
  CLIMAX_WINDOW_MS,
  getClimaxResolution,
  shouldAutoResolve,
  shouldOpenClimax,
} from "../convergenceClimax";

describe("convergenceClimax — Phase D.5", () => {
  it("ships exactly 3 bad-options resolutions", () => {
    expect(CLIMAX_RESOLUTIONS.length).toBe(3);
  });

  it("every resolution has a non-empty subHouseDeltas list", () => {
    for (const r of CLIMAX_RESOLUTIONS) {
      expect(r.subHouseDeltas.length).toBeGreaterThan(0);
    }
  });

  it("every resolution resets convergence (closes the window)", () => {
    for (const r of CLIMAX_RESOLUTIONS) {
      expect(r.resetsConvergence).toBe(true);
    }
  });

  it("getClimaxResolution resolves canonical keys", () => {
    expect(getClimaxResolution("climax.sacrifice_a_sector")).toBeDefined();
    expect(getClimaxResolution("does_not_exist")).toBeUndefined();
  });

  it("shouldOpenClimax fires only at threshold and only if dormant", () => {
    expect(shouldOpenClimax(CLIMAX_THRESHOLD, "dormant")).toBe(true);
    expect(shouldOpenClimax(CLIMAX_THRESHOLD - 1, "dormant")).toBe(false);
    expect(shouldOpenClimax(CLIMAX_THRESHOLD + 50, "open")).toBe(false);
    expect(shouldOpenClimax(CLIMAX_THRESHOLD + 50, "resolved")).toBe(false);
  });

  it("shouldAutoResolve fires when window expires + phase open", () => {
    expect(
      shouldAutoResolve({ phase: "open", closesAtMs: 100, now: 200 }),
    ).toBe(true);
    expect(
      shouldAutoResolve({ phase: "open", closesAtMs: 200, now: 100 }),
    ).toBe(false);
    expect(
      shouldAutoResolve({ phase: "dormant", closesAtMs: 100, now: 200 }),
    ).toBe(false);
    expect(
      shouldAutoResolve({ phase: "open", closesAtMs: null, now: 100 }),
    ).toBe(false);
  });

  it("CLIMAX_WINDOW_MS is 72 hours", () => {
    expect(CLIMAX_WINDOW_MS).toBe(72 * 60 * 60 * 1000);
  });
});
