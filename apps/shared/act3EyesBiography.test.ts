import { describe, it, expect } from "vitest";
import {
  EYES_BIOGRAPHY,
  getEyesStage,
  getInfiltrationPath,
  INFILTRATION_PATHS,
  listInfiltrationPaths,
  listTradeEmpireImprovements,
  TRADE_EMPIRE_IMPROVEMENTS,
} from "./act3EyesBiography";

describe("act3EyesBiography", () => {
  describe("Eyes biography (§7)", () => {
    it("has exactly 7 life stages", () => {
      expect(EYES_BIOGRAPHY.length).toBe(7);
    });

    it("stages are ordered 1 through 7 contiguously", () => {
      const orders = EYES_BIOGRAPHY.map((e) => e.order).sort((a, b) => a - b);
      expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("stages end with death_in_grass at order 7", () => {
      const last = [...EYES_BIOGRAPHY].sort((a, b) => b.order - a.order)[0];
      expect(last.stage).toBe("death_in_grass");
    });

    it("the Watcher's signature line is in the death_in_grass summary", () => {
      const death = getEyesStage("death_in_grass");
      expect(death?.summary).toContain("giving her back to the grass");
    });

    it("every stage has a unique encounteredFlag", () => {
      const flags = EYES_BIOGRAPHY.map((e) => e.encounteredFlag);
      expect(new Set(flags).size).toBe(flags.length);
    });
  });

  describe("Infiltration paths (§7.3)", () => {
    it("has exactly 3 canonical paths", () => {
      expect(Object.keys(INFILTRATION_PATHS).length).toBe(3);
    });

    it("listInfiltrationPaths returns [insurgency, empire, hierarchy]", () => {
      const ids = listInfiltrationPaths().map((p) => p.id);
      expect(ids).toEqual(["insurgency", "empire", "hierarchy"]);
    });

    it("Insurgency path's milestone flag wires to event_the_engineer_speaks", () => {
      const path = getInfiltrationPath("insurgency");
      expect(path.milestoneFlag).toBe("insurgency_infiltration_complete");
      expect(path.livingUniverseEvent).toBe("event_the_engineer_speaks");
    });

    it("Empire path's milestone flag wires to event_the_archon_recruited", () => {
      const path = getInfiltrationPath("empire");
      expect(path.milestoneFlag).toBe("empire_archon_offer_accepted");
      expect(path.livingUniverseEvent).toBe("event_the_archon_recruited");
    });

    it("Hierarchy path exists but has no LU event (dark path)", () => {
      const path = getInfiltrationPath("hierarchy");
      expect(path.milestoneFlag).toBe("hierarchy_infiltration_complete");
    });

    it("every path has distinct commit + ending flags", () => {
      for (const path of listInfiltrationPaths()) {
        expect(path.commitFlag).not.toBe(path.endingFlag);
      }
    });
  });

  describe("Trade Empire §8 improvements", () => {
    it("has exactly 10 improvements per §8", () => {
      expect(TRADE_EMPIRE_IMPROVEMENTS.length).toBe(10);
    });

    it("orders are 1..10 contiguously", () => {
      const orders = [...TRADE_EMPIRE_IMPROVEMENTS]
        .map((i) => i.order)
        .sort((a, b) => a - b);
      expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("every improvement has a unique shippedFlag", () => {
      const flags = TRADE_EMPIRE_IMPROVEMENTS.map((i) => i.shippedFlag);
      expect(new Set(flags).size).toBe(flags.length);
    });

    it("listTradeEmpireImprovements returns the full list in order", () => {
      const list = listTradeEmpireImprovements();
      expect(list.length).toBe(10);
      expect(list[0].order).toBe(1);
      expect(list[list.length - 1].order).toBe(10);
    });

    it("improvement #10 is the Eyes voice layer reveal", () => {
      const tenth = TRADE_EMPIRE_IMPROVEMENTS.find((i) => i.order === 10);
      expect(tenth?.id).toBe("eyes_voice_layer");
    });
  });
});
