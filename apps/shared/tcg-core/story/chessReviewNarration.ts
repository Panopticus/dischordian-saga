/**
 * Post-Game Review — GM narration catalog.
 *
 * After a casual game finishes, the client runs the PGN through
 * Stockfish at depth 18 and flags the top 3 mistakes. Each
 * mistake is bucketed into a MistakeType and the Celebration GM
 * narrates it in the voice he used during the gate that taught
 * the relevant concept.
 *
 * Each MistakeType has 4-6 alternates so the review feels
 * WRITTEN, not templated. A deterministic seed drawn from the
 * game's PGN hash picks which alternate fires, so the same game
 * reviewed twice produces the same narration.
 *
 * The catalog references Gate numbers explicitly — that's the
 * point, it makes the review feel like continued classroom time
 * with the same teacher.
 */

export const MISTAKE_TYPES = [
  "hung_piece",
  "missed_tactic",
  "positional_blunder",
  "endgame_technique",
  "opening_principle_violation",
  "missed_mate",
  "stalemate_trap",
] as const;

export type MistakeType = (typeof MISTAKE_TYPES)[number];

/** Each mistake bucket has N teaching lines. The renderer picks
 *  one deterministically per game using a hash of the PGN. */
const NARRATION_BANK: Readonly<Record<MistakeType, readonly string[]>> =
  Object.freeze({
    hung_piece: [
      "You left a piece undefended and your opponent took it. Gate 1 — you know how the pieces move. Gate 5 — you know how they cover each other. The space between those two gates is where most rating points live. Look at every move you make and ask: if I move THIS piece, what goes undefended?",
      "Hung piece. It happens. It will happen again. The cure is a one-second habit — before you press the clock, scan for checks, captures, and threats. Three questions. The habit takes six months to become invisible; it lasts the rest of your chess life.",
      "I watched you move this piece without checking whether it was protected. The move felt right. It was not right. Feelings and chess sometimes agree. Not today.",
      "Capablanca used to say that good players don't lose pieces by leaving them hanging, because good players look at every square their opponent's pieces are covering before they touch their own. He was right. Try it next game.",
    ],
    missed_tactic: [
      "Gate 5 — the fork, pin, skewer, discovered attack. There was one here. You had a fork on move {{moveNumber}}. The knight jumps to the square that attacks two pieces. Replay the position; you'll see it now. Tactics get easier every time you notice one you missed.",
      "A tactic was waiting for you. The pattern is one of the four we drilled in Gate 5. A fork, I think — your knight had a square that touched both the king and the queen. You'll see it in replay. You'll see it in your next game too, because your brain will not let the pattern go once it has been seen clearly once.",
      "Missed tactic. The position was screaming at you. Look at the piece you didn't move and the square it controlled. That is where the combination started.",
      "Tal wrote that every position has a tactic if you look for one. He was exaggerating — but only by a little. The tactic here was real and small and winning. Next time, look harder at the moment your opponent lets their guard down.",
    ],
    positional_blunder: [
      "Strategic mistake. Gate 7 — you learned to read a position. This one had a pawn chain with a weak square on {{square}}, and you played a move that let your opponent's knight sit on it for free. Weak squares are forever. Don't let the opponent plant his furniture there.",
      "Your pawn structure cracked on this move. Chess is a slow game except when it isn't. You just spent a structural asset for a tactical short-term gain, and the tactical gain didn't materialize. Recheck Gate 7 — prophylaxis. The move that does nothing and wins the game.",
      "The position demanded patience and you played sharply. Sometimes that wins. Here it handed your opponent a structural advantage you won't get back.",
    ],
    endgame_technique: [
      "Gate 6 — endgame technique. You were a pawn up in a king-and-pawn endgame and you missed opposition. Replay the position: your king needed to reach the key square BEFORE pushing the pawn. Opposition is geometry. You already know the geometry. You just rushed.",
      "Endgame drift. You had a winning endgame and you converted it into a drawn one by letting the king get too far from your pawn. Gate 6 tells you where the king has to stand. Re-read it. This endgame will come up again within ten games; you don't want to repeat this.",
      "The endgame is where real chess improvement lives. You did not lose this game in the endgame — you gave away what the middlegame had earned. The discipline is: when pieces come off, do not relax. Play harder.",
    ],
    opening_principle_violation: [
      "Gate 4, principle three: castle early. You kept your king in the center until move eleven. The opponent opened the center on move nine. The position was already lost by the time you realized why your pieces couldn't coordinate.",
      "Gate 4, principle five: don't move the same piece twice in the opening without a reason. You moved this knight three times in the first ten moves. Your opponent used that time to develop two new pieces. Tempo is the hidden currency of chess.",
      "Opening principles don't disappear when you memorize an opening line. They are WHY the line is good. The moves of a famous opening are a specific recipe; the principles are the kitchen. You tried to cook without the kitchen.",
    ],
    missed_mate: [
      "Mate-in-{{moveCount}} on the board, and you played something else. The pattern was — I think — a smothered mate, or a back-rank mate. Replay it. When you see a king that has restricted its own escape squares with its own pawns, the FIRST thing to check is always a rook or queen landing on the back rank.",
      "You had mate. You played a capture instead. This happens because captures feel productive — you can SEE the piece disappear, so it feels like you did something. Mate feels like stopping, because the game actually ends. Train yourself to feel the stopping.",
      "Gate 2 — the mate patterns. You know this one. The pattern got buried under the anxiety of being in the position. Slow down. The mate is patient. It will wait for you to see it.",
    ],
    stalemate_trap: [
      "You stalemated a winning position. It happens to every player at least once; it happens to careless players twice. The cure is a two-second check before every queen move in the endgame: does my opponent have at least one legal move that isn't into check? If not, your move is NOT mate. Stalemate is draw, not win. Gate 2.",
      "Stalemate. You were winning. The draw feels worse than a loss because the win was right there. Don't spiral — it is a specific, fixable mistake. Check for enemy king mobility before every move in a winning king-and-queen endgame.",
    ],
  });

/**
 * Select a deterministic narration line for a (mistake type,
 * seed) pair. Same inputs → same output, so replaying a game's
 * review shows identical narration.
 *
 * @param type the detected mistake bucket
 * @param seed a stable hash of the game (PGN text hash, for example)
 * @param substitutions optional {{variable}} replacements in the
 *   chosen line (e.g. moveNumber, square, moveCount).
 */
export function pickReviewNarration(
  type: MistakeType,
  seed: number,
  substitutions: Record<string, string | number> = {},
): string {
  const alternates = NARRATION_BANK[type];
  const index = Math.abs(Math.floor(seed)) % alternates.length;
  let line = alternates[index];
  for (const [key, value] of Object.entries(substitutions)) {
    line = line.replaceAll(`{{${key}}}`, String(value));
  }
  return line;
}

/** Utility: deterministic 32-bit hash of a string. Used for
 *  stabilizing per-game narration selection. Not cryptographic;
 *  fine for UI seeding. */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
