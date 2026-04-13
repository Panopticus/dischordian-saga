import { describe, it, expect } from "vitest";
import {
  computeCreationModifiers,
  getEndingBias,
  getFlavoredGreeting,
  getElementDamageMultiplier,
  getTrustMultiplier,
  canAccessRoom,
  SPECIES_GATED_CONTENT,
  ELEMENT_OPPOSITIONS,
  type CreationSignature,
} from "./characterCreationImpact";

const baseSig: CreationSignature = {
  species: "demagi",
  element: "fire",
  alignment: "order",
  characterClass: "soldier",
};

describe("characterCreationImpact", () => {
  describe("computeCreationModifiers", () => {
    it("returns valid modifiers", () => {
      const mods = computeCreationModifiers(baseSig);
      expect(mods.elementDamageBonus).toBeGreaterThan(0);
      expect(mods.elementResistance).toBeGreaterThan(0);
      expect(mods.elementVulnerability).toBeGreaterThan(0);
      expect(mods.trustMultiplierAligned).toBeGreaterThan(1);
      expect(mods.trustMultiplierOpposed).toBeLessThan(1);
    });

    it("includes species room keys", () => {
      const mods = computeCreationModifiers(baseSig);
      expect(mods.speciesRoomKeys.length).toBeGreaterThan(0);
    });

    it("dialog tags include all four creation aspects", () => {
      const mods = computeCreationModifiers(baseSig);
      expect(mods.dialogTags).toContain("species:demagi");
      expect(mods.dialogTags).toContain("element:fire");
      expect(mods.dialogTags).toContain("alignment:order");
      expect(mods.dialogTags).toContain("class:soldier");
    });
  });

  describe("getEndingBias", () => {
    it("order → restoration bias", () => {
      const bias = getEndingBias({ ...baseSig, alignment: "order" });
      expect(bias.restoration).toBeGreaterThan(0);
    });

    it("chaos → transformation bias", () => {
      const bias = getEndingBias({ ...baseSig, alignment: "chaos" });
      expect(bias.transformation).toBeGreaterThan(0);
    });

    it("envoy → alliance bias", () => {
      const bias = getEndingBias({ ...baseSig, characterClass: "envoy" });
      expect(bias.alliance).toBeGreaterThan(0);
    });

    it("soldier → sacrifice bias", () => {
      const bias = getEndingBias({ ...baseSig, characterClass: "soldier" });
      expect(bias.sacrifice).toBeGreaterThan(0);
    });
  });

  describe("getElementDamageMultiplier", () => {
    const mods = computeCreationModifiers(baseSig);

    it("opposing element = bonus damage", () => {
      const opposing = ELEMENT_OPPOSITIONS["fire"];
      const mult = getElementDamageMultiplier("fire", opposing, mods);
      expect(mult).toBeGreaterThan(1);
    });

    it("same element = reduced damage (resistance)", () => {
      const mult = getElementDamageMultiplier("fire", "fire", mods);
      expect(mult).toBeLessThan(1);
    });

    it("unrelated elements = neutral (1.0)", () => {
      const mult = getElementDamageMultiplier("earth", "time", mods);
      expect(mult).toBe(1);
    });
  });

  describe("getTrustMultiplier", () => {
    const mods = computeCreationModifiers(baseSig);

    it("returns 1 for NPCs with no affinity record", () => {
      expect(getTrustMultiplier("unknown_npc", baseSig, mods)).toBe(1);
    });
  });

  describe("canAccessRoom", () => {
    it("species can access its own exclusive rooms", () => {
      const demagiRooms = SPECIES_GATED_CONTENT.demagi.exclusiveRooms;
      for (const room of demagiRooms) {
        expect(canAccessRoom(room.id, baseSig)).toBe(true);
      }
    });

    it("species cannot access other species' rooms", () => {
      const quarchonRooms = SPECIES_GATED_CONTENT.quarchon.exclusiveRooms;
      for (const room of quarchonRooms) {
        expect(canAccessRoom(room.id, baseSig)).toBe(false);
      }
    });

    it("non-gated rooms accessible to all species", () => {
      expect(canAccessRoom("some_random_room", baseSig)).toBe(true);
    });
  });

  describe("getFlavoredGreeting", () => {
    it("returns null for NPCs without a greeting", () => {
      expect(getFlavoredGreeting("unknown_npc", baseSig)).toBeNull();
    });

    it("returns species-exclusive line for matching NPC", () => {
      // The Source has an exclusive line for demagi
      const greeting = getFlavoredGreeting("the_source", { ...baseSig, species: "demagi" });
      expect(greeting).toBeTruthy();
    });
  });
});
