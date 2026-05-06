import { describe, it, expect } from "vitest";
import {
  evaluateState,
  pickBestPlay,
  pickEpsilonGreedy,
  scoreCandidates,
  type AIEvalState,
  type CandidatePlay,
} from "./lookahead";

const balanced: AIEvalState = {
  selfBoardPower: 10,
  opponentBoardPower: 10,
  selfHandSize: 3,
  opponentHandSize: 3,
  selfGeneralHp: 25,
  opponentGeneralHp: 25,
};

describe("evaluateState", () => {
  it("returns 0 for a balanced state", () => {
    expect(evaluateState(balanced)).toBe(0);
  });

  it("rewards higher board power", () => {
    expect(evaluateState({ ...balanced, selfBoardPower: 20 })).toBeGreaterThan(0);
  });

  it("punishes lower general HP", () => {
    expect(evaluateState({ ...balanced, selfGeneralHp: 10 })).toBeLessThan(0);
  });

  it("hand-size weight is half of board-power weight", () => {
    const handAdvantage = evaluateState({ ...balanced, selfHandSize: 6 });
    const boardAdvantage = evaluateState({ ...balanced, selfBoardPower: 13 });
    // +3 hand at 0.5 weight = 1.5; +3 board at 1.0 weight = 3.0.
    expect(handAdvantage).toBe(1.5);
    expect(boardAdvantage).toBe(3);
  });
});

describe("scoreCandidates", () => {
  const cands: CandidatePlay<string>[] = [
    {
      id: "a",
      payload: "play_a",
      projectedState: { ...balanced, selfBoardPower: 12 },
    },
    {
      id: "b",
      payload: "play_b",
      projectedState: { ...balanced, selfBoardPower: 15 },
    },
    {
      id: "c",
      payload: "play_c",
      projectedState: balanced,
    },
  ];

  it("returns descending by score", () => {
    const out = scoreCandidates(cands);
    expect(out[0].candidate.id).toBe("b");
    expect(out[1].candidate.id).toBe("a");
    expect(out[2].candidate.id).toBe("c");
  });

  it("breaks ties by id alphabetically (deterministic)", () => {
    const tied: CandidatePlay<string>[] = [
      { id: "z", payload: "z", projectedState: balanced },
      { id: "a", payload: "a", projectedState: balanced },
      { id: "m", payload: "m", projectedState: balanced },
    ];
    const out = scoreCandidates(tied);
    expect(out.map((s) => s.candidate.id)).toEqual(["a", "m", "z"]);
  });
});

describe("pickBestPlay", () => {
  it("returns null on empty input", () => {
    expect(pickBestPlay([])).toBeNull();
  });

  it("returns the highest-scoring candidate", () => {
    const cands: CandidatePlay<string>[] = [
      { id: "a", payload: "a", projectedState: { ...balanced, selfBoardPower: 12 } },
      { id: "b", payload: "b", projectedState: { ...balanced, selfBoardPower: 20 } },
    ];
    expect(pickBestPlay(cands)?.id).toBe("b");
  });
});

describe("pickEpsilonGreedy", () => {
  const cands: CandidatePlay<string>[] = [
    { id: "a", payload: "a", projectedState: { ...balanced, selfBoardPower: 12 } },
    { id: "b", payload: "b", projectedState: { ...balanced, selfBoardPower: 20 } },
    { id: "c", payload: "c", projectedState: balanced },
  ];

  it("returns null on empty input", () => {
    expect(pickEpsilonGreedy([], 0.5)).toBeNull();
  });

  it("picks the best when rng > epsilon", () => {
    expect(pickEpsilonGreedy(cands, 0.1, () => 0.99)?.id).toBe("b");
  });

  it("picks randomly when rng < epsilon", () => {
    let i = 0;
    const seq = [0.05, 0.01]; // first call < epsilon → random branch; second call → idx
    const rng = () => seq[i++ % seq.length];
    const pick = pickEpsilonGreedy(cands, 0.5, rng);
    // floor(0.01 * 3) = 0 → "a"
    expect(pick?.id).toBe("a");
  });
});
