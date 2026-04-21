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

  // ─── DISCHORDIAN LOGIC IN-WORLD ───
  {
    id: "gm_rorschach",
    figure: "the Game Master",
    era: "Celebration, pre-death",
    source: "Chess Academy Curriculum, Year 14",
    text: "The board is honest. Your reading of the board is not. Both of these are true and neither is a problem.",
    themes: ["chaos", "seeing", "belief"],
  },
  {
    id: "gm_sacred_chao",
    figure: "the Game Master",
    era: "Celebration, pre-death",
    source: "Chess Academy Curriculum, Year 17",
    text: "The Chao is the Rorschach after you stop lying to yourself about seeing only one thing in it.",
    themes: ["chaos", "madness"],
  },
  {
    id: "gm_fnord",
    figure: "the Game Master",
    era: "Celebration, marginalia",
    source: "marginalia on a student's notebook",
    text: "You are not seeing the fnords yet. That is a good sign. When you do, do not tell anyone who is still pretending.",
    themes: ["madness", "conspiracy"],
  },
  {
    id: "engineer_door",
    figure: "the Engineer",
    era: "post-Labyrinth, in his workshop",
    source: "Labyrinth Annotations, margin, in his hand",
    text: "I believed there was a door. The door turned out to be where I was looking. QED.",
    themes: ["belief", "design"],
  },
  {
    id: "engineer_bavarian",
    figure: "the Engineer",
    era: "Celebration-era pamphlet",
    source: "unsigned pamphlet, Inception Ark library",
    text: "Bavarian shadows in the code. Keep looking. If they aren't there, you haven't looked at the right code yet.",
    themes: ["conspiracy", "seeing"],
  },
  {
    id: "gm_cheshire",
    figure: "the Game Master",
    era: "across the entire curriculum",
    source: "said at least once per gate",
    text: "We're all mad here. Especially the ones insisting they are not. You will be, too, by the time we finish.",
    themes: ["madness"],
  },
  {
    id: "antiquarian_eris",
    figure: "the Antiquarian",
    era: "fragment 17",
    source: "loose page cross-referenced with the GM Curriculum",
    text: "The goddess of discord does not break the wedding. She tells you it was already broken.",
    themes: ["chaos"],
  },
  {
    id: "gm_belief_instrument",
    figure: "the Game Master",
    era: "Celebration-era lectures",
    source: "recorded by a student in the second row",
    text: "Belief is a chisel. Most people carry it like a talisman. It does not work as a talisman. It works as a chisel.",
    themes: ["belief", "design"],
  },
]);

export function getLoreQuotesByTheme(theme: QuoteTheme): readonly LoreQuote[] {
  return LORE_QUOTES.filter((q) => q.themes.includes(theme));
}
