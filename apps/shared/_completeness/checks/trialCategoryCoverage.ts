/**
 * B8 — `trial_categories` coverage parity check.
 *
 * Every shipping unit / spell / artifact / structure card must declare
 * a non-empty `trial_categories` array, since cards without categories
 * are unplayable in the §5.8 Authority trial finale (per
 * docs/production/act1/authority-trial-phase-mechanic.md and the
 * apps/shared/tcg-core/types/Card.ts comment).
 *
 * Eligibility excludes:
 *   - **Tokens** (id prefix `tok_` / `token_`) — spawned mid-match by
 *     summon ops, never played from hand.
 *   - **Reserved cards** (`reserved: true`) — §4.9 burnt-card and
 *     similar retroactive deliveries; never in deck-builder pool.
 *   - **Generals** (`cardType: "general"`) — generals ARE the player
 *     in §5.8; they don't get played as cards.
 *   - **Warlord-only cards** (`warlord_only: true`) — §5.5 lockout
 *     mechanic, scripted opponent decks only, deck-builder filters
 *     them out of player pools.
 *
 * Anything else needs a non-empty `trial_categories`. The §5.8
 * runtime ships behind a feature flag that requires 100% coverage of
 * the remaining eligible set.
 */
import { ALL_CARD_DEFINITIONS } from "../../tcg-core/cards/index";
import type { CardDefinition } from "../../tcg-core/types/Card";
import type { RawParityCount } from "../types";

function isToken(id: string): boolean {
  return id.startsWith("tok_") || id.startsWith("token_");
}

function isEligibleForTrial(card: CardDefinition): boolean {
  if (isToken(card.id)) return false;
  if (card.reserved) return false;
  if (card.cardType === "general") return false;
  if (card.warlord_only) return false;
  return true;
}

export function checkTrialCategoryCoverage(): RawParityCount {
  const eligible = ALL_CARD_DEFINITIONS.filter(isEligibleForTrial);
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
