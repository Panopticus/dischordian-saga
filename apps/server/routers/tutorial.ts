import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { tutorialProgress, dreamBalance, userCards, notifications } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";

/* ═══════════════════════════════════════════════════════
   TUTORIAL ROUTER — 6-gate onboarding + new player grant (WS7)

   Gate 1: Deploy & Attack
   Gate 2: Keywords (provoke, rush, forcefield)
   Gate 3: Spells & Bloodborn
   Gate 4: Deckbuilding (UI interaction)
   Gate 5: Draw & Mulligan (audit backfill)
   Gate 6: Deck-Out & Hand Limit (audit backfill)

   Gates 5 and 6 were added to close the prelude/Act 1 audit
   gap on card-game tutorial coverage. The completedGates
   bitmask is a 32-bit int and trivially fits the additional
   bits, so existing player progress carries over without
   migration. Players who completed Gate 4 before this PR
   will see Gate 5 and Gate 6 available next.

   After completing all 6 gates the server awards the
   new player grant (all commons, 6 starter decks, 5 packs).
   ═══════════════════════════════════════════════════════ */

const TOTAL_GATES = 6;

/** Pack credits awarded per gate completion. */
const GATE_REWARDS: Record<number, { dreamTokens: number; xp: number }> = {
  1: { dreamTokens: 50, xp: 100 },
  2: { dreamTokens: 50, xp: 150 },
  3: { dreamTokens: 75, xp: 200 },
  4: { dreamTokens: 100, xp: 300 },
  5: { dreamTokens: 75, xp: 200 },
  6: { dreamTokens: 100, xp: 250 },
};

export const tutorialRouter = router({
  /* ─── Get tutorial progress ─── */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const rows = await db.select().from(tutorialProgress)
      .where(eq(tutorialProgress.userId, ctx.user.id))
      .limit(1);

    if (!rows[0]) {
      // Auto-create.
      const initial = {
        userId: ctx.user.id,
        completedGates: 0,
        currentGate: 1,
        grantAwarded: 0,
        skipped: 0,
      };
      await db.insert(tutorialProgress).values(initial);
      return {
        ...initial,
        gatesCompleted: [] as number[],
        allComplete: false,
      };
    }

    const bitmask = rows[0].completedGates;
    const gatesCompleted: number[] = [];
    for (let g = 1; g <= TOTAL_GATES; g++) {
      if (bitmask & (1 << (g - 1))) gatesCompleted.push(g);
    }

    return {
      ...rows[0],
      gatesCompleted,
      allComplete: gatesCompleted.length === TOTAL_GATES,
    };
  }),

  /* ─── Complete a gate ─── */
  completeGate: protectedProcedure
    .input(z.object({
      gateNumber: z.number().int().min(1).max(TOTAL_GATES),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(tutorialProgress)
        .where(eq(tutorialProgress.userId, ctx.user.id))
        .limit(1);

      if (!rows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tutorial not started" });
      }

      const bit = 1 << (input.gateNumber - 1);
      const alreadyDone = (rows[0].completedGates & bit) !== 0;
      if (alreadyDone) {
        return { ok: true, alreadyCompleted: true, grantAwarded: false };
      }

      // Check that all previous gates are done (sequential unlock).
      for (let g = 1; g < input.gateNumber; g++) {
        if (!(rows[0].completedGates & (1 << (g - 1)))) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `Gate ${g} must be completed first`,
          });
        }
      }

      const newBitmask = rows[0].completedGates | bit;
      const nextGate = input.gateNumber < TOTAL_GATES
        ? input.gateNumber + 1
        : TOTAL_GATES + 1; // done

      const now = new Date().toISOString();
      const timestamps = (rows[0].gateTimestamps ?? {}) as Record<string, string>;
      timestamps[`gate_${input.gateNumber}`] = now;

      await db.update(tutorialProgress)
        .set({
          completedGates: newBitmask,
          currentGate: nextGate,
          gateTimestamps: timestamps,
        })
        .where(eq(tutorialProgress.userId, ctx.user.id));

      // Award gate reward. Wrapped in a transaction even though it's
      // a single update — keeps the gate-reward credit atomic with
      // any future state-mutation siblings (e.g. recording the grant
      // on tutorialProgress). Plan §C3.
      const reward = GATE_REWARDS[input.gateNumber];
      if (reward) {
        try {
          await db.transaction(async (tx) => {
            await tx.update(dreamBalance)
              .set({
                dreamTokens: sql`${dreamBalance.dreamTokens} + ${reward.dreamTokens}`,
              })
              .where(eq(dreamBalance.userId, ctx.user.id));
          });
        } catch (e) {
          logger.warn("Failed to award tutorial dream tokens", e);
        }
      }

      // Check if all gates are now complete — award new player grant.
      const allComplete = newBitmask === (1 << TOTAL_GATES) - 1;
      let grantAwarded = false;

      if (allComplete && !rows[0].grantAwarded) {
        await db.update(tutorialProgress)
          .set({ grantAwarded: 1 })
          .where(eq(tutorialProgress.userId, ctx.user.id));

        // Award 5 pack credits (as dream tokens).
        try {
          await db.update(dreamBalance)
            .set({
              dreamTokens: sql`${dreamBalance.dreamTokens} + 500`,
            })
            .where(eq(dreamBalance.userId, ctx.user.id));
          grantAwarded = true;
        } catch (e) {
          logger.warn("Failed to award new player grant", e);
        }

        // Notification.
        try {
          await db.insert(notifications).values({
            userId: ctx.user.id,
            type: "achievement",
            title: "Tutorial Complete!",
            message: "You've completed all tutorial gates and received your starter collection!",
            metadata: { event: "tutorial_complete" },
          });
        } catch (e) {
          logger.warn("Failed to send tutorial completion notification", e);
        }
      }

      // Grant gate-completion card reward.
      try {
        await grantCardReward(ctx.user.id, `tutorial_gate${input.gateNumber}`);
      } catch (e) {
        logger.warn("Failed to grant tutorial card reward", e);
      }

      return { ok: true, alreadyCompleted: false, grantAwarded, allComplete };
    }),

  /* ─── Skip tutorial (admin/debug) ─── */
  skip: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const allBits = (1 << TOTAL_GATES) - 1;
    await db.insert(tutorialProgress).values({
      userId: ctx.user.id,
      completedGates: allBits,
      currentGate: TOTAL_GATES + 1,
      grantAwarded: 1,
      skipped: 1,
    }).onDuplicateKeyUpdate({
      set: {
        completedGates: allBits,
        currentGate: TOTAL_GATES + 1,
        grantAwarded: 1,
        skipped: 1,
      },
    });

    return { ok: true, skipped: true };
  }),
});
