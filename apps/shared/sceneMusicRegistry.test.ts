import { describe, it, expect } from "vitest";
import {
  SCENE_MUSIC_CUES,
  getSceneMusicCue,
  isCueTrackKnown,
  listSceneIds,
} from "./sceneMusicRegistry";

describe("sceneMusicRegistry — invariants", () => {
  it("declares at least 10 seed cues (covers acts, hubs, romance, codex)", () => {
    expect(SCENE_MUSIC_CUES.length).toBeGreaterThanOrEqual(10);
  });

  it("every scene id is unique", () => {
    const ids = SCENE_MUSIC_CUES.map((c) => c.sceneId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every fade duration is non-negative", () => {
    for (const cue of SCENE_MUSIC_CUES) {
      expect(cue.fadeInMs).toBeGreaterThanOrEqual(0);
      expect(cue.fadeOutMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("every cue declares a non-empty baseTrackId", () => {
    for (const cue of SCENE_MUSIC_CUES) {
      expect(cue.baseTrackId.length).toBeGreaterThan(0);
    }
  });

  it("every seed cue references a track that exists in SONG_TRIGGER_MAP", () => {
    for (const cue of SCENE_MUSIC_CUES) {
      expect(isCueTrackKnown(cue), `cue ${cue.sceneId} references unknown track ${cue.baseTrackId}`).toBe(true);
    }
  });

  it("hub and romance cues disable combat ramp (per ME/KOTOR convention)", () => {
    const hubsAndRomance = SCENE_MUSIC_CUES.filter(
      (c) => c.sceneId.startsWith("hub_") || c.sceneId.startsWith("romance_"),
    );
    for (const cue of hubsAndRomance) {
      expect(cue.allowCombatRamp).toBe(false);
    }
  });
});

describe("getSceneMusicCue", () => {
  it("returns the matching cue", () => {
    expect(getSceneMusicCue("act_1_intro")?.baseTrackId).toBe("welcome-to-celebration");
  });

  it("returns undefined for unknown scene ids", () => {
    expect(getSceneMusicCue("act_99_nonsense")).toBeUndefined();
  });
});

describe("listSceneIds", () => {
  it("returns every cue's scene id in order", () => {
    const ids = listSceneIds();
    expect(ids[0]).toBe("act_1_intro");
    expect(ids).toContain("hub_inception_ark");
    expect(ids).toContain("codex_unlock_default");
  });
});

describe("per-act coverage — every act has at least an intro cue declared", () => {
  // Bucket B audit closed the per-act gap. Acts 1/3/6/7 had hero
  // cues; the polish pass added Acts 2/4/4.5/5 to bring every act
  // up to at least one declared scene cue.
  const REQUIRED_ACT_INTROS = [
    "act_1_intro",
    "act_2_intro",
    "act_3_intro",
    "act_4_intro",
    "act_4_5_intro",
    "act_5_intro",
    "act_6_silence_in_heaven",
    "act_7_fall_of_new_babylon",
  ];

  for (const sceneId of REQUIRED_ACT_INTROS) {
    it(`has an intro cue for ${sceneId}`, () => {
      expect(getSceneMusicCue(sceneId)).toBeDefined();
    });
  }
});
