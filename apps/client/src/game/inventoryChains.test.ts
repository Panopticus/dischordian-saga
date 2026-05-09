import { describe, expect, it } from "vitest";
import {
  INVENTORY_CHAINS,
  getChainProgress,
  tryAdvanceChain,
  type InventoryChain,
} from "./adventureFeatures";

describe("INVENTORY_CHAINS registry invariants", () => {
  it("has at least one chain (the canonical Terminus)", () => {
    expect(INVENTORY_CHAINS.length).toBeGreaterThan(0);
    expect(INVENTORY_CHAINS.find((c) => c.id === "chain_terminus_signal")).toBeDefined();
  });

  it("ids are unique", () => {
    const ids = INVENTORY_CHAINS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every chain has at least 3 steps (audit'd Monkey Island depth)", () => {
    for (const chain of INVENTORY_CHAINS) {
      expect(chain.steps.length, `${chain.id} has too few steps`).toBeGreaterThanOrEqual(3);
    }
  });

  it("step ids are unique within each chain", () => {
    for (const chain of INVENTORY_CHAINS) {
      const ids = chain.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("each step's `takes` chains from a starter or prior result", () => {
    for (const chain of INVENTORY_CHAINS) {
      const validTakes = new Set<string>(chain.starters);
      for (const step of chain.steps) {
        expect(validTakes.has(step.takes), `${chain.id}/${step.id} takes ${step.takes} not in chain`).toBe(true);
        validTakes.add(step.result);
      }
    }
  });

  it("elara comments + result names are non-empty", () => {
    for (const chain of INVENTORY_CHAINS) {
      for (const step of chain.steps) {
        expect(step.elaraComment.trim().length).toBeGreaterThan(0);
        expect(step.resultName.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("Terminus chain — canonical 5-step proof", () => {
  const terminus = INVENTORY_CHAINS.find((c) => c.id === "chain_terminus_signal")!;

  it("has exactly 5 steps (audit'd reference)", () => {
    expect(terminus.steps.length).toBe(5);
  });

  it("starts from broken_terminus_relay", () => {
    expect(terminus.starters).toContain("broken_terminus_relay");
  });

  it("ends at active_terminus_link", () => {
    expect(terminus.steps.at(-1)?.result).toBe("active_terminus_link");
  });
});

describe("getChainProgress", () => {
  const chain: InventoryChain = INVENTORY_CHAINS[0]!;

  it("0 completed + nextStep=0 when player has only the starter + first `with`", () => {
    const inventory = new Set([
      chain.starters[0]!,
      chain.steps[0]!.with,
    ]);
    const p = getChainProgress(chain, inventory);
    expect(p.completedStepCount).toBe(0);
    expect(p.nextStepIndex).toBe(0);
  });

  it("1 completed + nextStep=1 when first result + second `with` in inventory", () => {
    const inventory = new Set([
      chain.steps[0]!.result,
      chain.steps[1]!.with,
    ]);
    const p = getChainProgress(chain, inventory);
    expect(p.completedStepCount).toBe(1);
    expect(p.nextStepIndex).toBe(1);
  });

  it("all-done when final result is in inventory", () => {
    const inventory = new Set(chain.steps.map((s) => s.result));
    const p = getChainProgress(chain, inventory);
    expect(p.completedStepCount).toBe(chain.steps.length);
    expect(p.nextStepIndex).toBe(-1);
  });

  it("nextStep=-1 when no step is solvable yet (missing the `with` items)", () => {
    const inventory = new Set([chain.starters[0]!]);
    const p = getChainProgress(chain, inventory);
    expect(p.nextStepIndex).toBe(-1);
  });
});

describe("tryAdvanceChain", () => {
  const chain = INVENTORY_CHAINS[0]!;
  const step1 = chain.steps[0]!;

  it("matches the canonical step (A, B order)", () => {
    const r = tryAdvanceChain(step1.takes, step1.with);
    expect(r?.step.id).toBe(step1.id);
  });

  it("matches reversed order (B, A)", () => {
    const r = tryAdvanceChain(step1.with, step1.takes);
    expect(r?.step.id).toBe(step1.id);
  });

  it("returns null for items that don't match any authored step", () => {
    expect(tryAdvanceChain("nope", "also_nope")).toBeNull();
  });
});
