import { describe, it, expect } from "vitest";
import {
  eligibleForHellbox,
  restoreApprentice,
  HELLBOX_COST,
  HELLBOX_BLOOD_WEAVE_DELTA,
} from "./hellboxClone";
import type { SerializedCrewMember } from "./crewPersistence";

const baseMember: SerializedCrewMember = {
  id: "crew-1700-0001",
  name: "Test Apprentice",
  nickname: null,
  species: "human",
  gender: "non-binary",
  bloodlineId: "founders",
  generation: 1,
  parentIds: null,
  children: [],
  geneticTraits: [],
  role: null,
  stats: {
    resilience: 80,
    intellect: 70,
    reflexes: 60,
    empathy: 50,
    immunity: 40,
    adaptability: 30,
  },
  morale: 0,
  health: 0,
  loyalty: 80,
  status: "dead",
  age: 28,
  maxAge: 80,
  missionHistory: ["m1"],
  relationships: {},
  birthCycle: 0,
  productionPath: "trained",
  archetype: "scholar",
  deathRecord: {
    cycle: 28,
    cause: "Lost during The Long Drop",
    lastWords: "Was I... useful?",
  },
};

describe("eligibleForHellbox", () => {
  it("accepts a fresh fallen apprentice", () => {
    const r = eligibleForHellbox(baseMember);
    expect(r.eligible).toBe(true);
  });

  it("rejects a recruited NPC (must use Resurrection Protocols)", () => {
    const recruited: SerializedCrewMember = {
      ...baseMember,
      productionPath: "recruited",
      linkedNpcKey: "locke",
    };
    const r = eligibleForHellbox(recruited);
    expect(r.eligible).toBe(false);
    if (!r.eligible) {
      expect(r.reason).toMatch(/Resurrection Protocols/);
    }
  });

  it("rejects a bred crew member (no Hellbox path for bred)", () => {
    const bred: SerializedCrewMember = {
      ...baseMember,
      productionPath: "bred",
    };
    const r = eligibleForHellbox(bred);
    expect(r.eligible).toBe(false);
  });

  it("rejects an apprentice already restored once (one-shot)", () => {
    const reused: SerializedCrewMember = {
      ...baseMember,
      cloneDegradation: 1,
    };
    const r = eligibleForHellbox(reused);
    expect(r.eligible).toBe(false);
    if (!r.eligible) {
      expect(r.reason).toMatch(/already been Hellbox-restored/);
    }
  });

  it("rejects a living apprentice (must be dead)", () => {
    const alive: SerializedCrewMember = {
      ...baseMember,
      status: "active",
    };
    const r = eligibleForHellbox(alive);
    expect(r.eligible).toBe(false);
  });
});

describe("restoreApprentice", () => {
  it("returns a member at status=active with degradation=1", () => {
    const restored = restoreApprentice(baseMember, 1_700_000_000_000);
    expect(restored.status).toBe("active");
    expect(restored.cloneDegradation).toBe(1);
    expect(restored.health).toBeGreaterThan(0);
  });

  it("preserves the deathRecord (they remember dying)", () => {
    const restored = restoreApprentice(baseMember, 1_700_000_000_000);
    expect(restored.deathRecord).toBeDefined();
    expect(restored.deathRecord?.cause).toMatch(/The Long Drop/);
  });

  it("dims stats by ~10% (with floor of 1)", () => {
    const restored = restoreApprentice(baseMember, 1_700_000_000_000);
    expect(restored.stats.resilience).toBeLessThan(baseMember.stats.resilience);
    expect(restored.stats.resilience).toBeGreaterThanOrEqual(1);
    // Approximate: 80 * 0.9 = 72
    expect(restored.stats.resilience).toBe(72);
  });

  it("appends a biography entry tagged 'epitaph'", () => {
    const restored = restoreApprentice(baseMember, 1_700_000_000_000);
    expect(restored.biography?.length).toBeGreaterThan(0);
    expect(restored.biography?.[0].tag).toBe("epitaph");
  });

  it("throws if the member is not eligible", () => {
    const recruited: SerializedCrewMember = {
      ...baseMember,
      productionPath: "recruited",
      linkedNpcKey: "locke",
    };
    expect(() => restoreApprentice(recruited, 0)).toThrow(/refused/);
  });
});

describe("Hellbox constants", () => {
  it("documents the cost and blood-weave delta", () => {
    expect(HELLBOX_COST.dream).toBe(100);
    expect(HELLBOX_COST.materials).toBe(50);
    expect(HELLBOX_COST.voidCrystals).toBe(5);
    expect(HELLBOX_BLOOD_WEAVE_DELTA).toBe(1);
  });
});
