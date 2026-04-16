import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  CHOICE_PILLAR_REVEAL_S,
  LAST_WORDS_SONG_DURATION_S,
  LAST_WORDS_SONG_URL,
  SKIP_UNLOCK_S,
  SLIDE_TIMELINE,
  canSkipAt,
  showChoiceAt,
  slideAtTime,
  slideImageUrl,
} from "../client/src/components/prelude/lastWordsTimeline";

/* ═══════════════════════════════════════════════════════
   LAST WORDS TIMELINE TESTS

   Structural + disk-presence checks for the Beat J
   Witnessing sequence. Verifies the slide timing is
   monotonic + covers the whole song + all 20 slide
   images exist on disk + the song MP3 exists.
   ═══════════════════════════════════════════════════════ */

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function publicUrlToRepoPath(url: string): string {
  // "/audio/music/x.mp3" → "apps/client/public/audio/music/x.mp3"
  return `apps/client/public${url}`;
}

describe("Last Words timeline — structural", () => {
  it("has exactly 20 slide anchors", () => {
    expect(SLIDE_TIMELINE).toHaveLength(20);
  });

  it("covers 4 sections of 5 slides each", () => {
    const counts = new Map<number, number>();
    for (const a of SLIDE_TIMELINE) {
      counts.set(a.section, (counts.get(a.section) ?? 0) + 1);
    }
    expect([...counts.entries()].sort()).toEqual([
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
    ]);
  });

  it("slide startS values are strictly monotonic", () => {
    for (let i = 1; i < SLIDE_TIMELINE.length; i++) {
      expect(SLIDE_TIMELINE[i].startS).toBeGreaterThan(
        SLIDE_TIMELINE[i - 1].startS,
      );
    }
  });

  it("first slide starts at 0", () => {
    expect(SLIDE_TIMELINE[0].startS).toBe(0);
  });

  it("last slide starts before song ends", () => {
    const last = SLIDE_TIMELINE[SLIDE_TIMELINE.length - 1];
    expect(last.startS).toBeLessThan(LAST_WORDS_SONG_DURATION_S);
  });

  it("choice pillar reveals after song starts but before it ends", () => {
    expect(CHOICE_PILLAR_REVEAL_S).toBeGreaterThan(0);
    expect(CHOICE_PILLAR_REVEAL_S).toBeLessThan(LAST_WORDS_SONG_DURATION_S);
  });

  it("skip unlocks at or after choice reveal (can't skip before choosing)", () => {
    expect(SKIP_UNLOCK_S).toBeGreaterThanOrEqual(CHOICE_PILLAR_REVEAL_S);
  });

  it("song duration is in the expected 3:30-4:00 range", () => {
    expect(LAST_WORDS_SONG_DURATION_S).toBeGreaterThan(210);
    expect(LAST_WORDS_SONG_DURATION_S).toBeLessThan(240);
  });
});

describe("Last Words timeline — lookup helpers", () => {
  it("slideAtTime returns first slide at time 0", () => {
    const slide = slideAtTime(0);
    expect(slide.section).toBe(1);
    expect(slide.slide).toBe(1);
  });

  it("slideAtTime returns last slide at song end", () => {
    const slide = slideAtTime(LAST_WORDS_SONG_DURATION_S);
    expect(slide.section).toBe(4);
    expect(slide.slide).toBe(5);
  });

  it("slideAtTime returns the anchor whose startS is the last <= currentTime", () => {
    // First-chorus sync at 66s should hit section 2, slide 2
    const slide = slideAtTime(66);
    expect(slide.section).toBe(2);
    expect(slide.slide).toBe(2);
  });

  it("canSkipAt respects the skip unlock threshold", () => {
    expect(canSkipAt(SKIP_UNLOCK_S - 1)).toBe(false);
    expect(canSkipAt(SKIP_UNLOCK_S)).toBe(true);
    expect(canSkipAt(SKIP_UNLOCK_S + 1)).toBe(true);
  });

  it("showChoiceAt respects the choice reveal threshold", () => {
    expect(showChoiceAt(CHOICE_PILLAR_REVEAL_S - 1)).toBe(false);
    expect(showChoiceAt(CHOICE_PILLAR_REVEAL_S)).toBe(true);
  });

  it("slideImageUrl produces a public URL matching the on-disk file pattern", () => {
    expect(slideImageUrl(3, 4)).toBe("/art/prelude/last-words/slide-3-4.webp");
  });
});

describe("Last Words timeline — disk presence", () => {
  it("song mp3 exists at the manifest path", () => {
    const p = publicUrlToRepoPath(LAST_WORDS_SONG_URL);
    expect(fs.existsSync(path.resolve(REPO_ROOT, p))).toBe(true);
  });

  it("all 20 slide images exist on disk", () => {
    const missing: string[] = [];
    for (const anchor of SLIDE_TIMELINE) {
      const url = slideImageUrl(anchor.section, anchor.slide);
      const p = publicUrlToRepoPath(url);
      if (!fs.existsSync(path.resolve(REPO_ROOT, p))) {
        missing.push(p);
      }
    }
    if (missing.length > 0) {
      expect.fail(`Missing slides:\n  ${missing.join("\n  ")}`);
    }
  });
});
