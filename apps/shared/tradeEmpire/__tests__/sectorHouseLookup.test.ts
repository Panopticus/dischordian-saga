// apps/shared/tradeEmpire/__tests__/sectorHouseLookup.test.ts
//
// Cross-feed wiring contract: the trade-empire merge depends on
// being able to map a sector → its dominant sub-house so mission
// completion can bump political reputation. These tests pin that
// mapping so a registry edit can't silently break the wiring.

import { describe, it, expect } from "vitest";
import {
  SUB_HOUSE_REGISTRY,
  subHousesForSector,
  dominantSubHouseForSector,
} from "../houses";

describe("sector → sub-house lookup", () => {
  it("returns all houses anchored at trade_nexus", () => {
    const houses = subHousesForSector("trade_nexus");
    expect(houses.length).toBeGreaterThanOrEqual(2);
    for (const h of houses) {
      expect(h.primarySectorId).toBe("trade_nexus");
    }
  });

  it("returns the_trench's four anchored houses", () => {
    const houses = subHousesForSector("the_trench");
    expect(houses.length).toBe(4);
    expect(houses.every(h => h.factionId === "hierarchy")).toBe(true);
  });

  it("dominantSubHouseForSector picks a registered house at trade_nexus", () => {
    const dominant = dominantSubHouseForSector("trade_nexus");
    expect(dominant).not.toBeNull();
    expect(dominant!.primarySectorId).toBe("trade_nexus");
  });

  it("dominantSubHouseForSector returns null for an unmapped sector", () => {
    expect(dominantSubHouseForSector("ark_debris_field")).toBeNull();
  });

  it("every sub-house with a primarySectorId is reachable via lookup", () => {
    for (const def of Object.values(SUB_HOUSE_REGISTRY)) {
      if (!def.primarySectorId) continue;
      const all = subHousesForSector(def.primarySectorId);
      expect(all.map(h => h.houseKey)).toContain(def.houseKey);
    }
  });
});
