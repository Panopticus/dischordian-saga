/** audit/05.F1 — contract-level tests for the chess router. */
import { describe, it, expect } from "vitest";
import { chessRouter } from "./chess";

describe("chessRouter contract", () => {
  const procedures = Object.keys(chessRouter._def.procedures ?? {});

  it("exports the documented chess flow procedures", () => {
    for (const name of [
      "getCharacters",
      "getMyRanking",
      "getLeaderboard",
      "startGame",
      "makeMove",
      "resign",
      "getHistory",
      "getActiveGame",
      "getLegalMoves",
    ]) {
      expect(procedures, `missing: ${name}`).toContain(name);
    }
  });
});
