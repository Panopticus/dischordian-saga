import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import {
  PRINCES_GAME_MOVES,
  derivePrincesGameFens,
  fenBeforePly,
  moveAtPly,
} from "./chessTutorial_g4_5_princes_game";

describe("Prince's Game — canonical PGN", () => {
  it("contains an even number of plies (white + black always paired)", () => {
    expect(PRINCES_GAME_MOVES.length % 2).toBe(0);
  });

  it("is fully legal as a game from the standard starting position", () => {
    const game = new Chess();
    for (const san of PRINCES_GAME_MOVES) {
      const move = game.move(san);
      expect(move, `illegal move "${san}" at ply ${game.history().length + 1}`)
        .not.toBeNull();
    }
  });

  it("ends in checkmate (Black wins)", () => {
    const game = new Chess();
    for (const san of PRINCES_GAME_MOVES) game.move(san);
    expect(game.isCheckmate()).toBe(true);
    // Last move was Black's; it is now White's turn but White is mated.
    expect(game.turn()).toBe("w");
  });

  it("derivePrincesGameFens returns N+1 FENs for N moves", () => {
    const fens = derivePrincesGameFens();
    expect(fens).toHaveLength(PRINCES_GAME_MOVES.length + 1);
    // The first FEN is the standard starting position.
    expect(fens[0]).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    );
  });

  it("fenBeforePly returns the position right before the move plays", () => {
    // Before ply 1 = the starting position
    expect(fenBeforePly(1)).toContain("RNBQKBNR");
    // Before the famous Be6 (move 17 for Black = ply 34)
    const beforeBe6 = fenBeforePly(34);
    const game = new Chess(beforeBe6);
    // Black to move, the queen sacrifice is now playable.
    expect(game.turn()).toBe("b");
    expect(game.move("Be6")).not.toBeNull();
  });

  it("moveAtPly returns the canonical SAN for that ply", () => {
    expect(moveAtPly(1)).toBe("Nf3");
    expect(moveAtPly(2)).toBe("Nf6");
    expect(moveAtPly(34)).toBe("Be6"); // The queen sac
    expect(moveAtPly(PRINCES_GAME_MOVES.length)).toBe("Rc2#");
  });

  it("the famous queen sacrifice is at move 17 for Black", () => {
    // Black's 17th move is ply 34.
    expect(moveAtPly(34)).toBe("Be6");
  });
});
