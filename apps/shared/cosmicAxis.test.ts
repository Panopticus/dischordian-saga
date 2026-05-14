/* ═══════════════════════════════════════════════════════
   COSMIC AXIS — Cross-registry integrity tests

   Validates the Dreamer-Architect twin canon and the
   cross-registry invariants between Ne-Yons and Archons.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  ANTIQUARIAN_CHRONICLE_POLE,
  assertCosmicAxisIntegrity,
  FIRST_INTELLIGENCE,
  getCosmicAxisInvariants,
  getCosmicPoleForCharacter,
  getDreamerCanon,
} from "./cosmicAxis";

describe("Cosmic Axis — the Dreamer-Architect twin canon", () => {
  it("canonically locks the Dreamer as the backward-looking half", () => {
    expect(FIRST_INTELLIGENCE.dreamer.timeDirection).toBe("backward");
    expect(FIRST_INTELLIGENCE.dreamer.id).toBe("the_dreamer");
  });

  it("canonically locks the Architect as the forward-looking half", () => {
    expect(FIRST_INTELLIGENCE.architect.timeDirection).toBe("forward");
    expect(FIRST_INTELLIGENCE.architect.id).toBe("the_architect");
  });

  it("both halves have 12-roster anchors (Ne-Yons + Archons)", () => {
    expect(FIRST_INTELLIGENCE.dreamer.rosterSize).toBe(12);
    expect(FIRST_INTELLIGENCE.architect.rosterSize).toBe(12);
  });

  it("the Dreamer canonically holds Ne-Yon position #1", () => {
    const dreamer = getDreamerCanon();
    expect(dreamer.position).toBe(1);
    expect(dreamer.id).toBe("the_dreamer");
  });

  it("the Antiquarian's chronicle is canonically Dreamer-pole-aligned", () => {
    // Per `apps/shared/silenceInHeavenTracklist.ts:67` (Antiquarian =
    // Dr. Daniel Cross / The Programmer) + `concept_two_witnesses`
    // Loredex binding, the Antiquarian's chronicle records the
    // Dreamer's chronicle-side history.
    expect(ANTIQUARIAN_CHRONICLE_POLE).toBe("dreamer");
  });

  it("getCosmicPoleForCharacter returns 'dreamer' for the Dreamer", () => {
    expect(getCosmicPoleForCharacter("the_dreamer")).toBe("dreamer");
  });

  it("getCosmicPoleForCharacter returns 'architect' for the Architect", () => {
    expect(getCosmicPoleForCharacter("the_architect")).toBe("architect");
  });

  it("getCosmicPoleForCharacter returns null for pole-orthogonal characters", () => {
    // Most characters walk BETWEEN the poles — they are not the poles
    // themselves. Examples: the Degen (Ne-Yon but not pole),
    // the Game Master (Archon but not pole).
    expect(getCosmicPoleForCharacter("the_degen")).toBeNull();
    expect(getCosmicPoleForCharacter("the_game_master")).toBeNull();
    expect(getCosmicPoleForCharacter("the_enigma")).toBeNull();
  });

  describe("invariants", () => {
    it("Ne-Yon registry is fully populated (12 of 12)", () => {
      const inv = getCosmicAxisInvariants();
      expect(inv.neYonsRegistered).toBe(inv.neYonCanonicalCount);
    });

    it("Architect is NOT in the Archon registry", () => {
      const inv = getCosmicAxisInvariants();
      expect(inv.architectIsRegistryEntry).toBe(false);
    });

    it("Dreamer's canonical position is #1", () => {
      const inv = getCosmicAxisInvariants();
      expect(inv.dreamerCanonPosition).toBe(1);
    });

    it("assertCosmicAxisIntegrity throws no errors when canon is intact", () => {
      expect(() => assertCosmicAxisIntegrity()).not.toThrow();
    });
  });
});
