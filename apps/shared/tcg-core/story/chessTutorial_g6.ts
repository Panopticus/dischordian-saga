/**
 * Chess Tutorial — Gate 6 (Basic Endgames).
 *
 * Teaches the three most important fundamental endgames: king
 * and queen vs king, king and rook vs king, and king and pawn
 * vs king (the opposition, the square of the pawn, and the idea
 * of "promotion wins the game"). A student who finishes Gate 6
 * can win any winning endgame and draw any drawn endgame involving
 * a single pawn.
 *
 * Reality reflection: when the board is almost empty, small
 * advantages become everything. That is true of every crisis.
 */

import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate } from "./chessTutorial";

const GATE_6_INTRO: DialogScene = {
  id: "chess_tut_g6_intro",
  label: "Chess Tutorial Gate 6 — Intro (Basic Endgames)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Today we learn the endgame. Most beginners never bother because endgames look simple and boring — three or four pieces on an empty board. That is exactly why you must learn them. The endgame is where chess becomes PURE. Every move matters. No backup plan, no sacrifice you can afford. Just geometry.",
      audioClipId: "vo_gm_chess_g6_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "We will learn three: king-and-queen versus king, king-and-rook versus king, and the single most important endgame in all of chess — king-and-pawn versus king. That last one is where you learn the concept of the OPPOSITION, and once you understand opposition, you understand why grandmasters spend half their training on positions with six pieces.",
      audioClipId: "vo_gm_chess_g6_intro_02",
    },
  ],
};

const GATE_6_OUTRO: DialogScene = {
  id: "chess_tut_g6_outro",
  label: "Chess Tutorial Gate 6 — Outro",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You just won an endgame by counting squares. You did not calculate variations. You did not memorize mate patterns. You looked at the geometry, saw that you were two steps closer to the pawn than the enemy king, and you walked there. That is the endgame. Patient, geometric, and completely unsentimental.",
      audioClipId: "vo_gm_chess_g6_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is the reflection. When the board is almost empty, small advantages become EVERYTHING. A single extra pawn in the middlegame is a minor edge. In the endgame it is often the entire game. This is true of chess and it is true of every crisis I have ever lived through. When the room clears out and only the essentials remain, the advantage that was invisible an hour ago becomes the advantage that decides everything. Learn to see which advantages will survive the simplification.",
      audioClipId: "vo_gm_chess_g6_outro_02",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_6: ChessTutorialGate = {
  id: "chess_tut_g6",
  gateNumber: 6,
  title: "Basic Endgames",
  objective:
    "Win K+Q vs K, K+R vs K, and K+P vs K endgames using opposition and the square of the pawn.",
  introScene: GATE_6_INTRO,
  outroScene: GATE_6_OUTRO,
  freePlayPrompt:
    "Stay and drill endgames? I can spin up a hundred positions that look almost empty but have exactly one right move. Endgame study is where real chess improvement lives.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "KING AND QUEEN VERSUS KING — the simplest winning endgame. The technique: drive the enemy king to the edge of the board using your queen, then deliver mate with your own king supporting the queen. The most important rule is to NEVER stalemate. Keep a square open for the enemy king on every move until it is your turn to mate.",
      audioClipId: "vo_gm_chess_g6_s01",
      pieceFocus: "queen",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is the position — White king on e5, White queen on d6, Black king on g8. The Black king is already on the edge. Your queen is a knight's move away from mate. Play Qg6, standing next to the king with your own king defending the queen. Stalemate? No — Black still has h8 and f8. Next turn: mate.",
      audioClipId: "vo_gm_chess_g6_s02",
      boardFen: "6k1/8/3Q4/4K3/8/8/8/8 w - - 0 1",
      pieceFocus: "queen",
      hint: "Move the queen to g6, supported by your king. In notation: 'Qg6+'.",
      answerMoves: ["Qg6+", "Qg6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Black king to h8 — the only legal square. Now deliver mate. Qg7 is stalemate because the king has nowhere. But Qh6+ forces the king back to the corner... actually no, we want the king trapped. The cleanest mate here is to bring your queen to g7, supported by your own king on f6 — but we are not there yet. On this position, Qd8+ drives the king back to the corner. From there we can finish cleanly. Play Qd8+.",
      audioClipId: "vo_gm_chess_g6_s03",
      boardFen: "7k/8/6Q1/4K3/8/8/8/8 b - - 0 1",
      pieceFocus: "queen",
      hint: "Drive the king to the corner. From here, Kf6 is what actually finishes — but for the lesson, advance your king with Kf6.",
      answerMoves: ["Kf6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "Good. When queen and king coordinate, the defender has no counterplay at all. In a real game against a human, K+Q vs K should take you under ten moves. Against an engine, it is a forced mate in at most ten. Memorize the rhythm: drive king to edge, bring your own king up, deliver supported mate.",
      audioClipId: "vo_gm_chess_g6_s04",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "KING AND ROOK VERSUS KING — harder. The rook cannot do it alone. You need your king to help, because the rook has no short-range control — it cannot take away squares directly next to the enemy king unless your own king is covering the squares the rook cannot reach. The technique is called the LADDER — rook drives the king back, king walks up behind, rook drives again.",
      audioClipId: "vo_gm_chess_g6_s05",
      pieceFocus: "rook",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Here, White king on e3, White rook on a4, Black king on e5. The rook cuts the Black king off from the 5th rank and below — it cannot cross. But you need your king to drive the Black king back. Push your king forward: Kf3? No — that lets the king go to f5. The right move is Kd3 — kings cannot stand next to each other, so Black is forced to retreat. But here, the rook is already doing the work. Play Ra5, cutting off the Black king entirely.",
      audioClipId: "vo_gm_chess_g6_s06",
      boardFen: "8/8/8/4k3/R7/4K3/8/8 w - - 0 1",
      pieceFocus: "rook",
      hint: "Cut off the Black king along the 5th rank. In notation: 'Ra5+'.",
      answerMoves: ["Ra5+", "Ra5"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "The K+R vs K mate takes about 16 moves in the worst case and is the single most tested endgame technique at beginner tournaments. Spend a weekend drilling it. There are a thousand online trainers that will let you practice against a computer that plays the defender perfectly. Do the work. It pays back for the rest of your chess life.",
      audioClipId: "vo_gm_chess_g6_s07",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "KING AND PAWN VERSUS KING — the most important endgame in all of chess. Every pawn endgame eventually reduces to this. You either promote the pawn and win with a queen, or you fail to promote and the game is a draw. Two concepts decide the outcome: the SQUARE OF THE PAWN, and the OPPOSITION.",
      audioClipId: "vo_gm_chess_g6_s08",
      pieceFocus: "pawn",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "The SQUARE OF THE PAWN. Imagine a diagonal line from the pawn to the promotion square, then an equal-sided square built on that diagonal. If the enemy king is INSIDE that square (or can step into it on this move), it can catch the pawn before it promotes. If the enemy king is OUTSIDE the square and it is the pawn's turn to move, the pawn promotes for free. Look at the board — can the Black king on h8 catch the White pawn on a5 before it promotes? Count the squares.",
      audioClipId: "vo_gm_chess_g6_s09",
      boardFen: "7k/8/8/P7/8/8/8/7K w - - 0 1",
      pieceFocus: "pawn",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The pawn on a5 needs four moves to promote (a6, a7, a8). The Black king on h8 needs eight king moves to reach a8 diagonally. The king is NOT in the square. Push the pawn. It will promote. Play a6.",
      audioClipId: "vo_gm_chess_g6_s10",
      boardFen: "7k/8/8/P7/8/8/8/7K w - - 0 1",
      pieceFocus: "pawn",
      hint: "Push the pawn — the enemy king cannot catch it. In notation: 'a6'.",
      answerMoves: ["a6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "OPPOSITION. When both kings face each other with exactly one square between them, whoever does NOT have to move has the opposition, and in a pawn endgame that advantage is often the entire game. The defender wants the attacker's king to be forced to step aside so the defender's king can block the pawn. The attacker wants to force the defender's king to step aside so the attacker's pawn can run past. Opposition is the decisive factor in almost every close K+P vs K position.",
      audioClipId: "vo_gm_chess_g6_s11",
      pieceFocus: "king",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "The endgame taught me something no other part of chess taught me. In the opening you have resources. In the middlegame you have options. In the endgame you have GEOMETRY. And geometry is remorseless. The position is either winning or it is not, and no amount of clever talking can change the count of squares. Learning to lose endgames gracefully taught me to lose other things gracefully too.",
      audioClipId: "vo_gm_chess_g6_s12",
      pieceFocus: null,
      autoAdvance: true,
    },
  ],
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_6_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_6_INTRO, GATE_6_OUTRO]);
