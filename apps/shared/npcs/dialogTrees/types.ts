// apps/shared/npcs/dialogTrees/types.ts
//
// Per-NPC dialog tree types — Phase 6 Infrastructure Deliverable 2.
//
// Generalizes the apps/shared/dialogTree.ts shape (Elara/Human-only,
// DialogSpeaker = "elara" | "human") to all 13 priority-roster NPC keys.
// Mirrors the existing utility surface (getEntryNode, walkNodes,
// isTerminalNode, isDialogTreeConnected, visibleChoices) so per-NPC
// trees can be authored to the same lint contract that the Elara/Human
// trees already pass.
//
// Per-NPC trees live at apps/shared/npcs/dialogTrees/{npcKey}/{tree_id}.ts
// and are aggregated via apps/shared/npcs/dialogTrees/index.ts.

import type { NpcKey } from "../types";

/** Free-composition narrative flag (kept as string per dialogTree.ts convention). */
export type NarrativeFlag = string;

export interface NpcDialogChoice {
  /** Short button text (Mass-Effect-style; ≤ 48 chars suggested). */
  label: string;
  /** Next node id within the same tree. */
  nextId: string;
  /** Optional gate — hide this choice unless the flag is set. */
  requires?: NarrativeFlag;
  /** Optional flag to set when this choice is taken. */
  sets?: NarrativeFlag;
  /** Optional per-NPC trust delta (signed integer). */
  trustDelta?: number;
  /** Optional cross-NPC public flag (writes to npc_public_flags). */
  publicFlag?: NarrativeFlag;
  /** Optional player axes touched (for axis aggregation). */
  axisDelta?: ReadonlyArray<{
    axis: string;
    delta: number;
  }>;
}

export interface NpcDialogNode {
  id: string;
  npcKey: NpcKey;
  /**
   * VO clip key — vo/{npcKey}/{lineId}.mp3 by convention.
   * Optional for non-verbal expression-only nodes (Eidolon, Companion
   * pre-naming) where the renderer plays glyph/posture/sound instead.
   */
  voLineId?: string;
  /**
   * On-screen subtitle. MUST equal the transcript passed to the VO
   * generator for `voLineId` — enforced by lint test.
   * Empty string allowed for non-verbal nodes (renderer reads channel).
   */
  onscreenText: string;
  /** Player choices. Undefined / empty = auto-advance via autoNext. */
  choices?: ReadonlyArray<NpcDialogChoice>;
  /** Optional auto-advance target id for non-branching beats. */
  autoNext?: string;
  /** Optional reveal-stage gate (hides node if NPC is in wrong stage). */
  requiresRevealStage?: string;
  /** Optional non-verbal expression channel for the renderer. */
  expressionChannel?:
    | "verbal"
    | "glyph"
    | "posture"
    | "sound"
    | "first_word"
    | "named_personality";
}

export interface NpcDialogTree {
  /** Globally unique tree id (e.g., "locke-first-meeting"). */
  id: string;
  /** Owning NPC. */
  npcKey: NpcKey;
  /** Conventional entry node — defaults to "root". */
  entryNodeId?: string;
  /** Flat node map. */
  nodes: Readonly<Record<string, NpcDialogNode>>;
}

// --- Resolver utilities (mirror dialogTree.ts) -----------------------------

/** Returns the tree's entry node, or null if the tree has no nodes. */
export function getEntryNode(tree: NpcDialogTree): NpcDialogNode | null {
  const entryId = tree.entryNodeId ?? "root";
  return tree.nodes[entryId] ?? null;
}

/** Look up a node id; throws for unknown ids so authoring mistakes surface early. */
export function getDialogNode(
  tree: NpcDialogTree,
  id: string,
): NpcDialogNode {
  const node = tree.nodes[id];
  if (!node) {
    throw new Error(
      `[npcDialogTree:${tree.id}] unknown node id: ${id}`,
    );
  }
  return node;
}

/** Choices visible to the player given the current flag set. */
export function visibleChoices(
  node: NpcDialogNode,
  flags: ReadonlySet<NarrativeFlag>,
): ReadonlyArray<NpcDialogChoice> {
  if (!node.choices) return [];
  return node.choices.filter(
    (c) => !c.requires || flags.has(c.requires),
  );
}

/** Walk every node in declaration order (entry first). */
export function walkNodes(
  tree: NpcDialogTree,
): ReadonlyArray<NpcDialogNode> {
  const entryId = tree.entryNodeId ?? "root";
  const entry = tree.nodes[entryId];
  const rest = Object.values(tree.nodes).filter(
    (n) => n.id !== entryId,
  );
  return entry ? [entry, ...rest] : rest;
}

/** Terminal nodes — no choices and no autoNext. */
export function isTerminalNode(node: NpcDialogNode): boolean {
  return (
    !node.autoNext &&
    (!node.choices || node.choices.length === 0)
  );
}

/**
 * Returns true iff every non-terminal node's autoNext / choice targets
 * resolve into the tree's node map. Used by lint tests to catch dead
 * references before authoring drift compounds.
 */
export function isDialogTreeConnected(tree: NpcDialogTree): boolean {
  for (const node of Object.values(tree.nodes)) {
    if (node.autoNext && !tree.nodes[node.autoNext]) return false;
    for (const choice of node.choices ?? []) {
      if (!tree.nodes[choice.nextId]) return false;
    }
  }
  return true;
}

/**
 * Returns true iff every node's npcKey matches the tree's owning npcKey.
 * Catches the canonical authoring mistake of pasting a node from another
 * NPC's tree.
 */
export function isDialogTreeNpcConsistent(tree: NpcDialogTree): boolean {
  for (const node of Object.values(tree.nodes)) {
    if (node.npcKey !== tree.npcKey) return false;
  }
  return true;
}

/**
 * Count distinct player-experience-paths through a tree (root → terminal
 * via any choice / autoNext combination). Used to verify Phase 6e branching
 * coverage metric (≥18 paths per NPC = the Elara/Human reference).
 *
 * Stops counting at 1024 to avoid pathological infinite recursion if the
 * tree has cycles — caller should also assert isDialogTreeConnected first.
 */
export function countPlayerPaths(tree: NpcDialogTree): number {
  const entry = getEntryNode(tree);
  if (!entry) return 0;
  const cap = 1024;
  let total = 0;
  const stack: Array<{ nodeId: string; depth: number }> = [
    { nodeId: entry.id, depth: 0 },
  ];
  while (stack.length > 0 && total < cap) {
    const next = stack.pop();
    if (!next) break;
    const node = tree.nodes[next.nodeId];
    if (!node) continue;
    if (next.depth > 32) {
      // Likely cycle; count as a single path and skip.
      total += 1;
      continue;
    }
    if (isTerminalNode(node)) {
      total += 1;
      continue;
    }
    if (node.autoNext) {
      stack.push({ nodeId: node.autoNext, depth: next.depth + 1 });
      continue;
    }
    for (const choice of node.choices ?? []) {
      stack.push({ nodeId: choice.nextId, depth: next.depth + 1 });
    }
  }
  return Math.min(total, cap);
}
