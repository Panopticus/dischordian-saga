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
import { ADJUDICATOR_LOCKE_FIRST_MEETING } from "./adjudicator_locke/first_meeting";

// Per-NPC trees are added here as they ship through Phase 6e.
// Phase 6 Infrastructure shipped only the scaffolding + the aggregator;
// per-NPC content authoring lands here as banks complete.

const PER_NPC_TREES: ReadonlyArray<NpcDialogTree> = [
  ADJUDICATOR_LOCKE_FIRST_MEETING,           // Phase 6a.2 ✅ (Locke first-meeting)
  // NILMORG_FIRST_CONTACT,                  // Phase 6a.1 — DMC opening
  // YOUR_EIDOLON_BOND_RESONANCE,            // Phase 6e — non-verbal
  // VEX_SOLENE_CODA_INTRO,                  // Phase 6b.2
  // THE_DEGEN_FIRST_GAME,                   // Phase 6c.1
  // THE_SEER_MECHRONIS_BENCH,               // Phase 6b.1
  // THE_ORACLE_DREAM_INTRODUCTION,          // Phase 6b.3
  // THE_MEME_CH12_FUSION,                   // Phase 6d.2
  // THE_GAME_MASTER_WITNESS_MODE,           // Phase 6d.1
  // WRAITH_CALDER_LONG_MOURNING_FIRST_VISIT, // Phase 6d.3
  // DMC_CLONE_COMPANION_AWAKENING_ARRIVAL,  // Phase 6c.2
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
