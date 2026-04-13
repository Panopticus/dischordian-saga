import { describe, it, expect } from "vitest";
import {
  CLASS_SECTOR_ACCESS,
  CLASS_EXCLUSIVE_MISSIONS,
  SPY_COVER_IDENTITIES,
  classCanEnterSector,
} from "./classTradeAccess";

describe("classTradeAccess", () => {
  describe("CLASS_SECTOR_ACCESS", () => {
    it("has exactly five class keys", () => {
      expect(Object.keys(CLASS_SECTOR_ACCESS).sort()).toEqual(
        ["assassin", "engineer", "oracle", "soldier", "spy"],
      );
    });

    it("Engineer gets three Research Corridor sectors", () => {
      expect(CLASS_SECTOR_ACCESS.engineer).toHaveLength(3);
      expect(CLASS_SECTOR_ACCESS.engineer).toContain("research_corridor_alpha");
    });

    it("each non-engineer class has at least one exclusive sector", () => {
      for (const cls of ["oracle", "assassin", "soldier", "spy"] as const) {
        expect(CLASS_SECTOR_ACCESS[cls].length).toBeGreaterThan(0);
      }
    });

    it("sector access lists are disjoint across classes", () => {
      const seen = new Set<string>();
      for (const cls of Object.keys(CLASS_SECTOR_ACCESS) as Array<keyof typeof CLASS_SECTOR_ACCESS>) {
        for (const sectorId of CLASS_SECTOR_ACCESS[cls]) {
          expect(seen.has(sectorId)).toBe(false);
          seen.add(sectorId);
        }
      }
    });
  });

  describe("CLASS_EXCLUSIVE_MISSIONS", () => {
    it("every class has at least one mission", () => {
      for (const cls of Object.keys(CLASS_EXCLUSIVE_MISSIONS) as Array<keyof typeof CLASS_EXCLUSIVE_MISSIONS>) {
        expect(CLASS_EXCLUSIVE_MISSIONS[cls].length).toBeGreaterThan(0);
      }
    });

    it("every mission's targetSectorId is allowed for its class (or is a shared sector)", () => {
      for (const cls of Object.keys(CLASS_EXCLUSIVE_MISSIONS) as Array<keyof typeof CLASS_EXCLUSIVE_MISSIONS>) {
        const classSectors = new Set(CLASS_SECTOR_ACCESS[cls]);
        for (const mission of CLASS_EXCLUSIVE_MISSIONS[cls]) {
          const isClassExclusive = classSectors.has(mission.targetSectorId);
          // Some missions target shared sectors like new_babylon_core or black_hole_gate.
          // Those are not in the exclusive list but are valid targets.
          const sharedAllowlist = [
            "new_babylon_core",
            "black_hole_gate",
            "trade_nexus",
            "free_ports",
            "frontier_worlds",
            "atarion_ruins",
          ];
          expect(isClassExclusive || sharedAllowlist.includes(mission.targetSectorId)).toBe(true);
        }
      }
    });
  });

  describe("SPY_COVER_IDENTITIES", () => {
    it("has a cover for each Species variant", () => {
      const species = SPY_COVER_IDENTITIES.map((c) => c.disguiseAsSpecies);
      expect(species).toContain("demagi");
      expect(species).toContain("quarchon");
      expect(species).toContain("neyon");
    });

    it("every cover has a positive durability and duration", () => {
      for (const c of SPY_COVER_IDENTITIES) {
        expect(c.durability).toBeGreaterThan(0);
        expect(c.durationHours).toBeGreaterThan(0);
      }
    });
  });

  describe("classCanEnterSector", () => {
    const sectors = [
      { id: "research_corridor_alpha", accessRequirement: { class: "engineer" } },
      { id: "public_sector", accessRequirement: undefined },
      { id: "flag_locked", accessRequirement: { flag: "quest_ch1_done" } },
    ];

    it("allows access to a public sector for any class", () => {
      expect(classCanEnterSector("oracle", "public_sector", {}, sectors)).toBe(true);
    });

    it("denies non-engineer access to the Research Corridor", () => {
      expect(classCanEnterSector("oracle", "research_corridor_alpha", {}, sectors)).toBe(false);
    });

    it("allows engineer access to the Research Corridor", () => {
      expect(classCanEnterSector("engineer", "research_corridor_alpha", {}, sectors)).toBe(true);
    });

    it("respects flag-based gating", () => {
      expect(classCanEnterSector("engineer", "flag_locked", {}, sectors)).toBe(false);
      expect(classCanEnterSector("engineer", "flag_locked", { quest_ch1_done: true }, sectors)).toBe(true);
    });
  });
});
