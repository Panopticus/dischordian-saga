/* ═══════════════════════════════════════════════════════
   expansionUnlockService — dialog_choice family tests
   Phase A8 of the narrative-spine adoption plan.

   Pins the new CardUnlockCondition.dialog_choice variant
   end-to-end: schema acceptance, evaluator semantics,
   integration with the canonical fromFlags assembler.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import {
  derivePlayerExpansionStateFromFlags,
  evaluateUnlockCondition,
  makePlayerExpansionState,
  NULL_PLAYER_EXPANSION_STATE,
} from "./expansionUnlockService";
import type { CardUnlockCondition } from "../types/Card";

describe("evaluateUnlockCondition — dialog_choice variant", () => {
  it("returns true when the named flag is in the committed set", () => {
    const state = makePlayerExpansionState({
      committedDialogFlags: ["gm_voiced_the_case"],
    });
    const cond: CardUnlockCondition = {
      kind: "dialog_choice",
      flag: "gm_voiced_the_case",
    };
    expect(evaluateUnlockCondition(cond, state)).toBe(true);
  });

  it("returns false when the named flag is missing from the committed set", () => {
    const state = makePlayerExpansionState({
      committedDialogFlags: ["gm_refused_material"],
    });
    const cond: CardUnlockCondition = {
      kind: "dialog_choice",
      flag: "gm_voiced_the_case",
    };
    expect(evaluateUnlockCondition(cond, state)).toBe(false);
  });

  it("returns false on the NULL_PLAYER_EXPANSION_STATE (no flags committed yet)", () => {
    const cond: CardUnlockCondition = {
      kind: "dialog_choice",
      flag: "any_flag",
    };
    expect(evaluateUnlockCondition(cond, NULL_PLAYER_EXPANSION_STATE)).toBe(false);
  });
});

describe("derivePlayerExpansionStateFromFlags — committedDialogFlags wiring", () => {
  it("populates committedDialogFlags with every truthy flag in the narrative bag", () => {
    const state = derivePlayerExpansionStateFromFlags({
      gm_voiced_the_case: true,
      gm_held_lead: true,
      gm_silenced_at_balance: false, // falsy → excluded
      act_1_complete: true, // ALSO appears — every truthy flag is a candidate
    });
    expect(state.committedDialogFlags.has("gm_voiced_the_case")).toBe(true);
    expect(state.committedDialogFlags.has("gm_held_lead")).toBe(true);
    expect(state.committedDialogFlags.has("gm_silenced_at_balance")).toBe(false);
    // The committed set is deliberately broad — the unlock service
    // doesn't gatekeep WHICH flags are valid dialog flags; each card
    // references the specific flag it cares about.
    expect(state.committedDialogFlags.has("act_1_complete")).toBe(true);
  });

  it("integration: dialog_choice unlock evaluates correctly from the assembled state", () => {
    const state = derivePlayerExpansionStateFromFlags({
      gm_confessed_at_losing: true,
    });
    const cond: CardUnlockCondition = {
      kind: "dialog_choice",
      flag: "gm_confessed_at_losing",
    };
    expect(evaluateUnlockCondition(cond, state)).toBe(true);

    const otherCond: CardUnlockCondition = {
      kind: "dialog_choice",
      flag: "gm_held_lead", // not set
    };
    expect(evaluateUnlockCondition(otherCond, state)).toBe(false);
  });
});

describe("NULL_PLAYER_EXPANSION_STATE — defensive defaults", () => {
  it("has an empty committedDialogFlags set", () => {
    expect(NULL_PLAYER_EXPANSION_STATE.committedDialogFlags.size).toBe(0);
  });
});
