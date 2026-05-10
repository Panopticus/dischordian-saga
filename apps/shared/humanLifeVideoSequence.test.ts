import { describe, expect, it } from "vitest";
import {
  HUMAN_LIFE_VIDEOS,
  getHumanLifeVideo,
  pendingHumanLifeVideo,
  brokenHumanLifeSequence,
  humanLifeSequenceComplete,
  type HumanLifeEra,
} from "./humanLifeVideoSequence";

const CANONICAL_ERA_ORDER: HumanLifeEra[] = [
  "celebration",
  "mechronis",
  "detective",
  "reveal",
];

describe("humanLifeVideoSequence", () => {
  it("ships exactly four videos", () => {
    expect(HUMAN_LIFE_VIDEOS).toHaveLength(4);
  });

  it("eras are in canonical Celebration → Mechronis → Detective → Reveal order", () => {
    const eras = HUMAN_LIFE_VIDEOS.map((v) => v.era);
    expect(eras).toEqual(CANONICAL_ERA_ORDER);
  });

  it("sequenceIndex is monotonically 1..4", () => {
    const indices = HUMAN_LIFE_VIDEOS.map((v) => v.sequenceIndex);
    expect(indices).toEqual([1, 2, 3, 4]);
  });

  it("every video has a non-empty frameLine and asset path", () => {
    for (const video of HUMAN_LIFE_VIDEOS) {
      expect(video.frameLine.trim().length).toBeGreaterThan(40);
      expect(video.videoRelPath.startsWith("videos/human_life/")).toBe(true);
    }
  });

  it("the Detective video opens with the canonical Authority lead-in line", () => {
    // The Detective era's lead-in roots his pre-Wall job in a concrete
    // employer (the Authority Tribunal — Vernon Vortex / Wanda Wyrlord
    // / Wayne Warden in Act 1 Cycle C). Locking the exact phrasing
    // here keeps Beat H's title card in sync with the supporting
    // commentary lines elsewhere.
    const detective = getHumanLifeVideo("human_life_detective");
    expect(detective?.frameLine).toBe(
      "It all started back when I used to solve problems for the Authority.",
    );
  });

  it("trigger and seen flags are unique across all four videos", () => {
    const triggers = HUMAN_LIFE_VIDEOS.map((v) => v.triggerFlag);
    const seens = HUMAN_LIFE_VIDEOS.map((v) => v.seenFlag);
    expect(new Set(triggers).size).toBe(triggers.length);
    expect(new Set(seens).size).toBe(seens.length);
    for (const seen of seens) expect(triggers).not.toContain(seen);
  });

  it("getHumanLifeVideo returns each video by id", () => {
    expect(getHumanLifeVideo("human_life_celebration")?.era).toBe(
      "celebration",
    );
    expect(getHumanLifeVideo("human_life_reveal")?.era).toBe("reveal");
  });

  describe("pendingHumanLifeVideo", () => {
    it("returns null when nothing has triggered", () => {
      expect(pendingHumanLifeVideo(new Set())).toBeNull();
    });

    it("returns the first triggered-but-unseen video in canonical order", () => {
      const flags = new Set([
        "human_life_celebration_triggered",
        "human_life_mechronis_triggered",
      ]);
      expect(pendingHumanLifeVideo(flags)?.era).toBe("celebration");
    });

    it("skips videos whose seenFlag is already set", () => {
      const flags = new Set([
        "human_life_celebration_triggered",
        "human_life_celebration_seen",
        "human_life_mechronis_triggered",
      ]);
      expect(pendingHumanLifeVideo(flags)?.era).toBe("mechronis");
    });

    it("returns null when every triggered video has been seen", () => {
      const flags = new Set([
        "human_life_celebration_triggered",
        "human_life_celebration_seen",
      ]);
      expect(pendingHumanLifeVideo(flags)).toBeNull();
    });
  });

  describe("brokenHumanLifeSequence", () => {
    it("returns [] when no videos have been seen", () => {
      expect(brokenHumanLifeSequence(new Set())).toEqual([]);
    });

    it("returns [] when videos are seen in canonical order", () => {
      const flags = new Set([
        "human_life_celebration_seen",
        "human_life_mechronis_seen",
      ]);
      expect(brokenHumanLifeSequence(flags)).toEqual([]);
    });

    it("flags an out-of-order seen video (reveal before celebration)", () => {
      const flags = new Set(["human_life_reveal_seen"]);
      const broken = brokenHumanLifeSequence(flags);
      expect(broken.map((v) => v.era)).toEqual(["reveal"]);
    });

    it("flags multiple out-of-order seen videos", () => {
      const flags = new Set([
        "human_life_detective_seen",
        "human_life_reveal_seen",
      ]);
      const broken = brokenHumanLifeSequence(flags);
      expect(broken.map((v) => v.era)).toEqual(["detective", "reveal"]);
    });
  });

  describe("humanLifeSequenceComplete", () => {
    it("returns false when no videos have been seen", () => {
      expect(humanLifeSequenceComplete(new Set())).toBe(false);
    });

    it("returns false when only some videos have been seen", () => {
      const flags = new Set([
        "human_life_celebration_seen",
        "human_life_mechronis_seen",
        "human_life_detective_seen",
      ]);
      expect(humanLifeSequenceComplete(flags)).toBe(false);
    });

    it("returns true once all four videos have been seen", () => {
      const flags = new Set([
        "human_life_celebration_seen",
        "human_life_mechronis_seen",
        "human_life_detective_seen",
        "human_life_reveal_seen",
      ]);
      expect(humanLifeSequenceComplete(flags)).toBe(true);
    });
  });
});
