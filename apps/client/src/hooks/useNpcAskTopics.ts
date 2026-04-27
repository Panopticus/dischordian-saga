/* ═══════════════════════════════════════════════════════
   useNpcAskTopics — Phase 6 Infrastructure D5b

   React hook that surfaces the "what can I ask this NPC right
   now?" view, mirroring apps/shared/companionAskLattice.ts but
   for the unified per-NPC ask-topic registry (askTopics.ts +
   askBanks/).

   Per-NPC banks ship through Phase 6a-6e; until then the hook
   returns an empty lattice so the wheel renders no extra topics
   rather than crashing (silent-fail contract).

   Returns:
     - topics: visible topics for the NPC under current state
     - resolvedAnswers: precomputed answer per topic id (multi-act
                        alternates already resolved)
     - askedHistory: epoch-ms asked-at by topic id (server-side)
     - recordAsked(topicId): mutation that writes
                             npc_ask_topic_history
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  getAvailableAskTopics,
  resolveAskAnswer,
  type AskTopic,
  type AskTopicResolutionContext,
} from "@shared/npcs/askTopics";
import { ALL_NPC_ASK_TOPICS } from "@shared/npcs/askBanks";
import type { NpcKey, RevealStage, TrustBand } from "@shared/npcs/types";

export interface UseNpcAskTopicsInput {
  npcKey: NpcKey;
  currentAct: number;
  flags: ReadonlySet<string>;
  trustBand?: TrustBand;
  revealStage?: RevealStage;
  publicFlags?: ReadonlySet<string>;
}

export interface NpcAskTopicsView {
  topics: ReadonlyArray<AskTopic>;
  resolvedAnswers: ReadonlyMap<string, string>;
  askedHistory: ReadonlyMap<string, number>;
  recordAsked: (topicId: string) => Promise<void>;
}

export function useNpcAskTopics(
  input: UseNpcAskTopicsInput,
): NpcAskTopicsView {
  const utils = trpc.useUtils();

  const { data: history } = trpc.npc.getAskTopicHistory.useQuery(
    { npcKey: input.npcKey },
    { staleTime: 60 * 1000 },
  );

  const recordMutation = trpc.npc.recordAskTopicAsked.useMutation({
    onSuccess: () => {
      void utils.npc.getAskTopicHistory.invalidate({
        npcKey: input.npcKey,
      });
    },
  });

  const ctx: AskTopicResolutionContext = useMemo(
    () => ({
      currentAct: input.currentAct,
      flags: input.flags,
      publicFlags: input.publicFlags,
      trustBand: input.trustBand,
      revealStage: input.revealStage,
    }),
    [
      input.currentAct,
      input.flags,
      input.publicFlags,
      input.trustBand,
      input.revealStage,
    ],
  );

  const topics = useMemo(
    () =>
      getAvailableAskTopics(
        ALL_NPC_ASK_TOPICS,
        input.npcKey,
        ctx,
      ),
    [input.npcKey, ctx],
  );

  const resolvedAnswers = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of topics) {
      m.set(t.id, resolveAskAnswer(t, ctx));
    }
    return m;
  }, [topics, ctx]);

  const askedHistory = useMemo(() => {
    const m = new Map<string, number>();
    for (const row of history ?? []) {
      // Most-recent-first per server ordering; record only the latest.
      if (!m.has(row.topicId)) m.set(row.topicId, row.askedAt);
    }
    return m;
  }, [history]);

  const recordAsked = useCallback(
    async (topicId: string) => {
      await recordMutation.mutateAsync({
        npcKey: input.npcKey,
        topicId,
      });
    },
    [recordMutation, input.npcKey],
  );

  return { topics, resolvedAnswers, askedHistory, recordAsked };
}
