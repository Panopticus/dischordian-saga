import { describe, it, expect } from "vitest";
import {
  POTENTIAL_ORIGIN_REVEAL_WHEEL,
  POTENTIAL_ORIGIN_REVEAL_OUTCOMES,
  POTENTIAL_ORIGIN_REVEAL_FOLLOWUPS,
  POTENTIAL_ORIGIN_REVEAL_OPTION_IDS,
  POTENTIAL_ORIGIN_REVEAL_FLAGS,
  POTENTIAL_ORIGIN_REVEAL_TRIGGER,
  POTENTIAL_ORIGIN_REVEAL_ID,
} from "./potentialOriginReveal";
import { getAvailableOptions } from "./dialogWheel";

describe("potentialOriginReveal", () => {
  it("has the canonical event id", () => {
    expect(POTENTIAL_ORIGIN_REVEAL_ID).toBe("potentials_remember_origin");
  });

  it("declares the trigger conditions from spec §Part 0", () => {
    expect(POTENTIAL_ORIGIN_REVEAL_TRIGGER.roomsCleanedMin).toBe(5);
    expect(POTENTIAL_ORIGIN_REVEAL_TRIGGER.requireNpcs).toContain("elara");
    expect(POTENTIAL_ORIGIN_REVEAL_TRIGGER.requireNpcs).toContain("the_human");
    expect(POTENTIAL_ORIGIN_REVEAL_TRIGGER.forbidFlag).toBe("horror_reveal_seen");
  });

  it("every wheel option has an outcome and a followup", () => {
    for (const opt of POTENTIAL_ORIGIN_REVEAL_WHEEL) {
      expect(POTENTIAL_ORIGIN_REVEAL_OUTCOMES[opt.id]).toBeDefined();
      expect(POTENTIAL_ORIGIN_REVEAL_FOLLOWUPS[opt.id]).toBeDefined();
      expect(POTENTIAL_ORIGIN_REVEAL_FOLLOWUPS[opt.id].length).toBeGreaterThan(0);
    }
  });

  it("every outcome sets the seen flag and awards +50 light energy (spec §0.2)", () => {
    for (const [, outcome] of Object.entries(POTENTIAL_ORIGIN_REVEAL_OUTCOMES)) {
      expect(outcome.flagsToSet).toContain(POTENTIAL_ORIGIN_REVEAL_FLAGS.seen);
      expect(outcome.lightEnergy).toBe(50);
    }
  });

  it("OPTION_IDS matches the wheel exactly", () => {
    expect(POTENTIAL_ORIGIN_REVEAL_OPTION_IDS).toEqual(
      POTENTIAL_ORIGIN_REVEAL_WHEEL.map((o) => o.id),
    );
  });

  describe("visibility via getAvailableOptions", () => {
    const baseCtx = { skills: {}, npcTrust: {}, flags: {} };

    it("hides the Intelligence 10 option without sufficient skill", () => {
      const available = getAvailableOptions(POTENTIAL_ORIGIN_REVEAL_WHEEL, baseCtx);
      expect(available.map((o) => o.id)).not.toContain("por_int_10");
    });

    it("shows the Intelligence 10 option when skill is 10+", () => {
      const available = getAvailableOptions(POTENTIAL_ORIGIN_REVEAL_WHEEL, {
        ...baseCtx,
        skills: { intelligence: 10 },
      });
      expect(available.map((o) => o.id)).toContain("por_int_10");
    });

    it("hides the Spy preempt option from non-Spy players", () => {
      const available = getAvailableOptions(POTENTIAL_ORIGIN_REVEAL_WHEEL, {
        ...baseCtx,
        characterClass: "engineer",
      });
      expect(available.map((o) => o.id)).not.toContain("por_spy_preempt");
    });

    it("shows the Spy preempt option to Spies", () => {
      const available = getAvailableOptions(POTENTIAL_ORIGIN_REVEAL_WHEEL, {
        ...baseCtx,
        characterClass: "spy",
      });
      expect(available.map((o) => o.id)).toContain("por_spy_preempt");
    });

    it("Spy with Intelligence 10 sees both legendary options", () => {
      const available = getAvailableOptions(POTENTIAL_ORIGIN_REVEAL_WHEEL, {
        ...baseCtx,
        characterClass: "spy",
        skills: { intelligence: 10 },
      });
      expect(available.map((o) => o.id)).toContain("por_int_10");
      expect(available.map((o) => o.id)).toContain("por_spy_preempt");
    });
  });

  describe("unique unlock branches", () => {
    it("only Intelligence-10 and Spy-preempt unlock the Collector's Garden dossier", () => {
      const dossierIds = Object.entries(POTENTIAL_ORIGIN_REVEAL_OUTCOMES)
        .filter(([, o]) => o.loredexUnlock === "concept_collectors_garden")
        .map(([id]) => id);
      expect(dossierIds.sort()).toEqual(["por_int_10", "por_spy_preempt"]);
    });

    it("only the Spy preempt sets the spy_preempt_origin flag", () => {
      const spyPreemptIds = Object.entries(POTENTIAL_ORIGIN_REVEAL_OUTCOMES)
        .filter(([, o]) => o.flagsToSet.includes("spy_preempt_origin"))
        .map(([id]) => id);
      expect(spyPreemptIds).toEqual(["por_spy_preempt"]);
    });
  });
});
