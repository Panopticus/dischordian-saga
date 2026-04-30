import { describe, it, expect } from "vitest";
import {
  BLOODLINE_MILESTONES,
  BLOODLINE_THRESHOLDS,
  BOON_CAPS,
  aggregateBloodlineBoons,
  buildWitnessReport,
  evaluateBloodlineMilestones,
  hasFiledWitness,
  scanBloodlineForWitnesses,
  witnessId,
  type SubstrateBoon,
  type WitnessReport,
} from "./lyraVoxBloodlineWitness";
import type { SerializedBloodline, SerializedCrewMember } from "./crewPersistence";

const NOW = 1_700_000_000_000;

const mkBloodline = (over: Partial<SerializedBloodline> = {}): SerializedBloodline => ({
  id: "iron_memory",
  founderTemplateId: "tpl",
  name: "Iron Memory",
  motto: "we remember",
  color: "#888",
  generationCount: 1,
  geneticDrift: 0,
  diversityIndex: 0,
  activeTraits: [],
  recessiveTraits: [],
  power: { name: "x", description: "", stat: "intellect", baseValue: 0, perGeneration: 0 },
  ...over,
});

const mkMember = (over: Partial<SerializedCrewMember> = {}): SerializedCrewMember => ({
  id: "m1",
  name: "n",
  nickname: null,
  species: "human",
  gender: "female",
  bloodlineId: "iron_memory",
  generation: 1,
  parentIds: null,
  children: [],
  geneticTraits: [],
  role: null,
  stats: {
    resilience: 50, intellect: 50, reflexes: 50, empathy: 50, immunity: 50, adaptability: 50,
  },
  morale: 50,
  health: 100,
  loyalty: 50,
  status: "active",
  age: 20,
  maxAge: 80,
  missionHistory: [],
  relationships: {},
  birthCycle: 0,
  ...over,
});

describe("BLOODLINE_MILESTONES", () => {
  it("ships the canonical five milestones in canonical order", () => {
    expect(BLOODLINE_MILESTONES).toEqual([
      "dynasty_reached",
      "high_fitness_birth",
      "founder_passed",
      "drift_exceeded",
      "centenary",
    ]);
  });

  it("thresholds form a sensible monotonic ladder for generation gates", () => {
    expect(BLOODLINE_THRESHOLDS.dynastyGenerations).toBeLessThan(
      BLOODLINE_THRESHOLDS.centenaryGenerations,
    );
  });
});

describe("evaluateBloodlineMilestones", () => {
  it("returns empty for a fresh bloodline with no context", () => {
    expect(evaluateBloodlineMilestones(mkBloodline())).toEqual([]);
  });

  it("flags dynasty_reached at 3 generations", () => {
    expect(evaluateBloodlineMilestones(mkBloodline({ generationCount: 3 })))
      .toContain("dynasty_reached");
  });

  it("does not flag dynasty_reached at 2 generations", () => {
    expect(evaluateBloodlineMilestones(mkBloodline({ generationCount: 2 })))
      .not.toContain("dynasty_reached");
  });

  it("flags high_fitness_birth when context fitness >= 80", () => {
    expect(evaluateBloodlineMilestones(mkBloodline(), { highestFitnessSeen: 80 }))
      .toContain("high_fitness_birth");
  });

  it("flags founder_passed only when context says the founder is gone", () => {
    expect(evaluateBloodlineMilestones(mkBloodline(), { founderHasPassed: true }))
      .toContain("founder_passed");
    expect(evaluateBloodlineMilestones(mkBloodline(), { founderHasPassed: false }))
      .not.toContain("founder_passed");
  });

  it("flags drift_exceeded at 60 drift", () => {
    expect(evaluateBloodlineMilestones(mkBloodline({ geneticDrift: 60 })))
      .toContain("drift_exceeded");
  });

  it("flags centenary at 10 generations and dynasty_reached too", () => {
    const out = evaluateBloodlineMilestones(mkBloodline({ generationCount: 10 }));
    expect(out).toContain("centenary");
    expect(out).toContain("dynasty_reached");
  });
});

describe("witnessId / hasFiledWitness", () => {
  it("witness ids are deterministic and namespaced", () => {
    expect(witnessId("iron_memory", "dynasty_reached"))
      .toBe("lyra_vox.iron_memory.dynasty_reached");
  });

  it("hasFiledWitness matches by id", () => {
    const filed = [{ id: "lyra_vox.iron_memory.dynasty_reached" }];
    expect(hasFiledWitness(filed, "iron_memory", "dynasty_reached")).toBe(true);
    expect(hasFiledWitness(filed, "iron_memory", "centenary")).toBe(false);
    expect(hasFiledWitness(filed, "void_resonance", "dynasty_reached")).toBe(false);
  });
});

describe("buildWitnessReport", () => {
  it("attaches a non-empty Lyra Vox line", () => {
    const r = buildWitnessReport("iron_memory", "dynasty_reached", NOW);
    expect(r.line.length).toBeGreaterThan(20);
  });

  it("attaches a boon scoped to the bloodline + milestone", () => {
    const r = buildWitnessReport("iron_memory", "founder_passed", NOW);
    expect(r.boon.bloodlineId).toBe("iron_memory");
    expect(r.boon.milestone).toBe("founder_passed");
    expect(r.boon.filedAt).toBe(NOW);
  });

  it("each milestone has at least one non-zero boon stat", () => {
    for (const m of BLOODLINE_MILESTONES) {
      const r = buildWitnessReport("iron_memory", m, NOW);
      const total = r.boon.gestationSpeedBp + r.boon.integrityFloorBp + r.boon.mutationFavorBp;
      expect(total).toBeGreaterThan(0);
    }
  });

  it("drift_exceeded carries no gestation speed-up — it's a stabilizer, not a kindness", () => {
    const r = buildWitnessReport("iron_memory", "drift_exceeded", NOW);
    expect(r.boon.gestationSpeedBp).toBe(0);
    expect(r.boon.integrityFloorBp).toBeGreaterThan(0);
  });
});

describe("aggregateBloodlineBoons", () => {
  const mkBoon = (over: Partial<SubstrateBoon>): SubstrateBoon => ({
    bloodlineId: "iron_memory",
    milestone: "dynasty_reached",
    gestationSpeedBp: 0,
    integrityFloorBp: 0,
    mutationFavorBp: 0,
    filedAt: NOW,
    ...over,
  });

  it("sums boons for the requested bloodline only", () => {
    const out = aggregateBloodlineBoons([
      mkBoon({ gestationSpeedBp: 300 }),
      mkBoon({ bloodlineId: "void_resonance", gestationSpeedBp: 500 }),
    ], "iron_memory");
    expect(out.gestationSpeedBp).toBe(300);
  });

  it("caps gestation speed boon at 1500bp", () => {
    const out = aggregateBloodlineBoons([
      mkBoon({ gestationSpeedBp: 1000 }),
      mkBoon({ gestationSpeedBp: 1000 }),
    ], "iron_memory");
    expect(out.gestationSpeedBp).toBe(BOON_CAPS.gestationSpeedBp);
  });

  it("caps integrity floor boon at 2000bp", () => {
    const out = aggregateBloodlineBoons([
      mkBoon({ integrityFloorBp: 1500 }),
      mkBoon({ integrityFloorBp: 1500 }),
    ], "iron_memory");
    expect(out.integrityFloorBp).toBe(BOON_CAPS.integrityFloorBp);
  });

  it("returns zeros for a bloodline with no filed boons", () => {
    expect(aggregateBloodlineBoons([], "iron_memory"))
      .toEqual({ gestationSpeedBp: 0, integrityFloorBp: 0, mutationFavorBp: 0 });
  });
});

describe("scanBloodlineForWitnesses", () => {
  it("returns no reports when nothing qualifies", () => {
    const reports = scanBloodlineForWitnesses(
      mkBloodline(),
      [mkMember()],
      [],
      [],
      NOW,
    );
    expect(reports).toEqual([]);
  });

  it("files the first dynasty_reached report and skips on re-scan", () => {
    const bloodline = mkBloodline({ generationCount: 3 });
    const first = scanBloodlineForWitnesses(bloodline, [mkMember()], [], [], NOW);
    expect(first.map(r => r.milestone)).toContain("dynasty_reached");

    const filed: WitnessReport[] = first;
    const second = scanBloodlineForWitnesses(bloodline, [mkMember()], [], filed, NOW);
    expect(second.map(r => r.milestone)).not.toContain("dynasty_reached");
  });

  it("detects founder_passed when a deceased member is the founder", () => {
    const reports = scanBloodlineForWitnesses(
      mkBloodline(),
      [],
      [mkMember({ id: "f", isFounder: true })],
      [],
      NOW,
    );
    expect(reports.map(r => r.milestone)).toContain("founder_passed");
  });

  it("detects high_fitness_birth from raw stat sums", () => {
    const reports = scanBloodlineForWitnesses(
      mkBloodline(),
      [mkMember({ stats: {
        resilience: 90, intellect: 90, reflexes: 90, empathy: 90, immunity: 90, adaptability: 90,
      } })],
      [],
      [],
      NOW,
    );
    expect(reports.map(r => r.milestone)).toContain("high_fitness_birth");
  });

  it("ignores members from other bloodlines when computing fitness", () => {
    const reports = scanBloodlineForWitnesses(
      mkBloodline(),
      [mkMember({ bloodlineId: "void_resonance", stats: {
        resilience: 90, intellect: 90, reflexes: 90, empathy: 90, immunity: 90, adaptability: 90,
      } })],
      [],
      [],
      NOW,
    );
    expect(reports.map(r => r.milestone)).not.toContain("high_fitness_birth");
  });
});
