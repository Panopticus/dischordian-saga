import { describe, it, expect } from "vitest";
import {
  ACT_6_COMPLETION_REQUIRED_FLAGS,
  ACT_6_CONFESSION_STANCE_FLAGS,
  deriveAct6CompletionStatus,
  isAct6Complete,
} from "./act6CompletionGate";

const ALL_REQUIRED = {
  slideshow_act_6_confession_intro_complete: true,
  act6_elara_confession_heard: true,
  act6_human_confession_heard: true,
};
const STANCE = { act6_confession_close_empathy: true };

describe("deriveAct6CompletionStatus — baseline", () => {
  it("reports nothing met on empty flags", () => {
    const s = deriveAct6CompletionStatus({ narrativeAct: 6, flags: {} });
    expect(s.requiredMet).toBe(0);
    expect(s.stancesTaken).toEqual([]);
    expect(s.readyToFire).toBe(false);
  });
  it("tolerates undefined inputs", () => {
    const s = deriveAct6CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct6CompletionStatus — readyToFire", () => {
  it("fires with all required + one stance + Act 6", () => {
    const s = deriveAct6CompletionStatus({
      narrativeAct: 6,
      flags: { ...ALL_REQUIRED, ...STANCE },
    });
    expect(s.readyToFire).toBe(true);
    expect(s.primaryStance).toBe("act6_confession_close_empathy");
  });
  it("does NOT fire below Act 6", () => {
    const s = deriveAct6CompletionStatus({
      narrativeAct: 5,
      flags: { ...ALL_REQUIRED, ...STANCE },
    });
    expect(s.readyToFire).toBe(false);
  });
  it("does NOT re-fire once complete", () => {
    const s = deriveAct6CompletionStatus({
      narrativeAct: 6,
      flags: { ...ALL_REQUIRED, ...STANCE, act_6_complete: true },
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct6CompletionStatus — per-flag gating", () => {
  for (const flag of ACT_6_COMPLETION_REQUIRED_FLAGS) {
    it(`does NOT fire when ${flag} is missing`, () => {
      const partial = { ...ALL_REQUIRED, ...STANCE, [flag]: false };
      const s = deriveAct6CompletionStatus({
        narrativeAct: 6,
        flags: partial,
      });
      expect(s.readyToFire).toBe(false);
    });
  }
  it("does NOT fire with no stance taken", () => {
    const s = deriveAct6CompletionStatus({
      narrativeAct: 6,
      flags: ALL_REQUIRED,
    });
    expect(s.stancesTaken).toEqual([]);
    expect(s.readyToFire).toBe(false);
  });
  for (const stance of ACT_6_CONFESSION_STANCE_FLAGS) {
    it(`fires when ${stance} is the only stance`, () => {
      const s = deriveAct6CompletionStatus({
        narrativeAct: 6,
        flags: { ...ALL_REQUIRED, [stance]: true },
      });
      expect(s.primaryStance).toBe(stance);
      expect(s.readyToFire).toBe(true);
    });
  }
});

describe("isAct6Complete", () => {
  it("reads the flag directly", () => {
    expect(isAct6Complete({ act_6_complete: true })).toBe(true);
    expect(isAct6Complete({})).toBe(false);
    expect(isAct6Complete(undefined)).toBe(false);
  });
});
