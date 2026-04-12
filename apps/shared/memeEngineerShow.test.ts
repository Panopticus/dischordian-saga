import { describe, it, expect } from "vitest";
import {
  MEME_ENGINEER_EPISODES,
  TOTAL_MEME_EPISODES,
  getMemeEpisode,
  getEpisodeForRecording,
  getUnlockedEpisodes,
} from "./memeEngineerShow";

describe("memeEngineerShow", () => {
  it("has exactly 6 episodes", () => {
    expect(MEME_ENGINEER_EPISODES).toHaveLength(6);
    expect(TOTAL_MEME_EPISODES).toBe(6);
  });

  it("all episodes are Epoch 0", () => {
    for (const ep of MEME_ENGINEER_EPISODES) {
      expect(ep.epoch).toBe(0);
    }
  });

  it("broadcast orders are sequential and unique", () => {
    const orders = MEME_ENGINEER_EPISODES.map((e) => e.broadcastOrder);
    expect(new Set(orders).size).toBe(6);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThan(orders[i - 1]);
    }
  });

  it("every episode has non-empty memeIntro and memeOutro", () => {
    for (const ep of MEME_ENGINEER_EPISODES) {
      expect(ep.memeIntro.length).toBeGreaterThan(0);
      expect(ep.memeOutro.length).toBeGreaterThan(0);
    }
  });

  it("episode numbers are 1-6", () => {
    const nums = MEME_ENGINEER_EPISODES.map((e) => e.episodeNumber);
    expect(nums).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("each episode links to a unique recording", () => {
    const recordings = MEME_ENGINEER_EPISODES.map((e) => e.unlockedByRecording);
    expect(new Set(recordings).size).toBe(6);
  });

  describe("getMemeEpisode", () => {
    it("returns correct episode by number", () => {
      expect(getMemeEpisode(1)?.title).toBe("The Kid With the Coat");
      expect(getMemeEpisode(6)?.title).toBe("The World's Smartest Man");
    });

    it("returns undefined for invalid number", () => {
      expect(getMemeEpisode(0)).toBeUndefined();
      expect(getMemeEpisode(7)).toBeUndefined();
    });
  });

  describe("getEpisodeForRecording", () => {
    it("maps recording to episode", () => {
      expect(getEpisodeForRecording("holo_wake_the_bench")?.episodeNumber).toBe(1);
      expect(getEpisodeForRecording("holo_deck_remembers")?.episodeNumber).toBe(6);
    });

    it("recording 5 (holo_which_ark) has no episode", () => {
      expect(getEpisodeForRecording("holo_which_ark")).toBeUndefined();
    });
  });

  describe("getUnlockedEpisodes", () => {
    it("returns empty when no flags", () => {
      expect(getUnlockedEpisodes({})).toHaveLength(0);
    });

    it("returns episodes whose flags are raised", () => {
      const flags = {
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
      };
      const unlocked = getUnlockedEpisodes(flags);
      expect(unlocked).toHaveLength(2);
      expect(unlocked[0].title).toBe("The Kid With the Coat");
      expect(unlocked[1].title).toBe("Gary's Goggles");
    });

    it("returns all 6 when all flags raised", () => {
      const flags = {
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_6_discovered: true,
        engineer_recording_7_discovered: true,
      };
      const unlocked = getUnlockedEpisodes(flags);
      expect(unlocked).toHaveLength(6);
    });
  });
});
