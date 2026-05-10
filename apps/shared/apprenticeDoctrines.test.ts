import { describe, it, expect } from "vitest";
import {
  DOCTRINES,
  getDoctrine,
  listDoctrines,
  combinedCorruptionMultiplier,
  combinedBondMultiplier,
  isRolePermitted,
  forbiddenRoles,
  stanzaForBeat,
  doctrineArchitectInfluencePerDay,
  doctrineEvilRollMultiplier,
  recommendedDoctrineFor,
  type DoctrineId,
} from "./apprenticeDoctrines";

describe("apprenticeDoctrines", () => {
  describe("DOCTRINES table", () => {
    it("declares all 5 doctrines", () => {
      expect(listDoctrines().length).toBe(5);
    });

    it("every doctrine has ≥4 stanzas with morning + at_graduation", () => {
      for (const d of listDoctrines()) {
        expect(d.stanzas.length).toBeGreaterThanOrEqual(4);
        expect(d.stanzas.some(s => s.recitedAt === "morning")).toBe(true);
        expect(d.stanzas.some(s => s.recitedAt === "at_graduation")).toBe(true);
      }
    });

    it("every doctrine permits the companion role", () => {
      for (const d of listDoctrines()) {
        expect(d.permittedRoles.has("companion")).toBe(true);
      }
    });

    it("Heretical Quiet is criminalized; Compliant Mouth is favored", () => {
      expect(DOCTRINES.heretical_quiet.mechronisStance).toBe("criminalized");
      expect(DOCTRINES.compliant_mouth.mechronisStance).toBe("favored");
    });
  });

  describe("combined math", () => {
    it("resonant archetype reduces corruption multiplier", () => {
      const baseline = DOCTRINES.compliant_mouth.corruptionMultiplier;
      const resonant = combinedCorruptionMultiplier("zealot", "compliant_mouth");
      expect(resonant).toBeLessThan(baseline);
    });

    it("dissonant archetype raises corruption multiplier", () => {
      const baseline = DOCTRINES.compliant_mouth.corruptionMultiplier;
      const dissonant = combinedCorruptionMultiplier("heretic", "compliant_mouth");
      expect(dissonant).toBeGreaterThan(baseline);
    });

    it("resonant archetype boosts bond multiplier", () => {
      const baseline = DOCTRINES.human_remainder.bondMultiplier;
      const resonant = combinedBondMultiplier("martyr", "human_remainder");
      expect(resonant).toBeGreaterThan(baseline);
    });
  });

  describe("role gating", () => {
    it("Heretical Quiet forbids army_leader and tower_captain", () => {
      expect(isRolePermitted("heretical_quiet", "army_leader")).toBe(false);
      expect(isRolePermitted("heretical_quiet", "tower_captain")).toBe(false);
    });

    it("Cold Hand permits army_leader and forbids trade_envoy", () => {
      expect(isRolePermitted("cold_hand", "army_leader")).toBe(true);
      expect(isRolePermitted("cold_hand", "trade_envoy")).toBe(false);
    });

    it("forbiddenRoles returns the inverse of permittedRoles", () => {
      const forbidden = forbiddenRoles("heretical_quiet");
      for (const r of forbidden) expect(isRolePermitted("heretical_quiet", r)).toBe(false);
    });
  });

  describe("stanzas + influence + evil-roll", () => {
    it("stanzaForBeat returns the right stanza", () => {
      const morning = stanzaForBeat("compliant_mouth", "morning");
      expect(morning).not.toBeNull();
      expect(morning?.line.toLowerCase()).toContain("mouth");
    });

    it("Heretical Quiet has negative architect influence per day", () => {
      expect(doctrineArchitectInfluencePerDay("heretical_quiet")).toBeLessThan(0);
    });

    it("Heretical Quiet evil-roll multiplier > 1; Compliant Mouth < 1", () => {
      expect(doctrineEvilRollMultiplier("heretical_quiet")).toBeGreaterThan(1);
      expect(doctrineEvilRollMultiplier("compliant_mouth")).toBeLessThan(1);
    });
  });

  describe("recommendedDoctrineFor", () => {
    it("respects mentor preference when archetype is resonant", () => {
      // prof_conductor prefers compliant_mouth, zealot is resonant for it.
      const rec = recommendedDoctrineFor("zealot", "compliant_mouth");
      expect(rec).toBe("compliant_mouth");
    });

    it("falls back to an archetype-resonant doctrine when mentor mismatches", () => {
      // heretic is resonant for heretical_quiet; mentor says compliant.
      // We allow either: mentor matched OR archetype-resonant fallback.
      // The function falls back when mentor's resonance doesn't match.
      const rec = recommendedDoctrineFor("heretic", "compliant_mouth");
      expect(rec).toBeDefined();
      // heretic's resonant doctrine is heretical_quiet
      const d = getDoctrine(rec as DoctrineId);
      expect(d.resonantArchetypes).toContain("heretic");
    });
  });
});
