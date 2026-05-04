/**
 * useLivingShipSensor — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "useLivingShipSensor.ts"),
  "utf-8",
);

describe("useLivingShipSensor", () => {
  it("imports the canonical sensor-reaction registry", () => {
    expect(SRC).toContain('from "@shared/shipSensorReactions"');
    expect(SRC).toContain("getPrimaryReactionForEvent");
  });

  it("keys off narrative flags of the form living_universe_event_<id>_active", () => {
    expect(SRC).toContain("living_universe_event_");
    expect(SRC).toMatch(/_active/);
  });

  it("exposes the canonical flag-name helper for downstream wiring", () => {
    expect(SRC).toContain("livingUniverseEventActiveFlag");
  });

  it("returns the highest-priority reaction across all active events", () => {
    expect(SRC).toMatch(/sort\(.*priority.*priority.*\)/s);
  });

  it("uses GameContext via useGame()", () => {
    expect(SRC).toContain('from "@/contexts/GameContext"');
    expect(SRC).toContain("useGame");
  });
});
