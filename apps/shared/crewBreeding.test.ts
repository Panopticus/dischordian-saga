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
  calculateSquadCohesionBonus,
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

/* ─── Squad cohesion ─── */

describe("calculateSquadCohesionBonus()", () => {
  it("returns 0 for a solo squad", () => {
    expect(calculateSquadCohesionBonus([fakeMember("a")])).toBe(0);
  });
  it("returns 0 for squads with no logged relationships", () => {
    expect(calculateSquadCohesionBonus([fakeMember("a"), fakeMember("b")])).toBe(0);
  });
  it("returns a positive bonus for bonded squads", () => {
    const a = fakeMember("a", { relationships: { b: 80, c: 60 } });
    const b = fakeMember("b", { relationships: { a: 80, c: 50 } });
    const c = fakeMember("c", { relationships: { a: 60, b: 50 } });
    expect(calculateSquadCohesionBonus([a, b, c])).toBeGreaterThan(0);
  });
  it("returns a negative bonus for hostile squads", () => {
    const a = fakeMember("a", { relationships: { b: -80 } });
    const b = fakeMember("b", { relationships: { a: -80 } });
    expect(calculateSquadCohesionBonus([a, b])).toBeLessThan(0);
  });
  it("caps the bonus at ±0.10", () => {
    const a = fakeMember("a", { relationships: { b: 200 } });
    const b = fakeMember("b", { relationships: { a: 200 } });
    const bonus = calculateSquadCohesionBonus([a, b]);
    expect(bonus).toBeLessThanOrEqual(0.10);
  });
  it("is reflected in calculateMissionSuccess()", () => {
    // Use a dangerous mission so the challenging-tier success cap isn't hit
    const template = getMissionTemplate("mission_terminus_scavenge")!;
    const modestStats = { resilience: 50, intellect: 50, reflexes: 50, empathy: 50, immunity: 50, adaptability: 50 };
    const bonded = [
      fakeMember("a", { stats: modestStats, relationships: { b: 80 } }),
      fakeMember("b", { stats: modestStats, relationships: { a: 80 } }),
    ];
    const strangers = [
      fakeMember("a", { stats: modestStats }),
      fakeMember("b", { stats: modestStats }),
    ];
    const withBonds = calculateMissionSuccess(template, bonded);
    const withoutBonds = calculateMissionSuccess(template, strangers);
    expect(withBonds).toBeGreaterThan(withoutBonds);
  });
});

/* ─── LCA walk for inbreeding ─── */
import { generationsSinceShared } from "../client/src/game/crewBirth";

/* ─── Tick pipeline ─── */
import {
  tickIncubator,
  tickAging,
  tickMissions,
  tickAmbientFeed,
  applyRelationshipDeltas,
  applyTick,
} from "./crewTick";

const ONE_HOUR_MS = 60 * 60 * 1000;

function stateWithPod(
  pod: Partial<CrewState["incubator"]["pods"][number]>,
  overrides: Partial<CrewState> = {},
): CrewState {
  const base = createDefaultCrewState();
  base.incubator.pods[0] = {
    ...base.incubator.pods[0],
    ...pod,
  };
  return { ...base, ...overrides };
}

describe("tickIncubator()", () => {
  it("initializes lastTickAt on first call without mutating pods", () => {
    const state = stateWithPod({
      status: "gestating",
      templateId: "tpl_terran_prime",
      timeRemainingHours: 4,
      totalTimeHours: 4,
    });
    const now = 1_000_000_000;
    const next = tickIncubator(state, now, () => 1);
    expect(next.lastTickAt).toBe(now);
    expect(next.incubator.pods[0].timeRemainingHours).toBe(4);
  });

  it("decrements gestation time by elapsed hours", () => {
    const state = stateWithPod(
      {
        status: "gestating",
        templateId: "tpl_terran_prime",
        timeRemainingHours: 4,
        totalTimeHours: 4,
      },
      { lastTickAt: 1_000_000_000 },
    );
    const next = tickIncubator(state, 1_000_000_000 + 2 * ONE_HOUR_MS, () => 1);
    expect(next.incubator.pods[0].timeRemainingHours).toBeCloseTo(2, 5);
  });

  it("transitions a pod to 'ready' when gestation completes", () => {
    const state = stateWithPod(
      {
        status: "gestating",
        templateId: "tpl_terran_prime",
        timeRemainingHours: 1,
        totalTimeHours: 4,
      },
      { lastTickAt: 1_000_000_000 },
    );
    const next = tickIncubator(state, 1_000_000_000 + 5 * ONE_HOUR_MS, () => 1);
    expect(next.incubator.pods[0].status).toBe("ready");
    expect(next.incubator.pods[0].timeRemainingHours).toBe(0);
  });

  it("can transition a pod to 'malfunction' when the rng fires and integrity is low", () => {
    const state = stateWithPod(
      {
        status: "gestating",
        templateId: "tpl_terran_prime",
        timeRemainingHours: 4,
        totalTimeHours: 4,
        geneticIntegrity: 55,
      },
      { lastTickAt: 1_000_000_000 },
    );
    // Force rng → 0 so the malfunction branch always fires
    const next = tickIncubator(state, 1_000_000_000 + ONE_HOUR_MS, () => 0);
    expect(next.incubator.pods[0].status).toBe("malfunction");
    expect(next.incubator.malfunctionCount).toBe(1);
  });

  it("leaves empty pods untouched", () => {
    const state = stateWithPod({}, { lastTickAt: 1_000_000_000 });
    const next = tickIncubator(state, 1_000_000_000 + 100 * ONE_HOUR_MS, () => 0);
    expect(next.incubator.pods[0].status).toBe("empty");
  });
});

describe("tickAging()", () => {
  it("does nothing on first call (initializes lastAgingTickAt)", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { age: 30 }));
    const next = tickAging(state, 1_000_000_000);
    expect(next.lastAgingTickAt).toBe(1_000_000_000);
    expect(next.roster.members[0].age).toBe(30);
  });

  it("advances age by years elapsed", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { age: 30, maxAge: 80 }));
    state.lastAgingTickAt = 1_000_000_000;
    const yearMs = 4 * 60 * 60 * 1000;
    const next = tickAging(state, 1_000_000_000 + 3 * yearMs);
    expect(next.roster.members[0].age).toBe(33);
  });

  it("moves a crew member to deceased when they exceed maxAge", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { age: 79, maxAge: 80 }));
    state.lastAgingTickAt = 1_000_000_000;
    const yearMs = 4 * 60 * 60 * 1000;
    const next = tickAging(state, 1_000_000_000 + 5 * yearMs);
    expect(next.roster.members.find(m => m.id === "a")).toBeUndefined();
    expect(next.roster.deceased.find(m => m.id === "a")).toBeDefined();
    expect(next.roster.deceased[0].deathRecord?.cause).toContain("Natural");
    expect(next.roster.totalLost).toBe(1);
  });

  it("never re-processes deceased members", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { status: "dead", age: 100 }));
    state.lastAgingTickAt = 1_000_000_000;
    const yearMs = 4 * 60 * 60 * 1000;
    const next = tickAging(state, 1_000_000_000 + 10 * yearMs);
    expect(next.roster.members[0].age).toBe(100);
  });
});

describe("tickMissions()", () => {
  it("leaves dispatched missions alone before they complete", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { status: "on_mission" }));
    state.missions.push({
      id: "m1",
      templateId: "mission_salvage_sweep",
      name: "Salvage Sweep",
      sectorId: "s",
      description: "d",
      difficulty: "routine",
      assignedCrewIds: ["a"],
      dispatchedAt: 1_000_000_000,
      completesAt: 1_000_000_000 + 10 * ONE_HOUR_MS,
      successChance: 0.8,
      preferredRole: null,
      reward: {},
      status: "dispatched",
    });
    const next = tickMissions(state, 1_000_000_000 + ONE_HOUR_MS);
    expect(next.missions[0].status).toBe("dispatched");
  });

  it("marks a mission 'lost' when all assigned crew are gone", () => {
    const state = createDefaultCrewState();
    state.missions.push({
      id: "m1",
      templateId: "mission_salvage_sweep",
      name: "Salvage Sweep",
      sectorId: "s",
      description: "d",
      difficulty: "routine",
      assignedCrewIds: ["ghost"],
      dispatchedAt: 1_000_000_000,
      completesAt: 1_000_000_000 + ONE_HOUR_MS,
      successChance: 0.8,
      preferredRole: null,
      reward: {},
      status: "dispatched",
    });
    const next = tickMissions(state, 1_000_000_000 + 5 * ONE_HOUR_MS);
    expect(next.missions[0].status).toBe("lost");
  });

  it("pushes a feed entry when a mission resolves", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { status: "on_mission" }));
    state.missions.push({
      id: "m1",
      templateId: "mission_salvage_sweep",
      name: "Salvage Sweep",
      sectorId: "s",
      description: "d",
      difficulty: "routine",
      assignedCrewIds: ["a"],
      dispatchedAt: 1_000_000_000,
      completesAt: 1_000_000_000 + ONE_HOUR_MS,
      successChance: 0.95,
      preferredRole: null,
      reward: {},
      status: "dispatched",
    });
    const next = tickMissions(state, 1_000_000_000 + 2 * ONE_HOUR_MS);
    expect(next.feed.length).toBeGreaterThan(0);
    expect(next.feed[0].id).toContain("mission-resolved");
  });
});

describe("applyRelationshipDeltas()", () => {
  it("is a no-op for fewer than 2 survivors", () => {
    const ms = [fakeMember("a")];
    expect(applyRelationshipDeltas(ms, ["a"], [])).toBe(ms);
  });

  it("bumps every survivor pair's score", () => {
    const ms = [fakeMember("a"), fakeMember("b"), fakeMember("c")];
    const next = applyRelationshipDeltas(ms, ["a", "b", "c"], []);
    expect(next[0].relationships.b).toBeGreaterThan(0);
    expect(next[0].relationships.c).toBeGreaterThan(0);
    expect(next[1].relationships.a).toBeGreaterThan(0);
  });

  it("adds extra trauma-bond when a squadmate is lost", () => {
    const ms = [fakeMember("a"), fakeMember("b")];
    const withLoss = applyRelationshipDeltas(ms, ["a", "b"], ["c"]);
    const withoutLoss = applyRelationshipDeltas(ms, ["a", "b"], []);
    expect(withLoss[0].relationships.b).toBeGreaterThan(withoutLoss[0].relationships.b);
  });

  it("clamps scores at +100", () => {
    const ms = [
      fakeMember("a", { relationships: { b: 100 } }),
      fakeMember("b", { relationships: { a: 100 } }),
    ];
    const next = applyRelationshipDeltas(ms, ["a", "b"], ["c", "d", "e"]);
    expect(next[0].relationships.b).toBeLessThanOrEqual(100);
  });

  it("leaves non-survivor members untouched", () => {
    const ms = [fakeMember("a"), fakeMember("b"), fakeMember("spectator")];
    const next = applyRelationshipDeltas(ms, ["a", "b"], []);
    expect(next[2]).toBe(ms[2]);
  });
});

describe("tickAmbientFeed()", () => {
  it("returns state unchanged when the roster is empty", () => {
    const state = createDefaultCrewState();
    const next = tickAmbientFeed(state, Date.now());
    expect(next).toBe(state);
  });

  it("adds entries once the tick interval has elapsed", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a"));
    state.feedLastGenerated = 1_000_000_000;
    const sevenHours = 7 * 60 * 60 * 1000;
    const next = tickAmbientFeed(state, 1_000_000_000 + sevenHours);
    expect(next.feed.length).toBeGreaterThan(0);
    expect(next.feedLastGenerated).toBe(1_000_000_000 + sevenHours);
  });

  it("does not re-generate within the tick interval", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a"));
    state.feedLastGenerated = 1_000_000_000;
    const next = tickAmbientFeed(state, 1_000_000_000 + 1000);
    expect(next).toBe(state);
  });
});

describe("applyTick() combined pipeline", () => {
  it("runs all sub-ticks in order without throwing on a blank state", () => {
    const state = createDefaultCrewState();
    const next = applyTick(state, 1_000_000_000, () => 1);
    expect(next.lastTickAt).toBe(1_000_000_000);
  });

  it("advances pod gestation and ages crew in the same call", () => {
    const state = createDefaultCrewState();
    state.roster.members.push(fakeMember("a", { age: 30, maxAge: 80 }));
    state.incubator.pods[0] = {
      ...state.incubator.pods[0],
      status: "gestating",
      templateId: "tpl_terran_prime",
      timeRemainingHours: 4,
      totalTimeHours: 4,
    };
    const start = 1_000_000_000;
    state.lastTickAt = start;
    state.lastAgingTickAt = start;
    const yearMs = 4 * 60 * 60 * 1000;
    const next = applyTick(state, start + yearMs, () => 1);
    // Pod consumed 4 hours → ready
    expect(next.incubator.pods[0].status).toBe("ready");
    // Aging advanced 1 year
    expect(next.roster.members[0].age).toBe(31);
  });
});

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
