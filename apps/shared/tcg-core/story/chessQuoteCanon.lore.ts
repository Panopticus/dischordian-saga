/**
 * Chess Quote Canon — IN-WORLD (LORE) side.
 *
 * In-fiction authorities paired with real-world voices by theme
 * in `pairQuotes(theme)`. Every lore quote here should read like
 * the kind of line that would appear on a plaque above a
 * lecture hall in the Vaults of Celebration — pithy, cited, a
 * little smug.
 */

import type { QuoteTheme } from "./chessQuoteCanon.real";

export interface LoreQuote {
  id: string;
  /** In-world speaker. */
  figure: string;
  era: string;
  /** In-world source. */
  source: string;
  text: string;
  themes: readonly QuoteTheme[];
}

export const LORE_QUOTES: readonly LoreQuote[] = Object.freeze([
  {
    id: "iron_lion_kael_bridge",
    figure: "the Iron Lion",
    era: "Pre-Celebration",
    source: "Dispatches from Kael's Bridge",
    text: "Let them name the battle, and you have already chosen the ground.",
    themes: ["deception", "preparation"],
  },
  {
    id: "iron_lion_patience",
    figure: "the Iron Lion",
    era: "Pre-Celebration",
    source: "Dispatches from Kael's Bridge",
    text: "The quickest path across a field is the one the enemy has forgotten to defend.",
    themes: ["patience", "seeing"],
  },
  {
    id: "engineer_decks",
    figure: "the Engineer",
    era: "Early Celebration",
    source: "Notes on Decks",
    text: "A deck of cards is a chessboard that has been dealt a hand. The rules change. The discipline does not.",
    themes: ["design", "play"],
  },
  {
    id: "engineer_prince_sacrifice",
    figure: "the Engineer (the Prince)",
    era: "Celebration, pre-Fall",
    source: "letter to the Oracle",
    text: "I gave up the queen because the queen was an argument, and the argument had already been made.",
    themes: ["sacrifice"],
  },
  {
    id: "oracle_pattern",
    figure: "the Oracle",
    era: "Celebration, pre-Fall",
    source: "On Pattern",
    text: "Every system that has been seen twice has been seen forever. Watch what repeats.",
    themes: ["seeing", "preparation"],
  },
  {
    id: "oracle_mercy",
    figure: "the Oracle",
    era: "Celebration, pre-Fall",
    source: "On Pattern",
    text: "Mercy is what the winner offers when the losing player has already taught them something.",
    themes: ["mercy"],
  },
  {
    id: "molgarath_labyrinth",
    figure: "Mol'Garath the Unmaker",
    era: "contemporary",
    source: "Labyrinth Annotations (margin, in red ink)",
    text: "The maze is not the trap. The maze is the RECORD of every trap ever designed, played in order.",
    themes: ["design", "seeing"],
  },
  {
    id: "molgarath_tempo",
    figure: "Mol'Garath the Unmaker",
    era: "contemporary",
    source: "Labyrinth Annotations",
    text: "A tempo stolen from a god is worth twice the tempo you cost yourself.",
    themes: ["tempo"],
  },
  {
    id: "gm_curriculum_play",
    figure: "the Game Master",
    era: "Celebration, pre-death",
    source: "Chess Academy Curriculum, Year 9",
    text: "Games shape reality. It is how we learn.",
    themes: ["play", "design"],
  },
  {
    id: "gm_curriculum_patience",
    figure: "the Game Master",
    era: "Celebration, pre-death",
    source: "Chess Academy Curriculum, Year 3",
    text: "A move played ten minutes too early is a move played for the wrong game.",
    themes: ["patience", "tempo"],
  },
  {
    id: "gm_curriculum_restraint",
    figure: "the Game Master",
    era: "Celebration, pre-death",
    source: "Chess Academy Curriculum, Year 11",
    text: "The strongest move I know is the move I choose not to play.",
    themes: ["restraint", "mercy"],
  },
  {
    id: "xethraal_contracts",
    figure: "Xeth'Raal the Contract-Binder",
    era: "Hierarchy of the Damned, founding",
    source: "Clause XVII of the Standard Contract",
    text: "Promise the opponent a smaller prize than they are playing for.",
    themes: ["deception", "sacrifice"],
  },
]);

export function getLoreQuotesByTheme(theme: QuoteTheme): readonly LoreQuote[] {
  return LORE_QUOTES.filter((q) => q.themes.includes(theme));
}
