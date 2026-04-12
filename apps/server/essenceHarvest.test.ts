/* ═══════════════════════════════════════════════════════
   Essence Harvest — registry + rarity derivation invariants
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  ESSENCES,
  DEFAULT_ESSENCE,
  getEssenceDef,
  deriveHarvestRarity,
  maxRarity,
  computeStackedBonus,
  DIFFICULTY_RARITY_TABLE,
  RARITY_ORDER_EXPORT,
  type EssenceRarity,
} from "../client/src/game/essenceHarvest";

describe("Essence Harvest — registry", () => {
  it("should have at least one essence per starter faction", () => {
    // Key roster entries that drive the Collectors Arena story must
    // have essences defined, otherwise harvest falls back to DEFAULT.
    const required = [
      "architect", "collector", "enigma", "warlord",
      "necromancer", "meme", "source", "jailer", "prisoner",
      "agent-zero", "iron-lion", "wraith-calder", "akai-shi",
      "white-oracle", "human", "warden", "degen",
    ];
    for (const id of required) {
      expect(ESSENCES[id], `missing essence for ${id}`).toBeDefined();
    }
  });

  it("every essence should have matching fighterId in the key", () => {
    for (const [id, def] of Object.entries(ESSENCES)) {
      expect(def.fighterId).toBe(id);
    }
  });

  it("every essence should have non-empty name, flavor, bonus description", () => {
    for (const [id, def] of Object.entries(ESSENCES)) {
      expect(def.name, `${id} missing name`).toBeTruthy();
      expect(def.flavor, `${id} missing flavor`).toBeTruthy();
      expect(def.bonus.description, `${id} missing bonus description`).toBeTruthy();
      expect(def.bonus.valuePerStack, `${id} valuePerStack`).toBeGreaterThan(0);
      expect(def.bonus.maxStacks, `${id} maxStacks`).toBeGreaterThanOrEqual(1);
    }
  });

  it("every essence rarity should be a valid rarity token", () => {
    const valid: EssenceRarity[] = ["common", "rare", "epic", "legendary", "mythic"];
    for (const [id, def] of Object.entries(ESSENCES)) {
      expect(valid, `${id} rarity`).toContain(def.baseRarity);
    }
  });

  it("getEssenceDef falls back to DEFAULT for unknown fighter", () => {
    const def = getEssenceDef("__nonexistent__");
    expect(def.name).toBe(DEFAULT_ESSENCE.name);
    expect(def.fighterId).toBe("__nonexistent__");
  });

  it("getEssenceDef returns registry entry for known fighter", () => {
    const def = getEssenceDef("collector");
    expect(def.name).toBe(ESSENCES.collector.name);
    expect(def.fighterId).toBe("collector");
  });
});

describe("Essence Harvest — rarity derivation", () => {
  it("maxRarity always picks the higher rank", () => {
    expect(maxRarity("common", "rare")).toBe("rare");
    expect(maxRarity("rare", "common")).toBe("rare");
    expect(maxRarity("mythic", "common")).toBe("mythic");
    expect(maxRarity("epic", "epic")).toBe("epic");
  });

  it("DIFFICULTY_RARITY_TABLE maps all 4 difficulty tiers", () => {
    expect(DIFFICULTY_RARITY_TABLE.easy).toBe("common");
    expect(DIFFICULTY_RARITY_TABLE.normal).toBe("rare");
    expect(DIFFICULTY_RARITY_TABLE.hard).toBe("epic");
    expect(DIFFICULTY_RARITY_TABLE.nightmare).toBe("legendary");
  });

  it("derive always honors the baseRarity floor", () => {
    // A legendary-base fighter on easy should still give at least legendary
    const rarity = deriveHarvestRarity("legendary", "easy", false);
    expect(rarity).toBe("legendary");
  });

  it("perfect win lifts rarity one rank", () => {
    const rarity = deriveHarvestRarity("common", "easy", true);
    expect(rarity).toBe("rare");
  });

  it("perfect win on mythic caps at mythic", () => {
    const rarity = deriveHarvestRarity("mythic", "nightmare", true);
    expect(rarity).toBe("mythic");
  });

  it("hard difficulty gives at least epic", () => {
    const rarity = deriveHarvestRarity("common", "hard", false);
    expect(rarity).toBe("epic");
  });

  it("RARITY_ORDER_EXPORT matches the 5-rank scheme", () => {
    expect(RARITY_ORDER_EXPORT).toEqual(["common", "rare", "epic", "legendary", "mythic"]);
  });
});

describe("Essence Harvest — stack math", () => {
  it("computeStackedBonus scales linearly up to maxStacks", () => {
    const def = ESSENCES.architect; // +2 attack per stack, maxStacks=3
    expect(computeStackedBonus(def, 0)).toBe(0);
    expect(computeStackedBonus(def, 1)).toBe(2);
    expect(computeStackedBonus(def, 2)).toBe(4);
    expect(computeStackedBonus(def, 3)).toBe(6);
  });

  it("computeStackedBonus caps at maxStacks", () => {
    const def = ESSENCES.architect; // maxStacks=3
    expect(computeStackedBonus(def, 99)).toBe(6); // capped at 3 stacks × 2
  });

  it("computeStackedBonus handles negative gracefully", () => {
    expect(computeStackedBonus(ESSENCES.architect, -5)).toBe(0);
  });
});
