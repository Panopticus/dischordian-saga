import { describe, it, expect } from "vitest";
import {
  VIRUS_COMPANION_REACTIONS,
  getReactionsForStage,
  getReaction,
  getReactionsForCompanion,
} from "./virusCompanionReactions";

describe("virusCompanionReactions", () => {
  it("has at least one reaction per major companion", () => {
    const companions = new Set(VIRUS_COMPANION_REACTIONS.map(r => r.companionId));
    const expected = ["elara", "the_human", "strain", "agent_zero", "adjudicator_locke"];
    for (const id of expected) {
      expect(companions).toContain(id);
    }
  });

  it("has a non-empty one-shot for every non-silent reaction", () => {
    for (const r of VIRUS_COMPANION_REACTIONS) {
      if (r.tag === "silent") continue;
      expect(r.oneShot.length).toBeGreaterThan(0);
      expect(r.idle.length).toBeGreaterThan(0);
    }
  });

  it("every entry references a valid virus stage", () => {
    const validStages = new Set(["dormant", "latent", "active", "critical", "consumed"]);
    for (const r of VIRUS_COMPANION_REACTIONS) {
      expect(validStages.has(r.stage)).toBe(true);
    }
  });

  it("getReactionsForStage returns only entries for that stage", () => {
    const active = getReactionsForStage("active");
    expect(active.length).toBeGreaterThan(0);
    for (const r of active) expect(r.stage).toBe("active");
  });

  it("getReaction finds a specific (companion, stage) pair", () => {
    const elaraLatent = getReaction("elara", "latent");
    expect(elaraLatent).toBeDefined();
    expect(elaraLatent?.tag).toBe("worried");
  });

  it("getReactionsForCompanion returns entries sorted from latent → consumed", () => {
    const elara = getReactionsForCompanion("elara");
    expect(elara.length).toBeGreaterThanOrEqual(3);
    const stageOrder = ["dormant", "latent", "active", "critical", "consumed"];
    for (let i = 1; i < elara.length; i++) {
      const prev = stageOrder.indexOf(elara[i - 1].stage);
      const curr = stageOrder.indexOf(elara[i].stage);
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it("Strain has an explicit recoil reaction at the active stage (VIRUS_STAGES.unlocks)", () => {
    const strainActive = getReaction("strain", "active");
    expect(strainActive).toBeDefined();
    expect(strainActive?.tag).toBe("recoil");
  });

  it("the Human has a silent reaction at the critical stage (VIRUS_STAGES.unlocks)", () => {
    const humanCritical = getReaction("the_human", "critical");
    expect(humanCritical).toBeDefined();
    expect(humanCritical?.tag).toBe("silent");
    // Silent reactions intentionally have an empty oneShot
    expect(humanCritical?.oneShot).toBe("");
  });

  it("mood deltas are non-positive (the virus is never good for bonds)", () => {
    for (const r of VIRUS_COMPANION_REACTIONS) {
      expect(r.moodDelta).toBeLessThanOrEqual(0);
    }
  });
});
