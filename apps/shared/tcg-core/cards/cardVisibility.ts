/**
 * Player-visible card filter — single predicate covering both gates.
 *
 * Two independent rules decide whether a card may surface in a
 * player-facing pool (deck-builder, pack opening, reward grant menu,
 * market listing, etc.):
 *
 *   1. **`reserved: true`** — the card is engine-loadable but never
 *      surfaces in any pool. Permanent. (See `reservedCards.ts`,
 *      `CardDefinition.reserved`.)
 *   2. **`unlockCondition`** — the card is gated behind a player
 *      progression milestone (act completion, secret reveal, battle
 *      pass tier, founding-author entitlement, etc.). Per-player.
 *      (See `rewards/expansionUnlockService.ts`,
 *      `CardDefinition.unlockCondition`.)
 *
 * A card is **visible** when it passes BOTH rules. Every new
 * card-enumeration surface should call `filterPlayerVisibleCards()`
 * with the active player's `PlayerExpansionState` rather than
 * remembering to chain `filterReservedFromPool` → `filterUnlockedCards`
 * (which is a foot-gun: forget either and an unrelated content surface
 * leaks reserved or locked cards).
 */

import type { CardDefinition } from "../types/Card";
import { isReservedCard } from "./reservedCards";
import {
  type PlayerExpansionState,
  isCardUnlocked,
  NULL_PLAYER_EXPANSION_STATE,
} from "../rewards/expansionUnlockService";

/** True iff the card may surface in a player-facing pool for this player. */
export function isVisibleToPlayer(
  def: CardDefinition,
  state: PlayerExpansionState = NULL_PLAYER_EXPANSION_STATE,
): boolean {
  return !isReservedCard(def) && isCardUnlocked(def, state);
}

/**
 * Identity-preserving filter: returns the subset of `pool` visible to
 * the active player. No copies of the card definitions, no mutation
 * of input.
 */
export function filterPlayerVisibleCards(
  pool: readonly CardDefinition[],
  state: PlayerExpansionState = NULL_PLAYER_EXPANSION_STATE,
): CardDefinition[] {
  return pool.filter((def) => isVisibleToPlayer(def, state));
}
