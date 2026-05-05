import { describe, it, expect } from "vitest";

import { resolveNextStage } from "./romanceLadderService";
import { ROMANCE_LADDERS } from "../../shared/romanceLadders";

const lockeDef = ROMANCE_LADDERS.locke;
const vexDef = ROMANCE_LADDERS.vex;
const dmcDef = ROMANCE_LADDERS.dmc_companion;

describe("resolveNextStage — pure stage advancement logic", () => {
  describe("guards", () => {
    it("blocks at max stage", () => {
      const result = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 5,
        ended: false,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: null,
      });
      expect("blocked" in result && result.blocked.kind).toBe("max_stage");
    });

    it("blocks when the romance has ended", () => {
      const result = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 2,
        ended: true,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: null,
      });
      expect("blocked" in result && result.blocked.kind).toBe("ended");
    });
  });

  describe("trust gate", () => {
    it("blocks when trust is below the next stage's gate", () => {
      // Locke stage 1 trustGate = 10
      const result = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 0,
        ended: false,
        trust: 5,
        flags: new Set(),
        otherCommittedExclusive: null,
      });
      expect("blocked" in result).toBe(true);
      if ("blocked" in result && result.blocked.kind === "trust_gate") {
        expect(result.blocked.required).toBe(10);
        expect(result.blocked.current).toBe(5);
      } else {
        throw new Error("expected trust_gate blocker");
      }
    });

    it("permits advancement when trust meets the gate exactly", () => {
      const result = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 0,
        ended: false,
        trust: 10,
        flags: new Set(),
        otherCommittedExclusive: null,
      });
      expect("stage" in result && result.stage.stage).toBe(1);
    });
  });

  describe("requiresFlag gate", () => {
    it("blocks Vex stage-3 commitment until engineer_zero_hint fires", () => {
      const result = resolveNextStage({
        ladderDef: vexDef,
        currentStage: 2,
        ended: false,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: null,
      });
      expect("blocked" in result).toBe(true);
      if ("blocked" in result && result.blocked.kind === "missing_flag") {
        expect(result.blocked.flag).toBe("engineer_zero_hint");
      } else {
        throw new Error("expected missing_flag blocker");
      }
    });

    it("permits Vex stage-3 once engineer_zero_hint fires", () => {
      const result = resolveNextStage({
        ladderDef: vexDef,
        currentStage: 2,
        ended: false,
        trust: 100,
        flags: new Set(["engineer_zero_hint"]),
        otherCommittedExclusive: null,
      });
      expect("stage" in result && result.stage.stage).toBe(3);
    });

    it("DMC Companion stage-3 requires the dmc_companion_naming_offered flag", () => {
      const without = resolveNextStage({
        ladderDef: dmcDef,
        currentStage: 2,
        ended: false,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: null,
      });
      expect("blocked" in without && without.blocked.kind).toBe("missing_flag");
      const withFlag = resolveNextStage({
        ladderDef: dmcDef,
        currentStage: 2,
        ended: false,
        trust: 100,
        flags: new Set(["dmc_companion_naming_offered"]),
        otherCommittedExclusive: null,
      });
      expect("stage" in withFlag && withFlag.stage.stage).toBe(3);
    });
  });

  describe("exclusivity", () => {
    it("permits stages 1 and 2 even when another romance is exclusive", () => {
      const stage1 = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 0,
        ended: false,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: "vex",
      });
      expect("stage" in stage1 && stage1.stage.stage).toBe(1);

      const stage2 = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 1,
        ended: false,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: "vex",
      });
      expect("stage" in stage2 && stage2.stage.stage).toBe(2);
    });

    it("blocks stage 3 when another romance is committed-exclusive", () => {
      const result = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 2,
        ended: false,
        trust: 100,
        flags: new Set(),
        otherCommittedExclusive: "vex",
      });
      expect("blocked" in result).toBe(true);
      if ("blocked" in result && result.blocked.kind === "exclusive_with_other") {
        expect(result.blocked.otherNpcId).toBe("vex");
      } else {
        throw new Error("expected exclusive_with_other blocker");
      }
    });

    it("permits stage 3 when no other romance is exclusive (and the path flag is set)", () => {
      const result = resolveNextStage({
        ladderDef: lockeDef,
        currentStage: 2,
        ended: false,
        trust: 100,
        flags: new Set(["locke_offers_exit_contract"]),
        otherCommittedExclusive: null,
      });
      expect("stage" in result && result.stage.stage).toBe(3);
    });
  });

  describe("happy path", () => {
    it("advances Locke through all five stages when every required flag is set", () => {
      // Locke stage 3 gates on locke_offers_exit_contract per
      // ROMANCE_LADDERS.locke; provide it up-front so the loop
      // can climb cleanly. Stages 1, 2, 4, 5 have no flag gate.
      const flags = new Set(["locke_offers_exit_contract"]);
      let stage = 0;
      for (let i = 0; i < 5; i++) {
        const result = resolveNextStage({
          ladderDef: lockeDef,
          currentStage: stage,
          ended: false,
          trust: 100,
          flags,
          otherCommittedExclusive: null,
        });
        expect("stage" in result).toBe(true);
        if ("stage" in result) stage = result.stage.stage;
      }
      expect(stage).toBe(5);
    });

    it("respects per-stage trust gates (Locke 10 / 30 / 50 / 70 / 90)", () => {
      const expectedGates = [10, 30, 50, 70, 90];
      const flags = new Set(["locke_offers_exit_contract"]);
      for (let i = 0; i < expectedGates.length; i++) {
        const justBelow = resolveNextStage({
          ladderDef: lockeDef,
          currentStage: i,
          ended: false,
          trust: expectedGates[i] - 1,
          flags,
          otherCommittedExclusive: null,
        });
        expect("blocked" in justBelow).toBe(true);

        const atGate = resolveNextStage({
          ladderDef: lockeDef,
          currentStage: i,
          ended: false,
          trust: expectedGates[i],
          flags,
          otherCommittedExclusive: null,
        });
        expect("stage" in atGate).toBe(true);
      }
    });
  });
});
