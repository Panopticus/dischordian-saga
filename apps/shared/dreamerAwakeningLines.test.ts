import { describe, it, expect } from "vitest";
import {
  DREAMER_AWAKENING_CUES,
  getDreamerCueById,
  getDreamerCuesUnderStep,
  getDreamerCuesSurfacedBy,
} from "./dreamerAwakeningLines";

describe("dreamerAwakeningLines", () => {
  it("every cue id is unique", () => {
    const ids = DREAMER_AWAKENING_CUES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("the unmistakable cue is reserved for post-Recording-0", () => {
    const unmistakable = DREAMER_AWAKENING_CUES.filter((c) => c.band === "unmistakable");
    expect(unmistakable).toHaveLength(1);
    expect(unmistakable[0].id).toBe("dream_post_recording_zero");
    expect(unmistakable[0].surfacedBy).toBe("post_recording_zero");
  });

  it("'wake gently' cue surfaces only on role refusal", () => {
    const cue = getDreamerCueById("dream_wake_gently");
    expect(cue?.surfacedBy).toBe("refuse_role");
    expect(cue?.text).toContain("wake gently");
  });

  it("at least one cue is surfaced by each diegetic player action", () => {
    for (const surface of ["refuse_role", "ask_question", "touch_panel", "post_recording_zero"] as const) {
      expect(getDreamerCuesSurfacedBy(surface).length).toBeGreaterThan(0);
    }
  });

  it("getDreamerCuesUnderStep returns cues at the requested architect step", () => {
    const underStep4 = getDreamerCuesUnderStep(4);
    expect(underStep4.length).toBeGreaterThan(0);
    for (const c of underStep4) expect(c.underStep).toBe(4);
  });

  it("the Dreamer's voice is forbidden from the register 'wise' — no 'I am' / 'you must' constructions", () => {
    // Lulled register, not authoritative.
    for (const cue of DREAMER_AWAKENING_CUES) {
      expect(cue.text.toLowerCase()).not.toContain("you must");
    }
  });

  it("ambient cues have empty or short text (lulled register)", () => {
    for (const cue of DREAMER_AWAKENING_CUES.filter((c) => c.band === "ambient")) {
      expect(cue.text.length).toBeLessThanOrEqual(80);
    }
  });
});
