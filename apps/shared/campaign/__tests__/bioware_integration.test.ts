/* ═══════════════════════════════════════════════════════
   BioWare integration smoke test.

   Constructs a 5-node branching dialog tree in memory,
   walks it through both choice branches, applies the
   chosen outcomes via `applyDialogChoiceOutcomes()`, and
   dispatches the resulting bundle via
   `dispatchOutcomeBundle()` with fully-mocked effects.

   The goal is end-to-end Phase 1 coverage: every new field
   on `NpcDialogChoice` is exercised by at least one node,
   and every writer on the dispatch context fires at least
   once. If a future refactor breaks any seam in the
   pipeline (resolver → bundle → dispatcher), this test
   surfaces it before any consuming UI does.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, vi } from "vitest";
import {
  getEntryNode,
  isDialogTreeConnected,
  visibleChoices,
  type NpcDialogTree,
} from "../../npcs/dialogTrees/types";
import { applyDialogChoiceOutcomes } from "../applyDialogChoice";
import {
  dispatchOutcomeBundle,
  type OutcomeDispatchContext,
} from "../dispatchOutcomeBundle";

/* A tiny but realistic encounter tree. Two paths from root —
 * "Spare him" (mercy) and "Cut him down" (steel) — each with
 * downstream effects that touch every Phase 1 outcome field. */
const SAMPLE_ENCOUNTER_TREE: NpcDialogTree = {
  id: "sample-warlord-pre-trial",
  npcKey: "the_game_master",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_game_master",
      onscreenText: "The Warlord kneels. The trial has not yet begun.",
      choices: [
        {
          label: "Spare him.",
          nextId: "mercy",
          sets: "forgiveness_choice_made",
          publicFlag: "warlord_spared_in_public",
          trustDelta: 2,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          factionRepDelta: { insurgency: 8, new_babylon: -4 },
          stakesAxisDelta: { verdict: -2 },
          unlockCard: { cardDefId: "s1_reward_companion_zero", via: "dialog_choice" },
          mutateNextEncounterDeck: {
            encounterId: "act6_mol_garath",
            addCardDefId: "s1_burnt_card_placeholder",
          },
        },
        {
          label: "Cut him down.",
          nextId: "steel",
          sets: "act1_closing_choice_made",
          trustDelta: -1,
          axisDelta: [{ axis: "mercy", delta: -1 }],
          factionRepDelta: { new_babylon: 6, insurgency: -6 },
          stakesAxisDelta: { verdict: 3 },
        },
      ],
    },
    mercy: {
      id: "mercy",
      npcKey: "the_game_master",
      onscreenText: "Filed. The audience watched you choose.",
    },
    steel: {
      id: "steel",
      npcKey: "the_game_master",
      onscreenText: "Filed. The audience watched the cut.",
    },
  },
};

function makeCtx(
  overrides: Partial<OutcomeDispatchContext> = {},
): OutcomeDispatchContext {
  return {
    userId: 7,
    npcKey: "the_game_master",
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

describe("BioWare-style integration — tree → resolver → dispatcher", () => {
  it("tree is structurally valid (connected, entry node resolves)", () => {
    expect(isDialogTreeConnected(SAMPLE_ENCOUNTER_TREE)).toBe(true);
    const entry = getEntryNode(SAMPLE_ENCOUNTER_TREE);
    expect(entry?.id).toBe("root");
  });

  it("walks the mercy path: every Phase-1 outcome fires once", async () => {
    const ctx = makeCtx();
    const entry = getEntryNode(SAMPLE_ENCOUNTER_TREE)!;
    const choices = visibleChoices(entry, new Set());
    const mercy = choices.find((c) => c.label === "Spare him.")!;

    const bundle = applyDialogChoiceOutcomes(mercy, "warlord_pre_trial.mercy");
    expect(bundle.flagWrites).toHaveLength(2);
    expect(bundle.factionRepWrites).toHaveLength(2);
    expect(bundle.cardUnlockWrites).toHaveLength(1);
    expect(bundle.deckMutationWrites).toHaveLength(1);

    const result = await dispatchOutcomeBundle(bundle, ctx);

    expect(ctx.setNarrativeFlag).toHaveBeenCalledWith(
      "forgiveness_choice_made",
      true,
    );
    expect(ctx.setNpcPublicFlag).toHaveBeenCalledWith(
      "warlord_spared_in_public",
      true,
    );
    expect(ctx.applyTrustDelta).toHaveBeenCalledWith("the_game_master", 2);
    expect(ctx.applyAxisDelta).toHaveBeenCalledWith("mercy", 1);
    expect(ctx.applyFactionRepDelta).toHaveBeenCalledWith("insurgency", 8);
    expect(ctx.applyFactionRepDelta).toHaveBeenCalledWith("new_babylon", -4);
    expect(ctx.recordStakesIntent).toHaveBeenCalledWith("verdict", -2);
    expect(ctx.recordCardUnlockIntent).toHaveBeenCalledWith(
      "s1_reward_companion_zero",
      "dialog_choice",
    );
    expect(ctx.recordDeckMutationIntent).toHaveBeenCalledWith(
      "act6_mol_garath",
      "s1_burnt_card_placeholder",
    );
    expect(result.errors).toHaveLength(0);
    expect(result.skipped).toHaveLength(0);
  });

  it("walks the steel path: opposite faction deltas, no card unlock", async () => {
    const ctx = makeCtx();
    const entry = getEntryNode(SAMPLE_ENCOUNTER_TREE)!;
    const steel = visibleChoices(entry, new Set()).find(
      (c) => c.label === "Cut him down.",
    )!;

    const bundle = applyDialogChoiceOutcomes(steel, "warlord_pre_trial.steel");
    await dispatchOutcomeBundle(bundle, ctx);

    expect(ctx.setNarrativeFlag).toHaveBeenCalledWith(
      "act1_closing_choice_made",
      true,
    );
    expect(ctx.setNpcPublicFlag).not.toHaveBeenCalled();
    expect(ctx.applyTrustDelta).toHaveBeenCalledWith("the_game_master", -1);
    expect(ctx.applyFactionRepDelta).toHaveBeenCalledWith("new_babylon", 6);
    expect(ctx.applyFactionRepDelta).toHaveBeenCalledWith("insurgency", -6);
    expect(ctx.recordStakesIntent).toHaveBeenCalledWith("verdict", 3);
    expect(ctx.recordCardUnlockIntent).not.toHaveBeenCalled();
    expect(ctx.recordDeckMutationIntent).not.toHaveBeenCalled();
  });

  it("opposite paths yield opposite faction shifts (the world drifts)", async () => {
    const mercyCtx = makeCtx();
    const steelCtx = makeCtx();
    const root = getEntryNode(SAMPLE_ENCOUNTER_TREE)!;
    const [mercy, steel] = root.choices!;

    await dispatchOutcomeBundle(
      applyDialogChoiceOutcomes(mercy, "m"),
      mercyCtx,
    );
    await dispatchOutcomeBundle(
      applyDialogChoiceOutcomes(steel, "s"),
      steelCtx,
    );

    // Insurgency: +8 under mercy, -6 under steel.
    expect(mercyCtx.applyFactionRepDelta).toHaveBeenCalledWith("insurgency", 8);
    expect(steelCtx.applyFactionRepDelta).toHaveBeenCalledWith("insurgency", -6);
    // New Babylon: opposite signs as well.
    expect(mercyCtx.applyFactionRepDelta).toHaveBeenCalledWith(
      "new_babylon",
      -4,
    );
    expect(steelCtx.applyFactionRepDelta).toHaveBeenCalledWith("new_babylon", 6);
  });
});
