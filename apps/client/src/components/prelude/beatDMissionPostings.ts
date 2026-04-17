/* ═══════════════════════════════════════════════════════
   BEAT D MISSION POSTINGS — config table

   Beat D's cargo-bay mission board has three "legacy postings
   still active" per Bible §8.1. Per the Bible §14.1 planted
   echo, Locke's "three jobs that need a hand" forward-reference
   in her Beat H first-contact message refers canonically to the
   same three postings the player sees here.

   All three postings date to the pre-collapse era (~17,000 years
   ago, with small year-spread reflecting posting dates across
   the late Insurgency → Empire-collapse window). The sending
   organizations are defunct; the postings persist because the
   Ark's board auto-renewed them through the long silence.
   ═══════════════════════════════════════════════════════ */

export interface MissionPosting {
  /** Stable id used for read-state tracking + downstream flags. */
  id: string;
  /** Short mission title shown on the slate button. */
  title: string;
  /** Organization or party that posted the job. */
  postedBy: string;
  /** Years the posting has been open. Display as "N,NNN years". */
  yearsOpen: number;
  /**
   * Full body text shown in the reader panel when the slate is
   * opened. Plain text; line breaks rendered as paragraphs.
   */
  description: string;
  /**
   * Approximate position on the cargo-hold backdrop's mission
   * board, as percentages of the full frame (matches the Bible
   * §8.3 "upper-left, center, lower-right" arrangement).
   */
  position: { leftPct: number; topPct: number };
  /**
   * True for the 17,000-year-old posting Elara highlights in the
   * cutscene (canonically the "simplest one — the salvage is still
   * there" line). Rendered with a brighter glow.
   */
  highlighted?: boolean;
  /** Flags to set on `flagsOnSuccess`-style downstream hooks. */
  completionFlag: string;
}

/**
 * Canonical order matches the Bible §8.3 board layout:
 *   1. upper-left   (Kelvara salvage — THE highlighted 17,000-year posting)
 *   2. center       (placeholder until canon rewrite)
 *   3. lower-right  (placeholder until canon rewrite)
 */
export const BEAT_D_MISSION_POSTINGS: readonly MissionPosting[] = [
  {
    id: "kelvara_salvage",
    title: "The Kelvara Wreck",
    postedBy: "Kelvara Merchant Concord",
    yearsOpen: 17003,
    description: [
      "Salvage retrieval — wreckage of the merchant vessel Threnody Kelvara, lost in the old Kelvara lane during the second Concord war.",
      "Atmospheric integrity at wreck site: unknown. Navigational hazards: old lane debris. Estimated haul: one (1) medical composite crate, one (1) navigation module, one (1) manifest ledger.",
      "Standard intake contract. Payment on return delivery to any Kelvara Concord port. No faction pledge required. No questions asked on provenance.",
      "— Kelvara Merchant Concord, long since dissolved. Posting kept active by the board's auto-renewer.",
    ].join("\n\n"),
    position: { leftPct: 22, topPct: 38 },
    highlighted: true,
    completionFlag: "mission_board_read_kelvara",
  },
  {
    id: "legacy_cargo_run",
    title: "The Last Courier Run",
    postedBy: "Nightlane Freight Guild",
    yearsOpen: 16988,
    description: [
      "Single-leg delivery. One sealed courier packet, bonded, awaiting pickup at the Ferris-3 staging warehouse. Destination: the Outer Reach port.",
      "Route is the old Nightlane corridor. We are not going to tell you it is safe because the last surveyor to report back from the corridor did so six hundred years ago. We are going to tell you the packet is still there, the warehouse doors still answer, and the bond is still on record.",
      "Full insured payout on verified delivery. The Reach harbormaster's automated proxies will sign off without speaking to you — do not take offense. They have been holding the ledger open for a long time.",
      "— Nightlane Freight Guild. Offices closed. Posting auto-renewing via bonded-service obligation.",
    ].join("\n\n"),
    position: { leftPct: 50, topPct: 50 },
    completionFlag: "mission_board_read_cargo_run",
  },
  {
    id: "legacy_expedition_crew",
    title: "Expedition — Outer Dusk",
    postedBy: "Outer Reach Cartographic Society",
    yearsOpen: 17112,
    description: [
      "Four-position survey of three unmapped volumes on the Outer Dusk rim. Six standard months each leg. The maps we have are wrong in ways we can document but not in ways we can correct from here.",
      "Positions open: navigator, medic, systems engineer, sensor officer. Combat training not required. The volumes are not hostile. The volumes are quiet.",
      "Payment processed through our pre-collapse escrow. Claims are still honored; expect a slow but real settlement. Prior survey experience preferred. Prior returns-from-Outer-Dusk experience mandatory.",
      "The last crew that attempted the northwest volume did not return. We would still like the map.",
      "— Outer Reach Cartographic Society. The Society still exists. We are just somewhere else now.",
    ].join("\n\n"),
    position: { leftPct: 76, topPct: 66 },
    completionFlag: "mission_board_read_expedition",
  },
];

/** Get a posting by id. */
export function getMissionPosting(id: string): MissionPosting | undefined {
  return BEAT_D_MISSION_POSTINGS.find((p) => p.id === id);
}

/** The posting Elara points to in the cutscene (the highlighted 17ky one). */
export function getHighlightedPosting(): MissionPosting | undefined {
  return BEAT_D_MISSION_POSTINGS.find((p) => p.highlighted);
}

/**
 * Format "17,003 years" etc. as a short display string. Uses a comma
 * every three digits so the number reads as deliberate legacy weight
 * rather than a sloppy integer.
 */
export function formatYearsOpen(years: number): string {
  return `${years.toLocaleString("en-US")} years`;
}
