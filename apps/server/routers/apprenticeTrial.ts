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
import {
  loadCrewState,
  saveCrewState,
  addCrewMemberToState,
} from "../services/crewState";
import { instantiateApprenticeAsCrewMember } from "../../shared/apprenticeToCrew";
import type { ApprenticeArchetype } from "../../shared/apprentices";
import { writeNarrativeFlag } from "../services/narrativeFlagService";

const APPRENTICE_ARCHETYPE_KEYS: ReadonlyArray<ApprenticeArchetype> = [
  "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
  "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
];

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

      /* On graduation: instantiate the apprentice as a crew member with
       * productionPath="trained". The apprentice now lives in the
       * unified crew system — banter, missions, romance, gifts, personal
       * quests all flow through `crewMembers`. */
      let crewInstantiated = false;
      if (
        input.graduated &&
        APPRENTICE_ARCHETYPE_KEYS.includes(input.archetype as ApprenticeArchetype)
      ) {
        try {
          const state = await loadCrewState(ctx.user.id);
          if (state) {
            const member = instantiateApprenticeAsCrewMember({
              name: input.apprenticeName,
              archetype: input.archetype as ApprenticeArchetype,
              gender: "non-binary",
              trialDaysSurvived: input.daySurvived,
              now: Date.now(),
            });
            const next = addCrewMemberToState(state, member);
            if (next !== state) {
              await saveCrewState(ctx.user.id, next);
              crewInstantiated = true;
            }
          }
        } catch {
          // Best-effort — title grant still succeeded.
        }
      }

      // audit/10.F5 — graduation also writes sticky narrative flags so
      // the variant resolver / companion comments / ask topics can
      // reference the player's apprentice journey without re-querying
      // the completions table. Idempotent (unique index absorbs
      // re-writes from cohort replay).
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

      // Nemesis hook — the cohort outcome is the canonical
      // breaking-point resolution. Graduation → whisper blocked;
      // failure → whisper landed (if a plan was active). Fire
      // against the same cohort the trial completed (cohortNumber
      // pins the lookup so a player who has multiple Nemeses
      // gets the right one).
      try {
        const { apprenticeCorruptionOutcome } = await import(
          "../../shared/nemesisIntegration"
        );
        const { recordSurfaceEvent } = await import(
          "../services/nemesisEncounterService"
        );
        const record = apprenticeCorruptionOutcome({
          trialDay: input.daySurvived,
          breakingPointFear: input.graduated
            ? "survived"
            : "broke",
          whisperLanded: !input.graduated,
          hadActivePlanToDisrupt: true,
        });
        recordSurfaceEvent({
          userId: ctx.user.id,
          encounterKind: record.encounterKind,
          source: "apprentice",
          detail: record.detail,
          disruptPlanKind: record.disruptPlanKind,
          cohortNumber: input.cohortNumber,
        }).catch((e) => console.warn("[Nemesis] apprentice hook failed", e));
      } catch (nemesisErr) {
        console.warn("[Nemesis] apprentice hook import failed", nemesisErr);
      }

      return { ok: true, titlesGranted: granted, crewInstantiated };
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
