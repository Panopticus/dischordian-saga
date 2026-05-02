/**
 * Title Unlock Service.
 *
 * Pure-function evaluator over a `TitleProgressSnapshot` snapshot.
 * Mirrors apps/shared/tcg-core/rewards/expansionUnlockService.ts.
 *
 * Consumed by:
 *   - apps/server/routers/titles.ts (server-side grant + catalog queries)
 *   - apps/client/src/pages/TitlesPage.tsx (client-side preview / progress bars)
 *
 * Pure / serializable / no I/O — runs in both client and server.
 */
import { TITLE_DEFINITIONS, getTitleDef } from "./titleDefinitions";
import type {
  GameTypeKey,
  TitleDef,
  TitleProgressSnapshot,
  TitleUnlockCondition,
} from "./types";

/**
 * Evaluate a single TitleUnlockCondition against the snapshot.
 * Returns `true` iff the gate is satisfied.
 *
 * Defensive default: unknown condition kinds return `false` so a
 * forwards-compat client never silently grants a title it doesn't
 * understand.
 */
export function evaluateTitleUnlock(
  cond: TitleUnlockCondition,
  state: TitleProgressSnapshot,
): boolean {
  switch (cond.kind) {
    case "pvp_rank_reached": {
      const tier = state.rankTiers.get(cond.gameType) ?? 0;
      return tier >= cond.minTier;
    }
    case "pvp_wins_total": {
      if (cond.gameType) {
        return (state.winsByGameType.get(cond.gameType) ?? 0) >= cond.count;
      }
      return state.totalWins >= cond.count;
    }
    case "pvp_team_wins":
      return (state.winsByGameType.get("card_2v2") ?? 0) >= cond.count;
    case "pvp_ffa_wins":
      return (state.winsByGameType.get("card_ffa") ?? 0) >= cond.count;
    case "pvp_season_finish_at": {
      let best = 0;
      for (const t of state.bestSeasonTierByGameType.values()) {
        if (t > best) best = t;
      }
      return best >= cond.minTier;
    }

    case "coop_raid_clears": {
      if (cond.bossKey) {
        return (state.coopRaidClears.get(cond.bossKey) ?? 0) >= cond.count;
      }
      return state.totalRaidClears >= cond.count;
    }
    case "coop_role_mastery":
      return (state.coopRoleMastery.get(cond.role) ?? 0) >= cond.level;
    case "coop_party_continuity":
      return state.maxPartyContinuity >= cond.runs;
    case "coop_card_wins": {
      if (cond.encounterKey) {
        return (state.coopCardWins.get(cond.encounterKey) ?? 0) >= cond.count;
      }
      let total = 0;
      for (const v of state.coopCardWins.values()) total += v;
      return total >= cond.count;
    }

    case "loredex_discovered":
      return state.loredexDiscovered.has(cond.entityId);
    case "loredex_alignment_threshold":
      return (state.alignmentScores.get(cond.alignment) ?? 0) >= cond.threshold;
    case "act_completed":
      return state.completedActs.has(cond.act);
    case "secret_revealed":
      return state.secretActsRevealed.has(cond.act);

    case "mystery_solve_first":
      if (cond.boardKey === "*") return state.mysteryFirstSolved.size > 0;
      return state.mysteryFirstSolved.has(cond.boardKey);
    case "mystery_solve_any":
      if (cond.boardKey === "*") return state.mysterySolved.size > 0;
      return state.mysterySolved.has(cond.boardKey);
    case "kael_fragment_unlocked":
      return state.kaelFragmentsUnlocked.has(cond.fragmentId);

    case "cross_game_dual_rank": {
      let qualifying = 0;
      for (const gt of cond.gameTypes) {
        if ((state.rankTiers.get(gt) ?? 0) >= cond.minTier) qualifying++;
      }
      return qualifying >= 2;
    }

    case "guild_war_won":
      if (cond.territoryKey) {
        return state.guildWarTerritoriesHeld.has(cond.territoryKey);
      }
      return state.guildWarsWon > 0;
    case "guild_skirmish_won":
      return state.guildSkirmishWins >= cond.count;
    case "guild_hall_tier":
      return state.guildHallTier >= cond.tier;

    case "apprentice_trial_attended":
      return state.apprenticeTrialsAttended >= cond.count;
    case "apprentice_trial_graduated":
      return state.apprenticeTrialsGraduated >= cond.count;
    case "battle_pass_tier_reached":
      return state.battlePassTier >= cond.minTier;

    case "level_reached":
      return state.level >= cond.level;
    case "prestige_reached":
      return (state.prestigeLevels.get(cond.prestigeKey) ?? 0) >= cond.level;
    case "entitlement_held":
      return state.entitlements.has(cond.entitlementKey);
  }
}

/** True iff this title is unlocked for the snapshot. */
export function isTitleUnlocked(
  def: TitleDef,
  state: TitleProgressSnapshot,
): boolean {
  return evaluateTitleUnlock(def.condition, state);
}

/** Every title currently unlocked for the snapshot.
 *
 * Cosmetic-purchase titles are *excluded* — those are granted by the
 * cosmetic shop purchase flow (apps/server/routers/cosmeticShop.ts),
 * not by automatic evaluation. They still have a `condition` for
 * forwards-compatibility with future "purchase + meet a gate" patterns.
 */
export function getEligibleTitles(
  state: TitleProgressSnapshot,
): readonly TitleDef[] {
  return TITLE_DEFINITIONS.filter(
    (t) => t.category !== "cosmetic_purchase" && isTitleUnlocked(t, state),
  );
}

/**
 * Compute the diff between currently-eligible titles and an
 * already-earned set. Returns titles to grant. Caller is responsible
 * for persisting the inserts.
 */
export function computeNewlyUnlocked(
  state: TitleProgressSnapshot,
  alreadyEarned: ReadonlySet<string>,
): readonly TitleDef[] {
  return getEligibleTitles(state).filter((t) => !alreadyEarned.has(t.titleKey));
}

/**
 * Progress fraction (0..1) toward this title's gate. Used by the
 * client to render progress bars on Tier 2 / Tier 3 cards. Returns
 * 1 when the gate is satisfied, 0 when no progress information
 * is meaningful (e.g. boolean entitlement gates).
 */
export function progressFraction(
  cond: TitleUnlockCondition,
  state: TitleProgressSnapshot,
): number {
  if (evaluateTitleUnlock(cond, state)) return 1;
  switch (cond.kind) {
    case "pvp_rank_reached": {
      const tier = state.rankTiers.get(cond.gameType) ?? 0;
      return clamp01(tier / cond.minTier);
    }
    case "pvp_wins_total": {
      const total = cond.gameType
        ? state.winsByGameType.get(cond.gameType) ?? 0
        : state.totalWins;
      return clamp01(total / cond.count);
    }
    case "pvp_team_wins":
      return clamp01((state.winsByGameType.get("card_2v2") ?? 0) / cond.count);
    case "pvp_ffa_wins":
      return clamp01((state.winsByGameType.get("card_ffa") ?? 0) / cond.count);
    case "coop_raid_clears": {
      const clears = cond.bossKey
        ? state.coopRaidClears.get(cond.bossKey) ?? 0
        : state.totalRaidClears;
      return clamp01(clears / cond.count);
    }
    case "coop_role_mastery": {
      const lvl = state.coopRoleMastery.get(cond.role) ?? 0;
      return clamp01(lvl / cond.level);
    }
    case "coop_card_wins": {
      const wins = cond.encounterKey
        ? state.coopCardWins.get(cond.encounterKey) ?? 0
        : sumValues(state.coopCardWins);
      return clamp01(wins / cond.count);
    }
    case "guild_skirmish_won":
      return clamp01(state.guildSkirmishWins / cond.count);
    case "apprentice_trial_attended":
      return clamp01(state.apprenticeTrialsAttended / cond.count);
    case "apprentice_trial_graduated":
      return clamp01(state.apprenticeTrialsGraduated / cond.count);
    case "guild_hall_tier":
      return clamp01(state.guildHallTier / cond.tier);
    case "loredex_alignment_threshold":
      return clamp01((state.alignmentScores.get(cond.alignment) ?? 0) / cond.threshold);
    case "level_reached":
      return clamp01(state.level / cond.level);
    case "cross_game_dual_rank": {
      let qualifying = 0;
      for (const gt of cond.gameTypes) {
        if ((state.rankTiers.get(gt) ?? 0) >= cond.minTier) qualifying++;
      }
      return clamp01(qualifying / 2);
    }
    default:
      // Boolean / discovery / entitlement gates have no continuous
      // progress signal — they're either earned or not.
      return 0;
  }
}

/**
 * For a given root, find the highest tier earned + the next tier's
 * progress. Used by `getTitleProgression` on the router.
 */
export function describeRootProgression(
  rootKey: string,
  state: TitleProgressSnapshot,
  earned: ReadonlySet<string>,
): {
  rootKey: string;
  highestEarnedTier: number;
  nextTier?: TitleDef;
  nextTierProgress: number;
} {
  const tiers = TITLE_DEFINITIONS
    .filter((t) => t.rootKey === rootKey)
    .sort((a, b) => a.tier - b.tier);
  let highest = 0;
  let nextTier: TitleDef | undefined;
  for (const t of tiers) {
    if (earned.has(t.titleKey)) {
      highest = Math.max(highest, t.tier);
    } else if (!nextTier) {
      nextTier = t;
    }
  }
  return {
    rootKey,
    highestEarnedTier: highest,
    nextTier,
    nextTierProgress: nextTier ? progressFraction(nextTier.condition, state) : 1,
  };
}

/** Convenience constructor: partial -> full snapshot with sane defaults. */
export function makeTitleProgressSnapshot(
  partial: Partial<{
    userId: number;
    rankTiers: Iterable<readonly [GameTypeKey, number]>;
    winsByGameType: Iterable<readonly [GameTypeKey, number]>;
    totalWins: number;
    bestSeasonTierByGameType: Iterable<readonly [GameTypeKey, number]>;
    coopRaidClears: Iterable<readonly [string, number]>;
    totalRaidClears: number;
    coopRoleMastery: Iterable<readonly [string, number]>;
    maxPartyContinuity: number;
    coopCardWins: Iterable<readonly [string, number]>;
    loredexDiscovered: Iterable<string>;
    alignmentScores: Iterable<readonly [string, number]>;
    completedActs: Iterable<1 | 2 | 3 | 4 | 5 | 6 | 7>;
    secretActsRevealed: Iterable<1 | 2 | 3 | 4 | 5 | 6 | 7>;
    mysterySolved: Iterable<string>;
    mysteryFirstSolved: Iterable<string>;
    kaelFragmentsUnlocked: Iterable<string>;
    level: number;
    prestigeLevels: Iterable<readonly [string, number]>;
    entitlements: Iterable<string>;
    guildWarsWon: number;
    guildWarTerritoriesHeld: Iterable<string>;
    guildSkirmishWins: number;
    guildHallTier: number;
    apprenticeTrialsAttended: number;
    apprenticeTrialsGraduated: number;
    battlePassTier: number;
  }>,
): TitleProgressSnapshot {
  return {
    userId: partial.userId ?? 0,
    rankTiers: new Map(partial.rankTiers ?? []),
    winsByGameType: new Map(partial.winsByGameType ?? []),
    totalWins: partial.totalWins ?? 0,
    bestSeasonTierByGameType: new Map(partial.bestSeasonTierByGameType ?? []),
    coopRaidClears: new Map(partial.coopRaidClears ?? []),
    totalRaidClears: partial.totalRaidClears ?? 0,
    coopRoleMastery: new Map(partial.coopRoleMastery ?? []),
    maxPartyContinuity: partial.maxPartyContinuity ?? 0,
    coopCardWins: new Map(partial.coopCardWins ?? []),
    loredexDiscovered: new Set(partial.loredexDiscovered ?? []),
    alignmentScores: new Map(partial.alignmentScores ?? []),
    completedActs: new Set(partial.completedActs ?? []),
    secretActsRevealed: new Set(partial.secretActsRevealed ?? []),
    mysterySolved: new Set(partial.mysterySolved ?? []),
    mysteryFirstSolved: new Set(partial.mysteryFirstSolved ?? []),
    kaelFragmentsUnlocked: new Set(partial.kaelFragmentsUnlocked ?? []),
    level: partial.level ?? 1,
    prestigeLevels: new Map(partial.prestigeLevels ?? []),
    entitlements: new Set(partial.entitlements ?? []),
    guildWarsWon: partial.guildWarsWon ?? 0,
    guildWarTerritoriesHeld: new Set(partial.guildWarTerritoriesHeld ?? []),
    guildSkirmishWins: partial.guildSkirmishWins ?? 0,
    guildHallTier: partial.guildHallTier ?? 0,
    apprenticeTrialsAttended: partial.apprenticeTrialsAttended ?? 0,
    apprenticeTrialsGraduated: partial.apprenticeTrialsGraduated ?? 0,
    battlePassTier: partial.battlePassTier ?? 0,
  };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function sumValues(m: ReadonlyMap<string, number>): number {
  let total = 0;
  for (const v of m.values()) total += v;
  return total;
}

// Re-export for ergonomic single-import consumption.
export { getTitleDef };
export type { TitleDef, TitleProgressSnapshot, TitleUnlockCondition } from "./types";
