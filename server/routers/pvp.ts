/* ═══════════════════════════════════════════════════════
   PVP ROUTER — Leaderboard, match history, deck validation
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { pvpMatches, pvpLeaderboard, users } from "../../drizzle/schema";
import { eq, desc, and, or, sql } from "drizzle-orm";

export const pvpRouter = router({
  /** Get the PvP leaderboard (top 50) */
  getLeaderboard: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(pvpLeaderboard)
      .orderBy(desc(pvpLeaderboard.elo))
      .limit(50);
  }),

  /** Get current user's PvP stats */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(pvpLeaderboard)
      .where(eq(pvpLeaderboard.userId, ctx.user.id))
      .limit(1);
    return rows[0] || null;
  }),

  /** Get match history for current user */
  getMatchHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const limit = input?.limit ?? 20;
      const matches = await db
        .select()
        .from(pvpMatches)
        .where(
          or(
            eq(pvpMatches.player1Id, ctx.user.id),
            eq(pvpMatches.player2Id, ctx.user.id)
          )
        )
        .orderBy(desc(pvpMatches.startedAt))
        .limit(limit);

      // Enrich with opponent names
      const enriched = await Promise.all(
        matches.map(async (match) => {
          const opponentId = match.player1Id === ctx.user.id ? match.player2Id : match.player1Id;
          let opponentName = "Unknown";
          if (opponentId) {
            const userRows = await db.select({ name: users.name }).from(users).where(eq(users.id, opponentId)).limit(1);
            if (userRows[0]) opponentName = userRows[0].name || "Unknown";
          }
          const isPlayer1 = match.player1Id === ctx.user.id;
          return {
            ...match,
            opponentName,
            won: match.winnerId === ctx.user.id,
            eloChange: isPlayer1 ? match.player1EloChange : match.player2EloChange,
          };
        })
      );

      return enriched;
    }),

  /** Get live queue status */
  getQueueStatus: publicProcedure.query(async () => {
    // This is a simple REST endpoint; real-time updates come via WebSocket
    return {
      playersInQueue: 0, // Updated by WS handler
      activeMatches: 0,
    };
  }),
});
