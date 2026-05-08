// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   APPRENTICE DIALOGUES ROUTER

   BioWare-style branching topics — surfaces the per-archetype
   topics authored in apps/shared/apprenticeDialogues.ts.

   Endpoints:
     - listForMember({ memberKey })
         returns the four topics for the member's archetype +
         each topic's bond gate + the player's progress.
     - getTopic({ memberKey, topicId })
         returns the full topic + path picked so far + the
         choices currently available + sealed state.
     - pickChoice({ memberKey, topicId, choiceId })
         applies a choice. Returns the NPC reply lines, the
         next available choices, and the sealed flag.

   The bond gate (member.loyalty ≥ topic.bondGate) is enforced
   here. The sealed/one-shot rule is enforced in the service.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { loadCrewState } from "../services/crewState";
import {
  APPRENTICE_DIALOGUES,
} from "../../shared/apprenticeDialogues";
import {
  getProgress,
  getTopic,
  listProgressForMember,
  pickChoice,
  resolveCurrentChoices,
} from "../services/apprenticeDialogueService";
import type { ApprenticeArchetype } from "../../shared/apprentices";

const ARCHETYPE_KEYS = Object.keys(APPRENTICE_DIALOGUES) as ApprenticeArchetype[];

async function loadMember(userId: number, memberKey: string) {
  const state = await loadCrewState(userId);
  const member = state?.roster?.members?.find((m) => m.id === memberKey);
  if (!member) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Crew member not found.",
    });
  }
  if (
    !member.archetype ||
    !ARCHETYPE_KEYS.includes(member.archetype as ApprenticeArchetype)
  ) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Dialogues are authored per apprentice archetype.",
    });
  }
  return { member, archetype: member.archetype as ApprenticeArchetype };
}

export const apprenticeDialoguesRouter = router({
  /** Returns the four topics for this member's archetype + per-topic
   *  unlock gate + the player's progress on each. */
  listForMember: protectedProcedure
    .input(z.object({ memberKey: z.string().min(1).max(64) }))
    .query(async ({ ctx, input }) => {
      const { member, archetype } = await loadMember(ctx.user.id, input.memberKey);
      const set = APPRENTICE_DIALOGUES[archetype];
      const topics = [set.past, set.calling, set.mortality, set.us];
      const progress = await listProgressForMember(ctx.user.id, input.memberKey);
      return topics.map((topic) => ({
        id: topic.id,
        kind: topic.kind,
        title: topic.title,
        hook: topic.hook,
        bondGate: topic.bondGate,
        unlocked: member.loyalty >= topic.bondGate,
        progress: progress[topic.id] ?? null,
      }));
    }),

  /** Read a single topic + path so far + next available choices. */
  getTopic: protectedProcedure
    .input(
      z.object({
        memberKey: z.string().min(1).max(64),
        topicId: z.string().min(1).max(64),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { member } = await loadMember(ctx.user.id, input.memberKey);
      const topic = getTopic(input.topicId);
      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Topic ${input.topicId} not found.`,
        });
      }
      if (member.loyalty < topic.bondGate) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Bond ${member.loyalty} < ${topic.bondGate}. Build the relationship first.`,
        });
      }
      const progress = await getProgress(ctx.user.id, input.memberKey, input.topicId);
      const resolved = resolveCurrentChoices(topic, progress.pathChoices);
      return {
        topic,
        progress,
        pickedSoFar: resolved.pickedSoFar,
        nextChoices: resolved.nextChoices,
        sealed: resolved.sealed,
      };
    }),

  /** Apply a player choice. Returns the NPC reply + next state. */
  pickChoice: protectedProcedure
    .input(
      z.object({
        memberKey: z.string().min(1).max(64),
        topicId: z.string().min(1).max(64),
        choiceId: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { member } = await loadMember(ctx.user.id, input.memberKey);
      const topic = getTopic(input.topicId);
      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Topic ${input.topicId} not found.`,
        });
      }
      if (member.loyalty < topic.bondGate) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Bond ${member.loyalty} < ${topic.bondGate}.`,
        });
      }
      const result = await pickChoice(
        ctx.user.id,
        input.memberKey,
        input.topicId,
        input.choiceId,
      );
      if (!result.ok) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: result.reason,
        });
      }
      return {
        ok: true,
        pickedChoice: result.pickedChoice,
        progress: result.progress,
        nextChoices: result.nextChoices,
        sealed: result.sealed,
      };
    }),
});
