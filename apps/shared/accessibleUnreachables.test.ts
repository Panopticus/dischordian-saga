import { describe, expect, it } from "vitest";
import {
  ACCESSIBLE_UNREACHABLES,
  getUnreachablesForRoom,
  getRegisteredUnreachables,
} from "./accessibleUnreachables";

describe("accessibleUnreachables registry invariants", () => {
  it("ids are unique", () => {
    const ids = ACCESSIBLE_UNREACHABLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("inGameDescription + postGameReveal are non-empty for every entry", () => {
    for (const e of ACCESSIBLE_UNREACHABLES) {
      expect(e.inGameDescription.trim().length, `${e.id} empty in-game`).toBeGreaterThan(0);
      expect(e.postGameReveal.trim().length, `${e.id} empty post-game`).toBeGreaterThan(0);
    }
  });

  it("kind is one of the declared variants", () => {
    const allowed = new Set([
      "sealed_letter", "locked_door", "glassed_corridor",
      "vacuumed_chamber", "encrypted_terminal", "memorial_panel",
    ]);
    for (const e of ACCESSIBLE_UNREACHABLES) {
      expect(allowed.has(e.kind), `${e.id} bad kind ${e.kind}`).toBe(true);
    }
  });

  it("rejects stub markers", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i];
    for (const e of ACCESSIBLE_UNREACHABLES) {
      for (const pattern of stubs) {
        expect(
          pattern.test(e.inGameDescription) || pattern.test(e.postGameReveal),
          `${e.id} stub`,
        ).toBe(false);
      }
    }
  });
});

describe("getUnreachablesForRoom", () => {
  it("returns entries for the named room", () => {
    const result = getUnreachablesForRoom("captains-quarters");
    expect(result.length).toBeGreaterThan(0);
    for (const e of result) expect(e.roomId).toBe("captains-quarters");
  });

  it("returns empty for unknown rooms", () => {
    expect(getUnreachablesForRoom("not_a_room")).toEqual([]);
  });
});

describe("getRegisteredUnreachables", () => {
  it("includes entries with no flag gate regardless of flags set", () => {
    const all = getRegisteredUnreachables(new Set());
    // Two of the seed entries have no registeredOnFlag.
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it("respects per-entry registeredOnFlag", () => {
    // Pod Zero requires act_2_complete; without the flag, it's hidden.
    const without = getRegisteredUnreachables(new Set());
    expect(without.map((e) => e.id)).not.toContain("unreach_pod_zero_door");
    const withFlag = getRegisteredUnreachables(new Set(["act_2_complete"]));
    expect(withFlag.map((e) => e.id)).toContain("unreach_pod_zero_door");
  });
});
