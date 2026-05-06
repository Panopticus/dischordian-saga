// apps/shared/tradeEmpire/__tests__/travel.test.ts

import { describe, it, expect } from "vitest";
import {
  BASE_FUEL_COST_PER_HOP,
  computeHopDistance,
  computeTravelCost,
  FREE_TRAVEL_RADIUS,
} from "../travel";

describe("computeTravelCost — Phase B", () => {
  it("hops within free radius cost zero", () => {
    expect(computeTravelCost({ hopDistance: 0 }).materialsCost).toBe(0);
    expect(computeTravelCost({ hopDistance: 1 }).materialsCost).toBe(0);
    expect(computeTravelCost({ hopDistance: FREE_TRAVEL_RADIUS }).materialsCost).toBe(0);
  });

  it("hops beyond free radius cost BASE_FUEL_COST_PER_HOP each", () => {
    const c = computeTravelCost({ hopDistance: FREE_TRAVEL_RADIUS + 3 });
    expect(c.materialsCost).toBe(BASE_FUEL_COST_PER_HOP * 3);
  });

  it("antiquarian_pocket is free", () => {
    const c = computeTravelCost({
      hopDistance: 10,
      fastTravelNetwork: "antiquarian_pocket",
    });
    expect(c.materialsCost).toBe(0);
    expect(c.discountReason).toContain("antiquarian_pocket");
  });

  it("spy_network discounts 50%", () => {
    const c = computeTravelCost({
      hopDistance: FREE_TRAVEL_RADIUS + 4,
      fastTravelNetwork: "spy_network",
    });
    expect(c.materialsCost).toBe(Math.round(BASE_FUEL_COST_PER_HOP * 4 * 0.5));
  });
});

describe("computeHopDistance", () => {
  const adjacency = new Map<string, ReadonlyArray<string>>([
    ["A", ["B"]],
    ["B", ["A", "C"]],
    ["C", ["B", "D"]],
    ["D", ["C"]],
    ["X", []],
  ]);

  it("zero hops to self", () => {
    expect(computeHopDistance("A", "A", adjacency)).toBe(0);
  });

  it("single hop to neighbor", () => {
    expect(computeHopDistance("A", "B", adjacency)).toBe(1);
  });

  it("BFS finds multi-hop path", () => {
    expect(computeHopDistance("A", "D", adjacency)).toBe(3);
  });

  it("returns Infinity for unreachable", () => {
    expect(computeHopDistance("A", "X", adjacency)).toBe(Infinity);
  });
});
