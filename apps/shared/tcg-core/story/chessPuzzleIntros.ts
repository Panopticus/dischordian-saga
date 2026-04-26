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
    "Family fork — a knight check that ALSO attacks the queen, the rook, and possibly your dignity. The defender saves the king first because the rules require it. Whatever else the knight was attacking is yours.",
    "The Engineer used to draw forks on napkins as proofs that two truths can be punished by one move. He won three Hierarchy negotiations that way and never explained how. Find the napkin in this position.",
    "A fork is geometry, not cleverness. You are looking for a square that touches both pieces with the same move. The square is on the board. Find it before the position resolves itself.",
  ],
  pin: [
    "Pin puzzle. Look for the piece that cannot move without losing something bigger behind it. Gate 5.",
    "Pins are straight lines — rank, file, or diagonal. Only bishops, rooks, and queens can create them. That narrows the search considerably.",
    "Absolute pins (king behind) and relative pins (piece behind) have different price tags. Know which one you are attacking.",
    "The pinned piece is not on the board for the next three moves — treat the position as if it were already gone. Then ask what your other pieces can do with the extra tempo.",
    "Capablanca said a pin won the game before he understood what won it. Most amateurs see the pin and stop. Masters see the pin and ask what it permits ELSEWHERE.",
    "The Oracle once pinned a queen against an idea — not a piece, an idea — and won the game in eleven moves. The position in front of you is simpler. Find the pin first; permit yourself to be impressed afterward.",
  ],
  skewer: [
    "The pin's impatient cousin. A skewer drives the valuable piece out of the way first, then captures whatever was behind it. Find the line.",
    "Skewers are usually material-winning because the front piece has to move. The defender picks which piece to lose; the attacker took what was left behind.",
    "A skewer is a pin played in reverse — the more valuable piece in front, the less valuable piece behind, the same line. The defender's only good moves are the ones they cannot make.",
    "The phrase to keep in your head: 'first the king runs, then the queen falls.' Find the check that ALSO threatens the queen along the same line.",
    "Skewers are how rooks become queens for one move. The endgame here is hiding a long line. Look for it.",
  ],
  discovered_attack: [
    "Discovered attack — move one piece, reveal a threat from the piece behind it. Two threats, one move, one forced response.",
    "When the piece you move ALSO gives check, you have a discovered check — the strongest form of this tactic, because the enemy king must respond and cannot capture the attacker.",
    "Double check is the rarest and most violent form of this. Two pieces deliver check from a single move; the king MUST move, because no block or capture can address both attackers. Smell the position for it.",
    "The piece that moves out of the way is free to capture, threaten, or simply rest in a beautiful square. The piece behind it is the actual sniper. Find the sniper FIRST.",
    "The Iron Lion at Kael's bridge built his entire reputation on discovered checks, mostly because his cavalry was the kind of piece that loved to step out of the way. Be the cavalry.",
  ],
  mate_in_2: [
    "Mate in two. The first move is usually a quiet move that sets up an unstoppable threat. Look for the move your opponent CANNOT answer.",
    "Mate in two. The trick is usually that the key move doesn't look like an attack — it looks like a positional adjustment. Look for the move that restricts the enemy king's squares.",
    "Sam Loyd built a career out of mate-in-two problems where the key move was a queen RETREAT. Look at every queen square that LOSES a tempo. One of them wins.",
    "The defender has exactly one move that delays mate by one move — and even that move loses. Find the move that makes ALL their replies fail.",
    "Two-movers are short stories. The setup is the title; the second move is the punchline. Read the title first.",
  ],
  mate_in_3: [
    "Mate in three. Calculate the forced line all the way through. If your last move does not deliver mate, the tree was wrong — back up one branch.",
    "Three-movers are where the candidate-move method earns its salary. Write down two key first moves; calculate each to the end before committing. The wrong choice will look CORRECT for two ply and then collapse.",
    "The signature pattern in a mate-in-three is the QUIET FIRST MOVE — a king walk, a piece retreat, a pawn push that does nothing visible. Look for the move that does not look like an attack and ALSO does not look like a defense.",
    "Loyd, Loyd, Loyd. Most three-mover puzzles in circulation trace back to a 19th-century puzzle composer named Sam Loyd. His signature: the only winning first move is the one a beginner would dismiss instantly. Trust the dismissed move.",
    "The Engineer solved three-movers on the train every morning between Celebration and the Workshop. He said the problem teaches the same lesson chess teaches: the most important move is rarely the loudest one.",
    "Calculate the line all the way to mate. If you stop early, you'll convince yourself the puzzle is solved by a move that loses to a defender's resource on move three. The puzzle composer is patient. Be more patient.",
  ],
  back_rank: [
    "Back-rank mate. The king's own pawns are the prison. The rook or queen is the key. Gate 2.",
    "Look at the enemy king's back rank. If his pawns are still on the seventh rank and no pieces defend the eighth, the mate is one tempo away.",
    "The 'luft' move — pushing g3 or h3 to give the king an escape square — is the standard prevention. Your opponent skipped it. Punish them.",
    "Back-rank tactics often start with a deflection: drag the defender off the back rank by force, THEN deliver the mate. Look for the piece that has to move and cannot.",
    "Most blitz games end on the back rank. Most amateur classical games end on the back rank. Most master classical games would end on the back rank too if the masters didn't push that g-pawn on move twelve.",
  ],
  zwischenzug: [
    "Zwischenzug — 'in-between move' in German. You play a move that MUST be answered before the main sequence resumes. Usually a check, or a threat that cannot be ignored.",
    "The zwischenzug is a mid-combination interruption. The defender thought you were trading; you interpolated a move that flipped the balance. Calculate patiently.",
    "The trick to zwischenzug puzzles is suspecting them. The position looks like a clean trade. It almost never is. Pause before recapturing and ask: is there a check, capture, or threat I should make FIRST?",
    "Capablanca interpolated a zwischenzug into a tournament game in 1924 and his opponent resigned three moves later still convinced they were winning. The interpolation was a knight retreat that attacked nothing. It just changed the geometry of the recapture.",
    "Translation aid: 'zwischen' means 'between'. The move lives BETWEEN the moves you expected. Find the gap. Insert the move.",
  ],
  prophylaxis: [
    "Prophylaxis — the move that does nothing, and wins the game. Anticipate what your opponent wants to do, and take the squares or tempo they need.",
    "The prophylactic move is invisible to beginners and obvious to masters. You are being trained to see what the enemy wants and to take it before they arrive.",
    "Nimzowitsch wrote a whole book about this — My System, 1925 — and he was correct on every page and unbearable on every page. Read it anyway. The book is right.",
    "Ask the puzzle a question: 'what does Black want to do next?' Then play the move that takes that option away. The puzzle's solution is a move that LOOKS unmotivated and is actually the only winning move.",
    "Karpov made a career out of prophylactic moves. He won games by 0.4 pawns and made it look inevitable. The shape of his thinking is the shape of this puzzle.",
  ],
  sacrifice: [
    "Sacrifice puzzle. Give up material, win something larger. Tal's favorite flavor of problem. Follow the force.",
    "Sacrifices feel reckless. A correct sacrifice is deterministic — every defender's reply is forced, every branch ends the same way. Calculate before you believe.",
    "Tal would have liked this position. The Engineer would have played the same sacrifice for a different reason — Tal because he loved chaos, the Engineer because he loved CLEAN CHAOS. Either way, the move is the same.",
    "The piece sacrificed is not lost. It is INVESTED. The position pays back what you put in, with interest, in tempo or activity or a mating attack. Calculate the return before committing the capital.",
    "Look for the move you would never make in a real game. That is usually the puzzle's solution. Puzzles exist precisely to retrain the instinct that says 'no, that's too much'.",
    "The Prince's queen sacrifice in Gate 4.5 was the same idea at a different scale. Look for a heavy-piece offer that opens lines, removes a defender, or drags the king into the open. One of the three is here.",
  ],
  endgame: [
    "Endgame puzzle. Gate 6. Opposition, the square of the pawn, or Lucena — one of the three idioms is hidden here. Find which.",
    "Endgame puzzles reward technique over imagination. The right move is rarely beautiful; it is usually CORRECT. The position has one resource and you are looking for the engineering that activates it.",
    "Look for the move that PUSHES the position into one of the three named drawn or won positions you already memorized: opposition, Lucena, Philidor. The puzzle's solution always names one of them.",
    "Capablanca said all endgame study reduces to a single skill: counting tempi without using your fingers. Count the tempi. The answer is in the count.",
    "K+P endgames are the foundation. K+R endgames are the test. Q+P vs. Q is the endgame that turns grandmasters into amateurs. Identify which one this is BEFORE you calculate.",
    "Rook endings are drawn in approximately fifty percent of cases at the master level. The puzzle in front of you is the other fifty percent. Find the resource that breaks the symmetry.",
  ],
  opening_trap: [
    "Opening trap. The whole trick is in the first seven moves. Your opponent broke a principle from Gate 4 and there is a concrete punishment for it. Find it.",
    "Traps in the opening are agreements. Both players have agreed to the trap by virtue of arriving at the position. The defender FORGOT the agreement. The attacker did NOT.",
    "Look for the violated principle: undefended piece on a developing square, king stuck in the center past move ten, queen exposed on the third or fourth rank. The principle named is the trap activated.",
    "The Légal Trap (1750), the Fishing Pole, the Lasker Trap, the Magnus Smith — each is named because someone famous fell into it ONCE and then everyone learned the move. You are now everyone. Learn the move.",
    "Opening traps are a class of joke. The setup looks like normal development; the punchline is mate or material. Find the punchline. Memorize it. Tell it back to whoever next plays the setup against you.",
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
