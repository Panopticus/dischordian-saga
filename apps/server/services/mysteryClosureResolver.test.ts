import { describe, expect, it } from "vitest";
import {
  applyClosureSnapshot,
  resolveMysteryClosureBranch,
} from "./mysteryClosureResolver";
import type {
  MysteryDefinition,
  MysteryInfluenceGate,
  MysteryInfluenceState,
} from "@shared/mysteryTypes";

const baseState: MysteryInfluenceState = {
  narrativeFlags: new Set<string>(),
  moralityScore: 0,
  trustByCompanion: {},
  narrativeAct: 0,
};

function withGates(
  gates: ReadonlyArray<MysteryInfluenceGate>,
): Pick<MysteryDefinition, "playerInfluenceGates"> {
  return { playerInfluenceGates: gates };
}

describe("resolveMysteryClosureBranch (audit/16 PR 33 — AR3 runtime hook)", () => {
  it("returns null when the mystery has no gates", () => {
    expect(resolveMysteryClosureBranch({}, baseState)).toBeNull();
    expect(resolveMysteryClosureBranch(withGates([]), baseState)).toBeNull();
  });

  it("returns null when no gate matches", () => {
    const m = withGates([
      {
        id: "g1",
        condition: { kind: "narrative_flag", flag: "kael_alive" },
        branchId: "branch_kael_lives",
      },
    ]);
    expect(resolveMysteryClosureBranch(m, baseState)).toBeNull();
  });

  it("returns the first matching gate's branchId", () => {
    const m = withGates([
      {
        id: "g1",
        condition: { kind: "narrative_flag", flag: "act_3_complete" },
        branchId: "branch_a",
      },
      {
        id: "g2",
        condition: { kind: "act_at_least", act: 3 },
        branchId: "branch_b",
      },
    ]);
    const state: MysteryInfluenceState = {
      ...baseState,
      narrativeFlags: new Set(["act_3_complete"]),
      narrativeAct: 5,
    };
    const r = resolveMysteryClosureBranch(m, state);
    expect(r).toEqual({ gateId: "g1", branchId: "branch_a" });
  });

  it("walks gates in order — earlier gates win even when later ones also match", () => {
    const m = withGates([
      {
        id: "kael_dies",
        condition: { kind: "narrative_flag", flag: "kael_killed" },
        branchId: "branch_kael_dies",
      },
      {
        id: "act_5_default",
        condition: { kind: "act_at_least", act: 5 },
        branchId: "branch_act_5_default",
      },
    ]);
    const state: MysteryInfluenceState = {
      ...baseState,
      narrativeFlags: new Set(["kael_killed"]),
      narrativeAct: 6,
    };
    expect(resolveMysteryClosureBranch(m, state)).toEqual({
      gateId: "kael_dies",
      branchId: "branch_kael_dies",
    });
  });

  it("evaluates morality gates", () => {
    const m = withGates([
      {
        id: "dark_path",
        condition: { kind: "morality", operator: "<=", threshold: -50 },
        branchId: "branch_dark",
      },
      {
        id: "light_path",
        condition: { kind: "morality", operator: ">=", threshold: 50 },
        branchId: "branch_light",
      },
    ]);
    expect(
      resolveMysteryClosureBranch(m, { ...baseState, moralityScore: -75 }),
    ).toEqual({ gateId: "dark_path", branchId: "branch_dark" });
    expect(
      resolveMysteryClosureBranch(m, { ...baseState, moralityScore: 75 }),
    ).toEqual({ gateId: "light_path", branchId: "branch_light" });
    expect(
      resolveMysteryClosureBranch(m, { ...baseState, moralityScore: 0 }),
    ).toBeNull();
  });

  it("evaluates trust gates per companion id", () => {
    const m = withGates([
      {
        id: "elara_close",
        condition: {
          kind: "trust",
          companionId: "elara",
          operator: ">=",
          threshold: 75,
        },
        branchId: "branch_elara_close",
      },
    ]);
    expect(
      resolveMysteryClosureBranch(m, {
        ...baseState,
        trustByCompanion: { elara: 80 },
      }),
    ).toEqual({ gateId: "elara_close", branchId: "branch_elara_close" });
    expect(
      resolveMysteryClosureBranch(m, {
        ...baseState,
        trustByCompanion: { elara: 50 },
      }),
    ).toBeNull();
    // Missing companion → 0, doesn't match.
    expect(resolveMysteryClosureBranch(m, baseState)).toBeNull();
  });

  it("evaluates all_of composite gates", () => {
    const m = withGates([
      {
        id: "dark_oracle",
        condition: {
          kind: "all_of",
          conditions: [
            { kind: "morality", operator: "<=", threshold: -25 },
            { kind: "act_at_least", act: 4 },
            { kind: "narrative_flag", flag: "oracle_recruited" },
          ],
        },
        branchId: "branch_dark_oracle",
      },
    ]);
    // All three pass.
    expect(
      resolveMysteryClosureBranch(m, {
        ...baseState,
        moralityScore: -50,
        narrativeAct: 5,
        narrativeFlags: new Set(["oracle_recruited"]),
      }),
    ).toEqual({ gateId: "dark_oracle", branchId: "branch_dark_oracle" });
    // One missing.
    expect(
      resolveMysteryClosureBranch(m, {
        ...baseState,
        moralityScore: -50,
        narrativeAct: 5,
        narrativeFlags: new Set(),
      }),
    ).toBeNull();
  });
});

describe("applyClosureSnapshot — snapshot-on-close evidence invariant", () => {
  it("preserves discovered clues even when the new branch doesn't list them", () => {
    const merged = applyClosureSnapshot(
      ["clue_a", "clue_b", "clue_c"],
      ["clue_d"],
    );
    expect([...merged].sort()).toEqual(["clue_a", "clue_b", "clue_c", "clue_d"]);
  });

  it("dedupes when the new branch overlaps the discovered set", () => {
    const merged = applyClosureSnapshot(
      ["clue_a", "clue_b"],
      ["clue_b", "clue_c"],
    );
    expect([...merged].sort()).toEqual(["clue_a", "clue_b", "clue_c"]);
  });

  it("returns the new-branch list when nothing was discovered", () => {
    const merged = applyClosureSnapshot([], ["clue_a", "clue_b"]);
    expect([...merged].sort()).toEqual(["clue_a", "clue_b"]);
  });

  it("returns the discovered list when the new branch has no evidence", () => {
    const merged = applyClosureSnapshot(["clue_a", "clue_b"], []);
    expect([...merged].sort()).toEqual(["clue_a", "clue_b"]);
  });
});
