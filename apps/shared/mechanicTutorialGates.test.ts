import { describe, it, expect } from "vitest";
import {
  MECHANIC_TUTORIAL_GATES,
  getGatesForMechanic,
  getGateById,
  getEligibleGates,
} from "./mechanicTutorialGates";
import { CHANNELED_TOPICS } from "./apprenticeChanneledLines";

describe("mechanicTutorialGates — full deckbuilder walkthrough", () => {
  it("registers a non-trivial number of gates", () => {
    expect(MECHANIC_TUTORIAL_GATES.length).toBeGreaterThan(5);
  });

  it("every gate id is unique", () => {
    const ids = MECHANIC_TUTORIAL_GATES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getGatesForMechanic returns gates in ascending order", () => {
    const gates = getGatesForMechanic("deckbuilder");
    expect(gates.length).toBeGreaterThan(0);
    for (let i = 1; i < gates.length; i++) {
      expect(gates[i].order).toBeGreaterThan(gates[i - 1].order);
    }
  });

  it("the deckbuilder walkthrough starts with the intro gate", () => {
    const gates = getGatesForMechanic("deckbuilder");
    expect(gates[0].id).toBe("tutor_deck_builder_intro");
  });

  it("every apprentice-channeling gate references a real channeled topic", () => {
    const channeledTopics = new Set(CHANNELED_TOPICS.map((t) => t.topic));
    for (const gate of MECHANIC_TUTORIAL_GATES) {
      if (gate.speaker.kind === "apprentice_channeling") {
        expect(channeledTopics.has(gate.speaker.topic)).toBe(true);
      }
    }
  });

  it("the goggles-inherited gate is the endgame gate", () => {
    const gate = getGateById("tutor_goggles_inherited");
    expect(gate).toBeDefined();
    expect(gate!.completionFlag).toBe("goggles_inherited");
  });

  describe("getEligibleGates", () => {
    it("returns the intro gate when the bench UI opens for the first time", () => {
      const eligible = getEligibleGates({
        flags: {},
        openedUi: "engineer_bench",
      });
      expect(eligible.find((g) => g.id === "tutor_deck_builder_intro")).toBeDefined();
    });

    it("does not re-fire a completed gate", () => {
      const eligible = getEligibleGates({
        flags: { deckbuilder_gate_1_done: true },
        openedUi: "engineer_bench",
      });
      expect(eligible.find((g) => g.id === "tutor_deck_builder_intro")).toBeUndefined();
    });

    it("after-action triggers fire on matching action", () => {
      const eligible = getEligibleGates({
        flags: {},
        recentAction: "deck_completed_first_time",
      });
      expect(eligible.find((g) => g.id === "tutor_deck_builder_slot_optim")).toBeDefined();
    });

    it("after-action-count triggers respect the count threshold", () => {
      const noCount = getEligibleGates({
        flags: {},
        recentAction: "card_added_to_deck",
        recentActionCount: 5,
      });
      expect(noCount.find((g) => g.id === "tutor_deck_builder_synergy")).toBeUndefined();

      const enoughCount = getEligibleGates({
        flags: {},
        recentAction: "card_added_to_deck",
        recentActionCount: 10,
      });
      expect(enoughCount.find((g) => g.id === "tutor_deck_builder_synergy")).toBeDefined();
    });

    it("after-gate triggers chain — intro completion unlocks curve", () => {
      const eligible = getEligibleGates({
        flags: { tutor_deck_builder_intro_done: true },
      });
      expect(eligible.find((g) => g.id === "tutor_deck_builder_curve")).toBeDefined();
    });
  });
});
