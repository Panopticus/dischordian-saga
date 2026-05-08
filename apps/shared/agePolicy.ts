/**
 * Age-policy module — single source of truth shared by client + server
 * for "is this user old enough to use the app right now?"
 *
 * Audit/15.R4 — COPPA (US, 13+) and GDPR-K (EU, 16+ baseline; some
 * member states allow lower with parental consent but we adopt the
 * stricter baseline because (a) supporting parental-consent flows
 * triples the auth surface area and (b) most other jurisdictions
 * treat 16 as a defensible floor for an audience-mature product).
 *
 * This module is deliberately country-coded rather than IP-class-coded
 * so a bug in geo-detection can't silently weaken the policy: an
 * unknown country falls back to the GLOBAL 13+ rule, and the EU
 * country list is explicit.
 */

/** ISO 3166-1 alpha-2 country codes for EU member states + EEA + UK
 *  (UK kept for now because GDPR-aligned UK-DPA still applies the
 *  16+ default unless the data controller drops to 13). */
export const EEA_COUNTRY_CODES: ReadonlySet<string> = new Set([
  // EU member states (27)
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA non-EU
  "IS", "LI", "NO",
  // UK (post-Brexit, UK-GDPR aligns with EU on minimum age)
  "GB",
]);

export const GLOBAL_MIN_AGE = 13;
export const EEA_MIN_AGE = 16;

/** Minimum age that applies for a given country. Country may be
 *  null/empty when geo-detection failed; in that case we apply the
 *  EEA rule (stricter) as a fail-safe — better to over-restrict
 *  than under-restrict. */
export function minimumAgeForCountry(country: string | null | undefined): number {
  if (!country) return EEA_MIN_AGE;
  const upper = country.toUpperCase();
  if (EEA_COUNTRY_CODES.has(upper)) return EEA_MIN_AGE;
  return GLOBAL_MIN_AGE;
}

/** Compute age in years on a reference date, given an ISO yyyy-MM-dd
 *  date of birth. Returns null on malformed input. */
export function computeAgeYears(
  dobIso: string,
  on: Date = new Date(),
): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobIso);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  if (year < 1900 || year > on.getFullYear()) return null;
  if (month < 0 || month > 11) return null;
  if (day < 1 || day > 31) return null;
  const dob = new Date(Date.UTC(year, month, day));
  if (isNaN(dob.getTime())) return null;
  // Reject dates JS auto-corrected (e.g. Feb 30 → Mar 2).
  if (
    dob.getUTCFullYear() !== year ||
    dob.getUTCMonth() !== month ||
    dob.getUTCDate() !== day
  ) {
    return null;
  }
  let age = on.getUTCFullYear() - year;
  // Decrement by one if the birthday hasn't occurred yet this year.
  const beforeBirthday =
    on.getUTCMonth() < month ||
    (on.getUTCMonth() === month && on.getUTCDate() < day);
  if (beforeBirthday) age -= 1;
  return age;
}

export interface AgePolicyResult {
  allowed: boolean;
  /** The minimum-age rule that applied. */
  minAge: number;
  /** The user's computed age, or null on malformed DOB. */
  ageYears: number | null;
  /** Reason for the verdict — exposed for the UI message. */
  reason:
    | "ok"
    | "malformed_dob"
    | "below_min_age"
    | "country_restricted_below_min";
}

/** Verdict for an account given DOB + country. */
export function evaluateAgePolicy(
  dobIso: string,
  country: string | null | undefined,
  on: Date = new Date(),
): AgePolicyResult {
  const minAge = minimumAgeForCountry(country);
  const ageYears = computeAgeYears(dobIso, on);
  if (ageYears === null) {
    return { allowed: false, minAge, ageYears: null, reason: "malformed_dob" };
  }
  if (ageYears < minAge) {
    const isEea = !!country && EEA_COUNTRY_CODES.has(country.toUpperCase());
    return {
      allowed: false,
      minAge,
      ageYears,
      reason: isEea ? "country_restricted_below_min" : "below_min_age",
    };
  }
  return { allowed: true, minAge, ageYears, reason: "ok" };
}
