/**
 * Card flavor-quality parity check.
 *
 * audit/11.F4 — bulk boilerplate flavors ("Of the architect.",
 * "Outside every faction; visible to all.", etc.) ship as silent
 * placeholders. This check counts:
 *
 *   declared = total CardDefinitions with a non-null flavorText
 *   implemented = those whose flavorText is BOTH (a) longer than
 *     20 characters AND (b) does NOT match the boilerplate
 *     templates we sweep with scripts/replace-placeholder-flavors.ts.
 *
 * Wave 3.3 of the audit-fix pass replaced 409 boilerplate lines
 * (319 "Of the X." + 90 "Outside every faction…") with voice-pool
 * variants. Roughly 200 class/imprint/allegiance lines remain
 * ("class signature. The school speaks…" / "The oath holds; the
 * bearer remains." / "Another seat at another table…") and need
 * per-category pools — this check makes that visible as a ratchet.
 */
import type { RawParityCount } from "../types";
import { ALL_CARD_DEFINITIONS } from "../../tcg-core/cards";

const BOILERPLATE_PATTERNS: RegExp[] = [
  /^Of the (architect|dreamer|insurgency|new babylon|antiquarian|thought virus|panopticon|neutral)\.$/i,
  /^Outside every faction;?\s*visible to all\.?$/i,
  /^Another seat at another table that did not need to exist\.?$/i,
  /^The oath holds; the bearer remains\.?$/i,
  /^A class signature\.\s*The school speaks through every blade\.?$/i,
];

export function checkCardFlavorQuality(): RawParityCount {
  const cardsWithFlavor = ALL_CARD_DEFINITIONS.filter(
    (c) => typeof c.flavorText === "string" && c.flavorText.length > 0,
  );
  const offenders: string[] = [];
  for (const card of cardsWithFlavor) {
    const flavor = card.flavorText ?? "";
    if (flavor.length < 20) {
      offenders.push(`${card.id}: flavorText too short (<20 chars): "${flavor}"`);
      continue;
    }
    if (BOILERPLATE_PATTERNS.some((re) => re.test(flavor.trim()))) {
      offenders.push(`${card.id}: boilerplate flavor "${flavor}"`);
    }
  }
  return {
    declared: cardsWithFlavor.length,
    implemented: cardsWithFlavor.length - offenders.length,
    missing: offenders.slice(0, 10),
  };
}
