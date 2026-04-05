/* ═══════════════════════════════════════════════════════
   MONETIZATION SYSTEM — Fair Value, Not Pay-to-Win

   Core principle: PAYING ACCELERATES, NEVER GATES.
   Everything can be earned through gameplay.
   Premium gives convenience and cosmetics, not power.

   Fortnite's cosmetic-only model, Marvel Snap's season pass,
   Path of Exile's stash tabs (QoL, not power)

   Revenue streams:
   1. Ark Commander Subscription ($4.99/mo)
   2. Epoch Pass Premium Track ($4.99/season)
   3. Dream Token Packs (direct purchase)
   4. Cosmetic Bundles (limited-time)
   5. Ne-Yon's Chosen Casino VIP (cosmetic)
   ═══════════════════════════════════════════════════════ */

/* ─── 1. ARK COMMANDER SUBSCRIPTION ─── */

export interface ArkCommanderPerks {
  /** Daily Dream bonus (login reward doubled) */
  dailyDreamBonus: number;
  /** Extra daily quest slot */
  extraDailyQuests: number;
  /** Crafting speed bonus */
  craftingSpeedPercent: number;
  /** Extra NPC gift per day */
  extraGiftsPerDay: number;
  /** Extra clone in Gamemaster's Arena */
  extraArenaClones: number;
  /** Extra Incursion run per week */
  extraIncursionRuns: number;
  /** Exclusive ship theme */
  exclusiveTheme: string;
  /** Priority queue for matchmaking */
  priorityQueue: boolean;
  /** Ad-free experience (if ads ever added) */
  adFree: boolean;
  /** Cosmetic badge on profile */
  commanderBadge: boolean;
}

export const ARK_COMMANDER: {
  price: string;
  perks: ArkCommanderPerks;
  description: string;
} = {
  price: "$4.99/month",
  perks: {
    dailyDreamBonus: 30,       // +30 Dream per day (900/month value)
    extraDailyQuests: 1,       // 4 daily quests instead of 3
    craftingSpeedPercent: 20,  // 20% faster crafting
    extraGiftsPerDay: 1,       // Gift 2 NPCs per day instead of 1
    extraArenaClones: 1,       // 2 quiz show clones/day instead of 1
    extraIncursionRuns: 1,     // 4 Incursion runs/week instead of 3
    exclusiveTheme: "commander_gold",
    priorityQueue: true,
    adFree: true,
    commanderBadge: true,
  },
  description: "Support the Ark. Accelerate your journey. Look good doing it.",
};

/* ─── 2. EPOCH PASS PREMIUM ─── */

export const EPOCH_PASS_PREMIUM = {
  price: "$4.99/season",
  /** What premium adds beyond free track */
  exclusiveRewards: [
    "Exclusive character skin per season",
    "Exclusive ship theme per season",
    "Exclusive specimen accessory per season",
    "Premium-only cards (cosmetic variants, same stats)",
    "Double XP weekends",
    "Early access to new game modes",
  ],
  /** What premium does NOT give */
  doesNotGive: [
    "No stat advantages in PvP",
    "No exclusive gameplay content",
    "No level skipping",
    "No resource multiplication beyond what free players earn",
  ],
};

/* ─── 3. DREAM TOKEN PACKS ─── */

export interface DreamPack {
  id: string;
  name: string;
  dreamAmount: number;
  bonusDream: number;
  price: string;
  priceValue: number; // cents
  /** Value per dollar (higher = better deal) */
  valuePerDollar: number;
  bestValue: boolean;
  /** Bonus items included */
  bonusItems?: { type: string; amount: number }[];
}

export const DREAM_PACKS: DreamPack[] = [
  {
    id: "pack_starter", name: "Starter Pack", dreamAmount: 100, bonusDream: 0,
    price: "$0.99", priceValue: 99, valuePerDollar: 101, bestValue: false,
  },
  {
    id: "pack_explorer", name: "Explorer Pack", dreamAmount: 500, bonusDream: 50,
    price: "$4.99", priceValue: 499, valuePerDollar: 110, bestValue: false,
    bonusItems: [{ type: "card_pack", amount: 1 }],
  },
  {
    id: "pack_commander", name: "Commander Pack", dreamAmount: 1200, bonusDream: 200,
    price: "$9.99", priceValue: 999, valuePerDollar: 140, bestValue: true,
    bonusItems: [{ type: "card_pack", amount: 3 }, { type: "specimen_egg", amount: 1 }],
  },
  {
    id: "pack_admiral", name: "Admiral Pack", dreamAmount: 3000, bonusDream: 750,
    price: "$19.99", priceValue: 1999, valuePerDollar: 188, bestValue: false,
    bonusItems: [{ type: "card_pack", amount: 8 }, { type: "specimen_egg", amount: 2 }, { type: "dye_random", amount: 1 }],
  },
  {
    id: "pack_archon", name: "Archon Pack", dreamAmount: 8000, bonusDream: 3000,
    price: "$49.99", priceValue: 4999, valuePerDollar: 220, bestValue: false,
    bonusItems: [{ type: "card_pack", amount: 20 }, { type: "specimen_egg", amount: 5 }, { type: "dye_random", amount: 3 }, { type: "exclusive_cosmetic", amount: 1 }],
  },
];

/* ─── 4. COSMETIC BUNDLES ─── */

export interface CosmeticBundle {
  id: string;
  name: string;
  description: string;
  /** What's included */
  contents: { type: string; id: string; name: string }[];
  price: string;
  priceValue: number;
  /** Limited time? */
  limited: boolean;
  expiresAt?: string;
  /** Theme/NPC association */
  theme: string;
}

export const COSMETIC_BUNDLES: CosmeticBundle[] = [
  {
    id: "bundle_elara", name: "Elara's Light Bundle", description: "Holographic-themed cosmetics inspired by the ship's AI.",
    contents: [
      { type: "ship_theme", id: "elara_holographic", name: "Holographic Aurora Theme" },
      { type: "specimen_accessory", id: "holo_collar", name: "Holographic Collar" },
      { type: "character_dye", id: "elara_cyan", name: "Elara's Frequency Dye" },
      { type: "card_variant", id: "elara_animated", name: "Animated Elara Card" },
    ],
    price: "$7.99", priceValue: 799, limited: false, theme: "elara",
  },
  {
    id: "bundle_terminus", name: "Terminus Horror Bundle", description: "Viral-themed cosmetics from the broken Panopticon.",
    contents: [
      { type: "ship_theme", id: "terminus_infection", name: "Terminus Infection Theme" },
      { type: "specimen_accessory", id: "viral_wings", name: "Viral Tendril Wings" },
      { type: "character_dye", id: "terminus_red", name: "Terminus Red Dye" },
      { type: "card_variant", id: "source_animated", name: "Animated Source Card" },
    ],
    price: "$7.99", priceValue: 799, limited: true, expiresAt: "2026-05-01", theme: "source",
  },
  {
    id: "bundle_shadow", name: "Shadow Tongue's Library", description: "Text-corruption cosmetics from the Hierarchy's SVP.",
    contents: [
      { type: "ship_theme", id: "shadow_corruption", name: "Living Text Theme" },
      { type: "specimen_accessory", id: "text_hat", name: "Manuscript Crown" },
      { type: "character_dye", id: "hierarchy_indigo", name: "Hierarchy Indigo Dye" },
      { type: "card_variant", id: "shadow_animated", name: "Animated Shadow Tongue Card" },
    ],
    price: "$7.99", priceValue: 799, limited: true, expiresAt: "2026-06-01", theme: "shadow_tongue",
  },
];

/* ─── 5. FAIR BALANCE RULES ─── */

/**
 * These rules ensure the monetization never becomes pay-to-win.
 * They should be enforced at the system level.
 */
export const MONETIZATION_RULES = {
  /** Premium specimens have IDENTICAL stats to free specimens */
  specimenStatParity: true,
  /** PvP matchmaking ignores premium status */
  pvpIgnoresPremium: true,
  /** All game content accessible without payment */
  noPaywallContent: true,
  /** Premium cards are cosmetic variants, not stronger versions */
  cardCosmeticOnly: true,
  /** Leaderboards don't factor spending */
  leaderboardMerit: true,
  /** Free daily Dream income sufficient for core gameplay */
  freeDailyDream: 50,
  /** Maximum Dream earnable per day through gameplay (no cap enforced, just target) */
  targetDailyEarnable: 200,
  /** Premium to free Dream ratio (premium buys should never exceed 3x free earning) */
  premiumToFreeRatio: 3,
  /** All cosmetics eventually rotatable into free rewards (seasonal delay) */
  cosmeticEventualFree: true,
  /** Time delay before premium cosmetics become earnable (months) */
  cosmeticFreeDelay: 6,
};

/* ─── WELKIN MOON EQUIVALENT ─── */

/**
 * $4.99 for 30 days of +30 Dream/day = 900 Dream total.
 * That's $0.0055 per Dream vs $0.0099 per Dream from packs.
 * Best value for consistent players.
 */
export const COMMANDERS_BLESSING = {
  price: "$4.99",
  durationDays: 30,
  dailyDream: 30,
  immediateBonus: 100,
  totalValue: 1000, // 100 immediate + 900 daily
  description: "30 days of +30 Dream per login. The patient Operative's choice.",
};

/* ─── REVENUE PROJECTION ─── */

export const REVENUE_MODEL = {
  /** Expected distribution of paying users */
  payerTiers: {
    free: 0.95,          // 95% play free
    minnow: 0.03,        // 3% spend $5-15/month (Ark Commander + pass)
    dolphin: 0.015,      // 1.5% spend $15-50/month
    whale: 0.005,        // 0.5% spend $50+/month
  },
  /** Average monthly spend per tier */
  averageMonthlySpend: {
    free: 0,
    minnow: 10,
    dolphin: 30,
    whale: 100,
  },
  /** Target: ARPPU (Average Revenue Per Paying User) */
  targetARPPU: 15,
};
