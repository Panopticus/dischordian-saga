/* dlc_y1q4_witness_plaza — "The Witness Plaza"
 *
 * Year-1 Memorial Day mini-DLC. The Memorial Plaza in personal
 * quarters opens for the first time. Each player inscribes one
 * imprint name; cross-player visits reveal a shared mosaic.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "narration",
    id: "open",
    speaker: "antiquarian",
    text: "We were told the dead would be a register. We made them a room. Stand at the door and write one name. The plaza will hold it for as long as the Ark holds.",
    subtitle: "Memorial Day, Year 1.",
  },
  {
    kind: "narration",
    id: "shared_mosaic",
    speaker: "antiquarian",
    text: "Visit a friend's quarters tonight. Their plaza is yours to read. We do not grieve in private here — we grieve in mosaic.",
  },
];

export const DLC_Y1Q4_WITNESS_PLAZA: DlcChapter = {
  id: "dlc_y1q4_witness_plaza",
  title: "The Witness Plaza",
  synopsis:
    "Memorial Day Year 1 — the Memorial Plaza opens. Inscribe one imprint name; visit a friend's plaza and read theirs.",
  parentSection: { kind: "endgame" },
  sequence: 1,
  prerequisites: [{ kind: "act_completion", act: 5 }],
  steps: STEPS,
  rewards: { xp: 90, soulBoundDream: 12, lightEnergyReward: 45 },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_y1q4_witness_plaza_complete",
    "memorial_plaza_first_inscription",
  ],
};

export const DLC_Y1Q4_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y1q4_witness_plaza",
  title: "The Witness Plaza",
  sealRequired: 5,
  yearlyAffinity: "memorial_day",
  moodImpact: { death: -0.05, famine: -0.05 },
  newMysterySeed: {
    seedId: "memorial.forgotten_names",
    sealTier: 5,
  },
  newTransmissionTrack: {
    trackId: "T13_eulogy_of_imprints",
    albumKey: "T13",
  },
  newCustomItem: {
    itemId: "watcher_garb",
    assetSlug: "art/items/memorial/watcher_garb.png",
  },
  newGuildContract: {
    contractKey: "memorial.pillar_inscription",
    summary: "Collective guild project: inscribe a hall pillar with imprint names.",
  },
  newGovernanceMotion: { motionKey: "kael_memorial_inscription_year_1" },
  optionalCrewBloodline: {
    bloodlineKey: "memorial_bound",
    classification: "PURE",
  },
};
