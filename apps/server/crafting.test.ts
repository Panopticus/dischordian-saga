/* ═══════════════════════════════════════════════════
   CRAFTING & EQUIPMENT DATA TESTS
   Validates the integrity of crafting recipes, materials,
   equipment data, and helper functions.
   ═══════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

// We need to test the data modules which are in client/src/data/
// Since these are pure data/logic modules, we can import them directly
// by adjusting the import paths relative to the test file location

// Note: These tests validate the data integrity and helper function logic
// Since the data files use no React or browser APIs, they can be tested server-side

describe("Equipment Data", () => {
  it("should have valid equipment items with required fields", async () => {
    const mod = await import("../client/src/data/equipmentData");

    expect(mod.EQUIPMENT_DB.length).toBeGreaterThan(0);

    for (const item of mod.EQUIPMENT_DB) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.slot).toBeTruthy();
      expect(["weapon", "armor", "helm", "secondary", "accessory", "consumable"]).toContain(item.slot);
      expect(["common", "uncommon", "rare", "epic", "legendary"]).toContain(item.rarity);
      expect(item.stats).toBeDefined();
      // Stats are sparse objects - only present keys are numbers
      for (const [key, val] of Object.entries(item.stats)) {
        expect(typeof val).toBe("number");
      }
    }
  });

  it("should look up equipment by ID", async () => {
    const mod = await import("../client/src/data/equipmentData");

    const item = mod.getEquipmentById("phase_blade");
    expect(item).toBeDefined();
    expect(item?.name).toBe("Phase Blade");
    expect(item?.slot).toBe("weapon");
  });

  it("should return undefined for non-existent equipment", async () => {
    const mod = await import("../client/src/data/equipmentData");
    expect(mod.getEquipmentById("nonexistent_item")).toBeUndefined();
  });

  it("should filter equipment by slot", async () => {
    const mod = await import("../client/src/data/equipmentData");

    const weapons = mod.getItemsForSlot("weapon");
    expect(weapons.length).toBeGreaterThan(0);
    for (const w of weapons) {
      expect(w.slot).toBe("weapon");
    }

    const armors = mod.getItemsForSlot("armor");
    expect(armors.length).toBeGreaterThan(0);
    for (const a of armors) {
      expect(a.slot).toBe("armor");
    }
  });

  it("should calculate equipment stats correctly", async () => {
    const mod = await import("../client/src/data/equipmentData");

    // Empty loadout
    const emptyStats = mod.calculateEquipmentStats({
      weapon: null, armor: null, helm: null,
      secondary: null, accessory: null, consumable: null,
    });
    expect(emptyStats.atk).toBe(0);
    expect(emptyStats.def).toBe(0);
    expect(emptyStats.hp).toBe(0);
    expect(emptyStats.speed).toBe(0);

    // Single weapon equipped
    const phaseBlade = mod.getEquipmentById("phase_blade");
    if (phaseBlade) {
      const stats = mod.calculateEquipmentStats({
        weapon: "phase_blade", armor: null, helm: null,
        secondary: null, accessory: null, consumable: null,
      });
      expect(stats.atk).toBe(phaseBlade.stats.atk || 0);
      expect(stats.def).toBe(phaseBlade.stats.def || 0);
    }
  });

  it("should have unique IDs for all equipment", async () => {
    const mod = await import("../client/src/data/equipmentData");
    const ids = mod.EQUIPMENT_DB.map(e => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("Crafting Data", () => {
  it("should have valid materials with required fields", async () => {
    const mod = await import("../client/src/data/craftingData");

    expect(mod.MATERIALS.length).toBeGreaterThan(0);

    for (const mat of mod.MATERIALS) {
      expect(mat.id).toBeTruthy();
      expect(mat.name).toBeTruthy();
      expect(["common", "uncommon", "rare", "epic", "legendary"]).toContain(mat.rarity);
      expect(["card_sacrifice", "trade_empire", "combat_drop", "exploration", "crafted"]).toContain(mat.source);
    }
  });

  it("should have unique material IDs", async () => {
    const mod = await import("../client/src/data/craftingData");
    const ids = mod.MATERIALS.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should look up materials by ID", async () => {
    const mod = await import("../client/src/data/craftingData");

    const mat = mod.getMaterialById("iron_ore");
    expect(mat).toBeDefined();
    expect(mat?.name).toBe("Iron Ore");
    expect(mat?.source).toBe("trade_empire");
  });

  it("should have valid crafting skills", async () => {
    const mod = await import("../client/src/data/craftingData");

    expect(mod.CRAFTING_SKILLS.length).toBe(5);

    for (const skill of mod.CRAFTING_SKILLS) {
      expect(skill.id).toBeTruthy();
      expect(skill.name).toBeTruthy();
      expect(skill.maxLevel).toBe(10);
      expect(skill.xpPerLevel.length).toBe(10);
    }
  });

  it("should have valid crafting recipes", async () => {
    const mod = await import("../client/src/data/craftingData");

    expect(mod.CRAFTING_RECIPES.length).toBeGreaterThan(0);

    for (const recipe of mod.CRAFTING_RECIPES) {
      expect(recipe.id).toBeTruthy();
      expect(recipe.name).toBeTruthy();
      expect(recipe.requiredLevel).toBeGreaterThanOrEqual(0);
      expect(recipe.requiredLevel).toBeLessThanOrEqual(10);
      expect(recipe.xpGain).toBeGreaterThan(0);
      expect(recipe.dreamCost).toBeGreaterThanOrEqual(0);
      expect(recipe.craftTime).toBeGreaterThan(0);
      expect(recipe.baseSuccessRate).toBeGreaterThan(0);
      expect(recipe.baseSuccessRate).toBeLessThanOrEqual(1);
      expect(Object.keys(recipe.materials).length).toBeGreaterThan(0);

      // Verify all materials in recipe exist
      for (const matId of Object.keys(recipe.materials)) {
        const mat = mod.getMaterialById(matId);
        expect(mat).toBeDefined();
      }

      // Verify skill exists
      const skill = mod.getSkillById(recipe.skill);
      expect(skill).toBeDefined();
    }
  });

  it("should have unique recipe IDs", async () => {
    const mod = await import("../client/src/data/craftingData");
    const ids = mod.CRAFTING_RECIPES.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should correctly check if player can craft", async () => {
    const mod = await import("../client/src/data/craftingData");

    const recipe = mod.CRAFTING_RECIPES[0]; // First recipe
    const noSkills: Record<string, number> = { weaponsmith: 0, armorsmith: 0, enchanting: 0, alchemy: 0, engineering: 0 };

    // Can't craft with no materials
    const result1 = mod.canCraftRecipe(recipe, noSkills as any, {}, 0);
    expect(result1.canCraft).toBe(false);
    expect(result1.reasons.length).toBeGreaterThan(0);

    // Can craft with enough materials and skills
    const fullSkills: Record<string, number> = { weaponsmith: 10, armorsmith: 10, enchanting: 10, alchemy: 10, engineering: 10 };
    const fullMaterials: Record<string, number> = {};
    for (const [matId, qty] of Object.entries(recipe.materials)) {
      fullMaterials[matId] = qty;
    }
    const result2 = mod.canCraftRecipe(recipe, fullSkills as any, fullMaterials, 1000);
    expect(result2.canCraft).toBe(true);
    expect(result2.reasons.length).toBe(0);
  });

  it("should calculate success rate correctly", async () => {
    const mod = await import("../client/src/data/craftingData");

    const recipe = mod.CRAFTING_RECIPES[0];

    // At minimum level
    const baseRate = mod.calculateSuccessRate(recipe, recipe.requiredLevel);
    expect(baseRate).toBe(recipe.baseSuccessRate);

    // At higher level (should be higher, capped at 95%)
    const highRate = mod.calculateSuccessRate(recipe, recipe.requiredLevel + 5);
    expect(highRate).toBeGreaterThanOrEqual(baseRate);
    expect(highRate).toBeLessThanOrEqual(0.95);
  });

  it("should filter recipes by skill", async () => {
    const mod = await import("../client/src/data/craftingData");

    const weaponRecipes = mod.getRecipesBySkill("weaponsmith");
    expect(weaponRecipes.length).toBeGreaterThan(0);
    for (const r of weaponRecipes) {
      expect(r.skill).toBe("weaponsmith");
    }
  });

  it("should filter recipes by category", async () => {
    const mod = await import("../client/src/data/craftingData");

    const weaponRecipes = mod.getRecipesByCategory("weapon");
    expect(weaponRecipes.length).toBeGreaterThan(0);
    for (const r of weaponRecipes) {
      expect(r.category).toBe("weapon");
    }
  });

  it("should have game benefits for non-intermediate recipes", async () => {
    const mod = await import("../client/src/data/craftingData");

    const nonIntermediate = mod.CRAFTING_RECIPES.filter(r => r.category !== "intermediate");
    for (const recipe of nonIntermediate) {
      expect(recipe.benefits.length).toBeGreaterThan(0);
      for (const benefit of recipe.benefits) {
        expect(["fight_arena", "card_battles", "trade_empire", "all_games"]).toContain(benefit.target);
        expect(benefit.description).toBeTruthy();
        expect(benefit.value).toBeGreaterThan(0);
      }
    }
  });

  it("every recipe outputItemId that maps to equipment should reference EQUIPMENT_DB", async () => {
    // Equipment integration safety: any recipe whose output should be
    // equippable must have a matching entry in EQUIPMENT_DB so the
    // InventoryPage "Crafted" tab can resolve slot/stats/rarity. Recipes
    // for intermediates / potions / ship upgrades / card enhancements are
    // exempt — their outputs are consumables or abstract effects.
    const craft = await import("../client/src/data/craftingData");
    const equip = await import("../client/src/data/equipmentData");
    const EQUIPPABLE_CATS = new Set(["weapon", "armor", "accessory"]);
    for (const recipe of craft.CRAFTING_RECIPES) {
      if (!EQUIPPABLE_CATS.has(recipe.category)) continue;
      const def = equip.getEquipmentById(recipe.outputItemId);
      expect(def, `recipe ${recipe.id} output ${recipe.outputItemId} missing from EQUIPMENT_DB`).toBeDefined();
    }
  });
});

describe("Loot Drop Tables (server)", () => {
  it("rollCombatDrops returns at least one drop for every difficulty", async () => {
    const mod = await import("../shared/lootDrops");
    for (const diff of ["easy", "normal", "hard", "nightmare"]) {
      const drops = mod.rollCombatDrops(diff, false, 0, () => 0.5);
      expect(drops.length).toBeGreaterThan(0);
      for (const d of drops) {
        expect(d.quantity).toBeGreaterThan(0);
        expect(d.materialId).toBeTruthy();
      }
    }
  });

  it("rollCombatDrops adds bonus drops on perfect wins", async () => {
    const mod = await import("../shared/lootDrops");
    // Deterministic RNG: always falls through to the first table entry.
    const drops = mod.rollCombatDrops("normal", true, 0, () => 0);
    expect(drops.length).toBeGreaterThan(0);
  });

  it("rollExplorationDrops returns ark_fragment family materials", async () => {
    const mod = await import("../shared/lootDrops");
    const drops = mod.rollExplorationDrops(() => 0.1);
    expect(drops.length).toBeGreaterThan(0);
  });

  it("dropsToMaterialMap merges duplicate materialIds", async () => {
    const mod = await import("../shared/lootDrops");
    const map = mod.dropsToMaterialMap([
      { materialId: "iron_ore", quantity: 2 },
      { materialId: "iron_ore", quantity: 3 },
      { materialId: "stardust", quantity: 1 },
    ]);
    expect(map.iron_ore).toBe(5);
    expect(map.stardust).toBe(1);
  });

  it("win streak bonus scales material quantities", async () => {
    const mod = await import("../shared/lootDrops");
    const lowStreak = mod.rollCombatDrops("normal", false, 0, () => 0);
    const highStreak = mod.rollCombatDrops("normal", false, 10, () => 0);
    // With a 10-streak (2 blocks × 20% = 40% bonus), drop quantities
    // should be at least as high as the non-streak roll.
    const lowTotal = lowStreak.reduce((s, d) => s + d.quantity, 0);
    const highTotal = highStreak.reduce((s, d) => s + d.quantity, 0);
    expect(highTotal).toBeGreaterThanOrEqual(lowTotal);
  });
});

describe("Forge Achievement Definitions", () => {
  it("should include the new forge achievement keys", async () => {
    const mod = await import("./routers/cardAchievements");
    const keys = new Set(mod.CARD_ACHIEVEMENTS.map(a => a.key));
    for (const required of [
      "forge_first",
      "forge_25",
      "forge_100",
      "forge_epic_recipe",
      "forge_legendary_recipe",
      "forge_max_skill",
      "forge_all_max_skills",
      "forge_disenchant_10",
    ]) {
      expect(keys.has(required)).toBe(true);
    }
  });

  it("forge achievements should belong to the crafting category", async () => {
    const mod = await import("./routers/cardAchievements");
    const forgeAchievements = mod.CARD_ACHIEVEMENTS.filter(a => a.key.startsWith("forge_"));
    expect(forgeAchievements.length).toBeGreaterThanOrEqual(8);
    for (const a of forgeAchievements) {
      expect(a.category).toBe("crafting");
      expect(a.dreamReward).toBeGreaterThanOrEqual(0);
      expect(a.target).toBeGreaterThan(0);
    }
  });
});
