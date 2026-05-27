import { describe, it, expect, vi } from "vitest";
import type { NpcDialogChoice } from "../npcs/dialogTrees/types";
import { applyDialogChoiceOutcomes } from "./applyDialogChoice";
import {
  dispatchOutcomeBundle,
  type OutcomeDispatchContext,
} from "./dispatchOutcomeBundle";

function makeCtx(
  overrides: Partial<OutcomeDispatchContext> = {},
): OutcomeDispatchContext {
  return {
    userId: 42,
    npcKey: "the_warlord",
    setNarrativeFlag: vi.fn(),
    setNpcPublicFlag: vi.fn(),
    applyTrustDelta: vi.fn(),
    applyAxisDelta: vi.fn(),
    applyFactionRepDelta: vi.fn(),
    recordStakesIntent: vi.fn(),
    recordCardUnlockIntent: vi.fn(),
    recordDeckMutationIntent: vi.fn(),
    log: vi.fn(),
    ...overrides,
  };
}

const fullChoice: NpcDialogChoice = {
  label: "Spare him",
  nextId: "n2",
  sets: "warlord_spared",
  publicFlag: "warlord_choice_made",
  trustDelta: 2,
  axisDelta: [{ axis: "mercy", delta: 1 }],
  factionRepDelta: { insurgency: 5, new_babylon: -3 },
  stakesAxisDelta: { verdict: -2 },
  unlockCard: { cardDefId: "s2_mercy_vow", via: "dialog_choice" },
  mutateNextEncounterDeck: {
    encounterId: "act6_mol_garath",
    addCardDefId: "burnt_card_placeholder",
  },
};

describe("dispatchOutcomeBundle", () => {
  it("dispatches every write kind to the matching context callback", async () => {
    const ctx = makeCtx();
    const bundle = applyDialogChoiceOutcomes(fullChoice, "spare_warlord");

    const result = await dispatchOutcomeBundle(bundle, ctx);

    expect(ctx.setNarrativeFlag).toHaveBeenCalledWith("warlord_spared", true);
    expect(ctx.setNpcPublicFlag).toHaveBeenCalledWith(
      "warlord_choice_made",
      true,
    );
    expect(ctx.applyTrustDelta).toHaveBeenCalledWith("the_warlord", 2);
    expect(ctx.applyAxisDelta).toHaveBeenCalledWith("mercy", 1);
    expect(ctx.applyFactionRepDelta).toHaveBeenCalledWith("insurgency", 5);
    expect(ctx.applyFactionRepDelta).toHaveBeenCalledWith("new_babylon", -3);
    expect(ctx.recordStakesIntent).toHaveBeenCalledWith("verdict", -2);
    expect(ctx.recordCardUnlockIntent).toHaveBeenCalledWith(
      "s2_mercy_vow",
      "dialog_choice",
    );
    expect(ctx.recordDeckMutationIntent).toHaveBeenCalledWith(
      "act6_mol_garath",
      "burnt_card_placeholder",
    );

    expect(result.attempted.flagWrites).toBe(2);
    expect(result.attempted.trustWrites).toBe(1);
    expect(result.attempted.axisWrites).toBe(1);
    expect(result.attempted.factionRepWrites).toBe(2);
    expect(result.attempted.stakesIntents).toBe(1);
    expect(result.attempted.cardUnlockIntents).toBe(1);
    expect(result.attempted.deckMutationIntents).toBe(1);
    expect(result.errors).toHaveLength(0);
  });

  it("records 'skipped' entries when an optional writer is missing", async () => {
    const ctx = makeCtx({
      applyTrustDelta: undefined,
      applyFactionRepDelta: undefined,
      setNpcPublicFlag: undefined,
    });
    const bundle = applyDialogChoiceOutcomes(fullChoice, "x");

    const result = await dispatchOutcomeBundle(bundle, ctx);

    const kinds = result.skipped.map((s) => s.kind).sort();
    expect(kinds).toEqual(
      ["faction_rep", "faction_rep", "npc_public_flag", "trust"].sort(),
    );
    expect(result.attempted.trustWrites).toBe(0);
    expect(result.attempted.factionRepWrites).toBe(0);
    // Narrative flag still went through.
    expect(ctx.setNarrativeFlag).toHaveBeenCalledTimes(1);
  });

  it("skips trust writes when ctx.npcKey is unset", async () => {
    const ctx = makeCtx({ npcKey: undefined });
    const bundle = applyDialogChoiceOutcomes(
      { ...fullChoice, sets: undefined, publicFlag: undefined },
      "x",
    );

    const result = await dispatchOutcomeBundle(bundle, ctx);

    expect(ctx.applyTrustDelta).not.toHaveBeenCalled();
    expect(result.skipped.some((s) => s.kind === "trust")).toBe(true);
  });

  it("collects writer errors without abandoning the rest of the bundle", async () => {
    const failingFlag = vi.fn().mockRejectedValue(new Error("db blew up"));
    const ctx = makeCtx({ setNarrativeFlag: failingFlag });
    const bundle = applyDialogChoiceOutcomes(fullChoice, "x");

    const result = await dispatchOutcomeBundle(bundle, ctx);

    expect(result.errors.some((e) => e.kind === "narrative_flag")).toBe(true);
    // Later writers still ran.
    expect(ctx.applyFactionRepDelta).toHaveBeenCalled();
  });

  it("does nothing for an empty bundle", async () => {
    const ctx = makeCtx();
    const bundle = applyDialogChoiceOutcomes(
      { label: "Continue", nextId: "n2" },
      "noop",
    );

    const result = await dispatchOutcomeBundle(bundle, ctx);

    expect(ctx.setNarrativeFlag).not.toHaveBeenCalled();
    expect(ctx.applyTrustDelta).not.toHaveBeenCalled();
    expect(ctx.applyFactionRepDelta).not.toHaveBeenCalled();
    expect(result.errors).toHaveLength(0);
    expect(result.skipped).toHaveLength(0);
  });

  it("logs a structured summary when ctx.log is supplied", async () => {
    const log = vi.fn();
    const ctx = makeCtx({ log });
    const bundle = applyDialogChoiceOutcomes(
      { label: "Continue", nextId: "n2", sets: "x" },
      "out_log",
    );

    await dispatchOutcomeBundle(bundle, ctx);

    expect(log).toHaveBeenCalledWith(
      "dispatch_outcome_bundle",
      expect.objectContaining({
        outcomeId: "out_log",
        userId: 42,
        npcKey: "the_warlord",
        attempted: expect.objectContaining({ flagWrites: 1 }),
      }),
    );
  });
});
