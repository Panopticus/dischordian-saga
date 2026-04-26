import { describe, it, expect } from "vitest";
import { classifyDeltas, type PostGameSample } from "./postGameMistakeClassifier";

function sample(
  ply: number,
  before: number,
  after: number,
): PostGameSample {
  return {
    ply,
    evalBeforeCp: before,
    evalAfterCp: after,
    deltaCp: after - before,
  };
}

describe("postGameMistakeClassifier.classifyDeltas", () => {
  it("flags ≥300 cp drop as hung_piece for the mover", () => {
    // Ply 1 (white). Eval drops from +50 to -300 = -350 from white POV.
    const out = classifyDeltas([sample(1, 50, -300)], "white");
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe("hung_piece");
    expect(out[0].centipawnLoss).toBe(350);
    expect(out[0].side).toBe("white");
    expect(out[0].moveNumber).toBe(1);
  });

  it("flags 100..299 cp drop as missed_tactic", () => {
    const out = classifyDeltas([sample(1, 0, -150)], "white");
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe("missed_tactic");
    expect(out[0].centipawnLoss).toBe(150);
  });

  it("ignores drops < 100 cp", () => {
    const out = classifyDeltas([sample(1, 0, -50)], "white");
    expect(out).toHaveLength(0);
  });

  it("ignores moves where eval improved", () => {
    const out = classifyDeltas([sample(1, 0, 250)], "white");
    expect(out).toHaveLength(0);
  });

  it("filters to the player's side only", () => {
    // Ply 1 = white blunders -400. Ply 2 = black blunders -400 from
    // Black's perspective (white POV +400).
    const samples = [sample(1, 0, -400), sample(2, -400, 0)];
    const whitesMistakes = classifyDeltas(samples, "white");
    expect(whitesMistakes).toHaveLength(1);
    expect(whitesMistakes[0].side).toBe("white");
    const blacksMistakes = classifyDeltas(samples, "black");
    expect(blacksMistakes).toHaveLength(1);
    expect(blacksMistakes[0].side).toBe("black");
    expect(blacksMistakes[0].centipawnLoss).toBe(400);
  });

  it("handles black moves correctly (sign flip)", () => {
    // Ply 2 = black to move. Eval went from -50 to +250 (white POV);
    // from black POV the mover lost 300 cp.
    const out = classifyDeltas([sample(2, -50, 250)], "black");
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe("hung_piece");
    expect(out[0].centipawnLoss).toBe(300);
    expect(out[0].side).toBe("black");
    expect(out[0].moveNumber).toBe(1);
  });

  it("computes moveNumber as ceil(ply/2)", () => {
    // Ply 7 = white's 4th move. Ply 8 = black's 4th move.
    const out = classifyDeltas(
      [sample(7, 0, -200), sample(8, -200, 0)],
      "white",
    );
    expect(out[0].moveNumber).toBe(4);
    expect(out[0].side).toBe("white");
    const outBlack = classifyDeltas(
      [sample(7, 0, -200), sample(8, -200, 0)],
      "black",
    );
    expect(outBlack[0].moveNumber).toBe(4);
    expect(outBlack[0].side).toBe("black");
  });

  it("returns empty for an empty samples list", () => {
    expect(classifyDeltas([], "white")).toEqual([]);
  });
});
