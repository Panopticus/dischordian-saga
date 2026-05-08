// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   HELLBOX ROUTER — Apprentice-only one-shot resurrection.

   Restores a fallen apprentice (productionPath="trained")
   that has not previously been Hellbox-restored. Refuses
   recruited NPCs and bred crew.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  loadCrewState,
  saveCrewState,
  addCrewMemberToState,
} from "../services/crewState";
import { eligibleForHellbox, restoreApprentice, HELLBOX_COST } from "../../shared/hellboxClone";
import { applyBloodWeaveDelta } from "../services/bloodWeaveService";

export const hellboxRouter = router({
  /** Returns the eligibility result for a given fallen member. */
  checkEligibility: protectedProcedure
    .input(z.object({ memberKey: z.string() }))
    .query(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      if (!state) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Crew state missing",
        });
      }
      const fallen = state.roster.deceased.find((m) => m.id === input.memberKey);
      if (!fallen) {
        return {
          eligible: false as const,
          reason: "Member not found in the deceased roster.",
        };
      }
      return eligibleForHellbox(fallen);
    }),

  /** Restore the apprentice. Caller is responsible for spending the
   *  cost (this endpoint just verifies eligibility and writes back). */
  restore: protectedProcedure
    .input(z.object({ memberKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      if (!state) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      const fallen = state.roster.deceased.find((m) => m.id === input.memberKey);
      if (!fallen) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const e = eligibleForHellbox(fallen);
      if (!e.eligible) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: e.reason,
        });
      }
      const restored = restoreApprentice(fallen, Date.now());
      // Move out of deceased, into living.
      const nextState = addCrewMemberToState(
        {
          ...state,
          roster: {
            ...state.roster,
            deceased: state.roster.deceased.filter(
              (m) => m.id !== input.memberKey,
            ),
          },
        },
        restored,
      );
      await saveCrewState(ctx.user.id, nextState);

      /* Stage 3 — Blood Weave attunement. Pushes the alignment +1 and
       * surfaces any newly-unlocked Hierarchy / Game-Master loredex
       * entries. Best-effort — restoration succeeded even if the
       * alignment write fails (it's a tracker, not a gate). */
      let bloodWeave: Awaited<ReturnType<typeof applyBloodWeaveDelta>> | null = null;
      try {
        bloodWeave = await applyBloodWeaveDelta(
          ctx.user.id,
          "hellbox_restoration",
          { alsoCountResurrection: true },
        );
      } catch {
        // Best-effort.
      }

      return {
        ok: true,
        member: restored,
        cost: HELLBOX_COST,
        bloodWeave: bloodWeave
          ? {
              alignmentValue: bloodWeave.state.alignmentValue,
              newlyUnlocked: bloodWeave.newlyUnlocked,
              bandBefore: bloodWeave.bandBefore,
              bandAfter: bloodWeave.bandAfter,
              bandCrossed: bloodWeave.bandCrossed,
            }
          : null,
      };
    }),
});
