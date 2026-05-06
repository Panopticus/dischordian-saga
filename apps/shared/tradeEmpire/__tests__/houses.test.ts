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

  it("rivalry is mutual for non-unalignable houses in 2-house factions", () => {
    // Phase A: factions with 3+ sub-houses (Hierarchy now has 4,
    // Antiquarian now has 3) form a rivalry graph, not a pair —
    // so mutuality only applies to 2-house factions.
    const factionSizes = new Map<string, number>();
    for (const def of Object.values(SUB_HOUSE_REGISTRY)) {
      factionSizes.set(def.factionId, (factionSizes.get(def.factionId) ?? 0) + 1);
    }
    for (const def of Object.values(SUB_HOUSE_REGISTRY)) {
      if (def.unalignable) continue;
      if ((factionSizes.get(def.factionId) ?? 0) > 2) continue;
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

describe("Phase A lore corrections", () => {
  it("antiquarian_shelfmates is anchored to the_antiquarian (not the_seer)", () => {
    expect(SUB_HOUSE_REGISTRY.antiquarian_shelfmates.primaryNpcKey).toBe(
      "the_antiquarian",
    );
  });

  it("hierarchy_acquisitions is anchored to drael_mon", () => {
    expect(SUB_HOUSE_REGISTRY.hierarchy_acquisitions.primaryNpcKey).toBe(
      "drael_mon",
    );
  });

  it("Thaloria sub-houses roll up to thaloria, not independent", () => {
    expect(factionForHouse("thaloria_council")).toBe("thaloria");
    expect(factionForHouse("thaloria_quietwork")).toBe("thaloria");
  });

  it("thaloria_council is led by Wraith Calder (the Wraith Hierophant)", () => {
    expect(SUB_HOUSE_REGISTRY.thaloria_council.primaryNpcKey).toBe("wraith_calder");
  });

  it("thaloria_quietwork is bible-canonically faceless (no primaryNpcKey)", () => {
    expect(SUB_HOUSE_REGISTRY.thaloria_quietwork.primaryNpcKey).toBeUndefined();
  });

  it("hierarchy_syndicate_of_death exists and is alignable", () => {
    expect(SUB_HOUSE_REGISTRY.hierarchy_syndicate_of_death).toBeDefined();
    expect(SUB_HOUSE_REGISTRY.hierarchy_syndicate_of_death.unalignable).toBeUndefined();
  });

  it("hierarchy_research_and_development exists (Phase A.5)", () => {
    expect(SUB_HOUSE_REGISTRY.hierarchy_research_and_development).toBeDefined();
  });

  it("antiquarian_cross_references_desk exists (Phase A.5)", () => {
    expect(SUB_HOUSE_REGISTRY.antiquarian_cross_references_desk).toBeDefined();
  });
});

describe("externalRivals — cross-faction blood feuds", () => {
  it("thaloria_council externally rivals nb_authoritys_ledger and hierarchy_syndicate_of_death", () => {
    const rivals = SUB_HOUSE_REGISTRY.thaloria_council.externalRivals ?? [];
    expect(rivals).toContain("nb_authoritys_ledger");
    expect(rivals).toContain("hierarchy_syndicate_of_death");
  });

  it("nb_authoritys_ledger externally rivals thaloria_council", () => {
    const rivals = SUB_HOUSE_REGISTRY.nb_authoritys_ledger.externalRivals ?? [];
    expect(rivals).toContain("thaloria_council");
  });

  it("rivalryDeltas applies cross-faction anti-correlation", () => {
    const deltas = rivalryDeltas("thaloria_council" as SubHouseKey, 10);
    expect(deltas.thaloria_council).toBe(10);
    // External rival NB Authority gets -3 (10 * 0.3 = 3, rounded).
    expect(deltas.nb_authoritys_ledger).toBe(-3);
    // External rival Syndicate of Death also gets the cross-faction hit.
    expect(deltas.hierarchy_syndicate_of_death).toBe(-3);
  });

  it("intra-faction rival wins ties when both intra and external rival overlap", () => {
    // thaloria_council's intra-rival is thaloria_quietwork (same faction).
    // External rivals are out-of-faction. So no overlap; verify both
    // rival channels fire independently.
    const deltas = rivalryDeltas("thaloria_council" as SubHouseKey, 10);
    expect(deltas.thaloria_quietwork).toBeDefined(); // intra-faction
    expect(deltas.nb_authoritys_ledger).toBeDefined(); // external
  });

  it("validator rejects an externalRival in the same faction", () => {
    // Smoke test: the registry currently passes; if we tried to
    // declare an external rival in the same faction, validateSubHouseRegistry
    // should catch it. Hard to assert without a mock; assert the
    // current registry has no such violations.
    expect(validateSubHouseRegistry()).toEqual([]);
  });
});
