/**
 * Chess Tutorial — Gate 2 (Check, Checkmate, Stalemate).
 *
 * The win condition lesson. A student who finishes Gate 2 knows
 * the difference between check, checkmate, and stalemate, can
 * spot a back-rank mate, has seen the scholar's mate pattern
 * (and knows how to defend it), and understands why stalemate
 * is a draw and not a win.
 *
 * Reality reflection: every problem has a decisive configuration
 * where the threat runs out of squares. The Game Master wants the
 * student to learn to find that configuration in games and in lives.
 */

import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate } from "./chessTutorial";

const GATE_2_INTRO: DialogScene = {
  id: "chess_tut_g2_intro",
  label: "Chess Tutorial Gate 2 — Intro (Check, Checkmate, Stalemate)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Good — you came back. Most students don't. Today we learn the only thing in chess that actually matters: how the game ends. Everything you learned last gate was vocabulary. Today you learn a sentence that means STOP.",
      audioClipId: "vo_gm_chess_g2_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Three words to learn: check, checkmate, and stalemate. They sound similar and they are profoundly different. One is a warning. One is the end. One is an accident that feels like a loss because you were winning and stopped paying attention.",
      audioClipId: "vo_gm_chess_g2_intro_02",
    },
  ],
};

const GATE_2_OUTRO: DialogScene = {
  id: "chess_tut_g2_outro",
  label: "Chess Tutorial Gate 2 — Outro",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Beautiful. You can now end a game. That is the single most important skill in chess, and almost every beginner goes a full year without learning it properly. You saved yourself a year.",
      audioClipId: "vo_gm_chess_g2_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is the reflection I owe you. Every problem you will ever face has a DECISIVE CONFIGURATION — a position where the threat against you runs out of squares. Crisis is not a feeling. Crisis is a geometry. The person who sees the geometry wins. The person who feels the feeling panics and moves the wrong piece. Learn to find the mate in the room before the room finds the mate in you.",
      audioClipId: "vo_gm_chess_g2_outro_02",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_2: ChessTutorialGate = {
  id: "chess_tut_g2",
  gateNumber: 2,
  title: "Check, Checkmate, Stalemate",
  objective:
    "Learn the three win/draw conditions and recognize the classic mate patterns.",
  introScene: GATE_2_INTRO,
  outroScene: GATE_2_OUTRO,
  freePlayPrompt:
    "Stay and practice? I'll set up positions with one move to mate. You find the move; I nod. No punishment, no clock.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "CHECK is the warning. A king is in check when an enemy piece is attacking its square. You MUST get out of check on your next move — by moving the king, by blocking the attacker with another piece, or by capturing the attacker. If none of those three are legal, you are not in check anymore. You are in checkmate.",
      audioClipId: "vo_gm_chess_g2_s01",
      boardFen: "8/8/8/8/4r3/8/8/4K3 w - - 0 1",
      pieceFocus: "king",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is the king on e1 and a rook attacking down the e-file. The king is in check. You can move the king sideways to d1 or f1, you can block with another piece if you have one, or you can capture the rook if you can reach it. On this board, you only have the king. Slide him to f1.",
      audioClipId: "vo_gm_chess_g2_s02",
      boardFen: "8/8/8/8/4r3/8/8/4K3 w - - 0 1",
      pieceFocus: "king",
      hint: "Move the king from e1 to f1 to escape check. In notation: 'Kf1'.",
      answerMoves: ["Kf1"],
    },
    {
      speaker: "game_master_celebration",
      mood: "protective",
      text: "CHECKMATE is when the king is in check AND every possible response to the check is also illegal or still in check. The king cannot move to a safe square, no piece can block, no piece can capture. When that happens, the game ends. That's it. No capture of the king, no final blow — just the realization that there is nowhere left to stand.",
      audioClipId: "vo_gm_chess_g2_s03",
      pieceFocus: "king",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The BACK-RANK MATE — the first pattern every player should know. Black's king is on g8, pawns still on f7, g7, h7 forming a wall. White rook slides to e8. Check. The king cannot move to f8 or h8 because its own pawns block, cannot move forward because of the rook, cannot capture because the rook is defended. Checkmate. The king's own pawn wall became his prison.",
      audioClipId: "vo_gm_chess_g2_s04",
      boardFen: "4R1k1/5ppp/8/8/8/8/8/6K1 b - - 0 1",
      pieceFocus: "rook",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Now you deliver a back-rank mate. White to move. The Black king is on g8, pawns wall the 7th rank, Black has no defender on the back rank. Your rook on a1 just needs to swing over to the 8th rank and the king has nowhere to go. Play Ra8.",
      audioClipId: "vo_gm_chess_g2_s05",
      boardFen: "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1",
      pieceFocus: "rook",
      hint: "Slide the rook from a1 to a8. In notation: 'Ra8#' (the # marks mate).",
      answerMoves: ["Ra8#", "Ra8"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "SCHOLAR'S MATE — the trap every beginner loses to and then uses as a weapon for a month before their opponents learn to defend it. White plays e4, then Qh5, then Bc4, then Qxf7 checkmate. Four moves. The queen and bishop gang up on f7, which is only defended by the Black king, and the king has nowhere to run. Memorize it. Not to win with — to never lose to it again.",
      audioClipId: "vo_gm_chess_g2_s06",
      boardFen: "r1bqkbnr/pppp1Qpp/2n5/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
      pieceFocus: "queen",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Here is the defense. Black's second move after 1.e4 e5 2.Qh5 should be Nc6, defending the e5 pawn and preparing for the bishop attack. Then after 3.Bc4 comes g6, which kicks the queen and simultaneously blocks the queen's line to f7. The trap never resolves. The first move you need to know is Nc6 — play it.",
      audioClipId: "vo_gm_chess_g2_s07",
      boardFen: "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2",
      pieceFocus: "knight",
      hint: "Develop the knight from b8 to c6 to defend e5. In notation: 'Nc6'.",
      answerMoves: ["Nc6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "STALEMATE is the accident. When it is your turn and your king is NOT in check but you have no legal move at all, the game is a DRAW. Half a point to each side. Stalemate feels like you were about to win and then stepped in a hole you dug yourself. It happens when the stronger side gets careless in an endgame.",
      audioClipId: "vo_gm_chess_g2_s08",
      boardFen: "7k/8/6Q1/8/8/8/8/6K1 b - - 0 1",
      pieceFocus: "king",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "Look at this position. Black king is on h8. White queen is on g6. It is Black's turn. The king is NOT in check. But every square the king could move to — g8, g7, h7 — is covered by the queen. Black has no other pieces. Black has no legal move. DRAW. The White player was three moves from mate and gave up half a point by not leaving the king one safe square to wiggle into.",
      audioClipId: "vo_gm_chess_g2_s09",
      boardFen: "7k/8/6Q1/8/8/8/8/6K1 b - - 0 1",
      pieceFocus: "queen",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "One more mate pattern before we stop. SMOTHERED MATE — a knight delivers mate while the enemy king is boxed in entirely by its own pieces. White knight from g5 to f7 and the Black king on h8, surrounded by its own rook and pawns, cannot escape the knight because a knight cannot be blocked. Play Nf7.",
      audioClipId: "vo_gm_chess_g2_s10",
      boardFen: "5rk1/5ppp/8/6N1/8/8/8/6K1 w - - 0 1",
      pieceFocus: "knight",
      hint: "Jump the knight from g5 to f7 for smothered mate. In notation: 'Nf7#'.",
      answerMoves: ["Nf7#", "Nf7"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Three endings. Check is a warning, checkmate is the end, stalemate is the accident. Most games end with resignation — one player sees the mate coming three moves away and shakes hands rather than play it out. That is a courtesy, not a requirement. You are allowed to make your opponent play the mate. Some days you should.",
      audioClipId: "vo_gm_chess_g2_s11",
      pieceFocus: null,
      autoAdvance: true,
    },
  ],
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_2_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_2_INTRO, GATE_2_OUTRO]);
