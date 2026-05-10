import { describe, it, expect } from "vitest";
import {
  archetypeRollWeights,
  pickArchetypeWeighted,
  seedArchitectInfluence,
  dailyArchitectInfluenceDelta,
  deepenIsArchitectCoopted,
  deepenIsArchitectOwned,
  getMentorSignature,
  whyThisArchetype,
  MENTOR_SIGNATURES,
  EMPTY_MECHRONIS_CONTEXT,
  type MechronisGenContext,
} from "./apprenticeMechronisLink";

const seededRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

const ctxWith = (overrides: Partial<MechronisGenContext["transcript"]> = {}, morality = 0): MechronisGenContext => ({
  transcript: { ...EMPTY_MECHRONIS_CONTEXT.transcript, ...overrides },
  playerMorality: morality,
});

describe("apprenticeMechronisLink", () => {
  describe("archetypeRollWeights", () => {
    it("produces a positive weight for every archetype", () => {
      const w = archetypeRollWeights(EMPTY_MECHRONIS_CONTEXT);
      expect(Object.keys(w).length).toBe(12);
      for (const v of Object.values(w)) expect(v).toBeGreaterThan(0);
    });

    it("biases the bowl toward Zealot/Sentinel under House Resonance", () => {
      const w = archetypeRollWeights(ctxWith({ houseId: "house_resonance" }));
      expect(w.zealot).toBeGreaterThan(w.heretic);
      expect(w.sentinel).toBeGreaterThan(w.ghost);
    });

    it("biases the bowl toward Ghost/Heretic under House Umbra", () => {
      const w = archetypeRollWeights(ctxWith({ houseId: "house_umbra" }));
      expect(w.ghost).toBeGreaterThan(w.zealot);
      expect(w.heretic).toBeGreaterThan(w.sentinel);
    });

    it("detentions push the bowl toward Heretic/Ghost/Wanderer", () => {
      const baseline = archetypeRollWeights(ctxWith({ detentionCount: 0 }));
      const punished = archetypeRollWeights(ctxWith({ detentionCount: 8 }));
      expect(punished.heretic).toBeGreaterThan(baseline.heretic);
      expect(punished.zealot).toBeLessThan(baseline.zealot);
    });

    it("compliance pulls bowl toward Zealot/Sentinel/Martyr", () => {
      const baseline = archetypeRollWeights(ctxWith({ complianceScore: 50 }));
      const compliant = archetypeRollWeights(ctxWith({ complianceScore: 95 }));
      expect(compliant.zealot).toBeGreaterThan(baseline.zealot);
    });
  });

  describe("pickArchetypeWeighted", () => {
    it("returns a valid archetype across many rolls", () => {
      const rng = seededRng(42);
      const seen = new Set<string>();
      for (let i = 0; i < 200; i++) {
        seen.add(pickArchetypeWeighted(EMPTY_MECHRONIS_CONTEXT, rng));
      }
      // At least 8 of 12 should appear in 200 rolls.
      expect(seen.size).toBeGreaterThanOrEqual(8);
    });

    it("biased context concentrates picks toward favored archetypes", () => {
      const rng = seededRng(99);
      const counts: Record<string, number> = {};
      for (let i = 0; i < 300; i++) {
        const a = pickArchetypeWeighted(ctxWith({ houseId: "house_umbra" }), rng);
        counts[a] = (counts[a] ?? 0) + 1;
      }
      expect((counts.ghost ?? 0)).toBeGreaterThan((counts.zealot ?? 0));
    });
  });

  describe("seedArchitectInfluence", () => {
    it("returns 0..100 for every narrative cohort", () => {
      for (const cohort of ["pre_fall", "fall_year", "post_fall", "compliance_native"] as const) {
        const seed = seedArchitectInfluence(ctxWith({ narrativeCohort: cohort }));
        expect(seed).toBeGreaterThanOrEqual(0);
        expect(seed).toBeLessThanOrEqual(100);
      }
    });

    it("compliance_native cohort seeds higher than pre_fall", () => {
      const compliance = seedArchitectInfluence(ctxWith({ narrativeCohort: "compliance_native" }));
      const preFall = seedArchitectInfluence(ctxWith({ narrativeCohort: "pre_fall" }));
      expect(compliance).toBeGreaterThan(preFall);
    });
  });

  describe("dailyArchitectInfluenceDelta", () => {
    it("high bond above 50 reduces influence accrual", () => {
      const ctx = ctxWith({ topProfessorId: "prof_conductor" });
      const lowBond = dailyArchitectInfluenceDelta({ ctx, bond: 20, auditCompliance: 0 });
      const highBond = dailyArchitectInfluenceDelta({ ctx, bond: 90, auditCompliance: 0 });
      expect(highBond).toBeLessThan(lowBond);
    });

    it("audit compliance increases influence accrual", () => {
      const ctx = ctxWith({ topProfessorId: "prof_human" });
      const compliantStudent = dailyArchitectInfluenceDelta({ ctx, bond: 50, auditCompliance: 3 });
      const withholdingStudent = dailyArchitectInfluenceDelta({ ctx, bond: 50, auditCompliance: 0 });
      expect(compliantStudent).toBeGreaterThan(withholdingStudent);
    });
  });

  describe("deepenIsArchitectCoopted/Owned", () => {
    it("threshold 60 cooptation, 80 ownership", () => {
      expect(deepenIsArchitectCoopted(59)).toBe(false);
      expect(deepenIsArchitectCoopted(60)).toBe(true);
      expect(deepenIsArchitectOwned(79)).toBe(false);
      expect(deepenIsArchitectOwned(80)).toBe(true);
    });
  });

  describe("MENTOR_SIGNATURES", () => {
    it("has all 12 professors authored", () => {
      const ids = Object.keys(MENTOR_SIGNATURES);
      expect(ids.length).toBe(12);
      for (const id of ids) {
        const sig = getMentorSignature(id as keyof typeof MENTOR_SIGNATURES);
        expect(sig).not.toBeNull();
        expect(sig?.label.length).toBeGreaterThan(3);
        expect(sig?.flavor.length).toBeGreaterThan(20);
      }
    });

    it("Humanist Pedagogy actually reduces influence per day", () => {
      expect(MENTOR_SIGNATURES.prof_human.architectInfluencePerDay).toBeLessThan(0);
    });
  });

  describe("whyThisArchetype", () => {
    it("explains House attraction", () => {
      const text = whyThisArchetype("ghost", ctxWith({ houseId: "house_umbra" }));
      expect(text.toLowerCase()).toContain("umbra");
    });

    it("falls back to a default explanation", () => {
      const text = whyThisArchetype("artisan", EMPTY_MECHRONIS_CONTEXT);
      expect(text.length).toBeGreaterThan(5);
    });
  });
});
