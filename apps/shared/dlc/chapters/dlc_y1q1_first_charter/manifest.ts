/* dlc_y1q1_first_charter — "The First Charter"
 *
 * Year-1 Foundation Day mini-DLC. The Antiquarian recovers a damaged
 * charter fragment. The Council has 7 days to ratify, amend, or
 * contest. Sets up the multi-year "Missing Signatory" cold case.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "narration",
    id: "open",
    speaker: "antiquarian",
    text: "We dragged the charter out of the lower-deck silt. Six signatures legible. The seventh is wax-eaten — and the wax was eaten on purpose.",
    subtitle: "Foundation Day, Year 1.",
  },
  {
    kind: "narration",
    id: "call_to_council",
    speaker: "architect_console",
    text: "Seven days. Read it aloud. Amend it. Or admit you forget who you are.",
  },
];

export const DLC_Y1Q1_FIRST_CHARTER: DlcChapter = {
  id: "dlc_y1q1_first_charter",
  title: "The First Charter",
  synopsis:
    "Foundation Day Year 1 — the Antiquarian recovers a damaged charter fragment with one signature redacted. The Council has 7 days to act.",
  parentSection: { kind: "endgame" },
  sequence: 1,
  prerequisites: [{ kind: "act_completion", act: 1 }],
  steps: STEPS,
  rewards: { xp: 60, soulBoundDream: 5, lightEnergyReward: 30 },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_y1q1_first_charter_complete",
    "missing_signatory_case_open",
  ],
};

export const DLC_Y1Q1_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y1q1_first_charter",
  title: "The First Charter",
  sealRequired: 1,
  yearlyAffinity: "foundation_day",
  moodImpact: { conquest: 0.1 },
  newMysterySeed: { seedId: "charter.missing_signatory" },
  newTransmissionTrack: { trackId: "T10_charter_hymn", albumKey: "T10" },
  newCustomItem: {
    itemId: "founders_sigil",
    assetSlug: "art/items/foundation/founders_sigil.png",
  },
  newGuildContract: {
    contractKey: "foundation.charter_renewal",
    summary: "File the most-cited charter amendment for guild prestige.",
  },
  newGovernanceMotion: { motionKey: "foundation_charter_renewal_year_1" },
  optionalCrewBloodline: {
    bloodlineKey: "founder_line",
    classification: "PURE",
  },
};
