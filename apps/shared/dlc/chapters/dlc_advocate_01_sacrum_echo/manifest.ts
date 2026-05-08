/* dlc_advocate_01_sacrum_echo — Sacrum Echo
 *
 * First chapter in the Advocate side-arc. Surfaces the first
 * Sacrum fragment, opens the Sealed Chronicle as a static prop
 * for downstream chapters, and branches the player into one of
 * three Sacrum-handling paths (preserve / weave / return).
 *
 * Parent section : advocate_arc
 * Sequence       : 1
 * Prerequisites  : Act 2 cleared + Authority Trial complete
 * Rewards        : 50 XP + 5 SBD + 1 loredex unlock
 *                  ("the_sacrum_of_severed_silk") + community
 *                  light energy +25
 * Sets on complete: dlc_chapter_<id>_complete (auto) +
 *                   advocate_sealed_chronicle_unlocked +
 *                   advocate_sacrum_first_fragment_collected
 */
import type { DlcChapter } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";
import { DLC_ADVOCATE_01_STEPS } from "./steps";

export const DLC_ADVOCATE_01_SACRUM_ECHO: DlcChapter = {
  id: "dlc_advocate_01_sacrum_echo",
  title: "Sacrum Echo",
  synopsis:
    "The Antiquarian opens the Sealed Chronicle. The first fragment of the Sacrum of Severed Silk surfaces — and you carry it the rest of the way.",
  parentSection: { kind: "advocate_arc" },
  sequence: 1,
  prerequisites: [
    { kind: "act_completion", act: 2 },
    { kind: "flag", flag: "authority_trial_complete" },
  ],
  steps: DLC_ADVOCATE_01_STEPS,
  rewards: {
    xp: 50,
    soulBoundDream: 5,
    lightEnergyReward: 25,
    loredexEntries: ["the_sacrum_of_severed_silk"],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_advocate_01_sacrum_echo_complete",
    "advocate_sealed_chronicle_unlocked",
    "advocate_sacrum_first_fragment_collected",
  ],
};

/**
 * Mini-DLC five-system manifest (Phase 5 of the world-weave plan).
 *
 * Adopts this back-catalog DLC into the Two-Ripple Rule by declaring
 * the five canonical surfaces it touches. Each ref is *static
 * scaffold* — runtime wiring (mystery seeder pickup, transmission
 * track audio, etc.) lands per-surface in follow-up PRs.
 */
export const DLC_ADVOCATE_01_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_advocate_01_sacrum_echo",
  title: "Sacrum Echo",
  sealRequired: 2,
  yearlyAffinity: null,
  moodImpact: { conquest: 0.05 },
  newMysterySeed: { seedId: "advocate.sacrum_echo.first_fragment" },
  newTransmissionTrack: {
    trackId: "T_ADVOCATE_01",
    albumKey: "T_ADVOCATE_01",
  },
  newCustomItem: {
    itemId: "advocate.sealed_chronicle_pin",
    assetSlug: "art/items/advocate/sealed_chronicle_pin.png",
  },
  newGuildContract: {
    contractKey: "advocate.fragment_relay",
    summary: "Relay Sacrum fragments between guild halls for shared progress.",
  },
  newGovernanceMotion: {
    motionKey: "advocate_sealed_chronicle_oversight",
  },
  optionalCardDef: {
    cardId: "advocate_sealed_chronicle_card",
  },
};
