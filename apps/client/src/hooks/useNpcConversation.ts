/* ═══════════════════════════════════════════════════════
   useNpcConversation — Phase 6 Infrastructure D5b

   React hook that wraps apps/shared/npcs/conversationRunner.ts
   for client consumption. Walks an NpcLine graph (or per-NPC
   dialog tree, see useNpcDialogTree below for the parallel
   tree variant) and persists state to npc_dialog_tree_state via
   the tRPC router.

   Returns:
     - currentLine: the line to render now (or null if ended)
     - choices: visible choices on the current line
     - advance(choiceId?): take a player choice OR auto-advance
                           via nextLineId
     - end(): close the conversation early
     - state: full ConversationState (history, cumulative deltas)

   The hook does NOT call recordLinePlayed automatically — the
   caller chooses when to commit (typically on conversation end,
   when the cumulative delta is meaningful). This keeps the
   hook's I/O policy explicit + caller-controllable.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  startConversation,
  advanceWithChoice,
  advanceAuto,
  endConversation,
  getCurrentLine,
  getChoices,
  type ConversationState,
  type LineLookup,
} from "@shared/npcs/conversationRunner";
import type { NpcChoice, NpcKey, NpcLine } from "@shared/npcs/types";

export interface UseNpcConversationInput {
  npcKey: NpcKey;
  /** Entry line id; the conversation starts here. */
  entryLineId: string;
  /** Caller-provided line lookup (typically from a per-NPC bank). */
  lookup: LineLookup;
  /**
   * Optional tree id; when present, the hook persists the in-flight
   * node to npc_dialog_tree_state so cross-session resume works.
   * Omit for ephemeral conversations that don't need resume.
   */
  treeId?: string;
}

export interface UseNpcConversationView {
  currentLine: NpcLine | null;
  choices: ReadonlyArray<NpcChoice>;
  state: ConversationState;
  advance: (choiceId?: string) => void;
  end: () => void;
  /** True when the conversation has terminated. */
  ended: boolean;
}

export function useNpcConversation(
  input: UseNpcConversationInput,
): UseNpcConversationView {
  const setTreeStateMutation = trpc.npc.setDialogTreeState.useMutation();

  const [state, setState] = useState<ConversationState>(() =>
    startConversation(input.npcKey, input.entryLineId, input.lookup),
  );

  // Persist node-changes to npc_dialog_tree_state when treeId is set.
  const persistTreeState = useCallback(
    (next: ConversationState) => {
      if (!input.treeId) return;
      setTreeStateMutation.mutate({
        npcKey: input.npcKey,
        treeId: input.treeId,
        currentNodeId: next.currentLineId,
        completed: next.ended,
      });
    },
    [input.npcKey, input.treeId, setTreeStateMutation],
  );

  const advance = useCallback(
    (choiceId?: string) => {
      setState((prev) => {
        const next = choiceId
          ? advanceWithChoice(prev, choiceId, input.lookup)
          : advanceAuto(prev, input.lookup);
        persistTreeState(next);
        return next;
      });
    },
    [input.lookup, persistTreeState],
  );

  const end = useCallback(() => {
    setState((prev) => {
      const next = endConversation(prev);
      persistTreeState(next);
      return next;
    });
  }, [persistTreeState]);

  const currentLine = useMemo(
    () => getCurrentLine(state, input.lookup),
    [state, input.lookup],
  );
  const choices = useMemo(
    () => getChoices(state, input.lookup),
    [state, input.lookup],
  );

  return {
    currentLine,
    choices,
    state,
    advance,
    end,
    ended: state.ended,
  };
}
