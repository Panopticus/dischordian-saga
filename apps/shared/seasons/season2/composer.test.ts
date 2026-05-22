import { describe, it, expect } from "vitest";
import {
  composeSeason2State,
  composeDay1DailyBrief,
  selectModules,
} from "./composer";
import type { WorldStateDelta, PoliticianForkResolution } from "./types";
import { BALLOT_KEYS, COMPANION_KEYS } from "../../nexusTrial/buckets";
import type { BallotKey } from "../../nexusTrial/buckets";

function deltaFor(
  sacrificed: "elara" | "human",
  winner: BallotKey,
  resolution: PoliticianForkResolution,
): WorldStateDelta {
  return {
    trialKey: "nexus_trial_2027",
    closedAt: "2027-03-15T23:59:59Z",
    companionSacrifice: {
      sacrificed,
      tally: { elara: 1000, human: 1000 },
      cinematicFired: `confession_${sacrificed}_dies`,
    },
    secondDeathBallot: {
      winner,
      tally: { wraith_calder: 0, lycos: 0, akai_shi: 0, vex_solene: 0 },
      tieBreakUsed: false,
      cinematicFired: `verdict_ballot_${winner}`,
    },
    locke: {
      status: "permadead",
      cinematicFired: "verdict_locke",
      necromancerCooldownMonths: 9,
    },
    politicianFork: {
      engagementScore: 0.8,
      alignmentScore: 0.3,
      resolution,
      archonAspirantNemesisId: resolution === "seat_sealed" ? null : "nemesis_x",
    },
    vortexPostTrial: {
      proximityAtClose: 79,
      sectorsReclaimedInTrial: 18,
      sectorsRemainingConsumed: 29,
    },
  };
}

const RESOLUTIONS: PoliticianForkResolution[] = [
  "seat_sealed",
  "constrained_return",
  "full_return",
];

describe("selectModules — picks 4 modules per delta (shared + 3 dimensions)", () => {
  it("always activates 4 modules", () => {
    const modules = selectModules(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(modules.length).toBe(4);
    expect(modules[0].id).toBe("shared");
  });
});

describe("composeSeason2State — all 24 combinations", () => {
  it("composes every combination without throwing", () => {
    let combinations = 0;
    for (const sacrificed of COMPANION_KEYS) {
      for (const winner of BALLOT_KEYS) {
        for (const resolution of RESOLUTIONS) {
          const state = composeSeason2State(deltaFor(sacrificed, winner, resolution));
          expect(state.activatedModules.length).toBe(4);
          expect(state.activatedModules[0]).toBe("shared");
          combinations++;
        }
      }
    }
    expect(combinations).toBe(24); // 2 × 4 × 3
  });

  it("always merges Locke into loredex patches (shared)", () => {
    const state = composeSeason2State(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(state.loredexPatches.locke).toBeDefined();
    expect(state.loredexPatches.locke.status).toBe("in_memoriam");
  });

  it("companion variant adds the sacrificed companion to loredex patches", () => {
    const elaraDelta = composeSeason2State(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(elaraDelta.loredexPatches.elara).toBeDefined();
    expect(elaraDelta.loredexPatches.elara.status).toBe("in_memoriam");

    const humanDelta = composeSeason2State(deltaFor("human", "akai_shi", "seat_sealed"));
    expect(humanDelta.loredexPatches.the_human).toBeDefined();
  });

  it("ballot variant adds the sacrificed candidate to loredex patches", () => {
    const wraithDelta = composeSeason2State(deltaFor("elara", "wraith_calder", "seat_sealed"));
    expect(wraithDelta.loredexPatches.wraith_calder).toBeDefined();
  });

  it("Human-dies unlocks the chip card; Elara-dies does not", () => {
    const human = composeSeason2State(deltaFor("human", "akai_shi", "seat_sealed"));
    expect(human.cardUnlocks).toContain("the_humans_chip");

    const elara = composeSeason2State(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(elara.cardUnlocks).not.toContain("the_humans_chip");
  });

  it("full_return unlocks the_politicians_pin; seat_sealed does not", () => {
    const full = composeSeason2State(deltaFor("elara", "akai_shi", "full_return"));
    expect(full.cardUnlocks).toContain("the_politicians_pin");

    const sealed = composeSeason2State(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(sealed.cardUnlocks).not.toContain("the_politicians_pin");
  });

  it("crossArcRipples are deduped across modules", () => {
    const state = composeSeason2State(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(new Set(state.crossArcRipples).size).toBe(state.crossArcRipples.length);
  });

  it("is deterministic for identical inputs", () => {
    const d = deltaFor("elara", "akai_shi", "constrained_return");
    expect(composeSeason2State(d)).toEqual(composeSeason2State(d));
  });
});

describe("composeDay1DailyBrief", () => {
  it("includes Locke's retirement, both deaths, and the politician line", () => {
    const brief = composeDay1DailyBrief(deltaFor("elara", "wraith_calder", "seat_sealed"));
    expect(brief).toContain("Locke");
    expect(brief).toContain("Elara");
    expect(brief).toContain("Wraith Calder");
    expect(brief).toContain("sealed");
  });

  it("references the surviving companion in 'What remains'", () => {
    const elaraDied = composeDay1DailyBrief(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(elaraDied).toContain("The Human");

    const humanDied = composeDay1DailyBrief(deltaFor("human", "akai_shi", "seat_sealed"));
    expect(humanDied).toContain("Elara");
  });

  it("politician line shifts by resolution", () => {
    const sealed = composeDay1DailyBrief(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(sealed).toContain("sealed");

    const constrained = composeDay1DailyBrief(deltaFor("elara", "akai_shi", "constrained_return"));
    expect(constrained).toContain("yellow tie");

    const full = composeDay1DailyBrief(deltaFor("elara", "akai_shi", "full_return"));
    expect(full).toContain("Academy is open");
  });

  it("references the Necromancer cooldown duration from the delta", () => {
    const brief = composeDay1DailyBrief(deltaFor("elara", "akai_shi", "seat_sealed"));
    expect(brief).toContain("9 months");
  });
});
