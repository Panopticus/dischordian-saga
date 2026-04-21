/**
 * Chess Tutorial — Gate 4 (Opening Principles).
 *
 * Teaches the five opening principles every beginner needs before
 * they memorize a single named opening: control the center, develop
 * minor pieces before major pieces, castle early, connect the rooks,
 * and do not move the same piece twice without a reason. The Game
 * Master walks the student through a model opening — the Italian
 * Game — which illustrates all five principles in the first seven
 * moves.
 *
 * Reality reflection: the first four moves of anything decide
 * whether you get to play the middle game at all.
 */

import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate } from "./chessTutorial";

const GATE_4_INTRO: DialogScene = {
  id: "chess_tut_g4_intro",
  label: "Chess Tutorial Gate 4 — Intro (Opening Principles)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Welcome back. Today we leave the individual moves behind and talk about the first TEN moves as a single idea — the opening. In a master game, those ten moves are almost entirely decided by memorization. In YOUR games, for the next few years, they will be decided by five simple principles. Memorize the principles and you will survive any opening.",
      audioClipId: "vo_gm_chess_g4_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The five principles are: control the center, develop your minor pieces, castle early, connect your rooks, and don't move the same piece twice. That last one is where most beginners lose before they even realize they're losing. We'll drill them in a famous opening called the Italian Game.",
      audioClipId: "vo_gm_chess_g4_intro_02",
    },
  ],
};

const GATE_4_OUTRO: DialogScene = {
  id: "chess_tut_g4_outro",
  label: "Chess Tutorial Gate 4 — Outro",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You just played the opening of a real grandmaster game. Those first seven moves have been played millions of times over six hundred years. You did not memorize them — you DERIVED them from the principles. That is a completely different kind of knowing. One is a script. The other is a toolkit.",
      audioClipId: "vo_gm_chess_g4_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is today's reflection. The first four moves of anything decide whether you get to play the middle game at all. In chess, in conversations, in a coup, in an argument with somebody you love — the first four moves decide whether you even get to the part where your strategy matters. Most failures are opening failures. Most people never think about the opening because they're busy imagining the finish. Do not be most people.",
      audioClipId: "vo_gm_chess_g4_outro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "I had a student once who asked me this same question — about openings, about whether the first four moves were a script or a toolkit. A prince. From a kingdom you have probably not heard of. He went on to become an inventor; people called him the Engineer once he stopped wearing the title. He beat me, eventually. Not today. Today he was where you are. He had to be taught first. Like you. Sit a moment longer if you like. There is a side door near the oak credenza if you do not. It opens onto a corridor that is sometimes there.",
      audioClipId: "vo_gm_chess_g4_outro_dread",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_4: ChessTutorialGate = {
  id: "chess_tut_g4",
  gateNumber: 4,
  title: "Opening Principles",
  objective:
    "Play the first seven moves of a real opening by deriving each move from principle.",
  introScene: GATE_4_INTRO,
  outroScene: GATE_4_OUTRO,
  freePlayPrompt:
    "Stay and drill openings? I'll let you play the first eight moves of five different openings with the principles highlighted. You can feel the patterns in your hands that way.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Principle one: CONTROL THE CENTER. The four central squares — e4, d4, e5, d5 — are the most valuable real estate on the board. A piece in the center attacks more squares than the same piece on the edge. Knights on the rim look pathetic; I will tell you that phrase three more times this year. Every opening begins with a fight for the center. Play e4, the most classic opening move in history.",
      audioClipId: "vo_gm_chess_g4_s01",
      boardFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      pieceFocus: "pawn",
      hint: "Push the e-pawn two squares to claim the center. In notation: 'e4'.",
      answerMoves: ["e4"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Good. My imaginary black opponent mirrors with e5, also claiming the center. Now principle two: DEVELOP YOUR MINOR PIECES. Minor pieces are the knights and the bishops. Get them off the back rank before you move your queen or your rooks. The fastest development move for you here is Nf3 — the king's knight jumps into the board AND attacks the e5 pawn at the same time.",
      audioClipId: "vo_gm_chess_g4_s02",
      boardFen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
      pieceFocus: "knight",
      hint: "Develop the king's knight to f3. In notation: 'Nf3'.",
      answerMoves: ["Nf3"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Black defends with Nc6. Now your bishop. The bishop on f1 has an open diagonal toward the Black kingside. Deploy it to c4, where it aims at the weakest square in Black's position: f7. Remember from Gate 2 — f7 is only defended by the king. That's why it is the classic target.",
      audioClipId: "vo_gm_chess_g4_s03",
      boardFen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
      pieceFocus: "bishop",
      hint: "Deploy the king's bishop to c4, aiming at f7. In notation: 'Bc4'.",
      answerMoves: ["Bc4"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "You have just played the first three moves of the ITALIAN GAME, one of the oldest openings in recorded chess. It has been played in tournaments since the 16th century. A Portuguese bishop named Damiano wrote about it in 1512. You are playing in a tradition older than most countries.",
      audioClipId: "vo_gm_chess_g4_s04",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Black mirrors development with Bc5. Principle three: CASTLE EARLY. Your king sits in the center, exposed, while both armies are opening files against him. Time to hide behind the pawn wall. Short castling is clear — knight and bishop have both developed. Play O-O.",
      audioClipId: "vo_gm_chess_g4_s05",
      boardFen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
      pieceFocus: "king",
      hint: "Castle kingside. In notation: 'O-O'.",
      answerMoves: ["O-O"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Now a quieter move. Principle four: CONNECT YOUR ROOKS. Rooks work in pairs, and they cannot see each other through a row of pieces. You need to finish developing your queenside so the rooks on a1 and f1 can eventually stare at each other across an empty back rank. The next step is d3 — quiet, opens a diagonal for your dark-squared bishop, and prepares c3 to support the center.",
      audioClipId: "vo_gm_chess_g4_s06",
      boardFen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 6 5",
      pieceFocus: "pawn",
      hint: "Push the d-pawn one square forward. In notation: 'd3'.",
      answerMoves: ["d3"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Principle five — the one beginners violate most often: DO NOT MOVE THE SAME PIECE TWICE in the opening without a concrete reason. Every second you spend moving the knight you already moved is a second your opponent spends developing a NEW piece. Tempo is the hidden currency of chess. Waste three tempi in the opening and you will lose before you understand what happened.",
      audioClipId: "vo_gm_chess_g4_s07",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Black develops Nf6, threatening your e4 pawn. Here is where the principle becomes a test: you want to PROTECT e4, but you also want to keep developing. The move Nc3 does both — it develops your queen's knight to a good square AND defends e4. Two things with one move. That is efficiency, which is the same word as elegance in chess.",
      audioClipId: "vo_gm_chess_g4_s08",
      boardFen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 2 6",
      pieceFocus: "knight",
      hint: "Develop the queen's knight to c3, defending e4. In notation: 'Nc3'.",
      answerMoves: ["Nc3"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "And the fifth development move — your dark-squared bishop finally leaves the back rank. Bg5 pins the Black knight on f6 to the queen behind it, which is a real tactical threat. The opening is essentially complete. You have two knights developed, two bishops developed, your king is castled, and your pieces are COORDINATED — they all see each other.",
      audioClipId: "vo_gm_chess_g4_s09",
      boardFen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 4 7",
      pieceFocus: "bishop",
      hint: "Develop the dark-squared bishop to g5 with a pin. In notation: 'Bg5'.",
      answerMoves: ["Bg5"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You have just played seven moves of the Italian Game and violated none of the five principles. Center controlled. Minor pieces developed. King castled. Pieces coordinated. No piece moved twice. This is what a well-played opening FEELS like — it feels like your pieces arrive at work on time and know each other.",
      audioClipId: "vo_gm_chess_g4_s10",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "Last warning of the gate: do not bring your queen out early. I know you want to. Every beginner wants to. The queen is the most powerful piece, so it SEEMS like she should do the work. But an early queen is expensive to defend — every enemy minor piece that develops attacks her, and you spend all your tempi running her back home. The queen waits. She enters the board when the knights have already cleared her path.",
      audioClipId: "vo_gm_chess_g4_s11",
      pieceFocus: "queen",
      autoAdvance: true,
    },
  ],
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_4_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_4_INTRO, GATE_4_OUTRO]);
