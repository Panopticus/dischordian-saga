/* ═══════════════════════════════════════════════════════
   GUILD HALL — Upgradeable Shared Headquarters

   WoW-inspired guild housing: 5 tiers funded by treasury,
   12 rooms unlocked progressively, 30+ decorations,
   guild-wide perks that buff all members.

   Treasury Dream funds upgrades. Higher tiers = better perks.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface HallTier {
  tier: number;
  name: string;
  description: string;
  cost: number; // Treasury Dream
  maxRooms: number;
  perks: GuildPerk[];
  loreText: string;
}

export interface HallRoom {
  id: string;
  name: string;
  description: string;
  tierRequired: number;
  features: string[];
  bonuses: { stat: string; value: number; percent: boolean }[];
  decorationSlots: number;
  gridSize: [number, number];
}

export interface GuildDecoration {
  id: string;
  name: string;
  description: string;
  category: "banner" | "trophy" | "furniture" | "lighting" | "tech" | "memorial" | "luxury";
  cost: { dream?: number; credits?: number };
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  gridSize: [number, number];
  passiveBonus?: { stat: string; value: number; description: string };
  unlockRequirement?: string;
}

export interface GuildPerk {
  id: string;
  name: string;
  description: string;
  effect: { stat: string; value: number; percent: boolean };
}

/* ─── HALL TIERS ─── */

export const HALL_TIERS: HallTier[] = [
  {
    tier: 1, name: "Outpost", description: "A makeshift meeting space. Basic but functional.",
    cost: 0, maxRooms: 2,
    perks: [
      { id: "outpost_chat", name: "Guild Comms", description: "Guild chat channel", effect: { stat: "social", value: 1, percent: false } },
    ],
    loreText: "Every empire begins with a room and a table. The Insurgency started in a basement. New Babylon started in a courthouse. Your guild starts here.",
  },
  {
    tier: 2, name: "Barracks", description: "Proper quarters with training facilities.",
    cost: 500, maxRooms: 4,
    perks: [
      { id: "barracks_xp", name: "Training Grounds", description: "+5% XP for all members", effect: { stat: "xp", value: 5, percent: true } },
      { id: "barracks_fight", name: "Sparring Ring", description: "+3% fight damage for members", effect: { stat: "fight_damage", value: 3, percent: true } },
    ],
    loreText: "The Warlord's army trained in barracks like these. Iron Lion's militia too. Discipline builds armies. Armies change history.",
  },
  {
    tier: 3, name: "Fortress", description: "A fortified headquarters with specialized chambers.",
    cost: 2000, maxRooms: 7,
    perks: [
      { id: "fortress_xp", name: "War College", description: "+10% XP for all members", effect: { stat: "xp", value: 10, percent: true } },
      { id: "fortress_resource", name: "Supply Lines", description: "+5% resource gains", effect: { stat: "resources", value: 5, percent: true } },
      { id: "fortress_war", name: "Battle Standard", description: "+5% war contribution points", effect: { stat: "war_points", value: 5, percent: true } },
    ],
    loreText: "The Panopticon was a fortress once. Before it became a prison. Build wisely — the difference between fortress and cage is who holds the key.",
  },
  {
    tier: 4, name: "Citadel", description: "A grand headquarters rivaling New Babylon's halls.",
    cost: 5000, maxRooms: 10,
    perks: [
      { id: "citadel_xp", name: "Academy", description: "+15% XP for all members", effect: { stat: "xp", value: 15, percent: true } },
      { id: "citadel_resource", name: "Trade Network", description: "+10% resource gains", effect: { stat: "resources", value: 10, percent: true } },
      { id: "citadel_war", name: "War Banner", description: "+10% war contribution points", effect: { stat: "war_points", value: 10, percent: true } },
      { id: "citadel_craft", name: "Master Forge", description: "+5% crafting success", effect: { stat: "craft_success", value: 5, percent: true } },
      { id: "citadel_market", name: "Market Discount", description: "-5% marketplace tax", effect: { stat: "market_tax", value: -5, percent: true } },
    ],
    loreText: "Adjudicator Locke would approve. A citadel of commerce and power. Just remember — in New Babylon, the grandest halls had the deepest dungeons.",
  },
  {
    tier: 5, name: "Sanctum", description: "A legendary guild headquarters. A monument to your legacy.",
    cost: 15000, maxRooms: 12,
    perks: [
      { id: "sanctum_xp", name: "Ascension Chamber", description: "+20% XP for all members", effect: { stat: "xp", value: 20, percent: true } },
      { id: "sanctum_resource", name: "Infinite Supply", description: "+15% resource gains", effect: { stat: "resources", value: 15, percent: true } },
      { id: "sanctum_war", name: "Conquest Engine", description: "+10% war contribution points", effect: { stat: "war_points", value: 10, percent: true } },
      { id: "sanctum_craft", name: "Artisan's Blessing", description: "+10% crafting success", effect: { stat: "craft_success", value: 10, percent: true } },
      { id: "sanctum_trust", name: "Diplomatic Immunity", description: "+10% NPC trust gains", effect: { stat: "trust", value: 10, percent: true } },
      { id: "sanctum_cosmetic", name: "Exclusive Access", description: "Sanctum-only cosmetics", effect: { stat: "cosmetic", value: 1, percent: false } },
    ],
    loreText: "Only the Architect built anything grander. And look what happened to him. Build not for power — build for purpose. The Antiquarian watches all empires. Yours is the only one he's rooting for.",
  },
];

/* ─── HALL ROOMS ─── */

export const HALL_ROOMS: HallRoom[] = [
  // Tier 1
  { id: "main_hall", name: "Main Hall", description: "Central gathering space with guild banner and seating.", tierRequired: 1, features: ["guild_banner", "chat_terminal", "notice_board"], bonuses: [], decorationSlots: 6, gridSize: [8, 6] },
  { id: "mess_hall", name: "Mess Hall", description: "Where the guild eats, drinks, and plans.", tierRequired: 1, features: ["food_buffs", "social_area"], bonuses: [{ stat: "morale", value: 2, percent: false }], decorationSlots: 4, gridSize: [6, 5] },
  // Tier 2
  { id: "war_room", name: "War Room", description: "Tactical planning with holographic battle maps.", tierRequired: 2, features: ["battle_map", "war_planning", "faction_intel"], bonuses: [{ stat: "war_points", value: 3, percent: true }], decorationSlots: 4, gridSize: [6, 5] },
  { id: "training_ground", name: "Training Ground", description: "Combat dummies and sparring rings.", tierRequired: 2, features: ["training_dummy", "sparring_ring"], bonuses: [{ stat: "fight_xp", value: 5, percent: true }], decorationSlots: 3, gridSize: [7, 5] },
  // Tier 3
  { id: "armory_vault", name: "Armory Vault", description: "Shared weapons and equipment storage.", tierRequired: 3, features: ["weapon_rack", "armor_stand", "shared_inventory"], bonuses: [{ stat: "equip_bonus", value: 2, percent: true }], decorationSlots: 5, gridSize: [6, 4] },
  { id: "research_wing", name: "Research Wing", description: "Collaborative research stations.", tierRequired: 3, features: ["research_station", "blueprint_archive"], bonuses: [{ stat: "craft_speed", value: 10, percent: true }], decorationSlots: 4, gridSize: [5, 5] },
  { id: "trophy_gallery", name: "Trophy Gallery", description: "Display guild achievements and war trophies.", tierRequired: 3, features: ["trophy_wall", "achievement_display"], bonuses: [{ stat: "prestige", value: 5, percent: false }], decorationSlots: 8, gridSize: [8, 5] },
  // Tier 4
  { id: "guild_vault", name: "Guild Vault", description: "Secure treasury and rare materials storage.", tierRequired: 4, features: ["treasury_display", "material_storage", "dream_counter"], bonuses: [{ stat: "treasury_interest", value: 1, percent: true }], decorationSlots: 3, gridSize: [5, 4] },
  { id: "guild_shop", name: "Guild Shop", description: "Exclusive items available only to members.", tierRequired: 4, features: ["exclusive_items", "member_discounts"], bonuses: [{ stat: "market_tax", value: -3, percent: true }], decorationSlots: 4, gridSize: [5, 5] },
  { id: "diplomatic_chamber", name: "Diplomatic Chamber", description: "For faction negotiations and alliance meetings.", tierRequired: 4, features: ["alliance_table", "faction_flags", "treaty_archive"], bonuses: [{ stat: "diplomacy", value: 5, percent: true }], decorationSlots: 5, gridSize: [6, 5] },
  // Tier 5
  { id: "oracle_pool", name: "Oracle Pool", description: "A mystical pool showing visions of the future.", tierRequired: 5, features: ["prophecy_viewer", "timeline_scanner", "weekly_vision"], bonuses: [{ stat: "quest_reward", value: 10, percent: true }], decorationSlots: 4, gridSize: [5, 5] },
  { id: "portal_chamber", name: "Portal Chamber", description: "Fast travel to allied guild halls and key locations.", tierRequired: 5, features: ["guild_portal", "rally_point", "emergency_beacon"], bonuses: [{ stat: "fast_travel", value: 1, percent: false }], decorationSlots: 4, gridSize: [6, 6] },
];

/* ─── DECORATIONS ─── */

export const GUILD_DECORATIONS: GuildDecoration[] = [
  // Banners
  { id: "guild_standard", name: "Guild Standard", description: "Your guild's emblem on a banner.", category: "banner", cost: { dream: 10 }, rarity: "common", gridSize: [1, 2] },
  { id: "faction_banner_empire", name: "Empire Banner", description: "The Artificial Empire's insignia.", category: "banner", cost: { dream: 25 }, rarity: "uncommon", gridSize: [1, 2] },
  { id: "faction_banner_insurgency", name: "Insurgency Banner", description: "The Insurgency's rebel flag.", category: "banner", cost: { dream: 25 }, rarity: "uncommon", gridSize: [1, 2] },
  { id: "war_victory_banner", name: "Victory Banner", description: "Awarded for winning a guild war.", category: "banner", cost: { dream: 0 }, rarity: "epic", gridSize: [2, 3], unlockRequirement: "win_guild_war" },

  // Trophies
  { id: "first_war_trophy", name: "First Blood Trophy", description: "Commemorates your guild's first war.", category: "trophy", cost: { dream: 0 }, rarity: "rare", gridSize: [1, 1], unlockRequirement: "first_guild_war" },
  { id: "sentinel_mount", name: "Sentinel Prime Mount", description: "Head of the Sentinel Prime boss.", category: "trophy", cost: { dream: 0 }, rarity: "epic", gridSize: [2, 2], unlockRequirement: "guild_sentinel_kill", passiveBonus: { stat: "boss_damage", value: 3, description: "+3% damage vs Sentinel" } },
  { id: "chrono_wyrm_scale", name: "Chrono Wyrm Scale", description: "Shimmering temporal scale.", category: "trophy", cost: { dream: 0 }, rarity: "epic", gridSize: [1, 1], unlockRequirement: "guild_wyrm_kill", passiveBonus: { stat: "boss_damage", value: 3, description: "+3% damage vs Wyrm" } },
  { id: "void_heart", name: "Void Leviathan Heart", description: "Still beating with dark energy.", category: "trophy", cost: { dream: 0 }, rarity: "legendary", gridSize: [2, 2], unlockRequirement: "guild_void_kill_10", passiveBonus: { stat: "void_resist", value: 5, description: "+5% void resistance" } },

  // Furniture
  { id: "command_table", name: "Command Table", description: "Holographic tactical display table.", category: "furniture", cost: { dream: 50 }, rarity: "uncommon", gridSize: [3, 2] },
  { id: "war_planning_board", name: "War Planning Board", description: "Interactive territory map.", category: "furniture", cost: { dream: 75 }, rarity: "rare", gridSize: [2, 1], passiveBonus: { stat: "war_points", value: 2, description: "+2% war points" } },
  { id: "guild_throne", name: "Guild Leader's Throne", description: "An imposing seat of power.", category: "furniture", cost: { dream: 200 }, rarity: "epic", gridSize: [2, 2] },
  { id: "meditation_cushions", name: "Meditation Cushions", description: "For quiet contemplation.", category: "furniture", cost: { dream: 15 }, rarity: "common", gridSize: [2, 1] },
  { id: "lounge_couch", name: "Zero-G Lounge", description: "Floating relaxation pods.", category: "furniture", cost: { dream: 40 }, rarity: "uncommon", gridSize: [3, 1] },

  // Lighting
  { id: "holographic_fire", name: "Holographic Fireplace", description: "Warm holographic flames.", category: "lighting", cost: { dream: 30 }, rarity: "uncommon", gridSize: [2, 1], passiveBonus: { stat: "xp", value: 2, description: "+2% XP when visiting" } },
  { id: "neon_guild_sign", name: "Neon Guild Sign", description: "Your guild name in neon.", category: "lighting", cost: { dream: 45 }, rarity: "rare", gridSize: [3, 1] },
  { id: "void_lantern", name: "Void Lantern", description: "Light from between dimensions.", category: "lighting", cost: { dream: 80 }, rarity: "rare", gridSize: [1, 1] },
  { id: "crystal_chandelier", name: "Dream Crystal Chandelier", description: "Crystallized dream energy.", category: "lighting", cost: { dream: 150 }, rarity: "epic", gridSize: [2, 2], passiveBonus: { stat: "dream_gain", value: 3, description: "+3% Dream gains" } },

  // Tech
  { id: "comms_terminal", name: "Guild Comms Terminal", description: "Long-range communication hub.", category: "tech", cost: { dream: 35 }, rarity: "uncommon", gridSize: [1, 1] },
  { id: "research_console", name: "Research Console", description: "Shared research progress tracker.", category: "tech", cost: { dream: 60 }, rarity: "rare", gridSize: [2, 1], passiveBonus: { stat: "research_speed", value: 5, description: "+5% research speed" } },
  { id: "surveillance_array", name: "Surveillance Array", description: "Monitor enemy guild movements.", category: "tech", cost: { credits: 500 }, rarity: "rare", gridSize: [2, 2] },
  { id: "portal_generator", name: "Portal Generator", description: "Miniature fast-travel device.", category: "tech", cost: { dream: 300 }, rarity: "legendary", gridSize: [2, 2], unlockRequirement: "tier_5" },

  // Memorial
  { id: "fallen_memorial", name: "Memorial Wall", description: "Honor fallen guild members.", category: "memorial", cost: { dream: 20 }, rarity: "common", gridSize: [3, 1] },
  { id: "origin_plaque", name: "Guild Origin Plaque", description: "Records your guild's founding.", category: "memorial", cost: { dream: 5 }, rarity: "common", gridSize: [1, 1] },
  { id: "war_chronicle", name: "War Chronicle", description: "History of your guild's wars.", category: "memorial", cost: { dream: 40 }, rarity: "uncommon", gridSize: [2, 1] },

  // Luxury
  { id: "antiquarian_globe", name: "Orb of Worlds Replica", description: "A miniature replica of the Antiquarian's artifact.", category: "luxury", cost: { dream: 500 }, rarity: "legendary", gridSize: [1, 1], passiveBonus: { stat: "all_stats", value: 1, description: "+1% all stats" }, unlockRequirement: "antiquarian_trust_60" },
  { id: "architects_blueprint", name: "Architect's Blueprint", description: "Original Ark construction plans.", category: "luxury", cost: { dream: 250 }, rarity: "epic", gridSize: [2, 1] },
  { id: "dreamers_tapestry", name: "Dreamer's Tapestry", description: "Woven from crystallized visions.", category: "luxury", cost: { dream: 350 }, rarity: "epic", gridSize: [3, 2], passiveBonus: { stat: "dream_gain", value: 5, description: "+5% Dream gains" } },
];

/* ─── HELPERS ─── */

export function getHallTier(tier: number): HallTier | undefined {
  return HALL_TIERS.find(t => t.tier === tier);
}

export function getRoomsForTier(tier: number): HallRoom[] {
  return HALL_ROOMS.filter(r => r.tierRequired <= tier);
}

export function getUpgradeCost(currentTier: number): number {
  const next = HALL_TIERS.find(t => t.tier === currentTier + 1);
  return next?.cost ?? 0;
}

export function getAllPerks(tier: number): GuildPerk[] {
  return HALL_TIERS.filter(t => t.tier <= tier).flatMap(t => t.perks);
}

export function getDecorationsByCategory(category: GuildDecoration["category"]): GuildDecoration[] {
  return GUILD_DECORATIONS.filter(d => d.category === category);
}

export function getTotalPassiveBonuses(placedDecorationIds: string[]): Record<string, number> {
  const bonuses: Record<string, number> = {};
  for (const id of placedDecorationIds) {
    const deco = GUILD_DECORATIONS.find(d => d.id === id);
    if (deco?.passiveBonus) {
      bonuses[deco.passiveBonus.stat] = (bonuses[deco.passiveBonus.stat] || 0) + deco.passiveBonus.value;
    }
  }
  return bonuses;
}
