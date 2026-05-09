import { describe, it, expect } from "vitest";

import {
  ARCHITECT_PLOT_BEATS,
  eligibleBeats,
  validateAllArchitectPlotBeats,
} from "../architectPlot";
import {
  DREAMER_PLOT_BEATS,
  eligibleDreamerBeats,
  validateAllDreamerPlotBeats,
} from "../dreamerPlot";

describe("Architect plot beats — registry shape", () => {
  it("loads at least one beat", () => {
    expect(ARCHITECT_PLOT_BEATS.length).toBeGreaterThan(0);
  });

  it("validateAllArchitectPlotBeats returns no errors", () => {
    expect(validateAllArchitectPlotBeats()).toEqual([]);
  });

  it("every beat declares ≥ 1 consequence", () => {
    for (const b of ARCHITECT_PLOT_BEATS) {
      expect(b.consequences.length).toBeGreaterThan(0);
    }
  });

  it("beat ids are unique", () => {
    const ids = ARCHITECT_PLOT_BEATS.map(b => b.beatId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Dreamer plot beats — registry shape", () => {
  it("loads at least one beat", () => {
    expect(DREAMER_PLOT_BEATS.length).toBeGreaterThan(0);
  });

  it("validateAllDreamerPlotBeats returns no errors", () => {
    expect(validateAllDreamerPlotBeats()).toEqual([]);
  });

  it("beat ids are unique across registry", () => {
    const ids = DREAMER_PLOT_BEATS.map(b => b.beatId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("eligibleBeats (Architect)", () => {
  it("zero-prerequisite beats are eligible at start", () => {
    const eligible = eligibleBeats(new Set(), new Set(), 0);
    const ids = eligible.map(b => b.beatId);
    expect(ids).toContain("architect.dormant_archive_activates");
  });

  it("excludes beats already fired", () => {
    const eligible = eligibleBeats(
      new Set(),
      new Set(["architect.dormant_archive_activates"]),
      0,
    );
    const ids = eligible.map(b => b.beatId);
    expect(ids).not.toContain("architect.dormant_archive_activates");
  });

  it("requires prerequisite milestones to have fired", () => {
    // The rewrite_engineer_attribution beat needs antiquarian citation published.
    const beforeMilestone = eligibleBeats(new Set(), new Set(), 0)
      .map(b => b.beatId);
    expect(beforeMilestone).not.toContain(
      "architect.rewrite_the_engineer_attribution",
    );
    const afterMilestone = eligibleBeats(
      new Set(["antiquarian.restore_attribution::citation_published"]),
      new Set(),
      0,
    ).map(b => b.beatId);
    expect(afterMilestone).toContain(
      "architect.rewrite_the_engineer_attribution",
    );
  });

  it("respects minAct gates", () => {
    // architect.oracle_silence_attempt has minAct: 3.
    const tooEarly = eligibleBeats(new Set(), new Set(), 1).map(b => b.beatId);
    expect(tooEarly).not.toContain("architect.oracle_silence_attempt");
    const inAct3 = eligibleBeats(new Set(), new Set(), 3).map(b => b.beatId);
    expect(inAct3).toContain("architect.oracle_silence_attempt");
  });
});

describe("eligibleDreamerBeats", () => {
  it("zero-prerequisite beats are eligible at start", () => {
    const eligible = eligibleDreamerBeats(new Set(), new Set(), 0);
    expect(eligible.map(b => b.beatId)).toContain(
      "dreamer.first_fragment_dictated",
    );
  });

  it("public_reading_lands gates on minAct 2", () => {
    expect(
      eligibleDreamerBeats(new Set(), new Set(), 1).map(b => b.beatId),
    ).not.toContain("dreamer.public_reading_lands");
    expect(
      eligibleDreamerBeats(new Set(), new Set(), 2).map(b => b.beatId),
    ).toContain("dreamer.public_reading_lands");
  });

  it("inventor_amplifies_fragment requires the first fragment to have dictated", () => {
    const beforeFragment = eligibleDreamerBeats(new Set(), new Set(), 0)
      .map(b => b.beatId);
    expect(beforeFragment).not.toContain("dreamer.inventor_amplifies_fragment");
    const afterFragment = eligibleDreamerBeats(
      new Set(["dreamer.first_fragment_dictated"]),
      new Set(),
      0,
    ).map(b => b.beatId);
    expect(afterFragment).toContain("dreamer.inventor_amplifies_fragment");
  });

  it("endgame fragment gates on Act 6 + multiple milestone prerequisites", () => {
    const partial = eligibleDreamerBeats(
      new Set([
        "antiquarian.restore_attribution::citation_published",
      ]),
      new Set(),
      6,
    ).map(b => b.beatId);
    expect(partial).not.toContain("dreamer.fragment_unfolds_at_endgame");
    const full = eligibleDreamerBeats(
      new Set([
        "antiquarian.restore_attribution::citation_published",
        "insurgency.awaken_the_faithful::broadcast_meets_inheritance",
      ]),
      new Set(),
      6,
    ).map(b => b.beatId);
    expect(full).toContain("dreamer.fragment_unfolds_at_endgame");
  });
});
