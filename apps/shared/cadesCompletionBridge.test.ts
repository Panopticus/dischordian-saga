/**
 * Cades FPS → Act 5 completion-gate bridge tests.
 *
 * The Cades FPS is a Godot 4.3 iframe embed (apps/client/src/pages/
 * CADESFPSPage.tsx). Mission flags are canonical per
 * CADES_FPS_MISSIONS in apps/shared/actsFourFiveShells.ts. Before the
 * bridge, nothing in the React shell mapped Godot CADES_RESULT events
 * to cades_m*_complete flags, so Act 5's completion gate
 * (`cades_m7_complete` required) never fired organically.
 *
 * This file structurally enforces the bridge wiring AND the three-way
 * alignment between the CADES_FPS_MISSIONS data shell, the gate's
 * required flags, and the React bridge's flag writes.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  CADES_FPS_MISSIONS,
  getCadesMission,
} from "./actsFourFiveShells";

const pageSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/pages/CADESFPSPage.tsx"),
  "utf-8",
);

describe("CADESFPSPage — mode → mission-flag bridge", () => {
  it("destructures setNarrativeFlag from useGame()", () => {
    expect(pageSrc).toMatch(/setNarrativeFlag.*useGame\(\)|useGame\(\).*setNarrativeFlag/s);
  });

  it("raises M1 on ANY successful Cades run (Scout's Gambit — playing = scouting)", () => {
    // The bridge should mark M1 on the first `r.success` so the Hub
    // panel shows a visible progression arc even before last_stand.
    expect(pageSrc).toContain('setNarrativeFlag("cades_m1_complete"');
  });

  it("maps mode 'ship_defense' → cades_m2_complete", () => {
    // M2 "The Digital Onslaught" — canon: "hold the node for 60s
    // under assault." The Godot `ship_defense` mode fills that beat.
    expect(pageSrc).toMatch(/ship_defense.*cades_m2_complete|cades_m2_complete.*ship_defense/s);
  });

  it("maps mode 'historical_incursions' → cades_m5_complete", () => {
    // M5 "Operation Trojan Downfall" — canon: joint assault with
    // mandatory partial loss. historical_incursions is the
    // replay/scenario mode that re-runs past-battle material.
    expect(pageSrc).toMatch(/historical_incursions.*cades_m5_complete|cades_m5_complete.*historical_incursions/s);
  });

  it("maps mode 'last_stand' → cades_m7_complete (Iron Lion's death, the gate-critical flag)", () => {
    expect(pageSrc).toMatch(/last_stand.*cades_m7_complete|cades_m7_complete.*last_stand/s);
  });

  it("gates all mission-flag writes on r.success (failed runs don't advance the gate)", () => {
    // Otherwise a CADES_RESULT with success=false would still raise
    // M1-M7 flags on top of the failure narrative.
    expect(pageSrc).toMatch(/if\s*\(\s*r\.success\s*\)/);
  });
});

describe("Cades bridge ↔ data shell alignment", () => {
  it("CADES_FPS_MISSIONS has exactly 7 entries", () => {
    expect(CADES_FPS_MISSIONS.length).toBe(7);
  });

  it("M1 / M2 / M5 / M7 all declare their canonical completedFlag", () => {
    expect(getCadesMission("m1")?.completedFlag).toBe("cades_m1_complete");
    expect(getCadesMission("m2")?.completedFlag).toBe("cades_m2_complete");
    expect(getCadesMission("m5")?.completedFlag).toBe("cades_m5_complete");
    expect(getCadesMission("m7")?.completedFlag).toBe("cades_m7_complete");
  });

  it("M7 is the mandatory_death beat (canon invariant)", () => {
    expect(getCadesMission("m7")?.mandatoryBeat).toBe("mandatory_death");
  });
});

describe("Cades bridge ↔ Act 5 gate alignment", () => {
  it("Act 5 gate reads cades_m7_complete (the flag the bridge writes on last_stand success)", async () => {
    const gate = await import("./act5CompletionGate");
    expect(gate.ACT_5_COMPLETION_REQUIRED_FLAGS).toContain("cades_m7_complete");
  });
});
