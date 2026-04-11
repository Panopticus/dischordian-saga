import { describe, it, expect } from "vitest";
import {
  bridgePetIntoCrewLineage,
  type LegacyCrewInput,
  type LegacyPetInput,
} from "./petCrewLegacyBridge";

describe("petCrewLegacyBridge — Appendix A.6", () => {
  const baseCrew: LegacyCrewInput = {
    lineageId: "house_vale",
    baseStats: {
      resilience: 50,
      intellect: 50,
      reflexes: 50,
      empathy: 50,
      immunity: 50,
      adaptability: 50,
    },
    markers: ["tool_affinity"],
  };

  it("adds pet trait markers to the descendant", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 80,
      traitMarkers: ["stellar_sight", "low_hp_memory"],
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    expect(out.markers).toContain("tool_affinity");
    expect(out.markers).toContain("stellar_sight");
    expect(out.markers).toContain("low_hp_memory");
  });

  it("deduplicates overlapping markers", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 80,
      traitMarkers: ["tool_affinity", "stellar_sight"],
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    const affinityCount = out.markers.filter((m) => m === "tool_affinity")
      .length;
    expect(affinityCount).toBe(1);
  });

  it("contributes zero stat deltas at bond 0", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 0,
      traitMarkers: [],
      statContribution: { intellect: 100, resilience: 100 },
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    expect(out.stats.intellect).toBe(50);
    expect(out.stats.resilience).toBe(50);
  });

  it("contributes 25% scaled stats at bond 100", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 100,
      traitMarkers: [],
      statContribution: { intellect: 40 },
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    // 50 base + round(40 * 0.25) = 50 + 10 = 60
    expect(out.stats.intellect).toBe(60);
  });

  it("chronicle line reflects deep bond at >=80", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 95,
      traitMarkers: [],
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    expect(out.chronicleLine.toLowerCase()).toContain("deep");
  });

  it("chronicle line reflects no-bond at 0", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 0,
      traitMarkers: [],
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    expect(out.chronicleLine.toLowerCase()).toContain("not strong");
  });

  it("preserves the lineage id", () => {
    const pet: LegacyPetInput = {
      petId: "lux",
      name: "Lux",
      bond: 50,
      traitMarkers: [],
    };
    const out = bridgePetIntoCrewLineage(pet, baseCrew);
    expect(out.lineageId).toBe("house_vale");
  });
});
