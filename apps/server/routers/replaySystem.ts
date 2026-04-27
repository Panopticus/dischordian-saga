/**
 * REPLAY SYSTEM ROUTER
 * ──────────────────────────────────────────────────
 * Save, retrieve, and browse game replays.
 *
 * #6 / #46 of the AAA review roadmap: the deterministic reducer +
 * state-hash function support reproducing any match end-to-end. This
 * router exposes that as save / by-id-fetch / by-token-fetch / list
 * surfaces so a player can post a share-link that opens straight
 * into a replay viewer.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { gameReplays } from "../../db/schema";
import { eq, desc, or } from "drizzle-orm";
import { generateShareToken, isValidShareToken } from "../services/replayTokens";
import { verifyReplay } from "../services/replayVerification";

export const replaySystemRouter = router({
  /** Save a replay. Generates an unguessable shareToken so the
   *  caller can build a /replay/<token> share URL directly from the
   *  return value — no need for a second round-trip. */
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
      const shareToken = generateShareToken();
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
        shareToken,
      }).$returningId();
      return { replayId: result.id, shareToken };
    }),

  /** Get a single replay by autoincrement id (legacy lookup — kept
   *  for the my-replays list which already has the id in hand). */
  getReplay: publicProcedure
    .input(z.object({ replayId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [replay] = await db.select().from(gameReplays).where(eq(gameReplays.id, input.replayId));
      return replay || null;
    }),

  /** Get a single replay by its unguessable share-token. Public
   *  endpoint so a non-logged-in viewer following a share-link
   *  lands on the replay; the autoincrement-int id is enumerable
   *  and therefore unsafe to expose this way. The token is
   *  pre-validated against the URL-safe charset before it hits the
   *  DB to short-circuit hostile inputs (e.g. `' OR 1=1 --`). */
  getReplayByToken: publicProcedure
    .input(z.object({ shareToken: z.string() }))
    .query(async ({ input }) => {
      if (!isValidShareToken(input.shareToken)) return null;
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [replay] = await db
        .select()
        .from(gameReplays)
        .where(eq(gameReplays.shareToken, input.shareToken))
        .limit(1);
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

  /** ADMIN: Re-execute the persisted action log through the
   *  deterministic reducer and assert the recomputed final-state
   *  hash matches the stored one (#92). Used to catch engine
   *  divergence between rules versions, stored-replay tampering,
   *  and to sanity-check engine changes against historical replays
   *  before deploying. Returns a structured `VerifyReplayResult`
   *  with explicit reason codes so the admin UI can distinguish
   *  "row too old to verify" (missing-matchId/hash/config) from
   *  "real divergence" (hash-mismatch / replay-error). */
  verifyReplay: adminProcedure
    .input(z.object({ replayId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [row] = await db
        .select()
        .from(gameReplays)
        .where(eq(gameReplays.id, input.replayId))
        .limit(1);
      if (!row) {
        return {
          ok: false as const,
          reason: "missing-config" as const,
          detail: `replay ${input.replayId} not found`,
        };
      }
      return verifyReplay({
        matchId: row.matchId,
        moveData: row.moveData,
        finalStateHash: row.finalStateHash,
        p1Config: row.p1Config,
        p2Config: row.p2Config,
        player1Id: row.player1Id,
        player2Id: row.player2Id,
      });
    }),
});
