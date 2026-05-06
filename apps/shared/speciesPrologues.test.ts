import { describe, it, expect } from "vitest";
import {
  SPECIES_PROLOGUES,
  getPrologueForSpecies,
  getPrologueScene,
  isPrologueComplete,
} from "./speciesPrologues";

describe("SPECIES_PROLOGUES — invariants", () => {
  it("ships at least one anchor scene per species", () => {
    expect(getPrologueForSpecies("demagi").length).toBeGreaterThan(0);
    expect(getPrologueForSpecies("quarchon").length).toBeGreaterThan(0);
    expect(getPrologueForSpecies("neyon").length).toBeGreaterThan(0);
  });

  it("every scene id is unique", () => {
    const ids = SPECIES_PROLOGUES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every completionFlag is unique", () => {
    const flags = SPECIES_PROLOGUES.map((s) => s.completionFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("every species has the full 5-beat prologue authored", () => {
    const expectedBeats = ["wake", "first_glance", "first_voice", "first_act", "transition"];
    for (const species of ["demagi", "quarchon", "neyon"] as const) {
      const scenes = getPrologueForSpecies(species);
      const beats = scenes.map((s) => s.beat);
      for (const expected of expectedBeats) {
        expect(beats, `${species} missing beat ${expected}`).toContain(expected);
      }
    }
  });

  it("every scene has narration with at least 30 words (production-scale check)", () => {
    for (const scene of SPECIES_PROLOGUES) {
      const wordCount = scene.narration.trim().split(/\s+/).length;
      expect(wordCount, `${scene.id} narration too short`).toBeGreaterThanOrEqual(30);
    }
  });
});

describe("getPrologueForSpecies", () => {
  it("returns scenes sorted by index ascending", () => {
    const out = getPrologueForSpecies("demagi");
    for (let i = 1; i < out.length; i++) {
      expect(out[i].index).toBeGreaterThan(out[i - 1].index);
    }
  });
});

describe("getPrologueScene", () => {
  it("returns by id", () => {
    expect(getPrologueScene("prologue_demagi_wake")?.species).toBe("demagi");
  });

  it("returns undefined for unknown ids", () => {
    expect(getPrologueScene("nope")).toBeUndefined();
  });
});

describe("isPrologueComplete", () => {
  it("false when at least one completion flag is missing", () => {
    expect(isPrologueComplete("demagi", {})).toBe(false);
  });

  it("true when every species scene's completion flag is set", () => {
    const flags = Object.fromEntries(
      getPrologueForSpecies("demagi").map((s) => [s.completionFlag, true]),
    );
    expect(isPrologueComplete("demagi", flags)).toBe(true);
  });
});
