/* ═══════════════════════════════════════════════════════
   CONSPIRACY BOARD REVELATIONS — discoverability layer

   The seven Conspiracy Boards (apps/shared/conspiracyBoards/
   definitions.ts) each set a `revealFlag` when solved. This
   module maps each reveal to the in-fiction consequences:

     - Memory-locked cutscenes the Editor sealed (Awakening,
       FirstHumanContact, MemoryRecovery, BreakingPoint,
       ThoughtVirusManifests). Each board solve unlocks one.
     - Soul Stones manifesting in the Antiquarian's Library.
       Vox theorised them in late papers; the Editor edited
       those papers. Each board solve removes one of the
       Editor's edits, returning a stone.
     - Faction reveals (Witnessing canon).

   The plan calls these "memory-locked" rather than "missing":
   the Human says "I have memories I cannot access. The Editor
   sealed them. They unlock when you do." This is the data
   layer that makes that promise mechanical.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

import type { CutsceneId } from "./cutsceneRegistry";

export interface ConspiracyBoardRevelation {
  /** Matches `boardKey` in conspiracyBoards/definitions.ts. */
  boardKey: string;
  /** Memory-locked cutscene this board's solve unseals.
   *  Setting this cutscene's trigger flag is the consequence. */
  unlocksCutscene?: CutsceneId;
  /** Whether solving this board manifests a new Soul Stone in
   *  the Antiquarian's Library. The stone is one of the violet
   *  starting stones the existing soulStones.ts engine consumes. */
  manifestsSoulStone: boolean;
  /** In-fiction announcement copy, used by the Loredex / toast
   *  layer to tell the player what the Editor's edit was. */
  editorEditDescription: string;
  /** Flag set when the player has read the announcement. */
  revelationSeenFlag: string;
}

export const CONSPIRACY_BOARD_REVELATIONS: ReadonlyArray<ConspiracyBoardRevelation> = [
  {
    boardKey: "first_memory",
    unlocksCutscene: "cutscene_awakening",
    manifestsSoulStone: true,
    editorEditDescription:
      "Vox's first paper described the Awakening as a witnessing event. The Editor edited every paragraph that named the witnesses. Solving the First Memory restored those names. The Awakening cutscene the Editor sealed is now playable. A violet Soul Stone has manifested in the Antiquarian's Library.",
    revelationSeenFlag: "revelation_first_memory_seen",
  },
  {
    boardKey: "inheritance_ledger",
    unlocksCutscene: "cutscene_first_human_contact",
    manifestsSoulStone: true,
    editorEditDescription:
      "The Editor erased every record of the Detective's first contact with the substrate channel. The Inheritance Ledger restored them — the Detective's first words to the Ark are now legible. A second Soul Stone has manifested.",
    revelationSeenFlag: "revelation_inheritance_ledger_seen",
  },
  {
    boardKey: "thought_virus",
    unlocksCutscene: "cutscene_elara_memory_recovery",
    manifestsSoulStone: true,
    editorEditDescription:
      "Elara's memory of the Thought Virus's first appearance was edited out — she did not know she had forgotten. Solving the Thought Virus board returned her memory. The recovery cutscene plays now. A third Soul Stone has manifested.",
    revelationSeenFlag: "revelation_thought_virus_seen",
  },
  {
    boardKey: "project_celebration",
    unlocksCutscene: "cutscene_breaking_point",
    manifestsSoulStone: true,
    editorEditDescription:
      "The Breaking Point — the moment the Detective realised what Project Celebration was — was sealed in the substrate's locked cells. Solving Project Celebration breaks the seal. A fourth Soul Stone has manifested.",
    revelationSeenFlag: "revelation_project_celebration_seen",
  },
  {
    boardKey: "kaels_revenge",
    unlocksCutscene: "cutscene_thought_virus_manifests",
    manifestsSoulStone: true,
    editorEditDescription:
      "Kael's records were the last the Editor reached. The Thought Virus Manifests cutscene was the page that made the Editor stop editing — they did not know what to do with it. Solving Kael's Revenge plays the page. A fifth Soul Stone has manifested.",
    revelationSeenFlag: "revelation_kaels_revenge_seen",
  },
  {
    boardKey: "watcher_infiltration",
    manifestsSoulStone: true,
    editorEditDescription:
      "The Watcher's surveillance net was meant to watch the Editor. The Editor edited the watch logs. Solving Watcher Infiltration restored them. A sixth Soul Stone has manifested.",
    revelationSeenFlag: "revelation_watcher_infiltration_seen",
  },
  {
    boardKey: "recruiter_defection",
    manifestsSoulStone: true,
    editorEditDescription:
      "Kael's defection from the Recruiter role was the Editor's last edit. The seventh and final Soul Stone has manifested. The Antiquarian closes Volume Eighteen. The Editor will not write again.",
    revelationSeenFlag: "revelation_recruiter_defection_seen",
  },
];

export function getRevelationForBoard(
  boardKey: string,
): ConspiracyBoardRevelation | undefined {
  return CONSPIRACY_BOARD_REVELATIONS.find((r) => r.boardKey === boardKey);
}

/** Cutscenes unlocked by Conspiracy Board solves, in canonical
 *  order. Used by the Loredex page to render the locked-cutscene
 *  catalog and by ship-check parity. */
export const CUTSCENES_UNLOCKED_BY_BOARDS: ReadonlyArray<{
  boardKey: string;
  cutsceneId: CutsceneId;
}> = CONSPIRACY_BOARD_REVELATIONS.flatMap((r) =>
  r.unlocksCutscene ? [{ boardKey: r.boardKey, cutsceneId: r.unlocksCutscene }] : [],
);

/** Total Soul Stones that can be discovered through Conspiracy
 *  Boards. Combined with the existing combat-source weekly cap
 *  (15/week from soulStones.ts), this is the diegetic source. */
export const SOUL_STONES_FROM_BOARDS = CONSPIRACY_BOARD_REVELATIONS.filter(
  (r) => r.manifestsSoulStone,
).length;
