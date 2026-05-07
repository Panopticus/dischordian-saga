import { describe, expect, it } from "vitest";
import {
  COLLECTORS_WORK_TIER_BONUS,
  generateCollectorsWorkMission,
  generateMissionsForGeneration,
  totalCrystalYieldForMission,
} from "./collectorsWorkMissions";
import {
  BLOOD_CLASSIFICATIONS,
  CRYSTAL_YIELD_PER_CYCLE,
} from "./bloodClassification";

describe("collectorsWorkMissions", () => {
  it("tier bonus is monotonically increasing", () => {
    const tiers: Array<keyof typeof COLLECTORS_WORK_TIER_BONUS> = [
      "trivial",
      "modest",
      "patient",
      "rare",
      "apex",
    ];
    for (let i = 1; i < tiers.length; i++) {
      expect(COLLECTORS_WORK_TIER_BONUS[tiers[i]]).toBeGreaterThan(
        COLLECTORS_WORK_TIER_BONUS[tiers[i - 1]],
      );
    }
  });

  it("generates one mission per (classification, generation) pair", () => {
    for (const c of BLOOD_CLASSIFICATIONS) {
      const m = generateCollectorsWorkMission(c, 3);
      expect(m.classification).toBe(c);
      expect(m.atGeneration).toBe(3);
      expect(m.id).toBe(`cw_${c.toLowerCase()}_g3`);
    }
  });

  it("tier escalates with generation", () => {
    expect(generateCollectorsWorkMission("PURE", 1).tier).toBe("trivial");
    expect(generateCollectorsWorkMission("PURE", 2).tier).toBe("modest");
    expect(generateCollectorsWorkMission("PURE", 4).tier).toBe("patient");
    expect(generateCollectorsWorkMission("PURE", 6).tier).toBe("rare");
    expect(generateCollectorsWorkMission("PURE", 12).tier).toBe("apex");
  });

  it("totalCrystalYieldForMission sums base + bonus", () => {
    const m = generateCollectorsWorkMission("DEMONIC", 5);
    expect(totalCrystalYieldForMission(m)).toBe(
      CRYSTAL_YIELD_PER_CYCLE.DEMONIC + m.bonusCrystalYield,
    );
  });

  it("generateMissionsForGeneration emits one mission per classification", () => {
    const missions = generateMissionsForGeneration(2);
    expect(missions).toHaveLength(BLOOD_CLASSIFICATIONS.length);
    expect(new Set(missions.map((m) => m.classification))).toEqual(
      new Set(BLOOD_CLASSIFICATIONS),
    );
  });

  it("mission body is non-empty for every classification (Advocate's-voice content gate)", () => {
    for (const c of BLOOD_CLASSIFICATIONS) {
      const m = generateCollectorsWorkMission(c, 1);
      expect(m.body.length).toBeGreaterThan(20);
    }
  });

  it("generator is deterministic — same inputs → same id + tier + bonus", () => {
    const a = generateCollectorsWorkMission("ADVOCATE", 5);
    const b = generateCollectorsWorkMission("ADVOCATE", 5);
    expect(a).toEqual(b);
  });
});
