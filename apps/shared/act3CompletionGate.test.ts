import { describe, it, expect } from "vitest";
import {
  ACT_3_COMPLETION_REQUIRED_FLAGS,
  ACT_3_INFILTRATION_ENDING_FLAGS,
  deriveAct3CompletionStatus,
  isAct3Complete,
} from "./act3CompletionGate";

const ALL_REQUIRED = {
  slideshow_i_am_the_eyes_that_watch_complete: true,
  act3_kael_logs_unlocked: true,
};

const PICK_INSURGENCY = {
  act3_insurgency_ending: true,
};

describe("deriveAct3CompletionStatus — baseline", () => {
  it("reports nothing met on an empty flag set", () => {
    const s = deriveAct3CompletionStatus({ narrativeAct: 3, flags: {} });
    expect(s.requiredMet).toBe(0);
    expect(s.endingFlagsRaised).toEqual([]);
    expect(s.primaryEnding).toBeNull();
    expect(s.allConditionsMet).toBe(false);
    expect(s.readyToFire).toBe(false);
  });

  it("tolerates undefined flags + undefined narrativeAct", () => {
    const s = deriveAct3CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.readyToFire).toBe(false);
    expect(s.primaryEnding).toBeNull();
  });
});

describe("deriveAct3CompletionStatus — readyToFire", () => {
  it("fires when all required + any ending + narrativeAct >= 3", () => {
    const s = deriveAct3CompletionStatus({
      narrativeAct: 3,
      flags: { ...ALL_REQUIRED, ...PICK_INSURGENCY },
    });
    expect(s.requiredMet).toBe(2);
    expect(s.allConditionsMet).toBe(true);
    expect(s.readyToFire).toBe(true);
    expect(s.primaryEnding).toBe("act3_insurgency_ending");
  });

  it("does NOT fire when narrativeAct < 3 even if everything else is true", () => {
    const s = deriveAct3CompletionStatus({
      narrativeAct: 2,
      flags: { ...ALL_REQUIRED, ...PICK_INSURGENCY },
    });
    expect(s.allConditionsMet).toBe(true);
    expect(s.readyToFire).toBe(false);
  });

  it("does NOT fire again once act_3_complete is already set", () => {
    const s = deriveAct3CompletionStatus({
      narrativeAct: 3,
      flags: { ...ALL_REQUIRED, ...PICK_INSURGENCY, act_3_complete: true },
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });

  it("fires in Act 4+ too (future acts don't block the gate)", () => {
    const s = deriveAct3CompletionStatus({
      narrativeAct: 5,
      flags: { ...ALL_REQUIRED, ...PICK_INSURGENCY },
    });
    expect(s.readyToFire).toBe(true);
  });
});

describe("deriveAct3CompletionStatus — per-required-flag gating", () => {
  for (const missingFlag of ACT_3_COMPLETION_REQUIRED_FLAGS) {
    it(`does NOT fire when ${missingFlag} is missing`, () => {
      const partial = { ...ALL_REQUIRED, ...PICK_INSURGENCY, [missingFlag]: false };
      const s = deriveAct3CompletionStatus({
        narrativeAct: 3,
        flags: partial,
      });
      expect(s.requiredFlagStatus[missingFlag]).toBe(false);
      expect(s.allConditionsMet).toBe(false);
      expect(s.readyToFire).toBe(false);
    });
  }
});

describe("deriveAct3CompletionStatus — ending-flag disjunction", () => {
  it("does NOT fire when no ending flag is raised, even if required are met", () => {
    const s = deriveAct3CompletionStatus({
      narrativeAct: 3,
      flags: ALL_REQUIRED,
    });
    expect(s.endingFlagsRaised).toEqual([]);
    expect(s.readyToFire).toBe(false);
  });

  for (const endingFlag of ACT_3_INFILTRATION_ENDING_FLAGS) {
    it(`fires when ${endingFlag} is the only path completed`, () => {
      const s = deriveAct3CompletionStatus({
        narrativeAct: 3,
        flags: { ...ALL_REQUIRED, [endingFlag]: true },
      });
      expect(s.readyToFire).toBe(true);
      expect(s.primaryEnding).toBe(endingFlag);
    });
  }

  it("primaryEnding is the canonical-order first raised ending", () => {
    // Insurgency appears first in the canonical ACT_3_INFILTRATION_ENDING_FLAGS
    // order, so a player who somehow completed two paths should still be
    // reported as taking the insurgency path (primary).
    const s = deriveAct3CompletionStatus({
      narrativeAct: 3,
      flags: {
        ...ALL_REQUIRED,
        act3_insurgency_ending: true,
        act3_empire_ending: true,
      },
    });
    expect(s.endingFlagsRaised).toHaveLength(2);
    expect(s.primaryEnding).toBe("act3_insurgency_ending");
  });
});

describe("isAct3Complete", () => {
  it("reads the completion flag directly", () => {
    expect(isAct3Complete({ act_3_complete: true })).toBe(true);
    expect(isAct3Complete({ act_3_complete: false })).toBe(false);
    expect(isAct3Complete({})).toBe(false);
    expect(isAct3Complete(undefined)).toBe(false);
  });
});
