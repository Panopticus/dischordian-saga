/* dlc_breeding_02_first_pure_cycle — The First Generation
 *
 * The first PURE breeding cycle resolves. One generation logged.
 * The Collector files the report. The Advocate leaves a margin
 * note on it that wasn't there before.
 *
 * Parent : breeding_program · crew_bene_gesserit · Sequence 2
 * Prereqs : Chapter 1 complete + at least 1 PURE generation
 */
import type { DlcChapter } from "../../types";

export const DLC_BREEDING_02_FIRST_PURE_CYCLE: DlcChapter = {
  id: "dlc_breeding_02_first_pure_cycle",
  title: "The First Generation",
  synopsis:
    "One PURE bloodline generation logged. The Collector files the report. There is a margin note on it now, in the Advocate's hand. The note was not there an hour ago.",
  parentSection: { kind: "breeding_program", tier: "crew_bene_gesserit" },
  sequence: 2,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_breeding_01_crew_unlocks",
    },
    { kind: "bloodline_threshold", classification: "PURE", minGenerations: 1 },
  ],
  steps: [
    {
      kind: "narration",
      id: "first_report",
      speaker: "antiquarian",
      text: "The first report is short. One generation. Yield: 1 crystal unit. The Collector signs it cheerfully. The Advocate's margin note appears in the same hand that wrote the original manifest. It says: 'Begin again, with patience. Six more.'",
      subtitle: "PURE bloodline · generation 1 · yield = 1 crystal unit.",
    },
    {
      kind: "narration",
      id: "patience_tax",
      speaker: "antiquarian",
      text: "She is not condescending. She is precise. PURE bloodlines are the longest investment in the Saga and they yield the least crystal per cycle. The yield is not the point. The destination is.",
    },
    {
      kind: "narration",
      id: "the_destination",
      speaker: "antiquarian",
      text: "The destination is buried four chapters away. I will not name it here. The Advocate did not name it on the manifest either. She knew you would not believe her if she did. You will believe her when the count reaches five.",
    },
  ],
  rewards: {
    xp: 60,
    soulBoundDream: 6,
    lightEnergyReward: 25,
    loredexEntries: ["concept_collectors_work_missions"],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_breeding_02_first_pure_cycle_complete",
    "breeding_first_generation_logged",
  ],
};
