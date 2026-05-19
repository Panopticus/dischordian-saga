/* ═══════════════════════════════════════════════════════
   F.1 DREAM SINKS — Combat Dream inflation (35-78x in 90 days)

   The balance simulator shows Dream inflates wildly because
   sources (quests, fights, disenchants) far outpace sinks
   (crafting, card packs). These sinks give players meaningful
   ways to spend Dream at every stage of the game.

   NOT dead code: this is the economy *balance model*, consumed
   by economySimulator.ts and asserted by economy.balance.test.ts.
   Runtime cosmetic SKUs deliberately live in cosmeticCatalog.ts
   (see its header) — that split is intentional and these modules
   are retained for backwards compatibility, not pending deletion.
   ═══════════════════════════════════════════════════════ */

/* ─── SINK CATEGORY TYPES ─── */

export type SinkCategory = "respec" | "guild" | "cosmetic" | "enhancement" | "seasonal" | "lottery";

export interface Sink {
  id: string;
  name: string;
  description: string;
  category: SinkCategory;
  cost: number;
  /** Minimum player level required to access this sink */
  minLevel: number;
  /** Whether this sink can be used repeatedly */
  repeatable: boolean;
  /** Cooldown in hours (0 = no cooldown) */
  cooldownHours: number;
}

/* ─── SINK COST TABLE ─── */

export const SINK_COSTS = {
  // Respec
  respec_citizen: 500,
  respec_civil_skills: 750,
  respec_class_mastery: 1000,

  // Guild hall upgrades (per tier)
  guild_hall_tier_1: 100,
  guild_hall_tier_2: 300,
  guild_hall_tier_3: 750,
  guild_hall_tier_4: 1500,
  guild_hall_tier_5: 3000,
  guild_hall_tier_6: 5000,

  // Prestige cosmetics
  cosmetic_title_glow: 1000,
  cosmetic_card_border: 1500,
  cosmetic_avatar_frame: 2000,
  cosmetic_profile_banner: 3000,
  cosmetic_board_theme: 5000,
  cosmetic_turret_skin: 4000,
  cosmetic_arena_entrance: 7500,
  cosmetic_flagship_paint: 10000,

  // Card enhancement (permanent stat boosts)
  enhance_common: 200,
  enhance_uncommon: 400,
  enhance_rare: 800,
  enhance_epic: 1200,
  enhance_legendary: 2000,

  // Seasonal event shop
  seasonal_common_item: 500,
  seasonal_rare_item: 1500,
  seasonal_epic_item: 3000,
  seasonal_legendary_item: 5000,

  // Dream Lottery
  lottery_single_ticket: 100,
  lottery_triple_ticket: 250,
} as const;

/* ─── ALL SINK DEFINITIONS ─── */

export const ALL_SINKS: Sink[] = [
  // Respec sinks — previously free or very cheap
  {
    id: "respec_citizen",
    name: "Citizen Respec",
    description: "Reset your citizen trait allocations. Costs increase each time.",
    category: "respec",
    cost: SINK_COSTS.respec_citizen,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 24,
  },
  {
    id: "respec_civil_skills",
    name: "Civil Skill Respec",
    description: "Reset all civil skill points to reallocate them.",
    category: "respec",
    cost: SINK_COSTS.respec_civil_skills,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 48,
  },
  {
    id: "respec_class_mastery",
    name: "Class Mastery Respec",
    description: "Reset class mastery selections. Your XP is preserved.",
    category: "respec",
    cost: SINK_COSTS.respec_class_mastery,
    minLevel: 10,
    repeatable: true,
    cooldownHours: 72,
  },

  // Guild hall contribution tiers
  {
    id: "guild_hall_tier_1",
    name: "Guild Hall: Foundation",
    description: "Contribute to your guild hall's foundation. Unlocks basic guild storage.",
    category: "guild",
    cost: SINK_COSTS.guild_hall_tier_1,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "guild_hall_tier_2",
    name: "Guild Hall: Armory Wing",
    description: "Fund the armory expansion. Grants guild-wide +3% crafting success.",
    category: "guild",
    cost: SINK_COSTS.guild_hall_tier_2,
    minLevel: 10,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "guild_hall_tier_3",
    name: "Guild Hall: War Room",
    description: "Build the war room. Unlocks guild war planning and +5% XP for members.",
    category: "guild",
    cost: SINK_COSTS.guild_hall_tier_3,
    minLevel: 15,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "guild_hall_tier_4",
    name: "Guild Hall: Observatory",
    description: "Construct the observatory. Reveals hidden Trade Empire sectors for all members.",
    category: "guild",
    cost: SINK_COSTS.guild_hall_tier_4,
    minLevel: 25,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "guild_hall_tier_5",
    name: "Guild Hall: Void Conduit",
    description: "Install a Void Crystal conduit. Guild members earn +1 Void Crystal per week.",
    category: "guild",
    cost: SINK_COSTS.guild_hall_tier_5,
    minLevel: 35,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "guild_hall_tier_6",
    name: "Guild Hall: Ark Beacon",
    description: "Activate the Ark Beacon. Grants guild-wide +10% Dream and Salvage from all sources.",
    category: "guild",
    cost: SINK_COSTS.guild_hall_tier_6,
    minLevel: 40,
    repeatable: true,
    cooldownHours: 0,
  },

  // Prestige cosmetics
  {
    id: "cosmetic_title_glow",
    name: "Glowing Title",
    description: "Add a glowing effect to your equipped title.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_title_glow,
    minLevel: 10,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_card_border",
    name: "Prismatic Card Border",
    description: "All your cards display with an animated prismatic border.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_card_border,
    minLevel: 10,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_avatar_frame",
    name: "Prestige Avatar Frame",
    description: "A golden animated frame around your avatar.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_avatar_frame,
    minLevel: 15,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_profile_banner",
    name: "Animated Profile Banner",
    description: "An animated cosmic banner displayed on your profile.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_profile_banner,
    minLevel: 20,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_board_theme",
    name: "Dischordia Board Theme",
    description: "Custom animated board theme for Dischordia matches.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_board_theme,
    minLevel: 20,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_turret_skin",
    name: "Turret Skin Pack",
    description: "Unique visual skins for all turret types in Terminus Swarm.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_turret_skin,
    minLevel: 15,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_arena_entrance",
    name: "Arena Entrance Effect",
    description: "A dramatic visual effect when you enter the Collector's Arena.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_arena_entrance,
    minLevel: 25,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_flagship_paint",
    name: "Flagship Custom Paint",
    description: "A legendary custom paint job for your Trade Empire flagship.",
    category: "cosmetic",
    cost: SINK_COSTS.cosmetic_flagship_paint,
    minLevel: 30,
    repeatable: false,
    cooldownHours: 0,
  },

  // Card enhancement (Dream cost to permanently boost a card)
  {
    id: "enhance_common",
    name: "Enhance Common Card",
    description: "Permanently boost a common card's power and health by +1.",
    category: "enhancement",
    cost: SINK_COSTS.enhance_common,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "enhance_uncommon",
    name: "Enhance Uncommon Card",
    description: "Permanently boost an uncommon card's power and health by +1.",
    category: "enhancement",
    cost: SINK_COSTS.enhance_uncommon,
    minLevel: 10,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "enhance_rare",
    name: "Enhance Rare Card",
    description: "Permanently boost a rare card's power and health by +1.",
    category: "enhancement",
    cost: SINK_COSTS.enhance_rare,
    minLevel: 15,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "enhance_epic",
    name: "Enhance Epic Card",
    description: "Permanently boost an epic card's power and health by +1.",
    category: "enhancement",
    cost: SINK_COSTS.enhance_epic,
    minLevel: 20,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "enhance_legendary",
    name: "Enhance Legendary Card",
    description: "Permanently boost a legendary card's power and health by +2.",
    category: "enhancement",
    cost: SINK_COSTS.enhance_legendary,
    minLevel: 25,
    repeatable: true,
    cooldownHours: 0,
  },

  // Seasonal event shop
  {
    id: "seasonal_common_item",
    name: "Seasonal Common Reward",
    description: "A limited-time common item from the current seasonal event.",
    category: "seasonal",
    cost: SINK_COSTS.seasonal_common_item,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "seasonal_rare_item",
    name: "Seasonal Rare Reward",
    description: "A limited-time rare item from the current seasonal event.",
    category: "seasonal",
    cost: SINK_COSTS.seasonal_rare_item,
    minLevel: 10,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "seasonal_epic_item",
    name: "Seasonal Epic Reward",
    description: "A limited-time epic item from the current seasonal event.",
    category: "seasonal",
    cost: SINK_COSTS.seasonal_epic_item,
    minLevel: 20,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "seasonal_legendary_item",
    name: "Seasonal Legendary Reward",
    description: "A limited-time legendary item from the current seasonal event.",
    category: "seasonal",
    cost: SINK_COSTS.seasonal_legendary_item,
    minLevel: 30,
    repeatable: true,
    cooldownHours: 0,
  },

  // Dream Lottery
  {
    id: "lottery_single_ticket",
    name: "Dream Lottery Ticket",
    description: "One chance at rare items: Void Crystals, exclusive cards, or cosmetics.",
    category: "lottery",
    cost: SINK_COSTS.lottery_single_ticket,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 24,
  },
  {
    id: "lottery_triple_ticket",
    name: "Dream Lottery Bundle (3x)",
    description: "Three lottery draws at a discount. Better odds of hitting rare prizes.",
    category: "lottery",
    cost: SINK_COSTS.lottery_triple_ticket,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 24,
  },
];

/* ─── RECOMMENDATION ENGINE ─── */

/**
 * Suggests Dream sinks appropriate for the player's current state.
 * Prioritizes sinks the player can afford and hasn't unlocked yet.
 * Returns up to 5 recommendations sorted by relevance.
 */
export function getRecommendedSinks(
  playerLevel: number,
  dreamBalance: number,
): Sink[] {
  // Filter to sinks the player can access and afford
  const eligible = ALL_SINKS.filter(
    (sink) => playerLevel >= sink.minLevel && dreamBalance >= sink.cost,
  );

  // Score each sink based on how well it matches the player's state
  const scored = eligible.map((sink) => {
    let score = 0;

    // Prefer sinks that cost a meaningful fraction of balance (10-50%)
    const costRatio = sink.cost / dreamBalance;
    if (costRatio >= 0.1 && costRatio <= 0.5) {
      score += 30;
    } else if (costRatio < 0.1) {
      score += 10; // Too cheap to matter much, but still valid
    } else {
      score += 5; // Expensive relative to balance
    }

    // Boost guild sinks for mid-game players (10-30)
    if (sink.category === "guild" && playerLevel >= 10 && playerLevel <= 35) {
      score += 20;
    }

    // Boost enhancement sinks for players with high balances (likely inflated)
    if (sink.category === "enhancement" && dreamBalance > 2000) {
      score += 25;
    }

    // Boost cosmetics for endgame players
    if (sink.category === "cosmetic" && playerLevel >= 25) {
      score += 15;
    }

    // Boost lottery for players with extreme surplus (inflation indicator)
    if (sink.category === "lottery" && dreamBalance > 5000) {
      score += 20;
    }

    // Boost respec for mid-game players who might want to experiment
    if (sink.category === "respec" && playerLevel >= 10 && playerLevel <= 30) {
      score += 15;
    }

    // Boost seasonal items — limited-time urgency
    if (sink.category === "seasonal") {
      score += 10;
    }

    return { sink, score };
  });

  // Sort by score descending, take top 5
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map((s) => s.sink);
}
