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
  price: "$3.99/month",
  perks: {
    dailyDreamBonus: 0,        // No Dream bonus — use Commander's Blessing for currency
    extraDailyQuests: 2,       // 5 daily quests instead of 3 (up from +1)
    craftingSpeedPercent: 25,  // 25% faster crafting (up from 20%)
    extraGiftsPerDay: 2,       // Gift 3 NPCs per day instead of 1 (up from +1)
    extraArenaClones: 1,       // 2 quiz show clones/day instead of 1
    extraIncursionRuns: 2,     // 5 Incursion runs/week instead of 3 (up from +1)
    exclusiveTheme: "commander_gold",
    priorityQueue: true,
    adFree: true,
    commanderBadge: true,
  },
  description: "Pure convenience and QoL perks. Stacks with Commander's Blessing for currency.",
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
  /** Associated season id (for seasonal content drops) */
  seasonId?: string;
  /** Week of season this bundle launches (1 = week 1, 2 = week 2, etc.) */
  seasonWeek?: number;
}

/**
 * Get countdown info for a limited-time bundle.
 * Returns days, hours, minutes remaining + urgency level for UI coloring.
 */
export function getBundleCountdown(bundle: CosmeticBundle): {
  isLimited: boolean;
  expired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  /** "none" | "low" (>7d) | "medium" (3-7d) | "high" (1-3d) | "critical" (<24h) */
  urgency: "none" | "low" | "medium" | "high" | "critical";
  displayText: string;
} {
  if (!bundle.limited || !bundle.expiresAt) {
    return { isLimited: false, expired: false, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0, urgency: "none", displayText: "Always available" };
  }
  const now = Date.now();
  const end = new Date(bundle.expiresAt).getTime();
  const diff = end - now;
  if (diff <= 0) {
    return { isLimited: true, expired: true, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0, urgency: "none", displayText: "Expired" };
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  let urgency: "low" | "medium" | "high" | "critical";
  if (days > 7) urgency = "low";
  else if (days >= 3) urgency = "medium";
  else if (days >= 1) urgency = "high";
  else urgency = "critical";

  let displayText: string;
  if (days > 0) displayText = `${days} day${days !== 1 ? "s" : ""} ${hours}h remaining`;
  else if (hours > 0) displayText = `${hours}h ${minutes}m remaining`;
  else displayText = `${minutes}m remaining — almost gone!`;

  return { isLimited: true, expired: false, daysRemaining: days, hoursRemaining: hours, minutesRemaining: minutes, urgency, displayText };
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
  // ── SEASONAL BUNDLES (aligned with Epoch Pass launches) ──
  {
    id: "bundle_season1_source", name: "Source's Corruption Bundle", description: "Season 1 — THE FALL. Cosmetics themed after The Source's viral influence.",
    contents: [
      { type: "ship_theme", id: "s1_viral_aurora", name: "Viral Aurora Theme" },
      { type: "specimen_accessory", id: "s1_infection_crown", name: "Crown of Infection" },
      { type: "character_dye", id: "s1_thought_virus_red", name: "Thought Virus Red Dye" },
      { type: "card_variant", id: "s1_source_seasonal", name: "Seasonal Source Card" },
    ],
    price: "$7.99", priceValue: 799, limited: true, expiresAt: "2026-04-28", theme: "the_source",
    seasonId: "season_1_fall", seasonWeek: 1,
  },
  {
    id: "bundle_season2_zero", name: "Agent Zero's Signal Bundle", description: "Season 2 — DEAD SIGNAL. Cosmetics themed after Agent Zero's broadcast.",
    contents: [
      { type: "ship_theme", id: "s2_dead_signal", name: "Dead Signal Theme" },
      { type: "specimen_accessory", id: "s2_frequency_mask", name: "Frequency Mask" },
      { type: "character_dye", id: "s2_static_orange", name: "Static Orange Dye" },
      { type: "card_variant", id: "s2_zero_seasonal", name: "Seasonal Agent Zero Card" },
    ],
    price: "$7.99", priceValue: 799, limited: true, expiresAt: "2026-05-26", theme: "agent_zero",
    seasonId: "season_2_insurgency", seasonWeek: 1,
  },
  {
    id: "bundle_season3_locke", name: "Locke's Price Bundle", description: "Season 3 — THE PRICE. Cosmetics themed after Adjudicator Locke.",
    contents: [
      { type: "ship_theme", id: "s3_new_babylon", name: "New Babylon Gilded Theme" },
      { type: "specimen_accessory", id: "s3_trade_monocle", name: "Adjudicator's Monocle" },
      { type: "character_dye", id: "s3_babylon_purple", name: "New Babylon Purple Dye" },
      { type: "card_variant", id: "s3_locke_seasonal", name: "Seasonal Locke Card" },
    ],
    price: "$7.99", priceValue: 799, limited: true, expiresAt: "2026-06-23", theme: "adjudicator_locke",
    seasonId: "season_3_new_babylon", seasonWeek: 1,
  },
  {
    id: "bundle_season4_shadow", name: "Shadow Tongue's Edit Bundle", description: "Season 4 — THE EDITOR. Cosmetics themed after the Shadow Tongue.",
    contents: [
      { type: "ship_theme", id: "s4_living_text", name: "Living Manuscript Theme" },
      { type: "specimen_accessory", id: "s4_redaction_mask", name: "Redaction Mask" },
      { type: "character_dye", id: "s4_indigo_edit", name: "Editor's Indigo Dye" },
      { type: "card_variant", id: "s4_shadow_seasonal", name: "Seasonal Shadow Tongue Card" },
    ],
    price: "$7.99", priceValue: 799, limited: true, expiresAt: "2026-07-21", theme: "shadow_tongue",
    seasonId: "season_4_hierarchy", seasonWeek: 1,
  },
];

/* ─── SEASONAL CONTENT DROP SCHEDULE ─── */

/**
 * Predictable seasonal spending cadence aligned with Epoch Pass launches.
 * Week 1: New cosmetic bundle featuring that season's NPC.
 * Week 2: New card expansion themed to the epoch.
 * Week 3: Mid-season event with exclusive earnable + purchasable items.
 * Week 4: Last-chance sale on expiring season content.
 */
export interface SeasonalDropSchedule {
  seasonId: string;
  drops: {
    week: number;
    type: "cosmetic_bundle" | "card_expansion" | "mid_season_event" | "last_chance_sale";
    name: string;
    description: string;
    bundleId?: string;
  }[];
}

export const SEASONAL_DROP_SCHEDULES: SeasonalDropSchedule[] = [
  {
    seasonId: "season_1_fall",
    drops: [
      { week: 1, type: "cosmetic_bundle", name: "Source's Corruption Bundle", description: "Season 1 NPC cosmetic drop", bundleId: "bundle_season1_source" },
      { week: 2, type: "card_expansion", name: "Thought Virus Expansion", description: "New cards themed to The Source's viral influence" },
      { week: 3, type: "mid_season_event", name: "Terminus Breach Event", description: "Limited-time event with exclusive earnable rewards" },
      { week: 4, type: "last_chance_sale", name: "The Fall — Last Chance", description: "Final opportunity to purchase Season 1 cosmetics" },
    ],
  },
  {
    seasonId: "season_2_insurgency",
    drops: [
      { week: 1, type: "cosmetic_bundle", name: "Agent Zero's Signal Bundle", description: "Season 2 NPC cosmetic drop", bundleId: "bundle_season2_zero" },
      { week: 2, type: "card_expansion", name: "Dead Frequency Expansion", description: "New cards themed to the Insurgency signal" },
      { week: 3, type: "mid_season_event", name: "Signal Hunt Event", description: "Track Agent Zero's broadcast across the Ark" },
      { week: 4, type: "last_chance_sale", name: "Dead Signal — Last Chance", description: "Final opportunity to purchase Season 2 cosmetics" },
    ],
  },
  {
    seasonId: "season_3_new_babylon",
    drops: [
      { week: 1, type: "cosmetic_bundle", name: "Locke's Price Bundle", description: "Season 3 NPC cosmetic drop", bundleId: "bundle_season3_locke" },
      { week: 2, type: "card_expansion", name: "Commerce of Souls Expansion", description: "New cards themed to New Babylon's corrupt trade" },
      { week: 3, type: "mid_season_event", name: "Black Market Event", description: "Navigate Locke's underground auctions" },
      { week: 4, type: "last_chance_sale", name: "The Price — Last Chance", description: "Final opportunity to purchase Season 3 cosmetics" },
    ],
  },
  {
    seasonId: "season_4_hierarchy",
    drops: [
      { week: 1, type: "cosmetic_bundle", name: "Shadow Tongue's Edit Bundle", description: "Season 4 NPC cosmetic drop", bundleId: "bundle_season4_shadow" },
      { week: 2, type: "card_expansion", name: "Rewritten History Expansion", description: "New cards themed to reality manipulation" },
      { week: 3, type: "mid_season_event", name: "Truth Unraveled Event", description: "Fight for reality's integrity" },
      { week: 4, type: "last_chance_sale", name: "The Editor — Last Chance", description: "Final opportunity to purchase Season 4 cosmetics" },
    ],
  },
];

/**
 * Get active seasonal bundles for the current season.
 */
export function getSeasonalBundles(seasonId: string): CosmeticBundle[] {
  return COSMETIC_BUNDLES.filter(b => b.seasonId === seasonId);
}

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

/* ─── 6. FIRST PURCHASE STARTER BUNDLE ─── */

/**
 * One-time "gateway" purchase available only during first 7 days of account.
 * Insanely good deal to lower the first-purchase barrier.
 * 200 Dream + 3 card packs + 1 exclusive cosmetic for $0.99.
 * Compare: regular $0.99 pack gives only 100 Dream.
 */
export const FIRST_PURCHASE_BUNDLE = {
  id: "first_purchase_starter",
  name: "Operative's Welcome Bundle",
  price: "$0.99",
  priceValue: 99,
  /** Only purchasable once per account */
  oneTimePurchase: true,
  /** Available for this many days after account creation */
  availabilityWindowDays: 7,
  contents: {
    dreamTokens: 200,
    cardPacks: 3,
    cardPackRarity: "rare" as const,
    exclusiveCosmetic: {
      id: "welcome_operative_frame",
      name: "Operative's Welcome Frame",
      type: "avatar_frame" as const,
      rarity: "rare" as const,
      description: "An exclusive avatar frame only available to new Operatives.",
    },
  },
  /** Comparison text shown in store */
  valueCallout: "4x the value of a standard pack!",
  description: "Welcome aboard, Operative. Everything you need to start your journey — at a price that can't be beat.",
};

/**
 * Check whether the first-purchase bundle is available for a player.
 */
export function isFirstPurchaseBundleAvailable(opts: {
  accountCreatedAt: string; // ISO date
  hasPurchasedBundle: boolean;
}): { available: boolean; daysRemaining: number } {
  if (opts.hasPurchasedBundle) return { available: false, daysRemaining: 0 };
  const created = new Date(opts.accountCreatedAt).getTime();
  const now = Date.now();
  const elapsed = now - created;
  const windowMs = FIRST_PURCHASE_BUNDLE.availabilityWindowDays * 86400000;
  if (elapsed >= windowMs) return { available: false, daysRemaining: 0 };
  const daysRemaining = Math.ceil((windowMs - elapsed) / 86400000);
  return { available: true, daysRemaining };
}

/* ─── 7. WATCH AD FOR DREAM (FREE PLAYERS) ─── */

/**
 * Optional ad-watching system for free players.
 * 5 Dream per ad, max 3 ads per day = 15 Dream/day.
 * Small relative to 50 free daily baseline, but gives agency.
 * Ark Commander subscribers are ad-free (no ads shown).
 */
export const AD_FOR_DREAM = {
  dreamPerAd: 5,
  maxAdsPerDay: 3,
  /** Total earnable per day from ads */
  maxDailyDreamFromAds: 15,
  /** Ad duration in seconds */
  adDurationSeconds: 30,
  /** Cooldown between ads in minutes */
  cooldownMinutes: 10,
  /** Subscribers never see ads */
  subscriberExempt: true,
  description: "Watch a short clip, earn 5 Dream. Your choice, your reward.",
};

export function getAdDreamStatus(opts: {
  adsWatchedToday: number;
  isSubscriber: boolean;
  lastAdWatchedAt?: number; // timestamp
}): { canWatch: boolean; reason?: string; dreamReward: number; adsRemaining: number } {
  if (opts.isSubscriber) {
    return { canWatch: false, reason: "Subscribers enjoy an ad-free experience.", dreamReward: 0, adsRemaining: 0 };
  }
  if (opts.adsWatchedToday >= AD_FOR_DREAM.maxAdsPerDay) {
    return { canWatch: false, reason: "Daily ad limit reached. Come back tomorrow!", dreamReward: 0, adsRemaining: 0 };
  }
  if (opts.lastAdWatchedAt) {
    const cooldownMs = AD_FOR_DREAM.cooldownMinutes * 60000;
    const elapsed = Date.now() - opts.lastAdWatchedAt;
    if (elapsed < cooldownMs) {
      const minutesLeft = Math.ceil((cooldownMs - elapsed) / 60000);
      return { canWatch: false, reason: `Cooldown: ${minutesLeft}m remaining.`, dreamReward: 0, adsRemaining: AD_FOR_DREAM.maxAdsPerDay - opts.adsWatchedToday };
    }
  }
  return {
    canWatch: true,
    dreamReward: AD_FOR_DREAM.dreamPerAd,
    adsRemaining: AD_FOR_DREAM.maxAdsPerDay - opts.adsWatchedToday,
  };
}

/* ─── 8. GIFTING SYSTEM ─── */

/**
 * Players can buy cosmetics and Dream as gifts for other players.
 * Creates social spending pressure and reciprocity loops.
 * Gift wrapping adds a small Dream fee to prevent spam.
 */
export interface GiftTransaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  giftType: "dream" | "cosmetic" | "bundle";
  /** What was gifted */
  itemId?: string;
  dreamAmount?: number;
  /** Gift wrapping fee (in Dream) */
  wrappingFee: number;
  /** Optional message */
  message?: string;
  sentAt: number;
  claimedAt?: number;
}

export const GIFTING_CONFIG = {
  /** Minimum Dream gift */
  minDreamGift: 10,
  /** Maximum Dream gift per transaction */
  maxDreamGift: 5000,
  /** Flat wrapping fee in Dream */
  wrappingFee: 5,
  /** Max gifts sent per day (anti-spam) */
  maxGiftsPerDay: 10,
  /** Max message length */
  maxMessageLength: 200,
  /** Account must be this many days old to send gifts (prevents fraud) */
  minAccountAgeDays: 3,
  /** Giftable cosmetic types */
  giftableTypes: ["card_art", "avatar_frame", "title", "theme_pack", "emote", "trail_effect", "board_skin", "tower_skin"] as const,
  description: "Send gifts to friends and guildmates. Spread the Dream.",
};

export function canSendGift(opts: {
  accountAgeDays: number;
  giftsSentToday: number;
  dreamBalance: number;
  giftCost: number;
}): { allowed: boolean; reason?: string } {
  if (opts.accountAgeDays < GIFTING_CONFIG.minAccountAgeDays) {
    return { allowed: false, reason: `Accounts must be at least ${GIFTING_CONFIG.minAccountAgeDays} days old to send gifts.` };
  }
  if (opts.giftsSentToday >= GIFTING_CONFIG.maxGiftsPerDay) {
    return { allowed: false, reason: "Daily gift limit reached." };
  }
  const totalCost = opts.giftCost + GIFTING_CONFIG.wrappingFee;
  if (opts.dreamBalance < totalCost) {
    return { allowed: false, reason: `Insufficient Dream. Need ${totalCost} (${opts.giftCost} + ${GIFTING_CONFIG.wrappingFee} wrapping fee).` };
  }
  return { allowed: true };
}

/* ─── WELKIN MOON EQUIVALENT (DIFFERENTIATED) ─── */

/**
 * Commander's Blessing: PURELY Dream currency.
 * Increased from 1000 to 1200 total Dream to differentiate from Ark Commander.
 * Now stacks meaningfully with Ark Commander (Blessing = currency, Commander = perks).
 */
export const COMMANDERS_BLESSING = {
  price: "$4.99",
  durationDays: 30,
  dailyDream: 37,
  immediateBonus: 90,
  totalValue: 1200, // 90 immediate + 1110 daily (37 * 30)
  description: "30 days of +37 Dream per login. Pure currency, maximum value. Stacks with Ark Commander.",
};

/* ─── REVENUE PROJECTION ─── */

export const REVENUE_MODEL = {
  /** Expected distribution of paying users */
  payerTiers: {
    free: 0.93,          // 93% play free (down from 95% due to starter bundle conversion)
    minnow: 0.04,        // 4% spend $5-15/month (starter bundle converts more minnows)
    dolphin: 0.02,       // 2% spend $15-50/month (gifting + seasonal drops increase)
    whale: 0.01,         // 1% spend $50+/month (guild contributions + gifting)
  },
  /** Average monthly spend per tier */
  averageMonthlySpend: {
    free: 0.15,           // Ad revenue from optional ad watching (~$0.15/mo avg)
    minnow: 12,
    dolphin: 35,
    whale: 120,
  },
  /** Target: ARPPU (Average Revenue Per Paying User) */
  targetARPPU: 18,
};
