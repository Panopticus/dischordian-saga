import { describe, it, expect } from "vitest";
import {
  MECHRONIS_ACADEMY_SCENES,
  MECHRONIS_EPISODE_SCENE_MAP,
  getMechronisScenesForEpisode,
} from "./mechronisAcademyDialog";
import { MECHRONIS_ACADEMY_EPISODES } from "./mechronisAcademyEpisodes";

describe("mechronisAcademyDialog — vertical slice M1", () => {
  it("registers scenes for the M1 keystone episode", () => {
    expect(Object.keys(MECHRONIS_EPISODE_SCENE_MAP)).toContain(
      "mechronis_m1_choric_compliance",
    );
  });

  it("every scene id is unique", () => {
    const ids = MECHRONIS_ACADEMY_SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every scene has a non-empty cue list", () => {
    for (const scene of MECHRONIS_ACADEMY_SCENES) {
      expect(scene.cues.length).toBeGreaterThan(0);
      for (const cue of scene.cues) expect(cue.text.length).toBeGreaterThan(0);
    }
  });

  it("the mapped episode exists in the matrix-of-dreams registry", () => {
    const registryIds = new Set(MECHRONIS_ACADEMY_EPISODES.map((e) => e.id));
    for (const episodeId of Object.keys(MECHRONIS_EPISODE_SCENE_MAP)) {
      expect(registryIds.has(episodeId)).toBe(true);
    }
  });

  it("getMechronisScenesForEpisode returns scenes in mapped order", () => {
    const m1Scenes = getMechronisScenesForEpisode("mechronis_m1_choric_compliance");
    expect(m1Scenes.map((s) => s.id)).toEqual([
      "mechronis_m1_scene_1_the_lectern",
      "mechronis_m1_scene_2_the_drill",
      "mechronis_m1_scene_3_hidden_agenda",
    ]);
  });

  it("M1 — Kanevas's hidden-agenda scene names the network/student conditioning", () => {
    const agendaScene = MECHRONIS_ACADEMY_SCENES.find(
      (s) => s.id === "mechronis_m1_scene_3_hidden_agenda",
    );
    const text = agendaScene!.cues.map((c) => c.text).join(" ").toLowerCase();
    expect(text).toContain("inner voice");
    expect(text).toContain("network");
  });

  it("M1 — the Dreamer's lullaby surfaces in the agenda scene as counter-rhythm", () => {
    const agendaScene = MECHRONIS_ACADEMY_SCENES.find(
      (s) => s.id === "mechronis_m1_scene_3_hidden_agenda",
    );
    const text = agendaScene!.cues.map((c) => c.text).join(" ").toLowerCase();
    expect(text).toContain("lullaby");
  });

  it("M1 — Kanevas never says 'we' (per his teaching philosophy: 'no individual learning')", () => {
    const m1Scenes = getMechronisScenesForEpisode("mechronis_m1_choric_compliance");
    for (const scene of m1Scenes) {
      for (const cue of scene.cues) {
        if (cue.speaker !== "the_architect") continue; // Kanevas placeholder channel
        // He says "cohort", "the network", "you (plural)" — never "we"
        expect(cue.text).not.toMatch(/\bwe\b/i);
      }
    }
  });

  it("M1 — the metronome is present (his signature instrument)", () => {
    const drillScene = MECHRONIS_ACADEMY_SCENES.find(
      (s) => s.id === "mechronis_m1_scene_2_the_drill",
    );
    const text = drillScene!.cues.map((c) => c.text).join(" ").toLowerCase();
    expect(text).toContain("metronome");
  });
});
