import { describe, expect, it } from "vitest";
import {
  deriveCanonicalAnswer,
  buildSolveState,
  isAcceptableSolution,
} from "./puzzleSolveState";

describe("deriveCanonicalAnswer (audit/16 PR 28 AR8)", () => {
  it("returns the only option for a single-entry pool", () => {
    expect(deriveCanonicalAnswer("p1", "u1", "S1-2026", ["alpha"])).toBe("alpha");
  });

  it("throws on empty pool", () => {
    expect(() => deriveCanonicalAnswer("p1", "u1", "S1", [])).toThrow();
  });

  it("is deterministic for the same triple", () => {
    const pool = ["alpha", "beta", "gamma", "delta"];
    expect(deriveCanonicalAnswer("p1", "u1", "S1-2026", pool))
      .toBe(deriveCanonicalAnswer("p1", "u1", "S1-2026", pool));
  });

  it("returns a string from the pool", () => {
    const pool = ["alpha", "beta", "gamma", "delta", "epsilon"];
    for (let i = 0; i < 20; i++) {
      const ans = deriveCanonicalAnswer("p1", `u${i}`, "S1-2026", pool);
      expect(pool).toContain(ans);
    }
  });

  it("seasonKey rotation produces (statistically) different answers", () => {
    // For pool size 5, different seasonKeys should not all collapse
    // to the same answer. Run across 10 seasons and assert at least
    // 2 distinct answers result.
    const pool = ["a", "b", "c", "d", "e"];
    const answers = new Set<string>();
    for (let s = 0; s < 10; s++) {
      answers.add(deriveCanonicalAnswer("p1", "u1", `S${s}`, pool));
    }
    expect(answers.size).toBeGreaterThan(1);
  });

  it("playerId rotation produces (statistically) different answers", () => {
    const pool = ["a", "b", "c", "d", "e"];
    const answers = new Set<string>();
    for (let p = 0; p < 10; p++) {
      answers.add(deriveCanonicalAnswer("p1", `user-${p}`, "S1", pool));
    }
    expect(answers.size).toBeGreaterThan(1);
  });

  it("different puzzleIds don't always collide on the same answer", () => {
    const pool = ["a", "b", "c", "d", "e"];
    const answers = new Set<string>();
    for (let p = 0; p < 10; p++) {
      answers.add(deriveCanonicalAnswer(`puzzle-${p}`, "u1", "S1", pool));
    }
    expect(answers.size).toBeGreaterThan(1);
  });
});

describe("buildSolveState", () => {
  it("populates the SeasonalSolveState shape correctly", () => {
    const pool = ["alpha", "beta", "gamma"];
    const ss = buildSolveState("riddle_1", "user-42", "S1-2026", pool);
    expect(ss.puzzleId).toBe("riddle_1");
    expect(ss.playerId).toBe("user-42");
    expect(ss.seasonKey).toBe("S1-2026");
    expect(pool).toContain(ss.canonicalAnswer);
    expect(ss.answerPool).toEqual(pool);
  });
});

describe("isAcceptableSolution — lenient mode (default)", () => {
  const pool = ["alpha", "beta", "gamma"];
  const ss = buildSolveState("riddle_1", "user-42", "S1-2026", pool);

  it("accepts the canonical answer", () => {
    expect(isAcceptableSolution(ss.canonicalAnswer, ss)).toBe(true);
  });

  it("accepts any pool entry (back-compat)", () => {
    for (const candidate of pool) {
      expect(isAcceptableSolution(candidate, ss)).toBe(true);
    }
  });

  it("is case-insensitive + whitespace-tolerant", () => {
    expect(isAcceptableSolution("  ALPHA  ", ss)).toBe(true);
    expect(isAcceptableSolution("Beta", ss)).toBe(true);
  });

  it("rejects answers not in the pool", () => {
    expect(isAcceptableSolution("delta", ss)).toBe(false);
    expect(isAcceptableSolution("not_real", ss)).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isAcceptableSolution("", ss)).toBe(false);
    expect(isAcceptableSolution("   ", ss)).toBe(false);
  });
});

describe("isAcceptableSolution — strict mode", () => {
  const pool = ["alpha", "beta", "gamma"];
  const ss = buildSolveState("riddle_1", "user-42", "S1-2026", pool);

  it("accepts only the canonical answer", () => {
    expect(isAcceptableSolution(ss.canonicalAnswer, ss, "strict")).toBe(true);
  });

  it("rejects other pool entries (the audit'd 'community-wiki kill' behaviour)", () => {
    // Find a pool entry that isn't the canonical answer.
    const nonCanonical = pool.find((p) => p !== ss.canonicalAnswer);
    expect(nonCanonical, "test fixture must have a non-canonical option").toBeTruthy();
    expect(isAcceptableSolution(nonCanonical!, ss, "strict")).toBe(false);
  });

  it("is still case-insensitive + whitespace-tolerant", () => {
    expect(isAcceptableSolution("  " + ss.canonicalAnswer.toUpperCase() + "  ", ss, "strict")).toBe(true);
  });
});
