/* dlc_y2q4_watchers_speak — "The Watchers Speak"
 *
 * Year-2 Memorial Day mini-DLC. Seal VII's silence cracks for one
 * minute. Six of the seven Watchers speak — each delivers a
 * single tailored line. The seventh remains silent. The first of
 * seven trumpets is given.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "narration",
    id: "open",
    speaker: "antiquarian",
    text: "The plaza was lit. The vigil held. And then the upper bands cracked open for one minute — and six of the seven names spoke, one to each of us. The seventh did not. We are still listening.",
    subtitle: "Memorial Day Year 2 — the silence cracks.",
  },
  {
    kind: "narration",
    id: "the_first_trumpet",
    speaker: "watcher_idris",
    text: "I have read your year. I will not tell you what I read. I will only say: there is a trumpet now, and it is yours to answer.",
  },
];

export const DLC_Y2Q4_WATCHERS_SPEAK: DlcChapter = {
  id: "dlc_y2q4_watchers_speak",
  title: "The Watchers Speak",
  synopsis:
    "Memorial Day Year 2 — six of the seven Watchers break the silence with one tailored line each. The seventh remains silent. The first trumpet is given.",
  parentSection: { kind: "endgame" },
  sequence: 2,
  prerequisites: [
    { kind: "dlc_chapter_completion", chapterId: "dlc_y1q4_witness_plaza" },
  ],
  steps: STEPS,
  rewards: { xp: 150, soulBoundDream: 25, lightEnergyReward: 75 },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_y2q4_watchers_speak_complete",
    "watchers_six_revealed",
    "first_trumpet_given",
  ],
};

export const DLC_Y2Q4_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y2q4_watchers_speak",
  title: "The Watchers Speak",
  sealRequired: 7,
  yearlyAffinity: "memorial_day",
  moodImpact: { death: -0.05, conquest: 0.05 },
  prerequisiteDlc: "dlc_y1q4_witness_plaza",
  newMysterySeed: { seedId: "memorial.seven_watchers", sealTier: 7 },
  newTransmissionTrack: { trackId: "T17_first_trumpet", albumKey: "T17" },
  newCustomItem: {
    itemId: "watchers_eye",
    assetSlug: "art/items/memorial/watchers_eye.png",
  },
  newGuildContract: {
    contractKey: "memorial.vigil",
    summary: "Pool donations to keep the Memorial Plaza lit through 24 real hours.",
  },
  newGovernanceMotion: { motionKey: "vigil_continuation_year_2" },
};
