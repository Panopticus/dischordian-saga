// apps/shared/npcs/dialogTrees/index.ts
//
// Aggregator for per-NPC dialog trees (Phase 6 Infrastructure
// Deliverable 2). Mirrors the apps/shared/npcs/banks/index.ts pattern:
// each priority-roster NPC owns a per-character subdirectory with one
// or more named trees (first_meeting, key_reveal, etc.); this index
// concatenates them into ALL_NPC_DIALOG_TREES for the runner/router.
//
// Per-NPC trees ship through Phase 6e (branching layer); Phase 6
// Infrastructure ships only the scaffolding + the aggregator + the
// (npcKey, treeId) lookup contract.

import type { NpcKey } from "../types";
import type { NpcDialogTree } from "./types";

// Per-NPC trees are added here as they ship through Phase 6e.
// Phase 6 Infrastructure ships only the scaffolding + a Locke
// first-meeting fixture used by the lint test below.

const PER_NPC_TREES: ReadonlyArray<NpcDialogTree> = [
  // Phase 6e fills these:
  //   ADJUDICATOR_LOCKE_FIRST_MEETING,
  //   NILMORG_FIRST_CONTACT,
  //   YOUR_EIDOLON_BOND_RESONANCE,
  //   VEX_SOLENE_CODA_INTRO,
  //   THE_DEGEN_FIRST_GAME,
  //   THE_SEER_MECHRONIS_BENCH,
  //   THE_ORACLE_DREAM_INTRODUCTION,
  //   THE_MEME_CH12_FUSION,
  //   THE_GAME_MASTER_WITNESS_MODE,
  //   WRAITH_CALDER_LONG_MOURNING_FIRST_VISIT,
  //   DMC_CLONE_COMPANION_AWAKENING_ARRIVAL,
];

export const ALL_NPC_DIALOG_TREES: ReadonlyArray<NpcDialogTree> =
  PER_NPC_TREES;

/**
 * Per-NPC tree lookup. Returns the trees for a single character, or an
 * empty array if no trees are shipped yet (silent-fail contract — the
 * runner refuses to start a tree that doesn't exist rather than crashing).
 */
export function getDialogTreesFor(
  npcKey: NpcKey,
): ReadonlyArray<NpcDialogTree> {
  return ALL_NPC_DIALOG_TREES.filter((t) => t.npcKey === npcKey);
}

/**
 * (npcKey, treeId) lookup. Returns undefined if no matching tree exists.
 */
export function getDialogTree(
  npcKey: NpcKey,
  treeId: string,
): NpcDialogTree | undefined {
  return ALL_NPC_DIALOG_TREES.find(
    (t) => t.npcKey === npcKey && t.id === treeId,
  );
}
