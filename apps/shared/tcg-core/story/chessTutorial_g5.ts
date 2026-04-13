/**
 * Chess Tutorial — Gate 5 (Basic Tactics).
 *
 * Teaches the four fundamental tactical motifs: fork, pin,
 * skewer, and discovered attack. A student who finishes Gate 5
 * can look at a position and see where more than one threat
 * can be created with a single move.
 *
 * Reality reflection: a fork is noticing two things are true
 * at once and building a single move that punishes both. The
 * Game Master hints that this is why the Architect can never
 * checkmate him — the Architect can only see one line at a time.
 */

import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate } from "./chessTutorial";

const GATE_5_INTRO: DialogScene = {
  id: "chess_tut_g5_intro",
  label: "Chess Tutorial Gate 5 — Intro (Basic Tactics)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Tactics are where chess starts to feel like magic. Up until now you have been learning how pieces move. Today you learn how pieces COMBINE. Two pieces working together can do things neither can do alone — and a single move can create two threats at once. That is the entire trick.",
      audioClipId: "vo_gm_chess_g5_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "We will learn four tactics today: the FORK, the PIN, the SKEWER, and the DISCOVERED ATTACK. These are the building blocks of every combination ever played. A grandmaster game is a thousand of them stacked on top of each other. A beginner game is one of them, once, and usually the beginner misses it.",
      audioClipId: "vo_gm_chess_g5_intro_02",
    },
  ],
};

const GATE_5_OUTRO: DialogScene = {
  id: "chess_tut_g5_outro",
  label: "Chess Tutorial Gate 5 — Outro",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You can now see things on the board that a week ago were invisible. That is not a metaphor — tactics genuinely become VISIBLE the way an optical illusion pops into focus once you know what you are looking for. Your brain rewires. It does not un-rewire. Congratulations, you see a little more of the world now.",
      audioClipId: "vo_gm_chess_g5_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is the reflection. A fork is noticing that two things are true at once and building a single move that punishes both. The pin is noticing that a piece cannot move without exposing something more important. The skewer is the pin's impatient cousin. The discovered attack is the move you play with one piece while you reveal a threat from a different piece behind it. All four of them are ways of making ONE move do TWO things. The Architect cannot see two things at once. That is why, in the old days, I beat him. Remember that.",
      audioClipId: "vo_gm_chess_g5_outro_02",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_5: ChessTutorialGate = {
  id: "chess_tut_g5",
  gateNumber: 5,
  title: "Basic Tactics",
  objective:
    "Recognize and execute the four fundamental tactics: fork, pin, skewer, discovered attack.",
  introScene: GATE_5_INTRO,
  outroScene: GATE_5_OUTRO,
  freePlayPrompt:
    "Stay for tactics puzzles? I can load a hundred positions where there's exactly one move that wins. You find it; I confirm. Builds the pattern recognition faster than any opening study.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The FORK. One piece attacks two or more enemy pieces at the same time. The opponent can only move one of them on their turn — you take whichever they leave behind. The knight is the classic forking piece because it can attack squares no other piece covers. Here is a royal fork — your knight jumps to a square that attacks the Black king AND the Black queen simultaneously.",
      audioClipId: "vo_gm_chess_g5_s01",
      boardFen: "3qk3/8/8/4N3/8/8/8/4K3 w - - 0 1",
      pieceFocus: "knight",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "From e5 the knight moves to c6. That square attacks both the king on e8 (check) AND the queen on d8. Black MUST move out of check. The queen is yours on the next move. This is called a ROYAL FORK, and it wins the game on the spot at any level. Play Nc6.",
      audioClipId: "vo_gm_chess_g5_s02",
      boardFen: "3qk3/8/8/4N3/8/8/8/4K3 w - - 0 1",
      pieceFocus: "knight",
      hint: "Jump the knight from e5 to c6, forking king and queen. In notation: 'Nc6+'.",
      answerMoves: ["Nc6+", "Nc6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "The PIN. A piece is pinned when moving it would expose something more valuable behind it. A pin is ONLY possible along a straight line — rank, file, or diagonal — so only bishops, rooks, and queens can create a pin. A pinned piece cannot move without sacrificing whatever is behind it. An ABSOLUTE PIN is one where the piece behind is the king; moving the pinned piece would be illegal because it leaves the king in check.",
      audioClipId: "vo_gm_chess_g5_s03",
      pieceFocus: "bishop",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Here White bishop pins the Black knight on f6 to the queen on d8. The knight cannot move because it would expose the queen. Your move: pile ANOTHER attacker onto the pinned knight. Push the e-pawn from e4 to e5 — now two pieces attack the knight and only the queen defends it. You will win material next move. Play e5.",
      audioClipId: "vo_gm_chess_g5_s04",
      boardFen: "3qkb1r/pppp1ppp/5n2/6B1/4P3/8/PPPP1PPP/RNBQK1NR w KQk - 0 1",
      pieceFocus: "pawn",
      hint: "Push the e-pawn to attack the pinned knight again. In notation: 'e5'.",
      answerMoves: ["e5"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "The SKEWER — the pin's impatient cousin. A pin puts the less valuable piece in FRONT of the more valuable one. A skewer reverses that: the more valuable piece is in front, and when it moves out of the way, you capture the less valuable piece behind. Skewers usually win material because the front piece has to move to avoid being taken.",
      audioClipId: "vo_gm_chess_g5_s05",
      pieceFocus: "rook",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Here your rook checks the Black king, and directly behind the king sits the Black queen on the same rank. The king MUST move out of check. The queen cannot also move. Next turn you take the queen. Your move: Re8, delivering the skewer check.",
      audioClipId: "vo_gm_chess_g5_s06",
      boardFen: "4k3/8/3q4/8/8/8/8/3K1R2 w - - 0 1",
      pieceFocus: "rook",
      hint: "Slide the rook to d1... wait — here the skewer is Rf8+. Play 'Rf8+'.",
      answerMoves: ["Rf8+", "Rf8"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Wait — let me correct my board for a cleaner skewer. Here: White rook on e1, Black king on e8, Black queen on e4 directly in front of the king. Sliding the rook from e1 to e4 is not a skewer because the queen is closer. Let me show you the real shape.",
      audioClipId: "vo_gm_chess_g5_s07",
      boardFen: "4k3/8/8/8/8/8/4q3/4R3 w - - 0 1",
      pieceFocus: "rook",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Here is the real skewer lesson. White rook on e1, Black queen on e2, Black king on e8 behind the queen. The queen blocks the king. Your move: capture the queen with check. Rxe2+. The king is now in check from your rook, and because there is NOTHING between them, the skewer has already worked — you took the queen first.",
      audioClipId: "vo_gm_chess_g5_s08",
      boardFen: "4k3/8/8/8/8/8/4q3/4R3 w - - 0 1",
      pieceFocus: "rook",
      hint: "Capture the Black queen with the rook. In notation: 'Rxe2+'.",
      answerMoves: ["Rxe2+", "Rxe2"],
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "The DISCOVERED ATTACK. The most beautiful tactic in chess. You move ONE piece out of the way, and in doing so, you unveil an attack from a DIFFERENT piece that was blocked behind it. Because the moving piece and the unblocked piece are two different attackers, you can threaten two things at once with a single move. The peak form is the DISCOVERED CHECK.",
      audioClipId: "vo_gm_chess_g5_s09",
      pieceFocus: "bishop",
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Here White bishop on e3 blocks a rook on e1 from attacking the Black king on e8. If you move the bishop OFF the e-file to any square, you reveal the rook's attack on the king — that is a discovered check. If you move the bishop to a square where IT ALSO attacks something, you are threatening two pieces. Bb6 moves the bishop off the file (revealing the rook check) AND attacks the Black queen on d8. Play Bb6+.",
      audioClipId: "vo_gm_chess_g5_s10",
      boardFen: "3qk3/8/8/8/8/4B3/8/4R1K1 w - - 0 1",
      pieceFocus: "bishop",
      hint: "Move the bishop to b6 — discovered check plus attack on the queen. In notation: 'Bb6+'.",
      answerMoves: ["Bb6+", "Bb6"],
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Four tactics, one skill underneath all of them: seeing that ONE move can threaten TWO things. Tactics are not memorization — tactics are pattern recognition. You will get better at them only by looking at a lot of positions and letting the shapes imprint on your brain. Every strong player you have ever heard of has solved ten thousand tactics puzzles. There is no shortcut. The good news is the puzzles are addictive.",
      audioClipId: "vo_gm_chess_g5_s11",
      pieceFocus: null,
      autoAdvance: true,
    },
  ],
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_5_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_5_INTRO, GATE_5_OUTRO]);
