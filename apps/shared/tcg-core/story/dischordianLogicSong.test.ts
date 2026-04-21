import { describe, it, expect } from "vitest";
import {
  DISCHORDIAN_LOGIC_SLIDES,
  DISCHORDIAN_LOGIC_LYRICS,
  SONG_DURATION_SECONDS,
  SONG_SLIDES_PER_MINUTE,
  slideAt,
  totalSlides,
  averageSlideDurationSec,
} from "./dischordianLogicSong";

describe("dischordianLogicSong — slide timing", () => {
  it("matches the 5-slides-per-minute spec (±1)", () => {
    const expected = Math.round(
      (SONG_DURATION_SECONDS / 60) * SONG_SLIDES_PER_MINUTE,
    );
    expect(Math.abs(totalSlides() - expected)).toBeLessThanOrEqual(1);
  });

  it("has exactly 15 slides for the 2:55 song", () => {
    expect(DISCHORDIAN_LOGIC_SLIDES).toHaveLength(15);
  });

  it("slides are contiguous and cover the full duration", () => {
    let cursor = 0;
    for (const s of DISCHORDIAN_LOGIC_SLIDES) {
      expect(s.startSec, `slide ${s.n} should start at ${cursor}`).toBe(cursor);
      expect(s.endSec).toBeGreaterThan(s.startSec);
      cursor = s.endSec;
    }
    expect(cursor).toBe(SONG_DURATION_SECONDS);
  });

  it("numbers slides 1..15 in order", () => {
    DISCHORDIAN_LOGIC_SLIDES.forEach((s, i) => {
      expect(s.n).toBe(i + 1);
    });
  });

  it("every slide has a caption, art direction, palette, and motion", () => {
    for (const s of DISCHORDIAN_LOGIC_SLIDES) {
      expect(s.caption.length).toBeGreaterThan(0);
      expect(s.artDirection.length).toBeGreaterThan(30);
      expect(s.paletteAccent.length).toBeGreaterThan(0);
      expect(s.motion.length).toBeGreaterThan(0);
    }
  });

  it("average slide duration is close to the 5-per-minute target", () => {
    // 5 per minute = 12 seconds per slide.
    expect(averageSlideDurationSec()).toBeGreaterThanOrEqual(10);
    expect(averageSlideDurationSec()).toBeLessThanOrEqual(14);
  });
});

describe("dischordianLogicSong.slideAt", () => {
  it("returns slide 1 at the song start", () => {
    expect(slideAt(0).n).toBe(1);
  });

  it("returns the final slide at song end", () => {
    expect(slideAt(SONG_DURATION_SECONDS - 0.1).n).toBe(15);
  });

  it("returns the expected slide at a mid-song timestamp", () => {
    // 60 seconds in = slide 6 (chorus 1 start).
    expect(slideAt(60).n).toBe(6);
  });

  it("is monotonic across the song", () => {
    let lastN = 0;
    for (let t = 0; t < SONG_DURATION_SECONDS; t += 5) {
      const s = slideAt(t);
      expect(s.n).toBeGreaterThanOrEqual(lastN);
      lastN = s.n;
    }
  });
});

describe("dischordianLogicSong — lyrics", () => {
  it("includes the title phrase", () => {
    expect(DISCHORDIAN_LOGIC_LYRICS).toContain("Dischordian logic");
  });

  it("includes the Hail Eris invocation", () => {
    expect(DISCHORDIAN_LOGIC_LYRICS).toContain("Hail Eris");
  });

  it("includes the Bavarian Illuminati bridge reference", () => {
    expect(DISCHORDIAN_LOGIC_LYRICS).toContain("Bavarian Illuminati");
  });
});
