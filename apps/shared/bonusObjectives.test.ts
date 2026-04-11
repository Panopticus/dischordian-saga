import { describe, it, expect } from "vitest";
import {
  generateBonusObjectives,
  generateNarratorCallbackObjective,
  getCurrentRefreshSlot,
  NARRATOR_CALLBACK_TEMPLATES,
} from "./bonusObjectives";

describe("bonusObjectives — narrator_callback category (Appendix A.3)", () => {
  it("defines at least one narrator_callback template per narrator", () => {
    const elara = NARRATOR_CALLBACK_TEMPLATES.filter(
      (t) => t.narratorId === "elara",
    );
    const human = NARRATOR_CALLBACK_TEMPLATES.filter(
      (t) => t.narratorId === "the_human",
    );
    expect(elara.length).toBeGreaterThanOrEqual(1);
    expect(human.length).toBeGreaterThanOrEqual(1);
  });

  it("every template has a non-empty description and roomId", () => {
    for (const t of NARRATOR_CALLBACK_TEMPLATES) {
      expect(t.description.length).toBeGreaterThan(0);
      expect(t.roomId.length).toBeGreaterThan(0);
      expect(t.tier).toBeGreaterThanOrEqual(1);
    }
  });

  it("generates a narrator_callback objective with tier metadata", () => {
    const obj = generateNarratorCallbackObjective(42, 3);
    expect(obj).not.toBeNull();
    expect(obj!.category).toBe("narrator_callback");
    expect(obj!.narratorCallback).toBeDefined();
    expect(["elara", "the_human"]).toContain(obj!.narratorCallback!.narratorId);
    expect(obj!.narratorCallback!.tier).toBeGreaterThanOrEqual(1);
  });

  it("narrator_callback rewards are 0 (the line IS the reward)", () => {
    const obj = generateNarratorCallbackObjective(42, 3);
    expect(obj!.rewardAmount).toBe(0);
  });

  it("is deterministic for a given (playerId, refreshSlot)", () => {
    const a = generateNarratorCallbackObjective(42, 3);
    const b = generateNarratorCallbackObjective(42, 3);
    expect(a?.narratorCallback).toEqual(b?.narratorCallback);
  });
});

describe("bonusObjectives — existing contract holds", () => {
  it("generateBonusObjectives still returns 1-3 objectives", () => {
    const out = generateBonusObjectives(1, 0);
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out.length).toBeLessThanOrEqual(3);
  });

  it("getCurrentRefreshSlot is in [0, 11]", () => {
    const slot = getCurrentRefreshSlot(new Date());
    expect(slot).toBeGreaterThanOrEqual(0);
    expect(slot).toBeLessThanOrEqual(11);
  });
});
