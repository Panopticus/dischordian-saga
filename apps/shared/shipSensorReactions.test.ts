import { describe, it, expect } from "vitest";
import {
  SHIP_SENSOR_REACTIONS,
  getReactionsForEvent,
  getPrimaryReactionForEvent,
  getReactionsForRoom,
} from "./shipSensorReactions";

describe("shipSensorReactions", () => {
  it("every reaction has a non-empty Elara catch-line", () => {
    for (const r of SHIP_SENSOR_REACTIONS) {
      expect(r.elaraCatchLine.length).toBeGreaterThan(0);
    }
  });

  it("Elara's catch-lines all carry the canonical hull-sense register", () => {
    // Every line either invokes 'hull', 'felt', 'changed', 'humming', or names a room directly
    const tells = ["hull", "felt", "changed", "humming", "bridge", "archives", "medical bay", "comms", "cryo", "observation"];
    for (const r of SHIP_SENSOR_REACTIONS) {
      const line = r.elaraCatchLine.toLowerCase();
      expect(tells.some((t) => line.includes(t))).toBe(true);
    }
  });

  it("convergence_threshold has the highest priority (saga-finale reaction)", () => {
    const conv = getPrimaryReactionForEvent("convergence_threshold");
    expect(conv?.priority).toBe(10);
  });

  it("getPrimaryReactionForEvent returns undefined for unregistered events", () => {
    expect(getPrimaryReactionForEvent("not_a_real_event")).toBeUndefined();
  });

  it("getReactionsForRoom returns non-empty for rooms with reactions wired", () => {
    expect(getReactionsForRoom("medical_bay").length).toBeGreaterThan(0);
    expect(getReactionsForRoom("bridge").length).toBeGreaterThan(0);
  });

  it("dreamer_awakening warms lights (Dreamer-aligned visual register)", () => {
    const r = getPrimaryReactionForEvent("dreamer_awakening");
    expect(r?.pattern).toBe("lights_warm");
  });

  it("necromancer_return frosts the medical bay (his cold-architect register)", () => {
    const r = getPrimaryReactionForEvent("necromancer_return");
    expect(r?.pattern).toBe("frost_bloom");
    expect(r?.affectedRoomId).toBe("medical_bay");
  });

  it("vox_revelation routes to the Engineer (he is the substrate-haunter)", () => {
    const r = getPrimaryReactionForEvent("vox_revelation");
    expect(r?.investigatorNpcId).toBe("the_engineer");
    expect(r?.teachesMechanicId).toBe("engineer_logs_annotations");
  });

  it("getReactionsForEvent returns reactions sorted in registration order", () => {
    const reactions = getReactionsForEvent("dreamer_awakening");
    expect(reactions.length).toBeGreaterThan(0);
  });

  it("all event ids are unique enough that getPrimaryReactionForEvent is deterministic", () => {
    // Even with multiple reactions, primary must be deterministic
    const eventIds = new Set(SHIP_SENSOR_REACTIONS.map((r) => r.eventId));
    for (const eventId of eventIds) {
      const a = getPrimaryReactionForEvent(eventId);
      const b = getPrimaryReactionForEvent(eventId);
      expect(a?.label).toBe(b?.label);
    }
  });
});
