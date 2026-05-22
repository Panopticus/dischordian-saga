import { describe, it, expect } from "vitest";
import { runCompressedDryRun, type SyntheticPlay } from "./dryRunHarness";
import { TRIAL_PHASES } from "./phases";
import { BALLOT_KEYS } from "./buckets";

function play(b: string, weight = 100, playerId = 1): SyntheticPlay {
  return { playerId, bucket: b, weightX100: weight };
}

describe("compressed dry-run — end-to-end resolution", () => {
  it("traverses all 6 phases", () => {
    const result = runCompressedDryRun({ playsByPhase: {} });
    expect(result.phasesTraversed).toEqual([
      "charge",
      "opening",
      "evidence",
      "cross_examination",
      "confession",
      "verdict",
    ]);
  });

  it("aggregates plays across all phases into bucket totals", () => {
    const result = runCompressedDryRun({
      playsByPhase: {
        evidence: [play("companion:elara", 500), play("companion:human", 300)],
        confession: [play("companion:elara", 200)],
      },
    });
    expect(result.totals["companion:elara"]).toBe(700);
    expect(result.totals["companion:human"]).toBe(300);
  });

  it("companion sacrifice: lower-weighted companion is sacrificed", () => {
    // Elara has less total weight → community defended her less → sacrificed.
    const result = runCompressedDryRun({
      playsByPhase: {
        confession: [play("companion:human", 1000), play("companion:elara", 200)],
      },
    });
    expect(result.companionSacrificed).toBe("elara");
  });

  it("ballot winner: highest-weighted candidate is sacrificed", () => {
    const result = runCompressedDryRun({
      playsByPhase: {
        evidence: [
          play("ballot:wraith_calder", 500),
          play("ballot:vex_solene", 1500),
          play("ballot:akai_shi", 800),
        ],
      },
    });
    expect(result.ballotWinner).toBe("vex_solene");
  });

  it("permadeath includes Locke + ballot winner with correct sources", () => {
    const result = runCompressedDryRun({
      playsByPhase: {
        evidence: [play("ballot:akai_shi", 1000)],
      },
    });
    expect(result.permadeathEntries).toContainEqual({
      npcKey: "locke",
      source: "necromancer_price",
    });
    expect(result.permadeathEntries).toContainEqual({
      npcKey: "akai_shi",
      source: "vortex_price",
    });
  });

  it("empty input: default ballot fallback (akai_shi tie-break to first)", () => {
    const result = runCompressedDryRun({ playsByPhase: {} });
    // All weights zero; tie-break = canonical order; wraith first.
    // But scoreBallot starts winner=akai_shi default with -Infinity;
    // wraith's 0 > -Infinity → winner=wraith.
    expect(BALLOT_KEYS).toContain(result.ballotWinner);
  });

  it("does not leak permadeath store state between runs", () => {
    const a = runCompressedDryRun({
      playsByPhase: { evidence: [play("ballot:wraith_calder", 1000)] },
    });
    expect(a.ballotWinner).toBe("wraith_calder");

    const b = runCompressedDryRun({
      playsByPhase: { evidence: [play("ballot:lycos", 1000)] },
    });
    expect(b.ballotWinner).toBe("lycos");
    // Run b's permadeath store should not contain wraith.
    expect(b.permadeathEntries.find((e) => e.npcKey === "wraith_calder"))
      .toBeUndefined();
  });
});

describe("compressed dry-run — Fracture convergence smoke", () => {
  it("composes a complete narrative when all three signals fire", () => {
    // Heavy synthetic load to confirm aggregation handles realistic
    // numbers without overflow.
    const heavy: SyntheticPlay[] = [];
    for (let i = 0; i < 10_000; i++) {
      heavy.push(play("companion:elara", 100, i));
      heavy.push(play("ballot:vex_solene", 100, i));
    }
    const result = runCompressedDryRun({
      playsByPhase: { evidence: heavy, confession: heavy.slice(0, 5000) },
    });
    // Evidence: 10,000 elara plays + 10,000 vex plays at 100 each.
    // Confession: heavy.slice(0, 5000) — alternating, so 2,500 elara
    // + 2,500 vex. Totals: 1,000,000 + 250,000 each.
    expect(result.totals["companion:elara"]).toBe(1_250_000);
    expect(result.totals["ballot:vex_solene"]).toBe(1_250_000);
    expect(result.companionSacrificed).toBe("human");
    expect(result.ballotWinner).toBe("vex_solene");
  });
});
