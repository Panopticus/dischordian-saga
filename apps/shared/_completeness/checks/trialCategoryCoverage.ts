/**
 * B8 — `trial_categories` coverage parity check.
 *
 * Every shipping unit / spell / artifact / structure card must declare
 * a non-empty `trial_categories` array, since cards without categories
 * are unplayable in the §5.8 Authority trial finale (per
 * docs/production/act1/authority-trial-phase-mechanic.md and the
 * apps/shared/tcg-core/types/Card.ts comment).
 *
 * Backfill is incomplete: at parity-test landing, ~468 of ~475 cards
 * have empty / absent trial_categories. The §5.8 runtime ships
 * behind a feature flag that requires 100% coverage.
 *
 * Tokens are excluded from the count — they don't enter via the
 * deck-builder pool and §5.8 never plays them as such; they spawn
 * mid-match via summon ops. (Match the existing tokenCard convention
 * by id-prefix — anything starting with `tok_` or `token_`.)
 *
 * Reserved cards (`reserved: true`) are also excluded — they're not
 * in the player's playable pool by definition.
 */
import { ALL_CARD_DEFINITIONS } from "../../tcg-core/cards/index";
import type { RawParityCount } from "../types";

function isToken(id: string): boolean {
  return id.startsWith("tok_") || id.startsWith("token_");
}

export function checkTrialCategoryCoverage(): RawParityCount {
  const eligible = ALL_CARD_DEFINITIONS.filter(
    (c) => !isToken(c.id) && !c.reserved,
  );
  const offenders: string[] = [];
  for (const card of eligible) {
    const cats = card.trial_categories;
    if (!cats || cats.length === 0) {
      offenders.push(`${card.id} (${card.name}): no trial_categories`);
    }
  }
  return {
    declared: eligible.length,
    implemented: eligible.length - offenders.length,
    missing: offenders,
  };
}
