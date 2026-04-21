import { describe, it, expect } from "vitest";
import {
  ACT_2_COMPLETION_FLAGS,
  deriveAct2CompletionStatus,
  isAct2Complete,
} from "./act2CompletionGate";

const ALL_FOUR = {
  crafting_mastered: true,
  chess_mastered: true,
  thaloria_cinematic_seen: true,
  game_master_loss: true,
};

describe("deriveAct2CompletionStatus — baseline", () => {
  it("reports 0/4 with no flags set", () => {
    const s = deriveAct2CompletionStatus({ narrativeAct: 2, flags: {} });
    expect(s.subFlagsMet).toBe(0);
    expect(s.allSubFlagsMet).toBe(false);
    expect(s.readyToFire).toBe(false);
    expect(s.alreadyComplete).toBe(false);
  });

  it("tolerates undefined flags + undefined narrativeAct", () => {
    const s = deriveAct2CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.subFlagsMet).toBe(0);
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct2CompletionStatus — readyToFire", () => {
  it("fires when all four sub-flags set AND narrativeAct >= 2", () => {
    const s = deriveAct2CompletionStatus({
      narrativeAct: 2,
      flags: ALL_FOUR,
    });
    expect(s.subFlagsMet).toBe(4);
    expect(s.allSubFlagsMet).toBe(true);
    expect(s.readyToFire).toBe(true);
  });

  it("does NOT fire when narrativeAct < 2 even with all sub-flags", () => {
    const s = deriveAct2CompletionStatus({
      narrativeAct: 1,
      flags: ALL_FOUR,
    });
    expect(s.allSubFlagsMet).toBe(true);
    expect(s.readyToFire).toBe(false);
  });

  it("does NOT fire again once act_2_complete is already set", () => {
    const s = deriveAct2CompletionStatus({
      narrativeAct: 2,
      flags: { ...ALL_FOUR, act_2_complete: true },
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });

  it("fires in Act 3+ too (future acts don't block the gate)", () => {
    const s = deriveAct2CompletionStatus({
      narrativeAct: 5,
      flags: ALL_FOUR,
    });
    expect(s.readyToFire).toBe(true);
  });
});

describe("deriveAct2CompletionStatus — per-sub-flag gating", () => {
  for (const missingFlag of ACT_2_COMPLETION_FLAGS) {
    it(`does NOT fire when ${missingFlag} is missing`, () => {
      const partial = { ...ALL_FOUR, [missingFlag]: false };
      const s = deriveAct2CompletionStatus({
        narrativeAct: 2,
        flags: partial,
      });
      expect(s.allSubFlagsMet).toBe(false);
      expect(s.subFlagStatus[missingFlag]).toBe(false);
      expect(s.subFlagsMet).toBe(3);
      expect(s.readyToFire).toBe(false);
    });
  }
});

describe("deriveAct2CompletionStatus — subFlagStatus map", () => {
  it("flags crafting_mastered true in isolation", () => {
    const s = deriveAct2CompletionStatus({
      narrativeAct: 2,
      flags: { crafting_mastered: true },
    });
    expect(s.subFlagStatus.crafting_mastered).toBe(true);
    expect(s.subFlagStatus.chess_mastered).toBe(false);
    expect(s.subFlagsMet).toBe(1);
  });
});

describe("isAct2Complete", () => {
  it("reads the completion flag directly", () => {
    expect(isAct2Complete({ act_2_complete: true })).toBe(true);
    expect(isAct2Complete({ act_2_complete: false })).toBe(false);
    expect(isAct2Complete({})).toBe(false);
    expect(isAct2Complete(undefined)).toBe(false);
  });
});
