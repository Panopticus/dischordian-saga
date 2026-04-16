import { describe, it, expect } from "vitest";
import { nextBeatId } from "../client/src/components/prelude/PreludeSequencePlayerConnected";
import { PRELUDE_BEATS } from "../shared/preludeSequence";

/* ═══════════════════════════════════════════════════════
   nextBeatId — pure helper the save/resume wrapper uses
   to compute the next beat to persist as `currentPreludeBeat`
   when a beat completes.
   ═══════════════════════════════════════════════════════ */

describe("nextBeatId", () => {
  it("returns the next beat id in canonical sequence order", () => {
    expect(nextBeatId("beat_a")).toBe("beat_a5");
    expect(nextBeatId("beat_a5")).toBe("beat_b");
    expect(nextBeatId("beat_b")).toBe("beat_c");
    expect(nextBeatId("beat_c")).toBe("beat_c5");
  });

  it("bridges every half-beat breath boundary", () => {
    // Breath beats are A.5, C.5, D.5, F.5, H.5 — each should hand off
    // to the next full beat (B, D, E, G, I respectively).
    const breathToNext: ReadonlyMap<string, string> = new Map([
      ["beat_a5", "beat_b"],
      ["beat_c5", "beat_d"],
      ["beat_d5", "beat_e"],
      ["beat_f5", "beat_g"],
      ["beat_h5", "beat_i"],
    ]);
    for (const [from, expected] of breathToNext) {
      expect(nextBeatId(from)).toBe(expected);
    }
  });

  it("returns null at the final beat (beat_j)", () => {
    expect(nextBeatId("beat_j")).toBeNull();
  });

  it("returns null for unknown beat ids (canon rename fallback)", () => {
    expect(nextBeatId("beat_zzz")).toBeNull();
    expect(nextBeatId("")).toBeNull();
  });

  it("handles every canonical beat except the last", () => {
    for (let i = 0; i < PRELUDE_BEATS.length - 1; i++) {
      const expectedNext = PRELUDE_BEATS[i + 1].id;
      expect(nextBeatId(PRELUDE_BEATS[i].id)).toBe(expectedNext);
    }
  });
});
