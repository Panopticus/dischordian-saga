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
  archetype: "casual" | "regular" | "hardcore" | "whale";
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

/* ─── Simulator ─── */

export function simulateEconomy(
  profile: PlayerProfile,
  days: number = 90,
  startingDream: number = 0,
): SimulationResult {
  const plan = planForPolicy(profile.sinkPolicy);
  const inc = dailyIncome(profile);
  const incomePerDay = inc.matches + inc.firstWinBonus + inc.dailyQuests;
  const loginPerDay = loginCalendarPerDay(profile);
  const seasonPerDay = seasonRewardPerDay(profile);

  const totalDailyIncome = incomePerDay + loginPerDay + seasonPerDay;

  let dream = startingDream;
  let soulStones = 0;
  let packsBought = 0;
  let sinksSpent = 0;
  const sinkLedger: SimulationResult["sinkLedger"] = {};

  for (let day = 1; day <= days; day++) {
    // Earn
    dream += totalDailyIncome;

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

  const incomeMatches = inc.matches * days;
  const incomeFirstWin = inc.firstWinBonus * days;
  const incomeQuests = inc.dailyQuests * days;
  const incomeLogin = loginPerDay * days;
  const incomeSeason = seasonPerDay * days;

  const incomeTotal = incomeMatches + incomeFirstWin + incomeQuests + incomeLogin + incomeSeason;
  const spendingPacks = packsBought * ECONOMY.packs.standardCost;
  const spendingTotal = spendingPacks + sinksSpent;

  return {
    profile,
    days,
    income: {
      matches: round2(incomeMatches),
      firstWinBonus: round2(incomeFirstWin),
      dailyQuests: round2(incomeQuests),
      loginCalendar: round2(incomeLogin),
      seasonRewards: round2(incomeSeason),
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
  return [
    `[${r.profile.archetype.padEnd(8)}] L${r.profile.level} ${r.profile.sinkPolicy.padEnd(10)}`,
    `income=${r.income.total.toFixed(0)} spend=${r.spending.total.toFixed(0)}`,
    `final=${r.finalDream.toFixed(0)} infl=${r.inflationFactor.toFixed(1)}x`,
    `souls=${r.finalSoulStones.toFixed(0)}`,
  ].join(" | ");
}
