/* ═══════════════════════════════════════════════════════
   CROSS-GAME NARRATIVE THREAD EMIT ROUTER

   Implements the runtime contract documented in
   docs/design/AUTHORING_CROSS_GAME_THREADS.md. Game-side
   code (Loredex, Cades FPS, Dead Man's Circuit) calls this
   endpoint to emit a beat; the server validates the beat
   id against the canonical registry and sets the flag
   `xgame_<beatId>` on the player's narrativeFlags so
   consuming code in any game can read the cross-game state
   off the same flag set the rest of the narrative system
   uses.

   Endpoints:
     emit(beatId, emittedBy?)  — set the xgame flag for one beat
     status(threadId)          — read which beats have fired
                                 for the current player
     listThreads()             — registry browse for clients

   Read-only listings are publicProcedure; emit + status need
   an authenticated session because they touch per-player state.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";
import {
  CROSS_GAME_THREADS,
  getAllBeats,
  getOrderedBeats,
  getThread,
  type DschGame,
} from "@shared/crossGameNarrativeThreads";

const GAMES = ["loredex", "cades_fps", "dead_mans_circuit"] as const;

/** Convention: cross-game beats live under this flag prefix. */
function flagFor(beatId: string): string {
  return `xgame_${beatId}`;
}

async function getNarrativeFlags(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
): Promise<Record<string, boolean>> {
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const gd = (progress?.gameData as Record<string, unknown>) ?? {};
  return (gd.narrativeFlags as Record<string, boolean>) ?? {};
}

async function saveNarrativeFlags(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  flags: Record<string, boolean>,
): Promise<void> {
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  if (!progress) {
    // First-touch: create a minimal row so emits aren't lost on a
    // brand-new account that has not yet saved gameState.
    await db.insert(userProgress).values({
      userId,
      gameData: { narrativeFlags: flags } as Record<string, unknown>,
    });
    return;
  }
  const gd = (progress.gameData as Record<string, unknown>) ?? {};
  await db
    .update(userProgress)
    .set({ gameData: { ...gd, narrativeFlags: flags } })
    .where(eq(userProgress.id, progress.id));
}

export const crossGameThreadsRouter = router({
  /**
   * Emit a beat. Validates the beat id, verifies emittedBy (if given)
   * matches the canonical emitter, and sets the xgame flag on the
   * player's narrativeFlags. Idempotent — re-emitting the same beat
   * is a no-op for the flag and returns alreadyEmitted=true.
   */
  emit: protectedProcedure
    .input(
      z.object({
        beatId: z.string().min(1),
        /** Game name asserting authorship. Must match canonical emitter. */
        emittedBy: z.enum(GAMES).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allBeats = getAllBeats();
      const beat = allBeats[input.beatId];
      if (!beat) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown cross-game beat: ${input.beatId}`,
        });
      }
      if (input.emittedBy && input.emittedBy !== beat.emittedBy) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Beat ${input.beatId} can only be emitted by ${beat.emittedBy}, got ${input.emittedBy}`,
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      const flag = flagFor(input.beatId);
      const flags = await getNarrativeFlags(db, ctx.user.id);
      const alreadyEmitted = flags[flag] === true;
      if (!alreadyEmitted) {
        flags[flag] = true;
        await saveNarrativeFlags(db, ctx.user.id, flags);
      }

      // Find which thread this beat belongs to (for the response).
      const thread = CROSS_GAME_THREADS.find((t) =>
        t.beats.some((b) => b.id === input.beatId),
      );
      if (!thread) {
        // Defensive — would only happen if registry got mutated mid-flight.
        logger.warn(
          `[crossGameThreads] beat ${input.beatId} not in any thread`,
        );
      }

      return {
        success: true as const,
        flag,
        alreadyEmitted,
        threadId: thread?.id ?? null,
        beatLabel: beat.label,
      };
    }),

  /**
   * Read which beats of a thread have fired for the current player.
   * Returns the ordered beat list with an `emitted` boolean each.
   */
  status: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const thread = getThread(input.threadId);
      if (!thread) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Unknown thread: ${input.threadId}`,
        });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }
      const flags = await getNarrativeFlags(db, ctx.user.id);
      const beats = getOrderedBeats(input.threadId).map((b) => ({
        id: b.id,
        label: b.label,
        emittedBy: b.emittedBy,
        order: b.order,
        emitted: flags[flagFor(b.id)] === true,
      }));
      const totalEmitted = beats.filter((b) => b.emitted).length;
      return {
        threadId: thread.id,
        title: thread.title,
        originGame: thread.originGame,
        participatingGames: thread.participatingGames,
        beats,
        totalEmitted,
        totalBeats: beats.length,
        complete: totalEmitted === beats.length,
      };
    }),

  /**
   * Browse the registry. No DB access; safe as a public query so
   * cross-game clients can fetch the catalog without auth.
   */
  listThreads: publicProcedure
    .input(
      z
        .object({
          /** Filter to threads a specific game participates in. */
          game: z.enum(GAMES).optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      const game: DschGame | undefined = input?.game;
      const filtered = game
        ? CROSS_GAME_THREADS.filter((t) => t.participatingGames.includes(game))
        : CROSS_GAME_THREADS;
      return filtered.map((t) => ({
        id: t.id,
        title: t.title,
        originGame: t.originGame,
        participatingGames: t.participatingGames,
        beatCount: t.beats.length,
      }));
    }),
});
