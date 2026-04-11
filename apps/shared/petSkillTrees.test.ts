import { describe, it, expect } from "vitest";
import {
  PET_SKILL_TREES,
  getSkillTreeForSpecies,
  parseSkillBonus,
  aggregateSkillEffects,
  canUnlockNode,
  getSkillNodeCost,
} from "./petSkillTrees";

describe("petSkillTrees", () => {
  describe("tree lookup", () => {
    it("returns the default tree for unknown species", () => {
      expect(getSkillTreeForSpecies("totally_unknown")).toBe(PET_SKILL_TREES.default);
    });

    it("returns species-specific trees for the three starters", () => {
      expect(getSkillTreeForSpecies("holographic_fox")).toBe(PET_SKILL_TREES.holographic_fox);
      expect(getSkillTreeForSpecies("data_serpent")).toBe(PET_SKILL_TREES.data_serpent);
      expect(getSkillTreeForSpecies("temporal_kitten")).toBe(PET_SKILL_TREES.temporal_kitten);
    });

    it("every starter tree has 5 nodes per branch (15 total)", () => {
      for (const species of ["holographic_fox", "data_serpent", "temporal_kitten"]) {
        const t = getSkillTreeForSpecies(species);
        expect(t.combat.nodes).toHaveLength(5);
        expect(t.utility.nodes).toHaveLength(5);
        expect(t.social.nodes).toHaveLength(5);
      }
    });
  });

  describe("parseSkillBonus", () => {
    it("parses damage_N as a percent multiplier", () => {
      expect(parseSkillBonus("damage_10")).toEqual({ damageMult: 1.1 });
      expect(parseSkillBonus("damage_25")).toEqual({ damageMult: 1.25 });
    });

    it("parses flat stat bonuses", () => {
      expect(parseSkillBonus("dodge_5")).toEqual({ dodgeBonus: 5 });
      expect(parseSkillBonus("crit_15")).toEqual({ critBonus: 15 });
      expect(parseSkillBonus("regen_8")).toEqual({ regenPerTurn: 8 });
      expect(parseSkillBonus("armor_pen_15")).toEqual({ armorPen: 15 });
    });

    it("parses cooldown reduction as a multiplier", () => {
      expect(parseSkillBonus("cooldown_reduce_15")).toEqual({ cooldownMult: 0.85 });
    });

    it("parses chain / reroll / double-hit as 0-1 fractions", () => {
      expect(parseSkillBonus("chain_15")).toEqual({ chainChance: 0.15 });
      expect(parseSkillBonus("reroll_miss_5")).toEqual({ missRerollChance: 0.05 });
      expect(parseSkillBonus("double_hit_60")).toEqual({ doubleHitFactor: 0.6 });
    });

    it("returns empty effect for non-combat strings", () => {
      expect(parseSkillBonus("hotspot_reveal")).toEqual({});
      expect(parseSkillBonus("ultimate_solar_flare")).toEqual({});
      expect(parseSkillBonus("rage_mode")).toEqual({});
    });
  });

  describe("aggregateSkillEffects", () => {
    it("stacks damage multipliers across unlocked nodes", () => {
      // holographic_fox combat: light_lance (damage_12) — 1.12×
      const effects = aggregateSkillEffects(["light_lance"], "holographic_fox");
      expect(effects.damageMult).toBeCloseTo(1.12);
    });

    it("sums flat dodge bonuses", () => {
      // holographic_fox combat: phase_dodge (dodge_8), default combat: dodge (dodge_5)
      const effects = aggregateSkillEffects(["phase_dodge"], "holographic_fox");
      expect(effects.dodgeBonus).toBe(8);
    });

    it("picks the max of chain chance across nodes (not summed)", () => {
      const effects = aggregateSkillEffects(["photon_chain"], "holographic_fox");
      expect(effects.chainChance).toBeCloseTo(0.15);
    });

    it("aggregates multiple unlocks simultaneously", () => {
      // Lux: light_lance (damage_12) + phase_dodge (dodge_8) + photon_chain (chain_15)
      const effects = aggregateSkillEffects(
        ["light_lance", "phase_dodge", "photon_chain"],
        "holographic_fox",
      );
      expect(effects.damageMult).toBeCloseTo(1.12);
      expect(effects.dodgeBonus).toBe(8);
      expect(effects.chainChance).toBeCloseTo(0.15);
    });

    it("ignores unknown node ids gracefully", () => {
      const effects = aggregateSkillEffects(["light_lance", "does_not_exist"], "holographic_fox");
      expect(effects.damageMult).toBeCloseTo(1.12);
    });
  });

  describe("canUnlockNode", () => {
    it("blocks already-unlocked nodes", () => {
      const result = canUnlockNode("light_lance", "holographic_fox", 5, ["light_lance"]);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toMatch(/already/i);
    });

    it("blocks when skill points are insufficient", () => {
      // radiant_strike costs 2 points and requires light_lance
      const result = canUnlockNode("radiant_strike", "holographic_fox", 1, ["light_lance"]);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toMatch(/skill points/i);
    });

    it("blocks when prerequisite is missing", () => {
      // radiant_strike requires light_lance
      const result = canUnlockNode("radiant_strike", "holographic_fox", 5, []);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toMatch(/prerequisite|requires/i);
    });

    it("allows unlock when cost + prerequisite are satisfied", () => {
      const result = canUnlockNode("radiant_strike", "holographic_fox", 5, ["light_lance"]);
      expect(result.ok).toBe(true);
    });

    it("rejects unknown node ids", () => {
      const result = canUnlockNode("does_not_exist", "holographic_fox", 99, []);
      expect(result.ok).toBe(false);
    });
  });

  describe("getSkillNodeCost", () => {
    it("returns the declared cost for a known node", () => {
      expect(getSkillNodeCost("light_lance", "holographic_fox")).toBe(1);
      expect(getSkillNodeCost("radiant_strike", "holographic_fox")).toBe(2);
      expect(getSkillNodeCost("solar_flare", "holographic_fox")).toBe(3);
    });

    it("returns 0 for unknown nodes", () => {
      expect(getSkillNodeCost("does_not_exist", "holographic_fox")).toBe(0);
    });
  });
});
