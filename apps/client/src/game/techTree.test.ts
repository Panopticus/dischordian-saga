import { describe, it, expect } from "vitest";
import {
  ALL_TECHNOLOGIES,
  TECH_SYNERGIES,
  canResearch,
  getActiveSynergies,
  getTotalEffects,
  getTechById,
} from "./techTree";

describe("tech tree — civics fork mutex", () => {
  it("registers all six fork techs", () => {
    const ids = [
      "mil_doctrine_aggression",
      "mil_doctrine_attrition",
      "eco_doctrine_free_market",
      "eco_doctrine_command_economy",
      "dip_doctrine_open",
      "dip_doctrine_realpolitik",
    ];
    for (const id of ids) expect(getTechById(id)).toBeDefined();
  });

  it("declares symmetric mutex pairs", () => {
    const pairs: [string, string][] = [
      ["mil_doctrine_aggression", "mil_doctrine_attrition"],
      ["eco_doctrine_free_market", "eco_doctrine_command_economy"],
      ["dip_doctrine_open", "dip_doctrine_realpolitik"],
    ];
    for (const [a, b] of pairs) {
      expect(getTechById(a)?.mutexWith).toContain(b);
      expect(getTechById(b)?.mutexWith).toContain(a);
    }
  });

  it("blocks researching the sibling once a doctrine is taken", () => {
    expect(canResearch("mil_doctrine_attrition", ["mil_basic_tactics", "mil_armor_plating"])).toBe(true);
    expect(
      canResearch("mil_doctrine_attrition", [
        "mil_basic_tactics",
        "mil_armor_plating",
        "mil_doctrine_aggression",
      ]),
    ).toBe(false);
  });

  it("still respects prerequisites for fork techs", () => {
    expect(canResearch("mil_doctrine_aggression", [])).toBe(false);
    expect(canResearch("mil_doctrine_aggression", ["mil_basic_tactics"])).toBe(true);
  });
});

describe("tech tree — cross-branch synergies", () => {
  it("registers four synergies", () => {
    expect(TECH_SYNERGIES).toHaveLength(4);
    const ids = TECH_SYNERGIES.map(s => s.id).sort();
    expect(ids).toEqual([
      "syn_combined_arms",
      "syn_trade_alliance",
      "syn_trade_diplomacy",
      "syn_void_armada",
    ]);
  });

  it("activates synergies only when every required tech is researched", () => {
    expect(getActiveSynergies(["mil_advanced_weapons"])).toHaveLength(0);
    expect(getActiveSynergies(["mil_advanced_weapons", "dip_espionage"]).map(s => s.id))
      .toEqual(["syn_combined_arms"]);
  });

  it("adds synergy bonuses on top of base effects in getTotalEffects", () => {
    const baseOnly = getTotalEffects(["mil_advanced_weapons"]);
    const withSynergy = getTotalEffects(["mil_advanced_weapons", "dip_espionage"]);
    expect(withSynergy.fleet_combat).toBe((baseOnly.fleet_combat ?? 0) + 5);
    expect(withSynergy.war_points).toBe(5);
  });

  it("references real techs for every synergy", () => {
    for (const synergy of TECH_SYNERGIES) {
      for (const requiredId of synergy.requires) {
        expect(getTechById(requiredId), `Synergy ${synergy.id} references missing tech ${requiredId}`).toBeDefined();
      }
    }
  });
});

describe("tech tree — invariants", () => {
  it("every tech in ALL_TECHNOLOGIES has a unique id", () => {
    const ids = ALL_TECHNOLOGIES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mutex declarations are symmetric across the whole tree", () => {
    for (const tech of ALL_TECHNOLOGIES) {
      for (const otherId of tech.mutexWith ?? []) {
        const other = getTechById(otherId);
        expect(other, `mutex partner ${otherId} of ${tech.id} not found`).toBeDefined();
        expect(other?.mutexWith ?? []).toContain(tech.id);
      }
    }
  });
});
