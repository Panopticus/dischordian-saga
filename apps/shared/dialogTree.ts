/* ═══════════════════════════════════════════════════════
   SCRIPTED DIALOG TREES (plan §Step 5)

   Data shape for scripted Elara / Human dialog. Replaces
   the LLM-driven free-text path when ELARA_LLM !== "on".

   Core invariant: every DialogNode declares BOTH a voLineId
   AND an onscreenText. They must match word-for-word — the
   lint test in dialogTree.test.ts compares onscreenText
   against the transcript we pass to the VO generator, so a
   drift is caught at build time.

   This module only defines the shape + navigator. The trees
   themselves live in apps/shared/dialogTrees/{elaraAct1,
   humanAct1}.ts so content can land independently of the
   schema.
   ═══════════════════════════════════════════════════════ */

export type DialogSpeaker = "elara" | "human" | "nemesis" | "apprentice";

/** Flag name used to gate or fire state. Kept as a string for free composition. */
export type NarrativeFlag = string;

export interface DialogChoice {
  /** Short button text (Mass-Effect-style). */
  label: string;
  /** Next node to advance to. */
  nextId: string;
  /** Optional gate — hide this choice unless the flag is true. */
  requires?: NarrativeFlag;
  /** Optional flag to set when this choice is taken. */
  sets?: NarrativeFlag;
}

export interface DialogNode {
  id: string;
  speaker: DialogSpeaker;
  /**
   * ID resolving into elaraVoManifest / humanVoManifest.
   * The VO generator emits audio keyed by this id; the audio URL
   * is looked up at runtime.
   */
  voLineId: string;
  /**
   * On-screen subtitle. MUST equal the transcript that was passed
   * to the VO generator for `voLineId` — enforced by lint test.
   */
  onscreenText: string;
  /** Player choices. Undefined = auto-advance via autoNext. */
  choices?: readonly DialogChoice[];
  /**
   * Optional auto-advance target id. When set and `choices` is
   * empty, the UI advances after the VO finishes.
   */
  autoNext?: string;
}

/**
 * A dialog tree is just a flat map of id → node. Entry point is
 * conventionally `root` unless the tree overrides `entryNodeId`.
 */
export interface DialogTree {
  id: string;
  entryNodeId?: string;
  nodes: Readonly<Record<string, DialogNode>>;
}

/* ─── Resolver ─── */

/** Returns the entry node or null if the tree has no nodes. */
export function getEntryNode(tree: DialogTree): DialogNode | null {
  const entryId = tree.entryNodeId ?? "root";
  return tree.nodes[entryId] ?? null;
}

/** Look up a node id; throws for unknown ids so authoring mistakes surface early. */
export function getDialogNode(tree: DialogTree, id: string): DialogNode {
  const node = tree.nodes[id];
  if (!node) {
    throw new Error(`[dialogTree:${tree.id}] unknown node id: ${id}`);
  }
  return node;
}

/** Choices visible to the player given the current flag set. */
export function visibleChoices(
  node: DialogNode,
  flags: Readonly<Record<string, boolean>>,
): readonly DialogChoice[] {
  if (!node.choices) return [];
  return node.choices.filter((c) => !c.requires || !!flags[c.requires]);
}

/**
 * Walk every node in a tree — used by the lint test + VO manifest
 * generator. Emits in declaration order (entry first, then the rest
 * in Object.keys order of the node map).
 */
export function walkNodes(tree: DialogTree): readonly DialogNode[] {
  const entryId = tree.entryNodeId ?? "root";
  const entry = tree.nodes[entryId];
  const rest = Object.values(tree.nodes).filter((n) => n.id !== entryId);
  return entry ? [entry, ...rest] : rest;
}

/**
 * Terminal nodes — no choices and no autoNext. Useful for test
 * completeness checks (every dialog arc must bottom out).
 */
export function isTerminalNode(node: DialogNode): boolean {
  return !node.autoNext && (!node.choices || node.choices.length === 0);
}

/**
 * Returns true iff every non-terminal node's `autoNext` / choice
 * targets resolve into the tree's node map. Used by tests.
 */
export function isDialogTreeConnected(tree: DialogTree): boolean {
  for (const node of Object.values(tree.nodes)) {
    if (node.autoNext && !tree.nodes[node.autoNext]) return false;
    for (const choice of node.choices ?? []) {
      if (!tree.nodes[choice.nextId]) return false;
    }
  }
  return true;
}
