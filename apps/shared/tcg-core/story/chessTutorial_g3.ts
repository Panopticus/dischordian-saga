/**
 * Chess Tutorial — Gate 3 (Special Moves).
 *
 * Teaches the three special moves that break the normal movement
 * rules: castling (king + rook swap), en passant (pawn capture
 * at a distance), and pawn promotion. Each of these exists because
 * the game's designers recognized that the basic rules had edge
 * cases that needed explicit permission.
 *
 * Reality reflection: the rules have exceptions written INTO them.
 * Castling exists because even a king is allowed to hide. The Game
 * Master wants the student to look for the castling move in every
 * system they think is closed.
 */

import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate } from "./chessTutorial";

const GATE_3_INTRO: DialogScene = {
  id: "chess_tut_g3_intro",
  label: "Chess Tutorial Gate 3 — Intro (Special Moves)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Today we learn the three moves that are technically illegal, except when they are not. Chess has three special moves — CASTLING, EN PASSANT, and PROMOTION — and they exist because the original rules had three problems the designers wanted to solve without rewriting the whole game.",
      audioClipId: "vo_gm_chess_g3_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "I love these moves. They are elegant. They are small exceptions made deliberately, to fix something that would otherwise stay broken. The Architect would tell you the rules are the rules. These three moves are proof that the rules are the STARTING POINT, and the exceptions are where the grown-ups live.",
      audioClipId: "vo_gm_chess_g3_intro_02",
    },
  ],
};

const GATE_3_OUTRO: DialogScene = {
  id: "chess_tut_g3_outro",
  label: "Chess Tutorial Gate 3 — Outro",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Excellent. You now know more about chess than ninety percent of the people who will tell you they know how to play. Most beginners never learn en passant. Most never promote a pawn because they never keep one alive long enough. You are already ahead of them.",
      audioClipId: "vo_gm_chess_g3_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is today's reflection. The rules have exceptions written INTO them. The designers of chess saw that the basic rules trapped the king in his starting square, left pawns frozen on the edges of the board, and made late-stage pawns useless. So they added castling, en passant, and promotion. Every rule you think is immovable has a castling move hidden inside it. Look for the move that is illegal except when it isn't. Lives are full of them.",
      audioClipId: "vo_gm_chess_g3_outro_02",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_3: ChessTutorialGate = {
  id: "chess_tut_g3",
  gateNumber: 3,
  title: "Special Moves",
  objective:
    "Learn castling, en passant, and pawn promotion — the three exceptions to the basic movement rules.",
  introScene: GATE_3_INTRO,
  outroScene: GATE_3_OUTRO,
  freePlayPrompt:
    "Stay for practice positions? I can spin up castling drills, en passant patterns, and promotion races. No opponent — just shapes.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "CASTLING is the only move in chess that moves TWO of your own pieces at once. The king slides two squares toward a rook, and the rook jumps over the king to stand on the square the king crossed. It is your fastest way to get the king out of the center and into safety behind a pawn wall.",
      audioClipId: "vo_gm_chess_g3_s01",
      pieceFocus: "king",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Castling has FIVE requirements. Memorize them: the king has not moved, the rook has not moved, no pieces stand between the king and the rook, the king is not currently in check, and the king's path is not attacked by any enemy piece. Break any one of those five and castling is illegal. It is the most restrictive move in the game.",
      audioClipId: "vo_gm_chess_g3_s02",
      pieceFocus: "king",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "SHORT CASTLING is to the kingside, toward the h-file rook. King slides from e1 to g1, rook jumps from h1 to f1. It's the fastest castling and the one you will do in nine games out of ten. Here is the position — your f-file and g-file are clear. Play O-O, which is how castling kingside is notated.",
      audioClipId: "vo_gm_chess_g3_s03",
      boardFen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPBPPP/RNBQK2R w KQkq - 0 1",
      pieceFocus: "king",
      hint: "Castle kingside. In notation: 'O-O' (zero-oh-zero, not the letter O).",
      answerMoves: ["O-O"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "LONG CASTLING is to the queenside, toward the a-file rook. King slides from e1 to c1, rook jumps from a1 to d1. The king moves TWO squares but the rook moves THREE. Long castling takes longer to set up because you need to clear the queen, bishop, and knight first. Its reward is that your king ends up safer behind a longer pawn wall. Notation is O-O-O.",
      audioClipId: "vo_gm_chess_g3_s04",
      boardFen: "r3kbnr/pppbqppp/2np4/4p3/4P3/2NPB3/PPPQBPPP/R3K1NR w KQkq - 0 1",
      pieceFocus: "king",
      hint: "Castle queenside. In notation: 'O-O-O'.",
      answerMoves: ["O-O-O"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "EN PASSANT — French for 'in passing.' The most-missed rule in beginner chess. When an enemy pawn moves two squares forward from its starting rank and lands beside your pawn, you are allowed to capture it AS IF it had only moved one square. You can only do this on the very next move. If you wait, the right is gone forever.",
      audioClipId: "vo_gm_chess_g3_s05",
      pieceFocus: "pawn",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The rule exists because otherwise a pawn could use its two-square advance to DODGE capture by running past an enemy pawn. En passant fixes that — it says the two-square jump does not grant immunity from a capture that would have been possible on the one-square version of the same move.",
      audioClipId: "vo_gm_chess_g3_s06",
      pieceFocus: "pawn",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Here is the position. White pawn on e5, Black has just played d7-d5, landing beside you. Your e5 pawn can capture the d5 pawn by moving diagonally to d6 — landing on the square the Black pawn SKIPPED. The captured pawn is removed from d5 even though you're not standing on it. Play exd6 to capture en passant.",
      audioClipId: "vo_gm_chess_g3_s07",
      boardFen: "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
      pieceFocus: "pawn",
      hint: "Capture en passant — the e5 pawn takes the d5 pawn by moving to d6. In notation: 'exd6'.",
      answerMoves: ["exd6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "PROMOTION — when a pawn reaches the opposite side of the board (rank 8 for White, rank 1 for Black), you MUST immediately replace it with a queen, rook, bishop, or knight of your color. Your choice. You cannot keep it as a pawn. You cannot choose a king. Ninety-nine times out of a hundred you promote to a queen, because the queen is the strongest piece.",
      audioClipId: "vo_gm_chess_g3_s08",
      pieceFocus: "pawn",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Here is a pawn on the 7th rank, one square from promotion. Push it to e8 and it becomes a queen. Notation: e8=Q. The equals sign is how you tell the referee which piece you want. Play e8=Q.",
      audioClipId: "vo_gm_chess_g3_s09",
      boardFen: "8/4P3/8/8/8/8/8/4K2k w - - 0 1",
      pieceFocus: "pawn",
      hint: "Promote the pawn by pushing it to e8 as a queen. In notation: 'e8=Q'.",
      answerMoves: ["e8=Q"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "One nuance, then we stop. UNDERPROMOTION is the rare choice of a non-queen. The most common reason is to promote to a KNIGHT, because the knight gives check in positions where a queen would not — and that one tempo can change a losing position into a winning one. Underpromotion is the move that tells your opponent: I see further than you do.",
      audioClipId: "vo_gm_chess_g3_s10",
      pieceFocus: "knight",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Three exceptions, and now they are yours. Castling protects the king. En passant protects the concept that pawns cannot dodge. Promotion protects the dignity of the pawn — the piece that was humblest at the start is the one that becomes a queen if it walks far enough. I always thought that was the most hopeful rule in the entire game.",
      audioClipId: "vo_gm_chess_g3_s11",
      pieceFocus: null,
      autoAdvance: true,
    },
  ],
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_3_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_3_INTRO, GATE_3_OUTRO]);
