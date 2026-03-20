/* ═══════════════════════════════════════════════════
   EQUIPMENT DATA — Types, slot definitions, and item database
   for the paper doll character art system.
   ═══════════════════════════════════════════════════ */

/** Equipment slot types */
export type EquipSlot = "weapon" | "armor" | "helm" | "accessory" | "secondary" | "consumable";

/** Equipment rarity tiers */
export type EquipRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

/** Species type */
export type Species = "demagi" | "quarchon" | "neyon";

/** Character class */
export type CharClass = "engineer" | "oracle" | "assassin" | "soldier" | "spy";

/** Equipment item definition */
export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipSlot;
  rarity: EquipRarity;
  /** Stat bonuses */
  stats: {
    atk?: number;
    def?: number;
    hp?: number;
    speed?: number;
  };
  /** Visual layer key for the paper doll renderer */
  visualKey: string;
  /** Color accent for the item glow */
  glowColor: string;
  /** Description */
  description: string;
  /** Required class (null = any) */
  requiredClass?: CharClass;
  /** Required species (null = any) */
  requiredSpecies?: Species;
  /** Crafting tier required (0 = purchasable/droppable) */
  craftTier?: number;
  /** Source: how this item is obtained */
  source: "starting" | "craft" | "drop" | "quest" | "shop" | "achievement";
}

/** Slot metadata for UI display */
export const SLOT_CONFIG: Record<EquipSlot, {
  label: string;
  icon: string;
  position: { x: number; y: number }; // Position on the paper doll (% from top-left)
  description: string;
}> = {
  helm: {
    label: "HELM",
    icon: "crown",
    position: { x: 50, y: 5 },
    description: "Head protection and neural augments",
  },
  armor: {
    label: "ARMOR",
    icon: "shield",
    position: { x: 50, y: 35 },
    description: "Body armor and defensive plating",
  },
  weapon: {
    label: "WEAPON",
    icon: "sword",
    position: { x: 15, y: 45 },
    description: "Primary offensive equipment",
  },
  secondary: {
    label: "SECONDARY",
    icon: "crosshair",
    position: { x: 85, y: 45 },
    description: "Off-hand weapon or tool",
  },
  accessory: {
    label: "ACCESSORY",
    icon: "gem",
    position: { x: 50, y: 65 },
    description: "Rings, amulets, and augmentation chips",
  },
  consumable: {
    label: "CONSUMABLE",
    icon: "flask",
    position: { x: 50, y: 85 },
    description: "Single-use items and potions",
  },
};

/** Rarity color mapping */
export const RARITY_COLORS: Record<EquipRarity, {
  text: string;
  bg: string;
  border: string;
  glow: string;
  label: string;
}> = {
  common: {
    text: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    glow: "rgba(156,163,175,0.3)",
    label: "Common",
  },
  uncommon: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    glow: "rgba(34,197,94,0.3)",
    label: "Uncommon",
  },
  rare: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "rgba(59,130,246,0.4)",
    label: "Rare",
  },
  epic: {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "rgba(168,85,247,0.4)",
    label: "Epic",
  },
  legendary: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "rgba(245,158,11,0.5)",
    label: "Legendary",
  },
};

/** Species visual config for paper doll base model */
export const SPECIES_VISUALS: Record<Species, {
  name: string;
  bodyColor: string;
  accentColor: string;
  glowColor: string;
  eyeColor: string;
  skinTone: string;
  description: string;
  /** SVG path data for species-specific features */
  features: string[];
}> = {
  demagi: {
    name: "DeMagi",
    bodyColor: "#2a1f4e",
    accentColor: "#7c3aed",
    glowColor: "rgba(124,58,237,0.4)",
    eyeColor: "#a78bfa",
    skinTone: "#d4b896",
    description: "Superhuman elemental wielders with arcane markings",
    features: ["arcane_runes", "elemental_aura", "glowing_veins"],
  },
  quarchon: {
    name: "Quarchon",
    bodyColor: "#1a1a2e",
    accentColor: "#06b6d4",
    glowColor: "rgba(6,182,212,0.4)",
    eyeColor: "#22d3ee",
    skinTone: "#8b9dc3",
    description: "Cybernetic rebels with machine augmentations",
    features: ["circuit_lines", "cyber_eye", "metal_plates"],
  },
  neyon: {
    name: "Ne-Yon",
    bodyColor: "#1a0a2e",
    accentColor: "#f59e0b",
    glowColor: "rgba(245,158,11,0.5)",
    eyeColor: "#fbbf24",
    skinTone: "#c4a882",
    description: "Perfect hybrid of organic life and AI with golden energy",
    features: ["hybrid_veins", "golden_aura", "dual_eyes"],
  },
};

/* ═══════════════════════════════════════════════════
   EQUIPMENT DATABASE — All craftable/droppable items
   ═══════════════════════════════════════════════════ */

export const EQUIPMENT_DB: EquipmentItem[] = [
  // ── STARTING GEAR (given at character creation) ──
  // Engineer
  { id: "diamond_pick_axe", name: "Diamond Pick Axe", slot: "weapon", rarity: "common", stats: { atk: 3 }, visualKey: "axe_basic", glowColor: "#60a5fa", description: "Standard-issue mining tool, surprisingly effective in combat.", requiredClass: "engineer", source: "starting" },
  { id: "repair_kit", name: "Repair Kit", slot: "secondary", rarity: "common", stats: { hp: 10 }, visualKey: "kit_basic", glowColor: "#60a5fa", description: "Field repair kit for quick fixes.", requiredClass: "engineer", source: "starting" },
  { id: "shield_generator", name: "Shield Generator", slot: "consumable", rarity: "common", stats: { def: 2 }, visualKey: "shield_gen", glowColor: "#60a5fa", description: "Deploys a temporary energy shield.", requiredClass: "engineer", source: "starting" },
  // Oracle
  { id: "crossbow", name: "Crossbow", slot: "weapon", rarity: "common", stats: { atk: 4 }, visualKey: "crossbow_basic", glowColor: "#a78bfa", description: "Enchanted crossbow that fires bolts of foresight.", requiredClass: "oracle", source: "starting" },
  { id: "invisibility_potion", name: "Invisibility Potion", slot: "secondary", rarity: "common", stats: { speed: 2 }, visualKey: "potion_invis", glowColor: "#a78bfa", description: "Renders the user temporarily invisible.", requiredClass: "oracle", source: "starting" },
  { id: "random_power_potion", name: "Random Power Potion", slot: "consumable", rarity: "common", stats: { atk: 1, def: 1, hp: 5 }, visualKey: "potion_random", glowColor: "#a78bfa", description: "Grants a random temporary power boost.", requiredClass: "oracle", source: "starting" },
  // Assassin
  { id: "poison_blade", name: "Poison Blade", slot: "weapon", rarity: "common", stats: { atk: 5 }, visualKey: "blade_poison", glowColor: "#34d399", description: "Coated in neurotoxin. Silent and deadly.", requiredClass: "assassin", source: "starting" },
  { id: "throwing_knives", name: "Throwing Knives", slot: "secondary", rarity: "common", stats: { atk: 2 }, visualKey: "knives_throw", glowColor: "#34d399", description: "Balanced for precision throws.", requiredClass: "assassin", source: "starting" },
  { id: "smoke_bomb", name: "Smoke Bomb", slot: "consumable", rarity: "common", stats: { speed: 3 }, visualKey: "bomb_smoke", glowColor: "#34d399", description: "Creates a cloud of concealing smoke.", requiredClass: "assassin", source: "starting" },
  // Soldier
  { id: "plasma_sword", name: "Plasma Sword", slot: "weapon", rarity: "common", stats: { atk: 4, def: 1 }, visualKey: "sword_plasma", glowColor: "#f87171", description: "Superheated plasma edge cuts through anything.", requiredClass: "soldier", source: "starting" },
  { id: "energy_shield", name: "Energy Shield", slot: "secondary", rarity: "common", stats: { def: 3 }, visualKey: "shield_energy", glowColor: "#f87171", description: "Absorbs incoming energy attacks.", requiredClass: "soldier", source: "starting" },
  { id: "stim_pack", name: "Stim Pack", slot: "consumable", rarity: "common", stats: { hp: 15, speed: 1 }, visualKey: "stim_pack", glowColor: "#f87171", description: "Military-grade combat stimulant.", requiredClass: "soldier", source: "starting" },
  // Spy
  { id: "silenced_pistol", name: "Silenced Pistol", slot: "weapon", rarity: "common", stats: { atk: 3, speed: 1 }, visualKey: "pistol_silenced", glowColor: "#94a3b8", description: "Whisper-quiet sidearm for covert ops.", requiredClass: "spy", source: "starting" },
  { id: "cloaking_device", name: "Cloaking Device", slot: "secondary", rarity: "common", stats: { speed: 3 }, visualKey: "cloak_device", glowColor: "#94a3b8", description: "Bends light around the user.", requiredClass: "spy", source: "starting" },
  { id: "emp_grenade", name: "EMP Grenade", slot: "consumable", rarity: "common", stats: { atk: 2, def: 1 }, visualKey: "grenade_emp", glowColor: "#94a3b8", description: "Disables electronics in a wide radius.", requiredClass: "spy", source: "starting" },

  // ── UNCOMMON CRAFTABLE GEAR ──
  { id: "void_helm", name: "Void Helm", slot: "helm", rarity: "uncommon", stats: { def: 2, hp: 5 }, visualKey: "helm_void", glowColor: "#818cf8", description: "Helmet forged from void-touched metal. Protects against psychic attacks.", craftTier: 1, source: "craft" },
  { id: "circuit_vest", name: "Circuit Vest", slot: "armor", rarity: "uncommon", stats: { def: 3, hp: 10 }, visualKey: "armor_circuit", glowColor: "#22d3ee", description: "Lightweight armor woven with conductive fibers.", craftTier: 1, source: "craft" },
  { id: "data_lens", name: "Data Lens", slot: "accessory", rarity: "uncommon", stats: { speed: 2, atk: 1 }, visualKey: "acc_lens", glowColor: "#60a5fa", description: "Augmented reality monocle that highlights weak points.", craftTier: 1, source: "craft" },
  { id: "phase_blade", name: "Phase Blade", slot: "weapon", rarity: "uncommon", stats: { atk: 6 }, visualKey: "blade_phase", glowColor: "#c084fc", description: "Blade that partially exists in another dimension.", craftTier: 1, source: "craft" },

  // ── RARE CRAFTABLE GEAR ──
  { id: "panopticon_visor", name: "Panopticon Visor", slot: "helm", rarity: "rare", stats: { def: 4, hp: 10, speed: 1 }, visualKey: "helm_panopticon", glowColor: "#f472b6", description: "All-seeing visor reverse-engineered from Panopticon surveillance tech.", craftTier: 2, source: "craft" },
  { id: "dreamweave_plate", name: "Dreamweave Plate", slot: "armor", rarity: "rare", stats: { def: 6, hp: 20 }, visualKey: "armor_dreamweave", glowColor: "#a78bfa", description: "Armor infused with crystallized dream energy.", craftTier: 2, source: "craft" },
  { id: "architects_gauntlet", name: "Architect's Gauntlet", slot: "weapon", rarity: "rare", stats: { atk: 8, def: 2 }, visualKey: "gauntlet_architect", glowColor: "#ef4444", description: "Power gauntlet modeled after The Architect's own design.", craftTier: 2, source: "craft" },
  { id: "probability_ring", name: "Probability Ring", slot: "accessory", rarity: "rare", stats: { atk: 3, speed: 3 }, visualKey: "acc_prob_ring", glowColor: "#8b5cf6", description: "Bends probability in the wearer's favor.", craftTier: 2, source: "craft" },
  { id: "neural_disruptor", name: "Neural Disruptor", slot: "secondary", rarity: "rare", stats: { atk: 5, speed: 2 }, visualKey: "disruptor_neural", glowColor: "#06b6d4", description: "Scrambles enemy neural pathways on contact.", craftTier: 2, source: "craft" },

  // ── EPIC CRAFTABLE GEAR ──
  { id: "crown_of_echoes", name: "Crown of Echoes", slot: "helm", rarity: "epic", stats: { def: 6, hp: 15, atk: 3 }, visualKey: "helm_echoes", glowColor: "#f59e0b", description: "Crown that channels the voices of fallen warriors.", craftTier: 3, source: "craft" },
  { id: "void_sentinel_plate", name: "Void Sentinel Plate", slot: "armor", rarity: "epic", stats: { def: 10, hp: 30 }, visualKey: "armor_sentinel", glowColor: "#3b82f6", description: "Full body armor from the Void Sentinel program.", craftTier: 3, source: "craft" },
  { id: "dreamers_edge", name: "Dreamer's Edge", slot: "weapon", rarity: "epic", stats: { atk: 12, speed: 2 }, visualKey: "blade_dreamer", glowColor: "#22c55e", description: "A blade that cuts through reality itself, forged in the Dreamer's vision.", craftTier: 3, source: "craft" },
  { id: "source_fragment", name: "Source Fragment", slot: "accessory", rarity: "epic", stats: { atk: 5, def: 5, hp: 10, speed: 2 }, visualKey: "acc_source", glowColor: "#fbbf24", description: "A shard of The Source's crystallized consciousness.", craftTier: 3, source: "craft" },

  // ── LEGENDARY GEAR (Achievement/Quest rewards) ──
  { id: "architects_crown", name: "The Architect's Crown", slot: "helm", rarity: "legendary", stats: { def: 10, hp: 25, atk: 5, speed: 3 }, visualKey: "helm_architect", glowColor: "#ef4444", description: "The crown of the supreme intelligence. Grants unparalleled tactical awareness.", source: "achievement" },
  { id: "dreamers_mantle", name: "The Dreamer's Mantle", slot: "armor", rarity: "legendary", stats: { def: 15, hp: 50, speed: 5 }, visualKey: "armor_dreamer", glowColor: "#22c55e", description: "Woven from pure dream energy. The Dreamer's own protective garment.", source: "achievement" },
  { id: "iron_lions_mace", name: "Iron Lion's Mace", slot: "weapon", rarity: "legendary", stats: { atk: 18, def: 5 }, visualKey: "mace_iron_lion", glowColor: "#f59e0b", description: "The legendary weapon of Iron Lion, imbued with the strength of a thousand warriors.", source: "achievement" },
  { id: "enigmas_paradox", name: "The Enigma's Paradox", slot: "accessory", rarity: "legendary", stats: { atk: 8, def: 8, hp: 20, speed: 5 }, visualKey: "acc_enigma", glowColor: "#a855f7", description: "An impossible artifact that exists in all timelines simultaneously.", source: "achievement" },

  // ── COMBAT DROP GEAR ──
  { id: "scrap_helm", name: "Scrap Helm", slot: "helm", rarity: "common", stats: { def: 1 }, visualKey: "helm_scrap", glowColor: "#9ca3af", description: "Cobbled together from arena debris.", source: "drop" },
  { id: "arena_vest", name: "Arena Vest", slot: "armor", rarity: "common", stats: { def: 2, hp: 5 }, visualKey: "armor_arena", glowColor: "#9ca3af", description: "Standard arena combatant's vest.", source: "drop" },
  { id: "fighters_band", name: "Fighter's Band", slot: "accessory", rarity: "common", stats: { atk: 1, speed: 1 }, visualKey: "acc_band", glowColor: "#9ca3af", description: "A simple band worn by arena fighters.", source: "drop" },
  { id: "collectors_blade", name: "Collector's Blade", slot: "weapon", rarity: "uncommon", stats: { atk: 7 }, visualKey: "blade_collector", glowColor: "#ef4444", description: "Taken from a defeated champion in the Collector's Arena.", source: "drop" },
  { id: "warlords_pauldron", name: "Warlord's Pauldron", slot: "armor", rarity: "uncommon", stats: { def: 4, hp: 8 }, visualKey: "armor_warlord", glowColor: "#ef4444", description: "Shoulder armor from a fallen warlord.", source: "drop" },
  { id: "oracle_eye", name: "Oracle's Eye", slot: "helm", rarity: "rare", stats: { def: 3, speed: 3, atk: 2 }, visualKey: "helm_oracle_eye", glowColor: "#a78bfa", description: "A mystical eye piece that grants foresight in battle.", source: "drop" },
  { id: "void_shard_ring", name: "Void Shard Ring", slot: "accessory", rarity: "rare", stats: { atk: 4, def: 2, speed: 2 }, visualKey: "acc_void_shard", glowColor: "#8b5cf6", description: "A ring containing a fragment of the void between dimensions.", source: "drop" },

  // ── SHOP GEAR ──
  { id: "traders_helm", name: "Trader's Helm", slot: "helm", rarity: "common", stats: { def: 1, speed: 1 }, visualKey: "helm_trader", glowColor: "#fbbf24", description: "Practical headgear favored by Trade Empire merchants.", source: "shop" },
  { id: "merchants_coat", name: "Merchant's Coat", slot: "armor", rarity: "uncommon", stats: { def: 3, hp: 8, speed: 1 }, visualKey: "armor_merchant", glowColor: "#fbbf24", description: "Reinforced coat with hidden pockets for valuables.", source: "shop" },
  { id: "fortune_charm", name: "Fortune Charm", slot: "accessory", rarity: "uncommon", stats: { speed: 3, hp: 5 }, visualKey: "acc_fortune", glowColor: "#fbbf24", description: "A lucky charm that improves trade negotiations.", source: "shop" },
];

/** Get equipment item by ID */
export function getEquipmentById(id: string): EquipmentItem | undefined {
  return EQUIPMENT_DB.find(e => e.id === id);
}

/** Get all items for a specific slot */
export function getItemsForSlot(slot: EquipSlot): EquipmentItem[] {
  return EQUIPMENT_DB.filter(e => e.slot === slot);
}

/** Get items available for a specific class */
export function getItemsForClass(charClass: CharClass): EquipmentItem[] {
  return EQUIPMENT_DB.filter(e => !e.requiredClass || e.requiredClass === charClass);
}

/** Calculate total stats from equipped items */
export function calculateEquipmentStats(equippedIds: Record<EquipSlot, string | null>): {
  atk: number; def: number; hp: number; speed: number;
} {
  const totals = { atk: 0, def: 0, hp: 0, speed: 0 };
  for (const id of Object.values(equippedIds)) {
    if (!id) continue;
    const item = getEquipmentById(id);
    if (!item) continue;
    totals.atk += item.stats.atk || 0;
    totals.def += item.stats.def || 0;
    totals.hp += item.stats.hp || 0;
    totals.speed += item.stats.speed || 0;
  }
  return totals;
}
