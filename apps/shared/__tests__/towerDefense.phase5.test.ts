// apps/shared/__tests__/towerDefense.phase5.test.ts
//
// Phase 5 (items-matter / GoT arc) — TD munitions + faction-rep
// raid suppression.

import { describe, it, expect } from "vitest";
import {
  allKnownMunitionRefs,
  applyFactionRepRaidSuppression,
  getMunitionEffect,
} from "../towerDefense";

describe("munitions catalog", () => {
  it("ships a non-empty catalog", () => {
    expect(allKnownMunitionRefs().length).toBeGreaterThan(0);
  });

  it("getMunitionEffect resolves canonical refs", () => {
    expect(getMunitionEffect("potion:berserker_elixir")?.aoeDamage).toBe(30);
    expect(getMunitionEffect("potion:void_elixir")?.invulnWaves).toBe(2);
    expect(getMunitionEffect("potion:fortune_draught")?.lootMultiplier).toBe(1.25);
  });

  it("returns null for unknown / empty refs", () => {
    expect(getMunitionEffect(null)).toBeNull();
    expect(getMunitionEffect(undefined)).toBeNull();
    expect(getMunitionEffect("")).toBeNull();
    expect(getMunitionEffect("garbage:item")).toBeNull();
  });

  it("every catalog entry has at least one mechanical effect", () => {
    for (const ref of allKnownMunitionRefs()) {
      const e = getMunitionEffect(ref);
      expect(e).not.toBeNull();
      const hasEffect =
        (e?.aoeDamage ?? 0) > 0 ||
        (e?.invulnWaves ?? 0) > 0 ||
        (e?.lootMultiplier ?? 0) > 0;
      expect(hasEffect, ref).toBe(true);
    }
  });
});

describe("applyFactionRepRaidSuppression", () => {
  const baseWeights = {
    new_babylon: 10,
    hierarchy: 10,
    insurgency: 10,
    antiquarian: 10,
  };

  it("high rep suppresses raid weight from that faction", () => {
    const out = applyFactionRepRaidSuppression(baseWeights, {
      new_babylon: 75,
      hierarchy: 0,
    });
    expect(out.new_babylon).toBeLessThan(baseWeights.new_babylon);
    expect(out.hierarchy).toBe(baseWeights.hierarchy);
  });

  it("low rep amplifies raid weight from that faction", () => {
    const out = applyFactionRepRaidSuppression(baseWeights, {
      hierarchy: -75,
    });
    expect(out.hierarchy).toBeGreaterThan(baseWeights.hierarchy);
  });

  it("missing rep entries treat the faction as neutral", () => {
    const out = applyFactionRepRaidSuppression(baseWeights, {});
    expect(out).toEqual(baseWeights);
  });

  it("never produces negative weights", () => {
    const out = applyFactionRepRaidSuppression(
      { hierarchy: 5 },
      { hierarchy: 100 },
    );
    expect(out.hierarchy).toBeGreaterThanOrEqual(0);
  });

  it("preserves all keys from rawWeights", () => {
    const out = applyFactionRepRaidSuppression(baseWeights, { hierarchy: -50 });
    expect(Object.keys(out).sort()).toEqual(Object.keys(baseWeights).sort());
  });
});
