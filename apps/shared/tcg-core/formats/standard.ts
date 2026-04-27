/**
 * Format definition.
 *
 * A Format specifies the deck construction rules for a particular play
 * mode. The validateDeck() function checks a deck against a Format to
 * determine legality before match queue entry.
 */

import type { SetCode } from "../sets/setCode";

export interface Format {
  id: string;
  name: string;
  /** Exact deck size including the general. */
  deckSize: number;
  /** Max copies of any single non-general card. */
  copyLimit: number;
  /** "strict" = only general's faction + neutrals; "none" = any card. */
  factionLock: "strict" | "none";
  /**
   * Which card set codes are legal. Empty = all sets allowed.
   * Set codes are typed in apps/shared/tcg-core/sets/setCode.ts.
   * The validator (validateDeck.ts) compares each card's resolved
   * `setCode` (loader-backfilled from id prefix) against this list.
   */
  allowedSets: SetCode[];
  /** Card definition ids that are banned in this format. */
  banlist: string[];
}

/**
 * Season 1 Standard format ("Memoir").
 *
 * 40-card deck (39 + general), max 3 copies, strict faction lock,
 * no banlist at launch. This is the only format for ranked + casual
 * PvP until the first expansion (Hierarchy of the Damned) ships.
 */
export const STANDARD_S1: Format = {
  id: "standard_s1",
  name: "Standard — Season 1",
  deckSize: 40,
  copyLimit: 3,
  factionLock: "strict",
  allowedSets: ["S1_MEMOIR"],
  banlist: [],
};

/**
 * Season 1 + Hierarchy of the Damned format.
 *
 * Same construction rules as STANDARD_S1; legal set list expands
 * to include the first expansion. This format becomes the default
 * for ranked queues once S2 ships and Memoir-only is preserved as
 * a "Throwback" mode for legacy play.
 *
 * NOTE: until S2 cards exist, this format is a no-op alias for
 * STANDARD_S1 — `allowedSets` includes S2_HIERARCHY but no cards
 * resolve to that set yet, so deck-builder validation behaves
 * identically.
 */
export const STANDARD_S1_HIERARCHY: Format = {
  id: "standard_s1_hierarchy",
  name: "Standard — Memoir + Hierarchy",
  deckSize: 40,
  copyLimit: 3,
  factionLock: "strict",
  allowedSets: ["S1_MEMOIR", "S2_HIERARCHY"],
  banlist: [],
};
