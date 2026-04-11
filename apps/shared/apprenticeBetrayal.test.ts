import { describe, it, expect } from "vitest";
import {
  getBetrayalStage,
  generateBetrayalEvent,
  BETRAYAL_THRESHOLDS,
} from "./apprenticeBetrayal";
import type { Apprentice } from "./apprentices";

const baseApp: Apprentice = {
  id: "a1", name: "Test", archetype: "zealot", gender: "female", race: "human",
  combatClass: "soldier", rarity: "common",
  stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10 },
  bond: 50, corruption: 0, stage: "companion", trialDay: 0, recruitedAt: 0,
  backstory: "", missedDays: 0, alive: true, evilFromStart: false,
};

describe("apprenticeBetrayal", () => {
  describe("getBetrayalStage", () => {
    it("returns null below 60 corruption", () => {
      expect(getBetrayalStage(0)).toBeNull();
      expect(getBetrayalStage(30)).toBeNull();
      expect(getBetrayalStage(59)).toBeNull();
    });

    it("returns 'warning' at 60-74", () => {
      expect(getBetrayalStage(60)).toBe("warning");
      expect(getBetrayalStage(74)).toBe("warning");
    });

    it("returns 'turn' at 75-89", () => {
      expect(getBetrayalStage(75)).toBe("turn");
      expect(getBetrayalStage(89)).toBe("turn");
    });

    it("returns 'declaration' at 90-99", () => {
      expect(getBetrayalStage(90)).toBe("declaration");
      expect(getBetrayalStage(99)).toBe("declaration");
    });

    it("returns 'betrayal' at 100", () => {
      expect(getBetrayalStage(100)).toBe("betrayal");
    });

    it("thresholds are 60/75/90/100", () => {
      expect(BETRAYAL_THRESHOLDS.warning).toBe(60);
      expect(BETRAYAL_THRESHOLDS.turn).toBe(75);
      expect(BETRAYAL_THRESHOLDS.declaration).toBe(90);
      expect(BETRAYAL_THRESHOLDS.betrayal).toBe(100);
    });
  });

  describe("generateBetrayalEvent", () => {
    it("creates event for each stage", () => {
      for (const stage of ["warning", "turn", "declaration", "betrayal"] as const) {
        const event = generateBetrayalEvent(baseApp, stage);
        expect(event.stage).toBe(stage);
        expect(event.prompt).toBeTruthy();
        expect(event.options.length).toBeGreaterThanOrEqual(3);
      }
    });

    it("each option has outcome object", () => {
      const event = generateBetrayalEvent(baseApp, "warning");
      for (const opt of event.options) {
        expect(opt.id).toBeTruthy();
        expect(opt.label).toBeTruthy();
        expect(opt.outcome.corruptionDelta).toBeTypeOf("number");
        expect(opt.outcome.bondDelta).toBeTypeOf("number");
        expect(opt.outcome.moralityDelta).toBeTypeOf("number");
        expect(opt.outcome.resultFlavor).toBeTruthy();
      }
    });

    it("turn stage has expose option with forceStage halted", () => {
      const event = generateBetrayalEvent(baseApp, "turn");
      const exposeOption = event.options.find(o => o.id === "expose");
      expect(exposeOption).toBeTruthy();
      expect(exposeOption!.outcome.forceStage).toBe("halted");
    });

    it("declaration stage has fight option that force-halts", () => {
      const event = generateBetrayalEvent(baseApp, "declaration");
      const fight = event.options.find(o => o.id === "fight");
      expect(fight).toBeTruthy();
      expect(fight!.outcome.forceStage).toBe("halted");
    });

    it("betrayal stage has kill/disarm/defect options", () => {
      const event = generateBetrayalEvent(baseApp, "betrayal");
      const ids = event.options.map(o => o.id);
      expect(ids).toContain("kill");
      expect(ids).toContain("disarm");
      expect(ids).toContain("defect");
    });

    it("defect option requires negative morality shift", () => {
      const event = generateBetrayalEvent(baseApp, "betrayal");
      const defect = event.options.find(o => o.id === "defect");
      expect(defect!.outcome.moralityDelta).toBeLessThan(0);
    });

    it("evil apprentice betrayal prompt differs from non-evil", () => {
      const evilApp = { ...baseApp, evilFromStart: true };
      const normal = generateBetrayalEvent(baseApp, "betrayal");
      const evil = generateBetrayalEvent(evilApp, "betrayal");
      expect(normal.prompt).not.toBe(evil.prompt);
    });

    it("declaration includes apprentice's hidden motive when present", () => {
      const appWithMotive = { ...baseApp, hiddenMotive: "Unique betrayal motive text XYZ" };
      const event = generateBetrayalEvent(appWithMotive, "declaration");
      expect(event.prompt).toContain("Unique betrayal motive text XYZ");
    });
  });
});
