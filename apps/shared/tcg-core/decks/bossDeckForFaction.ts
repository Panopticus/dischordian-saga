/**
 * Chapter boss-deck selector.
 *
 * The ch1-ch12 encounters in story/chapters.ts historically used
 * synthetic `boss_ch{N}_{0..38}` placeholder ids via bossDeck(prefix).
 * The engine tolerated the unknown defIds (init.ts falls back to
 * 0/1 stats) so matches ran, but every opponent card on the board
 * was a blank 0/1 with no ability. This module replaces the
 * placeholder with a faction-appropriate 39-card deck pulled from
 * existing registry cards.
 *
 * Uses STARTER_DECK_MAP for the six factions that ship with starter
 * decks. Supplies a custom panopticon deck built from the eight
 * authored s1_char_050-057 Panopticon cards.
 *
 * Consumers: story/chapters.ts ch1-ch12 entries. The Cycle C
 * encounters (chSeerVisit, chProgrammerGift, chGameMaster) are
 * neutral-faction and use NEUTRAL_CYCLE_C_BOSS_DECK directly.
 */

import { STARTER_DECK_MAP } from "./starterDecks";

function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** Authored panopticon 39-card deck (8 cards x repeats, padded). */
const PANOPTICON_BOSS_DECK: readonly string[] = Object.freeze([
  ...x("s1_char_050", 5), // Warden Prime
  ...x("s1_char_051", 5), // Oculus Sentinel
  ...x("s1_char_052", 5), // Compliance Officer
  ...x("s1_char_053", 5), // Data Harvester
  ...x("s1_char_054", 5), // Panoptic Drone
  ...x("s1_char_055", 5), // Thought Censor
  ...x("s1_char_056", 5), // Registry Clerk
  ...x("s1_char_057", 4), // Blacksite Interrogator (39th)
]);

// Compile-time deck-size invariant.
const _panopticonSize: 39 = PANOPTICON_BOSS_DECK.length as 39;

/**
 * Return a real 39-card deck for the given faction. Uses starter
 * decks when available; falls back to a curated authored deck for
 * factions that don't ship a starter (panopticon).
 *
 * Unknown factions fall back to the architect starter — matches
 * the engine's conservative "unknown input → known default"
 * convention used by the AI / scripted actions layers.
 */
export function bossDeckForFaction(faction: string): readonly string[] {
  const starter = STARTER_DECK_MAP[faction];
  if (starter) return starter.cardDefIds;
  if (faction === "panopticon") return PANOPTICON_BOSS_DECK;
  // Last-resort fallback. Architect starter is the most "generic"
  // deck shape in the canon.
  return STARTER_DECK_MAP["architect"].cardDefIds;
}
