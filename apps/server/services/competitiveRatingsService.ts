/**
 * Unified competitive ratings service.
 *
 * Authoritative writes still flow through the existing per-gameType
 * tables (`pvpLeaderboard`, `chessRankings`, raid trophies, etc.); this
 * service mirrors every write into the gameType-keyed `competitiveRatings`
 * table so downstream consumers (titles, unified profile feed, the
 * Competitive Hub) can query a single shape across every PvP surface.
 *
 * Idempotent on the (userId, gameType) unique index.
 */
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import { competitiveRatings } from "../../db/schema";
import type { GameTypeKey } from "@shared/titles/types";
import { logger } from "../logger";

export interface RatingUpdate {
  userId: number;
  gameType: GameTypeKey;
  currentElo: number;
  peakElo?: number;
  /** Result tally. Pass {win:true} for a win, {loss:true} for a loss,
   *  {draw:true} for a draw. Pass nothing to update ELO without a tally. */
  result?: { win?: boolean; loss?: boolean; draw?: boolean };
  rankTier: string;
  winStreak?: number;
  bestStreak?: number;
  seasonNumber?: number;
}

/**
 * Mirror an authoritative match-end write into competitiveRatings.
 * Safe to call from existing match-end paths without changing them.
 */
export async function mirrorRating(update: RatingUpdate): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    const peak = update.peakElo ?? update.currentElo;
    const winInc = update.result?.win ? 1 : 0;
    const lossInc = update.result?.loss ? 1 : 0;
    const drawInc = update.result?.draw ? 1 : 0;
    await db
      .insert(competitiveRatings)
      .values({
        userId: update.userId,
        gameType: update.gameType,
        currentElo: update.currentElo,
        peakElo: peak,
        wins: winInc,
        losses: lossInc,
        draws: drawInc,
        winStreak: update.winStreak ?? 0,
        bestStreak: update.bestStreak ?? 0,
        rankTier: update.rankTier,
        seasonNumber: update.seasonNumber ?? 1,
        lastMatchAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          currentElo: update.currentElo,
          peakElo: sql`GREATEST(peak_elo, ${peak})`,
          wins: sql`wins + ${winInc}`,
          losses: sql`losses + ${lossInc}`,
          draws: sql`draws + ${drawInc}`,
          winStreak: update.winStreak ?? sql`win_streak`,
          bestStreak: sql`GREATEST(best_streak, ${update.bestStreak ?? 0})`,
          rankTier: update.rankTier,
          lastMatchAt: new Date(),
        },
      });
  } catch (err) {
    logger.warn(
      "competitive_rating_mirror_failed",
      "competitiveRatings",
      { userId: update.userId, gameType: update.gameType, error: String(err) },
    );
  }
}

/** Fetch every gameType's rating row for a user. */
export async function getMyRatings(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(competitiveRatings)
    .where(eq(competitiveRatings.userId, userId));
}

/** Fetch a single rating row, or null if the user hasn't played that gameType. */
export async function getRatingForGameType(
  userId: number,
  gameType: GameTypeKey,
) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(competitiveRatings)
    .where(
      and(
        eq(competitiveRatings.userId, userId),
        eq(competitiveRatings.gameType, gameType),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}
