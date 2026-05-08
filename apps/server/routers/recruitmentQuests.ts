// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   RECRUITMENT QUESTS ROUTER

   Surfaces the per-NPC chains authored in
   apps/shared/recruitmentQuests.ts:

     - getChain({ npcKey })
         returns the full chain definition + the player's
         current progress + the visible stage. UI uses this
         as a single read.
     - openChain({ npcKey })
         creates the progress row at the chain's start stage.
         Refuses if the chain's openGate is unsatisfied.
     - makeChoice({ npcKey, choiceId })
         applies a choice. Returns the chosen RecruitmentChoice
         (with NPC reply lines) and the next visible stage (or
         the terminal outcome if the chain ended).
     - reset({ npcKey })  [DEV ONLY behind a flag — see below]

   The recruit gate now lives in npcRecruit.recruit, which
   reads the progress row and refuses unless outcome ∈
   { recruited_loyal, recruited_tense }.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import {
  RECRUITMENT_CHAINS,
  getRecruitmentChain,
  getStage,
} from "../../shared/recruitmentQuests";
import {
  RESURRECTABLE_NPC_KEYS,
  type ResurrectableNpcKey,
} from "../../shared/resurrectionProtocols";
import {
  checkOpenGate,
  getProgress,
  makeChoice,
  openChain,
} from "../services/recruitmentQuestService";

const npcKeyEnum = z.enum(RESURRECTABLE_NPC_KEYS);

/** Read the player's narrative flags. The recruitment chain's openGate
 *  reads this set. For now we use the user-progress narrative-flags
 *  blob; real flag plumbing lives elsewhere and can be plugged in here. */
async function readPlayerFlags(_userId: number): Promise<ReadonlySet<string>> {
  // Hook point — when the canonical flag store is wired up we replace
  // this with a real lookup. For now: empty set (no flags). Akai's
  // openGate will refuse until the necromancer event sets the flag.
  return new Set<string>();
}

export const recruitmentQuestsRouter = router({
  /** List every recruitable NPC + the player's progress + the open-gate
   *  status. Used by the recruit panel header. */
  listChains: protectedProcedure.query(async ({ ctx }) => {
    const flags = await readPlayerFlags(ctx.user.id);
    const out: Array<{
      npcKey: ResurrectableNpcKey;
      displayName: string;
      briefing: string;
      gateOpen: boolean;
      gateReason?: string;
      progress: Awaited<ReturnType<typeof getProgress>>;
    }> = [];
    for (const npcKey of RESURRECTABLE_NPC_KEYS) {
      const chain = RECRUITMENT_CHAINS[npcKey];
      const gate = checkOpenGate(chain, flags);
      const progress = await getProgress(ctx.user.id, npcKey);
      out.push({
        npcKey,
        displayName: chain.displayName,
        briefing: chain.briefing,
        gateOpen: gate.ok,
        gateReason: gate.ok ? undefined : gate.reason,
        progress,
      });
    }
    return out;
  }),

  /** Read one chain + progress + the visible stage. */
  getChain: protectedProcedure
    .input(z.object({ npcKey: npcKeyEnum }))
    .query(async ({ ctx, input }) => {
      const chain = getRecruitmentChain(input.npcKey);
      const progress = await getProgress(ctx.user.id, input.npcKey);
      const flags = await readPlayerFlags(ctx.user.id);
      const gate = checkOpenGate(chain, flags);
      const visibleStageId = progress.currentStageId ?? chain.startStageId;
      const visibleStage = getStage(chain, visibleStageId);
      return {
        chain,
        progress,
        gate: { ok: gate.ok, reason: gate.ok ? undefined : gate.reason },
        visibleStage: visibleStage ?? null,
      };
    }),

  /** Open the chain at its start stage. */
  open: protectedProcedure
    .input(z.object({ npcKey: npcKeyEnum }))
    .mutation(async ({ ctx, input }) => {
      const chain = getRecruitmentChain(input.npcKey);
      const flags = await readPlayerFlags(ctx.user.id);
      const gate = checkOpenGate(chain, flags);
      if (!gate.ok) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: gate.reason,
        });
      }
      const progress = await openChain(ctx.user.id, input.npcKey);
      return { ok: true, progress };
    }),

  /** Apply a choice. Returns the NPC reply lines and the next stage. */
  makeChoice: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeyEnum,
        choiceId: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await makeChoice(ctx.user.id, input.npcKey, input.choiceId);
      if (!result.ok) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: result.reason,
        });
      }
      const chain = getRecruitmentChain(input.npcKey);
      const nextStage =
        result.progress.currentStageId !== null
          ? getStage(chain, result.progress.currentStageId) ?? null
          : null;
      return {
        ok: true,
        choice: result.choice,
        progress: result.progress,
        terminal: result.terminal,
        nextStage,
      };
    }),
});
