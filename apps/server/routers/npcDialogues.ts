// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   NPC DIALOGUES ROUTER

   Mirror of apprenticeDialogues for the 12 named NPCs
   authored in apps/shared/npcDialogues.ts. Storage is
   apprentice_dialogue_progress with the npcKey in the
   memberKey column (topic ids are unique across registries).

   Endpoints:
     - listForNpc({ npcKey })
     - getTopic({ npcKey, topicId })
     - pickChoice({ npcKey, topicId, choiceId })

   Bond gating: tier-2 NPCs are recruitable so their bond is
   read from the recruited crew member's loyalty when present;
   otherwise the gate is treated as soft (the player can browse
   topics whose bondGate is at or below 25). Tier-3 cosmic NPCs
   require player progression flags before topics surface;
   surface enforcement of those flags lives in the UI panel.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import {
  NPC_DIALOGUES,
} from "../../shared/npcDialogues";
import { NAMED_NPC_KEYS, NPC_IDENTITIES, type NamedNpcKey } from "../../shared/npcIdentity";
import {
  getNpcProgress,
  getNpcTopic,
  listNpcProgress,
  pickNpcChoice,
  resolveNpcCurrentChoices,
} from "../services/npcDialogueService";
import { aggregateWitnessLedger } from "../../shared/tradeEmpire/witnessLedger";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { eq } from "drizzle-orm";

const NPC_KEYS_SET = new Set<string>(NAMED_NPC_KEYS);

function ensureNpcKey(npcKey: string): NamedNpcKey {
  if (!NPC_KEYS_SET.has(npcKey)) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `NPC ${npcKey} not found.`,
    });
  }
  return npcKey as NamedNpcKey;
}

export const npcDialoguesRouter = router({
  /** List the four topics for one NPC + per-topic progress. */
  listForNpc: protectedProcedure
    .input(z.object({ npcKey: z.string().min(1).max(32) }))
    .query(async ({ ctx, input }) => {
      const key = ensureNpcKey(input.npcKey);
      const set = NPC_DIALOGUES[key];
      const identity = NPC_IDENTITIES[key];
      const topics = [set.past, set.calling, set.mortality, set.us];
      const progress = await listNpcProgress(ctx.user.id, key);
      return {
        npcKey: key,
        displayName: identity.displayName,
        epithet: identity.epithet,
        tier: identity.tier,
        signatureLine: identity.signatureLine,
        topics: topics.map((t) => ({
          id: t.id,
          kind: t.kind,
          title: t.title,
          hook: t.hook,
          bondGate: t.bondGate,
          progress: progress[t.id] ?? null,
        })),
      };
    }),

  /** Read a single topic + path so far + next available choices. */
  getTopic: protectedProcedure
    .input(
      z.object({
        npcKey: z.string().min(1).max(32),
        topicId: z.string().min(1).max(64),
      }),
    )
    .query(async ({ ctx, input }) => {
      const key = ensureNpcKey(input.npcKey);
      const topic = getNpcTopic(input.topicId);
      if (!topic || topic.npcKey !== key) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Topic ${input.topicId} not found for ${key}.`,
        });
      }
      const progress = await getNpcProgress(ctx.user.id, key, input.topicId);
      const resolved = resolveNpcCurrentChoices(topic, progress.pathChoices);
      return {
        topic,
        progress,
        pickedSoFar: resolved.pickedSoFar,
        nextChoices: resolved.nextChoices,
        sealed: resolved.sealed,
      };
    }),

  /** Apply a player choice. */
  pickChoice: protectedProcedure
    .input(
      z.object({
        npcKey: z.string().min(1).max(32),
        topicId: z.string().min(1).max(64),
        choiceId: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const key = ensureNpcKey(input.npcKey);
      const topic = getNpcTopic(input.topicId);
      if (!topic || topic.npcKey !== key) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Topic ${input.topicId} not found for ${key}.`,
        });
      }
      const result = await pickNpcChoice(
        ctx.user.id,
        key,
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

  /** Witness Ledger — the Antiquarian's aggregated view of every
   *  `potential.*` and `mystery_episode_complete:*` flag the player
   *  has accrued through companion-quest completions. Embodies
   *  canon: "all potentials shape the universe". Returns an empty
   *  ledger on missing DB / row / shape — the Archive simply has no
   *  page for the unread. */
  getWitnessLedger: protectedProcedure.query(async ({ ctx }) => {
    const empty = aggregateWitnessLedger({});
    const db = await getDb();
    if (!db) return empty;
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);
    const data = rows[0]?.gameData as
      | { narrativeFlags?: Record<string, unknown> }
      | null
      | undefined;
    const flags = data?.narrativeFlags;
    if (!flags || typeof flags !== "object") return empty;
    return aggregateWitnessLedger(flags);
  }),
});
