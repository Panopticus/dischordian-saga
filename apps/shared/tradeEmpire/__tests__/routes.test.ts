// apps/shared/tradeEmpire/__tests__/routes.test.ts
//
// Phase 2.1b verification — Trade Empire route + milestone-tier
// helpers (canonical 5 / 10 / 25 / 50 milestone ladder per the
// plan §3 route-completion ceremonies).

import { describe, it, expect } from "vitest";
import {
  ROUTE_MILESTONE_TIERS,
  MILESTONE_TIER_CANON,
  makeRouteKey,
  parseRouteKey,
  nextMilestoneTier,
  milestoneTiersCrossedBy,
  progressTowardNextTier,
  type RouteMilestoneTier,
} from "../routes";

describe("ROUTE_MILESTONE_TIERS canonical ladder", () => {
  it("ships canonical 4 milestone tiers (5 / 10 / 25 / 50)", () => {
    expect(ROUTE_MILESTONE_TIERS).toEqual([5, 10, 25, 50]);
  });

  it("tiers are canonically-ascending", () => {
    for (let i = 1; i < ROUTE_MILESTONE_TIERS.length; i++) {
      expect(ROUTE_MILESTONE_TIERS[i]!).toBeGreaterThan(
        ROUTE_MILESTONE_TIERS[i - 1]!,
      );
    }
  });
});

describe("makeRouteKey + parseRouteKey round-trip", () => {
  it("cargo-flexible route key omits cargo segment", () => {
    const key = makeRouteKey("bombadil", "pyralion");
    expect(key).toBe("bombadil__pyralion");
  });

  it("cargo-constrained route key includes cargo segment", () => {
    const key = makeRouteKey("bombadil", "pyralion", "rare_minerals");
    expect(key).toBe("bombadil__pyralion__rare_minerals");
  });

  it("parseRouteKey round-trips canonical-flexible route", () => {
    const key = makeRouteKey("bombadil", "pyralion");
    const parsed = parseRouteKey(key);
    expect(parsed?.fromSectorId).toBe("bombadil");
    expect(parsed?.toSectorId).toBe("pyralion");
    expect(parsed?.cargoCategory).toBeUndefined();
  });

  it("parseRouteKey round-trips canonical-cargo-constrained route", () => {
    const key = makeRouteKey("bombadil", "pyralion", "clone_body");
    const parsed = parseRouteKey(key);
    expect(parsed?.fromSectorId).toBe("bombadil");
    expect(parsed?.toSectorId).toBe("pyralion");
    expect(parsed?.cargoCategory).toBe("clone_body");
  });

  it("parseRouteKey returns null for canonical-malformed keys", () => {
    expect(parseRouteKey("malformed")).toBeNull();
    expect(parseRouteKey("a__b__c__d")).toBeNull();
    expect(parseRouteKey("")).toBeNull();
  });

  it("routes are canonically-directional (A→B distinct from B→A)", () => {
    const ab = makeRouteKey("bombadil", "pyralion");
    const ba = makeRouteKey("pyralion", "bombadil");
    expect(ab).not.toBe(ba);
  });
});

describe("nextMilestoneTier resolver", () => {
  it("currentTier 0 → next tier is 5", () => {
    expect(nextMilestoneTier(0)).toBe(5);
  });

  it("currentTier 5 → next tier is 10", () => {
    expect(nextMilestoneTier(5)).toBe(10);
  });

  it("currentTier 10 → next tier is 25", () => {
    expect(nextMilestoneTier(10)).toBe(25);
  });

  it("currentTier 25 → next tier is 50", () => {
    expect(nextMilestoneTier(25)).toBe(50);
  });

  it("currentTier 50 → null (canonical-saga-tier is canonical-terminal)", () => {
    expect(nextMilestoneTier(50)).toBeNull();
  });

  it("partial-progress (currentTier 23) → next tier is 25", () => {
    expect(nextMilestoneTier(23)).toBe(25);
  });

  it("currentTier above 50 → null", () => {
    expect(nextMilestoneTier(99)).toBeNull();
  });
});

describe("milestoneTiersCrossedBy detector", () => {
  it("no-progress run (priorRunCount = newRunCount) returns []", () => {
    expect(milestoneTiersCrossedBy(7, 7)).toEqual([]);
  });

  it("single canonical-tier crossing (4 → 5) returns [5]", () => {
    expect(milestoneTiersCrossedBy(4, 5)).toEqual([5]);
  });

  it("crossing past a tier (3 → 6) returns [5]", () => {
    expect(milestoneTiersCrossedBy(3, 6)).toEqual([5]);
  });

  it("no canonical-tier crossing within a tier-band (5 → 9) returns []", () => {
    expect(milestoneTiersCrossedBy(5, 9)).toEqual([]);
  });

  it("multi-tier crossing (3 → 30) returns [5, 10, 25]", () => {
    expect(milestoneTiersCrossedBy(3, 30)).toEqual([5, 10, 25]);
  });

  it("crossing all canonical-tiers (0 → 100) returns [5, 10, 25, 50]", () => {
    expect(milestoneTiersCrossedBy(0, 100)).toEqual([5, 10, 25, 50]);
  });

  it("crossing only canonical-saga-tier (49 → 50) returns [50]", () => {
    expect(milestoneTiersCrossedBy(49, 50)).toEqual([50]);
  });
});

describe("progressTowardNextTier helper", () => {
  it("currentRunCount 0 → 0.0 progress (canonical-zero baseline)", () => {
    expect(progressTowardNextTier(0)).toBe(0.0);
  });

  it("currentRunCount 5 (just crossed) → 0.0 progress toward next tier (10)", () => {
    expect(progressTowardNextTier(5)).toBe(0.0);
  });

  it("currentRunCount 7 → 0.4 progress toward 10 (2 of 5 since prior tier 5)", () => {
    expect(progressTowardNextTier(7)).toBeCloseTo(0.4, 2);
  });

  it("currentRunCount 49 → ~0.96 progress toward 50 (24 of 25 since prior tier 25)", () => {
    expect(progressTowardNextTier(49)).toBeCloseTo(24 / 25, 2);
  });

  it("currentRunCount 50 → null (canonical-saga-tier reached)", () => {
    expect(progressTowardNextTier(50)).toBeNull();
  });

  it("currentRunCount above 50 → null", () => {
    expect(progressTowardNextTier(75)).toBeNull();
  });
});

describe("MILESTONE_TIER_CANON canonical metadata", () => {
  it("exports canon for every canonical milestone-tier", () => {
    for (const tier of ROUTE_MILESTONE_TIERS) {
      expect(MILESTONE_TIER_CANON[tier]).toBeDefined();
      expect(MILESTONE_TIER_CANON[tier].tier).toBe(tier);
    }
  });

  it("each canonical-tier has a canonicalName + ≥1 canonical-acknowledger", () => {
    for (const tier of ROUTE_MILESTONE_TIERS) {
      const canon = MILESTONE_TIER_CANON[tier];
      expect(canon.canonicalName.length).toBeGreaterThan(0);
      expect(canon.canonicalAcknowledgers.length).toBeGreaterThanOrEqual(1);
      for (const ack of canon.canonicalAcknowledgers) {
        expect(ack.npcKey.length).toBeGreaterThan(0);
        expect(ack.canon.length).toBeGreaterThan(0);
      }
    }
  });

  it("tier 5: canonical-Independent-trader nod (canonical-faction-neutral)", () => {
    const canon = MILESTONE_TIER_CANON[5];
    expect(canon.canonicalName).toBe("First Rhythm");
    expect(
      canon.canonicalAcknowledgers.some(
        (a) => a.npcKey === "broker_independent_freeport",
      ),
    ).toBe(true);
  });

  it("tier 10: canonical-Locke calculation begins", () => {
    const canon = MILESTONE_TIER_CANON[10];
    expect(canon.canonicalName).toBe("Filed Pattern");
    expect(
      canon.canonicalAcknowledgers.some(
        (a) => a.npcKey === "adjudicator_locke",
      ),
    ).toBe(true);
  });

  it("tier 25: canonical-Antiquarian shelf-categorisation per Seer §4.6", () => {
    const canon = MILESTONE_TIER_CANON[25];
    expect(canon.canonicalName).toBe("Shelf Categorisation");
    const ackerKeys = canon.canonicalAcknowledgers.map((a) => a.npcKey);
    expect(ackerKeys).toContain("the_antiquarian");
    expect(ackerKeys).toContain("the_seer");
    // canonical Programmer's-shelf canon reference
    const antiquarianAck = canon.canonicalAcknowledgers.find(
      (a) => a.npcKey === "the_antiquarian",
    );
    expect(antiquarianAck?.canon).toMatch(/Programmer's shelf/);
  });

  it("tier 50: canonical-saga-tier with ≥3 canonical-acknowledgers", () => {
    const canon = MILESTONE_TIER_CANON[50];
    expect(canon.canonicalName).toBe("Saga-Tier Route");
    expect(canon.canonicalAcknowledgers.length).toBeGreaterThanOrEqual(3);
    const ackerKeys = canon.canonicalAcknowledgers.map((a) => a.npcKey);
    expect(ackerKeys).toContain("adjudicator_locke");
    expect(ackerKeys).toContain("the_antiquarian");
    expect(ackerKeys).toContain("broker_independent_freeport");
  });
});

describe("RouteMilestoneTier type completeness", () => {
  it("RouteMilestoneTier union accepts canonical 5 / 10 / 25 / 50", () => {
    const _typecheck5: RouteMilestoneTier = 5;
    const _typecheck10: RouteMilestoneTier = 10;
    const _typecheck25: RouteMilestoneTier = 25;
    const _typecheck50: RouteMilestoneTier = 50;
    expect([_typecheck5, _typecheck10, _typecheck25, _typecheck50]).toEqual([
      5, 10, 25, 50,
    ]);
  });
});
