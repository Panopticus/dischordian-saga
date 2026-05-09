import { describe, expect, it } from "vitest";
import {
  evaluatePuzzleAnswer,
  legacyAcceptableAnswer,
  resolveSolveState,
  type PuzzleAnswerInput,
} from "./puzzleAnswerCheck";

describe("legacyAcceptableAnswer (audit/16 PR 34 — AR8 consumer)", () => {
  it("matches case-insensitively and tolerates whitespace", () => {
    expect(legacyAcceptableAnswer("  ECHO ", ["echo"])).toBe(true);
    expect(legacyAcceptableAnswer("Echo", ["echo"])).toBe(true);
  });

  it("matches when the input contains the candidate (legacy behaviour)", () => {
    expect(legacyAcceptableAnswer("the answer is echo", ["echo"])).toBe(true);
  });

  it("rejects empty input even with a populated candidate list", () => {
    expect(legacyAcceptableAnswer("", ["echo"])).toBe(false);
    expect(legacyAcceptableAnswer("   ", ["echo"])).toBe(false);
  });

  it("rejects when no candidate matches", () => {
    expect(legacyAcceptableAnswer("delta", ["alpha", "beta", "gamma"])).toBe(false);
  });
});

describe("resolveSolveState", () => {
  it("returns null when puzzle has no seasonalSolve", () => {
    const p: PuzzleAnswerInput = { id: "p1", acceptableAnswers: ["alpha"] };
    expect(resolveSolveState(p, { playerId: "u1", seasonKey: "S1" })).toBeNull();
  });

  it("returns null when seasonalSolve.pool is empty", () => {
    const p: PuzzleAnswerInput = { id: "p1", seasonalSolve: { pool: [] } };
    expect(resolveSolveState(p, { playerId: "u1", seasonKey: "S1" })).toBeNull();
  });

  it("returns null when context is missing playerId or seasonKey", () => {
    const p: PuzzleAnswerInput = { id: "p1", seasonalSolve: { pool: ["alpha", "beta"] } };
    expect(resolveSolveState(p, {})).toBeNull();
    expect(resolveSolveState(p, { playerId: "u1" })).toBeNull();
    expect(resolveSolveState(p, { seasonKey: "S1" })).toBeNull();
  });

  it("returns a solve state when puzzle + context are complete", () => {
    const p: PuzzleAnswerInput = {
      id: "p1",
      seasonalSolve: { pool: ["alpha", "beta", "gamma"] },
    };
    const ss = resolveSolveState(p, { playerId: "u1", seasonKey: "S1-2026" });
    expect(ss).not.toBeNull();
    expect(ss!.puzzleId).toBe("p1");
    expect(ss!.playerId).toBe("u1");
    expect(ss!.seasonKey).toBe("S1-2026");
    expect(["alpha", "beta", "gamma"]).toContain(ss!.canonicalAnswer);
  });
});

describe("evaluatePuzzleAnswer — empty input", () => {
  it("rejects empty / whitespace input regardless of puzzle shape", () => {
    const p: PuzzleAnswerInput = { id: "p1", answer: "echo" };
    expect(evaluatePuzzleAnswer("", p)).toBe(false);
    expect(evaluatePuzzleAnswer("   ", p)).toBe(false);
  });
});

describe("evaluatePuzzleAnswer — legacy path (no seasonalSolve)", () => {
  it("uses acceptableAnswers when populated", () => {
    const p: PuzzleAnswerInput = {
      id: "p1",
      acceptableAnswers: ["echo", "the echo", "echoes"],
    };
    expect(evaluatePuzzleAnswer("Echo", p)).toBe(true);
    expect(evaluatePuzzleAnswer("the answer is the echo", p)).toBe(true);
    expect(evaluatePuzzleAnswer("silence", p)).toBe(false);
  });

  it("falls back to single `answer` when acceptableAnswers is unset", () => {
    const p: PuzzleAnswerInput = { id: "p1", answer: "echo" };
    expect(evaluatePuzzleAnswer("Echo", p)).toBe(true);
    expect(evaluatePuzzleAnswer("silence", p)).toBe(false);
  });

  it("uses cipherAnswer with EXACT match (case-insensitive)", () => {
    const p: PuzzleAnswerInput = { id: "p1", cipherAnswer: "DECRYPTED" };
    expect(evaluatePuzzleAnswer("decrypted", p)).toBe(true);
    expect(evaluatePuzzleAnswer("  DeCrYpTeD ", p)).toBe(true);
    // Unlike acceptableAnswers, cipher does NOT do includes-match.
    expect(evaluatePuzzleAnswer("the decrypted message", p)).toBe(false);
  });

  it("rejects when no answer fields are declared", () => {
    const p: PuzzleAnswerInput = { id: "p1" };
    expect(evaluatePuzzleAnswer("anything", p)).toBe(false);
  });
});

describe("evaluatePuzzleAnswer — seasonal path (lenient default)", () => {
  const pool = ["alpha", "beta", "gamma"];
  const p: PuzzleAnswerInput = { id: "p1", seasonalSolve: { pool } };
  const ctx = { playerId: "u1", seasonKey: "S1-2026" };

  it("accepts every pool entry in default (lenient) mode", () => {
    for (const candidate of pool) {
      expect(evaluatePuzzleAnswer(candidate, p, ctx)).toBe(true);
    }
  });

  it("is case-insensitive + whitespace-tolerant", () => {
    expect(evaluatePuzzleAnswer("  ALPHA ", p, ctx)).toBe(true);
    expect(evaluatePuzzleAnswer("Beta", p, ctx)).toBe(true);
  });

  it("rejects answers not in the pool", () => {
    expect(evaluatePuzzleAnswer("delta", p, ctx)).toBe(false);
  });

  it("falls back to legacy when context is incomplete", () => {
    const pWithLegacy: PuzzleAnswerInput = {
      id: "p1",
      seasonalSolve: { pool },
      acceptableAnswers: ["delta"],
    };
    // No playerId in ctx → legacy path → "delta" wins.
    expect(evaluatePuzzleAnswer("delta", pWithLegacy, {})).toBe(true);
    // With ctx → seasonal path → "delta" loses (not in pool).
    expect(evaluatePuzzleAnswer("delta", pWithLegacy, ctx)).toBe(false);
  });
});

describe("evaluatePuzzleAnswer — seasonal path (strict mode)", () => {
  const pool = ["alpha", "beta", "gamma"];
  const p: PuzzleAnswerInput = {
    id: "p1",
    seasonalSolve: { pool, mode: "strict" },
  };
  const ctx = { playerId: "u1", seasonKey: "S1-2026" };

  it("accepts the canonical answer for the (player, season) seed", () => {
    const ss = resolveSolveState(p, ctx)!;
    expect(evaluatePuzzleAnswer(ss.canonicalAnswer, p, ctx)).toBe(true);
  });

  it("rejects pool entries that aren't the seeded canonical (community-wiki kill)", () => {
    const ss = resolveSolveState(p, ctx)!;
    const nonCanonical = pool.find((x) => x !== ss.canonicalAnswer)!;
    expect(evaluatePuzzleAnswer(nonCanonical, p, ctx)).toBe(false);
  });

  it("rotates the canonical when the season changes", () => {
    const seasons = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
    const canonicals = new Set<string>();
    for (const s of seasons) {
      const ss = resolveSolveState(p, { playerId: "u1", seasonKey: s })!;
      canonicals.add(ss.canonicalAnswer);
    }
    expect(canonicals.size).toBeGreaterThan(1);
  });
});
