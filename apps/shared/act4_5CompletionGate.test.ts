import { describe, it, expect } from "vitest";
import {
  ACT_4_5_TRACK_FLAGS,
  deriveAct4_5CompletionStatus,
  isAct4_5Complete,
} from "./act4_5CompletionGate";

describe("deriveAct4_5CompletionStatus — baseline", () => {
  it("reports nothing met on empty flags", () => {
    const s = deriveAct4_5CompletionStatus({ narrativeAct: 4, flags: {} });
    expect(s.tracksCompleted).toEqual([]);
    expect(s.primaryTrack).toBeNull();
    expect(s.readyToFire).toBe(false);
  });

  it("tolerates undefined inputs", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct4_5CompletionStatus — readyToFire", () => {
  it("fires with slideshow + circuit in Act 4", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 4,
      flags: {
        slideshow_act_4_5_intro_complete: true,
        act_4_5_circuit_complete: true,
      },
    });
    expect(s.readyToFire).toBe(true);
    expect(s.primaryTrack).toBe("act_4_5_circuit_complete");
  });

  it("fires with slideshow + casino in Act 4", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 4,
      flags: {
        slideshow_act_4_5_intro_complete: true,
        act_4_5_casino_complete: true,
      },
    });
    expect(s.readyToFire).toBe(true);
    expect(s.primaryTrack).toBe("act_4_5_casino_complete");
  });

  it("fires in Act 5 too (sibling track stays open)", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 5,
      flags: {
        slideshow_act_4_5_intro_complete: true,
        act_4_5_circuit_complete: true,
      },
    });
    expect(s.readyToFire).toBe(true);
  });

  it("does NOT fire below Act 4", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 3,
      flags: {
        slideshow_act_4_5_intro_complete: true,
        act_4_5_circuit_complete: true,
      },
    });
    expect(s.readyToFire).toBe(false);
  });

  it("does NOT re-fire once complete", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 4,
      flags: {
        slideshow_act_4_5_intro_complete: true,
        act_4_5_circuit_complete: true,
        act_4_5_complete: true,
      },
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct4_5CompletionStatus — track disjunction", () => {
  it("does NOT fire with slideshow alone", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 4,
      flags: { slideshow_act_4_5_intro_complete: true },
    });
    expect(s.readyToFire).toBe(false);
  });

  it("does NOT fire with track alone (no slideshow)", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 4,
      flags: { act_4_5_circuit_complete: true },
    });
    expect(s.readyToFire).toBe(false);
  });

  it("counts both tracks when both are completed", () => {
    const s = deriveAct4_5CompletionStatus({
      narrativeAct: 4,
      flags: {
        slideshow_act_4_5_intro_complete: true,
        act_4_5_circuit_complete: true,
        act_4_5_casino_complete: true,
      },
    });
    expect(s.tracksCompletedCount).toBe(2);
    expect(s.tracksCompleted).toEqual(ACT_4_5_TRACK_FLAGS);
    expect(s.primaryTrack).toBe("act_4_5_circuit_complete");
  });
});

describe("isAct4_5Complete", () => {
  it("reads the flag directly", () => {
    expect(isAct4_5Complete({ act_4_5_complete: true })).toBe(true);
    expect(isAct4_5Complete({})).toBe(false);
    expect(isAct4_5Complete(undefined)).toBe(false);
  });
});
