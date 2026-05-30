/* dlc_y2q1_charter_schism — "The Charter Schism"
 *
 * Year-2 Foundation Day mini-DLC. Year-1's missing-signatory cold
 * case pays off. The redacted name belonged to a second signatory
 * whose faction was erased from the charter. Their descendants
 * demand restoration. First yearly with a binary outcome.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "cinematic_ref",
    id: "intro_cinematic",
    cinematicId: "y2q1_charter_schism",
  },
  {
    kind: "narration",
    id: "open",
    speaker: "antiquarian",
    text: "I told you the wax was eaten on purpose. I did not yet know whose mouth had eaten it. We know now. They are at the gate, and they are reading the charter back to us.",
    subtitle: "Foundation Day Year 2 — schism dawn.",
  },
  {
    kind: "choice",
    id: "pick_a_side",
    speaker: "architect_console",
    prompt: "Two readings of the charter stand opposed. The Council needs a vote.",
    options: [
      {
        id: "ratify_schism",
        text: "Ratify the schism — restore the second signatory's line.",
        setFlag: "charter_schism_ratified",
      },
      {
        id: "close_schism",
        text: "Close the schism — the existing charter holds.",
        setFlag: "charter_schism_closed",
      },
    ],
  },
  {
    kind: "narration",
    id: "aftermath_ratified",
    speaker: "antiquarian",
    text: "Ratified. The redacted line is restored; the charter grows a second column for Year 3. Half the Council left the chamber smiling and half left silent, which is the truest sign a vote actually decided something. A charter with two columns is harder to read and harder to lie about. You chose the harder, more honest document. I will copy it out tonight in both hands.",
    subtitle: "The second signatory's line returns to the charter.",
    requiresFlag: "charter_schism_ratified",
  },
  {
    kind: "narration",
    id: "aftermath_closed",
    speaker: "antiquarian",
    text: "Closed. The existing charter holds, single-column, as it was signed. The descendants at the gate will call it erasure; the Council will call it stability; both will be partly right, which is the condition every charter lives in. You chose the document that already works over the one that would have to be rebuilt. Continuity is not nothing. Tell that to the gate. It will not believe you, but tell it anyway.",
    subtitle: "The redacted line stays redacted. The gate does not open.",
    requiresFlag: "charter_schism_closed",
  },
];

export const DLC_Y2Q1_CHARTER_SCHISM: DlcChapter = {
  id: "dlc_y2q1_charter_schism",
  title: "The Charter Schism",
  synopsis:
    "Foundation Day Year 2 — the redacted signatory's descendants demand restoration. Each player picks a side; the winning side reshapes the charter for Year 3.",
  parentSection: { kind: "endgame" },
  sequence: 21,
  prerequisites: [
    { kind: "dlc_chapter_completion", chapterId: "dlc_y1q1_first_charter" },
  ],
  steps: STEPS,
  rewards: { xp: 100, soulBoundDream: 15, lightEnergyReward: 50 },
  setsFlagsOnComplete: ["dlc_chapter_dlc_y2q1_charter_schism_complete"],
};

export const DLC_Y2Q1_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y2q1_charter_schism",
  title: "The Charter Schism",
  sealRequired: 3,
  yearlyAffinity: "foundation_day",
  moodImpact: { war: 0.05, conquest: 0.05 },
  prerequisiteDlc: "dlc_y1q1_first_charter",
  newMysterySeed: { seedId: "charter.second_signatory" },
  newTransmissionTrack: { trackId: "T14_schism_anthem", albumKey: "T14" },
  newCustomItem: {
    itemId: "schismatic_pin",
    assetSlug: "art/items/foundation/schismatic_pin.png",
  },
  newGuildContract: {
    contractKey: "foundation.faction_choice",
    summary: "Guild collectively picks a side in the schism (single binding vote).",
  },
  newGovernanceMotion: {
    motionKey: "foundation_schism_resolution_year_2",
    binary: true,
  },
  optionalDemonLord: { hierarchyId: "echo_of_the_second_signatory" },
};
