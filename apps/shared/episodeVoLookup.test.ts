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
    expect(cueAudioUrl("celebration_c1_the_watch", "celebration_c1_scene_1_opening", 0)).toBeUndefined();
  });

  it("episodeHasAnyAudio returns false for an empty manifest", () => {
    expect(episodeHasAnyAudio("celebration_c1_the_watch")).toBe(false);
  });

  it("getEpisodeVoCoverage reports recorded count", () => {
    const c = getEpisodeVoCoverage();
    expect(c.recordedCues).toBe(0);
  });
});
