/**
 * Puzzle of the Day — Celebration GM one-line intros.
 *
 * The existing chessPuzzles bank tags each puzzle with a theme
 * ("fork", "pin", "mate_in_2", etc.). The daily-puzzle page picks
 * one puzzle for today and shows it with an intro line from the
 * Celebration GM that teaches the THEME, not the puzzle. The
 * player learns why the puzzle matters before they start solving.
 *
 * Each theme has 3-5 alternate lines. Selection is deterministic
 * from the date so the same day's puzzle always shows the same
 * intro.
 */

export const PUZZLE_THEMES = [
  "fork",
  "pin",
  "skewer",
  "discovered_attack",
  "mate_in_2",
  "mate_in_3",
  "back_rank",
  "zwischenzug",
  "prophylaxis",
  "sacrifice",
  "endgame",
  "opening_trap",
] as const;

export type PuzzleTheme = (typeof PUZZLE_THEMES)[number];

const INTROS: Readonly<Record<PuzzleTheme, readonly string[]>> = Object.freeze({
  fork: [
    "Today's puzzle is about the FORK — one piece, two threats, one forced response. Gate 5. You know this one.",
    "A fork problem. The knight is the classic forking piece, but the queen forks too, and so does the pawn on its penultimate square. Find whichever one the position has hidden for you.",
    "Forks feel like cheating the first time you spot them. By the tenth time they feel like arithmetic.",
  ],
  pin: [
    "Pin puzzle. Look for the piece that cannot move without losing something bigger behind it. Gate 5.",
    "Pins are straight lines — rank, file, or diagonal. Only bishops, rooks, and queens can create them. That narrows the search considerably.",
    "Absolute pins (king behind) and relative pins (piece behind) have different price tags. Know which one you are attacking.",
  ],
  skewer: [
    "The pin's impatient cousin. A skewer drives the valuable piece out of the way first, then captures whatever was behind it. Find the line.",
    "Skewers are usually material-winning because the front piece has to move. The defender picks which piece to lose; the attacker took what was left behind.",
  ],
  discovered_attack: [
    "Discovered attack — move one piece, reveal a threat from the piece behind it. Two threats, one move, one forced response.",
    "When the piece you move ALSO gives check, you have a discovered check — the strongest form of this tactic, because the enemy king must respond and cannot capture the attacker.",
  ],
  mate_in_2: [
    "Mate in two. The first move is usually a quiet move that sets up an unstoppable threat. Look for the move your opponent CANNOT answer.",
    "Mate in two. The trick is usually that the key move doesn't look like an attack — it looks like a positional adjustment. Look for the move that restricts the enemy king's squares.",
  ],
  mate_in_3: [
    "Mate in three. Calculate the forced line all the way through. If your last move does not deliver mate, the tree was wrong — back up one branch.",
  ],
  back_rank: [
    "Back-rank mate. The king's own pawns are the prison. The rook or queen is the key. Gate 2.",
    "Look at the enemy king's back rank. If his pawns are still on the seventh rank and no pieces defend the eighth, the mate is one tempo away.",
  ],
  zwischenzug: [
    "Zwischenzug — 'in-between move' in German. You play a move that MUST be answered before the main sequence resumes. Usually a check, or a threat that cannot be ignored.",
    "The zwischenzug is a mid-combination interruption. The defender thought you were trading; you interpolated a move that flipped the balance. Calculate patiently.",
  ],
  prophylaxis: [
    "Prophylaxis — the move that does nothing, and wins the game. Anticipate what your opponent wants to do, and take the squares or tempo they need.",
    "The prophylactic move is invisible to beginners and obvious to masters. You are being trained to see what the enemy wants and to take it before they arrive.",
  ],
  sacrifice: [
    "Sacrifice puzzle. Give up material, win something larger. Tal's favorite flavor of problem. Follow the force.",
    "Sacrifices feel reckless. A correct sacrifice is deterministic — every defender's reply is forced, every branch ends the same way. Calculate before you believe.",
  ],
  endgame: [
    "Endgame puzzle. Gate 6. Opposition, the square of the pawn, or Lucena — one of the three idioms is hidden here. Find which.",
  ],
  opening_trap: [
    "Opening trap. The whole trick is in the first seven moves. Your opponent broke a principle from Gate 4 and there is a concrete punishment for it. Find it.",
  ],
});

/** Deterministic per-day intro selection: hash the theme + date
 *  to pick an alternate. Same date + same theme → same intro. */
export function pickPuzzleIntro(
  theme: PuzzleTheme,
  dateKey: string, // e.g. "2026-04-21"
): string {
  const alternates = INTROS[theme];
  let h = 2166136261 >>> 0;
  const seed = `${theme}|${dateKey}`;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return alternates[h % alternates.length];
}
