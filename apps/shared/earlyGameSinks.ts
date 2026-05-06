/* ═══════════════════════════════════════════════════════
   F.0 EARLY-GAME & SOUL-STONE SINKS

   The 90-day simulator (`economySimulator.ts`) flagged two
   gaps left open by `economySinks.ts` and `endgameSinks.ts`:

   1. Casual players at L1-8 hit inflation factors >50× because
      the cheapest weekly sink that fits their level (lottery,
      seasonal common, guild hall t1) is either still gated by
      level requirements or doesn't fire on a typical engagement
      pattern.
   2. Disenchanted Soul Stones accumulate with only one outlet
      (crafting). A casual player ends 90 days with 300+ stones
      and no path to spend them outside a legendary craft they
      can't afford anyway.

   This module fills both. Costs are deliberately small (Dream)
   or in the otherwise-stranded currency (Soul Stones).
   ═══════════════════════════════════════════════════════ */

/* ─── Early-game Dream sinks ─── */

export type EarlyGameSinkCategory = "onboarding" | "convenience" | "vanity";

export interface EarlyGameSink {
  id: string;
  name: string;
  description: string;
  category: EarlyGameSinkCategory;
  /** Cost in Dream Tokens. */
  cost: number;
  minLevel: number;
  /** Whether this can be used repeatedly. */
  repeatable: boolean;
  /** Cooldown in hours (0 = no cooldown). */
  cooldownHours: number;
}

export const EARLY_GAME_SINK_COSTS = {
  // Convenience purchases — fire daily, small denominations
  card_of_the_day: 50,
  deck_slot: 100,
  cosmetic_card_back_basic: 200,
  cosmetic_avatar_basic: 150,
  // Onboarding tutorials & retries
  practice_match_token: 25,
  mulligan_extra: 30,
  // Repeatable consumables
  xp_booster_15min: 75,
  dream_chest_small: 100,
  dream_chest_medium: 250,
} as const;

export const EARLY_GAME_SINKS: EarlyGameSink[] = [
  {
    id: "card_of_the_day",
    name: "Card of the Day",
    description:
      "Buy a single random Common or Uncommon card. Once per day. Designed " +
      "to give new players a steady drip without forcing pack purchases.",
    category: "onboarding",
    cost: EARLY_GAME_SINK_COSTS.card_of_the_day,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 24,
  },
  {
    id: "deck_slot",
    name: "Deck Slot",
    description:
      "Unlock an additional saved deck slot. Players start with 3; each " +
      "slot beyond that costs 100 Dream up to a cap of 12.",
    category: "convenience",
    cost: EARLY_GAME_SINK_COSTS.deck_slot,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_card_back_basic",
    name: "Basic Card Back",
    description:
      "A non-animated card back for your decks. The cheapest cosmetic " +
      "in the game — designed to feel achievable in week one.",
    category: "vanity",
    cost: EARLY_GAME_SINK_COSTS.cosmetic_card_back_basic,
    minLevel: 1,
    repeatable: false,
    cooldownHours: 0,
  },
  {
    id: "cosmetic_avatar_basic",
    name: "Basic Avatar",
    description:
      "Choose from a roster of static avatar portraits. Repeatable — pick " +
      "as many as you want for your collection.",
    category: "vanity",
    cost: EARLY_GAME_SINK_COSTS.cosmetic_avatar_basic,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "practice_match_token",
    name: "Practice Match Token",
    description:
      "Spend on a guided practice match against an AI tuned to your skill. " +
      "Wins still count for daily quests but not for ranked.",
    category: "onboarding",
    cost: EARLY_GAME_SINK_COSTS.practice_match_token,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "mulligan_extra",
    name: "Extra Mulligan",
    description:
      "Buy one additional mulligan for your next ranked match. " +
      "Single-use, applies on next match start.",
    category: "convenience",
    cost: EARLY_GAME_SINK_COSTS.mulligan_extra,
    minLevel: 3,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "xp_booster_15min",
    name: "15-Minute XP Booster",
    description:
      "+50% XP from all sources for 15 minutes of real time. Stackable.",
    category: "convenience",
    cost: EARLY_GAME_SINK_COSTS.xp_booster_15min,
    minLevel: 2,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "dream_chest_small",
    name: "Small Dream Chest",
    description:
      "A small mystery chest. Always returns at least 1 Common card and " +
      "a small amount of Soul Stones. Repeatable.",
    category: "convenience",
    cost: EARLY_GAME_SINK_COSTS.dream_chest_small,
    minLevel: 1,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "dream_chest_medium",
    name: "Medium Dream Chest",
    description:
      "A medium mystery chest. Guarantees at least one Uncommon card.",
    category: "convenience",
    cost: EARLY_GAME_SINK_COSTS.dream_chest_medium,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 0,
  },
];

/* ─── Soul Stone sinks (alternative to crafting) ─── */

export type SoulStoneSinkCategory = "transmute" | "shrine" | "boost";

export interface SoulStoneSink {
  id: string;
  name: string;
  description: string;
  category: SoulStoneSinkCategory;
  /** Cost in Soul Stones. */
  cost: number;
  /** Cost in Dream Tokens (often 0 — these sinks are mostly soul-stone only). */
  dreamCost: number;
  minLevel: number;
  repeatable: boolean;
  cooldownHours: number;
}

export const SOUL_STONE_SINK_COSTS = {
  transmute_to_dream: 50, // 50 souls → 100 Dream (lossy on purpose)
  shrine_minor_blessing: 100,
  shrine_major_blessing: 500,
  shrine_void_blessing: 2000,
  pack_reroll: 75,
  enhance_dust_glow: 200,
  enhance_dust_aura: 1000,
} as const;

export const SOUL_STONE_SINKS: SoulStoneSink[] = [
  {
    id: "transmute_to_dream",
    name: "Transmute Soul Stones → Dream",
    description:
      "Convert 50 Soul Stones into 100 Dream tokens. The exchange is " +
      "deliberately lossy (40% of the equivalent crafting value) to " +
      "discourage soul-stone farming as a Dream printer.",
    category: "transmute",
    cost: SOUL_STONE_SINK_COSTS.transmute_to_dream,
    dreamCost: 0,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "shrine_minor_blessing",
    name: "Shrine: Minor Blessing",
    description:
      "Offer Soul Stones at the Dreamer's Shrine for a +5% Dream income " +
      "buff lasting 24h. Stackable up to 3 hours-worth.",
    category: "shrine",
    cost: SOUL_STONE_SINK_COSTS.shrine_minor_blessing,
    dreamCost: 0,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 24,
  },
  {
    id: "shrine_major_blessing",
    name: "Shrine: Major Blessing",
    description:
      "A larger offering. +10% Dream and +5% XP for 24h.",
    category: "shrine",
    cost: SOUL_STONE_SINK_COSTS.shrine_major_blessing,
    dreamCost: 0,
    minLevel: 15,
    repeatable: true,
    cooldownHours: 24,
  },
  {
    id: "shrine_void_blessing",
    name: "Shrine: Void Blessing",
    description:
      "The deepest shrine offering. Grants 1 Void Crystal and a temporary " +
      "+15% Dream income for 24h. Capped at one per week.",
    category: "shrine",
    cost: SOUL_STONE_SINK_COSTS.shrine_void_blessing,
    dreamCost: 0,
    minLevel: 25,
    repeatable: true,
    cooldownHours: 168,
  },
  {
    id: "pack_reroll",
    name: "Pack Reroll",
    description:
      "Spend Soul Stones to reroll the contents of an unopened pack. The " +
      "reroll uses a fresh seed; you keep whichever result you prefer.",
    category: "transmute",
    cost: SOUL_STONE_SINK_COSTS.pack_reroll,
    dreamCost: 0,
    minLevel: 5,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "enhance_dust_glow",
    name: "Card Enhancement: Glow",
    description:
      "Add a subtle glow effect to a single card. Purely visual.",
    category: "boost",
    cost: SOUL_STONE_SINK_COSTS.enhance_dust_glow,
    dreamCost: 0,
    minLevel: 10,
    repeatable: true,
    cooldownHours: 0,
  },
  {
    id: "enhance_dust_aura",
    name: "Card Enhancement: Aura",
    description:
      "Add a particle aura around a card — visible during play.",
    category: "boost",
    cost: SOUL_STONE_SINK_COSTS.enhance_dust_aura,
    dreamCost: 0,
    minLevel: 20,
    repeatable: true,
    cooldownHours: 0,
  },
];

/* ─── Public API ─── */

export function getEarlyGameSinks(level: number): EarlyGameSink[] {
  return EARLY_GAME_SINKS.filter((s) => level >= s.minLevel);
}

export function getSoulStoneSinks(level: number): SoulStoneSink[] {
  return SOUL_STONE_SINKS.filter((s) => level >= s.minLevel);
}

/**
 * Suggests early-game sinks ordered by relevance for the player's state.
 *
 * Priority:
 *   1. Affordable + matches the player's current goal (onboarding < L5,
 *      convenience L5-15, vanity any).
 *   2. Smallest cost first (early players prefer micro-spends).
 */
export function getRecommendedEarlyGameSinks(
  playerLevel: number,
  dreamBalance: number,
): EarlyGameSink[] {
  const eligible = EARLY_GAME_SINKS.filter(
    (s) => playerLevel >= s.minLevel && dreamBalance >= s.cost,
  );

  return eligible.sort((a, b) => {
    // Onboarding wins for L1-4
    if (playerLevel < 5) {
      if (a.category === "onboarding" && b.category !== "onboarding") return -1;
      if (b.category === "onboarding" && a.category !== "onboarding") return 1;
    }
    // Otherwise sort by ascending cost (cheapest options first)
    return a.cost - b.cost;
  }).slice(0, 5);
}

/**
 * Suggests soul-stone sinks for a player. Always returns the cheapest first
 * since soul stones accumulate slowly for casual players.
 */
export function getRecommendedSoulStoneSinks(
  playerLevel: number,
  soulStoneBalance: number,
): SoulStoneSink[] {
  return SOUL_STONE_SINKS
    .filter((s) => playerLevel >= s.minLevel && soulStoneBalance >= s.cost)
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 5);
}
