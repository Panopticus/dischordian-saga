// apps/shared/npcs/__tests__/registry.test.ts
//
// Lint + structural tests for the NPC_REGISTRY. Ensures every priority-roster
// character has a non-stub NpcProfile and that band ladders are well-formed.

import { describe, it, expect } from "vitest";
import {
  NPC_REGISTRY,
  resolveTrustBand,
  isKnownBand,
  isKnownRevealStage,
  allNpcKeys,
} from "../registry";
import type { NpcKey } from "../types";

describe("NPC_REGISTRY", () => {
  it("contains all 13 priority-roster + companion characters", () => {
    const keys = allNpcKeys();
    expect(keys).toHaveLength(13);
    const expected: NpcKey[] = [
      "elara",
      "the_human",
      "your_eidolon",
      "adjudicator_locke",
      "vex_solene",
      "the_degen",
      "nilmorg",
      "the_game_master",
      "the_meme",
      "wraith_calder",
      "the_seer",
      "dmc_clone_companion",
      "the_oracle",
    ];
    for (const key of expected) {
      expect(keys).toContain(key);
    }
  });

  it("every NPC has a non-empty trustBands ladder", () => {
    for (const [key, profile] of Object.entries(NPC_REGISTRY)) {
      expect(profile.trustBands.length, `${key} trustBands non-empty`).toBeGreaterThan(0);
    }
  });

  it("every NPC's trustBands ladder is monotonically increasing by threshold", () => {
    for (const [key, profile] of Object.entries(NPC_REGISTRY)) {
      let prev = -1;
      for (const def of profile.trustBands) {
        expect(def.threshold, `${key} ${def.band}`).toBeGreaterThanOrEqual(prev);
        prev = def.threshold;
      }
    }
  });

  it("first band threshold is always 0 (canonical entry-band)", () => {
    for (const [key, profile] of Object.entries(NPC_REGISTRY)) {
      expect(profile.trustBands[0]?.threshold, `${key} first-band threshold`).toBe(0);
    }
  });

  it("every NPC has a name", () => {
    for (const [key, profile] of Object.entries(NPC_REGISTRY)) {
      expect(profile.name, `${key} name`).toBeTruthy();
    }
  });
});

describe("resolveTrustBand", () => {
  it("returns first band for trust=0", () => {
    expect(resolveTrustBand("adjudicator_locke", 0)).toBe("Prospect");
    expect(resolveTrustBand("the_seer", 0)).toBe("Wary");
    expect(resolveTrustBand("wraith_calder", 0)).toBe("Hostile");
  });

  it("returns last band for trust=100", () => {
    expect(resolveTrustBand("adjudicator_locke", 100)).toBe("Adjudicated");
    expect(resolveTrustBand("the_seer", 100)).toBe("Inheriting");
    expect(resolveTrustBand("wraith_calder", 100)).toBe("Inheriting");
  });

  it("returns the highest band whose threshold ≤ trust (Locke)", () => {
    // LOCKE_BANDS: Prospect=0 / Client=20 / Partner=40 / Insider=60 / Adjudicated=80
    expect(resolveTrustBand("adjudicator_locke", 19)).toBe("Prospect");
    expect(resolveTrustBand("adjudicator_locke", 20)).toBe("Client");
    expect(resolveTrustBand("adjudicator_locke", 39)).toBe("Client");
    expect(resolveTrustBand("adjudicator_locke", 40)).toBe("Partner");
    expect(resolveTrustBand("adjudicator_locke", 79)).toBe("Insider");
    expect(resolveTrustBand("adjudicator_locke", 80)).toBe("Adjudicated");
  });

  it("returns the highest band whose threshold ≤ trust (Hierophant 5-band)", () => {
    expect(resolveTrustBand("wraith_calder", 19)).toBe("Hostile");
    expect(resolveTrustBand("wraith_calder", 20)).toBe("Wary");
    expect(resolveTrustBand("wraith_calder", 40)).toBe("Witnessed");
    expect(resolveTrustBand("wraith_calder", 60)).toBe("Present");
    expect(resolveTrustBand("wraith_calder", 80)).toBe("Inheriting");
  });
});

describe("isKnownBand", () => {
  it("validates known Locke bands", () => {
    expect(isKnownBand("adjudicator_locke", "Prospect")).toBe(true);
    expect(isKnownBand("adjudicator_locke", "Adjudicated")).toBe(true);
  });
  it("rejects unknown bands", () => {
    expect(isKnownBand("adjudicator_locke", "NotABand")).toBe(false);
    expect(isKnownBand("adjudicator_locke", "")).toBe(false);
  });
  it("rejects valid-band-on-wrong-NPC", () => {
    // Hierophant has "Hostile"; Locke does not.
    expect(isKnownBand("adjudicator_locke", "Hostile")).toBe(false);
  });
});

describe("isKnownRevealStage", () => {
  it("validates Vex 4-stage canon", () => {
    expect(isKnownRevealStage("vex_solene", "eyes_of_reality")).toBe(true);
    expect(isKnownRevealStage("vex_solene", "vex_public")).toBe(true);
    expect(isKnownRevealStage("vex_solene", "engineer_zero_hint")).toBe(true);
    expect(isKnownRevealStage("vex_solene", "engineer_zero_confirmed")).toBe(true);
  });
  it("validates Hierophant 2-stage canon", () => {
    expect(isKnownRevealStage("wraith_calder", "pre_arena")).toBe(true);
    expect(isKnownRevealStage("wraith_calder", "post_arena")).toBe(true);
    expect(isKnownRevealStage("wraith_calder", "mid_arena")).toBe(false);
  });
  it("returns false for NPCs without revealStages", () => {
    expect(isKnownRevealStage("adjudicator_locke", "any")).toBe(false);
    expect(isKnownRevealStage("the_seer", "any")).toBe(false);
  });
});
