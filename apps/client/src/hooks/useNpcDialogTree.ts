/* ═══════════════════════════════════════════════════════
   useNpcDialogTree — Phase 1 BioWare runner

   React hook that walks an NpcDialogTree (the Phase 6e+ +
   Phase 1 BioWare-style tree shape from
   apps/shared/npcs/dialogTrees) and COMMITS each player
   choice through the server-authoritative
   `npc.recordDialogChoiceOutcome` procedure before
   advancing local state.

   Sibling hook to `useNpcConversation` (which walks the
   legacy NpcLine graph). The two hooks intentionally do
   not share state — line-graph trees and BioWare trees
   are different shapes; collapsing them would force
   compromises on both.

   Server-authoritative

   The hook sends only { npcKey, treeId, nodeId,
   choiceIndex } to the server. The authored outcomes
   (factionRepDelta, unlockCard, mutateNextEncounterDeck,
   etc.) are looked up server-side from the same tree
   import the client renders. The hook never advances
   optimistically — it awaits the server commit before
   updating local state, so a server-rejected choice (out-
   of-range, gated reveal-stage, etc.) does not visually
   advance.

   Returned `lastResult` exposes the structured dispatch
   result so the caller can fire toasts / refresh
   reputation caches / animate card-unlocks. The hook
   itself is presentation-agnostic.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  startTreeRun,
  advanceTreeRun,
  autoAdvanceTreeRun,
  canAutoAdvance,
  currentNode as resolveCurrentNode,
  type TreeRunnerState,
} from "@shared/npcs/dialogTrees/runner";
import type {
  NpcDialogChoice,
  NpcDialogNode,
  NpcDialogTree,
} from "@shared/npcs/dialogTrees/types";

export interface ChoiceCommitResult {
  ok: boolean;
  outcomeId: string;
  /** Per-writer-kind attempt counts the server dispatcher recorded.
   *  Mirrors `OutcomeDispatchResult.attempted` from
   *  apps/shared/campaign/dispatchOutcomeBundle.ts. */
  attempted: {
    flagWrites: number;
    trustWrites: number;
    axisWrites: number;
    factionRepWrites: number;
    stakesIntents: number;
    cardUnlockIntents: number;
    deckMutationIntents: number;
  };
  /** Writes the server dispatcher skipped because the request context
   *  did not wire a writer for that kind. */
  skipped: ReadonlyArray<{ kind: string; reason: string }>;
  /** Count of writer errors (each one logged server-side; the bundle
   *  still succeeds). */
  errors: number;
  /** Routing signal — when the committed choice carried a
   *  `challenge: { npcKey }` outcome, the host should mount the NPC
   *  duel UI (e.g. NpcDuelOverlay). Null when the choice did not
   *  carry a challenge. */
  challenge: { npcKey: string } | null;
}

export interface UseNpcDialogTreeInput {
  tree: NpcDialogTree;
  /**
   * Optional override for the entry node — useful for resume flows
   * or for the Dreamer-aware entry. Defaults to the tree's declared
   * entry (or `"root"`).
   */
  entryNodeId?: string;
  /**
   * Optional caller-side callback fired after every successful
   * server commit. Receives the structured dispatch result so the
   * caller can refresh reputation caches, fire toasts, animate
   * unlocked cards, etc. Fires once per commit.
   */
  onChoiceCommitted?: (result: ChoiceCommitResult) => void;
}

export interface UseNpcDialogTreeView {
  currentNode: NpcDialogNode | null;
  choices: ReadonlyArray<NpcDialogChoice>;
  /**
   * Commit a choice (by zero-based index into the current node's
   * choices array) through the server, then advance local state to
   * the authored `choice.nextId`. Resolves once the server has
   * confirmed the commit; rejects if the server returns an error
   * (the local state stays on the current node).
   */
  advance: (choiceIndex: number) => Promise<void>;
  /**
   * Pure client-side advance for choiceless nodes (autoNext). Does
   * not contact the server — autoNext beats are presentation only.
   */
  autoAdvance: () => void;
  /** True once a terminal node is reached. */
  ended: boolean;
  /** True while a server commit is in flight. */
  committing: boolean;
  /** Most recent successful commit result, or null if none yet. */
  lastResult: ChoiceCommitResult | null;
  /** Most recent commit error, cleared on the next successful commit. */
  error: Error | null;
  /** Raw reducer state — exposed for telemetry / debug overlays. */
  state: TreeRunnerState;
}

export function useNpcDialogTree(
  input: UseNpcDialogTreeInput,
): UseNpcDialogTreeView {
  const { tree, entryNodeId, onChoiceCommitted } = input;

  const commitMutation = trpc.npc.recordDialogChoiceOutcome.useMutation();

  const [state, setState] = useState<TreeRunnerState>(() =>
    startTreeRun(tree, { entryNodeId }),
  );
  const [lastResult, setLastResult] = useState<ChoiceCommitResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const advance = useCallback(
    async (choiceIndex: number): Promise<void> => {
      if (state.ended) return;
      const node = resolveCurrentNode(state, tree);
      const choice = node?.choices?.[choiceIndex];
      if (!choice) {
        const err = new RangeError(
          `[useNpcDialogTree:${tree.id}] choice ${choiceIndex} out of range for node "${state.currentNodeId}"`,
        );
        setError(err);
        throw err;
      }
      try {
        const result = (await commitMutation.mutateAsync({
          npcKey: tree.npcKey,
          treeId: tree.id,
          nodeId: state.currentNodeId,
          choiceIndex,
        })) as ChoiceCommitResult;
        setError(null);
        setLastResult(result);
        setState((prev) => advanceTreeRun(prev, tree, choiceIndex));
        onChoiceCommitted?.(result);
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      }
    },
    [state, tree, commitMutation, onChoiceCommitted],
  );

  const autoAdvance = useCallback(() => {
    setState((prev) => {
      if (!canAutoAdvance(prev, tree)) return prev;
      return autoAdvanceTreeRun(prev, tree);
    });
  }, [tree]);

  const currentNode = useMemo(
    () => resolveCurrentNode(state, tree),
    [state, tree],
  );
  const choices = useMemo<ReadonlyArray<NpcDialogChoice>>(
    () => currentNode?.choices ?? [],
    [currentNode],
  );

  return {
    currentNode,
    choices,
    advance,
    autoAdvance,
    ended: state.ended,
    committing: commitMutation.isPending,
    lastResult,
    error,
    state,
  };
}
