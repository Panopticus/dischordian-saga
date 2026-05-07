/* dlc_breeding_03_advocate_body_coordinates — The Coordinates
 *
 * Terminal chapter of the Crew-Bene-Gesserit ladder. Five PURE
 * generations logged. The Advocate's body coordinates surface —
 * the Season-2 endgame hook documented in Testament v2 §VI Part 4
 * (and constant `PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY = 5`
 * in apps/shared/bloodClassification.ts).
 *
 * Parent : breeding_program · crew_bene_gesserit · Sequence 3
 * Prereqs : Chapter 2 complete + 5+ PURE generations + spine complete
 */
import type { DlcChapter } from "../../types";
import { PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY } from "../../../bloodClassification";

export const DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES: DlcChapter = {
  id: "dlc_breeding_03_advocate_body_coordinates",
  title: "The Coordinates",
  synopsis:
    "Five generations of PURE bloodline logged. The Advocate's body — sealed in stasis under 7-Omega clearance in New Babylon — has coordinates the Empire has not held since the Battle of the Seventh Binding. The coordinates surface now, in your hand, in her writing.",
  parentSection: { kind: "breeding_program", tier: "crew_bene_gesserit" },
  sequence: 3,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_breeding_02_first_pure_cycle",
    },
    {
      kind: "bloodline_threshold",
      classification: "PURE",
      // Sourced from the Testament v2 constant — keeps lore + gate
      // count in lockstep so a doc revision auto-updates the gate.
      minGenerations: PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY,
    },
    { kind: "flag", flag: "narrative_spine_complete" },
  ],
  steps: [
    {
      kind: "narration",
      id: "fifth_report",
      speaker: "antiquarian",
      text: "Fifth generation. Fifth ritual. Fifth report on the Collector's desk. Yield: 5 crystal units across the bloodline. The Advocate's margin note appears one last time, in the same patient hand.",
      subtitle: "PURE bloodline · generation 5 · the gate is unlocked.",
    },
    {
      kind: "narration",
      id: "the_coordinates",
      speaker: "antiquarian",
      text: "The note is one line of numbers. They are coordinates. They name a room sealed in stasis under 7-Omega clearance in New Babylon. They name the room that holds her body. The Empire has not had these coordinates since the Battle of the Seventh Binding. You have them now.",
    },
    {
      kind: "narration",
      id: "the_threshold",
      speaker: "antiquarian",
      text: "I will not tell you what to do with them. I have not been told either. The Chronicle ends here, again, the way it ended at the Yog-Nathal teaser. The next page is in another book, in another season, in a body that has been waiting four hundred years for the count to reach five.",
      subtitle: "Season 2 hook raised. The story does not end. It only pauses.",
    },
  ],
  rewards: {
    xp: 300,
    soulBoundDream: 30,
    lightEnergyReward: 150,
    loredexEntries: [
      "concept_advocate_body_coordinates",
      "concept_seventh_binding",
      "concept_pure_bloodline_endgame",
    ],
    cosmeticIds: [
      "title_collector_of_the_bloodline",
      "theme_advocate_chamber",
    ],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_breeding_03_advocate_body_coordinates_complete",
    "breeding_program_climax_reached",
    "advocate_body_coordinates_unlocked",
    "season_2_advocate_body_hook_raised",
  ],
};
