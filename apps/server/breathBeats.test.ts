import { describe, it, expect } from "vitest";
import {
  BREATH_BEAT_IDS,
  isBreathBeat,
} from "../client/src/components/prelude/preludeSequenceReducer";
import { PRELUDE_BEATS } from "../shared/preludeSequence";

/* ═══════════════════════════════════════════════════════
   Breath-beat classification — canonical Bible §1 Master
   Index half-step beats (A.5, C.5, D.5, F.5, H.5).
   ═══════════════════════════════════════════════════════ */

describe("BREATH_BEAT_IDS", () => {
  it("contains exactly the 5 canonical breath beats", () => {
    expect(BREATH_BEAT_IDS.size).toBe(5);
    expect([...BREATH_BEAT_IDS].sort()).toEqual([
      "beat_a5",
      "beat_c5",
      "beat_d5",
      "beat_f5",
      "beat_h5",
    ]);
  });

  it("every breath-beat id exists in the PRELUDE_BEATS manifest", () => {
    const manifestIds = new Set<string>(PRELUDE_BEATS.map((b) => b.id));
    for (const id of BREATH_BEAT_IDS) {
      expect(manifestIds.has(id)).toBe(true);
    }
  });

  it("every beat canonically titled as a Breath Beat is in the set", () => {
    // Cross-check: the Bible titles breath beats explicitly with the
    // "(Breath Beat)" suffix. Any beat whose title contains that
    // phrase must be in BREATH_BEAT_IDS.
    for (const beat of PRELUDE_BEATS) {
      if (beat.title.includes("Breath Beat")) {
        expect(BREATH_BEAT_IDS.has(beat.id)).toBe(true);
      }
    }
  });

  it("no full beat is accidentally classified as a breath beat", () => {
    const fullBeatIds = new Set([
      "beat_a",
      "beat_b",
      "beat_c",
      "beat_d",
      "beat_e",
      "beat_f",
      "beat_g",
      "beat_h",
      "beat_i",
      "beat_j",
    ]);
    for (const id of fullBeatIds) {
      expect(BREATH_BEAT_IDS.has(id)).toBe(false);
    }
  });
});

describe("isBreathBeat", () => {
  it("accepts a bare id string", () => {
    expect(isBreathBeat("beat_a5")).toBe(true);
    expect(isBreathBeat("beat_a")).toBe(false);
  });

  it("accepts a full PreludeBeat object", () => {
    const a5 = PRELUDE_BEATS.find((b) => b.id === "beat_a5")!;
    const a = PRELUDE_BEATS.find((b) => b.id === "beat_a")!;
    expect(isBreathBeat(a5)).toBe(true);
    expect(isBreathBeat(a)).toBe(false);
  });

  it("returns false for unknown ids", () => {
    expect(isBreathBeat("beat_zzz")).toBe(false);
    expect(isBreathBeat("")).toBe(false);
  });

  it("partitions all 15 beats into exactly 5 breath + 10 full", () => {
    let breath = 0;
    let full = 0;
    for (const beat of PRELUDE_BEATS) {
      if (isBreathBeat(beat)) breath++;
      else full++;
    }
    expect(breath).toBe(5);
    expect(full).toBe(10);
  });
});
