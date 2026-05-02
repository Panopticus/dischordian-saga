import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  ALIGNMENT_CHOICES,
  ALIGNMENT_GATE_OPEN_S,
  FULL_WITNESSING_SLIDES,
  LAST_WORDS_FULL_DURATION_S,
  alignmentGateOpen,
  witnessingSlideAtTime,
} from "./act1CycleCWitnessing";

describe("act1CycleCWitnessing — slide timeline", () => {
  it("exposes exactly 20 slides", () => {
    expect(FULL_WITNESSING_SLIDES.length).toBe(20);
  });

  it("slide numbers run 1..20 with no gaps or duplicates", () => {
    const nums = FULL_WITNESSING_SLIDES.map((s) => s.slide);
    expect(nums).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it("startS is monotonically increasing and stays within the track", () => {
    let prev = -1;
    for (const s of FULL_WITNESSING_SLIDES) {
      expect(s.startS).toBeGreaterThan(prev);
      prev = s.startS;
      expect(s.startS).toBeLessThanOrEqual(LAST_WORDS_FULL_DURATION_S);
    }
  });

  it("every slide has a short non-empty caption", () => {
    for (const s of FULL_WITNESSING_SLIDES) {
      expect(s.caption.length).toBeGreaterThan(0);
      expect(s.caption.length).toBeLessThanOrEqual(80);
    }
  });

  it("witnessingSlideAtTime picks the last anchor <= currentTime", () => {
    expect(witnessingSlideAtTime(0).slide).toBe(1);
    expect(witnessingSlideAtTime(13).slide).toBe(2);
    expect(witnessingSlideAtTime(48).slide).toBe(5);
    expect(witnessingSlideAtTime(LAST_WORDS_FULL_DURATION_S).slide).toBe(20);
  });
});

describe("act1CycleCWitnessing — alignment gate", () => {
  it("opens at exactly ALIGNMENT_GATE_OPEN_S (late in the song)", () => {
    expect(alignmentGateOpen(ALIGNMENT_GATE_OPEN_S - 0.01)).toBe(false);
    expect(alignmentGateOpen(ALIGNMENT_GATE_OPEN_S)).toBe(true);
  });

  it("stays closed during verse_one + first_refrain", () => {
    expect(alignmentGateOpen(0)).toBe(false);
    expect(alignmentGateOpen(60)).toBe(false);
    expect(alignmentGateOpen(150)).toBe(false);
  });

  it("opens well before the song ends so the player has a window", () => {
    const window = LAST_WORDS_FULL_DURATION_S - ALIGNMENT_GATE_OPEN_S;
    expect(window).toBeGreaterThanOrEqual(20);
  });
});

describe("act1CycleCWitnessing — alignment choices", () => {
  it("exposes 'light', 'dark', and 'balanced' ids", () => {
    expect(ALIGNMENT_CHOICES.map((c) => c.id).sort()).toEqual([
      "balanced",
      "dark",
      "light",
    ]);
  });

  it("each choice raises the canonical act1_cycle_c_alignment_<id> flag", () => {
    for (const c of ALIGNMENT_CHOICES) {
      expect(c.flag).toBe(`act1_cycle_c_alignment_${c.id}`);
    }
  });

  it("each choice has a non-trivial blurb", () => {
    for (const c of ALIGNMENT_CHOICES) {
      expect(c.blurb.length).toBeGreaterThan(20);
    }
  });
});

describe("Act1CycleCAuthorityWitnessing — component wiring", () => {
  const SRC = fs.readFileSync(
    path.resolve(__dirname, "Act1CycleCAuthorityWitnessing.tsx"),
    "utf-8",
  );

  it("commits the alignment via setLightDarkAlignment on pick", () => {
    expect(SRC).toContain("setLightDarkAlignment(alignment)");
  });

  it("raises act_1_cycle_c_complete whenever the sequence resolves", () => {
    expect(SRC).toContain('"act_1_cycle_c_complete"');
  });

  it("defaults to 'light' if the song ends without a pick", () => {
    expect(SRC).toContain('commit("light", true)');
  });

  it("pauses audio on commit so the confirmation card can land", () => {
    expect(SRC).toContain("audioRef.current.pause()");
  });
});
