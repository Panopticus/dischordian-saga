/* ═══════════════════════════════════════════════════════
   APPRENTICE TRIAL ROUTER — server-side cohort completion
   record. The cohort sim itself runs client-side
   (apps/shared/pvpCohorts.ts); the client posts the result
   here when a cohort concludes so titles can grant.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { apprenticeTrialCompletions } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { awardEligibleTitles } from "../services/titleService";
import { writeNarrativeFlag } from "../services/narrativeFlagService";

export const apprenticeTrialRouter = router({
  /** Record a cohort completion — called by client when a cohort concludes. */
  recordCompletion: protectedProcedure
    .input(z.object({
      cohortNumber: z.number().int().min(1),
      apprenticeName: z.string().min(1).max(96),
      archetype: z.string().min(1).max(32),
      graduated: z.boolean(),
      daySurvived: z.number().int().min(0).max(28),
      cohortSize: z.number().int().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      try {
        await db
          .insert(apprenticeTrialCompletions)
          .values({
            userId: ctx.user.id,
            cohortNumber: input.cohortNumber,
            apprenticeName: input.apprenticeName,
            archetype: input.archetype,
            graduated: input.graduated ? 1 : 0,
            daySurvived: input.daySurvived,
            cohortSize: input.cohortSize,
          })
          .onDuplicateKeyUpdate({
            // Idempotent: a re-submitted completion just confirms the
            // existing row. Don't overwrite earlier graduation status.
            set: { recordedAt: sql`recorded_at` },
          });
      } catch (err) {
        // Already recorded — fine.
      }
      // Title grant pipeline runs even if the row was a no-op insert.
      const granted = await awardEligibleTitles(ctx.user.id, {
        kind: "apprentice_trial_completed",
        userId: ctx.user.id,
        cohortNumber: input.cohortNumber,
        graduated: input.graduated,
        daySurvived: input.daySurvived,
      });

      // audit/10.F5 — graduation now writes a sticky narrative
      // flag so the variant resolver / companion comments / ask
      // topics can reference the player's apprentice journey
      // without re-querying the completions table. Idempotent
      // (unique index absorbs re-writes from cohort replay).
      if (input.graduated) {
        await writeNarrativeFlag(
          ctx.user.id,
          `apprentice_trial_completed_${input.archetype}`,
          "apprentice_trial",
        );
        await writeNarrativeFlag(
          ctx.user.id,
          "apprentice_trial_graduated_any",
          "apprentice_trial",
        );
      }
      return { ok: true, titlesGranted: granted };
    }),

  /** Recent cohort completions for a user. */
  getMyCompletions: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(apprenticeTrialCompletions)
        .where(eq(apprenticeTrialCompletions.userId, ctx.user.id))
        .orderBy(desc(apprenticeTrialCompletions.recordedAt))
        .limit(input?.limit ?? 20);
    }),

  /** Aggregate stats: attended + graduated counts. */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { attended: 0, graduated: 0 };
    const rows = await db
      .select()
      .from(apprenticeTrialCompletions)
      .where(eq(apprenticeTrialCompletions.userId, ctx.user.id));
    return {
      attended: rows.length,
      graduated: rows.filter((r) => r.graduated === 1).length,
    };
  }),
});
