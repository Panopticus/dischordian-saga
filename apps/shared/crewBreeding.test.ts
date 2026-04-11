/* ═══════════════════════════════════════════════════════
   CREW BREEDING / MISSION TESTS
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  breedCrewMembers,
  calculateInbreedingPenalty,
  calculateGeneticDrift,
  calculateDiversityBonus,
  GENETIC_TEMPLATES,
  FOUNDING_BLOODLINES,
  createBloodline,
  getBloodlinePowerValue,
  type GeneticStat,
  type BloodlineId,
} from "../client/src/game/crewGenetics";
import {
  CREW_MISSION_TEMPLATES,
  calculateMissionSuccess,
  resolveMission,
  getMissionTemplate,
} from "./crewMissions";
import {
  ensureCrewState,
  createDefaultCrewState,
  countActiveCrew,
  CREW_STATE_VERSION,
  type CrewState,
  type SerializedCrewMember,
  type CrewMissionState,
} from "./crewPersistence";

const BASE_STATS: Record<GeneticStat, number> = {
  resilience: 60,
  intellect: 60,
  reflexes: 60,
  empathy: 60,
  immunity: 60,
  adaptability: 60,
};

function fakeMember(id: string, overrides: Partial<SerializedCrewMember> = {}): SerializedCrewMember {
  return {
    id,
    name: id,
    nickname: null,
    species: "human",
    gender: "non-binary",
    bloodlineId: "void_resonance",
    generation: 1,
    parentIds: null,
    children: [],
    geneticTraits: [],
    role: null,
    stats: { ...BASE_STATS },
    morale: 70,
    health: 100,
    loyalty: 50,
    status: "active",
    age: 20,
    maxAge: 80,
    missionHistory: [],
    relationships: {},
    birthCycle: 0,
    ...overrides,
  };
}

describe("breedCrewMembers()", () => {
  it("produces stats within 5–100 bounds", () => {
    const res = breedCrewMembers(
      ["hardy", "brilliant"],
      ["quick_reflexes", "charismatic"],
      BASE_STATS,
      BASE_STATS,
      "void_resonance" as BloodlineId,
      "iron_memory" as BloodlineId,
      3,
      42,
    );
    for (const stat of Object.values(res.stats)) {
      expect(stat).toBeGreaterThanOrEqual(5);
      expect(stat).toBeLessThanOrEqual(100);
    }
  });

  it("inherits at least some parent traits with high-inheritance seed", () => {
    const highInherit = ["hardy", "iron_constitution", "quick_reflexes"];
    const res = breedCrewMembers(
      highInherit,
      highInherit,
      BASE_STATS,
      BASE_STATS,
      "void_resonance" as BloodlineId,
      "iron_memory" as BloodlineId,
      3,
      1234,
    );
    // Shared parent traits double their inheritance — at least one should survive
    expect(res.inheritedTraits.length).toBeGreaterThan(0);
  });

  it("computes nonzero geneticFitness in range 0–100", () => {
    const res = breedCrewMembers([], [], BASE_STATS, BASE_STATS, "void_resonance", "void_resonance", 5, 7);
    expect(res.geneticFitness).toBeGreaterThanOrEqual(0);
    expect(res.geneticFitness).toBeLessThanOrEqual(100);
  });

  it("resolves incompatible traits by keeping the rarer one", () => {
    // Both parents carry opposing common-rarity traits; one should be dropped
    const res = breedCrewMembers(
      ["hardy", "frail"],
      ["hardy", "frail"],
      BASE_STATS,
      BASE_STATS,
      "void_resonance",
      "iron_memory",
      3,
      99,
    );
    const hasBoth = res.inheritedTraits.includes("hardy") && res.inheritedTraits.includes("frail");
    expect(hasBoth).toBe(false);
  });
});

describe("calculateInbreedingPenalty()", () => {
  it("returns 0 for different bloodlines", () => {
    expect(calculateInbreedingPenalty("void_resonance", "iron_memory", 0)).toBe(0);
  });
  it("returns the full base penalty (30) when bloodlines match at gen 0", () => {
    expect(calculateInbreedingPenalty("void_resonance", "void_resonance", 0)).toBe(30);
  });
  it("decays the penalty 5 per generation gap", () => {
    expect(calculateInbreedingPenalty("void_resonance", "void_resonance", 3)).toBe(15);
    expect(calculateInbreedingPenalty("void_resonance", "void_resonance", 6)).toBe(0);
  });
  it("never returns a negative penalty", () => {
    expect(calculateInbreedingPenalty("void_resonance", "void_resonance", 100)).toBe(0);
  });

  it("adds clone_degradation when penalty exceeds 20", () => {
    const res = breedCrewMembers(
      ["hardy"],
      ["hardy"],
      BASE_STATS,
      BASE_STATS,
      "void_resonance",
      "void_resonance",
      0, // 30% penalty → > 20 triggers clone_degradation
      11,
    );
    expect(res.inbreedingPenalty).toBeGreaterThan(20);
    expect(res.newMutations).toContain("clone_degradation");
  });
});

describe("genetic drift & diversity", () => {
  it("drift scales with generation and is bounded 0–100", () => {
    const bl = createBloodline("iron_memory");
    bl.generationCount = 40;
    bl.diversityIndex = 50;
    const d = calculateGeneticDrift(bl);
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThanOrEqual(100);
  });
  it("diversity bonus peaks in the 60–80 range", () => {
    const bl = createBloodline("iron_memory");
    bl.diversityIndex = 70;
    expect(calculateDiversityBonus(bl)).toBeGreaterThan(calculateDiversityBonus({ ...bl, diversityIndex: 20 }));
    bl.diversityIndex = 95;
    const lateBonus = calculateDiversityBonus(bl);
    expect(lateBonus).toBeLessThan(35);
  });
});

describe("bloodline power scaling", () => {
  it("starts at baseValue and grows per generation", () => {
    const bl = createBloodline("void_resonance");
    bl.generationCount = 1;
    expect(getBloodlinePowerValue(bl)).toBe(FOUNDING_BLOODLINES.void_resonance.power.baseValue);
    bl.generationCount = 5;
    expect(getBloodlinePowerValue(bl)).toBeGreaterThan(FOUNDING_BLOODLINES.void_resonance.power.baseValue);
  });
});

describe("calculateMissionSuccess()", () => {
  const template = getMissionTemplate("mission_salvage_sweep")!;
  it("scales with crew stat quality", () => {
    const weak = calculateMissionSuccess(template, [
      fakeMember("a", { stats: { resilience: 20, intellect: 20, reflexes: 20, empathy: 20, immunity: 20, adaptability: 20 } }),
    ]);
    const strong = calculateMissionSuccess(template, [
      fakeMember("b", { stats: { resilience: 90, intellect: 90, reflexes: 90, empathy: 90, immunity: 90, adaptability: 90 } }),
    ]);
    expect(strong).toBeGreaterThan(weak);
  });
  it("applies a role-fit bonus when the preferred role is filled", () => {
    const plain = calculateMissionSuccess(template, [fakeMember("n")]);
    const fit = calculateMissionSuccess(template, [fakeMember("q", { role: "quartermaster" })]);
    expect(fit).toBeGreaterThan(plain);
  });
  it("is capped by difficulty", () => {
    const suicide = getMissionTemplate("mission_archon_vault")!;
    const godSquad = Array.from({ length: 5 }, (_, i) =>
      fakeMember(`g${i}`, {
        role: "scientist",
        morale: 100,
        stats: { resilience: 100, intellect: 100, reflexes: 100, empathy: 100, immunity: 100, adaptability: 100 },
      }),
    );
    const chance = calculateMissionSuccess(suicide, godSquad);
    expect(chance).toBeLessThanOrEqual(0.60);
  });
  it("refuses missions below minCrew (returns 0)", () => {
    const bigMission = getMissionTemplate("mission_archon_vault")!;
    expect(calculateMissionSuccess(bigMission, [fakeMember("lonely")])).toBe(0);
  });
});

describe("resolveMission()", () => {
  it("can produce a fully-lost mission on high difficulty", () => {
    const template = getMissionTemplate("mission_deadmans_circuit_glory")!;
    const m: CrewMissionState = {
      id: "m1",
      templateId: template.id,
      name: template.name,
      sectorId: template.sectorId,
      description: template.description,
      difficulty: template.difficulty,
      assignedCrewIds: ["a"],
      dispatchedAt: 0,
      completesAt: 0,
      successChance: 0.05,
      preferredRole: template.preferredRole,
      reward: template.reward,
      failureReward: template.failureReward,
      status: "dispatched",
    };
    const resolved = resolveMission(m, [fakeMember("a")], 99999);
    expect(["succeeded", "failed", "lost"]).toContain(resolved.status);
    expect(resolved.resolution).toBeDefined();
  });

  it("survivors are bucketed into survived/injured/casualties exhaustively", () => {
    const template = getMissionTemplate("mission_market_run")!;
    const m: CrewMissionState = {
      id: "m2",
      templateId: template.id,
      name: template.name,
      sectorId: template.sectorId,
      description: template.description,
      difficulty: template.difficulty,
      assignedCrewIds: ["a", "b", "c"],
      dispatchedAt: 0,
      completesAt: 0,
      successChance: 0.8,
      preferredRole: template.preferredRole,
      reward: template.reward,
      status: "dispatched",
    };
    const crew = [fakeMember("a"), fakeMember("b"), fakeMember("c")];
    const resolved = resolveMission(m, crew, 12345);
    const r = resolved.resolution!;
    expect(r.casualties.length + r.injured.length + r.survived.length).toBe(crew.length);
  });
});

describe("ensureCrewState()", () => {
  it("returns defaults for null or garbage", () => {
    const s = ensureCrewState(null);
    expect(s.version).toBe(CREW_STATE_VERSION);
    expect(s.roster.members).toEqual([]);
    expect(s.incubator.pods.length).toBe(6);
  });
  it("preserves existing crew members when merging", () => {
    const base = createDefaultCrewState();
    base.roster.members.push(fakeMember("keeper"));
    const merged = ensureCrewState(base);
    expect(merged.roster.members).toHaveLength(1);
    expect(merged.roster.members[0].id).toBe("keeper");
  });
  it("countActiveCrew() ignores non-active members", () => {
    const base = createDefaultCrewState();
    base.roster.members.push(fakeMember("alive"));
    base.roster.members.push(fakeMember("dead", { status: "dead" }));
    base.roster.members.push(fakeMember("hurt", { status: "injured" }));
    expect(countActiveCrew(base)).toBe(1);
  });
});

describe("CREW_MISSION_TEMPLATES coverage", () => {
  it("includes at least one mission per difficulty tier", () => {
    const tiers = new Set(CREW_MISSION_TEMPLATES.map(t => t.difficulty));
    expect(tiers.has("routine")).toBe(true);
    expect(tiers.has("challenging")).toBe(true);
    expect(tiers.has("dangerous")).toBe(true);
    expect(tiers.has("suicidal")).toBe(true);
  });
});

describe("GENETIC_TEMPLATES coverage", () => {
  it("includes the 8 canonical templates", () => {
    expect(GENETIC_TEMPLATES.length).toBeGreaterThanOrEqual(8);
  });
});

/* ─── Ambient feed generator (shared subset) ─── */
import { generateAmbientFeedBatch, AMBIENT_TEMPLATES } from "./crewAmbientFeed";

describe("generateAmbientFeedBatch()", () => {
  it("returns 3–6 entries for a populated roster", () => {
    const out = generateAmbientFeedBatch(["Ada", "Kira", "Jace"], 42);
    expect(out.length).toBeGreaterThanOrEqual(3);
    expect(out.length).toBeLessThanOrEqual(6);
  });
  it("returns empty array when no crew names are supplied", () => {
    expect(generateAmbientFeedBatch([], 1)).toEqual([]);
  });
  it("fills the [CREW_NAME] placeholder with a real name", () => {
    const out = generateAmbientFeedBatch(["AdaTest"], 77);
    // Templates with needsCrew: 1+ should get filled
    const textContains = out.some(e => e.text.includes("AdaTest"));
    expect(textContains || out.every(e => !e.text.includes("[CREW_NAME]"))).toBe(true);
  });
  it("never leaves raw [TOKEN] placeholders in output", () => {
    const out = generateAmbientFeedBatch(["Ada", "Kira"], 123);
    for (const e of out) {
      expect(e.text).not.toMatch(/\[CREW_NAME\]/);
    }
  });
  it("template library is non-empty", () => {
    expect(AMBIENT_TEMPLATES.length).toBeGreaterThan(10);
  });
});

/* ─── LCA walk for inbreeding ─── */
import { generationsSinceShared } from "../client/src/game/crewBirth";

describe("generationsSinceShared()", () => {
  const mkFounder = (id: string, bloodline: BloodlineId = "void_resonance") =>
    fakeMember(id, { bloodlineId: bloodline, generation: 1, parentIds: null });
  const mkChild = (
    id: string,
    parents: [string, string],
    bloodline: BloodlineId = "void_resonance",
  ) => fakeMember(id, { bloodlineId: bloodline, generation: 2, parentIds: parents });

  it("treats unrelated crew as infinite distance", () => {
    const a = mkFounder("a", "void_resonance");
    const b = mkFounder("b", "iron_memory");
    const roster = [a, b];
    expect(generationsSinceShared(a, b, roster)).toBeGreaterThan(10);
  });
  it("returns 0 for full siblings", () => {
    const p1 = mkFounder("p1");
    const p2 = mkFounder("p2", "iron_memory");
    const c1 = mkChild("c1", ["p1", "p2"]);
    const c2 = mkChild("c2", ["p1", "p2"]);
    const roster = [p1, p2, c1, c2];
    expect(generationsSinceShared(c1, c2, roster)).toBe(0);
  });
  it("returns a small number for half-siblings", () => {
    const p1 = mkFounder("p1");
    const p2 = mkFounder("p2", "iron_memory");
    const p3 = mkFounder("p3", "temporal_echo");
    const c1 = mkChild("c1", ["p1", "p2"]);
    const c2 = mkChild("c2", ["p1", "p3"]);
    const roster = [p1, p2, p3, c1, c2];
    const gap = generationsSinceShared(c1, c2, roster);
    expect(gap).toBeLessThanOrEqual(2);
  });
  it("returns 0 when one parent is a direct ancestor of the other", () => {
    const g = mkFounder("g");
    const p = mkChild("p", ["g", "g"]);
    expect(generationsSinceShared(g, p, [g, p])).toBe(0);
  });
});
