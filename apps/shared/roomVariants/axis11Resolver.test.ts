/**
 * Vitest suite for Axis 11 cycle-phase resolver (Phase H.E).
 */
import { describe, expect, it } from "vitest";

import {
  ALL_CYCLE_STATES,
  LONGNIGHT_GLOBAL_FLAG,
  ROOM_PHASE_LOCKS,
  resolveAxis11State,
  type Axis11GameSlice,
} from "./axis11Resolver";

function gameAt(hour: number, flags: Record<string, boolean> = {}): Axis11GameSlice {
  const d = new Date();
  d.setHours(hour);
  return { now: d, narrativeFlags: flags };
}

describe("axis11Resolver — Phase H.E", () => {
  it("resolves wall-clock phase for an unconstrained room", () => {
    expect(resolveAxis11State(gameAt(8), "cryo_bay")).toBe("dawn");
    expect(resolveAxis11State(gameAt(13), "cryo_bay")).toBe("midday");
    expect(resolveAxis11State(gameAt(19), "cryo_bay")).toBe("dusk");
    expect(resolveAxis11State(gameAt(2), "cryo_bay")).toBe("nightwatch");
  });

  it("phase-locks Warden's Dock to dawn regardless of wall-clock", () => {
    expect(resolveAxis11State(gameAt(3), "warden_dock")).toBe("dawn");
    expect(resolveAxis11State(gameAt(13), "warden_dock")).toBe("dawn");
    expect(resolveAxis11State(gameAt(20), "warden_dock")).toBe("dawn");
  });

  it("phase-locks Memory Card Library to nightwatch", () => {
    expect(resolveAxis11State(gameAt(8), "memory_card_library")).toBe(
      "nightwatch",
    );
  });

  it("phase-locks The Forge to nightwatch (ember-glow strongest)", () => {
    expect(resolveAxis11State(gameAt(12), "the_forge")).toBe("nightwatch");
  });

  it("global longnight flag overrides wall-clock for unlocked rooms", () => {
    const game = gameAt(13, { [LONGNIGHT_GLOBAL_FLAG]: true });
    expect(resolveAxis11State(game, "cryo_bay")).toBe("longnight");
  });

  it("phase-lock still wins over longnight flag", () => {
    const game = gameAt(13, { [LONGNIGHT_GLOBAL_FLAG]: true });
    // Warden's Dock is dawn-locked; longnight cannot override
    expect(resolveAxis11State(game, "warden_dock")).toBe("dawn");
  });

  it("ROOM_PHASE_LOCKS contains the 3 narrative-locked rooms", () => {
    expect(ROOM_PHASE_LOCKS.size).toBeGreaterThanOrEqual(3);
    expect(ROOM_PHASE_LOCKS.get("warden_dock")).toBe("dawn");
    expect(ROOM_PHASE_LOCKS.get("memory_card_library")).toBe("nightwatch");
    expect(ROOM_PHASE_LOCKS.get("the_forge")).toBe("nightwatch");
  });

  it("ALL_CYCLE_STATES enumerates the 5 canonical states", () => {
    expect(ALL_CYCLE_STATES).toEqual([
      "dawn",
      "midday",
      "dusk",
      "nightwatch",
      "longnight",
    ]);
  });
});
