import { describe, it, expect } from "vitest";
import {
  ARENA_OPPONENT_POOLS,
  ARENA_TIER_CONFIGS,
  getArenaTierDef,
  buildOpponent,
} from "./petArenaOpponents";

describe("petArenaOpponents", () => {
  describe("data integrity", () => {
    it("every tier has a non-empty opponent pool", () => {
      for (const [tier, pool] of Object.entries(ARENA_OPPONENT_POOLS)) {
        expect(pool.length).toBeGreaterThanOrEqual(3);
        void tier;
      }
    });

    it("every tier config has a matching pool", () => {
      for (const cfg of ARENA_TIER_CONFIGS) {
        expect(ARENA_OPPONENT_POOLS[cfg.id]).toBeDefined();
      }
    });

    it("getArenaTierDef returns the expected ids", () => {
      expect(getArenaTierDef("bronze_gauntlet")?.minEvolution).toBe(1);
      expect(getArenaTierDef("silver_circle")?.minEvolution).toBe(2);
      expect(getArenaTierDef("gold_coliseum")?.minEvolution).toBe(3);
      expect(getArenaTierDef("nonexistent")).toBeUndefined();
    });
  });

  describe("buildOpponent", () => {
    it("picks a template from the correct tier pool (seeded)", () => {
      const op = buildOpponent("bronze_gauntlet", { evolutionStage: 1, bond: 20 }, { seed: 0 });
      const poolPetIds = ARENA_OPPONENT_POOLS.bronze_gauntlet.map((t) => t.petId);
      expect(poolPetIds.some((id) => op.petId.startsWith(id))).toBe(true);
    });

    it("uses the tier's minimum evolution stage", () => {
      const bronze = buildOpponent("bronze_gauntlet", { evolutionStage: 3, bond: 80 }, { seed: 1 });
      expect(bronze.evolutionStage).toBe(1);

      const silver = buildOpponent("silver_circle", { evolutionStage: 1, bond: 10 }, { seed: 1 });
      expect(silver.evolutionStage).toBe(2);

      const gold = buildOpponent("gold_coliseum", { evolutionStage: 1, bond: 5 }, { seed: 1 });
      expect(gold.evolutionStage).toBe(3);
    });

    it("scales bond into the tier's band (never exceeds 100)", () => {
      const op = buildOpponent("gold_coliseum", { evolutionStage: 3, bond: 100 }, { seed: 7 });
      expect(op.bond).toBeGreaterThanOrEqual(1);
      expect(op.bond).toBeLessThanOrEqual(100);
    });

    it("bond is at least the template's baselineBond", () => {
      const op = buildOpponent("silver_circle", { evolutionStage: 2, bond: 1 }, { seed: 0 });
      const template = ARENA_OPPONENT_POOLS.silver_circle[0 % ARENA_OPPONENT_POOLS.silver_circle.length];
      expect(op.bond).toBeGreaterThanOrEqual(template.baselineBond);
    });

    it("different seeds can produce different templates", () => {
      // With 4 bronze templates, seeds 0..3 should cover all; seed 0 and 1
      // should be distinct templates.
      const a = buildOpponent("bronze_gauntlet", { evolutionStage: 1, bond: 20 }, { seed: 0 });
      const b = buildOpponent("bronze_gauntlet", { evolutionStage: 1, bond: 20 }, { seed: 1 });
      expect(a.species).not.toBe(b.species);
    });

    it("returns a name + flavor from the template", () => {
      const op = buildOpponent("bronze_gauntlet", { evolutionStage: 1, bond: 20 }, { seed: 0 });
      expect(op.name).toBeTruthy();
      expect(op.flavor).toBeTruthy();
      expect(["bruiser", "glass_cannon", "tank", "skirmisher"]).toContain(op.archetype);
    });

    it("unknown tier falls back to bronze", () => {
      // @ts-expect-error testing fallback path
      const op = buildOpponent("nonexistent_tier", { evolutionStage: 1, bond: 20 }, { seed: 0 });
      expect(op.evolutionStage).toBe(1);
    });
  });
});
