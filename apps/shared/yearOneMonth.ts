/* ═══════════════════════════════════════════════════════
   YEAR ONE MONTH — canonical calendar month tracker

   The Witnessing Proposal's Year One Calendar maps 12 real
   months to gameplay phases (see witnessingYearOne.ts). Each
   month raises a `year_one_month_N_opened` narrative flag and
   advances gameplay into the next phase.

   Historically the Witnessing Hub derived the current month
   by scanning those flags for the highest one set
   (`inferYearOneMonth` in WitnessingHubPage.tsx). That shim
   remains the fallback for saves that predate this field.

   This module adds the canonical `yearOneMonth: number` field
   (1..12) plus pure helpers. Like narratorBond, the helper's
   goal is one-source-of-truth for the month number so the Hub
   input and the campaign-state value can't drift.

   Pure module. No React, no server imports.
   ═══════════════════════════════════════════════════════ */

export const YEAR_ONE_MONTH_MIN = 1;
export const YEAR_ONE_MONTH_MAX = 12;

/** Integer month in [1, 12]. Non-finite/out-of-range → clamped. */
export function clampYearOneMonth(value: number): number {
  if (!Number.isFinite(value)) return YEAR_ONE_MONTH_MIN;
  const rounded = Math.floor(value);
  if (rounded < YEAR_ONE_MONTH_MIN) return YEAR_ONE_MONTH_MIN;
  if (rounded > YEAR_ONE_MONTH_MAX) return YEAR_ONE_MONTH_MAX;
  return rounded;
}

/**
 * Advance the month by one, clamped at 12. Month 12 stays at 12
 * — the calendar does not wrap. Year-wrapping is a prestige-loop
 * concern (see witnessingIntegrations.ts) not a Year One concern.
 */
export function advanceYearOneMonth(current: number): number {
  return clampYearOneMonth(current + 1);
}

/**
 * Flag name raised when month N opens. Single place where the
 * `year_one_month_N_opened` convention is encoded.
 */
export function yearOneMonthFlag(month: number): string {
  return `year_one_month_${clampYearOneMonth(month)}_opened`;
}

/**
 * Month reader with a flag-scan fallback.
 *
 * Preference order:
 *   1. Explicit `yearOneMonth` field when finite
 *   2. Highest N in flags for which `year_one_month_N_opened` is truthy
 *   3. Default 1
 *
 * Pre-field saves keep working because the flag-scan walks
 * the same convention the old `inferYearOneMonth` helper used.
 */
export function deriveYearOneMonth(input: {
  yearOneMonth?: number | null;
  flags?: Record<string, unknown> | null;
}): number {
  if (
    typeof input.yearOneMonth === "number" &&
    Number.isFinite(input.yearOneMonth)
  ) {
    return clampYearOneMonth(input.yearOneMonth);
  }
  const flags = input.flags ?? {};
  for (let m = YEAR_ONE_MONTH_MAX; m >= YEAR_ONE_MONTH_MIN; m--) {
    if (flags[`year_one_month_${m}_opened`]) return m;
  }
  return YEAR_ONE_MONTH_MIN;
}
