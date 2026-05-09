import { describe, expect, it } from "vitest";
import {
  evaluateMysteryCondition,
  chooseMysteryClosureBranch,
  mergeDiscoveredEvidence,
  type MysteryInfluenceCondition,
  type MysteryInfluenceGate,
  type MysteryInfluenceState,
} from "./mysteryTypes";

const baseState: MysteryInfluenceState = {
  narrativeFlags: new Set(),
  moralityScore: 0,
  trustByCompanion: {},
  narrativeAct: 1,
};

describe("evaluateMysteryCondition (audit/16 PR 27 AR3)", () => {
  describe("narrative_flag", () => {
    it("passes when flag is set and expected is implicit-true", () => {
      const c: MysteryInfluenceCondition = { kind: "narrative_flag", flag: "act_3_complete" };
      expect(evaluateMysteryCondition(c, {
        ...baseState,
        narrativeFlags: new Set(["act_3_complete"]),
      })).toBe(true);
    });

    it("fails when flag is unset", () => {
      const c: MysteryInfluenceCondition = { kind: "narrative_flag", flag: "act_3_complete" };
      expect(evaluateMysteryCondition(c, baseState)).toBe(false);
    });

    it("respects expected: false (NOT-set semantics)", () => {
      const c: MysteryInfluenceCondition = { kind: "narrative_flag", flag: "kael_alive", expected: false };
      // Flag NOT set → expected:false matches
      expect(evaluateMysteryCondition(c, baseState)).toBe(true);
      // Flag set → expected:false fails
      expect(evaluateMysteryCondition(c, {
        ...baseState,
        narrativeFlags: new Set(["kael_alive"]),
      })).toBe(false);
    });
  });

  describe("morality", () => {
    it(">= passes when score is at-or-above threshold", () => {
      const c: MysteryInfluenceCondition = { kind: "morality", operator: ">=", threshold: 20 };
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: 20 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: 50 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: 19 })).toBe(false);
    });

    it("<= passes when score is at-or-below threshold", () => {
      const c: MysteryInfluenceCondition = { kind: "morality", operator: "<=", threshold: -20 };
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: -50 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: -20 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: -19 })).toBe(false);
    });

    it("== passes only at the exact threshold", () => {
      const c: MysteryInfluenceCondition = { kind: "morality", operator: "==", threshold: 0 };
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: 0 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, moralityScore: 1 })).toBe(false);
    });
  });

  describe("trust", () => {
    it("looks up trust per companion id", () => {
      const c: MysteryInfluenceCondition = { kind: "trust", companionId: "elara", operator: ">=", threshold: 50 };
      expect(evaluateMysteryCondition(c, { ...baseState, trustByCompanion: { elara: 75 } })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, trustByCompanion: { elara: 30 } })).toBe(false);
    });

    it("treats missing companion as 0 trust", () => {
      const c: MysteryInfluenceCondition = { kind: "trust", companionId: "the_human", operator: ">=", threshold: 1 };
      expect(evaluateMysteryCondition(c, baseState)).toBe(false);
    });
  });

  describe("act_at_least", () => {
    it("passes when act is at-or-past the threshold", () => {
      const c: MysteryInfluenceCondition = { kind: "act_at_least", act: 3 };
      expect(evaluateMysteryCondition(c, { ...baseState, narrativeAct: 3 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, narrativeAct: 5 })).toBe(true);
      expect(evaluateMysteryCondition(c, { ...baseState, narrativeAct: 2 })).toBe(false);
    });
  });

  describe("all_of", () => {
    it("passes only when every child passes", () => {
      const c: MysteryInfluenceCondition = {
        kind: "all_of",
        conditions: [
          { kind: "act_at_least", act: 3 },
          { kind: "morality", operator: ">=", threshold: 20 },
        ],
      };
      expect(evaluateMysteryCondition(c, {
        ...baseState, narrativeAct: 3, moralityScore: 30,
      })).toBe(true);
      expect(evaluateMysteryCondition(c, {
        ...baseState, narrativeAct: 3, moralityScore: 0,
      })).toBe(false);
      expect(evaluateMysteryCondition(c, {
        ...baseState, narrativeAct: 1, moralityScore: 30,
      })).toBe(false);
    });

    it("passes vacuously for an empty list", () => {
      const c: MysteryInfluenceCondition = { kind: "all_of", conditions: [] };
      expect(evaluateMysteryCondition(c, baseState)).toBe(true);
    });
  });
});

describe("chooseMysteryClosureBranch (audit/16 PR 27 AR3)", () => {
  it("returns null when no gates are declared", () => {
    expect(chooseMysteryClosureBranch({ playerInfluenceGates: undefined }, baseState)).toBeNull();
    expect(chooseMysteryClosureBranch({ playerInfluenceGates: [] }, baseState)).toBeNull();
  });

  it("returns null when no gate matches", () => {
    const gates: MysteryInfluenceGate[] = [
      { id: "gate_a", condition: { kind: "act_at_least", act: 5 }, branchId: "branch_a" },
    ];
    expect(chooseMysteryClosureBranch({ playerInfluenceGates: gates }, { ...baseState, narrativeAct: 1 })).toBeNull();
  });

  it("returns the first matching gate's branch", () => {
    const gates: MysteryInfluenceGate[] = [
      { id: "gate_machine", condition: { kind: "morality", operator: "<=", threshold: -20 }, branchId: "branch_machine" },
      { id: "gate_humanity", condition: { kind: "morality", operator: ">=", threshold: 20 }, branchId: "branch_humanity" },
      { id: "gate_balanced", condition: { kind: "act_at_least", act: 1 }, branchId: "branch_balanced" },
    ];
    const machine = chooseMysteryClosureBranch({ playerInfluenceGates: gates }, { ...baseState, moralityScore: -40 });
    expect(machine?.gateId).toBe("gate_machine");
    expect(machine?.branchId).toBe("branch_machine");

    const humanity = chooseMysteryClosureBranch({ playerInfluenceGates: gates }, { ...baseState, moralityScore: 40 });
    expect(humanity?.gateId).toBe("gate_humanity");

    // Balanced morality with no machine/humanity match → fallback to balanced gate
    const balanced = chooseMysteryClosureBranch({ playerInfluenceGates: gates }, baseState);
    expect(balanced?.gateId).toBe("gate_balanced");
  });

  it("respects gate ORDER (first match wins)", () => {
    // Same condition twice — the first one wins.
    const gates: MysteryInfluenceGate[] = [
      { id: "gate_first", condition: { kind: "act_at_least", act: 1 }, branchId: "first" },
      { id: "gate_second", condition: { kind: "act_at_least", act: 1 }, branchId: "second" },
    ];
    expect(chooseMysteryClosureBranch({ playerInfluenceGates: gates }, baseState)?.gateId).toBe("gate_first");
  });
});

describe("mergeDiscoveredEvidence (snapshot-on-close invariant)", () => {
  it("preserves existing evidence ids", () => {
    expect(mergeDiscoveredEvidence(["a", "b"], [])).toEqual(["a", "b"]);
  });

  it("adds new branch evidence ids", () => {
    expect(mergeDiscoveredEvidence([], ["c", "d"])).toEqual(["c", "d"]);
  });

  it("dedupes overlap", () => {
    const result = mergeDiscoveredEvidence(["a", "b"], ["b", "c"]);
    expect([...result].sort()).toEqual(["a", "b", "c"]);
  });

  it("returns a NEW array (immutable)", () => {
    const input = ["a"];
    const result = mergeDiscoveredEvidence(input, ["b"]);
    expect(result).not.toBe(input);
  });
});
