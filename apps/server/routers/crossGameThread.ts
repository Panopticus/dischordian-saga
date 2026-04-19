/* ═══════════════════════════════════════════════════════
   CROSS-GAME NARRATIVE THREAD ROUTER

   Implements the server-side contract documented in
   docs/design/AUTHORING_CROSS_GAME_THREADS.md:

     await fetch("/api/trpc/crossGameThread.emit", {
       method: "POST",
       body: JSON.stringify({ beatId: "cades_fall_fall" }),
     });
     // → sets xgame_cades_fall_fall on the player's
     //   gameData.narrativeFlags blob.

   Validates the beatId against the canonical registry in
   apps/shared/crossGameNarrativeThreads.ts. Unknown beats
   are rejected (NOT_FOUND) so external games cannot silently
   corrupt the flag namespace.

   Writes are idempotent: emitting the same beat twice is a
   no-op on the second call. The response includes the
   thread id + ordered beats so the caller can immediately
   render the progression state without a follow-up query.

   Read endpoint: `list()` returns every registered thread
   with the caller's current beat-progression mask — the
   minimum the Loredex Ark needs to surface pilgrimage pins
   and Act-5 map updates.
   ═══════════════════════════════════════════════════════ */

import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  CROSS_GAME_THREADS,
  getAllBeats,
  getOrderedBeats,
  getThread,
} from "@shared/crossGameNarrativeThreads";

import { userProgress } from "../../db/schema";
import { getDb } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const FLAG_PREFIX = "xgame_";

function flagForBeat(beatId: string): string {
  return `${FLAG_PREFIX}${beatId}`;
}

async function readNarrativeFlags(
  userId: number,
): Promise<Record<string, boolean>> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "database unavailable",
    });
  }
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  if (!progress) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "player progress not found",
    });
  }
  const gameData = (progress.gameData ?? {}) as Record<string, unknown>;
  return (gameData.narrativeFlags ?? {}) as Record<string, boolean>;
}

async function setNarrativeFlag(
  userId: number,
  flag: string,
): Promise<{ alreadySet: boolean; flags: Record<string, boolean> }> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "database unavailable",
    });
  }
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  if (!progress) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "player progress not found",
    });
  }
  const gameData = (progress.gameData ?? {}) as Record<string, unknown>;
  const currentFlags = (gameData.narrativeFlags ?? {}) as Record<string, boolean>;
  const alreadySet = currentFlags[flag] === true;
  if (alreadySet) {
    return { alreadySet: true, flags: currentFlags };
  }
  currentFlags[flag] = true;
  gameData.narrativeFlags = currentFlags;
  await db
    .update(userProgress)
    .set({ gameData })
    .where(eq(userProgress.userId, userId));
  return { alreadySet: false, flags: currentFlags };
}

export const crossGameThreadRouter = router({
  /**
   * Emit a cross-game beat. Sets the corresponding
   * `xgame_<beatId>` flag on the caller's narrativeFlags blob
   * if not already set.
   *
   * Input: { beatId } — must resolve against CROSS_GAME_THREADS.
   * Output: { threadId, flag, alreadySet, orderedBeats } — the
   * thread the beat belongs to, the canonical flag name set
   * on the player, whether the write was a no-op, and the
   * thread's ordered beats for immediate rendering.
   */
  emit: protectedProcedure
    .input(
      z.object({
        beatId: z.string().min(1, "beatId required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allBeats = getAllBeats();
      const beat = allBeats[input.beatId];
      if (!beat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `unknown cross-game beat: ${input.beatId}`,
        });
      }
      const thread = CROSS_GAME_THREADS.find((t) =>
        t.beats.some((b) => b.id === input.beatId),
      );
      if (!thread) {
        // Defensive: getAllBeats() returned the beat but
        // CROSS_GAME_THREADS couldn't place it. The registry
        // test guards against this shape, but we surface it
        // clearly in case a bad merge slips through.
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `beat ${input.beatId} is orphaned from its thread`,
        });
      }
      const flag = flagForBeat(input.beatId);
      const { alreadySet } = await setNarrativeFlag(ctx.user.id, flag);
      return {
        threadId: thread.id,
        flag,
        alreadySet,
        orderedBeats: getOrderedBeats(thread.id).map((b) => ({
          id: b.id,
          order: b.order,
          emittedBy: b.emittedBy,
          emitted: true, // placeholder; the list endpoint returns the real mask
        })),
      } as const;
    }),

  /**
   * List every registered thread with the caller's current
   * emitted-beat mask. Read-only — does not write to the
   * database.
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const flags = await readNarrativeFlags(ctx.user.id);
    return CROSS_GAME_THREADS.map((thread) => ({
      id: thread.id,
      title: thread.title,
      originGame: thread.originGame,
      participatingGames: thread.participatingGames,
      beats: getOrderedBeats(thread.id).map((b) => ({
        id: b.id,
        label: b.label,
        emittedBy: b.emittedBy,
        order: b.order,
        emitted: flags[flagForBeat(b.id)] === true,
      })),
    }));
  }),

  /**
   * Public: return the registry shape without player state.
   * Useful for external games + documentation tools that need
   * to validate beat ids before emitting.
   */
  registry: publicProcedure.query(() => ({
    threads: CROSS_GAME_THREADS.map((t) => ({
      id: t.id,
      title: t.title,
      originGame: t.originGame,
      participatingGames: t.participatingGames,
      beatIds: t.beats.map((b) => b.id),
    })),
  })),
});
