/**
 * REPLAY SYSTEM ROUTER
 * ──────────────────────────────────────────────────
 * Save, retrieve, and browse game replays.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { gameReplays } from "../../drizzle/schema";
import { eq, desc, or, and, sql } from "drizzle-orm";

export const replaySystemRouter = router({
  /** Save a replay */
  saveReplay: protectedProcedure
    .input(z.object({
      gameType: z.string(),
      player2Id: z.number().optional(),
      player2Name: z.string().optional(),
      winnerId: z.number().optional(),
      moveData: z.string(),
      totalMoves: z.number(),
      duration: z.number(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [result] = await db.insert(gameReplays).values({
        gameType: input.gameType,
        player1Id: ctx.user.id,
        player1Name: ctx.user.name || "Unknown",
        player2Id: input.player2Id ?? null,
        player2Name: input.player2Name ?? null,
        winnerId: input.winnerId ?? null,
        moveData: input.moveData,
        totalMoves: input.totalMoves,
        duration: input.duration,
        tags: input.tags || null,
      }).$returningId();
      return { replayId: result.id };
    }),

  /** Get a single replay */
  getReplay: publicProcedure
    .input(z.object({ replayId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [replay] = await db.select().from(gameReplays).where(eq(gameReplays.id, input.replayId));
      return replay || null;
    }),

  /** Get my replays */
  getMyReplays: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(gameReplays)
        .where(or(eq(gameReplays.player1Id, ctx.user.id), eq(gameReplays.player2Id, ctx.user.id)))
        .orderBy(desc(gameReplays.playedAt))
        .limit(input.limit);
    }),

  /** Get featured replays */
  getFeaturedReplays: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(gameReplays)
        .where(eq(gameReplays.featured, true))
        .orderBy(desc(gameReplays.playedAt))
        .limit(input.limit);
    }),

  /** Get recent replays by game type */
  getRecentByType: publicProcedure
    .input(z.object({ gameType: z.string(), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(gameReplays)
        .where(eq(gameReplays.gameType, input.gameType))
        .orderBy(desc(gameReplays.playedAt))
        .limit(input.limit);
    }),
});
