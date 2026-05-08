/**
 * Yearly Events — canonical definitions.
 *
 * Four anchored calendar dates that frame the saga's social year:
 *
 *   - Foundation Day      (Jan 1)  — charter renewal
 *   - Severance           (Apr 1)  — DMC season-end + soul-bond inheritance
 *   - Mechronis Festival  (Sep 21) — autumn-equinox academic term opening
 *   - Memorial Day        (Nov 11) — Kael memorial + Memorial Plaza
 *
 * Each event activates on its anchor date, runs for `durationDays`, and
 * closes by emitting a governance motion via `closingMotionKey`.
 *
 * Seals IV and V can override the calendar: when those seals first
 * break, the matching yearly fires regardless of date. The override
 * lives in `apps/server/services/yearlyEventScheduler.ts` and is
 * keyed off the `triggeredBySeal` field on the row.
 */

export type YearlyEventKey =
  | "foundation_day"
  | "severance"
  | "mechronis_festival"
  | "memorial_day";

/**
 * Closing motion keys — one per (event × year) combination. The
 * yearlyEventScheduler appends `_year_<N>` at activation time so the
 * Council can vote on this year's renewal independently.
 */
export type YearlyClosingMotionKeyBase =
  | "foundation_charter_renewal"
  | "severance_succession"
  | "mechronis_curriculum_vote"
  | "kael_memorial_inscription";

export interface YearlyEventDef {
  key: YearlyEventKey;
  /** Display name. */
  name: string;
  /** Single-paragraph blurb shown above the participation panel. */
  blurb: string;
  /** Calendar anchor (1-12, 1-31). */
  anchorMonth: number;
  anchorDay: number;
  /** How long the event runs once activated. */
  durationDays: number;
  /** Closing motion key base (suffixed with `_year_<N>` at activation). */
  closingMotionKey: YearlyClosingMotionKeyBase;
  /**
   * If a seal breaking can fire this event regardless of the calendar
   * (Phase 4), the seal number is recorded here. Seal IV unlocks
   * Severance; Seal V unlocks Memorial Day.
   */
  triggeredBySeal?: 4 | 5;
  /**
   * Donations during this event get this multiplier (Phase 5 Charity
   * weave-in). 1.0 = no boost.
   */
  donationMultiplier: number;
  /**
   * Which woven systems are intended primary participants. Used by
   * the World Tapestry constellation to highlight active threads.
   */
  primarySystems: ReadonlyArray<string>;
}

export const YEARLY_EVENTS: ReadonlyArray<YearlyEventDef> = [
  {
    key: "foundation_day",
    name: "Foundation Day",
    blurb:
      "The Ark's birthday — a community reading of the founding charter, with a binding 7-day Council vote at close.",
    anchorMonth: 1,
    anchorDay: 1,
    durationDays: 7,
    closingMotionKey: "foundation_charter_renewal",
    donationMultiplier: 2,
    primarySystems: ["governance", "guild", "transmissions", "mysteries"],
  },
  {
    key: "severance",
    name: "Severance",
    blurb:
      "DMC season-end. Soul-bonded companions of fallen champions are inherited; the Council ratifies the protocol.",
    anchorMonth: 4,
    anchorDay: 1,
    durationDays: 3,
    closingMotionKey: "severance_succession",
    triggeredBySeal: 4,
    donationMultiplier: 1.5,
    primarySystems: ["trade_empire", "demon_summoning", "governance"],
  },
  {
    key: "mechronis_festival",
    name: "Mechronis Festival",
    blurb:
      "Autumn-equinox academic term opening. Curriculum vote closes the festival.",
    anchorMonth: 9,
    anchorDay: 21,
    durationDays: 5,
    closingMotionKey: "mechronis_curriculum_vote",
    donationMultiplier: 1.5,
    primarySystems: ["mechronis_celebration", "chess", "guild"],
  },
  {
    key: "memorial_day",
    name: "Memorial Day for the Fallen",
    blurb:
      "Imprints inscribed to the Memorial Plaza. The Antiquarian compiles a Year of the Lost volume.",
    anchorMonth: 11,
    anchorDay: 11,
    durationDays: 2,
    closingMotionKey: "kael_memorial_inscription",
    triggeredBySeal: 5,
    donationMultiplier: 3,
    primarySystems: ["social", "charity", "transmissions", "mysteries"],
  },
];

const _KEY_SET = new Set(YEARLY_EVENTS.map((e) => e.key));
if (_KEY_SET.size !== YEARLY_EVENTS.length) {
  throw new Error("YEARLY_EVENTS contains duplicate keys");
}

export function getYearlyEvent(key: YearlyEventKey): YearlyEventDef {
  const e = YEARLY_EVENTS.find((x) => x.key === key);
  if (!e) throw new Error(`Unknown yearly event key: ${key}`);
  return e;
}

/**
 * Compose the active closing-motion key for a given year.
 *
 * `closingMotionKeyForYear("foundation_day", 2026)` returns
 * `"foundation_charter_renewal_year_2026"`. The Council motion catalog
 * registers the key on activation; the consequence map ties it to
 * concrete world-state effects.
 */
export function closingMotionKeyForYear(
  key: YearlyEventKey,
  year: number,
): string {
  return `${getYearlyEvent(key).closingMotionKey}_year_${year}`;
}
