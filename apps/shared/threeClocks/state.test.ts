import { describe, it, expect } from "vitest";
import {
  composeThreeClocksState,
  composeVortexClock,
  composeNecromancerClock,
  composePoliticianClock,
  resurrectionEnergyTier,
  type ResurrectionEnergyTier,
} from "./state";
import {
  DEFAULT_CYCLE_STATE,
  type CycleState,
} from "../necromancerCycle";
import {
  DEFAULT_DISCHORDIA_CYCLE_STATE,
  type DischordiaCycleState,
} from "../dischordiaCycle";
import type { NemesisDef, NemesisRank } from "../nemesisSystem";

/* ─── FIXTURES ─── */

function mkNemesis(id: string, rank: NemesisRank): NemesisDef {
  return {
    id,
    userId: 1,
    cohortNumber: 1,
    archetype: "heretic",
    identity: {
      archetypeTitle: "The Heretic-Nemesis",
      properName: "secret",
      nameRevealed: false,
    },
    politicianTic: "vote_for_phrase",
    rank,
    grudgeTier: 0,
    preferredSurface: "apprentice",
    spawnedAt: new Date("2026-01-01").toISOString(),
    lastEncounterAt: null,
  };
}

const NEXT_TICK = new Date("2026-05-22T12:34:00Z");

/* ─── ENERGY TIER QUANTIZATION ─── */

describe("resurrectionEnergyTier", () => {
  const cases: Array<[number, ResurrectionEnergyTier]> = [
    [0, "cold"],
    [149_999, "cold"],
    [150_000, "warm"],
    [499_999, "warm"],
    [500_000, "hot"],
    [899_999, "hot"],
    [900_000, "critical"],
    [1_000_000, "critical"],
  ];
  for (const [energy, tier] of cases) {
    it(`maps ${energy} → ${tier}`, () => {
      expect(resurrectionEnergyTier(energy)).toBe(tier);
    });
  }
});

/* ─── VORTEX CLOCK ─── */

describe("composeVortexClock", () => {
  it("reads proximity, phase, and narration from the dischordia state", () => {
    const state: DischordiaCycleState = {
      ...DEFAULT_DISCHORDIA_CYCLE_STATE,
      phase: "vortex_advance",
      vortexProximity: 82,
      darkEnergy: 750_000,
    };
    const v = composeVortexClock(state);
    expect(v.proximity).toBe(82);
    expect(v.phase).toBe("vortex_advance");
    // Narration is a descriptor, not a number.
    expect(v.narration.length).toBeGreaterThan(5);
    expect(/\d/.test(v.narration)).toBe(false);
  });

  it("aggregates sectorsConsumed and sectorsReclaimed across cycle history", () => {
    const state: DischordiaCycleState = {
      ...DEFAULT_DISCHORDIA_CYCLE_STATE,
      history: [
        {
          cycleNumber: 1,
          advanceTriggeredAt: "2025-12-01T00:00:00Z",
          reclaimedAt: "2025-12-05T00:00:00Z",
          durationHours: 96,
          sectorsConsumed: 12,
          sectorsReclaimed: 9,
          outcome: "reclaimed",
        },
        {
          cycleNumber: 2,
          advanceTriggeredAt: "2026-02-01T00:00:00Z",
          reclaimedAt: "2026-02-04T00:00:00Z",
          durationHours: 72,
          sectorsConsumed: 8,
          sectorsReclaimed: 3,
          outcome: "reclaimed",
        },
      ],
    };
    const v = composeVortexClock(state);
    expect(v.sectorsConsumed).toBe(20);
    expect(v.sectorsReclaimed).toBe(12);
  });

  it("returns zeroes when no cycles have closed yet", () => {
    const v = composeVortexClock(DEFAULT_DISCHORDIA_CYCLE_STATE);
    expect(v.sectorsConsumed).toBe(0);
    expect(v.sectorsReclaimed).toBe(0);
  });
});

/* ─── NECROMANCER CLOCK ─── */

describe("composeNecromancerClock", () => {
  it("exposes phase + cycleNumber and never leaks the raw energy number", () => {
    const state: CycleState = {
      ...DEFAULT_CYCLE_STATE,
      phase: "manifesting",
      cycleNumber: 3,
      resurrectionEnergy: 650_000,
    };
    const n = composeNecromancerClock(state);
    expect(n.phase).toBe("manifesting");
    expect(n.cycleNumber).toBe(3);
    expect(n.resurrectionEnergy).toBe("hot");
    expect(n.narration.length).toBeGreaterThan(5);
    // Narration must not contain the raw energy figure.
    expect(n.narration).not.toContain("650");
  });

  it("tier boundary coincides with a narration shift", () => {
    // Tier thresholds align with `getResurrectionDescription` buckets,
    // so crossing a tier boundary always also crosses a narration
    // boundary — the UI never shows a tier shift without prose change.
    const justBelow = composeNecromancerClock({
      ...DEFAULT_CYCLE_STATE,
      resurrectionEnergy: 499_999,
    });
    const atBoundary = composeNecromancerClock({
      ...DEFAULT_CYCLE_STATE,
      resurrectionEnergy: 500_000,
    });
    expect(justBelow.resurrectionEnergy).toBe("warm");
    expect(atBoundary.resurrectionEnergy).toBe("hot");
    expect(justBelow.narration).not.toBe(atBoundary.narration);
  });
});

/* ─── POLITICIAN CLOCK ─── */

describe("composePoliticianClock", () => {
  it("reports sealed + topRank=1 when no Nemeses exist", () => {
    const p = composePoliticianClock([], false);
    expect(p.topRank).toBe(1);
    expect(p.aspirantNemesisId).toBeNull();
    expect(p.seatStatus).toBe("sealed");
    expect(p.apprenticesActive).toBe(0);
  });

  it("reports the maximum rank across the roster", () => {
    const p = composePoliticianClock(
      [mkNemesis("a", 2), mkNemesis("b", 5), mkNemesis("c", 3)],
      false,
    );
    expect(p.topRank).toBe(5);
    expect(p.aspirantNemesisId).toBeNull();
    expect(p.seatStatus).toBe("sealed"); // pre-Trial, no rank-7
    expect(p.apprenticesActive).toBe(3);
  });

  it("flags contested when any Nemesis reaches rank 7 pre-Trial", () => {
    const p = composePoliticianClock(
      [mkNemesis("a", 4), mkNemesis("b", 7), mkNemesis("c", 6)],
      false,
    );
    expect(p.topRank).toBe(7);
    expect(p.aspirantNemesisId).toBe("b");
    expect(p.seatStatus).toBe("contested");
    expect(p.apprenticesActive).toBe(3);
  });

  it("picks the first rank-7 nemesis when multiple are aspirants", () => {
    const p = composePoliticianClock(
      [mkNemesis("first", 7), mkNemesis("second", 7)],
      false,
    );
    // Only one Nemesis per cohort-set can reach rank 7 in practice,
    // but the composer must be deterministic if the precondition slips.
    expect(p.aspirantNemesisId).toBe("first");
  });

  it("post-Trial: seatResolved + rank-7 nemesis → seatStatus 'open'", () => {
    const p = composePoliticianClock([mkNemesis("a", 7)], true);
    expect(p.seatStatus).toBe("open");
    expect(p.aspirantNemesisId).toBe("a");
  });

  it("post-Trial: seatResolved without rank-7 → seatStatus 'sealed'", () => {
    const p = composePoliticianClock([mkNemesis("a", 5)], true);
    expect(p.seatStatus).toBe("sealed");
    expect(p.aspirantNemesisId).toBeNull();
  });
});

/* ─── FULL COMPOSER ─── */

describe("composeThreeClocksState", () => {
  it("composes a complete snapshot from the three state machines", () => {
    const snap = composeThreeClocksState({
      necromancer: DEFAULT_CYCLE_STATE,
      dischordia: DEFAULT_DISCHORDIA_CYCLE_STATE,
      nemeses: [mkNemesis("a", 3), mkNemesis("b", 5)],
      nextTickAt: NEXT_TICK,
    });

    expect(snap.vortex.phase).toBe(DEFAULT_DISCHORDIA_CYCLE_STATE.phase);
    expect(snap.vortex.proximity).toBe(
      DEFAULT_DISCHORDIA_CYCLE_STATE.vortexProximity,
    );
    expect(snap.necromancer.phase).toBe(DEFAULT_CYCLE_STATE.phase);
    expect(snap.necromancer.cycleNumber).toBe(
      DEFAULT_CYCLE_STATE.cycleNumber,
    );
    expect(snap.politician.topRank).toBe(5);
    expect(snap.politician.apprenticesActive).toBe(2);
    expect(snap.nextTickAt).toBe(NEXT_TICK.toISOString());
  });

  it("is deterministic for identical inputs", () => {
    const input = {
      necromancer: DEFAULT_CYCLE_STATE,
      dischordia: DEFAULT_DISCHORDIA_CYCLE_STATE,
      nemeses: [mkNemesis("a", 4)],
      nextTickAt: NEXT_TICK,
    };
    expect(composeThreeClocksState(input)).toEqual(
      composeThreeClocksState(input),
    );
  });

  it("convergence: vortex + necromancer + politician simultaneously critical", () => {
    // The Fracture trigger condition per the plan: all three clocks
    // at their respective critical states at once.
    const snap = composeThreeClocksState({
      necromancer: {
        ...DEFAULT_CYCLE_STATE,
        phase: "manifesting",
        resurrectionEnergy: 950_000,
      },
      dischordia: {
        ...DEFAULT_DISCHORDIA_CYCLE_STATE,
        phase: "vortex_advance",
        vortexProximity: 91,
        darkEnergy: 750_000,
      },
      nemeses: [mkNemesis("aspirant", 7)],
      nextTickAt: NEXT_TICK,
    });
    expect(snap.vortex.phase).toBe("vortex_advance");
    expect(snap.vortex.proximity).toBeGreaterThanOrEqual(80);
    expect(snap.necromancer.phase).toBe("manifesting");
    expect(snap.necromancer.resurrectionEnergy).toBe("critical");
    expect(snap.politician.topRank).toBe(7);
    expect(snap.politician.seatStatus).toBe("contested");
  });
});
