import { describe, it, expect } from "vitest";
import {
  scoreReverseTrial,
  REVERSE_TRIAL_PHASES,
  REVERSE_TRIAL_PASS_THRESHOLD,
  type PhaseOutcome,
  type ReverseTrialPhase,
} from "./reverseTrial";

function phase(p: ReverseTrialPhase, won: boolean, delta = 0): PhaseOutcome {
  return { phase: p, won, verdictDelta: delta };
}

function fullSubmission(wins: number): { outcomes: PhaseOutcome[] } {
  return {
    outcomes: REVERSE_TRIAL_PHASES.map((p, i) => phase(p, i < wins, i < wins ? 1 : -1)),
  };
}

describe("scoreReverseTrial — pass/fail rules", () => {
  it("passes at exactly the threshold (4 of 6)", () => {
    const e = scoreReverseTrial(fullSubmission(4));
    expect(e.passed).toBe(true);
    expect(e.rewards?.filedBuff).toBe(true);
  });

  it("passes with all 6 wins", () => {
    const e = scoreReverseTrial(fullSubmission(6));
    expect(e.passed).toBe(true);
    expect(e.rewards?.filedBuff).toBe(true);
  });

  it("fails at 3 of 6 and applies the weight penalty", () => {
    const e = scoreReverseTrial(fullSubmission(3));
    expect(e.passed).toBe(false);
    expect(e.penalties?.humanConfessionWeight).toBe(0.75);
    expect(e.reason).toMatch(/3 of 6/);
  });

  it("fails at 0 wins", () => {
    const e = scoreReverseTrial(fullSubmission(0));
    expect(e.passed).toBe(false);
    expect(e.penalties?.humanConfessionWeight).toBe(0.75);
  });
});

describe("scoreReverseTrial — validation", () => {
  it("rejects fewer than 6 phases", () => {
    const e = scoreReverseTrial({
      outcomes: [phase("charge", true), phase("opening", true)],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/must contain 6 phase outcomes/);
  });

  it("rejects out-of-order phases", () => {
    const e = scoreReverseTrial({
      outcomes: [
        phase("opening", true), // swapped
        phase("charge", true),
        phase("evidence", true),
        phase("cross_examination", true),
        phase("confession", true),
        phase("verdict", true),
      ],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/Phase index 0 must be "charge"/);
  });

  it("rejects non-finite verdictDelta", () => {
    const e = scoreReverseTrial({
      outcomes: [
        phase("charge", true, Number.NaN),
        phase("opening", true),
        phase("evidence", true),
        phase("cross_examination", true),
        phase("confession", true),
        phase("verdict", true),
      ],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/must be finite/);
  });

  it("threshold is below phase count", () => {
    expect(REVERSE_TRIAL_PASS_THRESHOLD).toBeLessThan(REVERSE_TRIAL_PHASES.length);
  });
});
