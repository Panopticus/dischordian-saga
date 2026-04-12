/* ═══════════════════════════════════════════════════════
   Chess narrative tests — Phase 1 of "The Game Master's
   Gambit" lore reskin.

   Covers the pure-function surface introduced in Phase 1:
     * chessEventAnalyzer — SAN → structured events
     * chessPlayerModel   — learning-AI state + bias derivation
     * getAiMove          — playerModelBias effect on move choice

   Notes: no DB is touched. The chess router is imported for
   getAiMove only — we mock the db module so the import
   doesn't try to open a real connection.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, vi } from "vitest";
import { Chess } from "chess.js";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

import {
  parseSan,
  guessOpening,
  analyzeChessGame,
} from "../shared/chessEventAnalyzer";
import {
  createDefaultPlayerModel,
  updatePlayerModel,
  toMoveBias,
  type PlayerModel,
  type PlayerModelBias,
} from "../shared/chessPlayerModel";
import { getAiMove } from "./routers/chess";

/* ═══════════════ parseSan ═══════════════ */

describe("parseSan", () => {
  it("parses pawn moves", () => {
    const r = parseSan("e4");
    expect(r).toMatchObject({ piece: "p", isCapture: false, isCheck: false, isCheckmate: false, isCastle: false });
  });

  it("parses piece moves", () => {
    expect(parseSan("Nf3")?.piece).toBe("n");
    expect(parseSan("Bb5")?.piece).toBe("b");
    expect(parseSan("Ra1")?.piece).toBe("r");
    expect(parseSan("Qd8")?.piece).toBe("q");
    expect(parseSan("Kg1")?.piece).toBe("k");
  });

  it("detects captures", () => {
    expect(parseSan("Nxe5")?.isCapture).toBe(true);
    expect(parseSan("exd5")?.isCapture).toBe(true);
    expect(parseSan("Nf3")?.isCapture).toBe(false);
  });

  it("detects checks and mates", () => {
    expect(parseSan("Qh5+")?.isCheck).toBe(true);
    expect(parseSan("Qh5+")?.isCheckmate).toBe(false);
    expect(parseSan("Qxf7#")?.isCheck).toBe(true);
    expect(parseSan("Qxf7#")?.isCheckmate).toBe(true);
  });

  it("detects promotions", () => {
    expect(parseSan("e8=Q")?.promotion).toBe("q");
    expect(parseSan("exd8=N+")?.promotion).toBe("n");
    expect(parseSan("Nf3")?.promotion).toBeNull();
  });

  it("detects castling", () => {
    expect(parseSan("O-O")?.isCastle).toBe(true);
    expect(parseSan("O-O-O")?.isCastle).toBe(true);
    expect(parseSan("0-0")?.isCastle).toBe(true);
  });

  it("strips annotation glyphs", () => {
    expect(parseSan("Nf3!")).toMatchObject({ piece: "n", isCapture: false });
    expect(parseSan("Qxh7?!")).toMatchObject({ piece: "q", isCapture: true });
  });

  it("returns null for garbage", () => {
    expect(parseSan("")).toBeNull();
  });
});

/* ═══════════════ guessOpening ═══════════════ */

describe("guessOpening", () => {
  it("identifies e4 e5 families", () => {
    expect(guessOpening(["e4", "e5", "Nf3", "Nc6"])).toBe("Open Game");
    expect(guessOpening(["e4", "e5", "f4"])).toBe("King's Gambit");
  });

  it("identifies Sicilian", () => {
    expect(guessOpening(["e4", "c5"])).toBe("Sicilian Defense");
  });

  it("identifies French / Caro-Kann", () => {
    expect(guessOpening(["e4", "e6"])).toBe("French Defense");
    expect(guessOpening(["e4", "c6"])).toBe("Caro-Kann Defense");
  });

  it("identifies Queen's Gambit", () => {
    expect(guessOpening(["d4", "d5", "c4"])).toBe("Queen's Gambit");
  });

  it("identifies King's Indian Defense", () => {
    expect(guessOpening(["d4", "Nf6", "c4", "g6"])).toBe("King's Indian Defense");
  });

  it("identifies flank openings", () => {
    // guessOpening requires >=2 moves — test via a 2-ply sequence.
    expect(guessOpening(["c4", "c5"])).toBe("English Opening");
    expect(guessOpening(["Nf3", "Nf6"])).toBe("Réti Opening");
  });

  it("returns null for weird starts", () => {
    expect(guessOpening([])).toBeNull();
    // Single move is insufficient for guessOpening (needs 2+).
    expect(guessOpening(["e4"])).toBeNull();
    expect(guessOpening(["h4", "h5"])).toBeNull();
  });
});

/* ═══════════════ analyzeChessGame ═══════════════ */

describe("analyzeChessGame", () => {
  it("counts player moves and opponent moves separately", () => {
    // Player = white, 4 plies total → 2 player moves, 2 opponent.
    const events = analyzeChessGame({
      sanMoves: ["e4", "e5", "Nf3", "Nc6"],
      playerSide: "w",
      result: "draw",
    });
    expect(events.totalMoves).toBe(4);
    expect(events.playerMoveCount).toBe(2);
    expect(events.length).toBe("short");
  });

  it("detects captures on both sides", () => {
    // 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 bxc6 — white captures, black recaptures.
    const events = analyzeChessGame({
      sanMoves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "bxc6"],
      playerSide: "w",
      result: "draw",
    });
    expect(events.playerCaptures.length).toBe(1);
    expect(events.playerCaptures[0].piece).toBe("b");
    expect(events.opponentCaptures.length).toBe(1);
    expect(events.opponentCaptures[0].piece).toBe("p"); // bxc6 is a pawn recapture
  });

  it("detects checks and checkmate", () => {
    // Scholar's mate: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#
    const events = analyzeChessGame({
      sanMoves: ["e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6", "Qxf7#"],
      playerSide: "w",
      result: "win",
    });
    expect(events.checksGiven.length).toBe(1);
    expect(events.checksGiven[0].isCheckmate).toBe(true);
  });

  it("detects promotions", () => {
    const events = analyzeChessGame({
      sanMoves: ["e4", "d5", "exd5", "Nf6", "d6", "e6", "dxe7", "Be7", "e8=Q+"],
      playerSide: "w",
      result: "win",
    });
    expect(events.promotions.length).toBe(1);
    expect(events.promotions[0].piece).toBe("q");
  });

  it("guesses opening name", () => {
    const events = analyzeChessGame({
      sanMoves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6"],
      playerSide: "w",
      result: "draw",
    });
    expect(events.openingName).toBe("Queen's Gambit");
  });

  it("classifies game length buckets", () => {
    const short = analyzeChessGame({ sanMoves: Array(10).fill("Nf3"), playerSide: "w", result: "draw" });
    const medium = analyzeChessGame({ sanMoves: Array(30).fill("Nf3"), playerSide: "w", result: "draw" });
    const long = analyzeChessGame({ sanMoves: Array(60).fill("Nf3"), playerSide: "w", result: "draw" });
    const marathon = analyzeChessGame({ sanMoves: Array(100).fill("Nf3"), playerSide: "w", result: "draw" });
    expect(short.length).toBe("short");
    expect(medium.length).toBe("medium");
    expect(long.length).toBe("long");
    expect(marathon.length).toBe("marathon");
  });

  it("emits blunders/brilliancies only when evals are provided", () => {
    // 4 plies, white plays; evals [w=0, b=0, w=-300, b=0] → white blundered on move 2 (ply index 2)
    const withoutEvals = analyzeChessGame({
      sanMoves: ["e4", "e5", "Qh5", "Nc6"],
      playerSide: "w",
      result: "draw",
    });
    expect(withoutEvals.blunders).toEqual([]);
    expect(withoutEvals.brilliancies).toEqual([]);

    // evalsCp[i] is the eval AFTER ply i (index 0 = start position).
    // A blunder on white's 2nd move (ply 3) means evals[2] = good,
    // evals[3] = bad. Set up +30 after move 2 → -300 after move 3.
    const withEvals = analyzeChessGame({
      sanMoves: ["e4", "e5", "Qh5", "Nc6"],
      playerSide: "w",
      result: "draw",
      evalsCp: [0, 0, 30, -300],
    });
    expect(withEvals.blunders.length).toBeGreaterThan(0);
  });
});

/* ═══════════════ chessPlayerModel ═══════════════ */

describe("createDefaultPlayerModel", () => {
  it("starts with zeroed stats and no opening moves", () => {
    const m = createDefaultPlayerModel();
    expect(m.sampleSize).toBe(0);
    expect(m.topOpeningMoves).toEqual([]);
    expect(m.captureRate).toBe(0);
    expect(m.favoritePiece).toBe("p");
  });
});

describe("updatePlayerModel", () => {
  it("blends the first game into the default model", () => {
    const game = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "bxc6"];
    const updated = updatePlayerModel(null, game, "w");
    expect(updated.sampleSize).toBeGreaterThan(0);
    expect(updated.topOpeningMoves).toContain("e4");
    // Player captured once in 4 player moves.
    expect(updated.captureRate).toBeCloseTo(0.25, 2);
  });

  it("tracks the player's first-move preference across games", () => {
    let model: PlayerModel | null = null;
    // Play three games all opening with e4.
    for (let i = 0; i < 3; i++) {
      model = updatePlayerModel(model, ["e4", "e5", "Nf3", "Nc6"], "w");
    }
    expect(model?.topOpeningMoves[0]).toBe("e4");
  });

  it("recent opening moves compete with older ones", () => {
    let model: PlayerModel | null = null;
    // Two e4 games.
    model = updatePlayerModel(model, ["e4", "e5"], "w");
    model = updatePlayerModel(model, ["e4", "c5"], "w");
    // Then one d4 game.
    model = updatePlayerModel(model, ["d4", "d5"], "w");
    expect(model?.topOpeningMoves).toContain("e4");
    expect(model?.topOpeningMoves).toContain("d4");
  });

  it("computes favouritePiece from the dominant piece", () => {
    // A game where the player moves the knight a lot.
    const model = updatePlayerModel(null, [
      "Nf3", "d5", "Ng5", "e6", "Nf3", "f6", "Nh4", "g6",
    ], "w");
    // Knight is the only non-pawn piece moved → clearly dominant.
    expect(model.favoritePiece).toBe("n");
  });

  it("is idempotent against empty move lists", () => {
    const before = createDefaultPlayerModel();
    const after = updatePlayerModel(before, [], "w");
    expect(after).toEqual(before);
  });

  it("caps old sample weight so recent games keep influencing the blend", () => {
    let model: PlayerModel | null = null;
    // Build up a big model that has a high capture rate.
    for (let i = 0; i < 20; i++) {
      model = updatePlayerModel(model, [
        "e4", "e5", "Nf3", "Nc6", "Nxe5", "Nxe5", "d4", "Nc6",
      ], "w");
    }
    const highCapture = model!.captureRate;
    expect(highCapture).toBeGreaterThan(0.1);
    // Now play a quiet game with no captures.
    model = updatePlayerModel(model, ["e4", "e5", "Nf3", "Nc6", "d3", "Bc5"], "w");
    // The cap at 200 old moves means the quiet game still moves the needle.
    expect(model.captureRate).toBeLessThan(highCapture);
  });
});

describe("toMoveBias", () => {
  it("returns a neutral bias for null / small samples", () => {
    expect(toMoveBias(null).confidence).toBe(0);
    const tiny = createDefaultPlayerModel();
    tiny.sampleSize = 5;
    expect(toMoveBias(tiny).confidence).toBe(0);
  });

  it("boosts baitBonus for aggressive capture-happy players", () => {
    const m: PlayerModel = {
      topOpeningMoves: ["e4"],
      captureRate: 0.4,
      sacrificeRate: 0.05,
      avgCheckRate: 0.02,
      favoritePiece: "q",
      sampleSize: 80,
    };
    const bias = toMoveBias(m);
    expect(bias.confidence).toBeGreaterThan(0);
    expect(bias.baitBonus).toBeGreaterThan(0);
  });

  it("boosts kingSafetyBonus against attacking players", () => {
    const m: PlayerModel = {
      topOpeningMoves: ["e4"],
      captureRate: 0.15,
      sacrificeRate: 0.05,
      avgCheckRate: 0.25, // very high check rate
      favoritePiece: "q",
      sampleSize: 150,
    };
    const bias = toMoveBias(m);
    expect(bias.kingSafetyBonus).toBeGreaterThan(0);
  });

  it("caps all bonuses below ceilings", () => {
    const extreme: PlayerModel = {
      topOpeningMoves: ["e4"],
      captureRate: 1,
      sacrificeRate: 1,
      avgCheckRate: 1,
      favoritePiece: "q",
      sampleSize: 10_000,
    };
    const bias = toMoveBias(extreme);
    expect(bias.baitBonus).toBeLessThanOrEqual(20);
    expect(bias.solidityBonus).toBeLessThanOrEqual(15);
    expect(bias.kingSafetyBonus).toBeLessThanOrEqual(15);
    expect(bias.confidence).toBeLessThanOrEqual(1);
  });

  it("sets restrictPiece to the player's favourite, but never pawn", () => {
    const pawnFav: PlayerModel = {
      topOpeningMoves: [],
      captureRate: 0.1,
      sacrificeRate: 0.05,
      avgCheckRate: 0.02,
      favoritePiece: "p",
      sampleSize: 100,
    };
    expect(toMoveBias(pawnFav).restrictPiece).toBeNull();

    const queenFav: PlayerModel = { ...pawnFav, favoritePiece: "q" };
    expect(toMoveBias(queenFav).restrictPiece).toBe("q");
  });
});

/* ═══════════════ getAiMove with bias ═══════════════ */

describe("getAiMove with playerModelBias", () => {
  const freshGame = () => {
    const g = new Chess();
    // Play one move so the opponent "last move" is e4 — the opening
    // counter-bias only fires when a tracked opening move was just
    // played by the opponent.
    g.move("e4");
    return g;
  };

  it("returns a legal move with or without bias", () => {
    const g = freshGame();
    const withoutBias = getAiMove(g, 5, "universal");
    expect(withoutBias).toBeTruthy();
    expect(g.moves().some(m => m === withoutBias)).toBe(true);

    const bias: PlayerModelBias = {
      counterOpeningMoves: ["e4"],
      baitBonus: 10,
      solidityBonus: 8,
      kingSafetyBonus: 8,
      restrictPiece: "q",
      confidence: 1,
    };
    const withBias = getAiMove(g, 10, "universal", bias);
    expect(withBias).toBeTruthy();
    expect(g.moves().some(m => m === withBias)).toBe(true);
  });

  it("shifts opening choice toward central responses against a tracked opening", () => {
    // Deterministic: difficulty 10, strong confidence, tracked e4.
    const bias: PlayerModelBias = {
      counterOpeningMoves: ["e4"],
      baitBonus: 0,
      solidityBonus: 0,
      kingSafetyBonus: 0,
      restrictPiece: null,
      confidence: 1,
    };
    // Run many samples to beat randomness at difficulty 10 — the
    // noise floor is minimal there.
    const picks: Record<string, number> = {};
    for (let i = 0; i < 50; i++) {
      const g = new Chess();
      g.move("e4"); // opponent move
      const mv = getAiMove(g, 10, "universal", bias);
      picks[mv] = (picks[mv] ?? 0) + 1;
    }
    // Central / developing responses should be strongly preferred over
    // edge moves like h6 or a6.
    const centralCount =
      (picks.e5 ?? 0) + (picks.d5 ?? 0) + (picks.Nf6 ?? 0) + (picks.Nc6 ?? 0) + (picks.c5 ?? 0);
    const edgeCount = (picks.h6 ?? 0) + (picks.a6 ?? 0) + (picks.h5 ?? 0) + (picks.a5 ?? 0);
    expect(centralCount).toBeGreaterThan(edgeCount);
  });

  it("gracefully handles null bias (treats as no-op)", () => {
    const g = freshGame();
    const result = getAiMove(g, 5, "universal", null);
    expect(result).toBeTruthy();
  });
});
