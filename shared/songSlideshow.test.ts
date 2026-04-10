import { describe, it, expect } from "vitest";
import {
  SLIDESHOW_REGISTRY,
  canSkip,
  getActiveFrame,
  getActiveNarratorReaction,
  getActiveOverlay,
  getVisibleLyrics,
  isCompleted,
  type SongSlideshow,
} from "./songSlideshow";

function fixture(overrides: Partial<SongSlideshow> = {}): SongSlideshow {
  return {
    id: "test",
    songId: "test-song",
    audioUrl: "https://example.invalid/test.mp3",
    durationMs: 10_000,
    title: "Test",
    frames: [
      { startMs: 0, endMs: 3000, imageUrl: "/a.png", transition: "fade" },
      { startMs: 3000, endMs: 6000, imageUrl: "/b.png", transition: "dissolve" },
      { startMs: 6000, endMs: 10_000, imageUrl: "/c.png", transition: "hardcut" },
    ],
    lyrics: [
      { startMs: 1000, endMs: 2500, text: "first", emphasis: "normal" },
      { startMs: 3500, endMs: 5000, text: "SECOND", emphasis: "shout" },
    ],
    overlays: [
      { kind: "chapter", startMs: 0, endMs: 2000, text: "CHAPTER ONE" },
    ],
    narratorReactions: [
      {
        narrator: "elara",
        lines: [
          { startMs: 500, endMs: 1500, text: "I'm here." },
        ],
      },
    ],
    reducedMotionFallback: {
      imageUrl: "/static.png",
      summary: ["A test."],
      alt: "Static test image",
    },
    priority: "P0",
    actGate: "act1",
    ...overrides,
  };
}

describe("songSlideshow — frame selection", () => {
  it("returns the last frame whose start is <= timeMs", () => {
    const s = fixture();
    expect(getActiveFrame(s, 0)?.imageUrl).toBe("/a.png");
    expect(getActiveFrame(s, 2999)?.imageUrl).toBe("/a.png");
    expect(getActiveFrame(s, 3000)?.imageUrl).toBe("/b.png");
    expect(getActiveFrame(s, 7000)?.imageUrl).toBe("/c.png");
  });

  it("returns null for a slideshow with no frames", () => {
    const s = fixture({ frames: [] });
    expect(getActiveFrame(s, 0)).toBeNull();
  });
});

describe("songSlideshow — lyrics, overlays, reactions", () => {
  it("surfaces only the lyrics visible at the current time", () => {
    const s = fixture();
    expect(getVisibleLyrics(s, 1200).map(l => l.text)).toEqual(["first"]);
    expect(getVisibleLyrics(s, 4000).map(l => l.text)).toEqual(["SECOND"]);
    expect(getVisibleLyrics(s, 9000)).toHaveLength(0);
  });

  it("returns the active overlay window", () => {
    const s = fixture();
    expect(getActiveOverlay(s, 1000)?.text).toBe("CHAPTER ONE");
    expect(getActiveOverlay(s, 5000)).toBeNull();
  });

  it("returns the active narrator reaction", () => {
    const s = fixture();
    const reaction = getActiveNarratorReaction(s, 1000);
    expect(reaction?.narrator).toBe("elara");
    expect(reaction?.line.text).toBe("I'm here.");
    expect(getActiveNarratorReaction(s, 6000)).toBeNull();
  });
});

describe("songSlideshow — skip and completion thresholds", () => {
  it("allows skip after 15% of duration", () => {
    const s = fixture();
    expect(canSkip(s, 1000)).toBe(false);
    expect(canSkip(s, 1500)).toBe(true);
  });

  it("marks completion at 85% duration", () => {
    const s = fixture();
    expect(isCompleted(s, 8400)).toBe(false);
    expect(isCompleted(s, 8500)).toBe(true);
  });
});

describe("songSlideshow — registry", () => {
  it("contains the P0 Witnessing slideshows", () => {
    const ids = SLIDESHOW_REGISTRY.map(s => s.id);
    expect(ids).toContain("last-words");
    expect(ids).toContain("welcome-to-celebration");
    expect(ids).toContain("the-prisoner");
    expect(ids).toContain("the-lion-in-black");
  });

  it("contains the Galactic Dance cinematics", () => {
    const ids = SLIDESHOW_REGISTRY.map(s => s.id);
    expect(ids).toContain("voltari-word-in-the-storm");
    expect(ids).toContain("voltari-awake-remember-before-you");
    expect(ids).toContain("council-of-survivors");
    expect(ids).toContain("the-long-mourning");
    expect(ids).toContain("seventeen-thousand");
  });

  it("every registry entry has a priority and act gate", () => {
    for (const entry of SLIDESHOW_REGISTRY) {
      expect(entry.priority).toMatch(/^P[012]$/);
      expect(entry.actGate).toMatch(/^(prelude|act1|act2|act3|act4|act4\.5|act5)$/);
    }
  });
});
