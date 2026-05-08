/* dlc_y2q3_apprentices_stand — "The Apprentice's Stand (Reprise)"
 *
 * Year-2 Mechronis Festival mini-DLC. The player's sponsored
 * apprentice (from Year-1 mentorship) faces a Terminus Swarm wave
 * during the festival. Stay or run — the choice echoes Kael F5.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "narration",
    id: "open",
    speaker: "lyra_vox",
    text: "Your apprentice is on the festival roof. The wave is fourteen minutes out. They have asked me to ask you what to do — and I think they already know. They want to hear it from you.",
    subtitle: "Mechronis Festival Year 2 — opening encore.",
  },
  {
    kind: "choice",
    id: "stand_or_run",
    speaker: "lyra_vox",
    prompt: "Coach your apprentice. Stay at the post — or run for the lower halls?",
    options: [
      { id: "stand", text: "Stand. Hold the line.", setFlag: "apprentice_stood" },
      { id: "run", text: "Run. Live to study tomorrow.", setFlag: "apprentice_ran" },
    ],
  },
];

export const DLC_Y2Q3_APPRENTICES_STAND: DlcChapter = {
  id: "dlc_y2q3_apprentices_stand",
  title: "The Apprentice's Stand (Reprise)",
  synopsis:
    "Mechronis Festival Year 2 — your sponsored apprentice faces a wave during the opening; you coach them through the same choice Kael once made.",
  parentSection: { kind: "endgame" },
  sequence: 2,
  prerequisites: [
    { kind: "dlc_chapter_completion", chapterId: "dlc_y1q3_curriculum_crisis" },
  ],
  steps: STEPS,
  rewards: { xp: 120, soulBoundDream: 20, lightEnergyReward: 60 },
  setsFlagsOnComplete: ["dlc_chapter_dlc_y2q3_apprentices_stand_complete"],
};

export const DLC_Y2Q3_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y2q3_apprentices_stand",
  title: "The Apprentice's Stand (Reprise)",
  sealRequired: 5,
  yearlyAffinity: "mechronis_festival",
  moodImpact: { conquest: 0.05, death: 0.02 },
  prerequisiteDlc: "dlc_y1q3_curriculum_crisis",
  newMysterySeed: { seedId: "mechronis.chained_lesson" },
  newTransmissionTrack: {
    trackId: "T16_apprentices_hymn",
    albumKey: "T16",
  },
  newCustomItem: {
    itemId: "standing_cloak",
    assetSlug: "art/items/mechronis/standing_cloak.png",
  },
  newGuildContract: {
    contractKey: "mechronis.mentors_pledge",
    summary: "High-mastery players sponsor a low-mastery apprentice for a season.",
  },
  newGovernanceMotion: { motionKey: "apprentice_protection_protocol_year_2" },
  optionalCardDef: {
    cardId: "the_apprentice",
    sealVariantOf: "kael_imprint",
  },
};
