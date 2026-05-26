import { describe, it, expect } from "vitest";
import { isRegisteredFlag } from "../flags/narrativeFlagRegistry";
import {
  CHOICE_OUTCOME_REGISTRY,
  getChoiceOutcome,
  listChoiceOutcomes,
  listChoiceOutcomesByKind,
  listChoiceOutcomesByOwner,
  listOutcomeFlags,
  validateChoiceOutcomeEntry,
} from "./choiceOutcomeRegistry";

describe("CHOICE_OUTCOME_REGISTRY shape", () => {
  it("has at least one entry per supported kind that ships in Phase 1", () => {
    // Phase 1 only seeds `set_flag` outcomes; later phases add
    // `faction_rep`, `unlock_card`, `mutate_encounter_deck`,
    // `stakes_axis`. The parity check is what enforces growth.
    const kinds = new Set(CHOICE_OUTCOME_REGISTRY.map((e) => e.kind));
    expect(kinds.has("set_flag")).toBe(true);
  });

  it("ids are unique", () => {
    const ids = CHOICE_OUTCOME_REGISTRY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry passes its kind-specific validator", () => {
    for (const e of CHOICE_OUTCOME_REGISTRY) {
      const v = validateChoiceOutcomeEntry(e);
      expect(v.ok, v.ok ? "" : v.reason).toBe(true);
    }
  });

  it("every set_flag outcome targets a flag that is registered in the narrativeFlagRegistry", () => {
    // Choice outcomes write to flags; flags need a registry entry so
    // downstream consumers can find them. Drift here is the bug we
    // want to surface immediately.
    for (const flag of listOutcomeFlags()) {
      expect(isRegisteredFlag(flag), `${flag} not in narrativeFlagRegistry`).toBe(
        true,
      );
    }
  });
});

describe("registry lookups", () => {
  it("getChoiceOutcome finds known ids", () => {
    expect(getChoiceOutcome("act1.forgiveness_choice_made")?.flag).toBe(
      "forgiveness_choice_made",
    );
    expect(getChoiceOutcome("nonexistent")).toBeUndefined();
  });

  it("listChoiceOutcomes returns the full set", () => {
    expect(listChoiceOutcomes().length).toBe(CHOICE_OUTCOME_REGISTRY.length);
  });

  it("listChoiceOutcomesByKind filters", () => {
    const setFlag = listChoiceOutcomesByKind("set_flag");
    expect(setFlag.every((e) => e.kind === "set_flag")).toBe(true);
    expect(setFlag.length).toBeGreaterThan(0);
  });

  it("listChoiceOutcomesByOwner filters", () => {
    const act1 = listChoiceOutcomesByOwner("act_1");
    expect(act1.every((e) => e.owner === "act_1")).toBe(true);
    expect(act1.length).toBeGreaterThan(0);
  });
});
