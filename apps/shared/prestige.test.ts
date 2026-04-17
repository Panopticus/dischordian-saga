import { describe, it, expect } from "vitest";
import {
  EMPTY_PRESTIGE_CYCLE_STATS,
  addPrestigeCycleStats,
  measurePrestigeCycleStats,
  type PrestigeCycleStats,
} from "./prestige";
import { applyPrestigeCarryover } from "./witnessingIntegrations";

describe("prestige — EMPTY_PRESTIGE_CYCLE_STATS", () => {
  it("is all zeros", () => {
    expect(EMPTY_PRESTIGE_CYCLE_STATS).toEqual({
      loredexEntries: 0,
      bondPeakMemories: 0,
      narratorDominanceEnergy: 0,
      dischordiaCards: 0,
      witnessingMilestones: 0,
      memorableMoments: 0,
    });
  });
});

describe("prestige — measurePrestigeCycleStats", () => {
  it("counts loredex entries as array length", () => {
    const stats = measurePrestigeCycleStats({
      loredexDiscovered: ["a", "b", "c"],
    });
    expect(stats.loredexEntries).toBe(3);
  });

  it("counts collected cards as array length", () => {
    const stats = measurePrestigeCycleStats({
      collectedCards: ["card1", "card2"],
    });
    expect(stats.dischordiaCards).toBe(2);
  });

  it("counts bond-peak flags (max 3)", () => {
    const stats = measurePrestigeCycleStats({
      narrativeFlags: {
        event_two_witnesses_remember: true,
        event_silence_of_two_witnesses: true,
      },
    });
    expect(stats.bondPeakMemories).toBe(2);
  });

  it("bond-peak caps at 3 even when other event_* flags are set", () => {
    const stats = measurePrestigeCycleStats({
      narrativeFlags: {
        event_two_witnesses_remember: true,
        event_silence_of_two_witnesses: true,
        event_two_witnesses_meet: true,
        event_bulb_dims: true,
        event_sector_wakes: true,
      },
    });
    expect(stats.bondPeakMemories).toBe(3);
  });

  it("counts all event_* flags as witnessing milestones", () => {
    const stats = measurePrestigeCycleStats({
      narrativeFlags: {
        event_two_witnesses_remember: true,
        event_bulb_dims: true,
        event_sector_wakes: true,
        event_lions_last_broadcast: true,
        // Not event_* — should not count:
        act_1_complete: true,
        lightDarkAlignment: true,
      },
    });
    expect(stats.witnessingMilestones).toBe(4);
  });

  it("ignores falsy flag values (false, 0, undefined)", () => {
    const stats = measurePrestigeCycleStats({
      narrativeFlags: {
        event_two_witnesses_remember: false,
        event_bulb_dims: 0,
        event_sector_wakes: undefined,
      },
    });
    expect(stats.witnessingMilestones).toBe(0);
    expect(stats.bondPeakMemories).toBe(0);
  });

  it("passes through external narratorDominanceEnergy", () => {
    const stats = measurePrestigeCycleStats({
      externalNarratorDominanceEnergy: 42,
    });
    expect(stats.narratorDominanceEnergy).toBe(42);
  });

  it("passes through external memorableMoments", () => {
    const stats = measurePrestigeCycleStats({
      externalMemorableMoments: 7,
    });
    expect(stats.memorableMoments).toBe(7);
  });

  it("defaults externals to 0 when missing or NaN", () => {
    expect(
      measurePrestigeCycleStats({}).narratorDominanceEnergy,
    ).toBe(0);
    expect(
      measurePrestigeCycleStats({
        externalNarratorDominanceEnergy: Number.NaN,
      }).narratorDominanceEnergy,
    ).toBe(0);
  });

  it("returns all zeros for an empty input", () => {
    expect(measurePrestigeCycleStats({})).toEqual(EMPTY_PRESTIGE_CYCLE_STATS);
  });

  it("handles null inputs (never throws)", () => {
    const stats = measurePrestigeCycleStats({
      loredexDiscovered: null,
      collectedCards: null,
      narrativeFlags: null,
    });
    expect(stats).toEqual(EMPTY_PRESTIGE_CYCLE_STATS);
  });
});

describe("prestige — addPrestigeCycleStats", () => {
  it("adds component-wise", () => {
    const a: PrestigeCycleStats = {
      loredexEntries: 10,
      bondPeakMemories: 1,
      narratorDominanceEnergy: 5,
      dischordiaCards: 4,
      witnessingMilestones: 2,
      memorableMoments: 3,
    };
    const b: PrestigeCycleStats = {
      loredexEntries: 5,
      bondPeakMemories: 2,
      narratorDominanceEnergy: 10,
      dischordiaCards: 6,
      witnessingMilestones: 1,
      memorableMoments: 7,
    };
    expect(addPrestigeCycleStats(a, b)).toEqual({
      loredexEntries: 15,
      bondPeakMemories: 3,
      narratorDominanceEnergy: 15,
      dischordiaCards: 10,
      witnessingMilestones: 3,
      memorableMoments: 10,
    });
  });

  it("adding EMPTY is the identity", () => {
    const a: PrestigeCycleStats = {
      loredexEntries: 10,
      bondPeakMemories: 1,
      narratorDominanceEnergy: 5,
      dischordiaCards: 4,
      witnessingMilestones: 2,
      memorableMoments: 3,
    };
    expect(addPrestigeCycleStats(a, EMPTY_PRESTIGE_CYCLE_STATS)).toEqual(a);
    expect(addPrestigeCycleStats(EMPTY_PRESTIGE_CYCLE_STATS, a)).toEqual(a);
  });
});

describe("prestige — integration with applyPrestigeCarryover", () => {
  it("measure → add-baseline → carryover yields the correct next-cycle baseline", () => {
    // Prior baseline from one previous prestige.
    const priorBaseline: PrestigeCycleStats = {
      loredexEntries: 40,
      bondPeakMemories: 1,
      narratorDominanceEnergy: 0,
      dischordiaCards: 5,
      witnessingMilestones: 3,
      memorableMoments: 1,
    };
    // Player did more work this cycle.
    const thisCycle = measurePrestigeCycleStats({
      loredexDiscovered: new Array(20).fill(0).map((_, i) => `loredex-${i}`),
      collectedCards: new Array(8).fill(0).map((_, i) => `card-${i}`),
      narrativeFlags: {
        event_two_witnesses_remember: true,
        event_silence_of_two_witnesses: true,
        event_bulb_dims: true,
      },
      externalMemorableMoments: 20,
    });
    // Stack: everything the player is carrying into the prestige event.
    const stacked = addPrestigeCycleStats(priorBaseline, thisCycle);
    const nextBaseline = applyPrestigeCarryover(stacked);

    // Loredex: 100% carryover → 40 + 20 = 60
    expect(nextBaseline.loredexEntries).toBe(60);
    // Dischordia cards: 25% carryover → floor((5 + 8) * 0.25) = 3
    expect(nextBaseline.dischordiaCards).toBe(3);
    // Witnessing milestones: 100% → 3 + 3 = 6
    expect(nextBaseline.witnessingMilestones).toBe(6);
    // Bond peaks: 50% → floor((1 + 2) * 0.5) = 1
    expect(nextBaseline.bondPeakMemories).toBe(1);
    // Memorable moments: 10% → floor((1 + 20) * 0.1) = 2
    expect(nextBaseline.memorableMoments).toBe(2);
    // Narrator dominance: 0% always → 0
    expect(nextBaseline.narratorDominanceEnergy).toBe(0);
  });
});
