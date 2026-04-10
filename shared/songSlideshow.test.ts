import { describe, it, expect } from "vitest";
import {
  getActiveOverlays,
  getFrameAt,
  getLyricAt,
  validateSlideshow,
  type SongSlideshowDef,
} from "./songSlideshow";
import {
  getSlideshow,
  LAST_WORDS_SLIDESHOW,
  listSlideshows,
  SONG_SLIDESHOWS,
} from "./songSlideshows";

function makeMinimalSlideshow(overrides: Partial<SongSlideshowDef> = {}): SongSlideshowDef {
  return {
    id: "t",
    songId: "t",
    audioUrl: "/a",
    durationMs: 4000,
    title: "T",
    priority: "P0",
    frames: [
      { startMs: 0, endMs: 2000, imageUrl: "/f1", transition: "fade" },
      { startMs: 2000, endMs: 4000, imageUrl: "/f2", transition: "fade" },
    ],
    reducedMotionFallback: {
      heroImageUrl: "/hero",
      prose: "summary",
    },
    ...overrides,
  };
}

describe("songSlideshow validation", () => {
  it("passes a minimal two-frame slideshow", () => {
    expect(validateSlideshow(makeMinimalSlideshow())).toEqual([]);
  });

  it("catches empty frames", () => {
    const issues = validateSlideshow(makeMinimalSlideshow({ frames: [] }));
    expect(issues.some((i) => i.kind === "empty_frames")).toBe(true);
  });

  it("catches frames with endMs <= startMs", () => {
    const def = makeMinimalSlideshow({
      frames: [{ startMs: 0, endMs: 0, imageUrl: "/a", transition: "fade" }],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "frame_ordering")).toBe(true);
  });

  it("catches frames that overlap", () => {
    const def = makeMinimalSlideshow({
      frames: [
        { startMs: 0, endMs: 3000, imageUrl: "/a", transition: "fade" },
        { startMs: 1000, endMs: 4000, imageUrl: "/b", transition: "fade" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "frame_ordering")).toBe(true);
  });

  it("catches gaps larger than 250ms", () => {
    const def = makeMinimalSlideshow({
      frames: [
        { startMs: 0, endMs: 1000, imageUrl: "/a", transition: "fade" },
        { startMs: 2000, endMs: 4000, imageUrl: "/b", transition: "fade" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "frame_gap")).toBe(true);
  });

  it("catches lyrics out of order", () => {
    const def = makeMinimalSlideshow({
      lyrics: [
        { startMs: 1000, endMs: 2000, text: "b" },
        { startMs: 500, endMs: 1500, text: "a" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "lyric_ordering")).toBe(true);
  });

  it("catches bad ken-burns scales", () => {
    const def = makeMinimalSlideshow({
      frames: [
        {
          startMs: 0,
          endMs: 2000,
          imageUrl: "/a",
          transition: "fade",
          kenBurns: {
            startScale: 0,
            endScale: -1,
            startPan: [0, 0],
            endPan: [0, 0],
          },
        },
        { startMs: 2000, endMs: 4000, imageUrl: "/b", transition: "fade" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "ken_burns_scale")).toBe(true);
  });

  it("catches duration mismatch", () => {
    const def = makeMinimalSlideshow({ durationMs: 99_000 });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "duration_mismatch")).toBe(true);
  });
});

describe("songSlideshow lookup helpers", () => {
  const def = makeMinimalSlideshow({
    lyrics: [
      { startMs: 0, endMs: 1500, text: "first" },
      { startMs: 1500, endMs: 3000, text: "second" },
    ],
    overlays: [
      { type: "vignette", startMs: 0, endMs: 4000, intensity: 0.5 },
      { type: "grain", startMs: 1000, endMs: 2000, intensity: 0.2 },
    ],
  });

  it("getFrameAt returns the right frame at each boundary", () => {
    expect(getFrameAt(def, 0)?.imageUrl).toBe("/f1");
    expect(getFrameAt(def, 1999)?.imageUrl).toBe("/f1");
    expect(getFrameAt(def, 2000)?.imageUrl).toBe("/f2");
    expect(getFrameAt(def, 3999)?.imageUrl).toBe("/f2");
    expect(getFrameAt(def, 4000)).toBeNull();
  });

  it("getLyricAt tracks the active line", () => {
    expect(getLyricAt(def, 0)?.text).toBe("first");
    expect(getLyricAt(def, 1499)?.text).toBe("first");
    expect(getLyricAt(def, 1500)?.text).toBe("second");
    expect(getLyricAt(def, 4000)).toBeNull();
  });

  it("getActiveOverlays returns overlapping overlays", () => {
    const overlays = getActiveOverlays(def, 1500);
    expect(overlays.map((o) => o.type).sort()).toEqual(["grain", "vignette"]);
  });
});

describe("songSlideshows registry", () => {
  it("registry includes Last Words as P0", () => {
    expect(getSlideshow("last-words")).toBeDefined();
    expect(LAST_WORDS_SLIDESHOW.priority).toBe("P0");
  });

  it("Last Words slideshow validates cleanly", () => {
    const issues = validateSlideshow(LAST_WORDS_SLIDESHOW);
    expect(issues).toEqual([]);
  });

  it("Last Words is 15 frames at 14s each", () => {
    expect(LAST_WORDS_SLIDESHOW.frames.length).toBe(15);
    expect(LAST_WORDS_SLIDESHOW.durationMs).toBe(15 * 14_000);
  });

  it("Last Words sets the expected completion flags", () => {
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).toContain(
      "slideshow_last_words_complete",
    );
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).toContain(
      "antiquarian_voice_first_heard",
    );
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).toContain(
      "engineer_execution_seen",
    );
  });

  it("Last Words does NOT set act_1_complete itself (the caller sets it)", () => {
    // The slideshow is TRIGGERED by act_1_complete already being true.
    // If it set the flag itself we'd have a causal loop.
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).not.toContain("act_1_complete");
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).not.toContain("act1_complete");
  });

  it("Last Words unlocks the Prince of Celebration entry", () => {
    expect(LAST_WORDS_SLIDESHOW.unlockLoredexEntry).toBe("the-prince-of-celebration");
  });

  it("Last Words rewards +500 community light energy", () => {
    expect(LAST_WORDS_SLIDESHOW.lightEnergyReward).toBe(500);
  });

  it("every registered slideshow validates cleanly", () => {
    for (const def of Object.values(SONG_SLIDESHOWS)) {
      expect(validateSlideshow(def)).toEqual([]);
    }
  });

  it("listSlideshows sorts by priority", () => {
    const list = listSlideshows();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].priority).toBe("P0");
  });
});
