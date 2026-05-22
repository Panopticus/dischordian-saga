import { describe, it, expect } from "vitest";
import {
  scoreTribunalElara,
  classifyTribunalOutcome,
  TRIBUNAL_COMMITMENT_THRESHOLD,
  type TribunalSubmission,
} from "./tribunalElara";

const baseline = (over: Partial<TribunalSubmission> = {}): TribunalSubmission => ({
  verdictDelta: 0,
  romanceGateUnlocked: false,
  ...over,
});

describe("classifyTribunalOutcome", () => {
  it("returns 'redeemed' at or above the positive threshold", () => {
    expect(classifyTribunalOutcome(TRIBUNAL_COMMITMENT_THRESHOLD)).toBe("redeemed");
    expect(classifyTribunalOutcome(TRIBUNAL_COMMITMENT_THRESHOLD + 10)).toBe(
      "redeemed",
    );
  });

  it("returns 'guilty_but_accepted' at or below the negative threshold", () => {
    expect(classifyTribunalOutcome(-TRIBUNAL_COMMITMENT_THRESHOLD)).toBe(
      "guilty_but_accepted",
    );
    expect(classifyTribunalOutcome(-(TRIBUNAL_COMMITMENT_THRESHOLD + 10))).toBe(
      "guilty_but_accepted",
    );
  });

  it("returns 'split' near zero (insufficient commitment)", () => {
    expect(classifyTribunalOutcome(0)).toBe("split");
    expect(classifyTribunalOutcome(TRIBUNAL_COMMITMENT_THRESHOLD - 1)).toBe("split");
    expect(classifyTribunalOutcome(-(TRIBUNAL_COMMITMENT_THRESHOLD - 1))).toBe(
      "split",
    );
  });
});

describe("scoreTribunalElara — pass paths", () => {
  it("passes on 'redeemed' (strong positive delta)", () => {
    const e = scoreTribunalElara(baseline({ verdictDelta: 5 }));
    expect(e.passed).toBe(true);
    expect(e.rewards?.elaraConfessionVisibility).toBe(true);
    expect(e.reason).toMatch(/redeemed/i);
  });

  it("passes on 'guilty but accepted' (strong negative delta)", () => {
    const e = scoreTribunalElara(baseline({ verdictDelta: -7 }));
    expect(e.passed).toBe(true);
    expect(e.rewards?.elaraConfessionVisibility).toBe(true);
    expect(e.reason).toMatch(/accepted/i);
  });

  it("appends the romance tag when the 4th phase landed", () => {
    const e = scoreTribunalElara({
      verdictDelta: 5,
      romanceGateUnlocked: true,
      romancePhaseCompleted: true,
    });
    expect(e.passed).toBe(true);
    expect(e.reason).toMatch(/fourth phase/i);
  });

  it("does NOT append the romance tag when only the gate was open but the phase wasn't played", () => {
    const e = scoreTribunalElara({
      verdictDelta: 5,
      romanceGateUnlocked: true,
      romancePhaseCompleted: false,
    });
    expect(e.passed).toBe(true);
    expect(e.reason).not.toMatch(/fourth phase/i);
  });
});

describe("scoreTribunalElara — fail paths", () => {
  it("fails on a split verdict", () => {
    const e = scoreTribunalElara(baseline({ verdictDelta: 1 }));
    expect(e.passed).toBe(false);
    expect(e.penalties?.elaraConfessionVisibility).toBe(false);
    expect(e.reason).toMatch(/split/i);
  });

  it("rejects romancePhase completed without gate unlocked", () => {
    const e = scoreTribunalElara({
      verdictDelta: 5,
      romanceGateUnlocked: false,
      romancePhaseCompleted: true,
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/Romance phase cannot be completed/);
  });

  it("rejects non-finite verdictDelta", () => {
    const e = scoreTribunalElara(baseline({ verdictDelta: Number.NaN }));
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/finite/);
  });
});
