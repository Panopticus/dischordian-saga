/**
 * One-shot competitive ratings backfill.
 *
 * On first boot after Tier 2A lands, populate `competitive_ratings`
 * from the legacy `pvp_leaderboard` and `chess_rankings` tables so
 * existing players don't have to play a match before their rating
 * appears in the unified surface.
 *
 * Idempotent via the `competitive_ratings_backfill` marker — runs
 * once per version, skipped on every subsequent boot.
 */
import { eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  competitiveRatings,
  competitiveRatingsBackfill,
  pvpLeaderboard,
  chessRankings,
} from "../../db/schema";
import { logger } from "../logger";

const BACKFILL_VERSION = "v1";

export async function runCompetitiveRatingsBackfillOnce(): Promise<{
  ran: boolean;
  cardMirrored: number;
  chessMirrored: number;
}> {
  const db = await getDb();
  if (!db) return { ran: false, cardMirrored: 0, chessMirrored: 0 };

  const existing = await db
    .select()
    .from(competitiveRatingsBackfill)
    .where(eq(competitiveRatingsBackfill.version, BACKFILL_VERSION))
    .limit(1);
  if (existing[0]) {
    return { ran: false, cardMirrored: 0, chessMirrored: 0 };
  }

  let cardMirrored = 0;
  let chessMirrored = 0;

  // Card 1v1 from pvpLeaderboard.
  const lbRows = await db.select().from(pvpLeaderboard);
  for (const r of lbRows) {
    try {
      await db
        .insert(competitiveRatings)
        .values({
          userId: r.userId,
          gameType: "card_1v1",
          currentElo: r.elo,
          peakElo: r.elo,
          wins: r.wins,
          losses: r.losses,
          winStreak: r.winStreak,
          bestStreak: r.bestStreak,
          rankTier: r.rankTier,
          lastMatchAt: r.lastMatchAt,
          lastDecayAt: r.lastDecayAt,
          seasonNumber: 1,
        })
        .onDuplicateKeyUpdate({
          set: {
            // No-op on duplicate so we never clobber a fresher
            // mirrored value. (Match-end mirrors are authoritative.)
            currentElo: sql`current_elo`,
          },
        });
      cardMirrored++;
    } catch (err) {
      // Tolerated — single-row failure shouldn't abort the batch.
      logger.warn(
        "competitive_backfill_v1_card_failed",
        "competitiveRatingsBackfill",
        { userId: r.userId, error: String(err) },
      );
    }
  }

  // Chess from chessRankings.
  const chessRows = await db.select().from(chessRankings);
  for (const r of chessRows) {
    try {
      await db
        .insert(competitiveRatings)
        .values({
          userId: r.userId,
          gameType: "chess",
          currentElo: r.elo,
          peakElo: r.peakElo,
          wins: r.wins,
          losses: r.losses,
          draws: r.draws,
          winStreak: r.winStreak,
          bestStreak: r.bestWinStreak,
          rankTier: r.tier,
          seasonNumber: r.seasonNumber,
        })
        .onDuplicateKeyUpdate({
          set: { currentElo: sql`current_elo` },
        });
      chessMirrored++;
    } catch (err) {
      logger.warn(
        "competitive_backfill_v1_chess_failed",
        "competitiveRatingsBackfill",
        { userId: r.userId, error: String(err) },
      );
    }
  }

  // Marker — only insert AFTER the migration succeeds, so a crash
  // mid-run is replayable.
  try {
    await db.insert(competitiveRatingsBackfill).values({
      version: BACKFILL_VERSION,
      cardMirrored,
      chessMirrored,
    });
  } catch (err) {
    // Race: another boot inserted the marker while we ran. Safe.
    logger.info(
      "competitive_backfill_v1_marker_race",
      "competitiveRatingsBackfill",
      { error: String(err) },
    );
  }

  logger.info(
    "competitive_backfill_v1_complete",
    "competitiveRatingsBackfill",
    { cardMirrored, chessMirrored },
  );
  return { ran: true, cardMirrored, chessMirrored };
}
