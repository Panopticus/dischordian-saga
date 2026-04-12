/**
 * Format definition.
 *
 * A Format specifies the deck construction rules for a particular play
 * mode. The validateDeck() function checks a deck against a Format to
 * determine legality before match queue entry.
 */

export interface Format {
  id: string;
  name: string;
  /** Exact deck size including the general. */
  deckSize: number;
  /** Max copies of any single non-general card. */
  copyLimit: number;
  /** "strict" = only general's faction + neutrals; "none" = any card. */
  factionLock: "strict" | "none";
  /** Which card set ids are legal. Empty = all sets allowed. */
  allowedSets: string[];
  /** Card definition ids that are banned in this format. */
  banlist: string[];
}

/**
 * Season 1 Standard format.
 *
 * 40-card deck (39 + general), max 3 copies, strict faction lock,
 * no banlist at launch. This is the only format for ranked + casual
 * PvP until a second expansion ships.
 */
export const STANDARD_S1: Format = {
  id: "standard_s1",
  name: "Standard — Season 1",
  deckSize: 40,
  copyLimit: 3,
  factionLock: "strict",
  allowedSets: ["s1"],
  banlist: [],
};
