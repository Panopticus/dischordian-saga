/**
 * Chess Tutorial — types + Gate 1 (The Board and the Pieces).
 *
 * In-universe framing:
 *   The player learns chess from the Celebration-era Game Master —
 *   the version of him who still taught, before the Architect turned
 *   him into a weapon. The Vaults of Celebration had a chess academy
 *   once. The Game Master ran it. When the Oracle went missing, the
 *   Architect pulled him out of the classroom and turned his
 *   pattern-recognition into a surveillance tool. The curriculum
 *   survived — as memory resin, and as the scripted tutor you meet
 *   in Chamber C-7 of the Inception Ark.
 *
 *   The Celebration Game Master is gentle, patient, professorial,
 *   and unconditionally enthusiastic about the game. He is not
 *   trying to win against the student — he is trying to make the
 *   student capable of winning against anybody else. He ends every
 *   gate with a reflection on what chess has taught HIM, in
 *   service of the running Season 1 theme about strategic thinking.
 *
 *   Seven gates total:
 *     1. The Board and the Pieces (board setup + piece movement)
 *     2. Check, Checkmate, Stalemate (win conditions)
 *     3. Special Moves (castling, en passant, promotion)
 *     4. Opening Principles (center, development, king safety)
 *     5. Basic Tactics (fork, pin, skewer, discovered attack)
 *     6. Basic Endgames (K+P vs K, opposition, the square)
 *     7. Strategic Thinking (the meta-gate, and the reveal)
 *
 *   Each gate has enough written instruction that a player who
 *   has never touched a chessboard can finish the gate
 *   understanding what was taught. This is not flavor text. This
 *   is a real chess course inside a fictional classroom.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

/** Which piece the current lesson is focused on. Drives the
 *  board highlight in the UI. Multi-piece lessons carry `null`. */
export type ChessPieceFocus =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king"
  | null;

/** A single chess-tutorial step. Mirrors the TutorialStepDef
 *  shape so the renderer can reuse the existing overlay UI,
 *  plus chess-specific scaffolding: a FEN position the board
 *  should show, and a list of legal "answer moves" the student
 *  must play in order. When `answerMoves` is empty the step is
 *  lecture-only and auto-advances. */
export interface ChessTutorialStep {
  /** The Game Master's line. Always has a speaker + mood. */
  speaker: "game_master_celebration" | "game_master_corrupted" | "narrator";
  mood:
    | "warm"
    | "curious"
    | "reflective"
    | "protective"
    | "guarded"
    | "cryptic";
  text: string;
  /** Optional audio clip id for VO capture (FNORD-23 memory resin). */
  audioClipId?: string;
  /** FEN string the board should show before this step. `null`
   *  means "leave whatever was there". FEN uses standard chess
   *  notation (Forsyth-Edwards) so any real chess engine can
   *  parse it. */
  boardFen?: string | null;
  /** Which piece the UI should highlight for this step. */
  pieceFocus?: ChessPieceFocus;
  /**
   * Ordered list of moves the student must play (SAN — e.g.
   * "e4", "Nf3", "Bxb5+"). When the student plays the first
   * move in the list, the scripted opponent plays the second,
   * the student plays the third, and so on. Empty = lecture
   * only, auto-advance after a delay.
   */
  answerMoves?: readonly string[];
  /** Optional hint shown if the student stalls for more than
   *  15 seconds. */
  hint?: string;
  /** True if the step is purely narrative — auto-advance even
   *  without answerMoves or a delay. */
  autoAdvance?: boolean;
}

/** A complete chess tutorial gate. */
export interface ChessTutorialGate {
  id: string;
  gateNumber: number;
  title: string;
  objective: string;
  /** A short opening scene that plays before the first step.
   *  Reuses the DialogScene type so the renderer is shared
   *  with the TCG dialog bank. */
  introScene: DialogScene;
  /** Ordered lesson steps. Each step is a single Game Master
   *  line with optional board state + required moves. */
  steps: readonly ChessTutorialStep[];
  /** Closing scene after the final step. Typically contains
   *  the Game Master's reflection on what the gate taught him. */
  outroScene: DialogScene;
  /** Optional free-play rematch blurb the UI surfaces at the
   *  end of the gate, offering the student a freestyle game
   *  against the Celebration Game Master at tutor difficulty. */
  freePlayPrompt?: string;
}

/* ═══════════════════════════════════════════════════════
   GATE 1 — THE BOARD AND THE PIECES
   Teaches: board orientation ("white on right"), rank + file,
   the starting position, and how each of the six pieces moves.
   A student who finishes Gate 1 can name every piece and push
   one legally on any square.
   ═══════════════════════════════════════════════════════ */

const GATE_1_INTRO: DialogScene = {
  id: "chess_tut_g1_intro",
  label: "Chess Tutorial Gate 1 — Intro (The Celebration Classroom)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "Chamber C-7 of the Inception Ark powers on. A long oak table stretches across the room. A chessboard is already set up, the pieces on it in their starting positions. A man in an old wool jacket is sitting on the far side. He stands when you enter and offers his hand without saying anything first — which you realize later was the first lesson.",
      audioClipId: "vo_narr_chess_g1_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Welcome. I'm the Game Master — or I was, in the Vaults of Celebration, before the reorganization. I taught chess there for longer than I can comfortably count, and then the Architect moved me to other work, and the classroom went quiet. You are the first student I have had in eleven years.",
      audioClipId: "vo_gm_chess_g1_intro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "I should warn you: the version of me you will eventually meet in the Arena is not this version. That one has been sharpened into a weapon. I am the one who remembers why he loved the game in the first place. Let's see if the love survives one more generation.",
      audioClipId: "vo_gm_chess_g1_intro_03",
    },
  ],
};

const GATE_1_OUTRO: DialogScene = {
  id: "chess_tut_g1_outro",
  label: "Chess Tutorial Gate 1 — Outro",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Well played. You now know the vocabulary of the game. Every future lesson is a sentence built from these words — and every sentence you construct with them is going to be yours, not mine. I am only the grammarian; you are the writer.",
      audioClipId: "vo_gm_chess_g1_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "One thing chess taught me, which I will repeat at the end of every gate: the pieces do not have personalities until you give them one. A knight is a knight until you start treating it like a scalpel, and then every knight you ever play becomes a scalpel forever. Be careful what you teach yourself to expect from a piece.",
      audioClipId: "vo_gm_chess_g1_outro_02",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_1: ChessTutorialGate = {
  id: "chess_tut_g1",
  gateNumber: 1,
  title: "The Board and the Pieces",
  objective: "Learn the starting position and how every piece moves.",
  introScene: GATE_1_INTRO,
  outroScene: GATE_1_OUTRO,
  freePlayPrompt:
    "Stay for a free game? I'll play at tutor setting — soft, patient, and eager to lose a piece if it teaches you something.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The board is 64 squares, 8 by 8, light and dark in strict alternation. The first rule you ever learn is: the square in your near-right corner is always LIGHT. If it isn't, the board is rotated wrong. Say it out loud with me: white on the right.",
      audioClipId: "vo_gm_chess_g1_s01",
      boardFen: "8/8/8/8/8/8/8/8 w - - 0 1",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "The columns are called FILES, labeled a through h from White's left. The rows are called RANKS, numbered 1 to 8 from White's side. Every square has a coordinate — e4, d7, a1. When I say 'a1' I always mean the same square from either side of the table; the coordinates don't flip with perspective.",
      audioClipId: "vo_gm_chess_g1_s02",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Here is the starting position. White on ranks 1 and 2, Black on ranks 7 and 8. The back rank is rook, knight, bishop, QUEEN ON HER COLOR, king, bishop, knight, rook. The queen on her color is the second rule: white queen on d1 (a light square), black queen on d8 (a dark square). If your queen is on the wrong color, you set up the board wrong.",
      audioClipId: "vo_gm_chess_g1_s03",
      boardFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The PAWN. Humblest piece on the board. Moves one square forward. From its starting rank it may optionally move two squares forward on its first move only. It captures ONLY diagonally, one square — never forward. The forward move and the capture are different motions. Confuse them and you will lose your first hundred games faster than your second hundred.",
      audioClipId: "vo_gm_chess_g1_s04",
      pieceFocus: "pawn",
      boardFen: "8/8/8/8/8/8/4P3/8 w - - 0 1",
      hint: "Push the e-pawn forward two squares. In chess notation that's 'e4'.",
      answerMoves: ["e4"],
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The KNIGHT. The only piece that can jump over other pieces. It moves in an L: two squares one direction, then one square perpendicular — or one square then two. Eight possible destinations from a central square, fewer from the edge. Knights are slow and strange. The Oracle used to say they were the only piece that thought in a different dimension than the rest.",
      audioClipId: "vo_gm_chess_g1_s05",
      pieceFocus: "knight",
      boardFen: "8/8/8/8/8/8/8/1N6 w - - 0 1",
      hint: "Move the knight from b1 to c3. In notation: 'Nc3'.",
      answerMoves: ["Nc3"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "The BISHOP. Slides any number of squares along a diagonal. Cannot jump. Cannot change color — a bishop that begins on a light square will live and die on light squares. You have two bishops at the start of the game: one light-squared, one dark-squared. Losing one permanently weakens the other.",
      audioClipId: "vo_gm_chess_g1_s06",
      pieceFocus: "bishop",
      boardFen: "8/8/8/8/8/8/8/2B5 w - - 0 1",
      hint: "Move the bishop from c1 to f4. In notation: 'Bf4'.",
      answerMoves: ["Bf4"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "The ROOK. Slides any number of squares along a rank or a file. Cannot jump. In the opening the rooks sit behind the pawns and wait; in the endgame they become the most dangerous piece on the board except one. They belong on open files. You will relearn this lesson for years.",
      audioClipId: "vo_gm_chess_g1_s07",
      pieceFocus: "rook",
      boardFen: "8/8/8/8/8/8/8/R7 w - - 0 1",
      hint: "Move the rook from a1 to a5. In notation: 'Ra5'.",
      answerMoves: ["Ra5"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "The QUEEN. The most powerful piece on the board. Moves like a rook AND a bishop combined — any number of squares along a rank, file, or diagonal. Cannot jump. People tell beginners 'don't bring the queen out too early' and they're right, but not for the reason they say. The queen comes out late not because she is fragile but because she is too VALUABLE to waste on reconnaissance.",
      audioClipId: "vo_gm_chess_g1_s08",
      pieceFocus: "queen",
      boardFen: "8/8/8/8/8/8/8/3Q4 w - - 0 1",
      hint: "Move the queen from d1 to h5. In notation: 'Qh5'.",
      answerMoves: ["Qh5"],
    },
    {
      speaker: "game_master_celebration",
      mood: "protective",
      text: "The KING. Moves one square in any direction. Slow, brittle, and the whole point of the game — if your king is captured, you have already lost. The king never actually gets captured in a proper game; it gets CHECKMATED, which we'll learn next gate. For now: understand that the king's value is not a number. It is the entire game.",
      audioClipId: "vo_gm_chess_g1_s09",
      pieceFocus: "king",
      boardFen: "8/8/8/8/8/8/8/4K3 w - - 0 1",
      hint: "Move the king from e1 to e2. In notation: 'Ke2'.",
      answerMoves: ["Ke2"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Every piece now lives in your head as a shape. That shape has a future. Next gate we will learn the only kind of future that matters in chess — the one where the king runs out of safe squares. Take a breath. Reset the board. I will be here when you return.",
      audioClipId: "vo_gm_chess_g1_s10",
      pieceFocus: null,
      boardFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      autoAdvance: true,
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   REGISTRY
   ═══════════════════════════════════════════════════════ */

/** All chess tutorial gates currently authored. Subsequent
 *  commits (CT2-CT7) append more gates here via the same
 *  spread pattern used by the Engineer's Logs batches. */
export const CHESS_TUTORIAL_GATES: readonly ChessTutorialGate[] = Object.freeze([
  CHESS_TUTORIAL_GATE_1,
]);

/** All dialog scenes the chess tutorial produces (intro +
 *  outro for every gate). Used by the dialog bank registry
 *  so they become resolvable ids alongside the TCG scenes. */
export const CHESS_TUTORIAL_SCENES: readonly DialogScene[] = Object.freeze([
  GATE_1_INTRO,
  GATE_1_OUTRO,
]);
