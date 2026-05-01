/**
 * Pure-function tests for the Dreamer-vision catalog. Service-side
 * integration (DB-backed nextPendingVision flow + markVisionReceived
 * persistence) has its own no-DB-safety tests in
 * apps/server/services/dreamerAwareness.test.ts.
 */
import { describe, it, expect } from "vitest";
import {
  DREAMER_VISIONS,
  getVisionForThreshold,
  getVisionById,
  nextPendingVision,
} from "./dreamerVisions";

describe("DREAMER_VISIONS catalog", () => {
  it("ships at least Vision 1", () => {
    expect(DREAMER_VISIONS.length).toBeGreaterThanOrEqual(1);
  });

  it("Vision 1 has the expected shape and threshold", () => {
    const v1 = DREAMER_VISIONS[0];
    expect(v1.id).toBe("vision_first_notice");
    expect(v1.threshold).toBe(3);
    expect(v1.title).toBe("The First Notice");
  });

  it("Vision 1 slideshow has 8 frames each ~14 seconds long", () => {
    const v1 = DREAMER_VISIONS[0];
    expect(v1.slideshow.frames).toHaveLength(8);
    expect(v1.slideshow.durationMs).toBe(112_000);
    for (const f of v1.slideshow.frames) {
      expect(f.endMs - f.startMs).toBe(14_000);
    }
  });

  it("Vision 1 frames carry the canonical caption set in plan order", () => {
    const v1 = DREAMER_VISIONS[0];
    const captions = v1.slideshow.frames.map((f) => f.caption);
    expect(captions).toEqual([
      "the first notice is not a noise",
      "count your hands when you wake",
      "the gate was not where you thought",
      "someone has been keeping the score",
      "they sat with you for years",
      "and you never asked their name",
      "the window was always lit",
      "you have been seen",
    ]);
  });

  it("Vision 1 frames hardcut between every beat (no fade — visions feel like glitches)", () => {
    const v1 = DREAMER_VISIONS[0];
    for (const f of v1.slideshow.frames) {
      expect(f.transition).toBe("hardcut");
    }
  });

  it("Vision 1 audio anchors against Album 1 T03 audio convention", () => {
    const v1 = DREAMER_VISIONS[0];
    expect(v1.slideshow.audioUrl).toContain("audio/album1/T03.mp3");
  });

  it("each vision's slideshow id matches the vision id (so markVisionReceived can dedupe)", () => {
    for (const v of DREAMER_VISIONS) {
      expect(v.slideshow.id).toBe(v.id);
    }
  });
});

describe("getVisionForThreshold", () => {
  it("returns the threshold-3 vision for value 3", () => {
    const v = getVisionForThreshold(3);
    expect(v?.id).toBe("vision_first_notice");
  });

  it("returns undefined for not-yet-built thresholds (7, 13, 23) — visions await Albums 2-5 on CDN", () => {
    expect(getVisionForThreshold(7)).toBeUndefined();
    expect(getVisionForThreshold(13)).toBeUndefined();
    expect(getVisionForThreshold(23)).toBeUndefined();
  });

  it("returns undefined for non-Discordian thresholds", () => {
    expect(getVisionForThreshold(1)).toBeUndefined();
    expect(getVisionForThreshold(5)).toBeUndefined();
    expect(getVisionForThreshold(0)).toBeUndefined();
    expect(getVisionForThreshold(100)).toBeUndefined();
  });
});

describe("getVisionById", () => {
  it("returns Vision 1 by canonical id", () => {
    expect(getVisionById("vision_first_notice")?.threshold).toBe(3);
  });

  it("returns undefined for unknown ids — guards markVisionReceived against arbitrary writes", () => {
    expect(getVisionById("not_a_vision")).toBeUndefined();
    expect(getVisionById("")).toBeUndefined();
  });
});

describe("nextPendingVision", () => {
  it("returns Vision 1 when count >= 3 and nothing has been received", () => {
    const v = nextPendingVision(3, []);
    expect(v?.id).toBe("vision_first_notice");
  });

  it("returns undefined when count < 3", () => {
    expect(nextPendingVision(0, [])).toBeUndefined();
    expect(nextPendingVision(2, [])).toBeUndefined();
  });

  it("returns undefined when Vision 1 has already been received", () => {
    expect(nextPendingVision(3, ["vision_first_notice"])).toBeUndefined();
    expect(nextPendingVision(50, ["vision_first_notice"])).toBeUndefined();
  });

  it("ignores unknown received-ids gracefully", () => {
    const v = nextPendingVision(5, ["not_a_vision"]);
    expect(v?.id).toBe("vision_first_notice");
  });

  it("returns the LOWEST pending threshold first (multiple-pending case will arrive when visions 2-4 ship)", () => {
    // With only Vision 1 in the catalog this is currently a one-vision
    // assertion. The contract is documented so the test's intent
    // survives when visions 2-4 land — replace the expectation with
    // the explicit ordered chain at that point.
    const v = nextPendingVision(100, []);
    expect(v?.id).toBe("vision_first_notice");
  });
});
