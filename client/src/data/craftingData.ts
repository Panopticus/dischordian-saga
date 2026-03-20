/* ═══════════════════════════════════════════════════
   CRAFTING ECONOMY DATA — Skills, recipes, materials,
   and progression for the Forge crafting system.

   Design principles:
   - Crafting is a significant time & economy sink
   - All items provide REAL gameplay benefits to 3 core games
   - Multiple skill trees that level through use
   - Materials come from: card sacrifice, Trade Empire, combat drops
   ═══════════════════════════════════════════════════ */

/* ── MATERIAL TYPES ── */
export type MaterialSource = "card_sacrifice" | "trade_empire" | "combat_drop" | "exploration" | "crafted";

export interface Material {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  source: MaterialSource;
  sourceDetail: string;
  /** Color for UI display */
  color: string;
}

export const MATERIALS: Material[] = [
  // ── Card Sacrifice Materials ──
  { id: "card_essence", name: "Card Essence", icon: "💧", description: "Raw essence extracted from sacrificed cards. The foundation of all crafting.", rarity: "common", source: "card_sacrifice", sourceDetail: "Sacrifice any card in the Card Lab", color: "#60a5fa" },
  { id: "rare_essence", name: "Rare Essence", icon: "💎", description: "Concentrated essence from rare cards. Contains powerful resonance patterns.", rarity: "uncommon", source: "card_sacrifice", sourceDetail: "Sacrifice rare or higher cards", color: "#a78bfa" },
  { id: "legendary_essence", name: "Legendary Essence", icon: "⭐", description: "Essence of legendary power. Extremely potent crafting catalyst.", rarity: "rare", source: "card_sacrifice", sourceDetail: "Sacrifice legendary cards", color: "#fbbf24" },
  { id: "soul_fragment", name: "Soul Fragment", icon: "🔮", description: "A fragment of a card's soul. Required for the most powerful enchantments.", rarity: "epic", source: "card_sacrifice", sourceDetail: "Sacrifice 5+ cards of the same character", color: "#f472b6" },

  // ── Trade Empire Materials ──
  { id: "iron_ore", name: "Iron Ore", icon: "⛏️", description: "Raw iron mined from asteroid belts. Essential for armor and weapons.", rarity: "common", source: "trade_empire", sourceDetail: "Mine at asteroid belt sectors", color: "#94a3b8" },
  { id: "crystal_shard", name: "Crystal Shard", icon: "💠", description: "Crystalline fragments with energy-conducting properties.", rarity: "uncommon", source: "trade_empire", sourceDetail: "Trade at crystal nebula ports", color: "#22d3ee" },
  { id: "void_metal", name: "Void Metal", icon: "🌑", description: "Metal infused with void energy. Incredibly strong and lightweight.", rarity: "rare", source: "trade_empire", sourceDetail: "Rare trade goods from deep space sectors", color: "#6366f1" },
  { id: "quantum_flux", name: "Quantum Flux", icon: "⚡", description: "Unstable quantum energy captured in containment. Used for reality-bending crafts.", rarity: "epic", source: "trade_empire", sourceDetail: "Harvest from wormhole sectors", color: "#f59e0b" },
  { id: "stardust", name: "Stardust", icon: "✨", description: "Cosmic dust from dying stars. Universal crafting enhancer.", rarity: "common", source: "trade_empire", sourceDetail: "Collect from any nebula sector", color: "#e2e8f0" },

  // ── Combat Drop Materials ──
  { id: "battle_shard", name: "Battle Shard", icon: "⚔️", description: "Crystallized combat energy. Dropped by defeated opponents.", rarity: "common", source: "combat_drop", sourceDetail: "Win fights in the Arena", color: "#ef4444" },
  { id: "champions_mark", name: "Champion's Mark", icon: "🏆", description: "Proof of exceptional combat prowess. Rare arena drop.", rarity: "uncommon", source: "combat_drop", sourceDetail: "Win 3+ fights in a row", color: "#f59e0b" },
  { id: "void_catalyst", name: "Void Catalyst", icon: "🌀", description: "A catalyst that bends reality. Extremely rare combat drop.", rarity: "rare", source: "combat_drop", sourceDetail: "Defeat hard+ difficulty opponents", color: "#8b5cf6" },
  { id: "architects_tear", name: "Architect's Tear", icon: "👁️", description: "A tear shed by the Architect himself. The rarest crafting material.", rarity: "legendary", source: "combat_drop", sourceDetail: "Defeat legendary difficulty opponents", color: "#ef4444" },

  // ── Exploration Materials ──
  { id: "ark_fragment", name: "Ark Fragment", icon: "🚀", description: "Piece of ancient Ark technology. Found in hidden rooms.", rarity: "uncommon", source: "exploration", sourceDetail: "Discover hidden Ark rooms", color: "#06b6d4" },
  { id: "dream_crystal", name: "Dream Crystal", icon: "🔷", description: "Crystallized dream energy from the Dreamer's domain.", rarity: "rare", source: "exploration", sourceDetail: "Find in morality-gated Ark areas", color: "#3b82f6" },

  // ── Crafted Intermediate Materials ──
  { id: "refined_alloy", name: "Refined Alloy", icon: "🔩", description: "Processed metal alloy. Used in advanced armor and weapon crafting.", rarity: "uncommon", source: "crafted", sourceDetail: "Craft from Iron Ore + Stardust", color: "#9ca3af" },
  { id: "enchanted_crystal", name: "Enchanted Crystal", icon: "🔮", description: "Crystal infused with card essence. Channels magical energy.", rarity: "rare", source: "crafted", sourceDetail: "Craft from Crystal Shard + Card Essence", color: "#c084fc" },
  { id: "void_ingot", name: "Void Ingot", icon: "⬛", description: "Purified void metal ingot. The strongest known material.", rarity: "epic", source: "crafted", sourceDetail: "Craft from Void Metal + Quantum Flux", color: "#4338ca" },
];

export function getMaterialById(id: string): Material | undefined {
  return MATERIALS.find(m => m.id === id);
}

/* ── CRAFTING SKILLS ── */
export type CraftingSkillId = "weaponsmith" | "armorsmith" | "enchanting" | "alchemy" | "engineering";

export interface CraftingSkill {
  id: CraftingSkillId;
  name: string;
  icon: string;
  description: string;
  color: string;
  maxLevel: number;
  /** XP needed per level (cumulative) */
  xpPerLevel: number[];
}

export const CRAFTING_SKILLS: CraftingSkill[] = [
  {
    id: "weaponsmith",
    name: "Weaponsmithing",
    icon: "⚔️",
    description: "Forge weapons of increasing power. Higher levels unlock rare and epic weapon recipes.",
    color: "#ef4444",
    maxLevel: 10,
    xpPerLevel: [0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000],
  },
  {
    id: "armorsmith",
    name: "Armorsmithing",
    icon: "🛡️",
    description: "Craft protective armor and helms. Higher levels unlock stronger defensive gear.",
    color: "#3b82f6",
    maxLevel: 10,
    xpPerLevel: [0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000],
  },
  {
    id: "enchanting",
    name: "Enchanting",
    icon: "✨",
    description: "Imbue items with magical properties. Enchant accessories and enhance card powers.",
    color: "#a855f7",
    maxLevel: 10,
    xpPerLevel: [0, 40, 100, 190, 310, 470, 680, 950, 1300, 1750],
  },
  {
    id: "alchemy",
    name: "Alchemy",
    icon: "🧪",
    description: "Brew potions and consumables. Create powerful one-use items for combat and trade.",
    color: "#22c55e",
    maxLevel: 10,
    xpPerLevel: [0, 30, 80, 150, 250, 380, 550, 770, 1050, 1400],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "⚙️",
    description: "Build ship upgrades and tech gadgets. Enhance Trade Empire ships and craft utility items.",
    color: "#f59e0b",
    maxLevel: 10,
    xpPerLevel: [0, 60, 140, 260, 420, 640, 920, 1280, 1720, 2300],
  },
];

export function getSkillById(id: CraftingSkillId): CraftingSkill | undefined {
  return CRAFTING_SKILLS.find(s => s.id === id);
}

/* ── RECIPE CATEGORIES ── */
export type RecipeCategory = "weapon" | "armor" | "accessory" | "potion" | "ship_upgrade" | "card_enhancement" | "intermediate";

/* ── GAME BENEFIT TYPES ── */
export type GameBenefitTarget = "fight_arena" | "card_battles" | "trade_empire" | "all_games";

export interface GameBenefit {
  target: GameBenefitTarget;
  description: string;
  /** Specific stat or mechanic affected */
  mechanic: string;
  /** Numerical value of the benefit */
  value: number;
}

/* ── CRAFTING RECIPES ── */
export interface CraftingRecipe {
  id: string;
  name: string;
  category: RecipeCategory;
  description: string;
  /** Required crafting skill */
  skill: CraftingSkillId;
  /** Minimum skill level required */
  requiredLevel: number;
  /** XP gained for crafting this recipe */
  xpGain: number;
  /** Materials required: { materialId: quantity } */
  materials: Record<string, number>;
  /** Dream Token cost */
  dreamCost: number;
  /** Crafting time in seconds (real-time) */
  craftTime: number;
  /** Output item ID (from equipmentData) or special item */
  outputItemId: string;
  /** Output quantity */
  outputQuantity: number;
  /** Game benefits this crafted item provides */
  benefits: GameBenefit[];
  /** Rarity of the output */
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  /** Success rate (0-1) at minimum level */
  baseSuccessRate: number;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  // ═══ INTERMEDIATE MATERIALS ═══
  {
    id: "recipe_refined_alloy", name: "Refined Alloy", category: "intermediate",
    description: "Smelt iron ore with stardust to create a durable alloy.",
    skill: "armorsmith", requiredLevel: 1, xpGain: 15,
    materials: { iron_ore: 3, stardust: 2 }, dreamCost: 2, craftTime: 10,
    outputItemId: "refined_alloy", outputQuantity: 1,
    benefits: [], rarity: "uncommon", baseSuccessRate: 0.95,
  },
  {
    id: "recipe_enchanted_crystal", name: "Enchanted Crystal", category: "intermediate",
    description: "Infuse a crystal shard with card essence to create a magical conduit.",
    skill: "enchanting", requiredLevel: 2, xpGain: 25,
    materials: { crystal_shard: 2, card_essence: 5 }, dreamCost: 5, craftTime: 15,
    outputItemId: "enchanted_crystal", outputQuantity: 1,
    benefits: [], rarity: "rare", baseSuccessRate: 0.90,
  },
  {
    id: "recipe_void_ingot", name: "Void Ingot", category: "intermediate",
    description: "Purify void metal with quantum flux to create the strongest known material.",
    skill: "engineering", requiredLevel: 5, xpGain: 60,
    materials: { void_metal: 2, quantum_flux: 1 }, dreamCost: 15, craftTime: 30,
    outputItemId: "void_ingot", outputQuantity: 1,
    benefits: [], rarity: "epic", baseSuccessRate: 0.75,
  },

  // ═══ WEAPONS ═══
  {
    id: "recipe_phase_blade", name: "Phase Blade", category: "weapon",
    description: "A blade that partially exists in another dimension. Cuts through armor.",
    skill: "weaponsmith", requiredLevel: 2, xpGain: 30,
    materials: { refined_alloy: 2, card_essence: 8, battle_shard: 5 }, dreamCost: 10, craftTime: 20,
    outputItemId: "phase_blade", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+6 Attack in Fight Arena", mechanic: "atk_bonus", value: 6 },
      { target: "card_battles", description: "+1 ATK to all cards in deck", mechanic: "card_atk_bonus", value: 1 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.85,
  },
  {
    id: "recipe_architects_gauntlet", name: "Architect's Gauntlet", category: "weapon",
    description: "A power gauntlet modeled after The Architect's own design. Devastating in combat.",
    skill: "weaponsmith", requiredLevel: 5, xpGain: 80,
    materials: { void_ingot: 2, enchanted_crystal: 1, champions_mark: 3, soul_fragment: 1 }, dreamCost: 30, craftTime: 45,
    outputItemId: "architects_gauntlet", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+8 Attack, +2 Defense in Fight Arena", mechanic: "atk_def_bonus", value: 10 },
      { target: "card_battles", description: "+2 ATK to all cards in deck", mechanic: "card_atk_bonus", value: 2 },
    ],
    rarity: "rare", baseSuccessRate: 0.70,
  },
  {
    id: "recipe_dreamers_edge", name: "Dreamer's Edge", category: "weapon",
    description: "A blade that cuts through reality itself, forged in the Dreamer's vision.",
    skill: "weaponsmith", requiredLevel: 8, xpGain: 150,
    materials: { void_ingot: 4, dream_crystal: 2, architects_tear: 1, legendary_essence: 3 }, dreamCost: 75, craftTime: 90,
    outputItemId: "dreamers_edge", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+12 Attack, +2 Speed in Fight Arena", mechanic: "atk_speed_bonus", value: 14 },
      { target: "card_battles", description: "+3 ATK to all cards, -1 cost to first card played", mechanic: "card_atk_cost_bonus", value: 3 },
      { target: "trade_empire", description: "+15% combat damage vs pirates", mechanic: "pirate_damage_bonus", value: 15 },
    ],
    rarity: "epic", baseSuccessRate: 0.50,
  },

  // ═══ ARMOR ═══
  {
    id: "recipe_circuit_vest", name: "Circuit Vest", category: "armor",
    description: "Lightweight armor woven with conductive fibers. Good all-around protection.",
    skill: "armorsmith", requiredLevel: 1, xpGain: 20,
    materials: { iron_ore: 5, stardust: 3, card_essence: 3 }, dreamCost: 8, craftTime: 15,
    outputItemId: "circuit_vest", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+3 Defense, +10 HP in Fight Arena", mechanic: "def_hp_bonus", value: 13 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.90,
  },
  {
    id: "recipe_dreamweave_plate", name: "Dreamweave Plate", category: "armor",
    description: "Armor infused with crystallized dream energy. Exceptional protection.",
    skill: "armorsmith", requiredLevel: 5, xpGain: 75,
    materials: { refined_alloy: 3, enchanted_crystal: 2, dream_crystal: 1, rare_essence: 5 }, dreamCost: 25, craftTime: 40,
    outputItemId: "dreamweave_plate", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+6 Defense, +20 HP in Fight Arena", mechanic: "def_hp_bonus", value: 26 },
      { target: "card_battles", description: "+1 HP to all cards in deck", mechanic: "card_hp_bonus", value: 1 },
    ],
    rarity: "rare", baseSuccessRate: 0.65,
  },
  {
    id: "recipe_void_sentinel_plate", name: "Void Sentinel Plate", category: "armor",
    description: "Full body armor from the Void Sentinel program. Near-impenetrable.",
    skill: "armorsmith", requiredLevel: 8, xpGain: 140,
    materials: { void_ingot: 5, dream_crystal: 3, soul_fragment: 2, architects_tear: 1 }, dreamCost: 60, craftTime: 80,
    outputItemId: "void_sentinel_plate", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+10 Defense, +30 HP in Fight Arena", mechanic: "def_hp_bonus", value: 40 },
      { target: "card_battles", description: "+2 HP to all cards, +1 DEF to all cards", mechanic: "card_hp_def_bonus", value: 3 },
      { target: "trade_empire", description: "+20% hull integrity for ships", mechanic: "hull_bonus", value: 20 },
    ],
    rarity: "epic", baseSuccessRate: 0.45,
  },

  // ═══ HELMS ═══
  {
    id: "recipe_void_helm", name: "Void Helm", category: "armor",
    description: "Helmet forged from void-touched metal. Protects against psychic attacks.",
    skill: "armorsmith", requiredLevel: 2, xpGain: 25,
    materials: { refined_alloy: 1, card_essence: 5, battle_shard: 3 }, dreamCost: 8, craftTime: 15,
    outputItemId: "void_helm", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+2 Defense, +5 HP in Fight Arena", mechanic: "def_hp_bonus", value: 7 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.90,
  },
  {
    id: "recipe_panopticon_visor", name: "Panopticon Visor", category: "armor",
    description: "All-seeing visor reverse-engineered from Panopticon surveillance tech.",
    skill: "armorsmith", requiredLevel: 5, xpGain: 65,
    materials: { enchanted_crystal: 2, void_metal: 1, champions_mark: 2 }, dreamCost: 20, craftTime: 35,
    outputItemId: "panopticon_visor", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+4 Defense, +10 HP, +1 Speed", mechanic: "def_hp_speed_bonus", value: 15 },
      { target: "card_battles", description: "See opponent's next card before it's played", mechanic: "card_preview", value: 1 },
    ],
    rarity: "rare", baseSuccessRate: 0.70,
  },
  {
    id: "recipe_crown_of_echoes", name: "Crown of Echoes", category: "armor",
    description: "Crown that channels the voices of fallen warriors.",
    skill: "armorsmith", requiredLevel: 7, xpGain: 120,
    materials: { void_ingot: 2, soul_fragment: 3, legendary_essence: 2, dream_crystal: 2 }, dreamCost: 45, craftTime: 60,
    outputItemId: "crown_of_echoes", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+6 Defense, +15 HP, +3 Attack", mechanic: "all_stats_bonus", value: 24 },
      { target: "card_battles", description: "+1 to all card stats", mechanic: "card_all_bonus", value: 1 },
      { target: "trade_empire", description: "+10% trade profit margins", mechanic: "trade_profit_bonus", value: 10 },
    ],
    rarity: "epic", baseSuccessRate: 0.55,
  },

  // ═══ ACCESSORIES ═══
  {
    id: "recipe_data_lens", name: "Data Lens", category: "accessory",
    description: "Augmented reality monocle that highlights weak points.",
    skill: "enchanting", requiredLevel: 2, xpGain: 25,
    materials: { crystal_shard: 3, card_essence: 5, stardust: 3 }, dreamCost: 8, craftTime: 12,
    outputItemId: "data_lens", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+2 Speed, +1 Attack", mechanic: "speed_atk_bonus", value: 3 },
      { target: "card_battles", description: "Draw 1 extra card at start of battle", mechanic: "extra_draw", value: 1 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.85,
  },
  {
    id: "recipe_probability_ring", name: "Probability Ring", category: "accessory",
    description: "Bends probability in the wearer's favor.",
    skill: "enchanting", requiredLevel: 5, xpGain: 70,
    materials: { enchanted_crystal: 2, quantum_flux: 1, rare_essence: 3, void_catalyst: 1 }, dreamCost: 25, craftTime: 35,
    outputItemId: "probability_ring", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "+3 Attack, +3 Speed", mechanic: "atk_speed_bonus", value: 6 },
      { target: "card_battles", description: "+10% crit chance for all cards", mechanic: "crit_bonus", value: 10 },
      { target: "trade_empire", description: "+5% chance of finding rare goods", mechanic: "rare_goods_bonus", value: 5 },
    ],
    rarity: "rare", baseSuccessRate: 0.65,
  },
  {
    id: "recipe_source_fragment", name: "Source Fragment", category: "accessory",
    description: "A shard of The Source's crystallized consciousness.",
    skill: "enchanting", requiredLevel: 8, xpGain: 140,
    materials: { void_ingot: 2, dream_crystal: 3, architects_tear: 1, soul_fragment: 2, legendary_essence: 2 }, dreamCost: 60, craftTime: 75,
    outputItemId: "source_fragment", outputQuantity: 1,
    benefits: [
      { target: "all_games", description: "+5 to all stats, +10 HP, +2 Speed", mechanic: "all_stats_mega", value: 22 },
      { target: "card_battles", description: "+2 to all card stats, draw 1 extra card", mechanic: "card_mega_bonus", value: 2 },
      { target: "trade_empire", description: "+15% all trade bonuses", mechanic: "trade_all_bonus", value: 15 },
    ],
    rarity: "epic", baseSuccessRate: 0.40,
  },

  // ═══ POTIONS (Consumables) ═══
  {
    id: "recipe_health_potion", name: "Health Potion", category: "potion",
    description: "Restores health during combat. A staple of any fighter's kit.",
    skill: "alchemy", requiredLevel: 1, xpGain: 10,
    materials: { card_essence: 2, stardust: 1 }, dreamCost: 1, craftTime: 5,
    outputItemId: "health_potion", outputQuantity: 3,
    benefits: [
      { target: "fight_arena", description: "Restore 25 HP during combat (one-time use)", mechanic: "heal", value: 25 },
    ],
    rarity: "common", baseSuccessRate: 0.95,
  },
  {
    id: "recipe_berserker_elixir", name: "Berserker Elixir", category: "potion",
    description: "Temporarily boosts attack power at the cost of defense.",
    skill: "alchemy", requiredLevel: 3, xpGain: 30,
    materials: { card_essence: 5, battle_shard: 3, rare_essence: 1 }, dreamCost: 5, craftTime: 10,
    outputItemId: "berserker_elixir", outputQuantity: 2,
    benefits: [
      { target: "fight_arena", description: "+5 Attack, -2 Defense for one fight", mechanic: "temp_atk_boost", value: 5 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.85,
  },
  {
    id: "recipe_fortune_draught", name: "Fortune Draught", category: "potion",
    description: "Increases luck for one Trade Empire voyage.",
    skill: "alchemy", requiredLevel: 3, xpGain: 25,
    materials: { stardust: 5, crystal_shard: 2, card_essence: 3 }, dreamCost: 5, craftTime: 10,
    outputItemId: "fortune_draught", outputQuantity: 2,
    benefits: [
      { target: "trade_empire", description: "+20% profit on next trade", mechanic: "trade_profit_temp", value: 20 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.90,
  },
  {
    id: "recipe_void_elixir", name: "Void Elixir", category: "potion",
    description: "Grants temporary invulnerability. Extremely powerful.",
    skill: "alchemy", requiredLevel: 7, xpGain: 100,
    materials: { void_catalyst: 2, dream_crystal: 1, legendary_essence: 1 }, dreamCost: 30, craftTime: 40,
    outputItemId: "void_elixir", outputQuantity: 1,
    benefits: [
      { target: "fight_arena", description: "Immune to damage for 2 turns", mechanic: "invulnerability", value: 2 },
    ],
    rarity: "epic", baseSuccessRate: 0.50,
  },

  // ═══ SHIP UPGRADES (Trade Empire) ═══
  {
    id: "recipe_cargo_expansion", name: "Cargo Bay Expansion", category: "ship_upgrade",
    description: "Expand your ship's cargo capacity for more profitable voyages.",
    skill: "engineering", requiredLevel: 2, xpGain: 30,
    materials: { iron_ore: 8, refined_alloy: 2, stardust: 5 }, dreamCost: 10, craftTime: 20,
    outputItemId: "cargo_expansion", outputQuantity: 1,
    benefits: [
      { target: "trade_empire", description: "+50 cargo capacity", mechanic: "cargo_bonus", value: 50 },
    ],
    rarity: "uncommon", baseSuccessRate: 0.90,
  },
  {
    id: "recipe_warp_drive_mk2", name: "Warp Drive Mk.II", category: "ship_upgrade",
    description: "Upgraded warp drive for faster interstellar travel.",
    skill: "engineering", requiredLevel: 4, xpGain: 55,
    materials: { refined_alloy: 3, quantum_flux: 1, crystal_shard: 4, champions_mark: 2 }, dreamCost: 20, craftTime: 30,
    outputItemId: "warp_drive_mk2", outputQuantity: 1,
    benefits: [
      { target: "trade_empire", description: "+2 warp range, -20% fuel cost", mechanic: "warp_bonus", value: 2 },
    ],
    rarity: "rare", baseSuccessRate: 0.75,
  },
  {
    id: "recipe_shield_matrix", name: "Shield Matrix", category: "ship_upgrade",
    description: "Advanced shield system for your trading vessel.",
    skill: "engineering", requiredLevel: 6, xpGain: 90,
    materials: { void_ingot: 2, enchanted_crystal: 2, ark_fragment: 2 }, dreamCost: 35, craftTime: 45,
    outputItemId: "shield_matrix", outputQuantity: 1,
    benefits: [
      { target: "trade_empire", description: "+30% shield strength, auto-repair", mechanic: "shield_bonus", value: 30 },
      { target: "fight_arena", description: "+3 Defense from ship systems", mechanic: "ship_def_bonus", value: 3 },
    ],
    rarity: "rare", baseSuccessRate: 0.65,
  },
  {
    id: "recipe_quantum_scanner", name: "Quantum Scanner", category: "ship_upgrade",
    description: "Reveals hidden trade routes and rare sector events.",
    skill: "engineering", requiredLevel: 8, xpGain: 130,
    materials: { void_ingot: 3, quantum_flux: 3, dream_crystal: 2, architects_tear: 1 }, dreamCost: 50, craftTime: 60,
    outputItemId: "quantum_scanner", outputQuantity: 1,
    benefits: [
      { target: "trade_empire", description: "Reveal hidden sectors, +25% rare event chance", mechanic: "scanner_bonus", value: 25 },
    ],
    rarity: "epic", baseSuccessRate: 0.50,
  },

  // ═══ CARD ENHANCEMENTS ═══
  {
    id: "recipe_card_polish", name: "Card Polish", category: "card_enhancement",
    description: "Polish a card to increase its base stats slightly.",
    skill: "enchanting", requiredLevel: 1, xpGain: 15,
    materials: { card_essence: 3, stardust: 2 }, dreamCost: 3, craftTime: 8,
    outputItemId: "card_polish", outputQuantity: 1,
    benefits: [
      { target: "card_battles", description: "+1 ATK or +1 HP to target card (permanent)", mechanic: "card_stat_up", value: 1 },
    ],
    rarity: "common", baseSuccessRate: 0.95,
  },
  {
    id: "recipe_essence_infusion", name: "Essence Infusion", category: "card_enhancement",
    description: "Infuse a card with rare essence to significantly boost its power.",
    skill: "enchanting", requiredLevel: 4, xpGain: 50,
    materials: { rare_essence: 3, enchanted_crystal: 1, battle_shard: 5 }, dreamCost: 15, craftTime: 25,
    outputItemId: "essence_infusion", outputQuantity: 1,
    benefits: [
      { target: "card_battles", description: "+2 ATK and +2 HP to target card (permanent)", mechanic: "card_stat_up", value: 4 },
    ],
    rarity: "rare", baseSuccessRate: 0.70,
  },
  {
    id: "recipe_soul_binding", name: "Soul Binding", category: "card_enhancement",
    description: "Bind a soul fragment to a card, granting it a special ability.",
    skill: "enchanting", requiredLevel: 7, xpGain: 110,
    materials: { soul_fragment: 2, legendary_essence: 1, dream_crystal: 1, void_catalyst: 2 }, dreamCost: 40, craftTime: 50,
    outputItemId: "soul_binding", outputQuantity: 1,
    benefits: [
      { target: "card_battles", description: "+3 ATK, +3 HP, and special ability to target card", mechanic: "card_mega_enhance", value: 6 },
    ],
    rarity: "epic", baseSuccessRate: 0.45,
  },
];

export function getRecipeById(id: string): CraftingRecipe | undefined {
  return CRAFTING_RECIPES.find(r => r.id === id);
}

export function getRecipesBySkill(skillId: CraftingSkillId): CraftingRecipe[] {
  return CRAFTING_RECIPES.filter(r => r.skill === skillId);
}

export function getRecipesByCategory(category: RecipeCategory): CraftingRecipe[] {
  return CRAFTING_RECIPES.filter(r => r.category === category);
}

/** Check if player can craft a recipe given their materials and skill levels */
export function canCraftRecipe(
  recipe: CraftingRecipe,
  skillLevels: Record<CraftingSkillId, number>,
  materials: Record<string, number>,
  dreamTokens: number,
): { canCraft: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check skill level
  const currentLevel = skillLevels[recipe.skill] || 0;
  if (currentLevel < recipe.requiredLevel) {
    reasons.push(`Requires ${recipe.skill} level ${recipe.requiredLevel} (current: ${currentLevel})`);
  }

  // Check materials
  for (const [matId, qty] of Object.entries(recipe.materials)) {
    const have = materials[matId] || 0;
    if (have < qty) {
      const mat = getMaterialById(matId);
      reasons.push(`Need ${qty} ${mat?.name || matId} (have ${have})`);
    }
  }

  // Check dream tokens
  if (dreamTokens < recipe.dreamCost) {
    reasons.push(`Need ${recipe.dreamCost} Dream Tokens (have ${dreamTokens})`);
  }

  return { canCraft: reasons.length === 0, reasons };
}

/** Calculate actual success rate based on skill level above minimum */
export function calculateSuccessRate(recipe: CraftingRecipe, skillLevel: number): number {
  const levelAboveMin = Math.max(0, skillLevel - recipe.requiredLevel);
  // Each level above minimum adds 5% success rate, capped at 95%
  return Math.min(0.95, recipe.baseSuccessRate + levelAboveMin * 0.05);
}

/** Get the rarity color for a material */
export function getMaterialRarityColor(rarity: Material["rarity"]): string {
  const map = {
    common: "#9ca3af",
    uncommon: "#22c55e",
    rare: "#3b82f6",
    epic: "#a855f7",
    legendary: "#f59e0b",
  };
  return map[rarity];
}

/** Category display info */
export const CATEGORY_INFO: Record<RecipeCategory, { label: string; icon: string; color: string }> = {
  weapon: { label: "Weapons", icon: "⚔️", color: "#ef4444" },
  armor: { label: "Armor & Helms", icon: "🛡️", color: "#3b82f6" },
  accessory: { label: "Accessories", icon: "💎", color: "#a855f7" },
  potion: { label: "Potions", icon: "🧪", color: "#22c55e" },
  ship_upgrade: { label: "Ship Upgrades", icon: "🚀", color: "#f59e0b" },
  card_enhancement: { label: "Card Enhancements", icon: "✨", color: "#ec4899" },
  intermediate: { label: "Materials", icon: "🔩", color: "#94a3b8" },
};
