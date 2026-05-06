// apps/shared/__tests__/dischordiaCycle.phase5.test.ts
//
// Phase 5 (items-matter / GoT arc) — item-tagged energy nudges.

import { describe, it, expect } from "vitest";
import {
  applyEnergyGain,
  applyEnergyGainForFaction,
  factionEnergyNudge,
  DEFAULT_DISCHORDIA_CYCLE_STATE,
} from "../dischordiaCycle";

describe("factionEnergyNudge", () => {
  it("Light-leaning factions nudge light only", () => {
    expect(factionEnergyNudge("antiquarian").light).toBeGreaterThan(0);
    expect(factionEnergyNudge("antiquarian").dark).toBe(0);
    expect(factionEnergyNudge("thaloria").light).toBeGreaterThan(0);
  });

  it("Dark-leaning factions nudge dark only", () => {
    expect(factionEnergyNudge("hierarchy").dark).toBeGreaterThan(0);
    expect(factionEnergyNudge("hierarchy").light).toBe(0);
    expect(factionEnergyNudge("thought_virus").dark).toBeGreaterThan(0);
  });

  it("Politics-not-metaphysics factions are neutral", () => {
    expect(factionEnergyNudge("new_babylon")).toEqual({ light: 0, dark: 0 });
    expect(factionEnergyNudge("insurgency")).toEqual({ light: 0, dark: 0 });
  });

  it("unknown / null falls through to neutral", () => {
    expect(factionEnergyNudge(null)).toEqual({ light: 0, dark: 0 });
    expect(factionEnergyNudge(undefined)).toEqual({ light: 0, dark: 0 });
    expect(factionEnergyNudge("does_not_exist")).toEqual({ light: 0, dark: 0 });
  });
});

describe("applyEnergyGainForFaction", () => {
  it("matches applyEnergyGain when factionId is null", () => {
    const a = applyEnergyGain(DEFAULT_DISCHORDIA_CYCLE_STATE, "casino_win");
    const b = applyEnergyGainForFaction(DEFAULT_DISCHORDIA_CYCLE_STATE, "casino_win", null);
    expect(a.lightEnergy).toBe(b.lightEnergy);
    expect(a.darkEnergy).toBe(b.darkEnergy);
  });

  it("adds the faction nudge on top of the action's baseline", () => {
    const base = applyEnergyGain(DEFAULT_DISCHORDIA_CYCLE_STATE, "casino_win");
    const tagged = applyEnergyGainForFaction(
      DEFAULT_DISCHORDIA_CYCLE_STATE,
      "casino_win",
      "antiquarian",
    );
    expect(tagged.lightEnergy).toBe(base.lightEnergy + factionEnergyNudge("antiquarian").light);
    expect(tagged.darkEnergy).toBe(base.darkEnergy + factionEnergyNudge("antiquarian").dark);
  });

  it("returns input state on unknown action id", () => {
    const out = applyEnergyGainForFaction(
      DEFAULT_DISCHORDIA_CYCLE_STATE,
      "does_not_exist" as never,
      "antiquarian",
    );
    expect(out).toEqual(DEFAULT_DISCHORDIA_CYCLE_STATE);
  });
});
