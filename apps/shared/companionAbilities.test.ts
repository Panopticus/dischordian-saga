import { describe, it, expect } from "vitest";
import {
  COMPANION_ABILITIES,
  COMPANION_BOND_TIERS,
  bondTierFor,
  getCompanionAbility,
  listCompanionAbilities,
  nextLockedAbility,
} from "./companionAbilities";

describe("COMPANION_ABILITIES — registry invariants", () => {
  it("ships at least one ability for the wired roster", () => {
    expect(COMPANION_ABILITIES.length).toBeGreaterThan(0);
  });

  it("every ability id is unique", () => {
    const ids = COMPANION_ABILITIES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every ability snaps to one of the canonical bond tiers", () => {
    const tiers = new Set<number>(COMPANION_BOND_TIERS);
    for (const ability of COMPANION_ABILITIES) {
      expect(tiers.has(ability.minBondLevel), `${ability.id} non-canonical bond`).toBe(true);
    }
  });

  it("every ability has positive cooldownMs", () => {
    for (const ability of COMPANION_ABILITIES) {
      expect(ability.cooldownMs).toBeGreaterThan(0);
    }
  });
});

describe("listCompanionAbilities", () => {
  it("returns nothing at bond 0", () => {
    expect(listCompanionAbilities("elara", 0)).toEqual([]);
  });

  it("returns abilities at or below the bond level", () => {
    const at20 = listCompanionAbilities("elara", 20);
    expect(at20.every((a) => a.minBondLevel <= 20)).toBe(true);
    expect(at20.length).toBeGreaterThan(0);
  });

  it("includes higher-tier abilities once bond crosses their threshold", () => {
    const low = listCompanionAbilities("elara", 20);
    const high = listCompanionAbilities("elara", 60);
    expect(high.length).toBeGreaterThanOrEqual(low.length);
  });

  it("sorts ascending by minBondLevel (UI renders tier-1 leftmost)", () => {
    const out = listCompanionAbilities("the_human", 100);
    for (let i = 1; i < out.length; i++) {
      expect(out[i].minBondLevel).toBeGreaterThanOrEqual(out[i - 1].minBondLevel);
    }
  });

  it("filters by companion (Elara abilities don't appear for The Human)", () => {
    const human = listCompanionAbilities("the_human", 100);
    expect(human.every((a) => a.companionId === "the_human")).toBe(true);
  });
});

describe("getCompanionAbility", () => {
  it("returns the ability by id", () => {
    expect(getCompanionAbility("elara_signal_boost")?.companionId).toBe("elara");
  });

  it("returns undefined for unknown ids", () => {
    expect(getCompanionAbility("nope")).toBeUndefined();
  });
});

describe("bondTierFor", () => {
  it("returns 0 below tier 1", () => {
    expect(bondTierFor(0)).toBe(0);
    expect(bondTierFor(19)).toBe(0);
  });

  it("returns the highest reached tier", () => {
    expect(bondTierFor(20)).toBe(20);
    expect(bondTierFor(39)).toBe(20);
    expect(bondTierFor(40)).toBe(40);
    expect(bondTierFor(80)).toBe(80);
    expect(bondTierFor(100)).toBe(80);
  });
});

describe("nextLockedAbility", () => {
  it("returns the lowest-bond locked ability for the companion", () => {
    const next = nextLockedAbility("elara", 0);
    expect(next?.minBondLevel).toBe(20);
  });

  it("returns null when every ability is unlocked", () => {
    expect(nextLockedAbility("elara", 100)).toBeNull();
  });
});
