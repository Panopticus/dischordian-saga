import { describe, it, expect } from "vitest";

// Test the loot table logic
// We import from the client data but the logic is pure functions
import {
  rollLootTable,
  rollMultipleDrops,
  getCombatDrops,
  getTradePortDrops,
  getExplorationDrops,
  getCardSacrificeRewards,
  COMBAT_LOOT_TABLES,
  TRADE_LOOT_TABLES,
  EXPLORATION_LOOT_TABLE,
} from "../client/src/data/lootTables";
import { MATERIALS } from "../client/src/data/craftingData";

describe("Loot Tables", () => {
  describe("rollLootTable", () => {
    it("returns a valid drop from a loot table", () => {
      const table = COMBAT_LOOT_TABLES.normal;
      const drop = rollLootTable(table);
      expect(drop).not.toBeNull();
      expect(drop!.materialId).toBeTruthy();
      expect(drop!.quantity).toBeGreaterThan(0);
    });

    it("returns null for empty table", () => {
      const drop = rollLootTable([]);
      expect(drop).toBeNull();
    });

    it("returns drops within min/max quantity range", () => {
      // Run many times to check bounds
      for (let i = 0; i < 50; i++) {
        const table = [{ materialId: "battle_shard", weight: 100, minQty: 2, maxQty: 5 }];
        const drop = rollLootTable(table);
        expect(drop!.quantity).toBeGreaterThanOrEqual(2);
        expect(drop!.quantity).toBeLessThanOrEqual(5);
      }
    });
  });

  describe("rollMultipleDrops", () => {
    it("merges duplicate material drops", () => {
      // Table with only one material — should merge into single drop
      const table = [{ materialId: "battle_shard", weight: 100, minQty: 1, maxQty: 1 }];
      const drops = rollMultipleDrops(table, 5);
      expect(drops).toHaveLength(1);
      expect(drops[0].materialId).toBe("battle_shard");
      expect(drops[0].quantity).toBe(5);
    });

    it("returns empty array for 0 rolls", () => {
      const drops = rollMultipleDrops(COMBAT_LOOT_TABLES.normal, 0);
      expect(drops).toHaveLength(0);
    });
  });

  describe("getCombatDrops", () => {
    it("returns drops for each difficulty", () => {
      for (const diff of ["easy", "normal", "hard", "legendary", "story"]) {
        const drops = getCombatDrops(diff, false, 0);
        expect(drops.length).toBeGreaterThan(0);
        for (const drop of drops) {
          expect(drop.materialId).toBeTruthy();
          expect(drop.quantity).toBeGreaterThan(0);
          // Verify material exists in the master list
          const mat = MATERIALS.find(m => m.id === drop.materialId);
          expect(mat).toBeDefined();
        }
      }
    });

    it("grants bonus drops on perfect wins", () => {
      // Run many times — perfect should sometimes give more total quantity
      let perfectTotal = 0;
      let normalTotal = 0;
      for (let i = 0; i < 100; i++) {
        const perfectDrops = getCombatDrops("normal", true, 0);
        const normalDrops = getCombatDrops("normal", false, 0);
        perfectTotal += perfectDrops.reduce((sum, d) => sum + d.quantity, 0);
        normalTotal += normalDrops.reduce((sum, d) => sum + d.quantity, 0);
      }
      // Perfect wins should yield more on average
      expect(perfectTotal).toBeGreaterThan(normalTotal);
    });

    it("applies win streak bonus", () => {
      let streakTotal = 0;
      let noStreakTotal = 0;
      for (let i = 0; i < 100; i++) {
        const streakDrops = getCombatDrops("normal", false, 10);
        const noStreakDrops = getCombatDrops("normal", false, 0);
        streakTotal += streakDrops.reduce((sum, d) => sum + d.quantity, 0);
        noStreakTotal += noStreakDrops.reduce((sum, d) => sum + d.quantity, 0);
      }
      expect(streakTotal).toBeGreaterThan(noStreakTotal);
    });

    it("handles unknown difficulty gracefully", () => {
      const drops = getCombatDrops("unknown_difficulty", false, 0);
      expect(drops.length).toBeGreaterThan(0);
    });
  });

  describe("getTradePortDrops", () => {
    it("returns drops for each port tier", () => {
      for (const tier of ["common", "rare", "legendary"] as const) {
        const drops = getTradePortDrops(tier);
        expect(drops.length).toBeGreaterThan(0);
        for (const drop of drops) {
          const mat = MATERIALS.find(m => m.id === drop.materialId);
          expect(mat).toBeDefined();
        }
      }
    });

    it("legendary ports give more rolls than common", () => {
      let legendaryTotal = 0;
      let commonTotal = 0;
      for (let i = 0; i < 100; i++) {
        legendaryTotal += getTradePortDrops("legendary").reduce((s, d) => s + d.quantity, 0);
        commonTotal += getTradePortDrops("common").reduce((s, d) => s + d.quantity, 0);
      }
      expect(legendaryTotal).toBeGreaterThan(commonTotal);
    });
  });

  describe("getExplorationDrops", () => {
    it("returns valid drops", () => {
      const drops = getExplorationDrops();
      expect(drops.length).toBeGreaterThan(0);
      for (const drop of drops) {
        const mat = MATERIALS.find(m => m.id === drop.materialId);
        expect(mat).toBeDefined();
      }
    });
  });

  describe("getCardSacrificeRewards", () => {
    it("returns card essence for common cards", () => {
      const rewards = getCardSacrificeRewards("common");
      expect(rewards.length).toBeGreaterThan(0);
      expect(rewards.some(r => r.materialId === "card_essence")).toBe(true);
    });

    it("returns rare essence for rare cards", () => {
      const rewards = getCardSacrificeRewards("rare");
      expect(rewards.some(r => r.materialId === "rare_essence")).toBe(true);
    });

    it("returns legendary essence for epic cards", () => {
      const rewards = getCardSacrificeRewards("epic");
      expect(rewards.some(r => r.materialId === "legendary_essence")).toBe(true);
    });

    it("returns soul fragment for legendary cards", () => {
      const rewards = getCardSacrificeRewards("legendary");
      expect(rewards.some(r => r.materialId === "soul_fragment")).toBe(true);
    });

    it("scales quantity with rarity", () => {
      const commonEssence = getCardSacrificeRewards("common")
        .filter(r => r.materialId === "card_essence")
        .reduce((s, r) => s + r.quantity, 0);
      const rareEssence = getCardSacrificeRewards("rare")
        .filter(r => r.materialId === "card_essence")
        .reduce((s, r) => s + r.quantity, 0);
      expect(rareEssence).toBeGreaterThanOrEqual(commonEssence);
    });
  });

  describe("All loot table materials exist", () => {
    it("all combat loot materials are valid", () => {
      for (const [, table] of Object.entries(COMBAT_LOOT_TABLES)) {
        for (const entry of table) {
          const mat = MATERIALS.find(m => m.id === entry.materialId);
          expect(mat, `Material ${entry.materialId} not found`).toBeDefined();
        }
      }
    });

    it("all trade loot materials are valid", () => {
      for (const [, table] of Object.entries(TRADE_LOOT_TABLES)) {
        for (const entry of table) {
          const mat = MATERIALS.find(m => m.id === entry.materialId);
          expect(mat, `Material ${entry.materialId} not found`).toBeDefined();
        }
      }
    });

    it("all exploration loot materials are valid", () => {
      for (const entry of EXPLORATION_LOOT_TABLE) {
        const mat = MATERIALS.find(m => m.id === entry.materialId);
        expect(mat, `Material ${entry.materialId} not found`).toBeDefined();
      }
    });
  });
});
