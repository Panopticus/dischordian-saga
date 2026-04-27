import { describe, it, expect } from "vitest";
import {
  classifyDeltas,
  classifyBrilliancies,
  type PostGameSample,
  type PostGameBrilliancySample,
} from "./postGameMistakeClassifier";

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

function brilliancySample(
  ply: number,
  played: string,
  best: string | null,
  bestEval: number | null,
  secondEval: number | null,
): PostGameBrilliancySample {
  return {
    ply,
    evalBeforeCp: 0,
    evalAfterCp: 0,
    deltaCp: 0,
    playedUci: played,
    bestUci: best,
    bestEvalCp: bestEval,
    secondBestEvalCp: secondEval,
  };
}

describe("postGameMistakeClassifier.classifyBrilliancies", () => {
  it("flags a move matching engine top with ≥80cp gap as a brilliancy", () => {
    // White's 4th move (ply 7), top eval +200, second-best +50,
    // gap = 150. Played matches best.
    const out = classifyBrilliancies(
      [brilliancySample(7, "e2e4", "e2e4", 200, 50)],
      "white",
    );
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe("quiet_killer");
    expect(out[0].centipawnGain).toBe(150);
    expect(out[0].side).toBe("white");
    expect(out[0].moveNumber).toBe(4);
  });

  it("classifies large-gap brilliancies as tactical_blow", () => {
    const out = classifyBrilliancies(
      [brilliancySample(7, "f1c4", "f1c4", 800, 100)],
      "white",
    );
    expect(out[0].type).toBe("tactical_blow");
    expect(out[0].centipawnGain).toBe(700);
  });

  it("classifies promotions as endgame_precision", () => {
    // UCI promotion notation: "e7e8q" (5 chars).
    const out = classifyBrilliancies(
      [brilliancySample(31, "e7e8q", "e7e8q", 500, 100)],
      "white",
    );
    expect(out[0].type).toBe("endgame_precision");
  });

  it("ignores moves before ply 6 (book moves)", () => {
    const out = classifyBrilliancies(
      [brilliancySample(3, "e2e4", "e2e4", 500, 0)],
      "white",
    );
    expect(out).toHaveLength(0);
  });

  it("ignores moves where the player did not match the engine's top", () => {
    const out = classifyBrilliancies(
      [brilliancySample(7, "a2a3", "e2e4", 500, 0)],
      "white",
    );
    expect(out).toHaveLength(0);
  });

  it("ignores moves with gap below 80cp", () => {
    const out = classifyBrilliancies(
      [brilliancySample(7, "e2e4", "e2e4", 100, 50)],
      "white",
    );
    expect(out).toHaveLength(0);
  });

  it("ignores moves where the engine had no second-best", () => {
    const out = classifyBrilliancies(
      [brilliancySample(7, "e2e4", "e2e4", 500, null)],
      "white",
    );
    expect(out).toHaveLength(0);
  });

  it("flips the gap sign for Black's perspective", () => {
    // Ply 8 = Black's 4th move. Engine eval is from White's POV.
    // bestEvalCp = -200 (worse for White = better for Black)
    // secondBestEvalCp = -50
    // From Black's POV: best = +200, second = +50, gap = 150.
    const out = classifyBrilliancies(
      [brilliancySample(8, "e7e5", "e7e5", -200, -50)],
      "black",
    );
    expect(out).toHaveLength(1);
    expect(out[0].centipawnGain).toBe(150);
    expect(out[0].side).toBe("black");
  });

  it("filters to the player's side only", () => {
    // White moves at ply 7 with brilliancy; Black moves at ply 8
    // with brilliancy. classifyBrilliancies(side=white) returns
    // only the white one.
    const samples = [
      brilliancySample(7, "e2e4", "e2e4", 200, 0),
      brilliancySample(8, "e7e5", "e7e5", -200, 0),
    ];
    expect(classifyBrilliancies(samples, "white")).toHaveLength(1);
    expect(classifyBrilliancies(samples, "black")).toHaveLength(1);
  });

  it("returns empty for an empty samples list", () => {
    expect(classifyBrilliancies([], "white")).toEqual([]);
  });
});
