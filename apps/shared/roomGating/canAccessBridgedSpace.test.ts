import { describe, expect, it } from "vitest";

import {
  canAccessBridgedSpace,
  evaluateUnlock,
  type BridgedAccessGameSlice,
} from "./canAccessBridgedSpace";

function slice(over: Partial<BridgedAccessGameSlice> = {}): BridgedAccessGameSlice {
  return {
    narrativeAct: 0,
    narrativeFlags: {},
    ...over,
  };
}

describe("canAccessBridgedSpace", () => {
  it("passes act_progress when narrativeAct >= required", () => {
    expect(
      canAccessBridgedSpace("dest.trade_empire.te01_aurum_prime", slice({ narrativeAct: 2 }))
        .allowed,
    ).toBe(true);
    const blocked = canAccessBridgedSpace(
      "dest.trade_empire.te01_aurum_prime",
      slice({ narrativeAct: 1 }),
    );
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) expect(blocked.reason).toMatch(/Act 2/);
  });

  it("passes hellbox_unlocked when cs_hellbox_N_open flag set", () => {
    expect(
      canAccessBridgedSpace(
        "dest.castle_of_death.cod01_entrance_hall",
        slice({ narrativeFlags: { cs_hellbox_2_open: true } }),
      ).allowed,
    ).toBe(true);
    expect(
      canAccessBridgedSpace(
        "dest.castle_of_death.cod01_entrance_hall",
        slice(),
      ).allowed,
    ).toBe(false);
  });

  it("returns allowed:true for unknown canonical ids (ungated)", () => {
    expect(canAccessBridgedSpace("not.a.real.space", slice()).allowed).toBe(true);
  });

  it("room_visited accepts both the bare flag and visited_<id> form", () => {
    const r1 = evaluateUnlock(
      { type: "room_visited", value: "ark.pet_garden" },
      slice({ narrativeFlags: { "visited_ark.pet_garden": true } }),
    );
    expect(r1.allowed).toBe(true);
    const r2 = evaluateUnlock(
      { type: "room_visited", value: "ark.pet_garden" },
      slice({ narrativeFlags: { "ark.pet_garden": true } }),
    );
    expect(r2.allowed).toBe(true);
  });

  it("specific_item passes only when inventory contains the id", () => {
    const req = { type: "specific_item" as const, value: "captains-key" };
    expect(
      evaluateUnlock(req, slice({ inventory: [{ id: "captains-key" }] })).allowed,
    ).toBe(true);
    expect(evaluateUnlock(req, slice({ inventory: [] })).allowed).toBe(false);
  });

  it("apprentice_in_cohort 'any' matches when any apprentice is present", () => {
    const req = { type: "apprentice_in_cohort" as const, archetype: "any" };
    expect(
      evaluateUnlock(req, slice({ armyUnits: [{ archetype: "zealot" }] })).allowed,
    ).toBe(true);
    expect(evaluateUnlock(req, slice({ armyUnits: [] })).allowed).toBe(false);
  });

  it("blood_weave_alignment passes when score >= threshold", () => {
    const req = { type: "blood_weave_alignment" as const, threshold: 40 };
    expect(evaluateUnlock(req, slice({ bloodWeaveAlignment: 40 })).allowed).toBe(true);
    expect(evaluateUnlock(req, slice({ bloodWeaveAlignment: 10 })).allowed).toBe(false);
  });
});
