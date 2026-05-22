import { describe, it, expect } from "vitest";
import {
  scoreSalvage,
  SALVAGE_DRAFT_SIZE,
  SALVAGE_PASS_THRESHOLD,
  type SalvageSubmission,
} from "./salvage";

const DRAFT: readonly string[] = [
  "vex_solene",
  "wraith_calder",
  "lycos",
  "akai_shi",
  "locke",
];

function submission(recovered: readonly string[]): SalvageSubmission {
  return { drafted: DRAFT, recovered };
}

describe("scoreSalvage — pass/fail rules", () => {
  it("passes at exactly the threshold (3 of 5)", () => {
    const e = scoreSalvage(submission(["vex_solene", "wraith_calder", "akai_shi"]));
    expect(e.passed).toBe(true);
    expect(e.rewards?.witnessHandSize).toBe(3);
    expect(e.rewards?.recoveredBurntCardIds).toEqual([
      "vex_solene",
      "wraith_calder",
      "akai_shi",
    ]);
  });

  it("passes with all 5 recovered", () => {
    const e = scoreSalvage(submission(DRAFT));
    expect(e.passed).toBe(true);
    expect(e.rewards?.witnessHandSize).toBe(5);
  });

  it("fails below the threshold and applies the penalty", () => {
    const e = scoreSalvage(submission(["vex_solene", "wraith_calder"]));
    expect(e.passed).toBe(false);
    expect(e.penalties?.witnessHandSize).toBe(3);
    expect(e.reason).toMatch(/2 of 5/);
  });

  it("fails when nothing is recovered", () => {
    const e = scoreSalvage(submission([]));
    expect(e.passed).toBe(false);
    expect(e.penalties?.witnessHandSize).toBe(3);
  });
});

describe("scoreSalvage — validation", () => {
  it("rejects a draft of the wrong size", () => {
    const e = scoreSalvage({
      drafted: ["vex_solene", "locke"],
      recovered: ["vex_solene"],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/exactly 5/);
  });

  it("rejects a draft with duplicates", () => {
    const e = scoreSalvage({
      drafted: ["vex_solene", "vex_solene", "locke", "lycos", "akai_shi"],
      recovered: [],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/distinct/);
  });

  it("rejects a draft containing an unknown npc key", () => {
    const e = scoreSalvage({
      drafted: ["vex_solene", "locke", "lycos", "akai_shi", "not_an_npc"],
      recovered: ["vex_solene"],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/Unknown burnt card/);
  });

  it("rejects a recovered entry not in the draft", () => {
    const e = scoreSalvage({
      drafted: DRAFT,
      recovered: ["jericho_jones"],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/not in the player's draft/);
  });

  it("rejects duplicates in the recovered list", () => {
    const e = scoreSalvage({
      drafted: DRAFT,
      recovered: ["vex_solene", "vex_solene"],
    });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/duplicates/);
  });
});

describe("scoreSalvage — constants are sensible", () => {
  it("threshold ≤ draft size", () => {
    expect(SALVAGE_PASS_THRESHOLD).toBeLessThanOrEqual(SALVAGE_DRAFT_SIZE);
  });
});
