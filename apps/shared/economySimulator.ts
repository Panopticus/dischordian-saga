/* ═══════════════════════════════════════════════════════
   ECONOMY SIMULATOR

   A deterministic, pure-function 90-day projection of player
   currency flow. Given a player profile and a sink-engagement
   policy, returns daily income, daily spend, and final balances.

   The simulator is the analytical backbone of the test suite in
   `economy.balance.test.ts` and the rationale for every Dream
   sink in `economySinks.ts` and `endgameSinks.ts`. Comments in
   those files reference "the balance simulator" — this is it.

   Design goals:
   - Pure: no Date.now, no RNG (rolls use a seeded LCG), no I/O.
   - Configurable: every behavioural knob is on `PlayerProfile`
     so tests can exercise casual, hardcore, and whale archetypes.
   - Inflation-aware: returns the inflation factor (final / starting
     income/day-equivalent) so tests can assert ceilings.
   ═══════════════════════════════════════════════════════ */

import { ECONOMY } from "./tcg-core/economy/config";
import { SOUL_STONE_VALUES } from "./tcg-core/economy/packs";
import { SEASON_REWARDS, getTierForRating } from "./tcg-core/economy/ranked";
import { ALL_SINKS } from "./economySinks";
import { EARLY_GAME_SINKS } from "./earlyGameSinks";

/* ─── Profiles ─── */

export interface PlayerProfile {
  /** Display label for reports. */
  archetype: "casual" | "regular" | "hardcore" | "whale" | "regular_paid" | "whale_paid";
  /** Player level — gates which sinks are accessible. */
  level: number;
  /** Matches per day the player attempts. Capped by `dailyRewardCap`. */
  matchesPerDay: number;
  /** 0..1 win rate. */
  winRate: number;
  /** Number of daily quests the player claims per day (0..dailySlots). */
  dailyQuestsClaimedPerDay: number;
  /** Avg Dream per claimed quest. Daily quests pay 3-50 Dream; mean ~12. */
  avgDreamPerQuest: number;
  /** Current ranked rating — drives end-of-season payout. */
  rankedRating: number;
  /** Days the player logs in per 7. Drives login-calendar payout. */
  loginsPerWeek: number;
  /** Sink engagement policy (see below). */
  sinkPolicy: SinkPolicy;
  /**
   * Real-money policy. Drives Void Crystal acquisition and which paid
   * SKUs the player buys per month. "free" = no purchases.
   */
  paidPolicy?: PaidPolicy;
}

/**
 * Describes how willing a player is to spend.
 *
 * "none"      → never engages a sink. Worst-case inflation scenario.
 * "minimal"   → buys 1 pack/day if affordable. The "hoarder" baseline.
 * "balanced"  → buys 1 pack/day + claims 1 mid-tier sink per week.
 * "aggressive" → empties their wallet on the highest-cost sink they can afford,
 *                each week. Whale / sink-bait scenario.
 */
export type SinkPolicy = "none" | "minimal" | "balanced" | "aggressive";

/**
 * Real-money spending intent.
 *
 * "free"          → never buys VC. The F2P baseline.
 * "light_paid"    → buys the Battle Pass each season ($10/month).
 *                   The most common "I like the game" tier.
 * "engaged_paid"  → Battle Pass + ~1 cosmetic SKU/month + occasional
 *                   VC pack (~$15-25/month). The AAA sweet-spot ARPDAU.
 * "whale"         → Battle Pass + Founder's Edition (one-time first
 *                   month) + multiple cosmetics + large VC packs
 *                   ($60-150+/month). Drives the long tail.
 */
export type PaidPolicy = "free" | "light_paid" | "engaged_paid" | "whale";

export const PROFILES = {
  casual: {
    archetype: "casual",
    level: 8,
    matchesPerDay: 5,
    winRate: 0.45,
    dailyQuestsClaimedPerDay: 1,
    avgDreamPerQuest: 12,
    rankedRating: 600,
    loginsPerWeek: 5,
    sinkPolicy: "minimal",
  },
  regular: {
    archetype: "regular",
    level: 20,
    matchesPerDay: 12,
    winRate: 0.5,
    dailyQuestsClaimedPerDay: 2,
    avgDreamPerQuest: 15,
    rankedRating: 1000,
    loginsPerWeek: 6,
    sinkPolicy: "balanced",
  },
  hardcore: {
    archetype: "hardcore",
    level: 35,
    matchesPerDay: 30,
    winRate: 0.6,
    dailyQuestsClaimedPerDay: 3,
    avgDreamPerQuest: 18,
    rankedRating: 1700,
    loginsPerWeek: 7,
    sinkPolicy: "aggressive",
  },
  whale: {
    archetype: "whale",
    level: 45,
    matchesPerDay: 30,
    winRate: 0.65,
    dailyQuestsClaimedPerDay: 3,
    avgDreamPerQuest: 20,
    rankedRating: 2100,
    loginsPerWeek: 7,
    sinkPolicy: "aggressive",
  },
  /**
   * Paid profiles. Same gameplay shape as their unpaid counterparts but
   * with a real-money policy applied. Used to verify Void Crystal SKU
   * pricing lands in the AAA monthly-spend windows.
   */
  regular_paid: {
    archetype: "regular_paid",
    level: 20,
    matchesPerDay: 12,
    winRate: 0.5,
    dailyQuestsClaimedPerDay: 2,
    avgDreamPerQuest: 15,
    rankedRating: 1000,
    loginsPerWeek: 6,
    sinkPolicy: "balanced",
    paidPolicy: "engaged_paid",
  },
  whale_paid: {
    archetype: "whale_paid",
    level: 45,
    matchesPerDay: 30,
    winRate: 0.65,
    dailyQuestsClaimedPerDay: 3,
    avgDreamPerQuest: 20,
    rankedRating: 2100,
    loginsPerWeek: 7,
    sinkPolicy: "aggressive",
    paidPolicy: "whale",
  },
} as const satisfies Record<string, PlayerProfile>;

/* ─── Output ─── */

export interface SimulationResult {
  profile: PlayerProfile;
  days: number;
  income: {
    matches: number;
    firstWinBonus: number;
    dailyQuests: number;
    loginCalendar: number;
    seasonRewards: number;
    total: number;
  };
  spending: {
    packs: number;
    sinks: number;
    total: number;
  };
  /** Final Dream balance. */
  finalDream: number;
  /** Net Dream / day averaged over the run. */
  netDreamPerDay: number;
  /** Soul stones accumulated from disenchanting pack duplicates. */
  finalSoulStones: number;
  /**
   * Inflation factor: ratio of final balance to one day's income.
   * A factor of 1.0 means the player has 1 day's worth banked (healthy).
   * Anything above ~30 (a month's reserve) is excess hoarding.
   */
  inflationFactor: number;
  /** Sinks the player engaged with, by id, with totals. */
  sinkLedger: Record<string, { count: number; dreamSpent: number }>;
  /** Real-money + Void Crystal flow. Always present; zeroed for free profiles. */
  paid: {
    /** Total real-money spend in cents. */
    usdSpentCents: number;
    /** Average monthly spend in cents (for AAA-window assertions). */
    monthlyUsdCents: number;
    /** Void Crystals purchased over the run. */
    voidCrystalsPurchased: number;
    /** Void Crystals spent on cosmetics / boosters / battle pass. */
    voidCrystalsSpent: number;
    /** Final Void Crystal balance. */
    finalVoidCrystals: number;
    /** Cosmetic ids granted across the run (de-duplicated). */
    cosmeticsGranted: string[];
    /** Whether the Battle Pass premium was active. */
    battlePassPremium: boolean;
    /** Per-SKU purchase counts. */
    skuLedger: Record<string, { count: number; usdCents: number }>;
  };
}

/* ─── Per-day Dream income ─── */

function dailyIncome(p: PlayerProfile): {
  matches: number;
  firstWinBonus: number;
  dailyQuests: number;
} {
  const cap = ECONOMY.matchRewards.dailyRewardCap;
  const m = Math.min(p.matchesPerDay, cap);
  const wins = m * p.winRate;
  const losses = m * (1 - p.winRate);
  const matches =
    wins * ECONOMY.matchRewards.winDreamTokens +
    losses * ECONOMY.matchRewards.lossDreamTokens;

  // First-win bonus only applies on days where the player wins ≥1 match.
  // Probability of at least one win in m matches.
  const pAtLeastOneWin = 1 - Math.pow(1 - p.winRate, m);
  const firstWinBonus = pAtLeastOneWin * ECONOMY.matchRewards.firstWinBonus;

  const dailyQuests = p.dailyQuestsClaimedPerDay * p.avgDreamPerQuest;

  return { matches, firstWinBonus, dailyQuests };
}

/**
 * Login calendar: 30-day cycle paying 15/30/50/150 on days 7/14/21/30.
 * Amortized per active login day: (15+30+50+150) / 30 = ~8.17 Dream/day-of-cycle,
 * scaled by login frequency.
 */
function loginCalendarPerDay(p: PlayerProfile): number {
  const monthlyTotal = 15 + 30 + 50 + 150;
  const cyclePerDay = monthlyTotal / 30;
  return cyclePerDay * (p.loginsPerWeek / 7);
}

/**
 * End-of-season payout, amortized per day across a 30-day season.
 * Uses ranked tier for the player's rating.
 */
function seasonRewardPerDay(p: PlayerProfile): number {
  const tierInfo = getTierForRating(p.rankedRating);
  const reward = SEASON_REWARDS[tierInfo.tier];
  if (!reward) return 0;
  return reward.dreamTokens / ECONOMY.ranked.seasonLengthDays;
}

/* ─── Sink engagement ─── */

interface SinkPlan {
  /** How many packs/day the player buys. */
  packsPerDay: number;
  /** Weekly sink target picker. Returns the sink id or null. */
  pickWeeklySink(level: number, balance: number): string | null;
}

function planForPolicy(policy: SinkPolicy): SinkPlan {
  switch (policy) {
    case "none":
      return { packsPerDay: 0, pickWeeklySink: () => null };
    case "minimal":
      return {
        packsPerDay: 0.5, // every other day
        pickWeeklySink: (level, balance) => {
          // Casual players want small, repeatable sinks — early-game module
          // covers L1-15 in 25-300 Dream denominations. Pick the most
          // expensive early-game sink they can afford for the week.
          const eligibleEarly = EARLY_GAME_SINKS
            .filter((s) => level >= s.minLevel && balance >= s.cost)
            .sort((a, b) => b.cost - a.cost);
          if (eligibleEarly[0]) return eligibleEarly[0].id;
          // Fall back to cheapest core sink if early-game has nothing.
          const eligibleCore = ALL_SINKS
            .filter((s) => level >= s.minLevel && balance >= s.cost)
            .sort((a, b) => a.cost - b.cost);
          return eligibleCore[0]?.id ?? null;
        },
      };
    case "balanced":
      return {
        packsPerDay: 1,
        pickWeeklySink: (level, balance) => {
          // Pick the most expensive non-cosmetic sink the player can afford
          // (cosmetics are saved for "aggressive" policy so balanced players
          // pursue power progression first).
          const eligible = ALL_SINKS
            .filter((s) => level >= s.minLevel && balance >= s.cost)
            .filter((s) => s.category !== "cosmetic")
            .sort((a, b) => b.cost - a.cost);
          return eligible[0]?.id ?? null;
        },
      };
    case "aggressive":
      return {
        packsPerDay: 2,
        pickWeeklySink: (level, balance) => {
          // Pick the most expensive sink (any category) the player can afford.
          const eligible = ALL_SINKS
            .filter((s) => level >= s.minLevel && balance >= s.cost)
            .sort((a, b) => b.cost - a.cost);
          return eligible[0]?.id ?? null;
        },
      };
  }
}

/* ─── Real-money plan ─── */

/**
 * Mirror of the Void-Crystal-bearing rows in apps/server/products.ts.
 *
 * The simulator can't import the server catalog (apps/shared can't depend
 * on apps/server), so it carries a slim copy of the SKUs it models. The
 * test suite asserts these stay aligned by cross-checking against the
 * server catalog in `economy.balance.test.ts`.
 */
interface PaidSkuMirror {
  key: string;
  usdCents: number;
  voidCrystalsGranted: number;
  battlePassPremium?: boolean;
  cosmeticIds?: string[];
  entitlement?: "foundingAuthor" | "authorsEditionS2";
}

const PAID_SKUS: Record<string, PaidSkuMirror> = {
  vc_pack_small:    { key: "vc_pack_small",    usdCents: 199,  voidCrystalsGranted: 100 },
  vc_pack_medium:   { key: "vc_pack_medium",   usdCents: 499,  voidCrystalsGranted: 325 },
  vc_pack_large:    { key: "vc_pack_large",    usdCents: 999,  voidCrystalsGranted: 800 },
  vc_pack_huge:     { key: "vc_pack_huge",     usdCents: 1999, voidCrystalsGranted: 1800 },
  vc_pack_titanic:  { key: "vc_pack_titanic",  usdCents: 4999, voidCrystalsGranted: 5000 },
  battle_pass_premium: {
    key: "battle_pass_premium", usdCents: 999, voidCrystalsGranted: 0, battlePassPremium: true,
  },
  founders_edition: {
    key: "entitlement_founding_author",
    usdCents: 4900, voidCrystalsGranted: 4500, battlePassPremium: true,
    entitlement: "foundingAuthor",
    cosmeticIds: ["title_founder", "aura_archon_flame_premium"],
  },
};

/** Cosmetic SKUs the paid plan can buy with VC. */
const VC_COSMETIC_SKUS = [
  { id: "aura_void_signature",      voidCrystals: 800 },
  { id: "voice_pack_companion_lyra", voidCrystals: 1000 },
  { id: "card_animation_signature", voidCrystals: 1200 },
];

interface PaidPlan {
  /** Real-money / VC purchases that fire on day 1. */
  oneTimeOnDay1: PaidSkuMirror[];
  /** SKUs purchased every Nth day (typically every 30). */
  monthlySkus: PaidSkuMirror[];
  /** Cosmetic IDs to buy with VC each month, in priority order. */
  monthlyCosmeticTargets: typeof VC_COSMETIC_SKUS;
}

function paidPlanForPolicy(policy: PaidPolicy | undefined): PaidPlan {
  switch (policy) {
    case undefined:
    case "free":
      return { oneTimeOnDay1: [], monthlySkus: [], monthlyCosmeticTargets: [] };
    case "light_paid":
      // Just the Battle Pass each month. ~$10/month — entry-level commitment.
      return {
        oneTimeOnDay1: [],
        monthlySkus: [PAID_SKUS.battle_pass_premium],
        monthlyCosmeticTargets: [],
      };
    case "engaged_paid":
      // Battle Pass + medium VC pack + 1 cosmetic. ~$15-25/month sweet spot.
      return {
        oneTimeOnDay1: [],
        monthlySkus: [PAID_SKUS.battle_pass_premium, PAID_SKUS.vc_pack_medium],
        monthlyCosmeticTargets: VC_COSMETIC_SKUS.slice(0, 1),
      };
    case "whale":
      // Founder's Edition on day 1, then Battle Pass + Titanic VC pack each month
      // and as many cosmetics as VC affords.
      return {
        oneTimeOnDay1: [PAID_SKUS.founders_edition],
        monthlySkus: [PAID_SKUS.battle_pass_premium, PAID_SKUS.vc_pack_titanic],
        monthlyCosmeticTargets: VC_COSMETIC_SKUS,
      };
  }
}

/* ─── Simulator ─── */

export function simulateEconomy(
  profile: PlayerProfile,
  days: number = 90,
  startingDream: number = 0,
): SimulationResult {
  const plan = planForPolicy(profile.sinkPolicy);
  const paidPlan = paidPlanForPolicy(profile.paidPolicy);
  const inc = dailyIncome(profile);
  const incomePerDay = inc.matches + inc.firstWinBonus + inc.dailyQuests;
  const loginPerDay = loginCalendarPerDay(profile);
  const seasonPerDay = seasonRewardPerDay(profile);

  const totalDailyIncome = incomePerDay + loginPerDay + seasonPerDay;

  let dream = startingDream;
  let soulStones = 0;
  let packsBought = 0;
  let sinksSpent = 0;
  let actualMatchesIncome = 0;
  let actualFirstWinIncome = 0;
  let actualQuestsIncome = 0;
  let actualLoginIncome = 0;
  let actualSeasonIncome = 0;
  const sinkLedger: SimulationResult["sinkLedger"] = {};

  // Paid ledger
  let usdSpentCents = 0;
  let voidCrystalsPurchased = 0;
  let voidCrystalsSpent = 0;
  let voidCrystals = 0;
  let battlePassPremium = false;
  const cosmeticsGranted = new Set<string>();
  const skuLedger: SimulationResult["paid"]["skuLedger"] = {};
  const buySku = (sku: PaidSkuMirror) => {
    usdSpentCents += sku.usdCents;
    voidCrystalsPurchased += sku.voidCrystalsGranted;
    voidCrystals += sku.voidCrystalsGranted;
    if (sku.battlePassPremium) battlePassPremium = true;
    for (const c of sku.cosmeticIds ?? []) cosmeticsGranted.add(c);
    const entry = skuLedger[sku.key] ?? { count: 0, usdCents: 0 };
    entry.count++;
    entry.usdCents += sku.usdCents;
    skuLedger[sku.key] = entry;
  };

  // Day-1 purchases
  for (const sku of paidPlan.oneTimeOnDay1) buySku(sku);

  for (let day = 1; day <= days; day++) {
    // Earn (with battle-pass XP+ multiplier if active — applied to Dream
    // since match-Dream and Battle-Pass XP scale together in practice).
    const incomeMultiplier = battlePassPremium ? ECONOMY.battlePass.premiumXpMultiplier : 1;
    const todayMatches = inc.matches * incomeMultiplier;
    const todayFirstWin = inc.firstWinBonus * incomeMultiplier;
    const todayQuests = inc.dailyQuests * incomeMultiplier;
    const todayLogin = loginPerDay * incomeMultiplier;
    const todaySeason = seasonPerDay * incomeMultiplier;
    actualMatchesIncome += todayMatches;
    actualFirstWinIncome += todayFirstWin;
    actualQuestsIncome += todayQuests;
    actualLoginIncome += todayLogin;
    actualSeasonIncome += todaySeason;
    dream += todayMatches + todayFirstWin + todayQuests + todayLogin + todaySeason;

    // Monthly paid purchases (every 30 days, starting day 30)
    if (day % 30 === 0) {
      for (const sku of paidPlan.monthlySkus) buySku(sku);
      // Spend VC on cosmetics in priority order until we run out.
      for (const cosmetic of paidPlan.monthlyCosmeticTargets) {
        if (voidCrystals < cosmetic.voidCrystals) break;
        if (cosmeticsGranted.has(cosmetic.id)) continue;
        voidCrystals -= cosmetic.voidCrystals;
        voidCrystalsSpent += cosmetic.voidCrystals;
        cosmeticsGranted.add(cosmetic.id);
      }
    }

    // Buy packs
    const packCost = ECONOMY.packs.standardCost;
    const packsToday = Math.floor(plan.packsPerDay) +
      // Fractional packs: every Nth day for fractional rates (e.g. 0.5 → every 2nd).
      ((plan.packsPerDay % 1) > 0 && day % Math.round(1 / (plan.packsPerDay % 1)) === 0 ? 1 : 0);
    for (let p = 0; p < packsToday; p++) {
      if (dream < packCost) break;
      dream -= packCost;
      packsBought++;
      // Each pack, on average, gives 4 commons + 1 uncommon. Past day ~14 the
      // player has 3+ copies of most commons, so pack contents auto-disenchant.
      // Conservative: 30% of post-day-14 pack contents convert to soul stones.
      if (day > 14) {
        soulStones +=
          0.3 * (4 * SOUL_STONE_VALUES.common.disenchant +
                 1 * SOUL_STONE_VALUES.uncommon.disenchant);
      }
    }

    // Weekly sink
    if (day % 7 === 0) {
      const sinkId = plan.pickWeeklySink(profile.level, dream);
      if (sinkId) {
        const cost =
          ALL_SINKS.find((s) => s.id === sinkId)?.cost ??
          EARLY_GAME_SINKS.find((s) => s.id === sinkId)?.cost ??
          0;
        dream -= cost;
        sinksSpent += cost;
        const entry = sinkLedger[sinkId] ?? { count: 0, dreamSpent: 0 };
        entry.count++;
        entry.dreamSpent += cost;
        sinkLedger[sinkId] = entry;
      }
    }
  }

  const incomeTotal =
    actualMatchesIncome +
    actualFirstWinIncome +
    actualQuestsIncome +
    actualLoginIncome +
    actualSeasonIncome;
  const spendingPacks = packsBought * ECONOMY.packs.standardCost;
  const spendingTotal = spendingPacks + sinksSpent;

  // Monthly USD averaged over the run length.
  const monthlyUsdCents = days > 0 ? (usdSpentCents * 30) / days : 0;

  return {
    profile,
    days,
    income: {
      matches: round2(actualMatchesIncome),
      firstWinBonus: round2(actualFirstWinIncome),
      dailyQuests: round2(actualQuestsIncome),
      loginCalendar: round2(actualLoginIncome),
      seasonRewards: round2(actualSeasonIncome),
      total: round2(incomeTotal),
    },
    spending: {
      packs: spendingPacks,
      sinks: sinksSpent,
      total: spendingTotal,
    },
    finalDream: round2(dream),
    netDreamPerDay: round2((dream - startingDream) / days),
    finalSoulStones: round2(soulStones),
    inflationFactor: totalDailyIncome > 0 ? round2(dream / totalDailyIncome) : 0,
    sinkLedger,
    paid: {
      usdSpentCents,
      monthlyUsdCents: round2(monthlyUsdCents),
      voidCrystalsPurchased,
      voidCrystalsSpent,
      finalVoidCrystals: voidCrystals,
      cosmeticsGranted: [...cosmeticsGranted],
      battlePassPremium,
      skuLedger,
    },
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Convenience: simulate every default profile with a given policy override.
 * Useful for printing a head-to-head report.
 */
export function simulateAllProfiles(
  days: number = 90,
  policyOverride?: SinkPolicy,
): SimulationResult[] {
  return Object.values(PROFILES).map((p) => {
    const profile = policyOverride ? { ...p, sinkPolicy: policyOverride } : p;
    return simulateEconomy(profile, days);
  });
}

/**
 * Format a result as a single human-readable report line.
 * (Used by the test suite for diagnostic output on failure.)
 */
export function formatResult(r: SimulationResult): string {
  const usd = (r.paid.monthlyUsdCents / 100).toFixed(2);
  const paid = r.profile.paidPolicy && r.profile.paidPolicy !== "free"
    ? ` | $${usd}/mo VC=${r.paid.voidCrystalsPurchased} cos=${r.paid.cosmeticsGranted.length}`
    : "";
  return [
    `[${r.profile.archetype.padEnd(12)}] L${r.profile.level} ${r.profile.sinkPolicy.padEnd(10)}`,
    `income=${r.income.total.toFixed(0)} spend=${r.spending.total.toFixed(0)}`,
    `final=${r.finalDream.toFixed(0)} infl=${r.inflationFactor.toFixed(1)}x`,
    `souls=${r.finalSoulStones.toFixed(0)}${paid}`,
  ].join(" | ");
}
