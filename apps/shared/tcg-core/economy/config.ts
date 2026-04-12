/**
 * Economy configuration — centralized knobs for all currency,
 * progression, and reward systems (WS8).
 *
 * Every economy parameter lives here so balance changes are a
 * single-file edit rather than a codebase grep. The server reads
 * these constants at runtime; the client uses them for UI previews.
 */

/* ═══════════════════════════════════════════════════════
   CURRENCY TYPES
   ═══════════════════════════════════════════════════════ */

export interface CurrencyType {
  id: string;
  name: string;
  icon: string;
  /** Whether this currency is premium (real-money purchased). */
  premium: boolean;
  /** Max amount a player can hold (0 = unlimited). */
  cap: number;
  /** Description shown in the wallet UI. */
  description: string;
}

export const CURRENCIES: readonly CurrencyType[] = Object.freeze([
  {
    id: "dream_tokens",
    name: "Dream Tokens",
    icon: "💭",
    premium: false,
    cap: 0,
    description: "Earned through gameplay. Used to buy packs, cosmetics, and crafting.",
  },
  {
    id: "soul_stones",
    name: "Soul Stones",
    icon: "💎",
    premium: false,
    cap: 0,
    description: "Earned by disenchanting cards. Used to craft specific cards.",
  },
  {
    id: "void_crystals",
    name: "Void Crystals",
    icon: "🔮",
    premium: true,
    cap: 0,
    description: "Premium currency. Purchased with real money or earned rarely.",
  },
  {
    id: "season_points",
    name: "Season Points",
    icon: "⭐",
    premium: false,
    cap: 0,
    description: "Earned in ranked play. Reset each season.",
  },
]);

export const CURRENCY_MAP: Readonly<Record<string, CurrencyType>> =
  Object.freeze(Object.fromEntries(CURRENCIES.map(c => [c.id, c])));

/* ═══════════════════════════════════════════════════════
   ECONOMY KNOBS — tunable parameters
   ═══════════════════════════════════════════════════════ */

export const ECONOMY = Object.freeze({
  /** ─── Pack prices ─── */
  packs: {
    standardCost: 100,           // dream tokens
    premiumCost: 10,             // void crystals
    cardsPerPack: 5,
    pityTimer: 5,                // packs before guaranteed rare+
  },

  /** ─── Match rewards ─── */
  matchRewards: {
    winDreamTokens: 15,
    lossDreamTokens: 5,
    drawDreamTokens: 10,
    winXp: 50,
    lossXp: 20,
    /** Bonus for first win of the day. */
    firstWinBonus: 50,
    /** Max matches that award tokens per day (anti-farm). */
    dailyRewardCap: 30,
  },

  /** ─── Crafting ─── */
  crafting: {
    /** Soul stone cost to craft a card by rarity. */
    craftCosts: {
      common: 20,
      uncommon: 40,
      rare: 100,
      epic: 400,
      legendary: 1600,
    } as Record<string, number>,
    /** Soul stones received when disenchanting a card. */
    disenchantYields: {
      common: 5,
      uncommon: 10,
      rare: 20,
      epic: 100,
      legendary: 400,
    } as Record<string, number>,
    /** Extra copies beyond 3 auto-disenchant at this multiplier. */
    autoDisenchantMultiplier: 1.0,
  },

  /** ─── Daily quests ─── */
  dailyQuests: {
    /** Number of daily quests offered per day. */
    dailySlots: 3,
    /** Number of weekly quests offered. */
    weeklySlots: 2,
    /** Re-roll cost in dream tokens. */
    rerollCost: 10,
    /** Max re-rolls per day. */
    maxRerolls: 1,
  },

  /** ─── Battle Pass ─── */
  battlePass: {
    totalTiers: 50,
    xpPerTier: 1000,
    premiumCostVoidCrystals: 1000,
    /** Bonus XP for premium pass holders. */
    premiumXpMultiplier: 1.2,
  },

  /** ─── Ranked ─── */
  ranked: {
    /** Games below which the player is "provisional" (higher K-factor). */
    provisionalGames: 20,
    /** Rating points per win in provisional period. */
    provisionalK: 48,
    /** Rating points per win after provisional period. */
    standardK: 32,
    /** Rating floor — can't drop below. */
    ratingFloor: 0,
    /** Season length in days. */
    seasonLengthDays: 30,
  },

  /** ─── Trading ─── */
  trading: {
    /** Tax on marketplace sales (percentage). */
    marketplaceTaxPercent: 5,
    /** Minimum listing price in dream tokens. */
    minListingPrice: 10,
    /** Maximum active listings per player. */
    maxActiveListings: 20,
  },
}) satisfies Record<string, Record<string, unknown>>;

export type EconomyConfig = typeof ECONOMY;
