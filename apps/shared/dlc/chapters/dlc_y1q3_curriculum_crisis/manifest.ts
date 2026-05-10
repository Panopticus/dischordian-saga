/* dlc_y1q3_curriculum_crisis — "The Curriculum Crisis"
 *
 * Year-1 Mechronis Festival mini-DLC. A professor vanishes during
 * the autumn-equinox opening. Term cannot proceed until the case
 * is closed and a curriculum is ratified.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "cinematic_ref",
    id: "intro_cinematic",
    cinematicId: "y1q3_curriculum_crisis",
  },
  {
    kind: "narration",
    id: "open",
    speaker: "mechronis_dean",
    text: "Professor Tarn was scheduled to give the equinox address. The lectern is empty. The notes are gone. The robe is folded on the seat as if she stepped out for water.",
    subtitle: "Mechronis Festival — opening hour.",
  },
  {
    kind: "narration",
    id: "the_curriculum_dispute",
    speaker: "mechronis_dean",
    text: "Three faculties want three different terms. We will not start the year on a contested syllabus. Decide it in the open, and the doors stay open.",
  },
];

export const DLC_Y1Q3_CURRICULUM_CRISIS: DlcChapter = {
  id: "dlc_y1q3_curriculum_crisis",
  title: "The Curriculum Crisis",
  synopsis:
    "Mechronis Festival Year 1 — a professor vanishes; the curriculum is contested; term cannot start until both questions are answered.",
  parentSection: { kind: "endgame" },
  sequence: 13,
  prerequisites: [{ kind: "act_completion", act: 2 }],
  steps: STEPS,
  rewards: { xp: 70, soulBoundDream: 8, lightEnergyReward: 35 },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_y1q3_curriculum_crisis_complete",
    "mechronis_curriculum_year1_voted",
  ],
};

export const DLC_Y1Q3_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y1q3_curriculum_crisis",
  title: "The Curriculum Crisis",
  sealRequired: 2,
  yearlyAffinity: "mechronis_festival",
  moodImpact: { conquest: 0.05 },
  newMysterySeed: { seedId: "mechronis.missing_professor" },
  newTransmissionTrack: {
    trackId: "T12_faculty_convocation",
    albumKey: "T12",
  },
  newCustomItem: {
    itemId: "mechronis_robe",
    assetSlug: "art/items/mechronis/mechronis_robe.png",
  },
  newGuildContract: {
    contractKey: "mechronis.curriculum_sponsor",
    summary: "Fund a curriculum module that survives into next term.",
  },
  newGovernanceMotion: { motionKey: "mechronis_curriculum_vote_year_1" },
  optionalCardDef: { cardId: "the_missing_professor" },
};
