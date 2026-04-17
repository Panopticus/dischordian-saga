/**
 * Reserved-card filter helpers.
 *
 * A "reserved" card loads into the CardRegistry (so the engine can
 * resolve its effects if the card lands via a scripted route) but
 * must NOT appear in any player-facing pool — deck-builder,
 * pack-opening, reward drops, market listings, etc. Every surface
 * that enumerates cards for the player runs the pool through
 * `filterReservedFromPool()` first.
 *
 * Current reserved set: {burnt_card_placeholder}. Spec §4.9 §3.3
 * requires that card be not-discoverable on first playthrough; it
 * lands in the player's Act 1 deck only via an Acts 2+ unlock
 * route that writes it in directly.
 *
 * See CardDefinition.reserved in types/Card.ts.
 */

import type { CardDefinition } from "../types/Card";

/** True when the card is flagged reserved-from-pools. */
export function isReservedCard(
  def: Pick<CardDefinition, "reserved">,
): boolean {
  return def.reserved === true;
}

/** Return a new array with reserved cards removed. Identity-preserving
 *  on the remaining cards — no copies, no mutation of input. */
export function filterReservedFromPool<T extends Pick<CardDefinition, "reserved">>(
  pool: readonly T[],
): T[] {
  return pool.filter((d) => !isReservedCard(d));
}
