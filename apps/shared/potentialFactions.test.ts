import { describe, it, expect } from "vitest";
import {
  DEMAGI_FACTIONS,
  QUARCHON_FACTIONS,
  ALL_POTENTIAL_FACTIONS,
  POTENTIAL_FACTION_INDEX,
  UNITY_CONTRIBUTIONS,
  UNITY_TEXT,
  UNITY_THRESHOLDS,
  getUnityPhase,
  applyUnityContribution,
  type UnityPhase,
} from "./potentialFactions";

describe("potentialFactions", () => {
  describe("faction data", () => {
    it("has 4 DeMagi factions and 4 Quarchon factions", () => {
      expect(DEMAGI_FACTIONS).toHaveLength(4);
      expect(QUARCHON_FACTIONS).toHaveLength(4);
      expect(ALL_POTENTIAL_FACTIONS).toHaveLength(8);
    });

    it("every faction is indexed by id", () => {
      for (const f of ALL_POTENTIAL_FACTIONS) {
        expect(POTENTIAL_FACTION_INDEX[f.id]).toEqual(f);
      }
    });

    it("exactly one DeMagi and one Quarchon faction is extremist", () => {
      expect(DEMAGI_FACTIONS.filter((f) => f.extremist)).toHaveLength(1);
      expect(QUARCHON_FACTIONS.filter((f) => f.extremist)).toHaveLength(1);
    });

    it("extremist factions are hidden and non-extremist are public", () => {
      for (const f of ALL_POTENTIAL_FACTIONS) {
        if (f.extremist) {
          expect(f.publicVisibility).toBe("hidden");
        } else {
          expect(f.publicVisibility).toBe("public");
        }
      }
    });

    it("every faction has a questChapterFlag snake-case string", () => {
      for (const f of ALL_POTENTIAL_FACTIONS) {
        expect(f.questChapterFlag).toMatch(/^[a-z0-9_]+$/);
      }
    });
  });

  describe("Unity Meter", () => {
    it("has display text for every phase", () => {
      const phases: UnityPhase[] = [
        "fracturing", "tense", "contested", "negotiating", "converging", "unified",
      ];
      for (const p of phases) {
        expect(UNITY_TEXT[p]).toBeTruthy();
      }
    });

    it("thresholds partition [0, 100]", () => {
      expect(UNITY_THRESHOLDS.fracturing.min).toBe(0);
      expect(UNITY_THRESHOLDS.fracturing.max).toBe(20);
      expect(UNITY_THRESHOLDS.tense.min).toBe(20);
      expect(UNITY_THRESHOLDS.converging.max).toBe(100);
    });

    it("getUnityPhase maps percents to phases correctly", () => {
      expect(getUnityPhase(0)).toBe("fracturing");
      expect(getUnityPhase(19)).toBe("fracturing");
      expect(getUnityPhase(20)).toBe("tense");
      expect(getUnityPhase(40)).toBe("contested");
      expect(getUnityPhase(60)).toBe("negotiating");
      expect(getUnityPhase(80)).toBe("converging");
      expect(getUnityPhase(99)).toBe("converging");
      expect(getUnityPhase(100)).toBe("unified");
    });

    it("clamps values outside [0,100]", () => {
      expect(getUnityPhase(-50)).toBe("fracturing");
      expect(getUnityPhase(500)).toBe("unified");
    });

    it("contribution table includes spec-canonical values", () => {
      expect(UNITY_CONTRIBUTIONS.questline_third_path).toBe(20);
      expect(UNITY_CONTRIBUTIONS.questline_mediation).toBe(15);
      expect(UNITY_CONTRIBUTIONS.questline_cross_faction_research).toBe(10);
      expect(UNITY_CONTRIBUTIONS.questline_extremist_act).toBe(-20);
      expect(UNITY_CONTRIBUTIONS.questline_formal_affiliation).toBe(-5);
      expect(UNITY_CONTRIBUTIONS.questline_vortex_both_species).toBe(50);
      expect(UNITY_CONTRIBUTIONS.questline_dischordia_cross_species_win).toBe(3);
    });

    it("applyUnityContribution walks phases on cumulative increments", () => {
      let pct = 15;
      pct = applyUnityContribution(pct, "questline_third_path"); // +20 -> 35
      expect(getUnityPhase(pct)).toBe("tense");
      pct = applyUnityContribution(pct, "questline_mediation"); // +15 -> 50
      expect(getUnityPhase(pct)).toBe("contested");
      pct = applyUnityContribution(pct, "questline_vortex_both_species"); // +50 -> 100
      expect(getUnityPhase(pct)).toBe("unified");
    });

    it("cannot exceed 100 or go below 0", () => {
      expect(applyUnityContribution(99, "questline_vortex_both_species")).toBe(100);
      expect(applyUnityContribution(5, "questline_extremist_act")).toBe(0);
    });
  });
});
