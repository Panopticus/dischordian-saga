import { describe, expect, it, vi } from "vitest";
import {
  applyBreakingPointChoice,
  commitBreakingPointChoice,
} from "@shared/breakingPointFlagCommit";

describe("commitBreakingPointChoice", () => {
  it("save_elara returns the canonical Elara flags", () => {
    const { outcome, flagsToSet } = commitBreakingPointChoice("save_elara");
    expect(outcome.remainingCompanion).toBe("elara");
    expect(outcome.lostCompanion).toBe("human");
    const flagNames = flagsToSet.map(([f]) => f);
    expect(flagNames).toContain("breaking_point_chose_elara");
    expect(flagNames).toContain("human_severed");
    expect(flagNames).toContain("elara_bond_locked");
    for (const [, value] of flagsToSet) expect(value).toBe(true);
  });

  it("save_human returns the canonical Human flags", () => {
    const { outcome, flagsToSet } = commitBreakingPointChoice("save_human");
    expect(outcome.remainingCompanion).toBe("human");
    const flagNames = flagsToSet.map(([f]) => f);
    expect(flagNames).toContain("breaking_point_chose_human");
    expect(flagNames).toContain("elara_severed");
    expect(flagNames).toContain("human_bond_locked");
  });

  it("refuse returns the canonical refusal flags", () => {
    const { outcome, flagsToSet } = commitBreakingPointChoice("refuse");
    expect(outcome.remainingCompanion).toBe("neither");
    const flagNames = flagsToSet.map(([f]) => f);
    expect(flagNames).toContain("breaking_point_refused");
    expect(flagNames).toContain("dual_signal_unstable");
  });

  it("flagsToSet preserves outcome.flags ordering", () => {
    const { outcome, flagsToSet } = commitBreakingPointChoice("save_elara");
    expect(flagsToSet.map(([f]) => f)).toEqual(outcome.flags);
  });
});

describe("applyBreakingPointChoice", () => {
  it("calls setNarrativeFlag for each canonical flag and returns the outcome", () => {
    const setter = vi.fn();
    const outcome = applyBreakingPointChoice("save_elara", setter);
    expect(outcome.remainingCompanion).toBe("elara");
    expect(setter).toHaveBeenCalledTimes(outcome.flags.length);
    for (const flag of outcome.flags) {
      expect(setter).toHaveBeenCalledWith(flag, true);
    }
  });
});
