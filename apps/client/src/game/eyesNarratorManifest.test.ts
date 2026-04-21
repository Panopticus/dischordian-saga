/**
 * Structural tests for the Eyes Voice Layer content authored on
 * GALACTIC_MAP sectors (§10, "she was the fourth narrator all along").
 *
 * The EyesNarratorWhisper component reads `sector.eyesNarrator`
 * directly. Authored lines live on the sector data; this test
 * enforces the minimum coverage bar so a future edit that drops a
 * canonical whisper fails loudly instead of silently regressing
 * the late-Act-3 narrative depth.
 */
import { describe, it, expect } from "vitest";
import { GALACTIC_MAP } from "./tradeEmpire";

/** Sectors that MUST ship an Eyes whisper line — the narrative spine
 *  depends on them being populated. Content may change; presence must
 *  not regress. */
const REQUIRED_EYES_SECTORS = [
  "ark_debris_field",
  "trade_nexus",
  "free_ports",
  "new_babylon_core",
  "empire_frontier",
  "panopticon_ruins", // Her betrayal site — the canonical C-19 line
  "terminus_approach",
  "terminus_core",
  "viral_wastes",
  "insurgency_haven", // Her recruitment site — Kael's "I think you would be good at this"
  "frontier_worlds",
  "forge_worlds",
  "hell_gate",
  "dreamer_barrier",
  "black_hole_gate",
] as const;

describe("Eyes Voice Layer — sector manifest coverage", () => {
  for (const sectorId of REQUIRED_EYES_SECTORS) {
    it(`${sectorId} ships an eyesNarrator line`, () => {
      const sector = GALACTIC_MAP.find((s) => s.id === sectorId);
      expect(sector, `sector ${sectorId} not found in GALACTIC_MAP`).toBeDefined();
      expect(
        sector?.eyesNarrator,
        `sector ${sectorId} missing eyesNarrator field`,
      ).toBeTruthy();
      expect(
        sector?.eyesNarrator?.length ?? 0,
        `sector ${sectorId} eyesNarrator is too short`,
      ).toBeGreaterThan(40);
    });
  }

  it("at least 15 sectors carry Eyes whispers (MVP floor)", () => {
    const populated = GALACTIC_MAP.filter((s) => s.eyesNarrator);
    expect(populated.length).toBeGreaterThanOrEqual(15);
  });

  it("canonical biographical sectors reference their canon beats", () => {
    // Panopticon Ruins → Cell C-19 betrayal
    const panopticon = GALACTIC_MAP.find((s) => s.id === "panopticon_ruins");
    expect(panopticon?.eyesNarrator).toMatch(/C-19/);
    expect(panopticon?.eyesNarrator).toMatch(/Project Inception Ark/);

    // Insurgency Haven → Kael's recruitment
    const insurgency = GALACTIC_MAP.find((s) => s.id === "insurgency_haven");
    expect(insurgency?.eyesNarrator).toMatch(/Kael/);
    expect(insurgency?.eyesNarrator).toMatch(/Project Inception Ark/);

    // Free Ports → Mira on pier nineteen
    const ports = GALACTIC_MAP.find((s) => s.id === "free_ports");
    expect(ports?.eyesNarrator).toMatch(/Mira/);
    expect(ports?.eyesNarrator).toMatch(/pier nineteen/i);
  });

  it("no whisper line exceeds the UI's readable length budget", () => {
    // The EyesNarratorWhisper auto-dismisses at 9 seconds. ~500 chars
    // is about the upper bound for comfortable reading in that window.
    for (const sector of GALACTIC_MAP) {
      if (!sector.eyesNarrator) continue;
      expect(
        sector.eyesNarrator.length,
        `sector ${sector.id} eyesNarrator is too long (${sector.eyesNarrator.length} chars)`,
      ).toBeLessThanOrEqual(500);
    }
  });
});
