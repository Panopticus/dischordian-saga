/**
 * Username/display-name policy: normalisation, reserved-name guard,
 * homoglyph-collapse for uniqueness comparison.
 *
 * Why:
 *   - Without NFKC, an attacker can register a name that *renders*
 *     identically to "admin" but compares differently
 *     (e.g. "аdmin" with Cyrillic а U+0430).
 *   - Without a reserved-name list, anyone can grab "admin",
 *     "support", "staff", "system", etc.
 *   - Without homoglyph collapse, lookalike duplicates
 *     ("rаcho" vs "racho") survive uniqueness checks.
 *
 * This module is shared so client-side preview validation, server-side
 * write-time enforcement, and analytics queries all agree.
 */

const RESERVED_NAMES: ReadonlySet<string> = new Set([
  "admin",
  "administrator",
  "moderator",
  "mod",
  "support",
  "staff",
  "system",
  "root",
  "owner",
  "official",
  "anonymous",
  "guest",
  "loredex",
  "dischordian",
  "panopticon",
  "watcher",
  "architect",
  "elara",
  "claude",
  "deleted",
  "banned",
  // Add taunt/impersonation names as they come up.
]);

// Map of common homoglyphs → ASCII equivalents. Used only for
// uniqueness comparison and reserved-name detection — the user's
// actual stored name preserves their chosen characters (after NFKC).
const HOMOGLYPH_MAP: Record<string, string> = {
  "а": "a", // Cyrillic а
  "е": "e", // Cyrillic е
  "о": "o", // Cyrillic о
  "р": "p", // Cyrillic р
  "с": "c", // Cyrillic с
  "х": "x", // Cyrillic х
  "у": "y", // Cyrillic у
  "ӏ": "l", // Cyrillic palochka
  "ο": "o", // Greek omicron
  "α": "a", // Greek alpha
  "ε": "e", // Greek epsilon
  "ν": "v", // Greek nu (looks like v in some fonts)
  "​": "",  // zero-width space
  "‌": "",  // zero-width non-joiner
  "‍": "",  // zero-width joiner
  "﻿": "",  // BOM
  " ": " ", // nbsp → space
  "1": "l",
  "0": "o",
};

/**
 * Normalise a display name. Strips zero-widths/BOM, NFKC-normalises
 * to fold compatibility variants (e.g. ﬃ → ffi), trims, collapses
 * internal whitespace.
 */
export function normalizeDisplayName(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[​-‍﻿]/g, "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Compute the comparison key for uniqueness/reserved checks. Lower-
 * cased, homoglyph-collapsed, alphanumeric-only. Two names that map
 * to the same key are treated as equivalent for collision purposes.
 */
export function comparisonKey(name: string): string {
  const normalized = normalizeDisplayName(name).toLowerCase();
  let out = "";
  for (const ch of normalized) {
    const mapped = HOMOGLYPH_MAP[ch];
    out += mapped !== undefined ? mapped : ch;
  }
  // Strip non-alphanumeric — "_admin_" still hits "admin".
  return out.replace(/[^a-z0-9]/g, "");
}

export interface ValidationResult {
  ok: boolean;
  /** Normalised name to actually store, if ok. */
  normalized?: string;
  /** Reason key — useful for i18n on the client. */
  reason?: "too_short" | "too_long" | "reserved" | "invalid_chars" | "homoglyph_reserved";
}

const MIN_LENGTH = 2;
const MAX_LENGTH = 32;

export function validateDisplayName(raw: string | null | undefined): ValidationResult {
  if (!raw) return { ok: false, reason: "too_short" };
  const normalized = normalizeDisplayName(raw);
  if (normalized.length < MIN_LENGTH) return { ok: false, reason: "too_short" };
  if (normalized.length > MAX_LENGTH) return { ok: false, reason: "too_long" };

  // Allow letters, numbers, spaces, and a small punctuation set.
  // This rejects control characters, RTL overrides, and most
  // homoglyph attack vectors at the charset level.
  if (!/^[\p{L}\p{N} _.\-']+$/u.test(normalized)) {
    return { ok: false, reason: "invalid_chars" };
  }

  const key = comparisonKey(normalized);
  if (RESERVED_NAMES.has(key)) {
    // Distinguish "the literal name is reserved" from "the homoglyph
    // collapse hits a reserved name" so we can log differently —
    // the second is more often an intentional impersonation attempt.
    if (RESERVED_NAMES.has(normalized.toLowerCase())) {
      return { ok: false, reason: "reserved" };
    }
    return { ok: false, reason: "homoglyph_reserved" };
  }
  return { ok: true, normalized };
}

export function isReservedName(name: string): boolean {
  return RESERVED_NAMES.has(comparisonKey(name));
}
