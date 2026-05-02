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
  it("ships Visions 1, 2, and 3", () => {
    expect(DREAMER_VISIONS.length).toBeGreaterThanOrEqual(3);
  });

  it("Vision 1 has the expected shape and threshold", () => {
    const v1 = DREAMER_VISIONS[0];
    expect(v1.id).toBe("vision_first_notice");
    expect(v1.threshold).toBe(3);
    expect(v1.title).toBe("The First Notice");
  });

  it("Vision 2 has the expected shape and threshold", () => {
    const v2 = DREAMER_VISIONS[1];
    expect(v2.id).toBe("vision_coin_without_face");
    expect(v2.threshold).toBe(7);
    expect(v2.title).toBe("The Coin Without a Face");
  });

  it("Vision 2 slideshow has 10 frames each ~14 seconds long", () => {
    const v2 = DREAMER_VISIONS[1];
    expect(v2.slideshow.frames).toHaveLength(10);
    expect(v2.slideshow.durationMs).toBe(140_000);
    for (const f of v2.slideshow.frames) {
      expect(f.endMs - f.startMs).toBe(14_000);
    }
  });

  it("Vision 2 frames carry the canonical caption set in plan order", () => {
    const v2 = DREAMER_VISIONS[1];
    const captions = v2.slideshow.frames.map((f) => f.caption);
    expect(captions).toEqual([
      "a coin without a face",
      "spent for nothing you remember",
      "she keeps a ledger you cannot read",
      "and her mirror keeps no faces",
      "every door is the door",
      "every name is the name",
      "the noon is wrong",
      "the cup is wrong",
      "only you are correct",
      "the ledger does not say so",
    ]);
  });

  it("Vision 2 frames hardcut between every beat (visions feel like glitches)", () => {
    const v2 = DREAMER_VISIONS[1];
    for (const f of v2.slideshow.frames) {
      expect(f.transition).toBe("hardcut");
    }
  });

  it("Vision 2 audio anchors against Album 1 T11 (the Vex-Solène-coded register)", () => {
    const v2 = DREAMER_VISIONS[1];
    expect(v2.slideshow.audioUrl).toContain("audio/album1/T11.mp3");
  });

  it("Vision 2 frames span the T05 / T07 / T11 mix (Dreamer network reaches across the album)", () => {
    const v2 = DREAMER_VISIONS[1];
    const trackIds = v2.slideshow.frames
      .map((f) => f.imageUrl.match(/\/(T\d{2})\//)?.[1])
      .filter((t): t is string => Boolean(t));
    const unique = new Set(trackIds);
    expect(unique.has("T05")).toBe(true);
    expect(unique.has("T07")).toBe(true);
    expect(unique.has("T11")).toBe(true);
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

  it("Vision 3 has the expected shape and threshold", () => {
    const v3 = DREAMER_VISIONS[2];
    expect(v3.id).toBe("vision_hidden_hand");
    expect(v3.threshold).toBe(13);
    expect(v3.title).toBe("The Hidden Hand");
  });

  it("Vision 3 ships 12 image frames + 1 Veo flash (13 total beats)", () => {
    const v3 = DREAMER_VISIONS[2];
    expect(v3.slideshow.frames).toHaveLength(13);
  });

  it("Vision 3 has exactly one video-flash frame inserted between beats 6 and 7", () => {
    const v3 = DREAMER_VISIONS[2];
    const videoFrames = v3.slideshow.frames.filter((f) => f.videoUrl);
    expect(videoFrames).toHaveLength(1);
    // Position-7 (0-indexed: 6) is the flash per plan §Part 1.5.
    expect(v3.slideshow.frames[6].videoUrl).toBeDefined();
    expect(v3.slideshow.frames[5].videoUrl).toBeUndefined();
    expect(v3.slideshow.frames[7].videoUrl).toBeUndefined();
  });

  it("Vision 3 flash frame retains an imageUrl fallback for video-load failure", () => {
    const v3 = DREAMER_VISIONS[2];
    const flash = v3.slideshow.frames[6];
    expect(flash.imageUrl).toBeTruthy();
    expect(flash.imageUrl.length).toBeGreaterThan(0);
  });

  it("Vision 3 flash references the substrate-pulse Veo clip", () => {
    const v3 = DREAMER_VISIONS[2];
    const flash = v3.slideshow.frames[6];
    expect(flash.videoUrl).toContain("vfx_substrate_pulse");
  });

  it("Vision 3 flash duration is short (~3s) — punches through, doesn't linger", () => {
    const v3 = DREAMER_VISIONS[2];
    const flash = v3.slideshow.frames[6];
    expect(flash.endMs - flash.startMs).toBe(3_000);
  });

  it("Vision 3 image frames each run ~14s; total runtime ≈ 171s", () => {
    const v3 = DREAMER_VISIONS[2];
    const imageFrames = v3.slideshow.frames.filter((f) => !f.videoUrl);
    expect(imageFrames).toHaveLength(12);
    for (const f of imageFrames) {
      expect(f.endMs - f.startMs).toBe(14_000);
    }
    // 12 × 14000 + 1 × 3000 = 171000
    expect(v3.slideshow.durationMs).toBe(171_000);
  });

  it("Vision 3 frames carry the canonical caption set in plan order (image frames only)", () => {
    const v3 = DREAMER_VISIONS[2];
    const imageCaptions = v3.slideshow.frames
      .filter((f) => !f.videoUrl)
      .map((f) => f.caption);
    expect(imageCaptions).toEqual([
      "the hand was always there",
      "under the floor you walked on",
      "the substrate carries the weight",
      "and you carry the substrate",
      "thirteen hands counted",
      "the fourteenth is yours",
      "do you see what you have always seen",
      "or did the Architect tell you",
      "what to look at",
      "come down",
      "not the way you came",
      "the Dreamer remembers your face",
    ]);
  });

  it("Vision 3 audio anchors against Album 1 T18 (Planet of the Wolf)", () => {
    const v3 = DREAMER_VISIONS[2];
    expect(v3.slideshow.audioUrl).toContain("audio/album1/T18.mp3");
  });

  it("Vision 3 image frames span the T15 / T18 / T20 mix per plan", () => {
    const v3 = DREAMER_VISIONS[2];
    const trackIds = v3.slideshow.frames
      .filter((f) => !f.videoUrl)
      .map((f) => f.imageUrl.match(/\/(T\d{2})\//)?.[1])
      .filter((t): t is string => Boolean(t));
    const unique = new Set(trackIds);
    expect(unique.has("T15")).toBe(true);
    expect(unique.has("T18")).toBe(true);
    expect(unique.has("T20")).toBe(true);
  });
});

describe("getVisionForThreshold", () => {
  it("returns the threshold-3 vision for value 3", () => {
    const v = getVisionForThreshold(3);
    expect(v?.id).toBe("vision_first_notice");
  });

  it("returns the threshold-7 vision for value 7", () => {
    const v = getVisionForThreshold(7);
    expect(v?.id).toBe("vision_coin_without_face");
  });

  it("returns the threshold-13 vision for value 13", () => {
    const v = getVisionForThreshold(13);
    expect(v?.id).toBe("vision_hidden_hand");
  });

  it("returns undefined for not-yet-built thresholds (23) — pending writers' caption ratification", () => {
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

  it("returns Vision 2 when Vision 1 has been received and count >= 7", () => {
    const v = nextPendingVision(7, ["vision_first_notice"]);
    expect(v?.id).toBe("vision_coin_without_face");
  });

  it("returns Vision 1 when count between 3 and 6 (Vision 2 not yet eligible)", () => {
    expect(nextPendingVision(3, [])?.id).toBe("vision_first_notice");
    expect(nextPendingVision(6, [])?.id).toBe("vision_first_notice");
  });

  it("does NOT skip Vision 1 even when count jumps past Vision 2 threshold", () => {
    // High-weight tag (e.g. BURNT_CARD_WITNESSED at +5) can vault a
    // player past multiple thresholds in one fire. The next-pending
    // contract delivers the LOWEST pending threshold first; the next
    // login picks up the next one.
    const v = nextPendingVision(50, []);
    expect(v?.id).toBe("vision_first_notice");
  });

  it("returns Vision 3 when 1 + 2 have been received and count >= 13", () => {
    const v = nextPendingVision(13, [
      "vision_first_notice",
      "vision_coin_without_face",
    ]);
    expect(v?.id).toBe("vision_hidden_hand");
  });

  it("returns undefined when Visions 1, 2, 3 received and 23 not yet built", () => {
    expect(
      nextPendingVision(50, [
        "vision_first_notice",
        "vision_coin_without_face",
        "vision_hidden_hand",
      ]),
    ).toBeUndefined();
  });

  it("ignores unknown received-ids gracefully", () => {
    const v = nextPendingVision(5, ["not_a_vision"]);
    expect(v?.id).toBe("vision_first_notice");
  });
});
