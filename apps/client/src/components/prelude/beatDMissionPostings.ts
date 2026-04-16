/* ═══════════════════════════════════════════════════════
   BEAT D MISSION POSTINGS — config table

   Beat D's cargo-bay mission board has three "legacy postings
   still active" per Bible §8.1. The canonical Trade Empire /
   Adjudicator Locke "three jobs" forward-reference (see §14.1
   / Locke's Beat H message) names these as the same three
   postings the player sees here in Beat D.

   ONLY POSTING 1 IS FULLY CANONICAL TODAY:
     - "salvage retrieval from a wreck near the old Kelvara lane"
       (Locke's first message, Bible §14.5)
     - "posted for 17,000 years … the simplest one" (Elara, §8.5)

   Postings 2 and 3 are PLACEHOLDER content until a canon-writing
   pass lands. They match the Trade Empire tone (old, cold, matter-
   of-fact trader board copy) so the UI can be built + playtested
   now; rewrite the `description` field on each when canon authors
   land the real posting text. The `id`s are stable — downstream
   flags/tests reference them.
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
  // PLACEHOLDER — canonical content pending. Trade Empire tone. Rewrite
  // the title, postedBy, description, and yearsOpen when canon lands.
  {
    id: "legacy_cargo_run",
    title: "Freight Run — Outer Dusk",
    postedBy: "Salting Company",
    yearsOpen: 12440,
    description: [
      "Delivery contract. Three pallets of refined antifreeze polymer from Tanaris Foundry to Outer-Ring Fabricators, routed via Iron Belt Gate 2.",
      "Cold-chain certification required. Pressurized hold preferred. Payment on signed bill-of-lading at the Fabricator dock.",
      "Posting continues to auto-renew. The Tanaris Foundry is still there. The pallets are still there. The Salting Company has not checked in with anyone in a long time.",
    ].join("\n\n"),
    position: { leftPct: 50, topPct: 50 },
    completionFlag: "mission_board_read_cargo_run",
  },
  {
    id: "legacy_expedition_crew",
    title: "Expedition Crew — Four Positions",
    postedBy: "Outer Dusk Survey Guild",
    yearsOpen: 9802,
    description: [
      "Survey expedition to the unmapped edge of the Outer Dusk nebula. Six standard months closed contract. Four crew positions open: navigator, medic, weapons officer, systems engineer.",
      "Must tolerate long cold sleeps and silent captains. Must be willing to sign the standard what-you-find-is-what-you-keep rider.",
      "We are not asking for heroes. We are asking for people who finish the route.",
      "— Outer Dusk Survey Guild (primary signatory illegible; posting still honored by the ship-of-record, the Aperture).",
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
