import { describe, it, expect } from "vitest";
import {
  COMPANION_ROOM_REGISTRY,
  getCompanionRoom,
  listCompanionRoomIds,
  listCompanionsInRoom,
} from "./companionRoomRegistry";

describe("COMPANION_ROOM_REGISTRY — invariants", () => {
  it("ships at least 5 wired companions", () => {
    expect(COMPANION_ROOM_REGISTRY.length).toBeGreaterThanOrEqual(5);
  });

  it("every (companionId, roomId) tuple is unique", () => {
    // Companions deliberately ship multiple entries when they have a
    // primary post AND a bunk-room residence (see the bunk-room
    // comment in companionRoomRegistry.ts). The dedupe key is the
    // (companionId, roomId) tuple, not the companionId alone.
    const keys = COMPANION_ROOM_REGISTRY.map(
      (e) => `${e.companionId}|${e.roomId}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every entry has a non-empty presenceLine", () => {
    for (const entry of COMPANION_ROOM_REGISTRY) {
      expect(entry.presenceLine.length).toBeGreaterThan(0);
    }
  });
});

describe("listCompanionsInRoom", () => {
  it("returns Elara on the bridge unconditionally", () => {
    const roster = listCompanionsInRoom("bridge", {});
    expect(roster.find((e) => e.companionId === "elara")).toBeDefined();
  });

  it("returns The Human on the observation deck unconditionally", () => {
    const roster = listCompanionsInRoom("observation-deck", {});
    expect(roster.find((e) => e.companionId === "the_human")).toBeDefined();
  });

  it("hides flag-gated companions until the gate is set", () => {
    const before = listCompanionsInRoom("recipe-archive", {});
    expect(before.find((e) => e.companionId === "the_antiquarian")).toBeUndefined();

    const after = listCompanionsInRoom("recipe-archive", { act_2_complete: true });
    expect(after.find((e) => e.companionId === "the_antiquarian")).toBeDefined();
  });
});

describe("getCompanionRoom", () => {
  it("returns the room when the companion is visible", () => {
    expect(getCompanionRoom("elara", {})).toBe("bridge");
  });

  it("returns null when a flag-gated companion's gate is unmet", () => {
    expect(getCompanionRoom("adjudicator_locke", {})).toBeNull();
  });

  it("returns the room once the gate is satisfied", () => {
    expect(getCompanionRoom("adjudicator_locke", { trade_empire_unlocked: true }))
      .toBe("war-room");
  });
});

describe("listCompanionRoomIds", () => {
  it("returns each room only once", () => {
    const rooms = listCompanionRoomIds();
    expect(new Set(rooms).size).toBe(rooms.length);
  });

  it("includes every room mentioned in the registry", () => {
    const rooms = listCompanionRoomIds();
    expect(rooms).toContain("bridge");
    expect(rooms).toContain("observation-deck");
  });
});
