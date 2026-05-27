import { describe, it, expect } from "vitest";
import type { NpcDialogChoice } from "../npcs/dialogTrees/types";
import {
  applyDialogChoiceOutcomes,
  bundleHasEffects,
  describeBundle,
} from "./applyDialogChoice";

const baseChoice: NpcDialogChoice = {
  label: "Continue",
  nextId: "next",
};

describe("applyDialogChoiceOutcomes", () => {
  it("returns an empty bundle for a choice with no outcomes", () => {
    const b = applyDialogChoiceOutcomes(baseChoice, "out_1");
    expect(b.outcomeId).toBe("out_1");
    expect(bundleHasEffects(b)).toBe(false);
  });

  it("records narrative + npc_public flag writes", () => {
    const b = applyDialogChoiceOutcomes(
      { ...baseChoice, sets: "forgiveness_choice_made", publicFlag: "spared_x" },
      "out_2",
    );
    expect(b.flagWrites).toEqual([
      { flag: "forgiveness_choice_made", scope: "narrative" },
      { flag: "spared_x", scope: "npc_public" },
    ]);
  });

  it("records trust deltas only when non-zero", () => {
    expect(
      applyDialogChoiceOutcomes({ ...baseChoice, trustDelta: 3 }, "x").trustWrites,
    ).toEqual([{ delta: 3 }]);
    expect(
      applyDialogChoiceOutcomes({ ...baseChoice, trustDelta: 0 }, "x").trustWrites,
    ).toEqual([]);
  });

  it("preserves axis deltas, truncating fractions", () => {
    const b = applyDialogChoiceOutcomes(
      {
        ...baseChoice,
        axisDelta: [
          { axis: "order", delta: 2.9 },
          { axis: "chaos", delta: 0 }, // dropped
          { axis: "mercy", delta: NaN }, // dropped
        ],
      },
      "x",
    );
    expect(b.axisWrites).toEqual([{ axis: "order", delta: 2 }]);
  });

  it("records faction-rep deltas, dropping zero / undefined", () => {
    const b = applyDialogChoiceOutcomes(
      {
        ...baseChoice,
        factionRepDelta: {
          insurgency: 5,
          new_babylon: -3,
          architect: 0,
          dreamer: undefined,
        },
      },
      "x",
    );
    expect(b.factionRepWrites).toEqual([
      { faction: "insurgency", delta: 5 },
      { faction: "new_babylon", delta: -3 },
    ]);
  });

  it("records stakes-axis deltas", () => {
    const b = applyDialogChoiceOutcomes(
      { ...baseChoice, stakesAxisDelta: { verdict: 2, doctrine_purity: -1 } },
      "x",
    );
    expect(
      [...b.stakesWrites].sort((x, y) => x.axisId.localeCompare(y.axisId)),
    ).toEqual([
      { axisId: "doctrine_purity", delta: -1 },
      { axisId: "verdict", delta: 2 },
    ]);
  });

  it("records card unlock + deck mutation intents", () => {
    const b = applyDialogChoiceOutcomes(
      {
        ...baseChoice,
        unlockCard: { cardDefId: "s2_act3_eyes_witness", via: "dialog_choice" },
        mutateNextEncounterDeck: {
          encounterId: "act6_mol_garath",
          addCardDefId: "burnt_card_placeholder",
        },
      },
      "x",
    );
    expect(b.cardUnlockWrites).toEqual([
      { cardDefId: "s2_act3_eyes_witness", via: "dialog_choice" },
    ]);
    expect(b.deckMutationWrites).toEqual([
      { encounterId: "act6_mol_garath", addCardDefId: "burnt_card_placeholder" },
    ]);
  });

  it("bundleHasEffects is true for any non-empty bundle", () => {
    expect(
      bundleHasEffects(
        applyDialogChoiceOutcomes({ ...baseChoice, sets: "x" }, "id"),
      ),
    ).toBe(true);
    expect(
      bundleHasEffects(applyDialogChoiceOutcomes(baseChoice, "id")),
    ).toBe(false);
  });
});

describe("describeBundle", () => {
  it("emits one line per effect", () => {
    const b = applyDialogChoiceOutcomes(
      {
        ...baseChoice,
        sets: "forgiveness_choice_made",
        trustDelta: 2,
        factionRepDelta: { insurgency: -5 },
        unlockCard: { cardDefId: "s2_xyz", via: "dialog_choice" },
      },
      "out",
    );
    const lines = describeBundle(b);
    expect(lines).toContain("flag set: forgiveness_choice_made");
    expect(lines).toContain("trust +2");
    expect(lines).toContain("insurgency rep -5");
    expect(lines).toContain("card unlocked: s2_xyz (via dialog_choice)");
  });

  it("returns an empty array for a no-op bundle", () => {
    expect(describeBundle(applyDialogChoiceOutcomes(baseChoice, "x"))).toEqual([]);
  });
});
