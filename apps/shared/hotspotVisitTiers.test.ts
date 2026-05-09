import { describe, expect, it } from "vitest";
import {
  type HotspotVisitTier,
  getVisitTier,
  getVisitResponse,
  tiersAreWellFormed,
} from "./hotspotVisitTiers";

const tiers: readonly HotspotVisitTier[] = [
  { id: "tier_first", requiredVisitCount: 1, responseId: "resp_first" },
  { id: "tier_second", requiredVisitCount: 2, responseId: "resp_second", textOverride: "On the second visit you notice…" },
  { id: "tier_fifth", requiredVisitCount: 5, responseId: "resp_fifth" },
];

describe("getVisitTier", () => {
  it("returns null for hotspots without tiers", () => {
    expect(getVisitTier(3, {})).toBeNull();
    expect(getVisitTier(3, { tiers: [] })).toBeNull();
  });

  it("returns null when no tier qualifies", () => {
    expect(getVisitTier(0, { tiers })).toBeNull();
  });

  it("returns the highest qualifying tier", () => {
    expect(getVisitTier(1, { tiers })?.id).toBe("tier_first");
    expect(getVisitTier(2, { tiers })?.id).toBe("tier_second");
    expect(getVisitTier(3, { tiers })?.id).toBe("tier_second");
    expect(getVisitTier(4, { tiers })?.id).toBe("tier_second");
    expect(getVisitTier(5, { tiers })?.id).toBe("tier_fifth");
    expect(getVisitTier(100, { tiers })?.id).toBe("tier_fifth");
  });
});

describe("getVisitResponse", () => {
  it("threads responseId + textOverride from the resolved tier", () => {
    const r = getVisitResponse(2, { tiers });
    expect(r?.responseId).toBe("resp_second");
    expect(r?.textOverride).toBe("On the second visit you notice…");
  });

  it("returns null when no tier qualifies", () => {
    expect(getVisitResponse(0, { tiers })).toBeNull();
  });
});

describe("tiersAreWellFormed", () => {
  it("returns true for ascending sorted tiers", () => {
    expect(tiersAreWellFormed(tiers)).toBe(true);
  });

  it("returns false for unsorted tiers", () => {
    const bad: HotspotVisitTier[] = [
      { id: "a", requiredVisitCount: 5 },
      { id: "b", requiredVisitCount: 2 },
    ];
    expect(tiersAreWellFormed(bad)).toBe(false);
  });

  it("returns false for duplicate visit counts", () => {
    const dup: HotspotVisitTier[] = [
      { id: "a", requiredVisitCount: 1 },
      { id: "b", requiredVisitCount: 1 },
    ];
    expect(tiersAreWellFormed(dup)).toBe(false);
  });

  it("returns true for an empty list (trivially well-formed)", () => {
    expect(tiersAreWellFormed([])).toBe(true);
  });
});
