// apps/shared/npcs/dialogTrees/runner.ts
//
// Pure-functional reducer for walking an NpcDialogTree. No React, no
// tRPC — used by the client-side `useNpcDialogTree` hook AND directly
// unit-testable as plain TypeScript.
//
// The reducer is intentionally small: a TreeRunnerState carrying the
// current node id, an ended flag, and a history trail. Three
// transitions:
//
//   • startTreeRun(tree, entryNodeId?)
//       Returns the initial state pointed at the entry node.
//
//   • advanceTreeRun(state, tree, choiceIndex)
//       Advances to choice.nextId. Throws RangeError if the choice
//       index is out of range. Server commit happens OUTSIDE this
//       reducer — the React hook awaits the server before calling
//       this transition.
//
//   • autoAdvanceTreeRun(state, tree)
//       For choiceless nodes with `autoNext`, advances without a
//       choice. Throws if the current node has no autoNext.
//
// All transitions mark `ended: true` when the next node is terminal
// (no choices, no autoNext) per `isTerminalNode`.

import {
  getDialogNode,
  getEntryNode,
  isTerminalNode,
  resolveEntryNodeId,
  type EntryNodeOptions,
  type NpcDialogNode,
  type NpcDialogTree,
} from "./types";

export interface TreeRunnerHistoryEntry {
  /** Node id the player was on when the transition fired. */
  nodeId: string;
  /** Choice taken; undefined for autoAdvance transitions. */
  choiceIndex?: number;
}

export interface TreeRunnerState {
  /** The node currently rendered. */
  currentNodeId: string;
  /** True once a terminal node has been reached. */
  ended: boolean;
  /** Append-only history of transitions taken to reach the current node. */
  history: ReadonlyArray<TreeRunnerHistoryEntry>;
}

/** Build the initial state for a tree walk. */
export function startTreeRun(
  tree: NpcDialogTree,
  opts?: EntryNodeOptions & { entryNodeId?: string },
): TreeRunnerState {
  const entryId = opts?.entryNodeId ?? resolveEntryNodeId(tree, opts);
  const entry = tree.nodes[entryId];
  if (!entry) {
    throw new Error(
      `[npcDialogTree:${tree.id}] startTreeRun: entry node "${entryId}" not in tree`,
    );
  }
  return {
    currentNodeId: entryId,
    ended: isTerminalNode(entry),
    history: [],
  };
}

/** Advance to the chosen branch. Caller is responsible for committing
 *  the choice server-side before calling this — the reducer is pure
 *  presentation. Throws if the index is out of range. */
export function advanceTreeRun(
  state: TreeRunnerState,
  tree: NpcDialogTree,
  choiceIndex: number,
): TreeRunnerState {
  if (state.ended) return state;
  const node = getDialogNode(tree, state.currentNodeId);
  const choice = node.choices?.[choiceIndex];
  if (!choice) {
    throw new RangeError(
      `[npcDialogTree:${tree.id}] advanceTreeRun: choice ${choiceIndex} out of range for node "${state.currentNodeId}"`,
    );
  }
  const next = getDialogNode(tree, choice.nextId);
  return {
    currentNodeId: next.id,
    ended: isTerminalNode(next),
    history: [
      ...state.history,
      { nodeId: state.currentNodeId, choiceIndex },
    ],
  };
}

/** Auto-advance a choiceless node. Throws if the node has no autoNext. */
export function autoAdvanceTreeRun(
  state: TreeRunnerState,
  tree: NpcDialogTree,
): TreeRunnerState {
  if (state.ended) return state;
  const node = getDialogNode(tree, state.currentNodeId);
  if (!node.autoNext) {
    throw new Error(
      `[npcDialogTree:${tree.id}] autoAdvanceTreeRun: node "${state.currentNodeId}" has no autoNext`,
    );
  }
  const next = getDialogNode(tree, node.autoNext);
  return {
    currentNodeId: next.id,
    ended: isTerminalNode(next),
    history: [...state.history, { nodeId: state.currentNodeId }],
  };
}

/** Resolve the current node from a state. */
export function currentNode(
  state: TreeRunnerState,
  tree: NpcDialogTree,
): NpcDialogNode | null {
  return tree.nodes[state.currentNodeId] ?? null;
}

/** True iff the current node is choiceless and has an autoNext —
 *  i.e., calling `autoAdvanceTreeRun` would succeed. */
export function canAutoAdvance(
  state: TreeRunnerState,
  tree: NpcDialogTree,
): boolean {
  if (state.ended) return false;
  const node = tree.nodes[state.currentNodeId];
  if (!node) return false;
  return Boolean(node.autoNext) && !(node.choices && node.choices.length > 0);
}

/** Re-export getEntryNode for callers who don't want to import the
 *  types module directly. */
export { getEntryNode };
