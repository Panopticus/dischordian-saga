import { describe, it, expect } from "vitest";
import {
  episodeVoManifestKey,
  cueAudioUrl,
  episodeHasAnyAudio,
  getEpisodeVoCoverage,
} from "./episodeVoLookup";

describe("episodeVoLookup", () => {
  it("composes the canonical manifest key shape", () => {
    expect(
      episodeVoManifestKey("celebration_c1_the_watch", "celebration_c1_scene_1_opening", 0),
    ).toBe("celebration_c1_the_watch:celebration_c1_scene_1_opening:0");
  });

  it("cueAudioUrl returns undefined for unrecorded cues", () => {
    // Use a deliberately-non-existent cue id so this test stays
    // valid as the manifest fills up over time. Original assertion
    // hard-coded a real cue id and broke when PR #403 baked the
    // Celebration C1 cues.
    expect(cueAudioUrl("episode_does_not_exist", "scene_does_not_exist", 0)).toBeUndefined();
  });

  it("episodeHasAnyAudio returns false for episodes never recorded", () => {
    expect(episodeHasAnyAudio("episode_does_not_exist")).toBe(false);
  });

  it("getEpisodeVoCoverage reports a non-negative recorded count", () => {
    const c = getEpisodeVoCoverage();
    expect(c.recordedCues).toBeGreaterThanOrEqual(0);
    // totalCues uses -1 as the "not populated by audit script"
    // sentinel; only assert when populated.
    if (c.totalCues >= 0) {
      expect(c.totalCues).toBeGreaterThanOrEqual(c.recordedCues);
    }
  });
});
