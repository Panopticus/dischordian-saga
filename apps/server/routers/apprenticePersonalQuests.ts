// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   APPRENTICE PERSONAL QUESTS — router

   Surfaces the 3-stage personal quest authored in
   apps/shared/apprenticeIdentity.ts:APPRENTICE_IDENTITIES.

   Endpoints:
     - getStatus({ memberKey })
         returns the persisted progress + the authored stage
         copy so the UI can render without a second lookup.
     - open({ memberKey })
         opens the quest at stage 1 (gated on bond >= 30).
     - advance({ memberKey, fromStage })
         stage 1 → 2 (gated on bond >= 55), or 2 → 3 (bond >= 80).
     - resolve({ memberKey, choice })
         locks in stage-3 outcome ("deepened" → romance-lockable,
         "broken" → betrayal descent seeded).

   Bond gating reads from the player's NPC-imprint trust map for
   recruited NPCs and from the crew-member loyalty value for
   apprentices. Both are clamped 0..100 and compared against the
   stage thresholds.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { loadCrewState } from "../services/crewState";
import {
  advanceStage,
  getQuestProgress,
  openQuest,
  resolveBreakingPoint,
} from "../services/apprenticePersonalQuestService";
import { APPRENTICE_IDENTITIES } from "../../shared/apprenticeIdentity";
import type { ApprenticeArchetype } from "../../shared/apprentices";
import { evaluateAllSubtasks } from "../services/apprenticeQuestSubtaskService";

const ARCHETYPE_KEYS = Object.keys(APPRENTICE_IDENTITIES) as ApprenticeArchetype[];

const STAGE_BOND_GATE = {
  open: 30,
  advance_to_2: 55,
  advance_to_3: 80,
} as const;

function unwrapMember(state: Awaited<ReturnType<typeof loadCrewState>>, memberKey: string) {
  const member = state?.roster?.members?.find((m) => m.id === memberKey);
  if (!member) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Crew member not found in active roster.",
    });
  }
  if (!member.archetype || !ARCHETYPE_KEYS.includes(member.archetype as ApprenticeArchetype)) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Personal quests are authored per-archetype; member has no recognised archetype.",
    });
  }
  return { member, archetype: member.archetype as ApprenticeArchetype };
}

export const apprenticePersonalQuestsRouter = router({
  /** Read the player's progress + the authored stage copy. Returns
   *  per-stage sub-task completion state so the panel can render
   *  the per-stage checklist. */
  getStatus: protectedProcedure
    .input(z.object({ memberKey: z.string().min(1).max(64) }))
    .query(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      const { member, archetype } = unwrapMember(state, input.memberKey);
      const progress = await getQuestProgress(ctx.user.id, input.memberKey);
      const identity = APPRENTICE_IDENTITIES[archetype];
      // Evaluate subtask completion for each stage. The panel needs
      // all three stages so it can render the checklist for the
      // current stage and a faded preview for upcoming stages.
      const subStage1 = identity.personalQuest.stage1.subtasks ?? [];
      const subStage2 = identity.personalQuest.stage2.subtasks ?? [];
      const subStage3 = identity.personalQuest.stage3.subtasks ?? [];
      const [s1, s2, s3] = await Promise.all([
        evaluateAllSubtasks(ctx.user.id, member.id, subStage1),
        evaluateAllSubtasks(ctx.user.id, member.id, subStage2),
        evaluateAllSubtasks(ctx.user.id, member.id, subStage3),
      ]);
      return {
        memberKey: member.id,
        archetype,
        bond: member.loyalty,
        progress,
        chain: identity.personalQuest,
        gates: STAGE_BOND_GATE,
        subtasks: {
          stage1: { refs: subStage1, completed: s1.completed, allComplete: s1.allComplete },
          stage2: { refs: subStage2, completed: s2.completed, allComplete: s2.allComplete },
          stage3: { refs: subStage3, completed: s3.completed, allComplete: s3.allComplete },
        },
      };
    }),

  /** Open the quest at stage 1. */
  open: protectedProcedure
    .input(z.object({ memberKey: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      const { member, archetype } = unwrapMember(state, input.memberKey);
      if (member.loyalty < STAGE_BOND_GATE.open) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Bond ${member.loyalty} < ${STAGE_BOND_GATE.open}. Build the relationship first.`,
        });
      }
      const progress = await openQuest(ctx.user.id, member.id, archetype);
      return { ok: true, progress };
    }),

  /** Advance 1 → 2 or 2 → 3. Bond gate AND all sub-tasks of the
   *  current stage must be complete. */
  advance: protectedProcedure
    .input(
      z.object({
        memberKey: z.string().min(1).max(64),
        fromStage: z.union([z.literal(1), z.literal(2)]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      const { member, archetype } = unwrapMember(state, input.memberKey);
      const requiredBond =
        input.fromStage === 1
          ? STAGE_BOND_GATE.advance_to_2
          : STAGE_BOND_GATE.advance_to_3;
      if (member.loyalty < requiredBond) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Bond ${member.loyalty} < ${requiredBond}. The next stage needs deeper trust.`,
        });
      }
      // Sub-task gate — every sub-task of the *current* stage must be
      // complete before the player can advance past it.
      const identity = APPRENTICE_IDENTITIES[archetype];
      const stageKey = input.fromStage === 1 ? "stage1" : "stage2";
      const subs = identity.personalQuest[stageKey].subtasks ?? [];
      const evalRes = await evaluateAllSubtasks(ctx.user.id, member.id, subs);
      if (!evalRes.allComplete) {
        const firstIncomplete = subs[evalRes.completed.findIndex((c) => !c)];
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: firstIncomplete
            ? `Sub-task not yet complete: ${firstIncomplete.label}`
            : `Stage ${input.fromStage} sub-tasks are not yet complete.`,
        });
      }
      const progress = await advanceStage(ctx.user.id, member.id, input.fromStage);
      return { ok: true, progress };
    }),

  /** Resolve the stage-3 breaking point. */
  resolve: protectedProcedure
    .input(
      z.object({
        memberKey: z.string().min(1).max(64),
        choice: z.enum(["deepened", "broken"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      unwrapMember(state, input.memberKey);
      const progress = await resolveBreakingPoint(
        ctx.user.id,
        input.memberKey,
        input.choice,
      );
      if (progress.resolution !== input.choice) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Quest is not at stage 3, or already resolved.",
        });
      }
      return { ok: true, progress };
    }),
});
