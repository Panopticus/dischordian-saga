import { describe, expect, it } from "vitest";
import {
  DISCOVERY_TIERS_ORDERED,
  DISCOVERY_TIER_RANK,
  DISCOVERY_TIER_LABEL,
  type DiscoveryTier,
  compareDiscoveryTier,
  maxDiscoveryTier,
  isDiscoveredAtLeast,
  promoteDiscoveryTier,
  countAtTier,
} from "./discoveryTiers";

describe("DISCOVERY_TIER_RANK invariants", () => {
  it("is strictly ascending in DISCOVERY_TIERS_ORDERED order", () => {
    for (let i = 1; i < DISCOVERY_TIERS_ORDERED.length; i++) {
      const prev = DISCOVERY_TIERS_ORDERED[i - 1]!;
      const curr = DISCOVERY_TIERS_ORDERED[i]!;
      expect(DISCOVERY_TIER_RANK[curr]).toBeGreaterThan(DISCOVERY_TIER_RANK[prev]);
    }
  });

  it("has a label for every tier", () => {
    for (const tier of DISCOVERY_TIERS_ORDERED) {
      expect(DISCOVERY_TIER_LABEL[tier].length).toBeGreaterThan(0);
    }
  });
});

describe("compareDiscoveryTier", () => {
  it("returns 0 for equal tiers", () => {
    expect(compareDiscoveryTier("name", "name")).toBe(0);
  });
  it("returns -1 when a is lower", () => {
    expect(compareDiscoveryTier("silhouette", "details")).toBe(-1);
  });
  it("returns 1 when a is higher", () => {
    expect(compareDiscoveryTier("full", "name")).toBe(1);
  });
});

describe("maxDiscoveryTier", () => {
  it("returns the higher of two tiers", () => {
    expect(maxDiscoveryTier("silhouette", "details")).toBe("details");
    expect(maxDiscoveryTier("full", "name")).toBe("full");
  });
  it("returns either when equal", () => {
    expect(maxDiscoveryTier("name", "name")).toBe("name");
  });
});

describe("isDiscoveredAtLeast", () => {
  const tiers = new Map<string, DiscoveryTier>([
    ["entity_a", "silhouette"],
    ["entity_b", "details"],
    ["entity_c", "full"],
  ]);

  it("returns false for unknown entities", () => {
    expect(isDiscoveredAtLeast("not_real", "name", tiers)).toBe(false);
  });

  it("returns true when player tier ≥ required", () => {
    expect(isDiscoveredAtLeast("entity_b", "name", tiers)).toBe(true);
    expect(isDiscoveredAtLeast("entity_c", "full", tiers)).toBe(true);
  });

  it("returns false when player tier < required", () => {
    expect(isDiscoveredAtLeast("entity_a", "name", tiers)).toBe(false);
    expect(isDiscoveredAtLeast("entity_b", "full", tiers)).toBe(false);
  });
});

describe("promoteDiscoveryTier", () => {
  it("inserts a new tier when the entity is unknown", () => {
    const tiers = new Map<string, DiscoveryTier>();
    const next = promoteDiscoveryTier(tiers, "entity_a", "silhouette");
    expect(next.get("entity_a")).toBe("silhouette");
  });

  it("upgrades to the new tier when it's higher than current", () => {
    const tiers = new Map<string, DiscoveryTier>([["entity_a", "silhouette"]]);
    const next = promoteDiscoveryTier(tiers, "entity_a", "details");
    expect(next.get("entity_a")).toBe("details");
  });

  it("is a no-op when the new tier is lower than current", () => {
    const tiers = new Map<string, DiscoveryTier>([["entity_a", "full"]]);
    const next = promoteDiscoveryTier(tiers, "entity_a", "silhouette");
    expect(next.get("entity_a")).toBe("full");
  });

  it("returns a NEW map (immutable)", () => {
    const tiers = new Map<string, DiscoveryTier>();
    const next = promoteDiscoveryTier(tiers, "entity_a", "name");
    expect(next).not.toBe(tiers);
    expect(tiers.size).toBe(0);
  });
});

describe("countAtTier", () => {
  const tiers = new Map<string, DiscoveryTier>([
    ["a", "silhouette"],
    ["b", "name"],
    ["c", "details"],
    ["d", "full"],
    ["e", "full"],
  ]);

  it("counts entities at-or-above the threshold", () => {
    expect(countAtTier(tiers, "silhouette")).toBe(5);
    expect(countAtTier(tiers, "name")).toBe(4);
    expect(countAtTier(tiers, "details")).toBe(3);
    expect(countAtTier(tiers, "full")).toBe(2);
  });
});
