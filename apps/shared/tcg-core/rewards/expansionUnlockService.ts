/**
 * Expansion Unlock Service.
 *
 * Dispatcher for `CardDefinition.unlockCondition`. Cards in the
 * registry whose unlockCondition is set are NOT discoverable in
 * the deck-builder, pack-opening pool, or reward grants until the
 * gate is satisfied for the active player.
 *
 * Backed by a pure-function evaluator over a `PlayerExpansionState`
 * snapshot. No server wiring is performed here; consumer code (deck
 * builder, pack-opening service, etc.) calls
 * `isCardUnlocked(def, state)` before exposing a card.
 *
 * Currently consumed by:
 *   - apps/shared/tcg-core/cards/definitions/s2_hierarchy/** (124
 *     cards: 28 act-exclusive, 7 secret, 3 author-special).
 *
 * Pure / serializable / no I/O — runs in both client and server.
 */
import type {
  CardDefinition,
  CardUnlockCondition,
} from "../types/Card";

/**
 * Player progression snapshot consulted by every unlock evaluator.
 * Each consumer is responsible for sourcing this from its own
 * persistence layer (server: durable storage; client: cached copy
 * over websocket).
 */
export interface PlayerExpansionState {
  /** Acts the player has completed (1..7). */
  readonly completedActs: ReadonlySet<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  /** Acts whose secret-reveal path the player has triggered (1..7). */
  readonly secretActsRevealed: ReadonlySet<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  /** Highest battle-pass tier the player has reached (S2). */
  readonly battlePassTier: number;
  /** True if the player is a S2 founding-author entitlement holder. */
  readonly hasFoundingAuthor: boolean;
  /** True if the player owns the S2 author's edition. */
  readonly hasAuthorsEditionS2: boolean;
}

/** Default snapshot — nothing unlocked. Useful for tests + unauth flows. */
export const NULL_PLAYER_EXPANSION_STATE: PlayerExpansionState = Object.freeze({
  completedActs: new Set<never>(),
  secretActsRevealed: new Set<never>(),
  battlePassTier: 0,
  hasFoundingAuthor: false,
  hasAuthorsEditionS2: false,
});

/**
 * Evaluate a single CardUnlockCondition against the player snapshot.
 * Returns `true` iff the gate is satisfied.
 */
export function evaluateUnlockCondition(
  cond: CardUnlockCondition,
  state: PlayerExpansionState,
): boolean {
  switch (cond.kind) {
    case "act_completion":
      return state.completedActs.has(cond.act);
    case "secret":
      return state.secretActsRevealed.has(cond.act);
    case "battle_pass":
      return state.battlePassTier >= cond.tier;
    case "founding_author":
      return state.hasFoundingAuthor;
    case "authors_edition":
      // Only "s2" is currently defined in the type union.
      return cond.season === "s2" ? state.hasAuthorsEditionS2 : false;
  }
}

/**
 * True iff the card is unlocked for the active player. Cards without
 * an unlockCondition are always unlocked (by the absence of a gate).
 */
export function isCardUnlocked(
  card: CardDefinition,
  state: PlayerExpansionState,
): boolean {
  if (!card.unlockCondition) return true;
  return evaluateUnlockCondition(card.unlockCondition, state);
}

/**
 * Filter helper. Returns the subset of cards the active player can
 * see. Use this on every card-enumeration surface (deck builder,
 * pack pool, reward grant menu) — the same way `isReservedCard()`
 * is used today.
 */
export function filterUnlockedCards(
  cards: readonly CardDefinition[],
  state: PlayerExpansionState,
): CardDefinition[] {
  return cards.filter((c) => isCardUnlocked(c, state));
}

/**
 * Inverse of filterUnlockedCards — surfaces cards still locked. Useful
 * for "X cards remaining to unlock" UI cues.
 */
export function filterLockedCards(
  cards: readonly CardDefinition[],
  state: PlayerExpansionState,
): CardDefinition[] {
  return cards.filter((c) => !isCardUnlocked(c, state));
}

/**
 * Convenience constructor: partial-state -> full state with sane
 * defaults. Saves a lot of `new Set([1,2,3])` boilerplate at call
 * sites + tests.
 */
export function makePlayerExpansionState(
  partial: Partial<{
    completedActs: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7>;
    secretActsRevealed: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7>;
    battlePassTier: number;
    hasFoundingAuthor: boolean;
    hasAuthorsEditionS2: boolean;
  }>,
): PlayerExpansionState {
  return {
    completedActs: new Set(partial.completedActs ?? []),
    secretActsRevealed: new Set(partial.secretActsRevealed ?? []),
    battlePassTier: partial.battlePassTier ?? 0,
    hasFoundingAuthor: partial.hasFoundingAuthor ?? false,
    hasAuthorsEditionS2: partial.hasAuthorsEditionS2 ?? false,
  };
}
