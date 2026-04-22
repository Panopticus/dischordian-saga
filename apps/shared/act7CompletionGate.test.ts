import { describe, it, expect } from "vitest";
import {
  ACT_7_COMPLETION_REQUIRED_FLAGS,
  ACT_7_FINAL_STANCE_FLAGS,
  deriveAct7CompletionStatus,
  isAct7Complete,
} from "./act7CompletionGate";

const ALL_REQUIRED = {
  slideshow_act_7_convergence_intro_complete: true,
  act7_arc_closes: true,
};

describe("deriveAct7CompletionStatus — baseline", () => {
  it("reports nothing met on empty flags", () => {
    const s = deriveAct7CompletionStatus({ narrativeAct: 7, flags: {} });
    expect(s.requiredMet).toBe(0);
    expect(s.readyToFire).toBe(false);
  });
  it("tolerates undefined inputs", () => {
    const s = deriveAct7CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct7CompletionStatus — readyToFire", () => {
  it("fires when all required + Act 7, even with NO stance (silence is a stance)", () => {
    const s = deriveAct7CompletionStatus({
      narrativeAct: 7,
      flags: ALL_REQUIRED,
    });
    expect(s.readyToFire).toBe(true);
    expect(s.primaryStance).toBeNull();
    expect(s.stancesTakenCount).toBe(0);
  });
  it("does NOT fire below Act 7", () => {
    const s = deriveAct7CompletionStatus({
      narrativeAct: 6,
      flags: ALL_REQUIRED,
    });
    expect(s.readyToFire).toBe(false);
  });
  it("does NOT re-fire once complete", () => {
    const s = deriveAct7CompletionStatus({
      narrativeAct: 7,
      flags: { ...ALL_REQUIRED, act_7_complete: true },
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct7CompletionStatus — required flag gating", () => {
  for (const flag of ACT_7_COMPLETION_REQUIRED_FLAGS) {
    it(`does NOT fire when ${flag} is missing`, () => {
      const partial = { ...ALL_REQUIRED, [flag]: false };
      const s = deriveAct7CompletionStatus({
        narrativeAct: 7,
        flags: partial,
      });
      expect(s.readyToFire).toBe(false);
    });
  }
});

describe("deriveAct7CompletionStatus — stance reporting", () => {
  for (const stance of ACT_7_FINAL_STANCE_FLAGS) {
    it(`reports ${stance} when taken`, () => {
      const s = deriveAct7CompletionStatus({
        narrativeAct: 7,
        flags: { ...ALL_REQUIRED, [stance]: true },
      });
      expect(s.primaryStance).toBe(stance);
      expect(s.readyToFire).toBe(true);
    });
  }
  it("primaryStance reports canonical-order first when multiple raised", () => {
    const s = deriveAct7CompletionStatus({
      narrativeAct: 7,
      flags: {
        ...ALL_REQUIRED,
        act7_s1_machine_path: true,
        act7_s1_humanity_path: true,
      },
    });
    expect(s.primaryStance).toBe("act7_s1_humanity_path");
    expect(s.stancesTakenCount).toBe(2);
  });
});

describe("isAct7Complete", () => {
  it("reads the flag directly", () => {
    expect(isAct7Complete({ act_7_complete: true })).toBe(true);
    expect(isAct7Complete({})).toBe(false);
    expect(isAct7Complete(undefined)).toBe(false);
  });
});
