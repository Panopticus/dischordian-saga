import { describe, it, expect } from "vitest";
import { generateApprentice } from "./apprentices";
import {
  emptyCohortState,
  recruitIntoSlot,
  promoteToActive,
  vacateSlot,
  hasTrainingCapacity,
  hasActiveCapacity,
  nextEmptyTrainingSlot,
  computeCrossCohortPullup,
  resolveDailyMath,
  detectTriangleEvents,
} from "./apprenticeCohort";

describe("apprenticeCohort", () => {
  describe("slot management", () => {
    it("empty state has all slots empty", () => {
      const s = emptyCohortState();
      expect(hasActiveCapacity(s)).toBe(true);
      expect(hasTrainingCapacity(s)).toBe(true);
      expect(nextEmptyTrainingSlot(s)).toBe("training_a");
    });

    it("recruit into active slot", () => {
      let s = emptyCohortState();
      const a = generateApprentice({ forceArchetype: "zealot" });
      s = recruitIntoSlot(s, "active", a, "compliant_mouth");
      expect(s.slots.active.apprenticeId).toBe(a.id);
      expect(s.totalRecruited).toBe(1);
      expect(hasActiveCapacity(s)).toBe(false);
    });

    it("recruit into both training slots", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "forked_path");
      expect(nextEmptyTrainingSlot(s)).toBe("training_b");
      s = recruitIntoSlot(s, "training_b", generateApprentice(), "human_remainder");
      expect(nextEmptyTrainingSlot(s)).toBeNull();
      expect(hasTrainingCapacity(s)).toBe(false);
    });

    it("recruit into occupied slot throws", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      expect(() =>
        recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth"),
      ).toThrow();
    });

    it("promote training_a to active when active is empty", () => {
      let s = emptyCohortState();
      const t = generateApprentice({ forceArchetype: "ghost" });
      s = recruitIntoSlot(s, "training_a", t, "heretical_quiet");
      s = promoteToActive(s, "training_a");
      expect(s.slots.active.apprenticeId).toBe(t.id);
      expect(s.slots.training_a.apprenticeId).toBeNull();
    });

    it("promote when active occupied throws", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "forked_path");
      expect(() => promoteToActive(s, "training_a")).toThrow();
    });

    it("vacate increments correct counter", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      s = vacateSlot(s, "active", "graduated");
      expect(s.totalGraduated).toBe(1);
      const s2 = vacateSlot(s, "active", "fallen");
      expect(s2.totalFallen).toBe(1);
    });
  });

  describe("cross-cohort pullup", () => {
    it("shared doctrine pulls bond up for both", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "compliant_mouth");
      const pull = computeCrossCohortPullup(s);
      expect(pull.bondDailyDelta.active).toBeGreaterThan(0);
      expect(pull.bondDailyDelta.training_a).toBeGreaterThan(0);
      expect(pull.notes.length).toBeGreaterThan(0);
    });

    it("dissonant doctrines pull corruption up", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "heretical_quiet");
      const pull = computeCrossCohortPullup(s);
      expect(pull.corruptionDailyDelta.active).toBeGreaterThan(0);
      expect(pull.corruptionDailyDelta.training_a).toBeGreaterThan(0);
    });

    it("single-occupied cohort produces no pulls", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      const pull = computeCrossCohortPullup(s);
      expect(pull.notes.length).toBe(0);
      expect(pull.bondDailyDelta.active).toBe(0);
    });
  });

  describe("resolveDailyMath", () => {
    it("returns identity for empty slot", () => {
      const s = emptyCohortState();
      const r = resolveDailyMath(s, "active", "zealot");
      expect(r.bondMultiplier).toBe(1);
      expect(r.corruptionMultiplier).toBe(1);
    });

    it("combines doctrine multiplier with cross-cohort additive", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice({ forceArchetype: "zealot" }), "compliant_mouth");
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "compliant_mouth");
      const r = resolveDailyMath(s, "active", "zealot");
      expect(r.bondMultiplier).toBeGreaterThan(1);
      expect(r.bondAdditive).toBeGreaterThan(0);
    });
  });

  describe("triangle events", () => {
    it("detects warning when one cohort member rises above 60 and another bonded above 70", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "forked_path");
      const triggers = detectTriangleEvents(s, {
        active: { bond: 80, corruption: 5 },
        training_a: { bond: 30, corruption: 65 },
        training_b: null,
      });
      expect(triggers.length).toBeGreaterThan(0);
      expect(triggers[0].fallingSlot).toBe("training_a");
      expect(triggers[0].observingSlot).toBe("active");
    });

    it("no triggers when no observer is bonded above 70", () => {
      let s = emptyCohortState();
      s = recruitIntoSlot(s, "active", generateApprentice(), "compliant_mouth");
      s = recruitIntoSlot(s, "training_a", generateApprentice(), "forked_path");
      const triggers = detectTriangleEvents(s, {
        active: { bond: 30, corruption: 5 },
        training_a: { bond: 30, corruption: 65 },
        training_b: null,
      });
      expect(triggers.length).toBe(0);
    });
  });
});
