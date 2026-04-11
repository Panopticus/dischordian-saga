/* ═══════════════════════════════════════════════════════
   Post-Victory Cinematics — registry invariants
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  POST_VICTORY_CINEMATICS,
  POST_VICTORY_CINEMATIC_BY_CHAPTER,
  cinematicTotalDuration,
  getPostVictoryCinematic,
} from "../client/src/game/postVictoryCinematics";

describe("Post-Victory Cinematics — coverage", () => {
  it("should have a cinematic for every current story chapter id", () => {
    // These are the chapter ids shipped in storyModeChapters.ts + the
    // ch4-12 block planned for Task 1. Cinematics can land ahead of
    // the dialogue content.
    const requiredChapterIds = [
      "ch1_dead_signal",
      "ch2_arenas_law",
      "ch3a_generals_honor",
      "ch3b_the_ghost",
      "ch4_red_death",
      "ch5_dead_code_rising",
      "ch6_false_prophet",
      "ch7_project_vector",
      "ch8_detective",
      "ch9a_unknown_variable",
      "ch9b_gamblers_truth",
      "ch10_panoptic_warden",
      "ch11_harvester_reckoning",
      "ch12_architects_design",
    ];

    const shippedIds = new Set(POST_VICTORY_CINEMATICS.map(c => c.chapterId));
    for (const id of requiredChapterIds) {
      expect(shippedIds.has(id), `missing cinematic for ${id}`).toBe(true);
    }
  });

  it("should have at least 14 cinematics", () => {
    expect(POST_VICTORY_CINEMATICS.length).toBeGreaterThanOrEqual(14);
  });

  it("POST_VICTORY_CINEMATIC_BY_CHAPTER matches the array length", () => {
    expect(Object.keys(POST_VICTORY_CINEMATIC_BY_CHAPTER).length).toBe(
      POST_VICTORY_CINEMATICS.length,
    );
  });
});

describe("Post-Victory Cinematics — schema invariants", () => {
  it("every cinematic should have a non-empty chapterId and title", () => {
    for (const c of POST_VICTORY_CINEMATICS) {
      expect(c.chapterId, "empty chapterId").toBeTruthy();
      expect(c.title, `${c.chapterId} empty title`).toBeTruthy();
    }
  });

  it("chapter ids should be unique across the registry", () => {
    const ids = POST_VICTORY_CINEMATICS.map(c => c.chapterId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every cinematic should have at least 2 beats", () => {
    for (const c of POST_VICTORY_CINEMATICS) {
      expect(c.beats.length, `${c.chapterId} too few beats`).toBeGreaterThanOrEqual(2);
    }
  });

  it("every beat should have a non-empty label and positive duration", () => {
    for (const c of POST_VICTORY_CINEMATICS) {
      for (const beat of c.beats) {
        expect(beat.label, `${c.chapterId} beat label`).toBeTruthy();
        expect(beat.durationMs, `${c.chapterId} beat duration`).toBeGreaterThan(0);
      }
    }
  });

  it("every dialogue line should have a non-empty speaker and text", () => {
    for (const c of POST_VICTORY_CINEMATICS) {
      for (const beat of c.beats) {
        if (beat.dialogue) {
          expect(beat.dialogue.speaker, `${c.chapterId}/${beat.label} speaker`).toBeTruthy();
          expect(beat.dialogue.text, `${c.chapterId}/${beat.label} text`).toBeTruthy();
        }
      }
    }
  });

  it("CH5 is marked as playOnDefeat (mandatory-loss chapter)", () => {
    const ch5 = getPostVictoryCinematic("ch5_dead_code_rising");
    expect(ch5).not.toBeNull();
    expect(ch5!.playOnDefeat).toBe(true);
  });

  it("non-ch5 cinematics are not playOnDefeat by default", () => {
    const nonCh5 = POST_VICTORY_CINEMATICS.filter(c => c.chapterId !== "ch5_dead_code_rising");
    for (const c of nonCh5) {
      expect(c.playOnDefeat, `${c.chapterId} should not be playOnDefeat`).toBe(false);
    }
  });
});

describe("Post-Victory Cinematics — runtime helpers", () => {
  it("cinematicTotalDuration sums all beats", () => {
    for (const c of POST_VICTORY_CINEMATICS) {
      const total = cinematicTotalDuration(c);
      const manual = c.beats.reduce((s, b) => s + b.durationMs, 0);
      expect(total).toBe(manual);
      expect(total).toBeGreaterThan(0);
    }
  });

  it("total runtime should be in a reasonable range (1s..20s)", () => {
    for (const c of POST_VICTORY_CINEMATICS) {
      const total = cinematicTotalDuration(c);
      expect(total, `${c.chapterId} too short`).toBeGreaterThanOrEqual(1000);
      expect(total, `${c.chapterId} too long`).toBeLessThanOrEqual(30000);
    }
  });

  it("getPostVictoryCinematic returns null for unknown chapter id", () => {
    expect(getPostVictoryCinematic("__nope__")).toBeNull();
  });

  it("getPostVictoryCinematic returns the cinematic for a known chapter", () => {
    const c = getPostVictoryCinematic("ch12_architects_design");
    expect(c).not.toBeNull();
    expect(c!.chapterId).toBe("ch12_architects_design");
    expect(c!.beats.length).toBeGreaterThan(0);
  });
});
