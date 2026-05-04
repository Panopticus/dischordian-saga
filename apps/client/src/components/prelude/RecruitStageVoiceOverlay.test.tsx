/**
 * RecruitStageVoiceOverlay — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "RecruitStageVoiceOverlay.tsx"),
  "utf-8",
);
const PRELUDE_PAGE_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "..", "pages", "PreludePage.tsx"),
  "utf-8",
);

describe("RecruitStageVoiceOverlay", () => {
  it("imports the canonical Architect + Dreamer cue registries", () => {
    expect(SRC).toContain('from "@shared/architectAwakeningLines"');
    expect(SRC).toContain('from "@shared/dreamerAwakeningLines"');
    expect(SRC).toContain("ARCHITECT_AWAKENING_CUES");
    expect(SRC).toContain("DREAMER_AWAKENING_CUES");
  });

  it("plays Architect specs only during the early Prelude beats", () => {
    expect(SRC).toContain("EARLY_BEAT_IDS");
    expect(SRC).toContain('"beat_a"');
    expect(SRC).toContain('"beat_a5"');
  });

  it("surfaces 'wake gently' Dreamer cue only when DREAMER_UNSANCTIONED_FLAG is set", () => {
    expect(SRC).toContain("DREAMER_UNSANCTIONED_FLAG");
    expect(SRC).toContain("dream_wake_gently");
  });

  it("surfaces the unmistakable post-Recording-0 cue only when the recording has been heard", () => {
    expect(SRC).toContain("ENGINEER_RECORDING_0_FLAG");
    expect(SRC).toContain("dream_post_recording_zero");
  });

  it("persists per-source completion flags so the overlay self-suppresses", () => {
    expect(SRC).toContain("ARCHITECT_PLAYED_FLAG");
    expect(SRC).toContain("DREAMER_WAKE_GENTLY_PLAYED_FLAG");
    expect(SRC).toContain("POST_R0_DREAMER_PLAYED_FLAG");
    expect(SRC).toContain("setNarrativeFlag");
  });

  it("does NOT gate the Prelude — it sits over the cryo backdrop and steps aside when done", () => {
    // Returns null when no queue items remain
    expect(SRC).toMatch(/if \(done \|\| queue\.length === 0\) return null/);
  });

  it("differentiates visual register between Architect (stone) and Dreamer (amber italic)", () => {
    expect(SRC).toContain("border-stone-600");
    expect(SRC).toContain("border-amber-700");
    expect(SRC).toContain("italic");
  });

  it("uses keyboard accessibility (space + enter advance the cue)", () => {
    expect(SRC).toContain('e.key === " "');
    expect(SRC).toContain('e.key === "Enter"');
  });
});

describe("PreludePage — overlay mount", () => {
  it("imports RecruitStageVoiceOverlay", () => {
    expect(PRELUDE_PAGE_SRC).toContain(
      'from "@/components/prelude/RecruitStageVoiceOverlay"',
    );
  });

  it("renders <RecruitStageVoiceOverlay /> alongside the existing PreludeSequencePlayerConnected", () => {
    expect(PRELUDE_PAGE_SRC).toContain("<RecruitStageVoiceOverlay");
    expect(PRELUDE_PAGE_SRC).toContain("PreludeSequencePlayerConnected");
  });
});
