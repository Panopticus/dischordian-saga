import { describe, it, expect } from "vitest";
import {
  HELLBOX_DISCOVERED_FLAG,
  HELLBOX_FIRST_TOUCH_FLAG,
  MOL_GARATH_AUDIENCE_FLAG,
  HAMLET_FINAL_CONNECTION_FLAG,
  GOGGLES_INHERITED_FLAG,
  episodeCompletionFlag,
  extractEpisodeIdFromFlag,
} from "./matrixSaveFlags";
import { MATRIX_OF_DREAMS_LEVELS } from "./matrixOfDreamsLevels";

describe("matrixSaveFlags — canonical persistence keys", () => {
  it("exposes stable, unique top-level flag constants", () => {
    const flags = [
      HELLBOX_DISCOVERED_FLAG,
      HELLBOX_FIRST_TOUCH_FLAG,
      MOL_GARATH_AUDIENCE_FLAG,
      HAMLET_FINAL_CONNECTION_FLAG,
      GOGGLES_INHERITED_FLAG,
    ];
    expect(new Set(flags).size).toBe(flags.length);
    for (const f of flags) {
      expect(typeof f).toBe("string");
      expect(f.length).toBeGreaterThan(0);
    }
  });

  it("episodeCompletionFlag is deterministic for a given episode id", () => {
    expect(episodeCompletionFlag("celebration_c1_the_watch")).toBe(
      "matrix_episode_celebration_c1_the_watch_complete",
    );
  });

  it("extractEpisodeIdFromFlag round-trips cleanly", () => {
    for (const level of MATRIX_OF_DREAMS_LEVELS) {
      const flag = episodeCompletionFlag(level.id);
      expect(extractEpisodeIdFromFlag(flag)).toBe(level.id);
    }
  });

  it("extractEpisodeIdFromFlag returns undefined for non-episode flags", () => {
    expect(extractEpisodeIdFromFlag(HELLBOX_DISCOVERED_FLAG)).toBeUndefined();
    expect(extractEpisodeIdFromFlag("some_random_flag")).toBeUndefined();
    expect(extractEpisodeIdFromFlag("matrix_episode_no_suffix")).toBeUndefined();
  });

  it("episode completion flags do not collide with top-level flags", () => {
    const topLevel = new Set([
      HELLBOX_DISCOVERED_FLAG,
      HELLBOX_FIRST_TOUCH_FLAG,
      MOL_GARATH_AUDIENCE_FLAG,
      HAMLET_FINAL_CONNECTION_FLAG,
      GOGGLES_INHERITED_FLAG,
    ]);
    for (const level of MATRIX_OF_DREAMS_LEVELS) {
      expect(topLevel.has(episodeCompletionFlag(level.id))).toBe(false);
    }
  });
});
