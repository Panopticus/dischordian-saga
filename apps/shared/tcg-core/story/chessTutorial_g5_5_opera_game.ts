/**
 * Chess Tutorial — Gate 5.5: The Engineer's Notebook (Opera Game).
 *
 * A second discoverable side gate, parallel to Gate 4.5. Where 4.5
 * is the Prince's loss to himself replayed in his old chamber, 5.5
 * is the FIRST historical game the Prince — then a child, before
 * he became the Engineer — pasted into the notebook he carried for
 * the rest of his life. The Game Master kept a copy of that
 * notebook. He pulls it out when a student earns it.
 *
 * The canonical game: Paul Morphy vs. Duke Karl of Brunswick &
 * Count Isouard, Paris Opera House, October 21, 1858. The most
 * famous teaching game in chess history — a 17-move attack that
 * turns rapid development, the open file, and an exposed king
 * into mate. The player takes White (Morphy's side).
 *
 * Unlocks after Gate 5 (Basic Tactics). The fork, pin, and
 * discovered attack the player drilled in Gate 5 all appear
 * naturally in the line.
 *
 * Same implementation pattern as Gate 4.5: derive FENs at module
 * load by replaying the canonical PGN through chess.js, so the
 * step boards are guaranteed legal.
 */

import { Chess } from "chess.js";
import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate, ChessTutorialStep } from "./chessTutorial";

/* ═══════════════════════════════════════════════════════
   THE PGN — Morphy vs Brunswick/Isouard, Paris 1858.
   ═══════════════════════════════════════════════════════ */

/** The full move list in SAN notation, White and Black moves
 *  alternating starting with White on move 1. Source:
 *  chessgames.com reference for "A Night at the Opera". */
export const OPERA_GAME_MOVES: readonly string[] = Object.freeze([
  // Opening — Philidor Defense
  "e4", "e5",
  "Nf3", "d6",
  "d4", "Bg4",
  // The exchange Morphy used to win a tempo
  "dxe5", "Bxf3",
  "Qxf3", "dxe5",
  "Bc4", "Nf6",
  // The double attack on f7 + b7
  "Qb3", "Qe7",
  "Nc3", "c6",
  // The opera-house combination begins
  "Bg5", "b5",
  "Nxb5", "cxb5",
  "Bxb5+", "Nbd7",
  "O-O-O", "Rd8",
  // The first sacrifice
  "Rxd7", "Rxd7",
  "Rd1", "Qe6",
  "Bxd7+", "Nxd7",
  // The mating combination
  "Qb8+", "Nxb8",
  "Rd8#",
]);

/** Replay the canonical PGN through chess.js to derive the FEN
 *  before every half-move. Throws if the PGN is illegal — surfaces
 *  any typo at module import rather than at gate-play time. */
export function deriveOperaGameFens(): readonly string[] {
  const game = new Chess();
  const fens: string[] = [game.fen()];
  for (const san of OPERA_GAME_MOVES) {
    const move = game.move(san);
    if (!move) {
      throw new Error(
        `chessTutorial_g5_5_opera_game: illegal PGN move "${san}" at ply ${fens.length}`,
      );
    }
    fens.push(game.fen());
  }
  if (!game.isCheckmate()) {
    throw new Error(
      "chessTutorial_g5_5_opera_game: PGN does not end in checkmate",
    );
  }
  return Object.freeze(fens);
}

let _fensCache: readonly string[] | null = null;
function getFens(): readonly string[] {
  if (_fensCache === null) _fensCache = deriveOperaGameFens();
  return _fensCache;
}

/** FEN for the position just BEFORE the half-move (ply) is played. */
export function fenBeforePly(ply: number): string {
  const fens = getFens();
  if (ply < 1 || ply > fens.length) {
    throw new Error(
      `fenBeforePly(${ply}) out of range; max ply is ${fens.length - 1}`,
    );
  }
  return fens[ply - 1];
}

/** SAN move at a given half-move number (1-indexed). */
export function moveAtPly(ply: number): string {
  if (ply < 1 || ply > OPERA_GAME_MOVES.length) {
    throw new Error(
      `moveAtPly(${ply}) out of range; max ply is ${OPERA_GAME_MOVES.length}`,
    );
  }
  return OPERA_GAME_MOVES[ply - 1];
}

/* ═══════════════════════════════════════════════════════
   STEP CONSTRUCTION HELPERS — same shape as gate 4.5.
   ═══════════════════════════════════════════════════════ */

interface PlayerMoveOptions {
  /** White's half-move number (odd plies are White; ply 1 = White's
   *  first move, ply 25 = White's 13th move, etc.). */
  ply: number;
  text: string;
  audioClipId: string;
  hint?: string;
  mood?: ChessTutorialStep["mood"];
}

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
    hint: opts.hint ?? `Morphy played ${san}.`,
  };
}

interface LectureOptions {
  /** Show the position AFTER this half-move number. Use 0 for the
   *  starting position. */
  showPositionAfterPly: number;
  text: string;
  audioClipId: string;
  mood?: ChessTutorialStep["mood"];
}

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
   GATE 5.5 — INTRO SCENE
   The chamber is the same. The notebook is new — leather
   binding, the spine cracked from being opened the same
   way for forty years. The Game Master sets it on the
   table between the two of you.
   ═══════════════════════════════════════════════════════ */

const GATE_5_5_INTRO: DialogScene = {
  id: "chess_tut_g5_5_intro",
  label: "Chess Tutorial Gate 5.5 — Intro (The Engineer's Notebook)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "Chamber C-7 is the same chamber. The Game Master is the same man. What is different is the notebook on the table — a thin leather thing the size of a child's palm, the spine cracked, the corners rounded by years of being carried in a pocket. He sets it down between the two of you. The pages fall open at the same place every time, the way a well-loved book remembers its own favorite passages.",
      audioClipId: "vo_narr_chess_g5_5_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "This was the Prince's notebook before he became the Engineer. He carried it for the rest of his life. He let me see inside it once, the year he stopped being my student and started being my friend. I copied this page in my own hand. The original is in a box in his workshop somewhere; the copy is what I am about to walk you through.",
      audioClipId: "vo_gm_chess_g5_5_intro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The page is a real game. Paris Opera House, twenty-first of October, eighteen fifty-eight. Paul Morphy — an American chess prodigy traveling Europe, twenty-one years old — was watching Bellini's Norma in a private box with two friends from the audience. The friends were the Duke of Brunswick and Count Isouard, both serious amateurs. Between acts they convinced him to play a game. He agreed because his manners were impeccable and his attention span for opera was modest.",
      audioClipId: "vo_gm_chess_g5_5_intro_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "The two of them played as a single unit — consulting, arguing — and Morphy played alone. The opera continued in the background. He won in seventeen moves. The game has been studied by every aspiring player for one hundred and seventy years because every principle a beginner needs to internalize — rapid development, attack the king before he gets safe, sacrifice material for a forced mate — happens in plain view. Today you will play Morphy's side. The Prince played it first when he was about your age. He marked the page with a single word in the margin: WORTHWHILE.",
      audioClipId: "vo_gm_chess_g5_5_intro_04",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The opening is the Philidor Defense. Black's third move — Bg4 — is the small mistake that lets the rest of the game happen. Most beginners would not punish it. Morphy did. Watch.",
      audioClipId: "vo_gm_chess_g5_5_intro_05",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   GATE 5.5 — STEPS

   The player takes Morphy's side (White). We make the player
   play the moves that EARN their place in the canon — the
   pawn exchange that wins the bishop, the queen sortie, the
   knight sacrifice on b5, the rook sacrifice, and the mating
   sequence. The other moves are narrated as the GM walks
   through the position.
   ═══════════════════════════════════════════════════════ */

const STEPS: readonly ChessTutorialStep[] = Object.freeze([
  // Plies 1-5 — the opening moves are narrated, not interactive.
  // The player does not need to play "e4 / Nf3" — those are
  // standard. The first move that earns the player's hands on
  // the pieces is the pawn capture on e5 at ply 7.
  lecture({
    showPositionAfterPly: 5,
    text: "Move one: e4. Move two: Nf3, attacking the e5 pawn. Move three for White is d4 — opening the center BEFORE Black has gotten his pieces out. Black responds with Bg4, pinning the f3 knight against the queen. The pin LOOKS strong. Morphy sees what most players do not — that the bishop is itself badly placed because it is not defended.",
    audioClipId: "vo_gm_chess_g5_5_s01",
    mood: "curious",
  }),
  // Ply 7 — White's 4th move, the key dxe5.
  step({
    ply: 7,
    text: "Morphy's punishment. White captures on e5 — dxe5. The bishop on g4 is pinned but the pin is BROKEN by the capture, because the pawn that takes is itself attacked by Black's d-pawn, and the queen can recapture on f3 if the bishop takes the knight. Calculate the exchange before you play. Then play dxe5.",
    audioClipId: "vo_gm_chess_g5_5_s02",
    hint: "Capture the e5 pawn with the d-pawn: dxe5.",
    mood: "warm",
  }),
  // Ply 8 — Black takes the knight (Bxf3). Narrated.
  lecture({
    showPositionAfterPly: 8,
    text: "Black's reply: Bxf3, taking the knight. Black thinks they have won material — they have a piece for two pawns. They have not noticed that the queen on f3 is now perfectly placed.",
    audioClipId: "vo_gm_chess_g5_5_s03",
  }),
  // Ply 9 — White's Qxf3, a key recapture.
  step({
    ply: 9,
    text: "Recapture with the queen. Morphy plays Qxf3. The queen lands on a square that simultaneously eyes Black's b7 pawn AND f7. The double-target is the entire rest of the game — every move from here is built on those two diagonals.",
    audioClipId: "vo_gm_chess_g5_5_s04",
    hint: "Recapture: Qxf3.",
    mood: "curious",
  }),
  // Ply 10 — dxe5, Black recovers a pawn. Narrated.
  lecture({
    showPositionAfterPly: 13,
    text: "Black takes the e5 pawn (dxe5), evening the material count: each side has lost a piece. Morphy then plays Bc4 — the bishop joins the queen in pointing at f7. Black, sensing pressure, develops Nf6 to defend. The position is balanced in pieces, but White has THREE attackers on the kingside and Black has zero defenders other than the king himself. That asymmetry is the position.",
    audioClipId: "vo_gm_chess_g5_5_s05",
  }),
  // Ply 13 — Qb3, the second queen sortie. Player plays.
  step({
    ply: 13,
    text: "Now the move that announces the attack. Qb3 — the queen swings to b3, simultaneously threatening b7 (the unprotected pawn) and ALSO threatening f7 in concert with the bishop on c4. Two targets, one move. This is the FORK pattern from Gate 5, applied at the queen scale.",
    audioClipId: "vo_gm_chess_g5_5_s06",
    hint: "Move the queen to b3: Qb3.",
    mood: "warm",
  }),
  // Ply 14 — Qe7, defends f7 indirectly. Narrated.
  lecture({
    showPositionAfterPly: 16,
    text: "Black plays Qe7, defending f7 indirectly via blocking the diagonal. White cannot just take on f7 — Black would recapture and the attack stalls. So Morphy develops his last piece: Nc3. The Prince noted this in the margin — 'finish development BEFORE the combination, even when the combination is in your hands'.",
    audioClipId: "vo_gm_chess_g5_5_s07",
  }),
  // Ply 16-17 — Black plays c6, defending b7 indirectly.
  // Then White's Bg5, the pin that begins the combination.
  lecture({
    showPositionAfterPly: 17,
    text: "Black plays c6 to defend b7 by preparing b5 to kick the bishop. Now Morphy plays Bg5, pinning the f6 knight against the queen on e7. This is the PIN from Gate 5, used to immobilize Black's only kingside defender. Black is now playing for survival.",
    audioClipId: "vo_gm_chess_g5_5_s08",
  }),
  // Ply 18 — Black plays b5, kicking the bishop. Narrated.
  lecture({
    showPositionAfterPly: 18,
    text: "Black plays b5, attacking the bishop and trying to free the queenside. The natural move is to retreat the bishop. The natural move is wrong.",
    audioClipId: "vo_gm_chess_g5_5_s09",
    mood: "cryptic",
  }),
  // Ply 19 — Nxb5! The first sacrifice. Player plays this.
  step({
    ply: 19,
    text: "The first sacrifice. White plays Nxb5 — taking the pawn with the knight, knowing Black will recapture with the c6 pawn. White is giving up a knight for a pawn to OPEN THE B-FILE for the queen. Most beginners do not see this move because they are counting material. Morphy sees the OPEN FILE the move creates. Play Nxb5.",
    audioClipId: "vo_gm_chess_g5_5_s10",
    hint: "Sacrifice the knight: Nxb5.",
    mood: "warm",
  }),
  // Ply 20 — cxb5, accepted. Then White's Bxb5+, check.
  lecture({
    showPositionAfterPly: 20,
    text: "Black accepts: cxb5. The c-file is now open and the b-pawn is doubled. White's bishop is still on c4 with a clear diagonal to f7 AND now a clear path to b5 with check.",
    audioClipId: "vo_gm_chess_g5_5_s11",
  }),
  // Ply 21 — Bxb5+. Player plays.
  step({
    ply: 21,
    text: "Bxb5 with check. White recovers most of the material — bishop for two pawns is a fair trade — but the real prize is the CHECK. Black must respond to the check before doing anything else. The tempo is everything.",
    audioClipId: "vo_gm_chess_g5_5_s12",
    hint: "Bishop takes b5 with check: Bxb5+.",
    mood: "curious",
  }),
  // Ply 22 — Black blocks with Nbd7. Narrated.
  // Ply 23 — White castles queenside, O-O-O. Player plays this.
  lecture({
    showPositionAfterPly: 22,
    text: "Black blocks with Nbd7 — the only way to address the check without losing the queen. The knight is now PINNED against the king AND simultaneously the queen behind it. Morphy castles next.",
    audioClipId: "vo_gm_chess_g5_5_s13",
  }),
  // Ply 23 — O-O-O.
  step({
    ply: 23,
    text: "Castle queenside. O-O-O. The king tucks safely on c1 and — more importantly — the rook on d1 lands DIRECTLY on the file where the pinned knight is sitting. The rook now adds a third attacker to the d7 knight, which is defended by the king and the rook on a8. Three attackers; two defenders. The exchange wins.",
    audioClipId: "vo_gm_chess_g5_5_s14",
    hint: "Castle queenside: O-O-O.",
    mood: "warm",
  }),
  // Ply 24 — Black plays Rd8 to add another defender.
  // Ply 25 — Rxd7! the second sacrifice.
  lecture({
    showPositionAfterPly: 24,
    text: "Black plays Rd8, adding another defender to the knight. Three defenders versus three attackers. A normal player would maneuver patiently. Morphy does not.",
    audioClipId: "vo_gm_chess_g5_5_s15",
    mood: "cryptic",
  }),
  step({
    ply: 25,
    text: "The second sacrifice — Rxd7. White takes the knight with the rook, knowing Black will recapture with the rook. Morphy is giving up a rook for a knight to STRIP THE LAST DEFENDER from the king. The arithmetic looks bad. The position arithmetic looks fatal — for Black.",
    audioClipId: "vo_gm_chess_g5_5_s16",
    hint: "Take the knight with the rook: Rxd7.",
    mood: "warm",
  }),
  // Ply 26 — Black recaptures Rxd7.
  // Ply 27 — White brings the second rook to the open d-file.
  lecture({
    showPositionAfterPly: 26,
    text: "Black recaptures: Rxd7. Black now has rook + queen on the d-file, and White's queen is at b3 staring at b7. Both kings are exposed; Morphy must move first OR lose the initiative.",
    audioClipId: "vo_gm_chess_g5_5_s17",
  }),
  step({
    ply: 27,
    text: "Bring the other rook in. Rd1, doubling on the d-file behind the bishop on c4. White now has TWO heavy pieces aimed at the pinned rook on d7. Black's queen alone defends. The position is two moves from mate.",
    audioClipId: "vo_gm_chess_g5_5_s18",
    hint: "Rook to d1: Rd1.",
    mood: "warm",
  }),
  // Ply 28 — Black plays Qe6, trying to defend.
  // Ply 29 — White plays Bxd7+ Nxd7 (recaptured by Black knight).
  lecture({
    showPositionAfterPly: 30,
    text: "Black plays Qe6, trying to defend the rook with the queen. Morphy plays Bxd7+ — taking the rook with the bishop, check. Black is forced to recapture: Nxd7. The bishop has been spent for the rook.",
    audioClipId: "vo_gm_chess_g5_5_s19",
  }),
  // Ply 31 — Qb8+! the queen sacrifice.
  step({
    ply: 31,
    text: "The queen sacrifice. Qb8+. White offers the queen to Black's knight on d7. Black MUST take — the alternative is checkmate next move via Qxa8. After Black takes, the position is forced to mate in one. Calculate it before you play. Then play Qb8+.",
    audioClipId: "vo_gm_chess_g5_5_s20",
    hint: "Queen sacrifice: Qb8+.",
    mood: "cryptic",
  }),
  // Ply 32 — Black is forced to take: Nxb8.
  // Ply 33 — Rd8# — checkmate.
  lecture({
    showPositionAfterPly: 32,
    text: "Black takes: Nxb8 — forced. The Black knight has captured the queen, but the knight is now BLOCKING its own king on the d-file. The rook on d1 has a clear lane to the back rank. Morphy plays the move that ends the game.",
    audioClipId: "vo_gm_chess_g5_5_s21",
    mood: "warm",
  }),
  step({
    ply: 33,
    text: "Rd8 mate. The rook slides to d8 — checkmate. The Black king cannot move, cannot block, cannot capture. The bishop on b8 is its own king's coffin. Play Rd8#.",
    audioClipId: "vo_gm_chess_g5_5_s22",
    hint: "Rook to d8 — checkmate: Rd8#.",
    mood: "warm",
  }),
]);

/* ═══════════════════════════════════════════════════════
   GATE 5.5 — OUTRO SCENE
   The notebook closes. The Game Master keeps it under his
   palm a moment longer than feels deliberate, then slides
   it back into his coat. The chamber is the same chamber.
   ═══════════════════════════════════════════════════════ */

const GATE_5_5_OUTRO: DialogScene = {
  id: "chess_tut_g5_5_outro",
  label: "Chess Tutorial Gate 5.5 — Outro (The Margin Note)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Mate. Seventeen moves, two heavy-piece sacrifices, one queen sacrifice, every minor piece spent. Morphy left the opera box without finishing the second act. The Duke was reportedly more impressed by the chess than by Norma, which says something about both.",
      audioClipId: "vo_gm_chess_g5_5_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "The reason this game is in the notebook — the reason it has been in EVERY chess notebook since 1859 — is that it teaches the entire opening principle set you learned in Gate 4 by VIOLATING IT IN PUBLIC. Black's opening was passive. Black left his king in the center. Black grabbed material instead of completing development. Morphy punished every single one of those errors in a single forced sequence. The instruction is: the principles are not preferences. They are what is true about the position. When your opponent breaks them, the punishment is concrete and findable.",
      audioClipId: "vo_gm_chess_g5_5_outro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "The Prince wrote one word in the margin of this page when he was eleven. WORTHWHILE. Underlined twice, in a careful child's hand, slightly off the line. Below it, in his adult handwriting, in a different ink, he later added: 'I went back to this game thirty years later and the word was still right.' That second annotation is the part I cannot read out loud without the room going slightly quiet. Some things stay worthwhile across the entire arc of a life. Most things do not.",
      audioClipId: "vo_gm_chess_g5_5_outro_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "I will leave the notebook on the table. You can come back and turn the pages whenever you want — there are nine other annotated games inside, and I will walk you through them in time. The Prince's other annotations include a ranked list of his favorite endgames, a single line about Capablanca that I will not paraphrase because the original is funnier, and a passage on the use of the word OPPONENT versus COLLABORATOR that I will probably read to you on the day you decide to leave the academy. Not today. Today we end on the mate.",
      audioClipId: "vo_gm_chess_g5_5_outro_04",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The notebook closes. The Game Master keeps his palm on the leather a moment longer than seems strictly necessary, then slides the notebook into the inside pocket of the wool jacket — the same jacket he was wearing when you first sat down. He nods at the empty chair across the table the way someone nods at a friend who is late but on his way. The chamber lights brighten by half a step. The board resets itself.",
      audioClipId: "vo_narr_chess_g5_5_outro_05",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   GATE 5.5 — EXPORT
   ═══════════════════════════════════════════════════════ */

export const CHESS_TUTORIAL_GATE_5_5: ChessTutorialGate = {
  id: "chess_tut_g5_5",
  // gateNumber 0 marks this as a SIDE GATE (same convention as
  // Gate 4.5). Side gates live outside the linear 1..7 progression
  // and ship via CHESS_TUTORIAL_SIDE_GATES so currentGate stays
  // monotonic. Unlock predicate is in chessTutorial.ts —
  // requires Gate 5 (Basic Tactics) cleared.
  gateNumber: 0,
  title: "The Engineer's Notebook (Opera Game)",
  objective:
    "Replay Morphy's 17-move opera-house attack from the page the Prince marked WORTHWHILE.",
  introScene: GATE_5_5_INTRO,
  outroScene: GATE_5_5_OUTRO,
  freePlayPrompt:
    "There will not be a freestyle rematch on this gate either. The notebook is not a position you negotiate — it is a position you carry.",
  steps: STEPS,
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_5_5_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_5_5_INTRO, GATE_5_5_OUTRO]);
