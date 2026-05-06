// apps/shared/tradeEmpire/__tests__/houses.test.ts
//
// Phase 1 invariants for the sub-house registry.

import { describe, it, expect } from "vitest";
import {
  SUB_HOUSE_REGISTRY,
  allSubHouseKeys,
  factionForHouse,
  subHousesInFaction,
  isKnownSubHouseKey,
  rivalryDeltas,
  validateSubHouseRegistry,
  type SubHouseKey,
} from "../houses";

describe("Sub-house registry — phase 1", () => {
  it("registry is internally consistent", () => {
    expect(validateSubHouseRegistry()).toEqual([]);
  });

  it("every house's key matches its registry slot", () => {
    for (const [key, def] of Object.entries(SUB_HOUSE_REGISTRY)) {
      expect(def.houseKey).toBe(key);
    }
  });

  it("isKnownSubHouseKey correctly classifies", () => {
    expect(isKnownSubHouseKey("nb_authoritys_ledger")).toBe(true);
    expect(isKnownSubHouseKey("does_not_exist")).toBe(false);
  });

  it("allSubHouseKeys is unique", () => {
    const keys = allSubHouseKeys();
    expect(keys.length).toBe(new Set(keys).size);
  });

  it("subHousesInFaction returns only that faction's houses", () => {
    const nbHouses = subHousesInFaction("new_babylon");
    expect(nbHouses.length).toBeGreaterThanOrEqual(2);
    for (const h of nbHouses) {
      expect(h.factionId).toBe("new_babylon");
    }
  });

  it("rivalry is mutual for non-unalignable houses", () => {
    for (const def of Object.values(SUB_HOUSE_REGISTRY)) {
      if (def.unalignable) continue;
      const rival = SUB_HOUSE_REGISTRY[def.rivalHouseKey];
      expect(rival.rivalHouseKey).toBe(def.houseKey);
    }
  });
});

describe("rivalryDeltas — anti-correlation math", () => {
  it("primary gets full delta; rival gets -delta * intensity (rounded)", () => {
    // nb_authoritys_ledger has rivalryIntensity 0.7
    const deltas = rivalryDeltas("nb_authoritys_ledger" as SubHouseKey, 10);
    expect(deltas.nb_authoritys_ledger).toBe(10);
    expect(deltas.nb_civic_engineers).toBe(-7);
  });

  it("unalignable houses receive nothing", () => {
    const deltas = rivalryDeltas("dreamer_shield_opaque" as SubHouseKey, 10);
    expect(deltas).toEqual({});
  });

  it("does not write a rival entry when rival is unalignable", () => {
    // tv_sovereigns_circle has rival tv_unaligned_swarm, which is unalignable.
    const deltas = rivalryDeltas("tv_sovereigns_circle" as SubHouseKey, 10);
    expect(deltas.tv_sovereigns_circle).toBe(10);
    expect(deltas.tv_unaligned_swarm).toBeUndefined();
  });

  it("factionForHouse rolls up correctly", () => {
    expect(factionForHouse("nb_authoritys_ledger")).toBe("new_babylon");
    expect(factionForHouse("hierarchy_severance")).toBe("hierarchy");
    expect(factionForHouse("antiquarian_casino")).toBe("antiquarian");
  });
});
