import { describe, it, expect } from "vitest";
import {
  HELLBOX_DISCOVERED_FLAG,
  HELLBOX_FIRST_TOUCH_FLAG,
  MOL_GARATH_AUDIENCE_FLAG,
  HAMLET_FINAL_CONNECTION_FLAG,
  GOGGLES_INHERITED_FLAG,
  episodeCompletionFlag,
  extractEpisodeIdFromFlag,
  hamletClueFlag,
  extractClueIdFromFlag,
  hamletConnectionFlag,
} from "./matrixSaveFlags";
import { MATRIX_OF_DREAMS_LEVELS } from "./matrixOfDreamsLevels";
import { CLUE_CARDS, BOARD_CONNECTIONS } from "./artistPrinceMystery";

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

  describe("hamletClueFlag / extractClueIdFromFlag", () => {
    it("hamletClueFlag is deterministic", () => {
      expect(hamletClueFlag("ghost_seen")).toBe("hamlet_clue_ghost_seen");
    });

    it("round-trips for every canonical clue", () => {
      for (const clue of CLUE_CARDS) {
        expect(extractClueIdFromFlag(hamletClueFlag(clue.id))).toBe(clue.id);
      }
    });

    it("extractClueIdFromFlag returns undefined for non-clue flags", () => {
      expect(extractClueIdFromFlag(HELLBOX_DISCOVERED_FLAG)).toBeUndefined();
      expect(extractClueIdFromFlag(episodeCompletionFlag("celebration_c1_the_watch"))).toBeUndefined();
    });

    it("does not collide with episode-completion or top-level flag space", () => {
      const top = new Set([
        HELLBOX_DISCOVERED_FLAG,
        HELLBOX_FIRST_TOUCH_FLAG,
        MOL_GARATH_AUDIENCE_FLAG,
        HAMLET_FINAL_CONNECTION_FLAG,
        GOGGLES_INHERITED_FLAG,
      ]);
      for (const clue of CLUE_CARDS) {
        const flag = hamletClueFlag(clue.id);
        expect(top.has(flag)).toBe(false);
        expect(flag).not.toContain("matrix_episode_");
      }
    });
  });

  describe("hamletConnectionFlag", () => {
    it("is deterministic and prefixed", () => {
      expect(hamletConnectionFlag("conn_x")).toBe("hamlet_connection_conn_x");
    });

    it("does not overlap with the clue-flag namespace", () => {
      for (const conn of BOARD_CONNECTIONS) {
        expect(hamletConnectionFlag(conn.id)).not.toMatch(/^hamlet_clue_/);
      }
    });
  });
});
