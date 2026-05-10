/* dlc_y1q2_pale_inheritance — "The Pale Inheritance"
 *
 * Year-1 Severance mini-DLC. A DMC champion dies in the season
 * finale; their soul-bound companion's bond does not transfer —
 * the soul-fragment becomes inheritable. Codifies the ritual.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "cinematic_ref",
    id: "intro_cinematic",
    cinematicId: "y1q2_pale_inheritance",
  },
  {
    kind: "narration",
    id: "open",
    speaker: "vex_maestro",
    text: "We do not say the word 'death' in Nilmorg. We say the bond is on the table. We say someone has to pick it up.",
    subtitle: "Severance Year 1 — Nilmorg sector ceremony.",
  },
  {
    kind: "narration",
    id: "the_inheritance",
    speaker: "vex_maestro",
    text: "Two hundred and sixteen names asked to inherit. The bond chose one. It always chooses one. And it is never who you expect.",
  },
];

export const DLC_Y1Q2_PALE_INHERITANCE: DlcChapter = {
  id: "dlc_y1q2_pale_inheritance",
  title: "The Pale Inheritance",
  synopsis:
    "Severance Year 1 — a fallen circuit champion's soul-bound companion becomes inheritable. The Council ratifies the protocol.",
  parentSection: { kind: "endgame" },
  sequence: 12,
  prerequisites: [{ kind: "act_completion", act: 4 }],
  steps: STEPS,
  rewards: { xp: 80, soulBoundDream: 10, lightEnergyReward: 40 },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_y1q2_pale_inheritance_complete",
    "severance_inheritance_protocol_witnessed",
  ],
};

export const DLC_Y1Q2_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y1q2_pale_inheritance",
  title: "The Pale Inheritance",
  sealRequired: 4,
  yearlyAffinity: "severance",
  moodImpact: { death: 0.1 },
  newMysterySeed: {
    seedId: "severance.bound_champion",
    sealTier: 4,
  },
  newTransmissionTrack: {
    trackId: "T11_severance_threnody",
    albumKey: "T11",
  },
  newCustomItem: {
    itemId: "severance_mask",
    assetSlug: "art/items/severance/severance_mask.png",
  },
  newGuildContract: {
    contractKey: "severance.champion_memorial",
    summary: "Vote which fallen circuit racer your guild honors this year.",
  },
  newGovernanceMotion: { motionKey: "severance_succession_year_1" },
  optionalDemonLord: { hierarchyId: "sevren_the_inheritor" },
};
