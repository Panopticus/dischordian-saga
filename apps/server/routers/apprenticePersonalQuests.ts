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
  /** Read the player's progress + the authored stage copy. */
  getStatus: protectedProcedure
    .input(z.object({ memberKey: z.string().min(1).max(64) }))
    .query(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      const { member, archetype } = unwrapMember(state, input.memberKey);
      const progress = await getQuestProgress(ctx.user.id, input.memberKey);
      const identity = APPRENTICE_IDENTITIES[archetype];
      return {
        memberKey: member.id,
        archetype,
        bond: member.loyalty,
        progress,
        chain: identity.personalQuest,
        gates: STAGE_BOND_GATE,
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

  /** Advance 1 → 2 or 2 → 3. */
  advance: protectedProcedure
    .input(
      z.object({
        memberKey: z.string().min(1).max(64),
        fromStage: z.union([z.literal(1), z.literal(2)]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      const { member } = unwrapMember(state, input.memberKey);
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
