/**
 * Chess Openings — the Openings with the Master library.
 *
 * Post-tutorial content. The Celebration Game Master introduces
 * each opening with a short historical frame and plays it against
 * the player as a teaching exercise. Openings are REAL — real
 * names, real ECO codes, real main lines. The GM's framing is
 * fictional.
 *
 * Starting catalog: 8 openings chosen for pedagogical value. Each
 * opening covers a different strategic archetype so a player who
 * studies all eight has seen most of the ideas they will meet in
 * their first thousand games.
 */

export interface ChessOpeningBranch {
  /** FEN after the player's departure move, marking a position
   *  where the GM steps in with teaching commentary. */
  afterFen: string;
  /** The player's departure move in SAN (what they played instead
   *  of the main line). */
  playerMove: string;
  /** The GM's reaction — one paragraph, in-voice. */
  gmReaction: string;
}

export interface ChessOpening {
  id: string;
  name: string;
  /** ECO (Encyclopaedia of Chess Openings) code — real reference. */
  ecoCode: string;
  era: string;
  /** One-paragraph intro from the Celebration Game Master. */
  gmIntro: string;
  /** Main line in SAN, from the starting position. */
  mainLine: readonly string[];
  /** Teaching branches on the most common amateur departures. */
  branches: readonly ChessOpeningBranch[];
}

export const CHESS_OPENINGS: readonly ChessOpening[] = Object.freeze([
  {
    id: "italian_game",
    name: "Italian Game",
    ecoCode: "C50",
    era: "16th century — earliest recorded in Damiano, 1512",
    gmIntro:
      "The Italian. The oldest opening still in common use. A Portuguese bishop named Damiano wrote about it five centuries ago and every principle I taught you in Gate 4 is visible in the first four moves. Center, development, bishop to c4 pointing at f7 — the same target that trapped Gate 2's scholar's mate. Play it as a beginner. Play it as a grandmaster. Both populations win with it.",
    mainLine: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6"],
    branches: [
      {
        afterFen:
          "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 2",
        playerMove: "Nf3",
        gmReaction:
          "Exactly what Gate 4 told you to do. Develop the knight, attack the e5 pawn, invite Black to defend. Most good openings start this way. Go on.",
      },
      {
        afterFen:
          "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 2 3",
        playerMove: "Bc4",
        gmReaction:
          "The Italian proper. Bishop points at f7 — Black's king's pawn shield has a hole right there. Black usually mirrors with Bc5 or plays Bc5's cousin, Nf6, attacking your e4 pawn. Either way you have a real game.",
      },
    ],
  },
  {
    id: "ruy_lopez",
    name: "Ruy Lopez (Spanish Opening)",
    ecoCode: "C60",
    era: "1561 — named for a Spanish bishop who also played chess",
    gmIntro:
      "The Spanish. Named for Ruy López de Segura, a sixteenth-century bishop who wrote the first Spanish chess treatise. Structurally the deepest opening in chess — its main lines have been analyzed for four hundred years and are STILL producing novelties at the top level. Kasparov called it the Spanish Torture for a reason. Learn to pronounce it correctly and you have claimed citizenship in the country of serious chess.",
    mainLine: [
      "e4", "e5",
      "Nf3", "Nc6",
      "Bb5", "a6",
      "Ba4", "Nf6",
      "O-O", "Be7",
      "Re1", "b5",
    ],
    branches: [
      {
        afterFen:
          "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
        playerMove: "Bb5",
        gmReaction:
          "Bb5 is the whole point. The bishop pins the knight against the e5 pawn and threatens to capture and double Black's queenside pawns. Every Spanish player you will ever meet has an opinion about a6 — it's the question Black asks to force the bishop to declare. Ba4 keeps the pressure; Bxc6 is a real alternative called the Exchange Variation.",
      },
    ],
  },
  {
    id: "queens_gambit",
    name: "Queen's Gambit Declined",
    ecoCode: "D30",
    era: "15th century main lines formalized in the 19th",
    gmIntro:
      "The Queen's Gambit. You offer a pawn with c4; Black can accept or decline. Most serious Black players decline — 1.d4 d5 2.c4 e6 — because the pawn is notoriously hard to hold. The resulting structure is called the Carlsbad, and if you understand it you understand most of Russian chess from 1900 to 1980. Declining is not passive. Declining is strategic patience.",
    mainLine: [
      "d4", "d5",
      "c4", "e6",
      "Nc3", "Nf6",
      "Bg5", "Be7",
      "e3", "O-O",
    ],
    branches: [
      {
        afterFen:
          "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
        playerMove: "c4",
        gmReaction:
          "The gambit is offered. Black can take with dxc4 (Queen's Gambit Accepted — a solid choice that gives up the center but gets a concrete pawn) or decline with e6 or c6 or Nf6. At your level any response is fine if you know why you played it.",
      },
    ],
  },
  {
    id: "sicilian_najdorf",
    name: "Sicilian Defense, Najdorf Variation",
    ecoCode: "B90",
    era: "Named for Miguel Najdorf, popularized mid-20th century by Fischer and Kasparov",
    gmIntro:
      "The Najdorf. The most-analyzed line in chess history. Black plays a6 on move five — a tiny, prophylactic pawn move that anticipates every threat White has against b5 and prepares a queenside expansion. Fischer's favorite. Kasparov's favorite. The line is not a line; it is a universe. Learn its ideas, not its moves.",
    mainLine: [
      "e4", "c5",
      "Nf3", "d6",
      "d4", "cxd4",
      "Nxd4", "Nf6",
      "Nc3", "a6",
      "Be2", "e5",
    ],
    branches: [
      {
        afterFen:
          "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        playerMove: "a6",
        gmReaction:
          "The Najdorf move. It does nothing immediately — that is the point. It takes b5 away from any White knight that was thinking of jumping there, and it prepares b5 for Black. Najdorf himself said he did not understand why the move was so strong; he just noticed that he kept winning when he played it.",
      },
    ],
  },
  {
    id: "kings_indian_defense",
    name: "King's Indian Defense",
    ecoCode: "E60",
    era: "Mid-20th century — championed by Bronstein, Fischer, Kasparov",
    gmIntro:
      "The King's Indian. Black lets you build a big center, then attacks it from a distance with a fianchettoed bishop on g7. Looks passive on moves one through five; becomes a torrent by move twenty. The Prince played it against me in the game you replayed in Gate 4.5. Notice the setup — knight to f6, pawn to g6, bishop to g7, castle short — and you'll see exactly where his attack came from.",
    mainLine: [
      "d4", "Nf6",
      "c4", "g6",
      "Nc3", "Bg7",
      "e4", "d6",
      "Nf3", "O-O",
      "Be2", "e5",
    ],
    branches: [
      {
        afterFen:
          "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 1 3",
        playerMove: "Bg7",
        gmReaction:
          "The fianchetto. The bishop aims along the long diagonal toward c3 and, once the center opens, toward your king. The King's Indian is about DELAYED violence. You will not see it coming until move sixteen or seventeen. By then it is too late.",
      },
    ],
  },
  {
    id: "french_defense",
    name: "French Defense",
    ecoCode: "C00",
    era: "Named for a correspondence match Paris vs. London, 1834",
    gmIntro:
      "The French. Black plays e6, preparing d5, and accepts a slightly cramped position in exchange for a solid pawn structure and a strategic plan that almost always involves attacking on the queenside. The c8-bishop is a lifelong project in the French — call it the French Bishop and you will have identified its main theoretical problem. Solve that problem and the rest of the position takes care of itself.",
    mainLine: [
      "e4", "e6",
      "d4", "d5",
      "Nc3", "Nf6",
      "e5", "Nfd7",
      "f4", "c5",
    ],
    branches: [
      {
        afterFen:
          "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        playerMove: "e6",
        gmReaction:
          "The French move. Black prepares d5 with support. It looks tiny but the entire strategic character of the game is now determined — you will play for kingside space, Black will play for queenside activity. The player who understands that dichotomy wins.",
      },
    ],
  },
  {
    id: "caro_kann",
    name: "Caro-Kann Defense",
    ecoCode: "B10",
    era: "Late 19th century — Caro and Kann were two amateur analysts",
    gmIntro:
      "The Caro-Kann. The solid response to 1.e4. Black plays c6 preparing d5, same as the French but with a crucial difference — the c8-bishop can develop to f5 or g4 because the e-pawn has not committed yet. Called a drawish opening by people who have never had to beat it; called the solid backbone of Karpov's career by people who have. Learn it for Black when you are tired of getting mated in the French.",
    mainLine: [
      "e4", "c6",
      "d4", "d5",
      "Nc3", "dxe4",
      "Nxe4", "Bf5",
      "Ng3", "Bg6",
    ],
    branches: [
      {
        afterFen:
          "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        playerMove: "c6",
        gmReaction:
          "The Caro move. Notice the difference from the French: here the c8 bishop has a clear path to f5 or g4 after the center opens. That difference IS the Caro-Kann. Memorize it. It will save you a thousand Black positions.",
      },
    ],
  },
  {
    id: "english_opening",
    name: "English Opening",
    ecoCode: "A10",
    era: "Named for Howard Staunton's 1843 London match",
    gmIntro:
      "The English. A flank opening — you start with c4 instead of a center pawn and invite Black to build the center YOU plan to undermine. Transpositions into King's Indian, Queen's Gambit, and even Sicilian structures are common; mastering the English means mastering position without tempo. Recommended for players who are tired of memorizing sharp opening theory and would rather play chess.",
    mainLine: [
      "c4", "Nf6",
      "Nc3", "e5",
      "g3", "d5",
      "cxd5", "Nxd5",
      "Bg2", "Nb6",
    ],
    branches: [
      {
        afterFen:
          "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
        playerMove: "c4",
        gmReaction:
          "The English move. Nothing committed in the center. Black can meet it with e5 (reversed Sicilian), c5 (Symmetrical English), Nf6 (classical), or even e6 preparing d5 (a transposition to the Queen's Gambit). Your task is to understand which of YOUR systems works against whichever reply Black offers.",
      },
    ],
  },
]);

/** Lookup helper. */
export function getChessOpening(id: string): ChessOpening | undefined {
  return CHESS_OPENINGS.find((o) => o.id === id);
}
