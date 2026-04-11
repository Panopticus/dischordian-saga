import { describe, it, expect, beforeEach } from "vitest";
import {
  getDynamicLionFrames,
  LION_FEED_SLOTS,
  makeMemorableMoment,
  makeMomentId,
  type MemorableMoment,
} from "./memorableMoments";
import { THE_LION_IN_BLACK_SLIDESHOW } from "./songSlideshows";

describe("memorableMoments — constructors", () => {
  it("makeMomentId produces unique ids within a process", () => {
    const a = makeMomentId("card_battle_win");
    const b = makeMomentId("card_battle_win");
    const c = makeMomentId("card_battle_win");
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
    expect(a).not.toBe(c);
  });

  it("makeMemorableMoment captures kind, subtitle, and timestamp", () => {
    const moment = makeMemorableMoment("card_battle_win", "A beautiful win");
    expect(moment.kind).toBe("card_battle_win");
    expect(moment.subtitle).toBe("A beautiful win");
    expect(moment.capturedAt).toBeGreaterThan(0);
    expect(moment.id).toContain("card_battle_win");
  });

  it("makeMemorableMoment accepts optional imageUrl and metadata", () => {
    const moment = makeMemorableMoment(
      "sector_reclaimed",
      "Kepler-22b came back online",
      "/assets/moments/kepler.webp",
      { sectorId: "kepler-22b" },
    );
    expect(moment.imageUrl).toBe("/assets/moments/kepler.webp");
    expect(moment.metadata).toEqual({ sectorId: "kepler-22b" });
  });
});

describe("memorableMoments.LION_FEED_SLOTS", () => {
  it("targets exactly the nine dynamic frame slots of The Lion in Black", () => {
    // Frames 0 (opener), 10, 11 are fixed. Slots cover 1-9.
    expect(LION_FEED_SLOTS.length).toBe(9);
    const indices = LION_FEED_SLOTS.map((s) => s.frameIndex).sort((a, b) => a - b);
    expect(indices).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("every slot has a fallback subtitle", () => {
    for (const slot of LION_FEED_SLOTS) {
      expect(slot.fallbackSubtitle.length).toBeGreaterThan(0);
    }
  });

  it("every slot has at least one preferred kind", () => {
    for (const slot of LION_FEED_SLOTS) {
      expect(slot.preferredKinds.length).toBeGreaterThan(0);
    }
  });
});

describe("memorableMoments.getDynamicLionFrames", () => {
  it("returns a clone, not the original", () => {
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, []);
    expect(cloned).not.toBe(THE_LION_IN_BLACK_SLIDESHOW);
    expect(cloned.frames).not.toBe(THE_LION_IN_BLACK_SLIDESHOW.frames);
    expect(cloned.id).toBe(THE_LION_IN_BLACK_SLIDESHOW.id);
  });

  it("preserves the fixed frames (0, 10, 11)", () => {
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, []);
    expect(cloned.frames[0].caption).toBe(
      THE_LION_IN_BLACK_SLIDESHOW.frames[0].caption,
    );
    expect(cloned.frames[10].caption).toBe(
      THE_LION_IN_BLACK_SLIDESHOW.frames[10].caption,
    );
    expect(cloned.frames[11].caption).toBe(
      THE_LION_IN_BLACK_SLIDESHOW.frames[11].caption,
    );
  });

  it("falls back to canonical placeholders when there are no moments", () => {
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, []);
    for (const slot of LION_FEED_SLOTS) {
      expect(cloned.frames[slot.frameIndex].caption).toBe(slot.fallbackSubtitle);
    }
  });

  it("substitutes a moment into its matching slot", () => {
    const moment: MemorableMoment = {
      id: "test_1",
      kind: "sector_reclaimed",
      subtitle: "Kepler-22b woke up at dawn.",
      capturedAt: Date.now(),
    };
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, [moment]);
    // Slot 1 (frame index 1) prefers sector_reclaimed.
    expect(cloned.frames[1].caption).toBe("Kepler-22b woke up at dawn.");
  });

  it("uses each moment at most once across the feed", () => {
    const now = Date.now();
    const moments: MemorableMoment[] = [
      {
        id: "m1",
        kind: "slideshow_watched",
        subtitle: "FIRST",
        capturedAt: now,
      },
      {
        id: "m2",
        kind: "slideshow_watched",
        subtitle: "SECOND",
        capturedAt: now - 1000,
      },
      {
        id: "m3",
        kind: "slideshow_watched",
        subtitle: "THIRD",
        capturedAt: now - 2000,
      },
    ];
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, moments);
    // Slots 4, 7, and 8 prefer slideshow_watched — each should
    // consume a different moment, newest first.
    const captions = [
      cloned.frames[4].caption,
      cloned.frames[7].caption,
      cloned.frames[8].caption,
    ];
    expect(captions).toContain("FIRST");
    expect(captions).toContain("SECOND");
    expect(captions).toContain("THIRD");
    // Each moment used once.
    expect(new Set(captions).size).toBe(3);
  });

  it("picks the newest moment first when multiple match", () => {
    const now = Date.now();
    const moments: MemorableMoment[] = [
      {
        id: "older",
        kind: "companion_argument",
        subtitle: "Older argument",
        capturedAt: now - 10_000,
      },
      {
        id: "newer",
        kind: "companion_argument",
        subtitle: "Newer argument",
        capturedAt: now,
      },
    ];
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, moments);
    // Slot 2 prefers companion_argument. Newer wins.
    expect(cloned.frames[2].caption).toBe("Newer argument");
  });

  it("substitutes the imageUrl when the moment provides one", () => {
    const moment: MemorableMoment = {
      id: "with_art",
      kind: "sector_reclaimed",
      subtitle: "Art moment",
      imageUrl: "/assets/custom/kepler.webp",
      capturedAt: Date.now(),
    };
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, [moment]);
    expect(cloned.frames[1].imageUrl).toBe("/assets/custom/kepler.webp");
  });

  it("non-matching moment kinds fall back to placeholders", () => {
    const moments: MemorableMoment[] = [
      {
        id: "unusable",
        kind: "card_battle_win",
        subtitle: "This won't fit the sector slot",
        capturedAt: Date.now(),
      },
    ];
    const cloned = getDynamicLionFrames(THE_LION_IN_BLACK_SLIDESHOW, moments);
    // Slot 1 prefers sector_reclaimed — no match, fallback.
    expect(cloned.frames[1].caption).toBe("A sector you reclaimed.");
    // Slot 3 prefers card_battle_comeback / card_battle_win — match.
    expect(cloned.frames[3].caption).toBe(
      "This won't fit the sector slot",
    );
  });
});
