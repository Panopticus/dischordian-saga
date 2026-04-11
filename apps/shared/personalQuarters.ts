/**
 * PERSONAL QUARTERS / HIDEOUT / CABIN
 * ══════════════════════════════════════════════════════════
 * Consolidated player housing system.
 *
 * Originally the codebase had two parallel systems:
 *   - `personalQuarters` — server-wired, persisted, 120+ RPG-gated items,
 *                          multi-zone, visit system.
 *   - `playerCabin`      — UI-only, no persistence, but with visual slot
 *                          maps, 8 lighting presets, music box, companion
 *                          visits, and narrative trust-gated items.
 *
 * This module merges the best of both:
 *   - Backend: Personal Quarters' schema, router, and RPG gating.
 *   - Frontend: Cabin's visual slot maps (ZONE_SLOT_MAPS), lighting
 *               presets (LIGHTING_PRESETS), music tracks (MUSIC_TRACKS),
 *               and companion visits (COMPANION_VISITS).
 *
 * RPG IMPACT:
 * - Class → unlocks class-themed furniture sets
 * - Species → unlocks species-themed decorations
 * - Prestige → unlocks prestige-tier luxury items
 * - Civil skills → Craftsmanship unlocks crafted items, Lore unlocks study items
 * - Morality → Machine vs Humanity themed sets
 * - Achievements → trophy displays, badge frames
 * - Boss Mastery → boss kill trophies
 * - Seasonal Events → event-exclusive decorations
 * - Companion Trust → narrative gift items + unique lighting/music
 */

import type { CharacterClass } from "./classMastery";

export type ItemCategory = "furniture" | "wall_art" | "floor" | "lighting" | "trophy" | "plant" | "tech" | "weapon_rack" | "bookshelf" | "pet" | "ambient" | "luxury";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type RoomZone = "main" | "bedroom" | "study" | "armory" | "garden" | "vault";

/** Visual slot types used by ZONE_SLOT_MAPS for room rendering. */
export type SlotType = "wall" | "shelf" | "desk" | "floor" | "ceiling" | "window";

export interface DecorationItem {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
  color: string;
  /** Grid size [width, height] */
  gridSize: [number, number];
  /** Cost in dreams */
  cost: number;
  /** Unlock requirements */
  requiredClass?: CharacterClass;
  requiredSpecies?: string;
  requiredPrestige?: string;
  requiredCivilSkill?: { skill: string; level: number };
  requiredAchievement?: string;
  requiredMorality?: { path: "machine" | "humanity"; minScore: number };
  requiredLevel?: number;
  /** Boss mastery requirement: must have killed this boss N times */
  requiredBossKill?: { bossKey: string; kills: number };
  /** Seasonal event requirement: must have participated in this event */
  requiredSeasonalEvent?: string;
  /** Passive bonus when placed */
  passiveBonus?: { type: string; value: number; label: string };
}

export interface RoomLayout {
  zone: RoomZone;
  name: string;
  gridWidth: number;
  gridHeight: number;
  /** Level required to unlock this zone */
  requiredLevel: number;
  /** Civil skill to unlock */
  requiredCivilSkill?: { skill: string; level: number };
}

export const ROOM_ZONES: RoomLayout[] = [
  { zone: "main", name: "Main Hall", gridWidth: 8, gridHeight: 6, requiredLevel: 1 },
  { zone: "bedroom", name: "Private Quarters", gridWidth: 6, gridHeight: 5, requiredLevel: 5 },
  { zone: "study", name: "Study", gridWidth: 5, gridHeight: 5, requiredLevel: 8, requiredCivilSkill: { skill: "lore", level: 2 } },
  { zone: "armory", name: "Armory", gridWidth: 6, gridHeight: 4, requiredLevel: 12, requiredCivilSkill: { skill: "tactics", level: 3 } },
  { zone: "garden", name: "Zen Garden", gridWidth: 7, gridHeight: 5, requiredLevel: 15, requiredCivilSkill: { skill: "craftsmanship", level: 3 } },
  { zone: "vault", name: "Treasure Vault", gridWidth: 5, gridHeight: 5, requiredLevel: 20, requiredCivilSkill: { skill: "perception", level: 4 } },
];

/* ═══ 120+ DECORATION ITEMS ═══ */
export const DECORATION_ITEMS: DecorationItem[] = [
  // ── COMMON FURNITURE (10) ──
  { key: "basic_desk", name: "Standard Desk", description: "A simple but functional desk", icon: "Table", category: "furniture", rarity: "common", color: "#78716c", gridSize: [2, 1], cost: 10 },
  { key: "basic_chair", name: "Office Chair", description: "Ergonomic seating", icon: "Armchair", category: "furniture", rarity: "common", color: "#78716c", gridSize: [1, 1], cost: 5 },
  { key: "basic_bed", name: "Standard Bunk", description: "Military-grade sleeping quarters", icon: "Bed", category: "furniture", rarity: "common", color: "#78716c", gridSize: [2, 2], cost: 15 },
  { key: "basic_shelf", name: "Metal Shelf", description: "Industrial storage unit", icon: "Archive", category: "bookshelf", rarity: "common", color: "#78716c", gridSize: [2, 1], cost: 8 },
  { key: "basic_lamp", name: "Desk Lamp", description: "Adjustable task lighting", icon: "Lamp", category: "lighting", rarity: "common", color: "#fbbf24", gridSize: [1, 1], cost: 5 },
  { key: "basic_rug", name: "Standard Rug", description: "A plain but comfortable rug", icon: "Square", category: "floor", rarity: "common", color: "#a3a3a3", gridSize: [3, 2], cost: 12 },
  { key: "basic_plant", name: "Potted Fern", description: "A hardy fern in a ceramic pot", icon: "Leaf", category: "plant", rarity: "common", color: "#22c55e", gridSize: [1, 1], cost: 8 },
  { key: "basic_poster", name: "Motivational Poster", description: "HANG IN THERE", icon: "Image", category: "wall_art", rarity: "common", color: "#60a5fa", gridSize: [1, 1], cost: 5 },
  { key: "basic_clock", name: "Wall Clock", description: "Keeps time across dimensions", icon: "Clock", category: "wall_art", rarity: "common", color: "#a3a3a3", gridSize: [1, 1], cost: 7 },
  { key: "basic_monitor", name: "Holo-Monitor", description: "Standard holographic display", icon: "Monitor", category: "tech", rarity: "common", color: "#38bdf8", gridSize: [2, 1], cost: 15 },

  // ── COMMON EXTRAS (10) ──
  { key: "cactus", name: "Space Cactus", description: "Thrives in any atmosphere", icon: "Leaf", category: "plant", rarity: "common", color: "#22c55e", gridSize: [1, 1], cost: 6 },
  { key: "wall_screen", name: "Wall Screen", description: "Displays news feeds", icon: "Tv", category: "tech", rarity: "common", color: "#38bdf8", gridSize: [2, 1], cost: 12 },
  { key: "filing_cabinet", name: "Filing Cabinet", description: "Organized chaos", icon: "FolderOpen", category: "furniture", rarity: "common", color: "#78716c", gridSize: [1, 1], cost: 8 },
  { key: "coat_rack", name: "Coat Rack", description: "Hang your disguises", icon: "Shirt", category: "furniture", rarity: "common", color: "#78716c", gridSize: [1, 1], cost: 5 },
  { key: "trash_can", name: "Incinerator Bin", description: "Destroy evidence", icon: "Trash", category: "furniture", rarity: "common", color: "#78716c", gridSize: [1, 1], cost: 3 },
  { key: "mini_fridge", name: "Mini Fridge", description: "Cold drinks, warm heart", icon: "Refrigerator", category: "furniture", rarity: "common", color: "#e2e8f0", gridSize: [1, 1], cost: 10 },
  { key: "dart_board", name: "Dart Board", description: "Practice your aim", icon: "Target", category: "wall_art", rarity: "common", color: "#ef4444", gridSize: [1, 1], cost: 8 },
  { key: "whiteboard", name: "Whiteboard", description: "Plan your next move", icon: "PenSquare", category: "wall_art", rarity: "common", color: "#e2e8f0", gridSize: [2, 1], cost: 10 },
  { key: "floor_mat", name: "Welcome Mat", description: "Welcome to my lair", icon: "Square", category: "floor", rarity: "common", color: "#78716c", gridSize: [2, 1], cost: 5 },
  { key: "candle_set", name: "Candle Set", description: "Atmospheric lighting", icon: "Flame", category: "lighting", rarity: "common", color: "#fbbf24", gridSize: [1, 1], cost: 7 },

  // ── UNCOMMON (20) ──
  { key: "leather_couch", name: "Leather Couch", description: "Comfortable synthetic leather", icon: "Sofa", category: "furniture", rarity: "uncommon", color: "#92400e", gridSize: [3, 1], cost: 30 },
  { key: "neon_sign", name: "Neon Sign", description: "Custom neon wall sign", icon: "Lightbulb", category: "lighting", rarity: "uncommon", color: "#f472b6", gridSize: [2, 1], cost: 25 },
  { key: "aquarium", name: "Holographic Aquarium", description: "Fish from across the galaxy", icon: "Fish", category: "ambient", rarity: "uncommon", color: "#22d3ee", gridSize: [2, 1], cost: 35 },
  { key: "weapon_display", name: "Weapon Display Case", description: "Show off your arsenal", icon: "Sword", category: "weapon_rack", rarity: "uncommon", color: "#dc2626", gridSize: [2, 1], cost: 28 },
  { key: "bookcase", name: "Mahogany Bookcase", description: "Filled with forbidden texts", icon: "BookOpen", category: "bookshelf", rarity: "uncommon", color: "#92400e", gridSize: [2, 2], cost: 32 },
  { key: "globe", name: "Holographic Globe", description: "Rotating map of known worlds", icon: "Globe", category: "tech", rarity: "uncommon", color: "#3b82f6", gridSize: [1, 1], cost: 22 },
  { key: "bonsai", name: "Ancient Bonsai", description: "A 500-year-old miniature tree", icon: "TreePine", category: "plant", rarity: "uncommon", color: "#16a34a", gridSize: [1, 1], cost: 20 },
  { key: "persian_rug", name: "Dimensional Rug", description: "Woven with interdimensional thread", icon: "Square", category: "floor", rarity: "uncommon", color: "#dc2626", gridSize: [4, 3], cost: 40 },
  { key: "star_map", name: "Star Map", description: "Interactive stellar cartography", icon: "Star", category: "wall_art", rarity: "uncommon", color: "#6366f1", gridSize: [2, 2], cost: 35 },
  { key: "coffee_machine", name: "Quantum Coffee Maker", description: "Brews coffee from parallel universes", icon: "Coffee", category: "tech", rarity: "uncommon", color: "#78716c", gridSize: [1, 1], cost: 18 },
  { key: "vinyl_player", name: "Vinyl Player", description: "Old-school music", icon: "Disc3", category: "tech", rarity: "uncommon", color: "#78716c", gridSize: [1, 1], cost: 25 },
  { key: "telescope", name: "Telescope", description: "Observe distant stars", icon: "Telescope", category: "tech", rarity: "uncommon", color: "#6366f1", gridSize: [1, 2], cost: 35 },
  { key: "chess_set", name: "Holographic Chess Set", description: "Play chess with holograms", icon: "Crown", category: "furniture", rarity: "uncommon", color: "#78716c", gridSize: [2, 2], cost: 40 },
  { key: "punching_bag", name: "Punching Bag", description: "Work out your frustrations", icon: "Dumbbell", category: "furniture", rarity: "uncommon", color: "#dc2626", gridSize: [1, 2], cost: 22 },
  { key: "zen_fountain", name: "Zen Fountain", description: "Peaceful water sounds", icon: "Droplets", category: "ambient", rarity: "uncommon", color: "#06b6d4", gridSize: [2, 1], cost: 30 },
  { key: "lava_lamp", name: "Lava Lamp", description: "Mesmerizing blob movement", icon: "Lightbulb", category: "lighting", rarity: "uncommon", color: "#f97316", gridSize: [1, 1], cost: 15 },
  { key: "terrarium", name: "Terrarium", description: "A tiny ecosystem", icon: "Leaf", category: "plant", rarity: "uncommon", color: "#22c55e", gridSize: [1, 1], cost: 20 },
  { key: "photo_wall", name: "Photo Wall", description: "Memories across timelines", icon: "Image", category: "wall_art", rarity: "uncommon", color: "#f472b6", gridSize: [3, 1], cost: 28 },
  { key: "mini_bar", name: "Mini Bar", description: "Drinks from across the galaxy", icon: "Wine", category: "furniture", rarity: "uncommon", color: "#92400e", gridSize: [2, 1], cost: 35 },
  { key: "robot_butler", name: "Robot Butler", description: "At your service", icon: "Bot", category: "pet", rarity: "uncommon", color: "#a3a3a3", gridSize: [1, 1], cost: 40 },

  // ── RARE (10) ──
  { key: "holo_fireplace", name: "Holographic Fireplace", description: "Warm without the fire hazard", icon: "Flame", category: "ambient", rarity: "rare", color: "#f97316", gridSize: [3, 1], cost: 60, passiveBonus: { type: "comfort", value: 5, label: "+5% XP when visiting" } },
  { key: "crystal_chandelier", name: "Crystal Chandelier", description: "Prismatic light from rare crystals", icon: "Sparkles", category: "lighting", rarity: "rare", color: "#e2e8f0", gridSize: [2, 2], cost: 75 },
  { key: "war_table", name: "War Planning Table", description: "Tactical holographic war table", icon: "Map", category: "furniture", rarity: "rare", color: "#1e3a5f", gridSize: [3, 2], cost: 80, requiredClass: "soldier" },
  { key: "spy_terminal", name: "Spy Terminal", description: "Encrypted intelligence terminal", icon: "Terminal", category: "tech", rarity: "rare", color: "#22c55e", gridSize: [2, 1], cost: 70, requiredClass: "spy" },
  { key: "oracle_pool", name: "Scrying Pool", description: "See visions of the future", icon: "Eye", category: "ambient", rarity: "rare", color: "#8b5cf6", gridSize: [2, 2], cost: 85, requiredClass: "oracle" },
  { key: "forge_station", name: "Personal Forge", description: "Miniature crafting forge", icon: "Hammer", category: "tech", rarity: "rare", color: "#f59e0b", gridSize: [2, 2], cost: 90, requiredClass: "engineer" },
  { key: "shadow_altar", name: "Shadow Altar", description: "An altar pulsing with dark energy", icon: "Moon", category: "ambient", rarity: "rare", color: "#6d28d9", gridSize: [2, 2], cost: 85, requiredClass: "assassin" },
  { key: "trophy_case", name: "Trophy Display Case", description: "Display your achievements", icon: "Trophy", category: "trophy", rarity: "rare", color: "#fbbf24", gridSize: [2, 1], cost: 50, passiveBonus: { type: "prestige", value: 10, label: "+10 prestige when visited" } },
  { key: "meditation_mat", name: "Meditation Mat", description: "Center your mind and spirit", icon: "Flower", category: "floor", rarity: "rare", color: "#a78bfa", gridSize: [2, 2], cost: 45 },
  { key: "music_box", name: "Dimensional Music Box", description: "Plays melodies from other timelines", icon: "Music", category: "ambient", rarity: "rare", color: "#ec4899", gridSize: [1, 1], cost: 55 },

  // ── SPECIES-THEMED (RARE, 5) ──
  { key: "quarchon_banner", name: "Quarchon War Banner", description: "Banner of the warrior race", icon: "Flag", category: "wall_art", rarity: "rare", color: "#ef4444", gridSize: [1, 2], cost: 65, requiredSpecies: "quarchon" },
  { key: "demagi_crystal", name: "Demagi Mind Crystal", description: "Psionic resonance crystal", icon: "Diamond", category: "ambient", rarity: "rare", color: "#8b5cf6", gridSize: [1, 1], cost: 70, requiredSpecies: "demagi" },
  { key: "neyon_timepiece", name: "Neyon Temporal Clock", description: "Shows time in all dimensions", icon: "Timer", category: "tech", rarity: "rare", color: "#0ea5e9", gridSize: [1, 1], cost: 60, requiredSpecies: "neyon" },
  { key: "voxari_hive_art", name: "Voxari Hive Sculpture", description: "Living art from the Voxari collective", icon: "Hexagon", category: "wall_art", rarity: "rare", color: "#22c55e", gridSize: [2, 2], cost: 75, requiredSpecies: "voxari" },
  { key: "human_earth_globe", name: "Old Earth Globe", description: "A relic from humanity's homeworld", icon: "Globe", category: "tech", rarity: "rare", color: "#3b82f6", gridSize: [1, 1], cost: 50, requiredSpecies: "human" },

  // ── BOSS KILL TROPHIES (RARE/EPIC, 8) ──
  { key: "sentinel_head_mount", name: "Sentinel Head Mount", description: "The severed head of a Panopticon Sentinel, mounted on a plaque", icon: "Shield", category: "trophy", rarity: "rare", color: "#ef4444", gridSize: [2, 2], cost: 100, requiredBossKill: { bossKey: "panopticon_sentinel", kills: 1 } },
  { key: "sentinel_core_display", name: "Sentinel Core Display", description: "A pulsing core extracted from the Sentinel, contained in glass", icon: "Cpu", category: "trophy", rarity: "epic", color: "#ef4444", gridSize: [1, 1], cost: 250, requiredBossKill: { bossKey: "panopticon_sentinel", kills: 10 }, passiveBonus: { type: "sentinel_power", value: 5, label: "+5% damage vs Sentinel" } },
  { key: "wyrm_scale_tapestry", name: "Wyrm Scale Tapestry", description: "A tapestry woven from Chrono Wyrm scales that shimmer through time", icon: "Scroll", category: "wall_art", rarity: "rare", color: "#0ea5e9", gridSize: [2, 2], cost: 100, requiredBossKill: { bossKey: "chrono_wyrm", kills: 1 } },
  { key: "wyrm_fang_chandelier", name: "Wyrm Fang Chandelier", description: "Chandelier made from crystallized Chrono Wyrm fangs", icon: "Sparkles", category: "lighting", rarity: "epic", color: "#0ea5e9", gridSize: [2, 2], cost: 250, requiredBossKill: { bossKey: "chrono_wyrm", kills: 10 }, passiveBonus: { type: "chrono_power", value: 5, label: "+5% damage vs Wyrm" } },
  { key: "void_leviathan_eye", name: "Void Leviathan Eye", description: "The preserved eye of the Void Leviathan, still watching", icon: "Eye", category: "trophy", rarity: "rare", color: "#6d28d9", gridSize: [1, 1], cost: 120, requiredBossKill: { bossKey: "void_leviathan", kills: 1 } },
  { key: "void_heart_jar", name: "Void Heart in a Jar", description: "The still-beating heart of the Leviathan, sealed in void glass", icon: "Heart", category: "ambient", rarity: "epic", color: "#6d28d9", gridSize: [1, 1], cost: 300, requiredBossKill: { bossKey: "void_leviathan", kills: 10 }, passiveBonus: { type: "void_power", value: 5, label: "+5% damage vs Leviathan" } },
  { key: "shadow_colossus_arm", name: "Shadow Colossus Arm", description: "A massive arm fragment from the Shadow Colossus", icon: "Grip", category: "trophy", rarity: "rare", color: "#1e1b4b", gridSize: [2, 3], cost: 120, requiredBossKill: { bossKey: "shadow_colossus", kills: 1 } },
  { key: "colossus_shadow_cage", name: "Caged Shadow Essence", description: "Pure shadow essence from the Colossus, caged in light", icon: "Box", category: "ambient", rarity: "epic", color: "#1e1b4b", gridSize: [1, 1], cost: 300, requiredBossKill: { bossKey: "shadow_colossus", kills: 10 }, passiveBonus: { type: "shadow_power", value: 5, label: "+5% damage vs Colossus" } },

  // ── SEASONAL EVENT DECORATIONS (6) ──
  { key: "shadow_convergence_banner", name: "Shadow Convergence Banner", description: "A dark banner from the Shadow Convergence event", icon: "Flag", category: "wall_art", rarity: "rare", color: "#6d28d9", gridSize: [1, 2], cost: 80, requiredSeasonalEvent: "shadow_convergence" },
  { key: "chrono_harvest_tree", name: "Chrono Harvest Tree", description: "A miniature tree bearing temporal fruit from the Chrono Harvest", icon: "TreePine", category: "plant", rarity: "rare", color: "#0ea5e9", gridSize: [2, 2], cost: 90, requiredSeasonalEvent: "chrono_harvest" },
  { key: "forge_nations_anvil", name: "Forge of Nations Anvil", description: "A commemorative anvil from the Forge of Nations event", icon: "Hammer", category: "furniture", rarity: "rare", color: "#f97316", gridSize: [1, 1], cost: 85, requiredSeasonalEvent: "forge_of_nations" },
  { key: "panopticon_infiltration_badge", name: "Infiltration Badge Display", description: "Your Panopticon Infiltration clearance badge, framed", icon: "Shield", category: "wall_art", rarity: "rare", color: "#22c55e", gridSize: [1, 1], cost: 75, requiredSeasonalEvent: "panopticon_infiltration" },
  { key: "lore_symposium_scroll", name: "Symposium Scroll Rack", description: "Ancient scrolls collected during the Lore Symposium", icon: "ScrollText", category: "bookshelf", rarity: "rare", color: "#ec4899", gridSize: [2, 1], cost: 80, requiredSeasonalEvent: "lore_symposium" },
  { key: "guild_war_trophy_shelf", name: "Guild War Trophy Shelf", description: "Trophies from the Guild War Tournament", icon: "Trophy", category: "trophy", rarity: "epic", color: "#fbbf24", gridSize: [2, 1], cost: 150, requiredSeasonalEvent: "guild_war_tournament", passiveBonus: { type: "guild_power", value: 5, label: "+5% guild war contribution" } },

  // ── EPIC (10) ──
  { key: "command_throne", name: "Command Throne", description: "Sit in authority", icon: "Crown", category: "furniture", rarity: "epic", color: "#fbbf24", gridSize: [2, 2], cost: 150, requiredLevel: 15, passiveBonus: { type: "authority", value: 15, label: "+15% guild influence" } },
  { key: "quantum_garden", name: "Quantum Garden", description: "Plants that exist in superposition", icon: "Flower", category: "plant", rarity: "epic", color: "#22c55e", gridSize: [3, 3], cost: 180, requiredCivilSkill: { skill: "craftsmanship", level: 4 } },
  { key: "ai_companion_pod", name: "AI Companion Pod", description: "Housing for your digital companion", icon: "Bot", category: "tech", rarity: "epic", color: "#38bdf8", gridSize: [2, 2], cost: 160 },
  { key: "dimensional_window", name: "Dimensional Window", description: "A window showing other realities", icon: "Maximize", category: "wall_art", rarity: "epic", color: "#8b5cf6", gridSize: [3, 2], cost: 200 },
  { key: "gravity_fountain", name: "Anti-Gravity Fountain", description: "Water flows upward", icon: "Droplets", category: "ambient", rarity: "epic", color: "#06b6d4", gridSize: [2, 2], cost: 175, requiredCivilSkill: { skill: "perception", level: 3 } },
  { key: "enchanted_armor_stand", name: "Enchanted Armor Stand", description: "Displays your finest armor", icon: "Shield", category: "weapon_rack", rarity: "epic", color: "#a3a3a3", gridSize: [1, 2], cost: 120, requiredLevel: 12 },
  { key: "lore_archive", name: "Lore Archive Terminal", description: "Access the complete Dischordian archive", icon: "Database", category: "tech", rarity: "epic", color: "#6366f1", gridSize: [2, 1], cost: 140, requiredCivilSkill: { skill: "lore", level: 4 }, passiveBonus: { type: "lore_xp", value: 10, label: "+10% lore writing XP" } },
  { key: "battle_simulator", name: "Battle Simulator", description: "Practice combat in virtual reality", icon: "Gamepad2", category: "tech", rarity: "epic", color: "#ef4444", gridSize: [3, 2], cost: 200, requiredCivilSkill: { skill: "tactics", level: 4 }, passiveBonus: { type: "combat_xp", value: 10, label: "+10% combat XP" } },
  { key: "starlight_ceiling", name: "Starlight Ceiling", description: "Your ceiling becomes the cosmos", icon: "Stars", category: "ambient", rarity: "epic", color: "#1e1b4b", gridSize: [4, 4], cost: 250 },
  { key: "holographic_pet", name: "Holographic Pet", description: "A customizable holographic companion", icon: "Ghost", category: "pet", rarity: "epic", color: "#38bdf8", gridSize: [1, 1], cost: 130 },

  // ── MORALITY-THEMED (EPIC, 2) ──
  { key: "machine_core", name: "Machine Core Altar", description: "A pulsing core of pure machine logic", icon: "Cpu", category: "ambient", rarity: "epic", color: "#ef4444", gridSize: [2, 2], cost: 200, requiredMorality: { path: "machine", minScore: 50 }, passiveBonus: { type: "machine_power", value: 5, label: "+5% machine alignment gains" } },
  { key: "humanity_tree", name: "Tree of Humanity", description: "A living tree that embodies human spirit", icon: "TreePine", category: "plant", rarity: "epic", color: "#22c55e", gridSize: [2, 3], cost: 200, requiredMorality: { path: "humanity", minScore: 50 }, passiveBonus: { type: "humanity_power", value: 5, label: "+5% humanity alignment gains" } },

  // ── PRESTIGE CLASS EPIC ITEMS (5 new) ──
  { key: "iron_prophet_altar", name: "Iron Prophet's Altar", description: "A sacred altar channeling prophetic visions of iron and flame", icon: "Flame", category: "ambient", rarity: "epic", color: "#f59e0b", gridSize: [2, 2], cost: 250, requiredPrestige: "iron_prophet", passiveBonus: { type: "prophecy", value: 8, label: "+8% quest reward bonus" } },
  { key: "architect_prime_drafting", name: "Architect Prime Drafting Table", description: "The master architect's personal drafting station", icon: "Ruler", category: "furniture", rarity: "epic", color: "#3b82f6", gridSize: [3, 2], cost: 280, requiredPrestige: "architect_prime", passiveBonus: { type: "build_speed", value: 8, label: "+8% build speed" } },
  { key: "void_walker_rift", name: "Void Walker's Rift", description: "A contained tear in reality, humming with void energy", icon: "Zap", category: "ambient", rarity: "epic", color: "#8b5cf6", gridSize: [2, 2], cost: 260, requiredPrestige: "void_walker", passiveBonus: { type: "void_affinity", value: 8, label: "+8% void damage" } },
  { key: "phantom_workbench", name: "Phantom Engineer's Workbench", description: "A workbench that phases between dimensions", icon: "Wrench", category: "tech", rarity: "epic", color: "#06b6d4", gridSize: [3, 1], cost: 240, requiredPrestige: "phantom_engineer", passiveBonus: { type: "craft_bonus", value: 8, label: "+8% crafting success" } },
  { key: "war_oracle_scrying", name: "War Oracle's Scrying Basin", description: "See the outcome of battles before they begin", icon: "Eye", category: "ambient", rarity: "epic", color: "#dc2626", gridSize: [2, 2], cost: 270, requiredPrestige: "war_oracle", passiveBonus: { type: "battle_foresight", value: 8, label: "+8% PvP win rate bonus" } },

  // ── ACHIEVEMENT-GATED EPIC ITEMS (5) ──
  { key: "centurion_banner", name: "Centurion's Banner", description: "A banner commemorating 100 fight victories", icon: "Flag", category: "wall_art", rarity: "epic", color: "#ef4444", gridSize: [1, 2], cost: 180, requiredAchievement: "centurion" },
  { key: "trade_baron_vault", name: "Trade Baron's Vault", description: "A miniature vault overflowing with credits", icon: "Vault", category: "luxury", rarity: "epic", color: "#fbbf24", gridSize: [2, 2], cost: 200, requiredAchievement: "trade_baron" },
  { key: "chess_grandmaster_set", name: "Grandmaster Chess Set", description: "An ornate chess set for the true strategist", icon: "Crown", category: "furniture", rarity: "epic", color: "#6366f1", gridSize: [2, 2], cost: 220, requiredAchievement: "chess_strategist" },
  { key: "guild_champion_flag", name: "Guild Champion's Flag", description: "The flag of a guild war champion", icon: "Flag", category: "wall_art", rarity: "epic", color: "#10b981", gridSize: [1, 2], cost: 200, requiredAchievement: "guild_champion" },
  { key: "saga_keeper_library", name: "Saga Keeper's Library", description: "A vast library of all Dischordian lore", icon: "Library", category: "bookshelf", rarity: "epic", color: "#ec4899", gridSize: [3, 2], cost: 250, requiredAchievement: "saga_keeper", passiveBonus: { type: "lore_mastery", value: 10, label: "+10% all lore XP" } },

  // ── CIVIL SKILL GATED ITEMS (4) ──
  { key: "negotiation_desk", name: "Master Negotiator's Desk", description: "Where the best deals in the galaxy are struck", icon: "Table", category: "furniture", rarity: "epic", color: "#f59e0b", gridSize: [3, 2], cost: 200, requiredCivilSkill: { skill: "negotiation", level: 5 }, passiveBonus: { type: "trade_bonus", value: 5, label: "+5% trade profits" } },
  { key: "espionage_console", name: "Espionage Console", description: "Intercept communications across the network", icon: "Radio", category: "tech", rarity: "epic", color: "#6366f1", gridSize: [2, 1], cost: 180, requiredCivilSkill: { skill: "espionage", level: 5 }, passiveBonus: { type: "intel_bonus", value: 5, label: "+5% intel gathering" } },
  { key: "leadership_podium", name: "Leadership Podium", description: "Rally your allies from this commanding podium", icon: "Megaphone", category: "furniture", rarity: "epic", color: "#10b981", gridSize: [1, 2], cost: 190, requiredCivilSkill: { skill: "leadership", level: 5 }, passiveBonus: { type: "rally_bonus", value: 5, label: "+5% guild member bonuses" } },
  { key: "endurance_gym", name: "Endurance Training Station", description: "Push your limits with this advanced training rig", icon: "Dumbbell", category: "tech", rarity: "epic", color: "#ef4444", gridSize: [3, 2], cost: 210, requiredCivilSkill: { skill: "endurance", level: 5 }, passiveBonus: { type: "hp_bonus", value: 5, label: "+5% max HP" } },

  // ── LEGENDARY (8) ──
  { key: "architects_blueprint", name: "The Architect's Blueprint", description: "Original plans for the Panopticon", icon: "FileText", category: "wall_art", rarity: "legendary", color: "#fbbf24", gridSize: [2, 2], cost: 500, requiredAchievement: "lore_master" },
  { key: "enigma_puzzle_box", name: "The Enigma's Puzzle Box", description: "An unsolvable puzzle... or is it?", icon: "Box", category: "ambient", rarity: "legendary", color: "#8b5cf6", gridSize: [1, 1], cost: 400, requiredLevel: 20 },
  { key: "iron_lion_statue", name: "Iron Lion Statue", description: "A statue of the legendary Iron Lion", icon: "Shield", category: "trophy", rarity: "legendary", color: "#f59e0b", gridSize: [2, 3], cost: 600, requiredAchievement: "warlord_supreme" },
  { key: "source_terminal", name: "The Source Terminal", description: "Direct connection to The Source", icon: "Wifi", category: "tech", rarity: "legendary", color: "#22c55e", gridSize: [2, 1], cost: 450, requiredPrestige: "technomancer", passiveBonus: { type: "all_xp", value: 5, label: "+5% all XP gains" } },
  { key: "chrono_orrery", name: "Chrono Orrery", description: "A mechanical model of time itself", icon: "Timer", category: "ambient", rarity: "legendary", color: "#0ea5e9", gridSize: [3, 3], cost: 550, requiredPrestige: "chronomancer", passiveBonus: { type: "time_bonus", value: 10, label: "-10% all build times" } },
  { key: "warlords_throne", name: "Warlord's Throne", description: "The seat of absolute power", icon: "Crown", category: "furniture", rarity: "legendary", color: "#dc2626", gridSize: [2, 2], cost: 500, requiredPrestige: "warlord", passiveBonus: { type: "raid_power", value: 10, label: "+10% raid damage" } },
  { key: "shadow_broker_desk", name: "Shadow Broker's Desk", description: "Where deals are made in darkness", icon: "Table", category: "furniture", rarity: "legendary", color: "#1e1b4b", gridSize: [3, 2], cost: 500, requiredPrestige: "shadow_broker", passiveBonus: { type: "stealth", value: 10, label: "+10% stealth bonus" } },
  { key: "blade_dancer_dojo", name: "Blade Dancer's Dojo", description: "A sacred training space", icon: "Swords", category: "furniture", rarity: "legendary", color: "#f43f5e", gridSize: [4, 3], cost: 600, requiredPrestige: "blade_dancer", passiveBonus: { type: "combat_mastery", value: 10, label: "+10% combat mastery XP" } },

  // ── LEGENDARY CROSS-SYSTEM REWARDS (6) ──
  { key: "all_boss_trophy_wall", name: "Boss Slayer Trophy Wall", description: "A wall displaying trophies from every raid boss you've conquered", icon: "Trophy", category: "trophy", rarity: "legendary", color: "#fbbf24", gridSize: [4, 2], cost: 800, requiredBossKill: { bossKey: "panopticon_sentinel", kills: 5 }, requiredAchievement: "centurion", passiveBonus: { type: "boss_damage", value: 10, label: "+10% raid boss damage" } },
  { key: "morality_nexus_machine", name: "Machine Nexus Core", description: "The ultimate expression of machine alignment — a self-evolving AI core", icon: "Cpu", category: "ambient", rarity: "legendary", color: "#ef4444", gridSize: [2, 2], cost: 700, requiredMorality: { path: "machine", minScore: 80 }, passiveBonus: { type: "machine_mastery", value: 10, label: "+10% machine alignment gains" } },
  { key: "morality_nexus_humanity", name: "Humanity's Beacon", description: "A radiant beacon embodying the spirit of humanity", icon: "Sun", category: "ambient", rarity: "legendary", color: "#22c55e", gridSize: [2, 2], cost: 700, requiredMorality: { path: "humanity", minScore: 80 }, passiveBonus: { type: "humanity_mastery", value: 10, label: "+10% humanity alignment gains" } },
  { key: "legend_of_dischord_tapestry", name: "Legend of Dischord Tapestry", description: "A massive tapestry depicting the entire Dischordian Saga", icon: "Scroll", category: "wall_art", rarity: "legendary", color: "#ec4899", gridSize: [4, 3], cost: 900, requiredAchievement: "legend_of_dischord", passiveBonus: { type: "all_xp", value: 8, label: "+8% all XP gains" } },
  { key: "master_of_all_pedestal", name: "Master of All Pedestal", description: "A pedestal honoring mastery across all classes", icon: "Award", category: "trophy", rarity: "legendary", color: "#fbbf24", gridSize: [1, 2], cost: 750, requiredAchievement: "master_of_all", passiveBonus: { type: "class_xp", value: 10, label: "+10% class mastery XP" } },
  { key: "romance_memory_crystal", name: "Romance Memory Crystal", description: "A crystal preserving your most cherished companion memories", icon: "Heart", category: "ambient", rarity: "legendary", color: "#f472b6", gridSize: [1, 1], cost: 500, requiredAchievement: "romance_complete" },

  // ── MYTHIC (4) ──
  { key: "panopticon_eye", name: "The Panopticon's Eye", description: "The all-seeing eye, tamed and displayed", icon: "Eye", category: "ambient", rarity: "mythic", color: "#ef4444", gridSize: [3, 3], cost: 1000, requiredLevel: 25, requiredAchievement: "legend_of_dischord", passiveBonus: { type: "omniscience", value: 15, label: "+15% all event contributions" } },
  { key: "infinity_mirror", name: "Infinity Mirror", description: "Reflects infinite versions of yourself", icon: "Infinity", category: "wall_art", rarity: "mythic", color: "#8b5cf6", gridSize: [2, 3], cost: 800, requiredLevel: 25 },
  { key: "void_portal", name: "Void Portal", description: "A contained portal to the void", icon: "Circle", category: "ambient", rarity: "mythic", color: "#1e1b4b", gridSize: [2, 2], cost: 900, requiredLevel: 25, passiveBonus: { type: "void_power", value: 10, label: "+10% void damage" } },
  { key: "dreamer_chosen_throne", name: "The Dreamer's Chosen Throne", description: "A throne reserved for those who achieved maximum humanity alignment", icon: "Crown", category: "furniture", rarity: "mythic", color: "#fbbf24", gridSize: [3, 3], cost: 1200, requiredAchievement: "the_dreamer_chosen", passiveBonus: { type: "dream_power", value: 15, label: "+15% Dream token gains" } },

  // ── ADDITIONAL UNCOMMON/RARE TO REACH 120+ ──
  { key: "plasma_globe", name: "Plasma Globe", description: "Crackling energy in a glass sphere", icon: "Zap", category: "lighting", rarity: "uncommon", color: "#a78bfa", gridSize: [1, 1], cost: 18 },
  { key: "incense_burner", name: "Incense Burner", description: "Exotic scents from distant worlds", icon: "Flame", category: "ambient", rarity: "uncommon", color: "#f59e0b", gridSize: [1, 1], cost: 15 },
  { key: "data_pad_rack", name: "Data Pad Rack", description: "Organized collection of data pads", icon: "Tablet", category: "tech", rarity: "uncommon", color: "#38bdf8", gridSize: [1, 1], cost: 20 },
  { key: "hanging_vines", name: "Hanging Vines", description: "Bioluminescent vines from the garden world", icon: "Leaf", category: "plant", rarity: "uncommon", color: "#22c55e", gridSize: [2, 2], cost: 25 },
  { key: "tactical_map_table", name: "Tactical Map Table", description: "Holographic terrain mapping", icon: "Map", category: "furniture", rarity: "uncommon", color: "#3b82f6", gridSize: [2, 2], cost: 35 },
  { key: "sound_system", name: "Surround Sound System", description: "Immersive audio from all directions", icon: "Speaker", category: "tech", rarity: "uncommon", color: "#78716c", gridSize: [1, 1], cost: 30 },
  { key: "crystal_display", name: "Crystal Display Case", description: "Showcase rare crystals and gems", icon: "Diamond", category: "luxury", rarity: "rare", color: "#e2e8f0", gridSize: [2, 1], cost: 55 },
  { key: "void_terrarium", name: "Void Terrarium", description: "A terrarium containing void-touched organisms", icon: "Leaf", category: "plant", rarity: "rare", color: "#6d28d9", gridSize: [1, 1], cost: 60 },
  { key: "combat_dummy", name: "Combat Training Dummy", description: "Practice your strikes on this reinforced dummy", icon: "Target", category: "weapon_rack", rarity: "rare", color: "#ef4444", gridSize: [1, 2], cost: 45, requiredCivilSkill: { skill: "tactics", level: 2 } },
  { key: "dreamer_lantern", name: "Dreamer's Lantern", description: "A lantern that glows with Dream energy", icon: "Lightbulb", category: "lighting", rarity: "rare", color: "#fbbf24", gridSize: [1, 1], cost: 50 },
];

/** Get items available to a player based on their RPG stats */
export function getAvailableDecorations(opts: {
  characterClass?: string;
  species?: string;
  prestigeClass?: string;
  civilSkills?: Record<string, number>;
  achievements?: string[];
  moralityScore?: number;
  citizenLevel?: number;
  bossKills?: Record<string, number>;
  seasonalEventsParticipated?: string[];
}): DecorationItem[] {
  return DECORATION_ITEMS.filter(item => {
    if (item.requiredClass && item.requiredClass !== opts.characterClass) return false;
    if (item.requiredSpecies && item.requiredSpecies !== opts.species) return false;
    if (item.requiredPrestige && item.requiredPrestige !== opts.prestigeClass) return false;
    if (item.requiredLevel && (opts.citizenLevel || 0) < item.requiredLevel) return false;
    if (item.requiredCivilSkill) {
      const level = opts.civilSkills?.[item.requiredCivilSkill.skill] || 0;
      if (level < item.requiredCivilSkill.level) return false;
    }
    if (item.requiredAchievement && !(opts.achievements || []).includes(item.requiredAchievement)) return false;
    if (item.requiredMorality) {
      const score = opts.moralityScore || 0;
      if (item.requiredMorality.path === "machine" && score > -item.requiredMorality.minScore) return false;
      if (item.requiredMorality.path === "humanity" && score < item.requiredMorality.minScore) return false;
    }
    if (item.requiredBossKill) {
      const kills = opts.bossKills?.[item.requiredBossKill.bossKey] || 0;
      if (kills < item.requiredBossKill.kills) return false;
    }
    if (item.requiredSeasonalEvent) {
      if (!(opts.seasonalEventsParticipated || []).includes(item.requiredSeasonalEvent)) return false;
    }
    return true;
  });
}

/** Get available room zones for a player */
export function getAvailableZones(opts: {
  citizenLevel: number;
  civilSkills?: Record<string, number>;
}): RoomLayout[] {
  return ROOM_ZONES.filter(zone => {
    if (opts.citizenLevel < zone.requiredLevel) return false;
    if (zone.requiredCivilSkill) {
      const level = opts.civilSkills?.[zone.requiredCivilSkill.skill] || 0;
      if (level < zone.requiredCivilSkill.level) return false;
    }
    return true;
  });
}

/** Calculate total passive bonuses from placed items */
export function calculateQuarterBonuses(placedItems: DecorationItem[]): Record<string, number> {
  const bonuses: Record<string, number> = {};
  for (const item of placedItems) {
    if (item.passiveBonus) {
      bonuses[item.passiveBonus.type] = (bonuses[item.passiveBonus.type] || 0) + item.passiveBonus.value;
    }
  }
  return bonuses;
}

/* ═══════════════════════════════════════════════════════
   LIGHTING PRESETS (ported from legacy playerHousing.ts)
   Each preset drives the room's CSS background gradient
   and its ambient color palette in the client renderer.
   ═══════════════════════════════════════════════════════ */

export type LightingPresetId =
  | "void"       // Default Ark blue-tint
  | "warm"       // Atarion sunset amber
  | "cold"       // Clinical white
  | "noir"       // Single harsh lamp, deep shadows
  | "candle"     // Flickering warm orange
  | "neon"       // Cyberpunk pinks/blues
  | "corruption" // Glitching red/black
  | "starlight"; // Soft silver from viewport

export interface LightingPreset {
  id: LightingPresetId;
  name: string;
  background: string;
  /** Source that unlocks this preset (e.g. "Default", "Elara trust ≥ 50") */
  unlockHint: string;
}

export const LIGHTING_PRESETS: readonly LightingPreset[] = [
  { id: "void",       name: "Void Glow",          background: "linear-gradient(180deg, #010030 0%, #020020 50%, #010010 100%)", unlockHint: "Default" },
  { id: "warm",       name: "Atarion Sunset",     background: "linear-gradient(180deg, #1a0f05 0%, #2a1508 50%, #0f0a03 100%)", unlockHint: "Elara trust ≥ 50" },
  { id: "cold",       name: "Clinical White",     background: "linear-gradient(180deg, #0a0f15 0%, #0f1520 50%, #080d12 100%)", unlockHint: "Complete Medical Bay quest" },
  { id: "noir",       name: "Detective's Lamp",   background: "linear-gradient(180deg, #050505 0%, #0a0a08 30%, #020202 100%)", unlockHint: "The Human trust ≥ 50" },
  { id: "candle",     name: "Candlelight",        background: "linear-gradient(180deg, #0f0800 0%, #1a0e02 50%, #080400 100%)", unlockHint: "Antiquarian trust ≥ 50" },
  { id: "neon",       name: "Neon Dreams",        background: "linear-gradient(180deg, #0a0015 0%, #100520 50%, #050010 100%)", unlockHint: "Locke trust ≥ 50" },
  { id: "corruption", name: "Corrupted",          background: "linear-gradient(180deg, #150000 0%, #200505 50%, #0a0000 100%)", unlockHint: "Source trust ≥ 50" },
  { id: "starlight",  name: "Starlight",          background: "linear-gradient(180deg, #050810 0%, #081015 50%, #030508 100%)", unlockHint: "Discover all Ark rooms" },
] as const;

/** Get unlocked lighting presets for a player. The `void` preset is always
 *  available; others gate on companion trust / quest state. */
export function getAvailableLightingPresets(opts: {
  elaraTrust?: number;
  humanTrust?: number;
  npcTrust?: Record<string, number>;
  completedQuests?: string[];
  discoveredRooms?: number;
  totalRooms?: number;
}): LightingPreset[] {
  const npc = opts.npcTrust ?? {};
  const quests = opts.completedQuests ?? [];
  return LIGHTING_PRESETS.filter((p) => {
    switch (p.id) {
      case "void":       return true;
      case "warm":       return (opts.elaraTrust ?? 0) >= 50;
      case "cold":       return quests.includes("medical_bay_quest");
      case "noir":       return (opts.humanTrust ?? 0) >= 50;
      case "candle":     return (npc.antiquarian ?? 0) >= 50;
      case "neon":       return (npc.locke ?? 0) >= 50;
      case "corruption": return (npc.source ?? 0) >= 50;
      case "starlight":  return (opts.discoveredRooms ?? 0) >= (opts.totalRooms ?? 20);
      default:           return false;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   MUSIC BOX TRACKS (ported from legacy playerHousing.ts)
   ═══════════════════════════════════════════════════════ */

export interface MusicTrack {
  id: string;
  name: string;
  unlockHint: string;
  rarity: ItemRarity;
}

export const MUSIC_TRACKS: readonly MusicTrack[] = [
  { id: "music_void_ambient",     name: "Void Ambient",            unlockHint: "Default",                        rarity: "common" },
  { id: "music_atarion_lullaby",  name: "Atarion Lullaby",         unlockHint: "Elara trust ≥ 40",                rarity: "uncommon" },
  { id: "music_noir_jazz",        name: "Late Night Jazz",         unlockHint: "The Human trust ≥ 40",            rarity: "uncommon" },
  { id: "music_war_drums",        name: "War Drums",               unlockHint: "Win 10 guild wars",               rarity: "rare" },
  { id: "music_dream_waltz",      name: "Dream Waltz",             unlockHint: "Internalize 20 thoughts",         rarity: "rare" },
  { id: "music_silence",          name: "Perfect Silence",         unlockHint: "Shadow Tongue trust ≥ 60",        rarity: "epic" },
  { id: "music_architects_hymn",  name: "The Architect's Hymn",    unlockHint: "Morality ≤ -80",                  rarity: "epic" },
  { id: "music_freedom_song",     name: "Freedom's Song",          unlockHint: "Morality ≥ 80",                   rarity: "epic" },
] as const;

/** Get unlocked music tracks for a player. */
export function getAvailableMusicTracks(opts: {
  elaraTrust?: number;
  humanTrust?: number;
  npcTrust?: Record<string, number>;
  moralityScore?: number;
  guildWarsWon?: number;
  thoughtsInternalized?: number;
}): MusicTrack[] {
  const npc = opts.npcTrust ?? {};
  const morality = opts.moralityScore ?? 0;
  return MUSIC_TRACKS.filter((t) => {
    switch (t.id) {
      case "music_void_ambient":    return true;
      case "music_atarion_lullaby": return (opts.elaraTrust ?? 0) >= 40;
      case "music_noir_jazz":       return (opts.humanTrust ?? 0) >= 40;
      case "music_war_drums":       return (opts.guildWarsWon ?? 0) >= 10;
      case "music_dream_waltz":     return (opts.thoughtsInternalized ?? 0) >= 20;
      case "music_silence":         return (npc.shadow_tongue ?? 0) >= 60;
      case "music_architects_hymn": return morality <= -80;
      case "music_freedom_song":    return morality >= 80;
      default:                      return false;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   COMPANION VISITS (ported from legacy playerHousing.ts)
   Companions appear in the player's room at specific
   positions when their trust threshold is met.
   ═══════════════════════════════════════════════════════ */

export interface CompanionVisitConfig {
  companionId: string;
  name: string;
  minTrust: number;
  visitDialogs: string[];
  idleAnimation: string;
  /** Percentage-based position in the rendered room (0-100). */
  position: { x: number; y: number };
}

export const COMPANION_VISITS: readonly CompanionVisitConfig[] = [
  { companionId: "elara", name: "Elara", minTrust: 30, visitDialogs: [
    "I hope you don't mind. The observation deck gets... quiet.",
    "Your quarters are warmer than mine. The crystal helps.",
    "I was reviewing star charts nearby. Thought I'd check in.",
  ], idleAnimation: "reading", position: { x: 75, y: 55 } },
  { companionId: "the_human", name: "The Human", minTrust: 40, visitDialogs: [
    "Don't mind me. Just needed somewhere the signal's clean.",
    "Nice place. Reminds me of... somewhere. Can't remember where.",
    "I'm not hiding. I'm strategically positioned.",
  ], idleAnimation: "leaning", position: { x: 20, y: 60 } },
  { companionId: "agent_zero", name: "Agent Zero", minTrust: 35, visitDialogs: [
    "Securing the perimeter. Your perimeter. You're welcome.",
    "I swept for bugs. Found three. Disabled two. The third is mine.",
    "Brief me on anything new. Or don't. I'll find out anyway.",
  ], idleAnimation: "standing_guard", position: { x: 85, y: 50 } },
  { companionId: "locke", name: "Adjudicator Locke", minTrust: 45, visitDialogs: [
    "I'm assessing the property value. Purely academic, of course.",
    "Interesting decor choices. They reveal more than you think.",
    "I brought contracts. Don't worry — just light reading.",
  ], idleAnimation: "examining", position: { x: 60, y: 45 } },
  { companionId: "antiquarian", name: "The Antiquarian", minTrust: 25, visitDialogs: [
    "Every room tells a story. Yours is still being written.",
    "I've catalogued cabins across a thousand ships. Yours has... character.",
    "The items you choose to display — they say more about you than any archive.",
  ], idleAnimation: "studying", position: { x: 40, y: 50 } },
] as const;

/** Filter companion visits by current trust levels. */
export function getVisitingCompanions(opts: {
  elaraTrust?: number;
  humanTrust?: number;
  npcTrust?: Record<string, number>;
}): CompanionVisitConfig[] {
  const trustMap: Record<string, number> = {
    elara: opts.elaraTrust ?? 0,
    the_human: opts.humanTrust ?? 0,
    ...(opts.npcTrust ?? {}),
  };
  return COMPANION_VISITS.filter((c) => (trustMap[c.companionId] ?? 0) >= c.minTrust);
}

/* ═══════════════════════════════════════════════════════
   ZONE SLOT MAPS — visual hotspot layouts per room zone.
   Each zone defines a set of SLOT positions (x/y/w/h as
   percentages of the room canvas) that the client renders
   as interactive hotspots for decoration placement.

   This is the visual "room map" from the legacy Player
   Cabin UI, generalized across all 6 Personal Quarters
   zones. An item placed via a slotId is pinned to that
   hotspot; items placed via bare (x,y) grid coordinates
   continue to work for backward compatibility.
   ═══════════════════════════════════════════════════════ */

export interface RoomSlot {
  id: string;
  label: string;
  /** Percentage-based position (0-100). */
  x: number;
  y: number;
  w: number;
  h: number;
  type: SlotType;
  /** Compatible decoration item categories. */
  accepts: ItemCategory[];
}

/** Slot layouts keyed by zone id. Every zone ships a default map so a
 *  player can decorate visually without any backend config. */
export const ZONE_SLOT_MAPS: Record<RoomZone, RoomSlot[]> = {
  main: [
    { id: "main_wall_left",   label: "Left Wall",    x: 8,  y: 22, w: 20, h: 30, type: "wall",  accepts: ["wall_art", "trophy"] },
    { id: "main_wall_center", label: "Center Wall",  x: 36, y: 14, w: 28, h: 36, type: "wall",  accepts: ["wall_art", "trophy"] },
    { id: "main_wall_right",  label: "Right Wall",   x: 72, y: 22, w: 20, h: 30, type: "wall",  accepts: ["wall_art", "trophy"] },
    { id: "main_shelf_left",  label: "Left Shelf",   x: 10, y: 58, w: 18, h: 14, type: "shelf", accepts: ["bookshelf", "trophy", "luxury"] },
    { id: "main_shelf_right", label: "Right Shelf",  x: 72, y: 58, w: 18, h: 14, type: "shelf", accepts: ["bookshelf", "trophy", "luxury"] },
    { id: "main_desk",        label: "Command Desk", x: 34, y: 62, w: 32, h: 16, type: "desk",  accepts: ["furniture", "tech"] },
    { id: "main_floor_left",  label: "Floor Left",   x: 4,  y: 80, w: 22, h: 16, type: "floor", accepts: ["floor", "plant", "pet"] },
    { id: "main_floor_right", label: "Floor Right",  x: 74, y: 80, w: 22, h: 16, type: "floor", accepts: ["floor", "plant", "pet"] },
  ],
  bedroom: [
    { id: "bed_wall_head",    label: "Headboard Wall", x: 26, y: 16, w: 48, h: 32, type: "wall",  accepts: ["wall_art"] },
    { id: "bed_bed",          label: "Bed",            x: 20, y: 50, w: 40, h: 28, type: "floor", accepts: ["furniture"] },
    { id: "bed_nightstand",   label: "Nightstand",     x: 62, y: 56, w: 14, h: 18, type: "desk",  accepts: ["furniture", "lighting"] },
    { id: "bed_rug",          label: "Bedside Rug",    x: 16, y: 82, w: 46, h: 14, type: "floor", accepts: ["floor"] },
    { id: "bed_shelf",        label: "Shelf",          x: 78, y: 22, w: 16, h: 30, type: "shelf", accepts: ["bookshelf", "luxury"] },
  ],
  study: [
    { id: "study_desk",       label: "Study Desk",     x: 30, y: 52, w: 38, h: 22, type: "desk",  accepts: ["furniture", "tech"] },
    { id: "study_bookwall",   label: "Book Wall",      x: 6,  y: 14, w: 24, h: 60, type: "wall",  accepts: ["bookshelf"] },
    { id: "study_chair",      label: "Reading Chair",  x: 72, y: 52, w: 20, h: 24, type: "floor", accepts: ["furniture"] },
    { id: "study_wall_art",   label: "Wall Art",       x: 38, y: 14, w: 26, h: 28, type: "wall",  accepts: ["wall_art"] },
    { id: "study_lamp",       label: "Floor Lamp",     x: 82, y: 20, w: 12, h: 28, type: "floor", accepts: ["lighting"] },
  ],
  armory: [
    { id: "armory_rack_left",  label: "Left Rack",   x: 6,  y: 20, w: 24, h: 58, type: "wall",  accepts: ["weapon_rack"] },
    { id: "armory_rack_right", label: "Right Rack",  x: 70, y: 20, w: 24, h: 58, type: "wall",  accepts: ["weapon_rack"] },
    { id: "armory_display",    label: "Display Case", x: 34, y: 28, w: 32, h: 28, type: "wall",  accepts: ["trophy", "weapon_rack"] },
    { id: "armory_workbench",  label: "Workbench",    x: 34, y: 62, w: 32, h: 18, type: "desk",  accepts: ["furniture", "tech"] },
  ],
  garden: [
    { id: "garden_window",    label: "Viewport",     x: 20, y: 8,  w: 60, h: 28, type: "window", accepts: ["wall_art"] },
    { id: "garden_bed_left",  label: "Plant Bed L",  x: 8,  y: 50, w: 24, h: 36, type: "floor",  accepts: ["plant"] },
    { id: "garden_bed_right", label: "Plant Bed R",  x: 68, y: 50, w: 24, h: 36, type: "floor",  accepts: ["plant"] },
    { id: "garden_fountain",  label: "Fountain",     x: 36, y: 54, w: 28, h: 28, type: "floor",  accepts: ["ambient"] },
    { id: "garden_lantern",   label: "Lantern",      x: 46, y: 12, w: 8,  h: 14, type: "ceiling", accepts: ["lighting"] },
  ],
  vault: [
    { id: "vault_pedestal_1", label: "Pedestal I",  x: 18, y: 40, w: 16, h: 30, type: "shelf", accepts: ["luxury", "trophy"] },
    { id: "vault_pedestal_2", label: "Pedestal II", x: 42, y: 40, w: 16, h: 30, type: "shelf", accepts: ["luxury", "trophy"] },
    { id: "vault_pedestal_3", label: "Pedestal III", x: 66, y: 40, w: 16, h: 30, type: "shelf", accepts: ["luxury", "trophy"] },
    { id: "vault_wall_back",  label: "Vault Wall",  x: 20, y: 8,  w: 60, h: 24, type: "wall",  accepts: ["wall_art", "trophy"] },
    { id: "vault_floor",      label: "Vault Floor", x: 10, y: 78, w: 80, h: 18, type: "floor", accepts: ["floor"] },
  ],
};

/** Look up the slot definition for a given zone + slot id. */
export function getSlot(zone: RoomZone, slotId: string): RoomSlot | undefined {
  return ZONE_SLOT_MAPS[zone]?.find((s) => s.id === slotId);
}

/** Whether a decoration item is allowed in a specific slot. */
export function isItemAllowedInSlot(item: DecorationItem, slot: RoomSlot): boolean {
  return slot.accepts.includes(item.category);
}

/* ═══════════════════════════════════════════════════════
   PLACED ITEM TYPE
   Canonical shape for an entry in player_quarters.placedItems.
   ═══════════════════════════════════════════════════════ */

export interface PlacedQuartersItem {
  itemKey: string;
  zone: string;
  x: number;
  y: number;
  /** Optional: pin this item to a specific visual slot hotspot. */
  slotId?: string;
}
