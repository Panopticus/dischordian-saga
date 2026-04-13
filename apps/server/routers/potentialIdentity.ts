/* ═══════════════════════════════════════════════════════
   POTENTIAL IDENTITY ROUTER

   Server-side entry points for the Potential Identity System:
     • completeHorrorReveal  — records the origin reveal conversation
     • getRevealState        — returns whether the player has seen the reveal
     • listFactions          — proxies the shared faction data
     • getUnityState         — proxies unityMeterService
     • joinFaction           — delegates to unityMeterService

   Narrative flags live on `userProgress.gameData.narrativeFlags` and are
   set in-line here as well as (for the Living Universe side) via the
   ripple engine.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { ripple } from "../services/rippleEngine";
import type {
  HorrorRevealCompletedEvent,
} from "../services/rippleEngine";
import {
  POTENTIAL_ORIGIN_REVEAL_OUTCOMES,
  POTENTIAL_ORIGIN_REVEAL_FLAGS,
  POTENTIAL_ORIGIN_REVEAL_OPTION_IDS,
} from "@shared/potentialOriginReveal";
import { logger } from "../logger";

const OPTION_ID_VALUES = POTENTIAL_ORIGIN_REVEAL_OPTION_IDS as readonly string[];

/**
 * Set or merge narrative flags on a user's gameData blob. Does not
 * overwrite unrelated keys.
 */
async function setNarrativeFlags(
  userId: number,
  flagsToSet: string[],
): Promise<Record<string, boolean>> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  if (!progress) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Player progress not found",
    });
  }

  const gameData = (progress.gameData || {}) as Record<string, unknown>;
  const currentFlags = (gameData.narrativeFlags || {}) as Record<string, boolean>;
  for (const flag of flagsToSet) {
    currentFlags[flag] = true;
  }
  gameData.narrativeFlags = currentFlags;

  await db
    .update(userProgress)
    .set({ gameData: gameData as Record<string, unknown> })
    .where(eq(userProgress.userId, userId));

  return currentFlags;
}

/**
 * Award light energy to a user. Light energy lives in the same progressData
 * blob; the player-visible currency is tracked by the existing economy
 * service. We increment a `lightEnergy` field on gameData and leave any
 * richer accounting to future economy refactors.
 */
async function awardLightEnergy(userId: number, amount: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  if (!progress) return 0;

  const gameData = (progress.gameData || {}) as Record<string, unknown>;
  const current = typeof gameData.lightEnergy === "number" ? (gameData.lightEnergy as number) : 0;
  const next = current + amount;
  gameData.lightEnergy = next;

  await db
    .update(userProgress)
    .set({ gameData: gameData as Record<string, unknown> })
    .where(eq(userProgress.userId, userId));

  return next;
}

export const potentialIdentityRouter = router({
  /**
   * Completes the Horror Reveal conversation. Validates the option id against
   * the canonical wheel, persists flags, awards light energy, and fires the
   * `horror_reveal_completed` ripple so Living Universe consumers can react.
   */
  completeHorrorReveal: protectedProcedure
    .input(
      z.object({
        optionId: z.string(),
        skillCheckPassed: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      if (!OPTION_ID_VALUES.includes(input.optionId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown horror reveal option: ${input.optionId}`,
        });
      }

      const outcome = POTENTIAL_ORIGIN_REVEAL_OUTCOMES[input.optionId];
      if (!outcome) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No outcome configured for option: ${input.optionId}`,
        });
      }

      // Idempotency: if the user already has `horror_reveal_seen`, don't
      // re-award light energy or re-fire the ripple. Return current state.
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [existing] = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .limit(1);
      const existingFlags =
        (((existing?.gameData || {}) as Record<string, unknown>).narrativeFlags ||
          {}) as Record<string, boolean>;

      if (existingFlags[POTENTIAL_ORIGIN_REVEAL_FLAGS.seen]) {
        return {
          alreadyCompleted: true,
          flags: existingFlags,
          lightEnergy: ((existing?.gameData || {}) as Record<string, unknown>)
            .lightEnergy as number | undefined,
        };
      }

      const flags = await setNarrativeFlags(userId, outcome.flagsToSet);
      const lightEnergy = await awardLightEnergy(userId, outcome.lightEnergy);

      try {
        await ripple.emit("horror_reveal_completed", {
          userId,
          optionId: input.optionId,
          skillCheckPassed: input.skillCheckPassed,
          lightEnergyAwarded: outcome.lightEnergy,
          unityContributionSource: outcome.unityContributionSource,
          loredexUnlock: outcome.loredexUnlock,
        } as HorrorRevealCompletedEvent);
      } catch (err) {
        logger.error("[potentialIdentity] horror_reveal_completed ripple failed", err);
      }

      return {
        alreadyCompleted: false,
        flags,
        lightEnergy,
        optionId: input.optionId,
        lightEnergyAwarded: outcome.lightEnergy,
        loredexUnlock: outcome.loredexUnlock ?? null,
      };
    }),

  /** Returns whether the player has completed the horror reveal and what flags they hold. */
  getRevealState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { seen: false, flags: {} as Record<string, boolean> };
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);
    if (!progress) return { seen: false, flags: {} as Record<string, boolean> };
    const gameData = (progress.gameData || {}) as Record<string, unknown>;
    const flags = (gameData.narrativeFlags || {}) as Record<string, boolean>;
    return {
      seen: Boolean(flags[POTENTIAL_ORIGIN_REVEAL_FLAGS.seen]),
      dossierUnlocked: Boolean(flags[POTENTIAL_ORIGIN_REVEAL_FLAGS.dossier]),
      spyPreempt: Boolean(flags[POTENTIAL_ORIGIN_REVEAL_FLAGS.spyPreempt]),
      lightEnergy: (gameData.lightEnergy as number | undefined) ?? 0,
      flags,
    };
  }),
});
