/**
 * Chess Tutorial — Gate 4.5: The Prince's Game.
 *
 * A discoverable, playable replay of the only chess game the Game
 * Master ever lost. The Prince — known later as the Engineer —
 * was his greatest student. The game canonized here is Donald
 * Byrne vs. Bobby Fischer, "The Game of the Century" (Rosenwald
 * Memorial, New York, October 17, 1956): a thirteen-year-old
 * Fischer (Black) sacrificed his queen on move 17 (...Be6!!) and
 * won via a 41-move attack that the master could not see coming.
 *
 * In our fiction, the Prince was that student. The Game Master
 * sits across an empty chair where the Prince once sat, the chair
 * still set up for the position the Prince played from. The
 * player takes the Prince's seat and replays his winning moves.
 * The GM watches and reacts in real time — half teaching, half
 * grief. He is replaying the only game he ever lost, again, with
 * the same outcome, in front of a different student.
 *
 * The chess content is REAL. SAN notation is preserved exactly
 * from the historical game. Players who walk through this gate
 * walk through the actual sequence Fischer played. We use the
 * historical game because it is the most famous queen sacrifice
 * in chess history — the player gets to play a piece of real
 * chess history while the in-world fiction wraps it.
 *
 * Implementation note: rather than hand-computing FENs for every
 * step (error-prone), we derive them at module load by replaying
 * the canonical PGN through chess.js. That gives us a single
 * source of truth — change the move list and the boards
 * regenerate. A test verifies the PGN is legal and ends in mate.
 */

import { Chess } from "chess.js";
import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate, ChessTutorialStep } from "./chessTutorial";

/* ═══════════════════════════════════════════════════════
   THE PGN — Donald Byrne vs Bobby Fischer, NY 1956.
   ═══════════════════════════════════════════════════════ */

/** The full move list in SAN notation, White and Black moves
 *  alternating starting with White on move 1. Source: chessgames.com
 *  reference for "The Game of the Century". */
export const PRINCES_GAME_MOVES: readonly string[] = Object.freeze([
  // Opening
  "Nf3", "Nf6",
  "c4", "g6",
  "Nc3", "Bg7",
  "d4", "O-O",
  "Bf4", "d5",
  "Qb3", "dxc4",
  "Qxc4", "c6",
  "e4", "Nbd7",
  "Rd1", "Nb6",
  "Qc5", "Bg4",
  // Middlegame — the Prince's first surprising idea
  "Bg5", "Na4",
  "Qa3", "Nxc3",
  "bxc3", "Nxe4",
  "Bxe7", "Qb6",
  "Bc4", "Nxc3",
  "Bc5", "Rfe8+",
  // The queen sacrifice
  "Kf1", "Be6",
  "Bxb6", "Bxc4+",
  "Kg1", "Ne2+",
  "Kf1", "Nxd4+",
  "Kg1", "Ne2+",
  "Kf1", "Nc3+",
  "Kg1", "axb6",
  // The conversion
  "Qb4", "Ra4",
  "Qxb6", "Nxd1",
  "h3", "Rxa2",
  "Kh2", "Nxf2",
  "Re1", "Rxe1",
  "Qd8+", "Bf8",
  "Nxe1", "Bd5",
  "Nf3", "Ne4",
  "Qb8", "b5",
  "h4", "h5",
  "Ne5", "Kg7",
  // The mating net
  "Kg1", "Bc5+",
  "Kf1", "Ng3+",
  "Ke1", "Bb4+",
  "Kd1", "Bb3+",
  "Kc1", "Ne2+",
  "Kb1", "Nc3+",
  "Kc1", "Rc2#",
]);

/** The full game replayed at module load — used to derive FENs
 *  for the gate steps and to assert at startup that the canonical
 *  PGN is legal (a typo would surface as a thrown exception when
 *  the module is imported, before any user touches the gate).
 *
 *  Returns an array of FENs of length `PRINCES_GAME_MOVES.length + 1`
 *  where `fens[i]` is the position BEFORE move `i` is played
 *  (so `fens[0]` is the standard starting position and the final
 *  entry is the position after the mate). */
export function derivePrincesGameFens(): readonly string[] {
  const game = new Chess();
  const fens: string[] = [game.fen()];
  for (const san of PRINCES_GAME_MOVES) {
    const move = game.move(san);
    if (!move) {
      throw new Error(
        `chessTutorial_g4_5_princes_game: illegal PGN move "${san}" at ply ${fens.length}`,
      );
    }
    fens.push(game.fen());
  }
  if (!game.isCheckmate()) {
    throw new Error(
      "chessTutorial_g4_5_princes_game: PGN does not end in checkmate",
    );
  }
  return Object.freeze(fens);
}

/** Lazy-evaluated cache of the derived FENs. We compute on first
 *  access rather than at import time so circular-import edge cases
 *  during test setup don't blow up the whole module. */
let _fensCache: readonly string[] | null = null;
function getFens(): readonly string[] {
  if (_fensCache === null) _fensCache = derivePrincesGameFens();
  return _fensCache;
}

/** Helper: return the FEN for the position just BEFORE the
 *  half-move (ply) number is played. Ply 1 is White's first move;
 *  ply 17 is Black's 9th move; etc. */
export function fenBeforePly(ply: number): string {
  const fens = getFens();
  if (ply < 1 || ply > fens.length) {
    throw new Error(
      `fenBeforePly(${ply}) out of range; max ply is ${fens.length - 1}`,
    );
  }
  return fens[ply - 1];
}

/** Helper: return the SAN move at a given half-move number
 *  (1-indexed: ply 1 = White's first move). */
export function moveAtPly(ply: number): string {
  if (ply < 1 || ply > PRINCES_GAME_MOVES.length) {
    throw new Error(
      `moveAtPly(${ply}) out of range; max ply is ${PRINCES_GAME_MOVES.length}`,
    );
  }
  return PRINCES_GAME_MOVES[ply - 1];
}

/* ═══════════════════════════════════════════════════════
   STEP CONSTRUCTION HELPERS

   Most steps are built by `step()` (a player move with GM
   commentary) or `lecture()` (a non-interactive GM cue that
   advances the board state to a checkpoint). Both share the
   same shape — only `answerMoves` and `autoAdvance` differ.
   ═══════════════════════════════════════════════════════ */

interface PlayerMoveOptions {
  /** Black's half-move number (1-indexed in the canonical PGN — so
   *  ply 22 means Black's 11th move, Na4). */
  ply: number;
  text: string;
  audioClipId: string;
  hint?: string;
  mood?: ChessTutorialStep["mood"];
}

/** A step where the player must play exactly one Black move at
 *  the given ply. The board is set to the position before that
 *  move; the answer is the canonical SAN. */
function step(opts: PlayerMoveOptions): ChessTutorialStep {
  const san = moveAtPly(opts.ply);
  return {
    speaker: "game_master_celebration",
    mood: opts.mood ?? "reflective",
    text: opts.text,
    audioClipId: opts.audioClipId,
    boardFen: fenBeforePly(opts.ply),
    pieceFocus: null,
    answerMoves: [san],
    hint: opts.hint ?? `The Prince played ${san}.`,
  };
}

interface LectureOptions {
  /** The board state to display while this cue speaks — typically
   *  the checkpoint position at the end of a multi-move
   *  white-side run the GM is narrating. Use the half-move number
   *  AFTER which the position is shown. */
  showPositionAfterPly: number;
  text: string;
  audioClipId: string;
  mood?: ChessTutorialStep["mood"];
}

/** A non-interactive cue. The GM speaks; the board updates; the
 *  step auto-advances. */
function lecture(opts: LectureOptions): ChessTutorialStep {
  const fens = getFens();
  const fenIndex = opts.showPositionAfterPly;
  if (fenIndex < 0 || fenIndex >= fens.length) {
    throw new Error(
      `lecture(showPositionAfterPly=${fenIndex}) out of range; max ${fens.length - 1}`,
    );
  }
  return {
    speaker: "game_master_celebration",
    mood: opts.mood ?? "reflective",
    text: opts.text,
    audioClipId: opts.audioClipId,
    boardFen: fens[fenIndex],
    pieceFocus: null,
    autoAdvance: true,
  };
}

/* ═══════════════════════════════════════════════════════
   GATE 4.5 — INTRO SCENE
   The chamber is different on this visit. The chair across the
   board is empty in the way an unused chair is empty, until you
   notice the position the pieces are set to and realize the chair
   is empty in a different way.
   ═══════════════════════════════════════════════════════ */

const GATE_4_5_INTRO: DialogScene = {
  id: "chess_tut_g4_5_intro",
  label: "Chess Tutorial Gate 4.5 — Intro (The Prince's Chair)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "Chamber C-7 is dim when you enter. The Game Master is sitting at the oak table, but he is not looking at you. He is looking at the chair across from him, where the pieces are already set to a position you do not recognize — middlegame, twenty moves in, a knight on a4 that should not be there. The chair opposite him is empty in a way the room seems to be deliberately preserving.",
      audioClipId: "vo_narr_chess_g4_5_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Sit down. I want to show you a game. The position you are looking at is from move ten — black to play move eleven. The boy who was sitting in your chair when this position appeared was about your age the first time he understood the openings. He had finished Gate 4 the previous month. He thought he had learned what I was teaching him. He was about to demonstrate that he had learned considerably more than that.",
      audioClipId: "vo_gm_chess_g4_5_intro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "His name was the Prince — a kingdom you have not heard of, and which does not exist anymore. After he stopped wanting the title he became the Engineer. The Galaxy's last great inventor. You may have heard one of those names; you have probably heard both. He was my student. He was the only student who ever beat me. Today you are going to play his side.",
      audioClipId: "vo_gm_chess_g4_5_intro_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "I have replayed this game seven thousand times. I am about to lose it again. I want you to play his moves the way he played them — not because I cannot find them on my own, but because I have never been able to play them myself. They are not in me. They were in him. Make them with me. Sit.",
      audioClipId: "vo_gm_chess_g4_5_intro_04",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   GATE 4.5 — STEPS

   We do not make the player play all 41 Black moves — the famous
   sequence is a cluster of pivots and a long mating net. The
   gate covers the dramatic arc:
     - Set the position at the start of move 11 (Black to play)
     - Play the three preparatory captures (...Na4, Nxc3, Nxe4)
     - Auto-advance through the moves where White is forced
     - Stop at the queen sacrifice (...Be6) and let the player MAKE it
     - Walk the windmill (player plays each check by hand)
     - Auto-advance the conversion middlegame
     - Stop at the final mate (...Rc2#) and let the player MAKE it
   ═══════════════════════════════════════════════════════ */

const STEPS: readonly ChessTutorialStep[] = Object.freeze([
  // Frame the position. Show the board at move 1 first so the
  // player sees the standard opening setup, then jump to the
  // checkpoint where the Prince's actual play starts.
  lecture({
    showPositionAfterPly: 0,
    mood: "warm",
    text: "Standard opening grid. White moved first. The Prince played the King's Indian setup — fianchetto bishop, castle short, hold the center for later. By move ten the position has reached this. He is Black. Watch.",
    audioClipId: "vo_gm_chess_g4_5_s01",
  }),
  lecture({
    showPositionAfterPly: 21, // After 11.Bg5
    mood: "curious",
    text: "Move 11. White has just played Bg5, pinning the knight on f6 against my queen on c5. The textbook reply is to break the pin with h6 or move the queen. The Prince did neither. He attacked the queen with the knight from b6.",
    audioClipId: "vo_gm_chess_g4_5_s02",
  }),
  step({
    ply: 22, // ...Na4
    mood: "warm",
    text: "Play the move. Knight to a4 — attacking my queen on c5 and asking my queen on c4 a question at the same time.",
    audioClipId: "vo_gm_chess_g4_5_s03",
    hint: "The Prince played Na4 — a double attack from a square nobody was watching.",
  }),
  step({
    ply: 24, // ...Nxc3
    mood: "reflective",
    text: "I move my queen to a3. He immediately takes the knight on c3 — winning the pawn structure war and forcing me to recapture.",
    audioClipId: "vo_gm_chess_g4_5_s04",
  }),
  step({
    ply: 26, // ...Nxe4
    mood: "guarded",
    text: "I recapture with bxc3. He plays — this. He takes the central pawn with the f6 knight, leaving his queen still attacked by my bishop on g5. I genuinely thought he had blundered.",
    audioClipId: "vo_gm_chess_g4_5_s05",
    hint: "Nxe4 — accepting that his queen is hanging because his pieces are about to come everywhere.",
  }),
  lecture({
    showPositionAfterPly: 33, // After 17.Kf1 (Black to play 17...Be6)
    mood: "guarded",
    text: "The next moves were forced. My bishop took his queen's pawn shield; he interposed and developed; I retreated; my king ran to f1 because he had checked me with the rook. We arrive here. The position you are looking at is the position the Prince was sitting in front of when he made the move that became the most replayed move in chess history.",
    audioClipId: "vo_gm_chess_g4_5_s06",
  }),
  step({
    ply: 34, // ...Be6 — THE QUEEN SACRIFICE
    mood: "cryptic",
    text: "Bishop to e6. Look at it carefully before you play it. He is OFFERING ME HIS QUEEN. I take it next move with my own bishop. He gets nothing in return except a check — and a position where every one of his pieces is on a square it should not be allowed to be on. Play Be6.",
    audioClipId: "vo_gm_chess_g4_5_s07",
    hint: "Be6 — the queen sacrifice. I will take the queen. He has seen further than that.",
  }),
  step({
    ply: 36, // ...Bxc4+
    mood: "warm",
    text: "I take the queen with Bxb6. He recaptures my queen-side bishop with check. Now look at the board — I am up a queen, but every piece I own is on the queenside and his pieces are converging on my king. The material score lies. The position is already lost.",
    audioClipId: "vo_gm_chess_g4_5_s08",
  }),
  step({
    ply: 38, // ...Ne2+
    mood: "reflective",
    text: "I sidestep with Kg1. He starts the windmill. Knight to e2 with check.",
    audioClipId: "vo_gm_chess_g4_5_s09",
  }),
  step({
    ply: 40, // ...Nxd4+
    mood: "reflective",
    text: "I retreat to f1. He takes the d4 pawn with check. The windmill is rotating one tooth at a time and every tooth grinds material off me.",
    audioClipId: "vo_gm_chess_g4_5_s10",
  }),
  step({
    ply: 42, // ...Ne2+
    mood: "guarded",
    text: "Kg1. He brings the knight back to e2 with check. The same square. I cannot stop him; I can only choose which square to retreat to between his moves.",
    audioClipId: "vo_gm_chess_g4_5_s11",
  }),
  step({
    ply: 44, // ...Nc3+
    mood: "guarded",
    text: "Kf1. Knight to c3 with check. He now threatens my rook on d1 from c3 while still rotating around my king.",
    audioClipId: "vo_gm_chess_g4_5_s12",
  }),
  step({
    ply: 46, // ...axb6
    mood: "reflective",
    text: "Kg1. He takes my dark-square bishop on b6 with the a-pawn — the bishop I won the queen with is now lost as well, with interest. I am still nominally ahead in material. I am demonstrably losing.",
    audioClipId: "vo_gm_chess_g4_5_s13",
  }),
  lecture({
    showPositionAfterPly: 81, // After 41.Kc1 — Black to play the mate
    mood: "reflective",
    text: "What follows the windmill is twenty moves of pure technique. He simplifies, picks off my pieces one by one, and walks his remaining force into a mating net. I will spare you the choreography. The position you are looking at is what was left when the smoke cleared. My king is on c1, hounded back across the board by his bishops and his knight. It is his move. The mate is one rook lift away. Find it.",
    audioClipId: "vo_gm_chess_g4_5_s14",
  }),
  step({
    ply: 82, // ...Rc2#  (Black's 41st move = ply 82)
    mood: "warm",
    text: "Rook to c2. Mate. The rook is defended by the bishop on b3 along the diagonal, the king's only flight squares are covered by the knight on c3 and the second rook. Every piece he has been moving for thirty moves is doing exactly the work it was placed to do. Play Rc2 mate.",
    audioClipId: "vo_gm_chess_g4_5_s15",
    hint: "Rc2#. The rook is defended by the bishop on b3; the king is netted.",
  }),
]);

/* ═══════════════════════════════════════════════════════
   GATE 4.5 — OUTRO SCENE
   He resigns. He has resigned this position seven thousand
   times. He resigns it again, with you, and tells you what he
   never told the Prince.
   ═══════════════════════════════════════════════════════ */

const GATE_4_5_OUTRO: DialogScene = {
  id: "chess_tut_g4_5_outro",
  label: "Chess Tutorial Gate 4.5 — Outro (Resignation)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Resignation. I would have played on if I thought there was any chance, but there is no chance — there has never been a chance from move 17 onward, and the Prince knew it before I did. Good. You played his game. Stand for a moment. The chair you are sitting in has a kind of warmth that does not transfer to the next student.",
      audioClipId: "vo_gm_chess_g4_5_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "I have replayed this game seven thousand times and I still do not see the move before it arrives. He sacrificed his queen for two minor pieces, a check, and a position. Every textbook of chess written before this game would have told you it was a blunder. Every textbook written after had to be rewritten. Lasker — a real teacher, two centuries before me — wrote that on the chessboard, lies and hypocrisy do not survive long. He was right. The Prince proved it on me.",
      audioClipId: "vo_gm_chess_g4_5_outro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "He was the only student who ever beat me. He was the only student I ever wanted to beat me. The two are the same sentence. A teacher's job ends the day his student doesn't need him anymore — that is not a tragedy, it is the point. The tragedy is what came AFTER that day, and that is not in this room, and I am not going to talk about it now. We were here for the chess. The chess was perfect.",
      audioClipId: "vo_gm_chess_g4_5_outro_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "One thing about him you should know. He carved his own knight pieces. Just like I carved mine — that is where I got the idea. The knights in the set you will receive at the end of this curriculum are the knights I carved before I knew him. The knights HE carved are still in his workshop, somewhere, in a box that has not been opened in a very long time. If you ever find that box, send it back to whoever you became to need to find it. The knights in it are not just knights. They are letters he never sent.",
      audioClipId: "vo_gm_chess_g4_5_outro_04",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Game Master tips his king. The chair opposite him is not empty the way an unused chair is empty. It is empty the way a grave is empty after a resurrection. He looks at the chair longer than feels comfortable. Then he looks at you and offers his hand again — the same way he did on the very first gate — and you take it, and the chamber lights brighten by half a step.",
      audioClipId: "vo_narr_chess_g4_5_outro_05",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   GATE 4.5 — EXPORT
   ═══════════════════════════════════════════════════════ */

export const CHESS_TUTORIAL_GATE_4_5: ChessTutorialGate = {
  id: "chess_tut_g4_5",
  // gateNumber 0 = SIDE GATE — outside the linear 1..7
  // progression. Unlocked after the player completes Gate 4 but
  // not required for advancement. Lives in
  // `CHESS_TUTORIAL_SIDE_GATES` (see chessTutorial.ts), not in
  // the main `CHESS_TUTORIAL_GATES` array. This avoids
  // renumbering existing gates or migrating in-flight player
  // progress.
  gateNumber: 0,
  title: "The Prince's Game",
  objective:
    "Replay the only game the Game Master ever lost — moves canonized in chess history, played here in his presence.",
  introScene: GATE_4_5_INTRO,
  outroScene: GATE_4_5_OUTRO,
  freePlayPrompt:
    "There will not be a freestyle rematch on this gate. You played his game. There is nothing to add to it.",
  steps: STEPS,
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_4_5_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_4_5_INTRO, GATE_4_5_OUTRO]);

