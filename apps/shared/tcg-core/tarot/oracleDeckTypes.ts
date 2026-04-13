/**
 * Oracle Deck — types (Phase E1a).
 *
 * In-lore origin:
 *   The 23-card Oracle Deck was designed in a single all-nighter
 *   by the White Oracle and the Engineer, in the weeks before the
 *   Oracle's final mission. She provided the symbolic framework —
 *   23 archetypes, one per major actor in the Dischordian Saga,
 *   plus the Fnord (the card that is not there) as an homage to
 *   Robert Anton Wilson and the 23 Enigma. He coded the probability
 *   engine — a deterministic pseudo-random draw seeded on the
 *   player's user id and the current day, so every player's daily
 *   reading is unique but reproducible.
 *
 *   Design references the Oracle cited at the time:
 *   - Aleister Crowley's Thoth Deck (22 Major Arcana, rejecting
 *     Rider-Waite's moralism in favor of a scientific / magical
 *     framework — kabbalistic, astrological, elemental)
 *   - Robert Anton Wilson's Illuminatus! / Schrödinger's Cat
 *     trilogy, the Law of Fives, the 23 Enigma, Hagbard Celine,
 *     and the maxim "belief is the death of intelligence"
 *   - I Ching — 64 hexagrams and the 4-coin-toss probability
 *     engine, which the Engineer considered the "right ancestor"
 *     for the deterministic draw
 *
 *   The Oracle specifically REJECTED the 78-card Rider-Waite
 *   shape. She wanted 23 because it forced the deck to collapse
 *   archetypes into the people who actually mattered in the Saga.
 *   "A deck with 78 positions," she said, "is a deck that doesn't
 *   know who the players are. Ours knows."
 */

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

/** Which traditional Major Arcana archetype a card maps to.
 *  The Fnord maps to `"fnord"` — it has no traditional equivalent
 *  and is RAW's contribution to the deck. */
export type OracleArcanum =
  | "fool"
  | "magician"
  | "high_priestess"
  | "empress"
  | "emperor"
  | "hierophant"
  | "lovers"
  | "chariot"
  | "justice"
  | "hermit"
  | "fortune"
  | "strength"
  | "hanged_man"
  | "death"
  | "temperance"
  | "devil"
  | "tower"
  | "star"
  | "moon"
  | "sun"
  | "judgment"
  | "world"
  | "fnord";

/** Which milestone class unlocks a given Oracle card into the
 *  player's collection. Earning the card is the long-term chase
 *  — a complete 23-card deck is a Season-1 completion goal. */
export type OracleUnlockKind =
  | "chapter_complete"    // finish a story chapter
  | "faction_allegiance"  // reach X wins with a faction
  | "game_mode_master"    // win a specific game mode N times
  | "companion_bond"      // max a companion relationship
  | "lore_milestone"      // discover a specific lore entry
  | "governance_vote"     // participate in a vote
  | "chess_tutorial"      // complete the chess academy
  | "seasonal_event"      // triggered by a live event
  | "hidden";             // requires a secret discovery

/** The specific milestone that unlocks a card. */
export interface OracleUnlockCondition {
  kind: OracleUnlockKind;
  /** The value the game checks against — chapter id, faction id,
   *  mode name, companion id, entry id, vote id, etc. */
  value: string;
  /** Human-readable description shown in the collection view
   *  ("Complete Chapter 3", "Win 10 matches with Insurgency"). */
  label: string;
}

/** The match-scoped buff a card applies when it lands in a
 *  pre-match reading. Deliberately small — Oracle readings are
 *  flavor-first; they should nudge a match, not decide it. */
export interface OracleBuff {
  /** Displayed on the card in the reading UI. */
  label: string;
  /** Keyed effect the match init reads. Unknown keys are ignored
   *  gracefully (forward-compatible with new effects). */
  effect:
    | { kind: "extra_mana"; amount: number }
    | { kind: "extra_cards"; amount: number }
    | { kind: "general_hp"; amount: number }
    | { kind: "first_unit_buff"; power: number; health: number }
    | { kind: "mulligan_extra"; amount: number }
    | { kind: "dream_token_bonus"; percent: number }
    | { kind: "reroll_one_card" }
    | { kind: "fnord_secret" }; // Only The Fnord card uses this.
}

/** A single Oracle card. */
export interface OracleCard {
  /** 0-22. The Fnord is 22. */
  id: number;
  /** Stable string id used in URLs and the schema. */
  slug: string;
  /** Display name in the Dischordian framing. */
  name: string;
  /** Traditional Major Arcana equivalent. */
  arcanum: OracleArcanum;
  /** ~50 word evocation of what this archetype means in the
   *  Saga. Shown on the card face in the reading UI. */
  loreBlurb: string;
  /** Upright meaning — 1 sentence. */
  uprightMeaning: string;
  /** Reversed meaning — 1 sentence. Reversed cards grant a
   *  smaller / inverted buff in pre-match readings. */
  reversedMeaning: string;
  /** The buff applied when this card lands in a reading. */
  buff: OracleBuff;
  /** The Oracle's original lab-notebook annotation from the
   *  night she and the Engineer designed the deck. Shown in
   *  the "creator notes" side of the collection card. */
  oracleNote: string;
  /** The Engineer's technical margin note from the same
   *  notebook — usually something wry or mathematical. */
  engineerNote: string;
  /** How a player earns a copy of this card. */
  unlock: OracleUnlockCondition;
  /** Art reference id for the illustration. */
  artRef?: string;
}

/* ═══════════════════════════════════════════════════════
   REGISTRY TYPES
   ═══════════════════════════════════════════════════════ */

/** All Oracle cards in draw order (0-22). Assembled in
 *  oracleDeck.ts from the per-batch files. */
export type OracleDeck = readonly OracleCard[];

/** Helper: find a card by slug or numeric id. */
export interface OracleDeckLookup {
  getBySlug(slug: string): OracleCard | undefined;
  getById(id: number): OracleCard | undefined;
}
