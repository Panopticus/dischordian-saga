import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import {
  OPERA_GAME_MOVES,
  deriveOperaGameFens,
  fenBeforePly,
  moveAtPly,
} from "./chessTutorial_g5_5_opera_game";
import {
  CHESS_TUTORIAL_SIDE_GATES,
  isChessSideGateUnlocked,
  CHESS_TUTORIAL_SCENES,
} from "./chessTutorial";

describe("Opera Game — canonical PGN", () => {
  it("contains an odd number of plies (last move is mate by White)", () => {
    // Morphy delivered mate on his 17th move (ply 33). Total 33.
    expect(OPERA_GAME_MOVES.length).toBe(33);
    expect(OPERA_GAME_MOVES.length % 2).toBe(1);
  });

  it("is fully legal as a game from the standard starting position", () => {
    const game = new Chess();
    for (const san of OPERA_GAME_MOVES) {
      const move = game.move(san);
      expect(move, `illegal move "${san}" at ply ${game.history().length + 1}`)
        .not.toBeNull();
    }
  });

  it("ends in checkmate (White wins)", () => {
    const game = new Chess();
    for (const san of OPERA_GAME_MOVES) game.move(san);
    expect(game.isCheckmate()).toBe(true);
    // Last move was White's; it is now Black's turn but Black is mated.
    expect(game.turn()).toBe("b");
  });

  it("deriveOperaGameFens returns N+1 FENs for N moves", () => {
    const fens = deriveOperaGameFens();
    expect(fens).toHaveLength(OPERA_GAME_MOVES.length + 1);
    expect(fens[0]).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    );
  });

  it("fenBeforePly returns a position with the right player to move", () => {
    expect(fenBeforePly(1)).toContain("RNBQKBNR");
    // Before the queen sacrifice (Qb8+ — White's 16th move = ply 31)
    const beforeQb8 = fenBeforePly(31);
    const game = new Chess(beforeQb8);
    expect(game.turn()).toBe("w");
    expect(game.move("Qb8+")).not.toBeNull();
  });

  it("moveAtPly returns the canonical SAN for that ply", () => {
    expect(moveAtPly(1)).toBe("e4");
    expect(moveAtPly(2)).toBe("e5");
    expect(moveAtPly(31)).toBe("Qb8+"); // queen sac
    expect(moveAtPly(OPERA_GAME_MOVES.length)).toBe("Rd8#");
  });
});

describe("Opera Game — registration", () => {
  it("is registered as a side gate", () => {
    const ids = CHESS_TUTORIAL_SIDE_GATES.map((g) => g.id);
    expect(ids).toContain("chess_tut_g5_5");
  });

  it("unlocks when Gate 5 is completed", () => {
    expect(isChessSideGateUnlocked("chess_tut_g5_5", [])).toBe(false);
    expect(isChessSideGateUnlocked("chess_tut_g5_5", [4])).toBe(false);
    expect(isChessSideGateUnlocked("chess_tut_g5_5", [5])).toBe(true);
    expect(isChessSideGateUnlocked("chess_tut_g5_5", [1, 2, 3, 4, 5])).toBe(true);
  });

  it("contributes intro + outro scenes to CHESS_TUTORIAL_SCENES", () => {
    const sceneIds = CHESS_TUTORIAL_SCENES.map((s) => s.id);
    expect(sceneIds).toContain("chess_tut_g5_5_intro");
    expect(sceneIds).toContain("chess_tut_g5_5_outro");
  });
});
