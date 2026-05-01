/* ═══════════════════════════════════════════════════════
   COMPETITIVE ROUTER — Cross-game ratings, leaderboards,
   profile feed. Reads from competitiveRatings (mirrored
   from authoritative tables on every match end).
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  competitiveRatings,
  pvpLeaderboard,
  chessRankings,
  pvpMatches,
  chessGames,
  users,
} from "../../db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { logger } from "../logger";

const GAME_TYPES = [
  "card_1v1", "card_2v2", "card_ffa", "card_coop",
  "chess",
  "circuit_1v1", "trade_oracle_duel", "cades_async_1v1",
  "td_raid", "guild_skirmish",
] as const;
const gameTypeSchema = z.enum(GAME_TYPES);

export const competitiveRouter = router({
  /** Every gameType rating row for the current user. */
  getMyRatings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(competitiveRatings)
      .where(eq(competitiveRatings.userId, ctx.user.id));
  }),

  /** Top 50 leaderboard for any gameType. */
  getLeaderboard: publicProcedure
    .input(z.object({ gameType: gameTypeSchema, limit: z.number().min(1).max(100).optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(competitiveRatings)
        .where(eq(competitiveRatings.gameType, input.gameType))
        .orderBy(desc(competitiveRatings.currentElo))
        .limit(input.limit ?? 50);
      if (rows.length === 0) return [];
      const userIds = rows.map((r) => r.userId);
      const userRows = await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(inArray(users.id, userIds));
      const nameById = new Map(userRows.map((u) => [u.id, u.name ?? "Unknown"]));
      return rows.map((r) => ({
        userId: r.userId,
        userName: nameById.get(r.userId) ?? "Unknown",
        gameType: r.gameType,
        currentElo: r.currentElo,
        peakElo: r.peakElo,
        rankTier: r.rankTier,
        wins: r.wins,
        losses: r.losses,
        winStreak: r.winStreak,
      }));
    }),

  /**
   * Unified profile feed — recent activity across every PvP gameType.
   * Pulls the union of card duels and chess games (ordered by recency)
   * and labels each entry with its gameType. As Tier 4/5 surfaces ship,
   * additional sources slot in here.
   */
  getProfileFeed: publicProcedure
    .input(z.object({ userId: z.number().int(), limit: z.number().min(1).max(100).optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const limit = input.limit ?? 25;

      // Card duels
      const cardMatches = await db
        .select()
        .from(pvpMatches)
        .where(sql`${pvpMatches.player1Id} = ${input.userId} OR ${pvpMatches.player2Id} = ${input.userId}`)
        .orderBy(desc(pvpMatches.startedAt))
        .limit(limit);
      const cardEntries = cardMatches.map((m) => ({
        kind: "card_match" as const,
        gameType: "card_1v1",
        matchId: m.matchId,
        won: m.winnerId === input.userId,
        opponentId: m.player1Id === input.userId ? m.player2Id : m.player1Id,
        eloChange: m.player1Id === input.userId ? m.player1EloChange : m.player2EloChange,
        at: m.startedAt,
      }));

      // Chess games
      const chess = await db
        .select()
        .from(chessGames)
        .where(sql`${chessGames.whitePlayerId} = ${input.userId} OR ${chessGames.blackPlayerId} = ${input.userId}`)
        .orderBy(desc(chessGames.createdAt))
        .limit(limit);
      const chessEntries = chess.map((g) => ({
        kind: "chess_match" as const,
        gameType: "chess",
        matchId: g.id,
        won: g.winnerId === input.userId,
        opponentId: g.whitePlayerId === input.userId ? g.blackPlayerId : g.whitePlayerId,
        eloChange: g.whitePlayerId === input.userId ? g.whiteEloChange : g.blackEloChange,
        at: g.createdAt,
      }));

      const merged = [...cardEntries, ...chessEntries].sort(
        (a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0),
      );
      return merged.slice(0, limit);
    }),

  /**
   * Admin/maintenance: backfill competitiveRatings from the legacy
   * per-gameType tables (pvpLeaderboard, chessRankings). Idempotent —
   * uses INSERT...ON DUPLICATE KEY UPDATE on (userId, gameType).
   * Restricted to authenticated users for now; the admin gate can be
   * tightened later if we wire role checks.
   */
  backfillRatings: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { ok: false, reason: "no_db" };
    let cardMirrored = 0;
    let chessMirrored = 0;

    // Card 1v1 from pvpLeaderboard
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
              currentElo: r.elo,
              peakElo: sql`GREATEST(peak_elo, ${r.elo})`,
              wins: r.wins,
              losses: r.losses,
              winStreak: r.winStreak,
              bestStreak: r.bestStreak,
              rankTier: r.rankTier,
              lastMatchAt: r.lastMatchAt,
              lastDecayAt: r.lastDecayAt,
            },
          });
        cardMirrored++;
      } catch (err) {
        logger.warn(
          "backfill_card_failed",
          "competitiveRouter",
          { userId: r.userId, error: String(err) },
        );
      }
    }

    // Chess from chessRankings
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
            set: {
              currentElo: r.elo,
              peakElo: sql`GREATEST(peak_elo, ${r.peakElo})`,
              wins: r.wins,
              losses: r.losses,
              draws: r.draws,
              winStreak: r.winStreak,
              bestStreak: r.bestWinStreak,
              rankTier: r.tier,
              seasonNumber: r.seasonNumber,
            },
          });
        chessMirrored++;
      } catch (err) {
        logger.warn(
          "backfill_chess_failed",
          "competitiveRouter",
          { userId: r.userId, error: String(err) },
        );
      }
    }

    logger.info(
      "competitive_backfill_complete",
      "competitiveRouter",
      { calledBy: ctx.user.id, cardMirrored, chessMirrored },
    );
    return { ok: true, cardMirrored, chessMirrored };
  }),
});
