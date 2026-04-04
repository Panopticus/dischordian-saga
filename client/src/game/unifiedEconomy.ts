/* ═══════════════════════════════════════════════════════
   UNIFIED ECONOMY — Every game feeds one economy.
   Every action creates meaningful choices.

   Based on: Genshin Impact, Marvel Snap, Clash Royale,
   Pokemon TCG Pocket, Honkai Star Rail

   Core principle: earn anywhere, spend everywhere,
   progress matters, premium accelerates but doesn't gate.
   ═══════════════════════════════════════════════════════ */

/* ─── UNIVERSAL RESOURCES ─── */

/**
 * 4 resources that flow across ALL game modes.
 * Replaces the orphaned 12-material system.
 */
export interface UniversalResources {
  /** Primary premium currency. Earned everywhere, spent on crafting/marketplace/packs. */
  dream: number;
  /** Raw building material. From Terminus Swarm, fight wins, chess, salvage missions. */
  salvage: number;
  /** Rare endgame material. From bosses, Trade Empire, high-tier quests. */
  voidCrystals: number;
  /** Social/political currency. From Trade Empire, diplomacy, guild activities. */
  influence: number;
}

/* ─── CRAFTING THAT MATTERS ─── */

export type CraftableType = "weapon_mod" | "shield_mod" | "tactical_chip" | "trade_license" | "fleet_upgrade" | "turret_blueprint" | "card_enhancer";

export interface CraftableDef {
  id: string;
  name: string;
  type: CraftableType;
  description: string;
  /** What it costs to craft */
  cost: { dream?: number; salvage?: number; voidCrystals?: number; influence?: number; cardIds?: string[] };
  /** What gameplay bonuses it provides */
  bonuses: CraftableBonus[];
  /** Duration in hours (0 = permanent) */
  duration: number;
  /** Crafting skill level required */
  craftingLevelReq: number;
  /** Success rate (modified by civil skill Craftsmanship) */
  baseSuccessRate: number;
  tier: 1 | 2 | 3 | 4;
}

export type CraftableBonus =
  | { game: "fight"; stat: "damage" | "defense" | "speed" | "hp"; value: number; percent: boolean }
  | { game: "dischordia"; stat: "mana" | "draw" | "unit_power" | "unit_health"; value: number; percent: boolean }
  | { game: "chess"; stat: "time_bonus" | "elo_bonus" | "depth_bonus"; value: number; percent: boolean }
  | { game: "terminus"; stat: "turret_damage" | "core_hp" | "resource_bonus" | "range"; value: number; percent: boolean }
  | { game: "trade_empire"; stat: "mission_speed" | "trade_profit" | "fleet_combat" | "fleet_cargo"; value: number; percent: boolean }
  | { game: "all"; stat: "xp_bonus" | "dream_bonus" | "quest_slots"; value: number; percent: boolean };

export const CRAFTABLE_ITEMS: CraftableDef[] = [
  // Tier 1: Basic (available immediately)
  {
    id: "basic_weapon_mod",
    name: "Mk.I Combat Amplifier",
    type: "weapon_mod",
    description: "Salvaged Ark components repurposed for combat enhancement. Boosts damage across all combat modes.",
    cost: { salvage: 50, dream: 10 },
    bonuses: [
      { game: "fight", stat: "damage", value: 5, percent: true },
      { game: "terminus", stat: "turret_damage", value: 5, percent: true },
    ],
    duration: 24, // 24 hours
    craftingLevelReq: 0,
    baseSuccessRate: 95,
    tier: 1,
  },
  {
    id: "basic_shield_mod",
    name: "Mk.I Deflection Matrix",
    type: "shield_mod",
    description: "Emergency shielding cobbled from hull plating. Reduces damage taken and strengthens defenses.",
    cost: { salvage: 60, dream: 10 },
    bonuses: [
      { game: "fight", stat: "defense", value: 5, percent: true },
      { game: "terminus", stat: "core_hp", value: 10, percent: true },
    ],
    duration: 24,
    craftingLevelReq: 0,
    baseSuccessRate: 95,
    tier: 1,
  },
  {
    id: "basic_tactical_chip",
    name: "Mk.I Neural Optimizer",
    type: "tactical_chip",
    description: "Enhances cognitive processing. Gives you an edge in strategic games.",
    cost: { salvage: 40, dream: 15 },
    bonuses: [
      { game: "chess", stat: "time_bonus", value: 30, percent: false }, // +30 seconds
      { game: "dischordia", stat: "mana", value: 1, percent: false },  // +1 starting mana
    ],
    duration: 24,
    craftingLevelReq: 0,
    baseSuccessRate: 95,
    tier: 1,
  },
  {
    id: "basic_trade_license",
    name: "Free Ports Trade Permit",
    type: "trade_license",
    description: "Legitimate trading credentials for the Free Ports. Better prices and faster missions.",
    cost: { salvage: 30, influence: 5, dream: 20 },
    bonuses: [
      { game: "trade_empire", stat: "trade_profit", value: 10, percent: true },
      { game: "trade_empire", stat: "mission_speed", value: 10, percent: true },
    ],
    duration: 48, // 48 hours
    craftingLevelReq: 0,
    baseSuccessRate: 90,
    tier: 1,
  },

  // Tier 2: Advanced (crafting level 3+)
  {
    id: "adv_weapon_mod",
    name: "Mk.II Combat Amplifier",
    type: "weapon_mod",
    description: "Precision-engineered from Neural Cores. Significant combat enhancement.",
    cost: { salvage: 150, dream: 30, voidCrystals: 1 },
    bonuses: [
      { game: "fight", stat: "damage", value: 12, percent: true },
      { game: "terminus", stat: "turret_damage", value: 12, percent: true },
      { game: "trade_empire", stat: "fleet_combat", value: 8, percent: true },
    ],
    duration: 48,
    craftingLevelReq: 3,
    baseSuccessRate: 80,
    tier: 2,
  },
  {
    id: "adv_tactical_chip",
    name: "Mk.II Neural Optimizer",
    type: "tactical_chip",
    description: "Advanced cognitive enhancement. Substantial strategic advantage.",
    cost: { salvage: 100, dream: 40, voidCrystals: 1 },
    bonuses: [
      { game: "chess", stat: "time_bonus", value: 60, percent: false },
      { game: "dischordia", stat: "draw", value: 1, percent: false }, // +1 card draw per turn
      { game: "dischordia", stat: "unit_power", value: 5, percent: true },
    ],
    duration: 48,
    craftingLevelReq: 3,
    baseSuccessRate: 75,
    tier: 2,
  },
  {
    id: "card_enhancer_rare",
    name: "Resonance Infuser",
    type: "card_enhancer",
    description: "Permanently boosts a card's power and health. The infusion draws on Void Crystal energy.",
    cost: { dream: 50, voidCrystals: 2 },
    bonuses: [
      { game: "dischordia", stat: "unit_power", value: 1, percent: false },
      { game: "dischordia", stat: "unit_health", value: 1, percent: false },
    ],
    duration: 0, // Permanent
    craftingLevelReq: 3,
    baseSuccessRate: 70,
    tier: 2,
  },

  // Tier 3: Expert (crafting level 6+)
  {
    id: "fleet_upgrade_engines",
    name: "Warp Drive Calibration",
    type: "fleet_upgrade",
    description: "Overhaul fleet propulsion systems. Dramatically faster missions and sector travel.",
    cost: { salvage: 500, dream: 100, voidCrystals: 5, influence: 20 },
    bonuses: [
      { game: "trade_empire", stat: "mission_speed", value: 25, percent: true },
      { game: "trade_empire", stat: "fleet_cargo", value: 15, percent: true },
    ],
    duration: 0, // Permanent
    craftingLevelReq: 6,
    baseSuccessRate: 60,
    tier: 3,
  },
  {
    id: "turret_blueprint_advanced",
    name: "Archon-Class Turret Schematic",
    type: "turret_blueprint",
    description: "Reverse-engineered from Artificial Empire defense technology. Unlocks Tier 4 turrets.",
    cost: { salvage: 400, voidCrystals: 10, influence: 15 },
    bonuses: [
      { game: "terminus", stat: "turret_damage", value: 20, percent: true },
      { game: "terminus", stat: "range", value: 15, percent: true },
    ],
    duration: 0, // Permanent
    craftingLevelReq: 6,
    baseSuccessRate: 50,
    tier: 3,
  },

  // Tier 4: Legendary (crafting level 9+)
  {
    id: "universal_enhancer",
    name: "Reality Harmonizer",
    type: "card_enhancer",
    description: "A device that resonates with the fabric of the CoNexus itself. Boosts everything. Permanently.",
    cost: { salvage: 1000, dream: 500, voidCrystals: 25, influence: 50 },
    bonuses: [
      { game: "all", stat: "xp_bonus", value: 10, percent: true },
      { game: "all", stat: "dream_bonus", value: 10, percent: true },
    ],
    duration: 0,
    craftingLevelReq: 9,
    baseSuccessRate: 35,
    tier: 4,
  },
];

/* ─── PREMIUM SUBSCRIPTION ─── */

export interface PremiumSubscription {
  name: string;
  price: string;
  benefits: PremiumBenefit[];
}

export interface PremiumBenefit {
  id: string;
  description: string;
  value: number;
  type: "percent_boost" | "flat_bonus" | "feature_unlock" | "daily_reward";
  game: "all" | "fight" | "chess" | "dischordia" | "terminus" | "trade_empire";
}

export const ARK_COMMANDER_SUB: PremiumSubscription = {
  name: "Ark Commander",
  price: "$4.99/month",
  benefits: [
    { id: "mission_speed", description: "20% faster Trade Empire missions", value: 20, type: "percent_boost", game: "trade_empire" },
    { id: "daily_pack", description: "Free daily card pack", value: 1, type: "daily_reward", game: "dischordia" },
    { id: "quest_slots", description: "+2 daily quest slots", value: 2, type: "flat_bonus", game: "all" },
    { id: "resource_boost", description: "10% more resources from all games", value: 10, type: "percent_boost", game: "all" },
    { id: "craft_boost", description: "10% higher craft success rate", value: 10, type: "percent_boost", game: "all" },
    { id: "xp_boost", description: "15% more XP from all actions", value: 15, type: "percent_boost", game: "all" },
    { id: "monthly_cosmetic", description: "Exclusive monthly cosmetic", value: 1, type: "feature_unlock", game: "all" },
    { id: "pvp_priority", description: "Priority PvP matchmaking", value: 1, type: "feature_unlock", game: "all" },
    { id: "ad_free", description: "No ads (if ads ever added)", value: 1, type: "feature_unlock", game: "all" },
    { id: "monthly_void", description: "3 Void Crystals per month", value: 3, type: "daily_reward", game: "all" },
  ],
};

/* ─── RESOURCE FLOW MAP ─── */

/**
 * Where each resource is EARNED and SPENT.
 * This is the blueprint for a healthy economy.
 */
export const RESOURCE_FLOW = {
  dream: {
    earned: [
      "Disenchanting cards (1-200 per card)",
      "Quest completion (10-100 per quest)",
      "Chess wins (trait-boosted)",
      "Fight wins (trait-boosted)",
      "Dischordia wins",
      "Trade Empire mission rewards",
      "Battle pass tiers",
      "Marketplace sales",
      "Daily login (5 Dream)",
    ],
    spent: [
      "Crafting recipes (10-500 per craft)",
      "Marketplace purchases",
      "Card pack opening (25 per pack)",
      "Citizen respec",
      "Fleet upgrades",
      "Sector conquest (Trade Empire)",
      "Agent recruitment",
    ],
  },
  salvage: {
    earned: [
      "Terminus Swarm waves (primary source)",
      "Fight wins (secondary)",
      "Trade Empire exploration missions",
      "Deconstructing fleet units",
      "Guild war victories",
    ],
    spent: [
      "Turret construction (Terminus)",
      "Barricade building",
      "Crafting weapon/shield mods",
      "Fleet ship construction",
      "Sector infrastructure (Trade Empire)",
    ],
  },
  voidCrystals: {
    earned: [
      "Terminus Swarm boss kills (primary)",
      "Trade Empire dangerous missions",
      "Epoch quest completion",
      "Monthly premium reward (3)",
      "Guild war grand prizes",
    ],
    spent: [
      "Tier 2+ crafting (1-25 per craft)",
      "Legendary card enhancement",
      "Fleet flagship upgrades",
      "Sector conquest (high-value sectors)",
      "The ONLY resource that can't be bought with real money",
    ],
  },
  influence: {
    earned: [
      "Trade Empire diplomacy (primary)",
      "Guild activities and donations",
      "Completing diplomacy missions",
      "Reputation milestones with factions",
    ],
    spent: [
      "Trade licenses (crafting)",
      "Sector conquest (Trade Empire)",
      "Diplomatic actions (negotiate, demand)",
      "Agent recruitment (high-level agents)",
    ],
  },
};

/* ─── ENDGAME SINKS ─── */

/**
 * Things that cost A LOT and provide meaningful progress.
 * These prevent resource hoarding and drive long-term engagement.
 */
export const ENDGAME_SINKS = [
  { name: "Flagship Restoration", description: "Fully repair Ark 1047 to 100% HP", cost: { salvage: 5000, dream: 500, voidCrystals: 10 } },
  { name: "Second Fleet Ship", description: "Build a cruiser-class vessel", cost: { salvage: 3000, dream: 300, voidCrystals: 5, influence: 30 } },
  { name: "Sector Conquest (Independent)", description: "Take control of an independent sector", cost: { salvage: 2000, dream: 200, influence: 50 } },
  { name: "Sector Conquest (Faction)", description: "Assault a faction-controlled sector", cost: { salvage: 5000, dream: 500, voidCrystals: 15, influence: 100 } },
  { name: "Guild War Entry", description: "Enter your guild into a territorial war", cost: { dream: 1000 }, source: "guild_treasury" },
  { name: "Legendary Card Fusion", description: "Fuse 3 legendary cards into 1 mythic", cost: { dream: 200, voidCrystals: 10 } },
  { name: "Reality Harmonizer", description: "Permanent 10% boost to all resources and XP", cost: { salvage: 1000, dream: 500, voidCrystals: 25, influence: 50 } },
  { name: "Dreamer Shield Probe", description: "Attempt to penetrate the Dreamer's barrier (story unlock)", cost: { voidCrystals: 50, influence: 200 } },
];

/* ─── CARD POWER IN DISCHORDIA ─── */

/**
 * How card stats should affect Dischordia gameplay.
 * This makes cards meaningful, not just collectible.
 */
export const CARD_POWER_RULES = {
  /** Card power stat directly maps to unit attack on the board */
  powerToAttack: true,
  /** Card health stat directly maps to unit health on the board */
  healthToHealth: true,
  /** Card cost maps to mana cost */
  costToMana: true,
  /** Upgraded cards (+1/+1 from crafting) are genuinely stronger */
  upgradesAffectGameplay: true,
  /** Rarity affects keyword count (common: 0-1, rare: 1-2, legendary: 2-3) */
  rarityAffectsKeywords: true,
  /** Foil cards get +1 to a random stat */
  foilBonus: true,
};

/* ─── DAILY REWARDS ─── */

export interface DailyReward {
  day: number; // 1-30 (monthly cycle)
  reward: { dream?: number; salvage?: number; voidCrystals?: number; cardPack?: string; craftItem?: string };
}

export const DAILY_LOGIN_REWARDS: DailyReward[] = [
  { day: 1, reward: { dream: 5 } },
  { day: 2, reward: { salvage: 25 } },
  { day: 3, reward: { dream: 10 } },
  { day: 4, reward: { salvage: 50 } },
  { day: 5, reward: { dream: 15, cardPack: "season1" } },
  { day: 6, reward: { salvage: 75 } },
  { day: 7, reward: { dream: 25, voidCrystals: 1 } },
  { day: 10, reward: { dream: 50 } },
  { day: 14, reward: { dream: 50, cardPack: "season1", voidCrystals: 2 } },
  { day: 21, reward: { dream: 100, voidCrystals: 3 } },
  { day: 28, reward: { dream: 150, voidCrystals: 5, cardPack: "season2" } },
  { day: 30, reward: { dream: 200, voidCrystals: 5, craftItem: "basic_weapon_mod" } },
];

/* ─── ECONOMY HELPER FUNCTIONS ─── */

/**
 * Apply active crafted item bonuses to a game action.
 */
export function getActiveBonuses(
  equippedItems: Array<{ item: CraftableDef; equippedAt: number }>,
  game: string,
): Map<string, number> {
  const bonuses = new Map<string, number>();
  const now = Date.now();

  for (const { item, equippedAt } of equippedItems) {
    // Check if expired
    if (item.duration > 0 && now > equippedAt + item.duration * 3600000) continue;

    for (const bonus of item.bonuses) {
      if (bonus.game === game || bonus.game === "all") {
        const key = bonus.stat;
        const current = bonuses.get(key) || 0;
        bonuses.set(key, current + bonus.value);
      }
    }
  }

  return bonuses;
}

/**
 * Calculate the total resource multiplier from premium sub + NFT + civil skills.
 */
export function getResourceMultiplier(
  isPremium: boolean,
  nftLevel: number,
  civilSkillLevel: number,
): number {
  let mult = 1.0;
  if (isPremium) mult += 0.10; // +10% from premium
  if (nftLevel > 0) mult += nftLevel * 0.05; // +5% per NFT level
  if (civilSkillLevel > 0) mult += civilSkillLevel * 0.02; // +2% per civil skill level
  return mult;
}
