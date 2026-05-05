import { describe, it, expect } from "vitest";

import {
  ROMANCE_LADDERS,
  ROMANCE_NPC_IDS,
  committedFlagFor,
  nextAvailableStage,
  requiresBreakup,
} from "./romanceLadders";

describe("romanceLadders registry", () => {
  it("has the five canonical romance candidates", () => {
    expect(ROMANCE_NPC_IDS).toHaveLength(5);
    expect(ROMANCE_NPC_IDS).toContain("locke");
    expect(ROMANCE_NPC_IDS).toContain("vex");
    expect(ROMANCE_NPC_IDS).toContain("elara");
    expect(ROMANCE_NPC_IDS).toContain("dmc_companion");
    expect(ROMANCE_NPC_IDS).toContain("jericho_jones");
  });

  it("every ladder has exactly five stages with monotonic trust gates", () => {
    for (const id of ROMANCE_NPC_IDS) {
      const ladder = ROMANCE_LADDERS[id];
      expect(ladder.stages).toHaveLength(5);
      let prev = -Infinity;
      for (const s of ladder.stages) {
        expect(s.trustGate).toBeGreaterThan(prev);
        prev = s.trustGate;
        expect(s.sceneTrigger).toContain(`romance:${id}:stage${s.stage}`);
      }
    }
  });

  it("Vex's stage-3 commitment requires the engineer_zero_hint flag (Engineer arc gate)", () => {
    const vex = ROMANCE_LADDERS.vex;
    const stage3 = vex.stages.find((s) => s.stage === 3);
    expect(stage3?.requiresFlag).toBe("engineer_zero_hint");
  });

  it("DMC Companion's stage-3 preserves the Naming beat", () => {
    const dmc = ROMANCE_LADDERS.dmc_companion;
    const stage3 = dmc.stages.find((s) => s.stage === 3);
    expect(stage3?.requiresFlag).toBe("dmc_companion_naming_offered");
    expect(stage3?.beatSummary.toLowerCase()).toContain("naming");
  });
});

describe("nextAvailableStage", () => {
  it("returns null when trust is below the next stage gate", () => {
    const locke = ROMANCE_LADDERS.locke;
    expect(nextAvailableStage(locke, 0, 5, new Set())).toBeNull();
  });

  it("returns the next stage when trust crosses the gate", () => {
    const locke = ROMANCE_LADDERS.locke;
    const next = nextAvailableStage(locke, 0, 15, new Set());
    expect(next?.stage).toBe(1);
  });

  it("blocks advancement when requiresFlag is missing", () => {
    const vex = ROMANCE_LADDERS.vex;
    const next = nextAvailableStage(vex, 2, 100, new Set());
    expect(next).toBeNull();
  });

  it("unlocks advancement when the requiresFlag is present", () => {
    const vex = ROMANCE_LADDERS.vex;
    const next = nextAvailableStage(vex, 2, 100, new Set(["engineer_zero_hint"]));
    expect(next?.stage).toBe(3);
  });
});

describe("requiresBreakup", () => {
  it("returns false when no other romance is committed", () => {
    expect(requiresBreakup("locke", [])).toBe(false);
  });

  it("returns false when the target is the only committed romance", () => {
    expect(requiresBreakup("locke", ["locke"])).toBe(false);
  });

  it("returns true when a different romance is already committed", () => {
    expect(requiresBreakup("locke", ["vex"])).toBe(true);
  });
});

describe("committedFlagFor", () => {
  it("returns the per-npc committed-flag string", () => {
    expect(committedFlagFor("vex")).toBe("romance:committed:vex");
    expect(committedFlagFor("locke")).toBe("romance:committed:locke");
  });
});
