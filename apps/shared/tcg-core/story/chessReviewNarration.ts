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
      "Move {{moveNumber}}. The piece you moved was the only defender of the piece your opponent took. One-move discoveries cost you the most pieces in the eight-hundred to fourteen-hundred ELO band. Do not let go of your piece until you have asked: 'what was THIS piece doing while it sat there?'",
      "Hung piece, again. I am not scolding — I am calibrating. Every player I have taught has hung exactly one specific kind of piece more often than the others. Your pattern is bishops on the long diagonal. Note it. Stop the next one.",
      "The piece was defended once and then you moved the defender. Chess has a name for this — REMOVING THE DEFENDER. Your opponent did not see a brilliant move; they saw an obvious one. The brilliance was YOURS, twelve moves ago, when you put the defender there in the first place. Forgive the next one.",
    ],
    missed_tactic: [
      "Gate 5 — the fork, pin, skewer, discovered attack. There was one here. You had a fork on move {{moveNumber}}. The knight jumps to the square that attacks two pieces. Replay the position; you'll see it now. Tactics get easier every time you notice one you missed.",
      "A tactic was waiting for you. The pattern is one of the four we drilled in Gate 5. A fork, I think — your knight had a square that touched both the king and the queen. You'll see it in replay. You'll see it in your next game too, because your brain will not let the pattern go once it has been seen clearly once.",
      "Missed tactic. The position was screaming at you. Look at the piece you didn't move and the square it controlled. That is where the combination started.",
      "Tal wrote that every position has a tactic if you look for one. He was exaggerating — but only by a little. The tactic here was real and small and winning. Next time, look harder at the moment your opponent lets their guard down.",
      "The combination ran four moves deep — sacrifice, check, double attack, recapture. You stopped calculating at move two. The discipline is to follow EVERY forcing line one move farther than you think you need to. The fourth move is where the tactic became visible.",
      "I scanned this position at depth twenty. The engine and I agreed there was a tactic. The engine called it a 1.8 swing; I called it a teaching moment. Replay slowly. Notice where your eyes went and where they did not.",
    ],
    positional_blunder: [
      "Strategic mistake. Gate 7 — you learned to read a position. This one had a pawn chain with a weak square on {{square}}, and you played a move that let your opponent's knight sit on it for free. Weak squares are forever. Don't let the opponent plant his furniture there.",
      "Your pawn structure cracked on this move. Chess is a slow game except when it isn't. You just spent a structural asset for a tactical short-term gain, and the tactical gain didn't materialize. Recheck Gate 7 — prophylaxis. The move that does nothing and wins the game.",
      "The position demanded patience and you played sharply. Sometimes that wins. Here it handed your opponent a structural advantage you won't get back.",
      "Doubled pawns on the f-file. Doubled pawns are not lethal — they are LIMITING. They reduce the number of plans available to you. You traded options for a small material gain; the trade was not worth it.",
      "Bad bishop. The bishop you kept was the one whose diagonals were blocked by your own pawns. You should have traded it three moves earlier. Nimzowitsch wrote a chapter on this in 1925; the chapter is still correct.",
      "You opened the position when your opponent had the better-placed pieces. Open positions favor active pieces; closed positions favor better structure. Always ask which one applies BEFORE pushing a central pawn.",
    ],
    endgame_technique: [
      "Gate 6 — endgame technique. You were a pawn up in a king-and-pawn endgame and you missed opposition. Replay the position: your king needed to reach the key square BEFORE pushing the pawn. Opposition is geometry. You already know the geometry. You just rushed.",
      "Endgame drift. You had a winning endgame and you converted it into a drawn one by letting the king get too far from your pawn. Gate 6 tells you where the king has to stand. Re-read it. This endgame will come up again within ten games; you don't want to repeat this.",
      "The endgame is where real chess improvement lives. You did not lose this game in the endgame — you gave away what the middlegame had earned. The discipline is: when pieces come off, do not relax. Play harder.",
      "Rook endgame. You let the opposing king reach the queening square ahead of the pawn. Philidor's draw saves this position even down a pawn. You did not know Philidor; you do now.",
      "King and pawn versus king. The square of the pawn matters. Your king was outside the square at the moment your pawn pushed. The opponent's king caught it. Gate 6 step three teaches the geometry. Re-walk it.",
    ],
    opening_principle_violation: [
      "Gate 4, principle three: castle early. You kept your king in the center until move eleven. The opponent opened the center on move nine. The position was already lost by the time you realized why your pieces couldn't coordinate.",
      "Gate 4, principle five: don't move the same piece twice in the opening without a reason. You moved this knight three times in the first ten moves. Your opponent used that time to develop two new pieces. Tempo is the hidden currency of chess.",
      "Opening principles don't disappear when you memorize an opening line. They are WHY the line is good. The moves of a famous opening are a specific recipe; the principles are the kitchen. You tried to cook without the kitchen.",
      "Queen out too early. The opponent developed two minor pieces with tempo by attacking her, and you spent five moves shepherding her to safety. The queen is most valuable in the late middlegame, not the opening. Patience.",
      "You played a wing pawn in the opening for no reason. The opening is for the center. Wing pawns earn their salary in the middlegame, not before move twelve. Take the principle seriously and your rating crosses 1200 by next month.",
    ],
    missed_mate: [
      "Mate-in-{{moveCount}} on the board, and you played something else. The pattern was — I think — a smothered mate, or a back-rank mate. Replay it. When you see a king that has restricted its own escape squares with its own pawns, the FIRST thing to check is always a rook or queen landing on the back rank.",
      "You had mate. You played a capture instead. This happens because captures feel productive — you can SEE the piece disappear, so it feels like you did something. Mate feels like stopping, because the game actually ends. Train yourself to feel the stopping.",
      "Gate 2 — the mate patterns. You know this one. The pattern got buried under the anxiety of being in the position. Slow down. The mate is patient. It will wait for you to see it.",
      "Mate was three moves deep. You stopped calculating at two. Practice three-move puzzles for the next two weeks; this exact pattern will surface again, and the next time you will see it.",
      "There was a queen sacrifice that delivered mate two moves later. Sacrifices that lead to mate are the easiest sacrifices to find — every defender's reply is a check or a forced move, so the tree is narrow. The width of the tree is the rule. Narrow trees end in mate.",
    ],
    stalemate_trap: [
      "You stalemated a winning position. It happens to every player at least once; it happens to careless players twice. The cure is a two-second check before every queen move in the endgame: does my opponent have at least one legal move that isn't into check? If not, your move is NOT mate. Stalemate is draw, not win. Gate 2.",
      "Stalemate. You were winning. The draw feels worse than a loss because the win was right there. Don't spiral — it is a specific, fixable mistake. Check for enemy king mobility before every move in a winning king-and-queen endgame.",
      "Stalemate. The classic trap is the one you just walked into — queen on the seventh rank, opponent's king on the eighth, no other pieces. The queen takes EVERY escape square. Always leave the king ONE square. Then deliver mate from a different angle.",
      "I have seen this in approximately one of every forty student games. You are not unusual. The pattern repeats because king-and-queen-versus-king feels like an automatic win and the brain stops calculating. Calculate one more move. Always.",
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

/* ═══════════════════════════════════════════════════════
   BRILLIANCIES — review highlights, not mistakes.
   Stockfish flags moves that gain ≥ 80 cp (or sustain a
   high eval through a forcing line nobody saw). Each gets
   a short Celebration GM line in the same teaching voice
   used for the mistake bank, so the post-game review
   praises the player as well as correcting them.
   ═══════════════════════════════════════════════════════ */

export const BRILLIANCY_TYPES = [
  "tactical_blow",
  "quiet_killer",
  "deep_sacrifice",
  "prophylactic_genius",
  "endgame_precision",
  "opening_novelty",
  "defensive_resource",
  "clean_conversion",
] as const;

export type BrilliancyType = (typeof BRILLIANCY_TYPES)[number];

const BRILLIANCY_BANK: Readonly<Record<BrilliancyType, readonly string[]>> =
  Object.freeze({
    tactical_blow: [
      "Move {{moveNumber}}. Tal would have stood up at the board for that one. The combination ran exactly as far as it needed to and stopped. That is the discipline you are starting to acquire.",
      "Clean tactical strike. You saw a fork three moves before it was on the board, and you steered the position toward it. That is not luck. That is GATE 5 metabolizing into instinct.",
      "The combination on move {{moveNumber}} was correct to within a tenth of a pawn. The engine's first line agrees with yours. Most students do not earn that sentence in their first hundred games.",
      "You found the move. Most players in your bracket play the SECOND-best capture in this exact pattern. You played the best one. I am noting the difference.",
    ],
    quiet_killer: [
      "Move {{moveNumber}} did not capture, did not check, did not threaten anything visibly — and it ended the game. The signature of a quiet killer move is that the opponent resigns three moves later still believing the position was manageable.",
      "Quiet move. The kind that wins club games and makes IMs nod. You saw the position's hidden pressure point and put a piece on it. The pressure did the rest.",
      "The retreat on move {{moveNumber}} was the best move on the board. Most players will not even consider a retreat in this kind of position. You did. Note the muscle that fired and feed it.",
    ],
    deep_sacrifice: [
      "You sacrificed material on move {{moveNumber}} for an attack that paid back with interest. The line ran six ply deep with no defender's resource. That is calculation, not bravery — bravery would have given up the piece without the line. You had the line.",
      "Sacrifice. Tal would have CACKLED. The Engineer would have nodded once. The Engineer's nod is worth more in this household, and you earned it.",
      "Piece sacrifice that opened the king. The follow-up was forced; every defender's reply led back to the same mating net. Sacrifices like this teach you what the position was REALLY about. You learned the lesson by playing it.",
    ],
    prophylactic_genius: [
      "Move {{moveNumber}}. You played a move that did nothing visible and prevented the opponent's only plan. Karpov made a forty-year career out of moves like this one. You played his move on a Tuesday afternoon. Note it.",
      "Prophylaxis at master level. You looked at what the OPPONENT wanted and erased the square they needed. The move did not look like an attack because it wasn't one — it was a refusal to let an attack exist.",
      "Quiet preparation. You spent a tempo making the position UNAVAILABLE to your opponent's pieces. Most rated players never play a move like this in their lives. You just played one.",
    ],
    endgame_precision: [
      "Move {{moveNumber}} of the endgame was triangulation. You shuffled the king through three squares to lose a tempo at exactly the right moment. Capablanca would have given a small approving nod. The nod is the highest compliment in this study.",
      "Clean endgame technique. The king reached the key square BEFORE the pawn pushed. You converted the position the way Gate 6 said to convert it — geometry first, motion second.",
      "The rook lift on move {{moveNumber}} ended the endgame in three. The pattern is called the Lucena position; you found the bridge without being told its name. Now you know its name.",
    ],
    opening_novelty: [
      "Move {{moveNumber}} of the opening was not in the book and it should be. The engine evaluates it equal to the main line, and the resulting position is more comfortable for the side you played. That is what 'novelty' means in chess — a move that does not lose theory and does not need theory to defend it.",
      "You departed from theory on move {{moveNumber}} and the departure was sound. Most amateur departures lose half a pawn in the first ten moves; yours did not. That is unusual.",
      "Bold opening choice. Not in the database; not refuted by the engine. You played a position you understood instead of a position you had memorized. That is the entire purpose of opening study.",
    ],
    defensive_resource: [
      "Move {{moveNumber}} was the only move that did not lose. You found it. Lasker would have written about it: 'on the chessboard, lies and hypocrisy do not survive long.' Your defense was honest and exact.",
      "Defensive precision. The opponent's attack required ONE accurate reply per move and you supplied them in sequence. Six accurate moves in a row in a defensive position is the signature of a strong player.",
      "Counter-attack inside a defense. You found the move that threatened MORE than the opponent's threat — and the threat collapsed because answering yours required them to give up the attack. That is a famous pattern in defense; you played it without being shown.",
    ],
    clean_conversion: [
      "You won a pawn early and converted it without drama. That is the boring game most beginners cannot finish. You finished it. Boring games are the games that make you a 1600.",
      "Smooth conversion. No tactical fireworks, no swindle attempt by the opponent that almost worked — just an extra pawn turned into a queen turned into a resignation. The opponent's resignation timer was your patience.",
      "Clean technique from move {{moveNumber}} forward. You traded down to the position where the extra material decides, and you avoided every counterplay attempt. That is the discipline of the convert. Many players never learn it.",
    ],
  });

/** Pick a deterministic brilliancy narration line for a (type,
 *  seed) pair. Same shape as `pickReviewNarration` so the post-game
 *  review can render mistakes and brilliancies through one path. */
export function pickBrilliancyNarration(
  type: BrilliancyType,
  seed: number,
  substitutions: Record<string, string | number> = {},
): string {
  const alternates = BRILLIANCY_BANK[type];
  const index = Math.abs(Math.floor(seed)) % alternates.length;
  let line = alternates[index];
  for (const [key, value] of Object.entries(substitutions)) {
    line = line.replaceAll(`{{${key}}}`, String(value));
  }
  return line;
}
