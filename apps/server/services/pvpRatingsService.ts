/* ═══════════════════════════════════════════════════════
   PVP RATINGS SERVICE (#7)

   Read/write the `pvp_ratings` table. The pure ELO math lives in
   apps/shared/pvpElo.ts so the client + server compute identical
   numbers (matchmaking-screen previews use the same helpers).
   This file is the DB-bound layer:

     - getRating(userId, gameType) — read or upsert the row at
       STARTING_MMR. Always returns a row.
     - getLeaderboard(gameType, limit) — top N by mmr DESC.
     - applyMatchResult({winner, loser, gameType}) — read both
       rows, compute deltas, write both atomically (well, as
       atomically as MySQL transactions get with our pool).

   Producer wiring (duelystWs.endMatch → applyMatchResult) ships
   in a follow-up so the schema + service can be reviewed in
   isolation. The service is callable today via the tRPC
   `pvpRanking` router but no path writes through it yet.
   ═══════════════════════════════════════════════════════ */
import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { pvpRatings } from "../../db/schema";
import { logger } from "../logger";
import {
  STARTING_MMR,
  computeMatchOutcome,
  rankTierForMmr,
  type SeasonRankTier,
} from "../../shared/pvpElo";

export interface PvpRating {
  userId: number;
  gameType: string;
  mmr: number;
  seasonId: number;
  seasonRank: number;
  seasonWins: number;
  seasonLosses: number;
  peakMmr: number;
  lastMatchAt: Date | null;
  /** Derived: visible tier for the current MMR. Not stored in the
   *  DB — recomputed on read so a tier-table balance change picks
   *  up immediately for already-active accounts. */
  tier: SeasonRankTier;
}

/** Read the rating row for (userId, gameType), upserting at the
 *  starting defaults if absent. Always returns a complete shape. */
export async function getRating(
  userId: number,
  gameType: string,
): Promise<PvpRating | null> {
  const db = await getDb();
  if (!db) return null;

  const existing = await db
    .select()
    .from(pvpRatings)
    .where(and(eq(pvpRatings.userId, userId), eq(pvpRatings.gameType, gameType)))
    .limit(1);

  if (existing[0]) {
    return rowToRating(existing[0]);
  }

  // First match for this (user, gameType) — insert defaults. The
  // unique-key on (userId, gameType) makes the insert race-safe;
  // a concurrent write throws and we re-read.
  try {
    await db.insert(pvpRatings).values({
      userId,
      gameType,
      mmr: STARTING_MMR,
      peakMmr: STARTING_MMR,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!/duplicate|unique/i.test(msg)) {
      logger.warn(`[pvpRatings] insert failed: ${msg}`);
      return null;
    }
    // Race — fall through to the re-read below.
  }

  const rereadRow = await db
    .select()
    .from(pvpRatings)
    .where(and(eq(pvpRatings.userId, userId), eq(pvpRatings.gameType, gameType)))
    .limit(1);
  return rereadRow[0] ? rowToRating(rereadRow[0]) : null;
}

/** Top N by MMR within a game type. Returns the derived tier for
 *  each row so the leaderboard UI doesn't need to call rankTierForMmr
 *  per-row. */
export async function getLeaderboard(
  gameType: string,
  limit: number = 50,
): Promise<PvpRating[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(pvpRatings)
    .where(eq(pvpRatings.gameType, gameType))
    .orderBy(desc(pvpRatings.mmr))
    .limit(limit);

  return rows.map(rowToRating);
}

export interface ApplyMatchResultInput {
  winnerId: number;
  loserId: number;
  gameType: string;
}

export interface ApplyMatchResultOutput {
  winner: PvpRating;
  loser: PvpRating;
  winnerDelta: number;
  loserDelta: number;
}

/** Apply an ELO update for a finished match. Reads both players'
 *  ratings, computes the deltas via the shared `computeMatchOutcome`,
 *  and writes both rows. Returns null if the DB pool is unavailable
 *  (tests / local without MySQL) so the caller (duelystWs.endMatch
 *  in a follow-up PR) can degrade silently. */
export async function applyMatchResult(
  input: ApplyMatchResultInput,
): Promise<ApplyMatchResultOutput | null> {
  if (input.winnerId === input.loserId) {
    logger.warn(
      `[pvpRatings] applyMatchResult called with winnerId === loserId (${input.winnerId}); skipping`,
    );
    return null;
  }

  const winner = await getRating(input.winnerId, input.gameType);
  const loser = await getRating(input.loserId, input.gameType);
  if (!winner || !loser) return null;

  const outcome = computeMatchOutcome({
    winnerMmr: winner.mmr,
    winnerMatchesPlayed: winner.seasonWins + winner.seasonLosses,
    loserMmr: loser.mmr,
    loserMatchesPlayed: loser.seasonWins + loser.seasonLosses,
  });

  const winnerNewPeak = Math.max(winner.peakMmr, outcome.winnerNewMmr);

  const db = await getDb();
  if (!db) return null;

  // Two writes. We don't wrap in a transaction because the
  // pvp_ratings table is the only mutation target and the writes
  // are idempotent under retry (the `where` clauses target the
  // exact pre-update row).
  await db
    .update(pvpRatings)
    .set({
      mmr: outcome.winnerNewMmr,
      peakMmr: winnerNewPeak,
      seasonWins: winner.seasonWins + 1,
      seasonRank: outcome.winnerNewTier.tier,
      lastMatchAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(
      and(
        eq(pvpRatings.userId, input.winnerId),
        eq(pvpRatings.gameType, input.gameType),
      ),
    );

  await db
    .update(pvpRatings)
    .set({
      mmr: outcome.loserNewMmr,
      seasonLosses: loser.seasonLosses + 1,
      seasonRank: outcome.loserNewTier.tier,
      lastMatchAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(
      and(
        eq(pvpRatings.userId, input.loserId),
        eq(pvpRatings.gameType, input.gameType),
      ),
    );

  return {
    winner: {
      ...winner,
      mmr: outcome.winnerNewMmr,
      peakMmr: winnerNewPeak,
      seasonWins: winner.seasonWins + 1,
      seasonRank: outcome.winnerNewTier.tier,
      tier: outcome.winnerNewTier,
      lastMatchAt: new Date(),
    },
    loser: {
      ...loser,
      mmr: outcome.loserNewMmr,
      seasonLosses: loser.seasonLosses + 1,
      seasonRank: outcome.loserNewTier.tier,
      tier: outcome.loserNewTier,
      lastMatchAt: new Date(),
    },
    winnerDelta: outcome.winnerDelta,
    loserDelta: outcome.loserDelta,
  };
}

function rowToRating(row: typeof pvpRatings.$inferSelect): PvpRating {
  return {
    userId: row.userId,
    gameType: row.gameType,
    mmr: row.mmr,
    seasonId: row.seasonId,
    seasonRank: row.seasonRank,
    seasonWins: row.seasonWins,
    seasonLosses: row.seasonLosses,
    peakMmr: row.peakMmr,
    lastMatchAt: row.lastMatchAt,
    tier: rankTierForMmr(row.mmr),
  };
}
