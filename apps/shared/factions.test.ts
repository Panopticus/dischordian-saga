import { describe, it, expect } from "vitest";

import {
  FACTION_REGISTRY,
  FACTION_IDS,
  bandFor,
  resolveCrossEffects,
} from "./factions";

describe("factions registry", () => {
  it("has the five canonical factions", () => {
    expect(FACTION_IDS).toHaveLength(5);
    expect(FACTION_IDS).toContain("architect_remnants");
    expect(FACTION_IDS).toContain("new_babylon");
    expect(FACTION_IDS).toContain("hierarchy");
    expect(FACTION_IDS).toContain("insurgency");
    expect(FACTION_IDS).toContain("dreamers_children");
  });

  it("every faction declares championed/enemied flag strings", () => {
    for (const id of FACTION_IDS) {
      const def = FACTION_REGISTRY[id];
      expect(def.championedFlag).toContain("faction:championed:");
      expect(def.enemiedFlag).toContain("faction:enemied:");
      expect(def.championedFlag).toContain(id);
      expect(def.enemiedFlag).toContain(id);
    }
  });

  it("opposes lists are non-empty (alignment landscape is connected)", () => {
    for (const id of FACTION_IDS) {
      expect(FACTION_REGISTRY[id].opposes.length).toBeGreaterThan(0);
    }
  });
});

describe("bandFor", () => {
  it("returns the five bands at the documented thresholds", () => {
    expect(bandFor(100)).toBe("champion");
    expect(bandFor(75)).toBe("champion");
    expect(bandFor(74)).toBe("ally");
    expect(bandFor(25)).toBe("ally");
    expect(bandFor(24)).toBe("neutral");
    expect(bandFor(0)).toBe("neutral");
    expect(bandFor(-24)).toBe("neutral");
    expect(bandFor(-25)).toBe("suspect");
    expect(bandFor(-74)).toBe("suspect");
    expect(bandFor(-75)).toBe("enemy");
    expect(bandFor(-100)).toBe("enemy");
  });
});

describe("resolveCrossEffects", () => {
  it("returns negative echo deltas for opposed factions", () => {
    const echoes = resolveCrossEffects("insurgency", 20);
    expect(echoes.length).toBeGreaterThan(0);
    for (const e of echoes) {
      expect(e.delta).toBeLessThan(0);
      expect(e.factionId).not.toBe("insurgency");
    }
  });

  it("flips sign for negative primary deltas", () => {
    const echoes = resolveCrossEffects("insurgency", -20);
    for (const e of echoes) {
      expect(e.delta).toBeGreaterThan(0);
    }
  });

  it("returns nothing for zero delta", () => {
    expect(resolveCrossEffects("insurgency", 0)).toHaveLength(0);
  });
});
