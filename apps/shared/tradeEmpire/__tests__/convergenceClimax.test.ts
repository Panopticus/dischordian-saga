// apps/shared/tradeEmpire/__tests__/convergenceClimax.test.ts

import { describe, it, expect } from "vitest";
import {
  CANONICAL_CLIMAX_RESOLUTION_KEYS,
  CLIMAX_RESOLUTIONS,
  CLIMAX_THRESHOLD,
  CLIMAX_WINDOW_MS,
  getCanonicalClimaxResolutions,
  getClimaxResolution,
  shouldAutoResolve,
  shouldOpenClimax,
} from "../convergenceClimax";

describe("convergenceClimax — Phase D.5", () => {
  it("ships exactly 3 canonical bad-options resolutions", () => {
    expect(getCanonicalClimaxResolutions().length).toBe(3);
    expect(CANONICAL_CLIMAX_RESOLUTION_KEYS).toEqual([
      "climax.trade_sector",
      "climax.withdraw_fleet",
      "climax.negotiate_armistice",
    ]);
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

  it("every canonical resolution ships full narrative content", () => {
    for (const r of getCanonicalClimaxResolutions()) {
      expect(r.narrative.length).toBeGreaterThan(200);
      expect(r.cinematicSummary.length).toBeGreaterThan(80);
      expect(r.npcReactions.length).toBeGreaterThan(0);
      expect(r.cascade.length).toBeGreaterThan(0);
    }
  });

  it("getClimaxResolution resolves both canonical and legacy keys", () => {
    expect(getClimaxResolution("climax.trade_sector")).toBeDefined();
    expect(getClimaxResolution("climax.withdraw_fleet")).toBeDefined();
    expect(getClimaxResolution("climax.negotiate_armistice")).toBeDefined();
    // Legacy aliases preserved for replay determinism.
    expect(getClimaxResolution("climax.sacrifice_a_sector")).toBeDefined();
    expect(getClimaxResolution("climax.broker_a_truce")).toBeDefined();
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
