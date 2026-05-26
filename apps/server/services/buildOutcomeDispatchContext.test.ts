import { describe, it, expect, vi } from "vitest";
import { buildOutcomeDispatchContext } from "./buildOutcomeDispatchContext";

describe("buildOutcomeDispatchContext", () => {
  it("captures userId + npcKey and exposes them on the returned context", () => {
    const ctx = buildOutcomeDispatchContext({ userId: 42, npcKey: "the_game_master" });
    expect(ctx.userId).toBe(42);
    expect(ctx.npcKey).toBe("the_game_master");
  });

  it("works without npcKey (encounter dialog without a bound NPC)", () => {
    const ctx = buildOutcomeDispatchContext({ userId: 7 });
    expect(ctx.userId).toBe(7);
    expect(ctx.npcKey).toBeUndefined();
  });

  it("wires every dispatcher callback (no holes)", () => {
    const ctx = buildOutcomeDispatchContext({ userId: 1, npcKey: "the_seer" });
    expect(typeof ctx.setNarrativeFlag).toBe("function");
    expect(typeof ctx.setNpcPublicFlag).toBe("function");
    expect(typeof ctx.applyTrustDelta).toBe("function");
    expect(typeof ctx.applyFactionRepDelta).toBe("function");
    expect(typeof ctx.recordStakesIntent).toBe("function");
    expect(typeof ctx.recordCardUnlockIntent).toBe("function");
    expect(typeof ctx.recordDeckMutationIntent).toBe("function");
    expect(typeof ctx.log).toBe("function");
  });

  it("`overrides` win — tests can substitute any writer with a mock", async () => {
    const mockFlag = vi.fn();
    const mockFactionRep = vi.fn();
    const ctx = buildOutcomeDispatchContext({
      userId: 99,
      overrides: {
        setNarrativeFlag: mockFlag,
        applyFactionRepDelta: mockFactionRep,
      },
    });
    await ctx.setNarrativeFlag("test_flag", true);
    await ctx.applyFactionRepDelta?.("insurgency", 5);
    expect(mockFlag).toHaveBeenCalledWith("test_flag", true);
    expect(mockFactionRep).toHaveBeenCalledWith("insurgency", 5);
  });

  it("intent recorders (stakes / card / deck) are silent no-ops in Phase 1 (log only)", () => {
    const ctx = buildOutcomeDispatchContext({ userId: 1, npcKey: "the_oracle" });
    // Calling each intent recorder should not throw — Phase 1 logs but does
    // not surface side effects.
    expect(() => ctx.recordStakesIntent?.("verdict", 2)).not.toThrow();
    expect(() => ctx.recordCardUnlockIntent?.("s2_xyz", "dialog_choice")).not.toThrow();
    expect(() =>
      ctx.recordDeckMutationIntent?.("act6_mol_garath", "burnt_card_placeholder"),
    ).not.toThrow();
  });
});
