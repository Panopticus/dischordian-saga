/**
 * Title Service — server-side glue between title-grant events and the
 * pure-function evaluator in apps/shared/titles/titleUnlockService.ts.
 *
 * Responsibilities:
 *   - Build a `TitleProgressSnapshot` for a user from current DB state
 *   - Diff against earned titles, persist new grants in `userTitles`
 *   - Provide an `awardEligibleTitles(userId, event)` entrypoint that
 *     every event-emitting hook (pvpWs, chessWs, coopRaids, narrative)
 *     calls without caring about the snapshot internals
 *
 * Reads are bounded by gameType-keyed tables; writes are idempotent
 * (uniqueIndex on (userId, titleKey)).
 */
import { eq, inArray, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  pvpLeaderboard,
  chessRankings,
  competitiveRatings,
  raidContributions,
  bossMastery,
  userProgress,
  userTitles,
  guildMembers,
  guilds,
} from "../../db/schema";
import {
  computeNewlyUnlocked,
  makeTitleProgressSnapshot,
} from "@shared/titles/titleUnlockService";
import type {
  GameTypeKey,
  TitleEvent,
  TitleProgressSnapshot,
} from "@shared/titles/types";
import { logger } from "../logger";

const RANK_TIER_INDEX: Record<string, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
  diamond: 4,
  master: 5,
  grandmaster: 6,
};

/**
 * Build a title-progress snapshot for `userId` from the canonical
 * tables. Tier 1 sources only the data that exists today — Tier 2+
 * extends this loader to read from `competitiveRatings`,
 * `userClueProgress`, etc., once those land.
 */
export async function buildTitleSnapshot(
  userId: number,
): Promise<TitleProgressSnapshot> {
  const db = await getDb();
  if (!db) return makeTitleProgressSnapshot({ userId });

  const rankTiers = new Map<GameTypeKey, number>();
  const winsByGameType = new Map<GameTypeKey, number>();
  const bestSeasonTierByGameType = new Map<GameTypeKey, number>();
  let totalWins = 0;

  // Unified competitive ratings (Tier 2A) — read every gameType from
  // a single table. Falls back to legacy per-gameType tables when a
  // user hasn't been mirrored yet (pre-backfill).
  const ratingRows = await db
    .select()
    .from(competitiveRatings)
    .where(eq(competitiveRatings.userId, userId));
  for (const r of ratingRows) {
    const key = r.gameType as GameTypeKey;
    rankTiers.set(key, RANK_TIER_INDEX[r.rankTier] ?? 0);
    winsByGameType.set(key, r.wins ?? 0);
    totalWins += r.wins ?? 0;
  }

  // Legacy fallback: pvpLeaderboard for card_1v1 (read if no mirror row).
  if (!rankTiers.has("card_1v1")) {
    const lbRows = await db
      .select()
      .from(pvpLeaderboard)
      .where(eq(pvpLeaderboard.userId, userId))
      .limit(1);
    if (lbRows[0]) {
      const r = lbRows[0];
      rankTiers.set("card_1v1", RANK_TIER_INDEX[r.rankTier] ?? 0);
      winsByGameType.set("card_1v1", r.wins ?? 0);
      totalWins += r.wins ?? 0;
    }
  }

  // Legacy fallback: chessRankings.
  if (!rankTiers.has("chess")) {
    const chessRows = await db
      .select()
      .from(chessRankings)
      .where(eq(chessRankings.userId, userId))
      .limit(1);
    if (chessRows[0]) {
      const r = chessRows[0];
      rankTiers.set("chess", RANK_TIER_INDEX[r.tier] ?? 0);
      winsByGameType.set("chess", r.wins ?? 0);
      totalWins += r.wins ?? 0;
    }
  }

  // Co-op raids — boss mastery rollup
  const masteryRows = await db
    .select()
    .from(bossMastery)
    .where(eq(bossMastery.userId, userId));
  const coopRaidClears = new Map<string, number>();
  let totalRaidClears = 0;
  for (const m of masteryRows) {
    coopRaidClears.set(m.bossKey, m.kills ?? 0);
    totalRaidClears += m.kills ?? 0;
  }

  // Role mastery: highest mastery level we've seen per role
  // (raid_contributions is per-raid; aggregate by role).
  const roleRows = await db
    .select()
    .from(raidContributions)
    .where(eq(raidContributions.userId, userId));
  const roleClearCount = new Map<string, number>();
  for (const r of roleRows) {
    roleClearCount.set(r.role, (roleClearCount.get(r.role) ?? 0) + 1);
  }
  // Mastery level threshold: 5 clears = lvl 1, 25 = lvl 2, 75 = lvl 3, 200 = lvl 4, 500 = lvl 5.
  const coopRoleMastery = new Map<string, number>();
  for (const [role, count] of roleClearCount) {
    coopRoleMastery.set(role, roleMasteryLevel(count));
  }

  // Player progress
  const progressRows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const level = progressRows[0]?.level ?? 1;
  const flags = (progressRows[0]?.progressData ?? {}) as Record<string, unknown>;
  const completedActs = new Set<1 | 2 | 3 | 4 | 5 | 6 | 7>();
  const secretActsRevealed = new Set<1 | 2 | 3 | 4 | 5 | 6 | 7>();
  for (const n of [1, 2, 3, 4, 5, 6, 7] as const) {
    if (flags[`act_${n}_complete`]) completedActs.add(n);
    if (flags[`secret_act_${n}_revealed`]) secretActsRevealed.add(n);
  }
  const loredexDiscovered = new Set<string>();
  for (const k of Object.keys(flags)) {
    if (k.startsWith("loredex_") && flags[k]) {
      loredexDiscovered.add(k.replace(/^loredex_/, ""));
    }
  }
  const alignmentScores = new Map<string, number>();
  for (const k of Object.keys(flags)) {
    if (k.startsWith("alignment_") && typeof flags[k] === "number") {
      alignmentScores.set(k.replace(/^alignment_/, ""), flags[k] as number);
    }
  }

  // Guild context
  const memberRows = await db
    .select()
    .from(guildMembers)
    .where(eq(guildMembers.userId, userId))
    .limit(1);
  let guildHallTier = 0;
  if (memberRows[0]) {
    const guildRows = await db
      .select()
      .from(guilds)
      .where(eq(guilds.id, memberRows[0].guildId))
      .limit(1);
    if (guildRows[0]) {
      // `level` is the proxy for hall tier in Tier 1; Tier 4 introduces
      // the dedicated hall_tier column.
      guildHallTier = guildRows[0].level ?? 0;
    }
  }

  return makeTitleProgressSnapshot({
    userId,
    rankTiers,
    winsByGameType,
    totalWins,
    bestSeasonTierByGameType,
    coopRaidClears,
    totalRaidClears,
    coopRoleMastery,
    completedActs,
    secretActsRevealed,
    loredexDiscovered,
    alignmentScores,
    level,
    guildHallTier,
  });
}

function roleMasteryLevel(clears: number): number {
  if (clears >= 500) return 5;
  if (clears >= 200) return 4;
  if (clears >= 75) return 3;
  if (clears >= 25) return 2;
  if (clears >= 5) return 1;
  return 0;
}

/** Fetch already-earned title keys for `userId`. */
export async function getEarnedTitleKeys(userId: number): Promise<Set<string>> {
  const db = await getDb();
  if (!db) return new Set();
  const rows = await db
    .select({ titleKey: userTitles.titleKey })
    .from(userTitles)
    .where(eq(userTitles.userId, userId));
  return new Set(rows.map((r) => r.titleKey));
}

/**
 * Award every newly-eligible title for `userId`. Idempotent: existing
 * `userTitles` rows are skipped. Returns the keys actually granted
 * (so callers can surface a toast / notification).
 *
 * `event` is informational — used for logging + future season tagging.
 */
export async function awardEligibleTitles(
  userId: number,
  event?: TitleEvent,
): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const [snapshot, earned] = await Promise.all([
    buildTitleSnapshot(userId),
    getEarnedTitleKeys(userId),
  ]);
  const newlyUnlocked = computeNewlyUnlocked(snapshot, earned);
  if (newlyUnlocked.length === 0) return [];

  const seasonNumber = event && "season" in event && typeof event.season === "number"
    ? event.season
    : null;

  try {
    await db
      .insert(userTitles)
      .values(
        newlyUnlocked.map((t) => ({
          userId,
          titleKey: t.titleKey,
          seasonNumber: seasonNumber ?? undefined,
        })),
      )
      // No-op on duplicate (idempotent re-grant). Drizzle requires a
      // value-shaped `set`; pinning earnedAt to itself is the standard
      // MySQL idiom for "do nothing on conflict."
      .onDuplicateKeyUpdate({ set: { earnedAt: sql`earned_at` } });
  } catch (err) {
    logger.warn(
      "title_grant_failed",
      "titleService",
      { userId, titles: newlyUnlocked.map((t) => t.titleKey), error: String(err) },
    );
    return [];
  }

  logger.info(
    "title_grants_applied",
    "titleService",
    { userId, granted: newlyUnlocked.map((t) => t.titleKey), event: event?.kind },
  );
  return newlyUnlocked.map((t) => t.titleKey);
}

/** Hot-path helper for first-discovery title grants. */
export async function recordFirstDiscovererTitle(
  userId: number,
  boardKey: string,
): Promise<string[]> {
  // Tier 2B will populate mysteryFirstSolved on the snapshot; for now,
  // the synchronous evaluator picks this up as soon as the conspiracy
  // boards table is wired. Until then, the function is a stub that
  // simply re-runs the standard grant pipeline.
  return awardEligibleTitles(userId, {
    kind: "mystery_solved",
    userId,
    boardKey,
    isFirstDiscoverer: true,
  });
}

/** Bulk variant — used when a server-wide reveal grants titles to many users. */
export async function awardEligibleTitlesForUsers(
  userIds: readonly number[],
  event?: TitleEvent,
): Promise<Map<number, string[]>> {
  const result = new Map<number, string[]>();
  for (const uid of userIds) {
    const granted = await awardEligibleTitles(uid, event);
    result.set(uid, granted);
  }
  return result;
}

/** Lookup the rank tier index for a tier name (utility for hookpoints). */
export function rankTierIndex(tierName: string): number {
  return RANK_TIER_INDEX[tierName] ?? 0;
}

// Re-export for convenience.
export { inArray };
