/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL ROUTER — Sprint 10
   docs/design/NEXUS_TRIAL_PLAN.md → Server Architecture

   Player-facing endpoints for the live event:
     - status:           current Trial state (public)
     - submitTestimony:  idempotent card-play submission
     - leaderboard:      polled tallies for the panel

   submitTestimony is protected (per-player auth) so a
   malicious client can't impersonate another player's
   weight. Per-IP rate limit covered by the Express gateway.

   Idempotency is provided by the unique
   testimony.idempotencyKey index — the second submit for
   the same (matchId, turnIndex, cardIndex) tuple returns
   { accepted: true, deduplicated: true } without writing.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { testimony } from "../../db/schema";
import { logger } from "../logger";
import {
  getTrialStatus,
  loadActiveTrial,
} from "../services/nexusTrialTickService";
import { getLeaderboard } from "../services/nexusTrialResolverService";
import { cardBuckets } from "@shared/nexusTrial/buckets";

/** Compose the idempotency key from the client-supplied tuple.
 *  Exposed for tests + the client's optimistic-update logic. */
export function makeIdempotencyKey(
  matchId: string,
  turnIndex: number,
  cardIndex: number,
): string {
  return `${matchId}:${turnIndex}:${cardIndex}`;
}

export interface SubmitTestimonyResult {
  accepted: boolean;
  /** True when this tuple already had a testimony row — second
   *  submit is a no-op. */
  deduplicated: boolean;
  /** Buckets the play credited. Useful for client-side animation. */
  buckets: string[];
}

export const nexusTrialRouter = router({
  /** Returns the current Trial's status (or unavailable). Polled by
   *  the Three Clocks panel + the Daily Brief. Public. */
  status: publicProcedure.query(async () => {
    return getTrialStatus();
  }),

  /** Submit a card play as testimony for the active Trial.
   *  Idempotent on (matchId, turnIndex, cardIndex) — second call
   *  with the same tuple returns deduplicated:true. */
  submitTestimony: protectedProcedure
    .input(
      z.object({
        matchId: z.string().min(1).max(64),
        turnIndex: z.number().int().nonnegative().max(1000),
        cardIndex: z.number().int().nonnegative().max(100),
        cardDefId: z.string().min(1).max(128),
        trialCategories: z.array(z.string().max(32)).max(8),
        /** Player's witnessing weight × 100. Clamped server-side
         *  to [0, 1000] (i.e. 0.0×–10.0×). Sprint 9's vote-weight
         *  calculation will compute this from the player's
         *  Witnessing record; for now the client supplies it and
         *  the server bounds-checks. */
        witnessingWeightX100: z.number().int().min(0).max(1000),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<SubmitTestimonyResult> => {
      const db = await getDb();
      const trial = await loadActiveTrial();
      if (!trial || trial.status !== "live") {
        return { accepted: false, deduplicated: false, buckets: [] };
      }
      const buckets = cardBuckets(input.cardDefId);
      const idempotencyKey = makeIdempotencyKey(
        input.matchId,
        input.turnIndex,
        input.cardIndex,
      );

      if (!db) {
        return { accepted: false, deduplicated: false, buckets };
      }

      try {
        // Idempotency check — look up first, insert only if absent.
        // The unique index guards against races; a duplicate-key
        // error means a concurrent submit already inserted.
        const existing = await db
          .select({ id: testimony.id })
          .from(testimony)
          .where(eq(testimony.idempotencyKey, idempotencyKey))
          .limit(1);
        if (existing.length > 0) {
          return { accepted: true, deduplicated: true, buckets };
        }

        await db.insert(testimony).values({
          trialId: trial.id,
          phase: trial.currentPhase,
          idempotencyKey,
          playerId: ctx.user.id,
          cardDefId: input.cardDefId,
          trialCategories: input.trialCategories,
          buckets,
          witnessingWeightX100: input.witnessingWeightX100,
        });

        return { accepted: true, deduplicated: false, buckets };
      } catch (e) {
        // Race: someone inserted between our check and our write.
        // The unique-key error means the dedup happened in flight.
        const msg = (e as Error)?.message ?? "";
        if (/duplicate|unique/i.test(msg)) {
          return { accepted: true, deduplicated: true, buckets };
        }
        logger.error("[NexusTrial] submitTestimony failed:", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "testimony_write_failed",
        });
      }
    }),

  /** Polled leaderboard read. Returns the current per-phase tallies
   *  the Three Clocks panel renders. */
  leaderboard: publicProcedure.query(async () => {
    const trial = await loadActiveTrial();
    if (!trial) return { available: false as const, entries: [] };
    const entries = await getLeaderboard(trial);
    return { available: true as const, entries };
  }),
});
