import { describe, it, expect } from "vitest";
import {
  CELEBRATION_SCHOOL_SCENES,
  CELEBRATION_EPISODE_SCENE_MAP,
  getScenesForEpisode,
} from "./celebrationSchoolDialog";
import { CELEBRATION_SCHOOL_EPISODES } from "./celebrationSchoolEpisodes";

describe("celebrationSchoolDialog — vertical slices C1, C9, C12", () => {
  it("registers scenes for all 12 Celebration episodes (keystones + part-2)", () => {
    const allEpisodeIds = Object.keys(CELEBRATION_EPISODE_SCENE_MAP).sort();
    expect(allEpisodeIds).toEqual(
      [
        "celebration_c1_the_watch",
        "celebration_c2_first_day",
        "celebration_c3_chess_class",
        "celebration_c4_under_the_floor",
        "celebration_c5_the_banner_glitches",
        "celebration_c6_the_dueling_court",
        "celebration_c7_the_patrons_summons",
        "celebration_c8_the_ghost_in_the_hall",
        "celebration_c9_the_match",
        "celebration_c10_the_arks_rise",
        "celebration_c11_the_uncles_verdict",
        "celebration_c12_the_last_good_day",
      ].sort(),
    );
  });

  it("every scene id is unique", () => {
    const ids = CELEBRATION_SCHOOL_SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every scene has a non-empty cue list", () => {
    for (const scene of CELEBRATION_SCHOOL_SCENES) {
      expect(scene.cues.length).toBeGreaterThan(0);
      for (const cue of scene.cues) {
        expect(cue.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("every episode scene map references real scene ids", () => {
    const allSceneIds = new Set(CELEBRATION_SCHOOL_SCENES.map((s) => s.id));
    for (const episodeSceneIds of Object.values(CELEBRATION_EPISODE_SCENE_MAP)) {
      for (const id of episodeSceneIds) {
        expect(allSceneIds.has(id)).toBe(true);
      }
    }
  });

  it("every mapped episode id exists in the matrix-of-dreams registry", () => {
    const registryIds = new Set(CELEBRATION_SCHOOL_EPISODES.map((e) => e.id));
    for (const episodeId of Object.keys(CELEBRATION_EPISODE_SCENE_MAP)) {
      expect(registryIds.has(episodeId)).toBe(true);
    }
  });

  it("getScenesForEpisode returns the scenes in the mapped order", () => {
    const c1Scenes = getScenesForEpisode("celebration_c1_the_watch");
    expect(c1Scenes.map((s) => s.id)).toEqual([
      "celebration_c1_scene_1_opening",
      "celebration_c1_scene_1b_arrival",
      "celebration_c1_scene_2_malkia_arrives",
      "celebration_c1_scene_3_ghost_appears",
      "celebration_c1_scene_4_aftermath",
    ]);
  });

  it("C1 — the Ghost King delivers the canonical 'Beware the Warlord' line", () => {
    const ghostScene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c1_scene_3_ghost_appears",
    );
    expect(ghostScene).toBeDefined();
    const ghostLines = ghostScene!.cues.filter((c) => c.speaker === "the_jailer");
    const text = ghostLines.map((c) => c.text).join(" ");
    expect(text).toContain("Beware the Warlord");
  });

  it("C9 — the Game Master never says 'darling' (Right register, post-split)", () => {
    const c9Scenes = getScenesForEpisode("celebration_c9_the_match");
    for (const scene of c9Scenes) {
      for (const cue of scene.cues) {
        expect(cue.text.toLowerCase()).not.toContain("darling");
      }
    }
  });

  it("C9 — the Game Master never raises voice (no caps emphasis = post-split Right register)", () => {
    const c9Scenes = getScenesForEpisode("celebration_c9_the_match");
    for (const scene of c9Scenes) {
      for (const cue of scene.cues) {
        if (cue.speaker !== "the_collector") continue;
        // Allowed: the occasional capitalized proper noun. Not allowed: full-word caps emphasis.
        const fullCapsWords = cue.text.match(/\b[A-Z]{4,}\b/g) ?? [];
        // Filter out proper-noun-only caps (Hierarchy, Engineer, Goggles)
        const emphasizingCaps = fullCapsWords.filter(
          (w) =>
            !["HIERARCHY", "ENGINEER", "GOGGLES", "ARK", "ARCHIVE", "MATRIX"].includes(w),
        );
        expect(emphasizingCaps).toEqual([]);
      }
    }
  });

  it("C9 — the goggles handover line is present (Goggles Beat canon)", () => {
    const handoverScene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c9_scene_4_the_goggles",
    );
    expect(handoverScene).toBeDefined();
    const text = handoverScene!.cues.map((c) => c.text).join(" ");
    expect(text).toContain("They were always going to be yours");
  });

  it("C12 — the line that lands matches Engineer Recording 4's tool-becomes-weapon canon", () => {
    const lineScene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c12_scene_2_the_line_lands",
    );
    expect(lineScene).toBeDefined();
    const text = lineScene!.cues.map((c) => c.text).join(" ");
    expect(text.toLowerCase()).toContain("tool becomes a weapon");
  });

  it("C12 — Elara's reveal line names the Prince as the Engineer", () => {
    const lineScene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c12_scene_2_the_line_lands",
    );
    const elaraReveal = lineScene!.cues.find(
      (c) => c.speaker === "elara" && c.text.includes("Prince"),
    );
    expect(elaraReveal).toBeDefined();
    expect(elaraReveal!.text.toLowerCase()).toContain("you are the engineer");
  });

  it("Game Master voice discipline holds across ALL Celebration episodes (no 'darling', no caps emphasis)", () => {
    for (const scene of CELEBRATION_SCHOOL_SCENES) {
      for (const cue of scene.cues) {
        if (cue.speaker !== "the_collector") continue;
        expect(cue.text.toLowerCase()).not.toContain("darling");
        const fullCapsWords = cue.text.match(/\b[A-Z]{4,}\b/g) ?? [];
        const emphasizingCaps = fullCapsWords.filter(
          (w) =>
            !["HIERARCHY", "ENGINEER", "GOGGLES", "ARK", "ARCHIVE", "MATRIX", "BOOK", "READ"].includes(w),
        );
        expect(emphasizingCaps).toEqual([]);
      }
    }
  });

  it("C5 — Shadow Tongue surfacing names the propaganda layer", () => {
    const scene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c5_scene_1_the_square",
    );
    expect(scene).toBeDefined();
    const text = scene!.cues.map((c) => c.text).join(" ").toLowerCase();
    expect(text).toContain("propaganda");
  });

  it("C8 — the Dreamer's hum surfaces underneath the Ghost King (mercy register)", () => {
    const scene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c8_scene_2_the_dreamers_hum",
    );
    expect(scene).toBeDefined();
    const dreamerCues = scene!.cues.filter((c) => c.speaker === "the_dreamer");
    expect(dreamerCues.length).toBeGreaterThan(0);
    const text = dreamerCues.map((c) => c.text).join(" ").toLowerCase();
    expect(text).toContain("wake gently");
  });

  it("C11 — the verdict is fixed (Celebration falls; the trial is the prequel form of Authority Trial)", () => {
    const verdictScene = CELEBRATION_SCHOOL_SCENES.find(
      (s) => s.id === "celebration_c11_scene_2_the_verdict",
    );
    expect(verdictScene).toBeDefined();
    const text = verdictScene!.cues.map((c) => c.text).join(" ").toLowerCase();
    expect(text).toContain("first celebration burns");
  });
});
