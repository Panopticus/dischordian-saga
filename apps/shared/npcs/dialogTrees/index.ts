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
import { NILMORG_FIRST_CONTACT } from "./nilmorg/first_meeting";
import { VEX_SOLENE_FIRST_MEETING } from "./vex_solene/first_meeting";
import { WRAITH_CALDER_FIRST_MEETING } from "./wraith_calder/first_meeting";
import { WRAITH_CALDER_POST_RECRUIT_VISIT } from "./wraith_calder/post_recruit_visit";
import { WRAITH_CALDER_LOYALTY_INTRO } from "./wraith_calder/loyalty_intro";
import { AKAI_SHI_FIRST_MEETING } from "./akai_shi/first_meeting";
import { AKAI_SHI_LOYALTY_INTRO } from "./akai_shi/loyalty_intro";
import { LYCOS_FIRST_MEETING } from "./lycos/first_meeting";
import { LYCOS_LOYALTY_INTRO } from "./lycos/loyalty_intro";
import { THE_SEER_FIRST_MEETING } from "./the_seer/first_meeting";
import { THE_ORACLE_FIRST_MEETING } from "./the_oracle/first_meeting";
import { THE_GAME_MASTER_FIRST_MEETING } from "./the_game_master/first_meeting";
import { THE_GAME_MASTER_SECOND_MEETING_PRE_TRIAL } from "./the_game_master/second_meeting_pre_trial";
import { THE_GAME_MASTER_MID_TRIAL_INTERCESSION } from "./the_game_master/mid_trial_intercession";
import { THE_MEME_FIRST_MEETING } from "./the_meme/first_meeting";
import { THE_DEGEN_FIRST_GAME } from "./the_degen/first_meeting";
import { DMC_CLONE_COMPANION_AWAKENING_ARRIVAL } from "./dmc_clone_companion/first_meeting";
import { YOUR_EIDOLON_BOND_RESONANCE } from "./your_eidolon/first_meeting";

// Per-NPC trees are added here as they ship through Phase 6e.
// Phase 6 Infrastructure shipped only the scaffolding + the aggregator;
// per-NPC content authoring lands here as banks complete.

const PER_NPC_TREES: ReadonlyArray<NpcDialogTree> = [
  ADJUDICATOR_LOCKE_FIRST_MEETING,           // Phase 6a.2 ✅ (Locke first-meeting)
  NILMORG_FIRST_CONTACT,                      // Phase 6e.1a ✅ (DMC opening)
  VEX_SOLENE_FIRST_MEETING,                   // Phase 6e.1a ✅ (Coda Maestro)
  WRAITH_CALDER_FIRST_MEETING,                // Phase 6e.1a ✅ (Long Mourning chamber)
  WRAITH_CALDER_POST_RECRUIT_VISIT,           // Section D5 ✅ (ledger-vault first-visit)
  WRAITH_CALDER_LOYALTY_INTRO,                // Section D5 ✅ (Seventh Sanctuary opening)
  AKAI_SHI_FIRST_MEETING,                     // Section D5 ✅ (blade-shrine first-visit)
  AKAI_SHI_LOYALTY_INTRO,                     // Section D5 ✅ (Red Death Pattern opening)
  LYCOS_FIRST_MEETING,                        // Section D5 ✅ (containment-atrium first-visit)
  LYCOS_LOYALTY_INTRO,                        // Section D5 ✅ (Mercy, Refused opening)
  THE_SEER_FIRST_MEETING,                     // Phase 6e.1b ✅ (Mechronis bench)
  THE_ORACLE_FIRST_MEETING,                   // Phase 6e.1b ✅ (Ch5 dream-sequence)
  THE_GAME_MASTER_FIRST_MEETING,              // Phase 6e.1b ✅ (witness-mode)
  THE_GAME_MASTER_SECOND_MEETING_PRE_TRIAL,   // Phase 1 BioWare ✅ (Act 2 Interlude, the Two co-speak)
  THE_GAME_MASTER_MID_TRIAL_INTERCESSION,     // Phase A6 ✅ (in-match, three verdict bands)
  THE_MEME_FIRST_MEETING,                     // Phase 6e.1b ✅ (Ch12 fusion-reveal)
  THE_DEGEN_FIRST_GAME,                       // Phase 6e.1c ✅ (Casino first-game)
  DMC_CLONE_COMPANION_AWAKENING_ARRIVAL,      // Phase 6e.1c ✅ (Severance Prize arrival)
  YOUR_EIDOLON_BOND_RESONANCE,                // Phase 6e.1c ✅ (Bond Resonance)
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
