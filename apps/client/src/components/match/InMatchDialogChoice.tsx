/**
 * In-match dialog overlay — Phase A2 of the narrative-spine adoption
 * plan. FIRST consumer of the in-match branching-dialog surface.
 *
 * Mirrors ChoicePillarProgrammerGift.tsx in chrome (modal overlay
 * over the board) but generalizes to N choices and walks an
 * `NpcDialogTree` to terminal.
 *
 * Flow on each player pick:
 *   1. Build the OutcomeBundle via `applyDialogChoiceOutcomes`
 *   2. Fire `onChoiceCommitted(choice, bundle)` so the host can
 *      dispatch engine actions via
 *      `outcomeBundleToEngineActions(bundle, localSide, () => tcgClient.getNextSeq())`
 *      followed by `tcgClient.dispatch(action)` per action.
 *   3. Advance internal tree state to `choice.nextId`.
 *   4. If the new node is terminal (no choices, no autoNext), render
 *      its text with a "Continue" button that fires `onClose`.
 *
 * Server commit is INTENTIONALLY NOT performed here. The in-match
 * path is engine-only; the out-of-encounter dialog runner
 * (`useNpcDialogTree`) handles the server-authoritative commit
 * pathway. One writer per surface — see the Phase A pinned design
 * decisions in /root/.claude/plans/.
 */
import { useMemo, useState } from "react";
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
  NpcDialogTree,
} from "@shared/npcs/dialogTrees/types";
import {
  applyDialogChoiceOutcomes,
  type OutcomeBundle,
} from "@shared/campaign";

export interface InMatchDialogChoiceProps {
  /** The tree to walk. The host (DuelystGameUI) looks up the tree
   *  by `treeId` from a fired `branching_dialog` narrative action
   *  and passes it through. */
  tree: NpcDialogTree;
  /** Entry node — typically per-band selected by the narrative
   *  hook's `branching_dialog.entryNodeId`. */
  entryNodeId: string;
  /** Fires after each successful choice commit. Receives the
   *  authored choice + the resolved OutcomeBundle. The host
   *  dispatches the bundle through the engine. */
  onChoiceCommitted: (choice: NpcDialogChoice, bundle: OutcomeBundle) => void;
  /** Fires when the player clicks Continue on the terminal node.
   *  The host unmounts the overlay. */
  onClose: () => void;
}

export function InMatchDialogChoice({
  tree,
  entryNodeId,
  onChoiceCommitted,
  onClose,
}: InMatchDialogChoiceProps) {
  const [state, setState] = useState<TreeRunnerState>(() =>
    startTreeRun(tree, { entryNodeId }),
  );

  const node = useMemo(() => resolveCurrentNode(state, tree), [state, tree]);
  const choices: ReadonlyArray<NpcDialogChoice> = node?.choices ?? [];

  // Auto-advance choiceless nodes with an autoNext. The host doesn't
  // need to think about it — the overlay walks straight through to
  // the next interactive node.
  useMemo(() => {
    if (state.ended) return;
    if (!node) return;
    if (canAutoAdvance(state, tree)) {
      setState((prev) => autoAdvanceTreeRun(prev, tree));
    }
  }, [state, tree, node]);

  const handlePick = (choiceIndex: number) => {
    if (state.ended) return;
    const choice = choices[choiceIndex];
    if (!choice) return;
    const outcomeId = `${tree.id}.${state.currentNodeId}.${choiceIndex}`;
    const bundle = applyDialogChoiceOutcomes(choice, outcomeId);
    onChoiceCommitted(choice, bundle);
    setState((prev) => advanceTreeRun(prev, tree, choiceIndex));
  };

  if (!node) {
    // Defensive — the host should not mount with an unknown entry,
    // but if it does, close cleanly rather than crashing.
    return null;
  }

  const isTerminal = state.ended;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="In-match dialog choice"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      <div className="max-w-2xl w-full mx-6 p-8 bg-stone-950/95 border void-border rounded">
        {/* Caption — quiet, identifies the surface */}
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim mb-4 text-center">
          In-match dialog
        </p>

        {/* Node text — preserves line breaks from the authored tree
         *  so multi-speaker beats (Left / Right) render as authored. */}
        <p className="font-serif text-[14px] italic leading-relaxed void-text whitespace-pre-line">
          {node.onscreenText}
        </p>

        {/* Choices — vertical stack, N buttons. Terminal nodes
         *  render a single Continue. */}
        <div className="mt-6 flex flex-col gap-2">
          {isTerminal ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded border void-border bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text hover:bg-cyan-900/60"
            >
              Continue
            </button>
          ) : (
            choices.map((choice, i) => (
              <button
                key={`${state.currentNodeId}_${i}`}
                type="button"
                onClick={() => handlePick(i)}
                className="text-left rounded border void-border bg-stone-900/60 px-4 py-3 font-serif text-[13px] void-text hover:bg-stone-800/80 hover:border-cyan-500/60 transition-colors"
              >
                {choice.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
