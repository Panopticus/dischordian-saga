/**
 * LivingShipSensorOverlay — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "LivingShipSensorOverlay.tsx"),
  "utf-8",
);
const ARK_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "pages", "ArkExplorerPage.tsx"),
  "utf-8",
);

describe("LivingShipSensorOverlay", () => {
  it("uses the useLivingShipSensor hook for state", () => {
    expect(SRC).toContain('from "@/hooks/useLivingShipSensor"');
    expect(SRC).toContain("useLivingShipSensor");
  });

  it("renders Elara's catch-line from the canonical reaction", () => {
    expect(SRC).toContain("reaction.elaraCatchLine");
  });

  it("differentiates visual register by sensor pattern", () => {
    // All 8 patterns must have presets
    const patterns = [
      "creak",
      "flicker",
      "red_tint",
      "frost_bloom",
      "low_thrum",
      "static_burst",
      "lights_dim",
      "lights_warm",
    ];
    for (const p of patterns) {
      expect(SRC).toContain(p);
    }
  });

  it("provides an Investigate CTA routing to /room/<affectedRoomId>", () => {
    expect(SRC).toContain("/room/${reaction.affectedRoomId}");
    expect(SRC).toContain("Investigate");
  });

  it("self-suppresses if no reaction is active (AnimatePresence guard)", () => {
    expect(SRC).toContain("primaryReaction && dismissed");
    expect(SRC).toContain("AnimatePresence");
  });

  it("animates the icon pulse with framer-motion at the pattern's pulseDuration", () => {
    expect(SRC).toContain("preset.pulseDuration");
    expect(SRC).toContain("repeat: Infinity");
  });
});

describe("ArkExplorerPage — overlay mount", () => {
  it("imports the LivingShipSensorOverlay component", () => {
    expect(ARK_SRC).toContain('from "@/components/LivingShipSensorOverlay"');
  });

  it("mounts <LivingShipSensorOverlay /> inside the page render", () => {
    expect(ARK_SRC).toContain("<LivingShipSensorOverlay");
  });
});
