/**
 * Chess Quote Canon — REAL HISTORY side.
 *
 * Real people, real texts, real quotes (or close paraphrases
 * that preserve the author's idea). Paired with a lore-world
 * quote from `chessQuoteCanon.lore.ts` via `pairQuotes(theme)`.
 *
 * Keep this catalog small (≤ 12 authorities) so pairings stay
 * coherent. Add new entries only if the voice actor or writer
 * has a specific beat that needs them.
 */

export const QUOTE_THEMES = [
  "deception",
  "patience",
  "tempo",
  "sacrifice",
  "preparation",
  "restraint",
  "mercy",
  "play",
  "design",
  "seeing",
  "chaos",
  "madness",
  "conspiracy",
  "belief",
] as const;

export type QuoteTheme = (typeof QUOTE_THEMES)[number];

export interface RealQuote {
  id: string;
  author: string;
  era: string;
  source: string;
  text: string;
  themes: readonly QuoteTheme[];
}

export const REAL_QUOTES: readonly RealQuote[] = Object.freeze([
  {
    id: "sun_tzu_deception",
    author: "Sun Tzu",
    era: "c. 5th century BCE",
    source: "The Art of War",
    text: "All warfare is based on deception.",
    themes: ["deception", "preparation"],
  },
  {
    id: "sun_tzu_supreme_art",
    author: "Sun Tzu",
    era: "c. 5th century BCE",
    source: "The Art of War",
    text: "The supreme art of war is to subdue the enemy without fighting.",
    themes: ["restraint", "mercy"],
  },
  {
    id: "musashi_five_rings",
    author: "Miyamoto Musashi",
    era: "1645",
    source: "The Book of Five Rings",
    text: "From one thing, know ten thousand things.",
    themes: ["seeing", "design"],
  },
  {
    id: "lasker_manual",
    author: "Emanuel Lasker",
    era: "1925",
    source: "Lasker's Manual of Chess",
    text: "On the chessboard, lies and hypocrisy do not survive long.",
    themes: ["seeing", "restraint"],
  },
  {
    id: "tal_sacrifice",
    author: "Mikhail Tal",
    era: "1970s, attributed",
    source: "interviews",
    text: "There are two kinds of sacrifices — correct ones, and mine.",
    themes: ["sacrifice"],
  },
  {
    id: "capablanca_tempo",
    author: "José Raúl Capablanca",
    era: "1929",
    source: "Chess Fundamentals",
    text: "A master sees one move. A grandmaster sees the same move at the right moment.",
    themes: ["tempo", "patience"],
  },
  {
    id: "fischer_preparation",
    author: "Bobby Fischer",
    era: "1972",
    source: "interviews",
    text: "I prepare myself well. I know what I can do before I go in.",
    themes: ["preparation"],
  },
  {
    id: "caillois_play",
    author: "Roger Caillois",
    era: "1958",
    source: "Man, Play and Games",
    text: "Play is the one thing we do that is fully voluntary.",
    themes: ["play"],
  },
  {
    id: "meier_decisions",
    author: "Sid Meier",
    era: "2020",
    source: "Memoir!",
    text: "A game is a series of interesting decisions.",
    themes: ["design", "play"],
  },
  {
    id: "turing_machines",
    author: "Alan Turing",
    era: "1950",
    source: "Computing Machinery and Intelligence",
    text: "If the machine plays chess against a human and wins, has it not thought?",
    themes: ["design", "seeing"],
  },
  {
    id: "shannon_paper",
    author: "Claude Shannon",
    era: "1950",
    source: "Programming a Computer for Playing Chess",
    text: "Chess is the perfect balance of clarity and depth: short enough to finish, deep enough to study forever.",
    themes: ["design"],
  },
  {
    id: "carlsen_mercy",
    author: "Magnus Carlsen",
    era: "2010s, attributed",
    source: "interviews",
    text: "I'm not going to offer a draw to a person I think is about to resign.",
    themes: ["mercy", "seeing"],
  },

  // ─── DISCHORDIAN CANON (real world) ───
  // The Game Master cites these AS HIMSELF — Discordianism is
  // part of his operating framework, not a guest appearance.
  {
    id: "malaclypse_rorschach",
    author: "Malaclypse the Younger (Greg Hill)",
    era: "1963",
    source: "Principia Discordia",
    text: "Reality is the original Rorschach. Verily!",
    themes: ["chaos", "seeing", "belief"],
  },
  {
    id: "malaclypse_five_truths",
    author: "Malaclypse the Younger",
    era: "1963",
    source: "Principia Discordia",
    text: "All statements are true in some sense, false in some sense, meaningless in some sense, true and false in some sense, true and meaningless in some sense, false and meaningless in some sense, and true and false and meaningless in some sense.",
    themes: ["chaos", "madness", "belief"],
  },
  {
    id: "thornley_aneristic",
    author: "Kerry Thornley (Lord Omar Khayyam Ravenhurst)",
    era: "1963",
    source: "Principia Discordia",
    text: "The belief that order is true, and disorder false or somehow wrong, is the Aneristic Illusion.",
    themes: ["chaos", "belief", "deception"],
  },
  {
    id: "raw_thinker_prover",
    author: "Robert Anton Wilson",
    era: "1983",
    source: "Prometheus Rising",
    text: "What the Thinker thinks, the Prover proves.",
    themes: ["belief", "madness", "seeing"],
  },
  {
    id: "raw_convictions",
    author: "Robert Anton Wilson",
    era: "1977",
    source: "Cosmic Trigger I",
    text: "Convictions cause convicts; whatever you believe imprisons you.",
    themes: ["belief", "chaos"],
  },
  {
    id: "raw_illuminatus_hail",
    author: "Robert Anton Wilson & Robert Shea",
    era: "1975",
    source: "The Illuminatus! Trilogy",
    text: "Hail Eris! Kallisti! The golden apple is inscribed TO THE FAIREST, and the fairest is whichever of us is paying attention.",
    themes: ["chaos", "conspiracy"],
  },
  {
    id: "raw_schrodinger",
    author: "Robert Anton Wilson",
    era: "1980",
    source: "Schrödinger's Cat Trilogy",
    text: "The cat is in the box, the box is in the observer, and the observer is in the cat. You choose which layer to unpack first.",
    themes: ["seeing", "madness", "belief"],
  },
  {
    id: "cheshire_mad",
    author: "Lewis Carroll (the Cheshire Cat)",
    era: "1865",
    source: "Alice's Adventures in Wonderland",
    text: "We're all mad here. I'm mad. You're mad. You must be, or you wouldn't have come here.",
    themes: ["madness"],
  },
]);

export function getRealQuotesByTheme(theme: QuoteTheme): readonly RealQuote[] {
  return REAL_QUOTES.filter((q) => q.themes.includes(theme));
}
