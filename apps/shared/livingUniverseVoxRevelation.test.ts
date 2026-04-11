import { describe, it, expect } from "vitest";
import {
  VOX_REVELATION_EVENT,
  ALL_EMERGENT_EVENTS,
  EVENT_CONSEQUENCES,
  getEmergingEvent,
  DEFAULT_PRESSURE,
  UNIVERSE_IMPACTS,
  EVENT_SYNERGIES,
} from "./livingUniverseEvents";

/**
 * The Vox Revelation is a new emergent event added by the thought-virus
 * mechanics branch. These tests pin down that it's registered in every
 * place the living-universe system reads events from.
 */
describe("Living Universe — Vox Revelation", () => {
  it("is included in the ALL_EMERGENT_EVENTS registry", () => {
    expect(ALL_EMERGENT_EVENTS.find(e => e.id === "vox_revelation")).toBeDefined();
  });

  it("has a consequence entry so active-event math can apply it", () => {
    const consequence = EVENT_CONSEQUENCES.find(c => c.eventId === "vox_revelation");
    expect(consequence).toBeDefined();
    expect(consequence?.dialogOverride).toBe("vox_revelation_active");
    expect(consequence?.marketMultipliers.vox_artifact).toBeGreaterThan(1);
  });

  it("VOX_REVELATION_EVENT has the required narrative shape", () => {
    expect(VOX_REVELATION_EVENT.id).toBe("vox_revelation");
    expect(VOX_REVELATION_EVENT.drivingForce).toContain("Vox");
    expect(VOX_REVELATION_EVENT.narrative.emergenceExplanation.length).toBeGreaterThan(20);
    expect(Object.keys(VOX_REVELATION_EVENT.narrative.npcReactions).length).toBeGreaterThanOrEqual(5);
  });

  it("can out-score other events when its pressure sources dominate", () => {
    const pressure = {
      ...DEFAULT_PRESSURE,
      loreDiscoveries: 2000,
      viralExposures: 2000,
      truthRevealed: 500,
      betrayals: 0,
    };
    const emerging = getEmergingEvent(pressure);
    expect(emerging).not.toBeNull();
    // Vox scoring: 0.75*2000 + 0.5*2000 + 500 - 0 = 3000
    // Terminus scoring: 2000 + 0 - 0 = 2000
    // Antiquarian scoring: 2000 + 0 = 2000
    expect(emerging?.eventId).toBe("vox_revelation");
  });

  it("every universe impact system has a reaction string for vox_revelation", () => {
    for (const impact of UNIVERSE_IMPACTS) {
      expect(impact.reactions.vox_revelation).toBeDefined();
      expect(impact.reactions.vox_revelation.length).toBeGreaterThan(5);
    }
  });

  it("has at least one synergy pairing in EVENT_SYNERGIES", () => {
    const hasSynergy = EVENT_SYNERGIES.some(s => s.events.includes("vox_revelation"));
    expect(hasSynergy).toBe(true);
  });
});
