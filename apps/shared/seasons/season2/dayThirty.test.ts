import { describe, it, expect } from "vitest";
import { planDay30Cleanup, runLoreDriftTest } from "./dayThirty";
import type { WorldStateDelta } from "./types";

function delta(
  sacrificed: "elara" | "human",
  winner: import("../../nexusTrial/buckets").BallotKey,
  resolution: import("./types").PoliticianForkResolution,
): WorldStateDelta {
  return {
    trialKey: "test",
    closedAt: "2027-03-15T23:59:59Z",
    companionSacrifice: {
      sacrificed,
      tally: { elara: 0, human: 0 },
      cinematicFired: "x",
    },
    secondDeathBallot: {
      winner,
      tally: { wraith_calder: 0, lycos: 0, akai_shi: 0, vex_solene: 0 },
      tieBreakUsed: false,
      cinematicFired: "x",
    },
    locke: { status: "permadead", cinematicFired: "x", necromancerCooldownMonths: 9 },
    politicianFork: {
      engagementScore: 0.5,
      alignmentScore: 0,
      resolution,
      archonAspirantNemesisId: null,
    },
    vortexPostTrial: {
      proximityAtClose: 79,
      sectorsReclaimedInTrial: 18,
      sectorsRemainingConsumed: 29,
    },
  };
}

describe("planDay30Cleanup — retention plan", () => {
  it("retains exactly 4 modules (shared + 3 dimensions)", () => {
    const plan = planDay30Cleanup(delta("elara", "akai_shi", "seat_sealed"));
    expect(plan.retained.length).toBe(4);
    expect(plan.retained).toContain("shared");
    expect(plan.retained).toContain("companion_sacrifice/elara_dies");
    expect(plan.retained).toContain("second_death/akai_dies");
    expect(plan.retained).toContain("politician_fork/seat_sealed");
  });

  it("removes the 6 modules that did not fire", () => {
    const plan = planDay30Cleanup(delta("elara", "akai_shi", "seat_sealed"));
    expect(plan.removed.length).toBe(6);
    expect(plan.removed).toContain("companion_sacrifice/human_dies");
    expect(plan.removed).toContain("second_death/wraith_dies");
    expect(plan.removed).toContain("second_death/lycos_dies");
    expect(plan.removed).toContain("second_death/vex_dies");
    expect(plan.removed).toContain("politician_fork/constrained_return");
    expect(plan.removed).toContain("politician_fork/full_return");
  });

  it("retained ∪ removed = all 10 modules", () => {
    const plan = planDay30Cleanup(delta("human", "vex_solene", "full_return"));
    expect(plan.retained.length + plan.removed.length).toBe(10);
  });

  it("is deterministic for identical input", () => {
    const d = delta("human", "lycos", "constrained_return");
    expect(planDay30Cleanup(d)).toEqual(planDay30Cleanup(d));
  });
});

describe("runLoreDriftTest — drift detection", () => {
  it("passes when every deceased character is past-tense", () => {
    const result = runLoreDriftTest([
      { key: "locke", loreBiblePastTense: true, loredexStatusDeceased: true },
      { key: "elara", loreBiblePastTense: true, loredexStatusDeceased: true },
      { key: "the_human", loreBiblePastTense: false, loredexStatusDeceased: false },
    ]);
    expect(result.passed).toBe(true);
    expect(result.driftedCharacters).toEqual([]);
  });

  it("fails and names every drifted character", () => {
    const result = runLoreDriftTest([
      { key: "locke", loreBiblePastTense: false, loredexStatusDeceased: true },
      { key: "wraith_calder", loreBiblePastTense: false, loredexStatusDeceased: true },
      { key: "elara", loreBiblePastTense: true, loredexStatusDeceased: false },
    ]);
    expect(result.passed).toBe(false);
    expect(result.driftedCharacters).toEqual(["locke", "wraith_calder"]);
  });

  it("a character with no deceased status but past-tense lore is NOT drift", () => {
    // The Antiquarian writes about historical figures in past tense
    // routinely. That's not drift.
    const result = runLoreDriftTest([
      { key: "iron_lion", loreBiblePastTense: true, loredexStatusDeceased: false },
    ]);
    expect(result.passed).toBe(true);
  });

  it("empty input passes", () => {
    expect(runLoreDriftTest([]).passed).toBe(true);
  });
});
