import { describe, it, expect } from "vitest";
import {
  beatHasInteraction,
  beatIndexFromId,
  initialPreludeSequenceState,
  preludeSequenceReducer,
  type PreludeSequenceAction,
  type PreludeSequenceState,
} from "../client/src/components/prelude/preludeSequenceReducer";
import { PRELUDE_BEATS } from "../shared/preludeSequence";

/* ═══════════════════════════════════════════════════════
   PRELUDE SEQUENCE REDUCER — Pure state-machine tests

   The reducer is the heart of PreludeSequencePlayer; this
   suite is its canonical contract.
   ═══════════════════════════════════════════════════════ */

function reduce(
  initial: PreludeSequenceState,
  actions: readonly PreludeSequenceAction[],
): PreludeSequenceState {
  let state = initial;
  for (const a of actions) state = preludeSequenceReducer(state, a);
  return state;
}

describe("preludeSequenceReducer — initial state", () => {
  it("starts at beat 0 when no startingBeatId", () => {
    const s = initialPreludeSequenceState();
    expect(s.beatIndex).toBe(0);
    expect(s.phase).toBe("cutscene");
    expect(s.completedFlags).toEqual([]);
    expect(s.alignment).toBeNull();
  });

  it("starts at the requested beat when provided a valid id", () => {
    const s = initialPreludeSequenceState("beat_c");
    expect(s.beatIndex).toBe(beatIndexFromId("beat_c"));
    expect(s.phase).toBe("cutscene");
  });

  it("falls back to 0 for an unknown id", () => {
    expect(beatIndexFromId("beat_zzz" as unknown as Parameters<typeof beatIndexFromId>[0])).toBe(0);
  });
});

describe("preludeSequenceReducer — cutscene_ended auto-advance", () => {
  it("advances from beat_a to beat_a5 on cutscene_ended", () => {
    const s0 = initialPreludeSequenceState("beat_a");
    const s1 = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    expect(PRELUDE_BEATS[s1.beatIndex].id).toBe("beat_a5");
    expect(s1.phase).toBe("cutscene");
  });

  it("records the completion flag on cutscene_ended", () => {
    const s0 = initialPreludeSequenceState("beat_a");
    const s1 = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    expect(s1.completedFlags).toContain("cutscene_awakening_complete");
  });

  it("walks the entire 15-beat sequence via cutscene_ended (except Beat J)", () => {
    let s = initialPreludeSequenceState();
    // Beats 1..14 auto-advance. Beat 15 (Beat J) holds.
    for (let i = 0; i < 14; i++) {
      s = preludeSequenceReducer(s, { type: "cutscene_ended" });
    }
    expect(PRELUDE_BEATS[s.beatIndex].id).toBe("beat_j");
    expect(s.phase).toBe("cutscene");
  });

  it("Beat J stops at phase=completed after cutscene_ended", () => {
    const s0 = initialPreludeSequenceState("beat_j");
    const s1 = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    expect(PRELUDE_BEATS[s1.beatIndex].id).toBe("beat_j");
    expect(s1.phase).toBe("completed");
  });

  it("double-firing cutscene_ended is a no-op after the beat completes", () => {
    const s0 = initialPreludeSequenceState("beat_j");
    const s1 = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    const s2 = preludeSequenceReducer(s1, { type: "cutscene_ended" });
    expect(s2).toEqual(s1);
  });
});

describe("preludeSequenceReducer — skip_cutscene", () => {
  it("skip behaves identically to cutscene_ended", () => {
    const s0 = initialPreludeSequenceState("beat_c");
    const sA = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    const sB = preludeSequenceReducer(s0, { type: "skip_cutscene" });
    expect(sA).toEqual(sB);
  });
});

describe("preludeSequenceReducer — interaction_complete", () => {
  it("captures alignment at Beat J + transitions to done", () => {
    const s0 = initialPreludeSequenceState("beat_j");
    const s1 = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    const s2 = preludeSequenceReducer(s1, {
      type: "interaction_complete",
      payload: { alignment: "light" },
    });
    expect(s2.alignment).toBe("light");
    expect(s2.phase).toBe("done");
  });

  it("records Beat J completion flag", () => {
    const s0 = initialPreludeSequenceState("beat_j");
    const s1 = preludeSequenceReducer(s0, { type: "cutscene_ended" });
    const s2 = preludeSequenceReducer(s1, {
      type: "interaction_complete",
      payload: { alignment: "dark" },
    });
    expect(s2.completedFlags).toContain(
      "cutscene_archives_two_witnesses_part1_complete",
    );
  });
});

describe("preludeSequenceReducer — advance + reset", () => {
  it("advance steps forward one beat without firing completion flags", () => {
    const s0 = initialPreludeSequenceState();
    const s1 = preludeSequenceReducer(s0, { type: "advance" });
    expect(s1.beatIndex).toBe(1);
    expect(s1.completedFlags).toEqual([]); // advance doesn't record flags
  });

  it("advance at last beat transitions to done instead of overflowing", () => {
    const s0 = initialPreludeSequenceState("beat_j");
    const s1 = preludeSequenceReducer(s0, { type: "advance" });
    expect(s1.beatIndex).toBe(PRELUDE_BEATS.length - 1);
    expect(s1.phase).toBe("done");
  });

  it("reset returns to the initial state", () => {
    const final = reduce(initialPreludeSequenceState(), [
      { type: "cutscene_ended" },
      { type: "cutscene_ended" },
      { type: "cutscene_ended" },
    ]);
    expect(final.beatIndex).toBeGreaterThan(0);

    const reset = preludeSequenceReducer(final, { type: "reset" });
    expect(reset).toEqual(initialPreludeSequenceState());
  });
});

describe("beatHasInteraction", () => {
  it("is true only for Beat J", () => {
    for (const beat of PRELUDE_BEATS) {
      expect(beatHasInteraction(beat)).toBe(beat.id === "beat_j");
    }
  });
});
