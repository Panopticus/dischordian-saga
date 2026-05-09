import { describe, expect, it } from "vitest";
import {
  UNLOCK_GATES,
  type UnlockGate,
  type UnsealEvalState,
  isGateSatisfied,
  findSatisfiedGate,
  evaluateUnseal,
} from "./unsealing";

const emptyState: UnsealEvalState = {
  collectedClues: new Set(),
  solvedPuzzles: new Set(),
  narrativeFlags: new Set(),
  itemsUsed: new Set(),
  unsealedGates: new Set(),
};

describe("UNLOCK_GATES registry invariants", () => {
  it("ids are unique", () => {
    const ids = UNLOCK_GATES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels are non-empty", () => {
    for (const g of UNLOCK_GATES) {
      expect(g.label.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("isGateSatisfied", () => {
  it("clue_collected — true iff clue is in the set", () => {
    const gate: UnlockGate = {
      id: "test", label: "test",
      condition: { kind: "clue_collected", clueId: "clue_a" },
    };
    expect(isGateSatisfied(gate, emptyState)).toBe(false);
    expect(isGateSatisfied(gate, { ...emptyState, collectedClues: new Set(["clue_a"]) })).toBe(true);
  });

  it("puzzle_solved — true iff puzzle is in the set", () => {
    const gate: UnlockGate = {
      id: "test", label: "test",
      condition: { kind: "puzzle_solved", puzzleId: "p_a" },
    };
    expect(isGateSatisfied(gate, emptyState)).toBe(false);
    expect(isGateSatisfied(gate, { ...emptyState, solvedPuzzles: new Set(["p_a"]) })).toBe(true);
  });

  it("narrative_flag — true iff flag is in the set", () => {
    const gate: UnlockGate = {
      id: "test", label: "test",
      condition: { kind: "narrative_flag", flag: "f_a" },
    };
    expect(isGateSatisfied(gate, emptyState)).toBe(false);
    expect(isGateSatisfied(gate, { ...emptyState, narrativeFlags: new Set(["f_a"]) })).toBe(true);
  });

  it("item_used — true iff item is in the set", () => {
    const gate: UnlockGate = {
      id: "test", label: "test",
      condition: { kind: "item_used", itemId: "i_a" },
    };
    expect(isGateSatisfied(gate, emptyState)).toBe(false);
    expect(isGateSatisfied(gate, { ...emptyState, itemsUsed: new Set(["i_a"]) })).toBe(true);
  });

  it("other_unseal — true iff dependency is in unsealedGates", () => {
    const gate: UnlockGate = {
      id: "test", label: "test",
      condition: { kind: "other_unseal", gateId: "gate_first" },
    };
    expect(isGateSatisfied(gate, emptyState)).toBe(false);
    expect(isGateSatisfied(gate, { ...emptyState, unsealedGates: new Set(["gate_first"]) })).toBe(true);
  });
});

describe("findSatisfiedGate (OR-logic across unsealedBy)", () => {
  it("returns null when no listed gate is satisfied", () => {
    const result = findSatisfiedGate(
      ["gate_lectern_key", "gate_archives_pattern_solved"],
      emptyState,
    );
    expect(result).toBeNull();
  });

  it("returns the first satisfied gate when one passes", () => {
    const result = findSatisfiedGate(
      ["gate_lectern_key", "gate_archives_pattern_solved"],
      { ...emptyState, solvedPuzzles: new Set(["archives"]) },
    );
    expect(result?.id).toBe("gate_archives_pattern_solved");
  });

  it("ignores gate ids not in the registry (defensive)", () => {
    const result = findSatisfiedGate(
      ["nope_not_a_gate"],
      emptyState,
    );
    expect(result).toBeNull();
  });
});

describe("evaluateUnseal", () => {
  it("populates allGates with every resolvable id", () => {
    const verdict = evaluateUnseal(
      ["gate_lectern_key", "gate_archives_pattern_solved", "nope"],
      emptyState,
    );
    expect(verdict.allGates).toHaveLength(2);
  });

  it("unsealed=true when any gate is satisfied", () => {
    const verdict = evaluateUnseal(
      ["gate_lectern_key", "gate_archives_pattern_solved"],
      { ...emptyState, itemsUsed: new Set(["lectern_master_key"]) },
    );
    expect(verdict.unsealed).toBe(true);
    expect(verdict.satisfiedGate?.id).toBe("gate_lectern_key");
  });

  it("unsealed=false + null satisfiedGate when nothing matches", () => {
    const verdict = evaluateUnseal(
      ["gate_lectern_key"],
      emptyState,
    );
    expect(verdict.unsealed).toBe(false);
    expect(verdict.satisfiedGate).toBeNull();
  });
});
