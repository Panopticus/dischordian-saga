/**
 * Tier 3 foundation: team / multiplayer types.
 *
 * Tests the navigation invariants every later sub-PR (2v2 ranked,
 * card co-op, FFA) will lean on. Side compatibility is exhaustively
 * checked because a regression here breaks the 1v1 engine.
 */
import { describe, it, expect } from "vitest";
import {
  TeamId,
  type Team,
  type TurnOrder,
  TURN_ORDER_1V1,
  TURN_ORDER_2V2_ALTERNATING,
  TURN_ORDER_FFA_4,
  TURN_ORDER_COOP_2V1,
  sideToSlot,
  slotToSide,
  teamForSlot,
  alliedSlots,
  enemySlots,
  nextSlotInOrder,
  teams1v1,
  teams2v2,
  teamsCoop2v1,
  teamsFfa4,
} from "./Teams";

describe("Side ↔ MatchPlayerSlot adapters (1v1 backwards-compat)", () => {
  it("sideToSlot is the identity for legal Side values", () => {
    expect(sideToSlot(0)).toBe(0);
    expect(sideToSlot(1)).toBe(1);
  });
  it("slotToSide round-trips legal slots", () => {
    expect(slotToSide(0)).toBe(0);
    expect(slotToSide(1)).toBe(1);
  });
  it("slotToSide throws on out-of-range slots", () => {
    expect(() => slotToSide(2)).toThrow();
    expect(() => slotToSide(-1)).toThrow();
  });
});

describe("teams1v1 — 1v1 engine compatibility", () => {
  it("yields exactly 2 single-player teams", () => {
    const teams = teams1v1();
    expect(teams).toHaveLength(2);
    expect(teams[0].playerSlots).toEqual([0]);
    expect(teams[1].playerSlots).toEqual([1]);
  });

  it("teamForSlot finds the correct team for both slots", () => {
    const teams = teams1v1();
    expect(teamForSlot(teams, 0)?.id).toBe(TeamId("team_a"));
    expect(teamForSlot(teams, 1)?.id).toBe(TeamId("team_b"));
  });

  it("alliedSlots returns empty for solo teams", () => {
    const teams = teams1v1();
    expect(alliedSlots(teams, 0)).toEqual([]);
    expect(alliedSlots(teams, 1)).toEqual([]);
  });

  it("enemySlots returns the single opposing slot", () => {
    const teams = teams1v1();
    expect(enemySlots(teams, 0)).toEqual([1]);
    expect(enemySlots(teams, 1)).toEqual([0]);
  });
});

describe("teams2v2", () => {
  it("partitions slots [0,2] and [1,3] across two teams", () => {
    const teams = teams2v2();
    expect(teams).toHaveLength(2);
    expect(teams[0].playerSlots).toEqual([0, 2]);
    expect(teams[1].playerSlots).toEqual([1, 3]);
  });

  it("alliedSlots returns the teammate, not self", () => {
    const teams = teams2v2();
    expect(alliedSlots(teams, 0)).toEqual([2]);
    expect(alliedSlots(teams, 2)).toEqual([0]);
    expect(alliedSlots(teams, 1)).toEqual([3]);
    expect(alliedSlots(teams, 3)).toEqual([1]);
  });

  it("enemySlots returns the entire opposing team", () => {
    const teams = teams2v2();
    expect(enemySlots(teams, 0).slice().sort()).toEqual([1, 3]);
    expect(enemySlots(teams, 2).slice().sort()).toEqual([1, 3]);
    expect(enemySlots(teams, 1).slice().sort()).toEqual([0, 2]);
  });
});

describe("teamsCoop2v1", () => {
  it("flags the boss team as isAi", () => {
    const teams = teamsCoop2v1();
    expect(teams[0].isAi).toBeFalsy();
    expect(teams[1].isAi).toBe(true);
  });
  it("humans (0,1) ally with each other; boss (2) is enemy of both", () => {
    const teams = teamsCoop2v1();
    expect(alliedSlots(teams, 0)).toEqual([1]);
    expect(alliedSlots(teams, 1)).toEqual([0]);
    expect(enemySlots(teams, 0)).toEqual([2]);
    expect(enemySlots(teams, 1)).toEqual([2]);
    expect(enemySlots(teams, 2).slice().sort()).toEqual([0, 1]);
  });
});

describe("teamsFfa4", () => {
  it("each slot is its own team — no allies", () => {
    const teams = teamsFfa4();
    expect(teams).toHaveLength(4);
    for (let s = 0; s < 4; s++) {
      expect(alliedSlots(teams, s)).toEqual([]);
      expect(enemySlots(teams, s).slice().sort()).toEqual(
        [0, 1, 2, 3].filter((x) => x !== s),
      );
    }
  });
});

describe("nextSlotInOrder", () => {
  it("1v1 alternates 0 ↔ 1", () => {
    expect(nextSlotInOrder(TURN_ORDER_1V1, 0)).toBe(1);
    expect(nextSlotInOrder(TURN_ORDER_1V1, 1)).toBe(0);
  });

  it("2v2 alternating cycles 0 → 1 → 2 → 3 → 0", () => {
    let current = 0;
    const seen: number[] = [];
    for (let i = 0; i < 5; i++) {
      seen.push(current);
      current = nextSlotInOrder(TURN_ORDER_2V2_ALTERNATING, current);
    }
    expect(seen).toEqual([0, 1, 2, 3, 0]);
  });

  it("FFA4 cycles 0 → 1 → 2 → 3 → 0", () => {
    expect(nextSlotInOrder(TURN_ORDER_FFA_4, 3)).toBe(0);
  });

  it("co-op 2v1 cycles through 3 slots", () => {
    expect(nextSlotInOrder(TURN_ORDER_COOP_2V1, 0)).toBe(1);
    expect(nextSlotInOrder(TURN_ORDER_COOP_2V1, 1)).toBe(2);
    expect(nextSlotInOrder(TURN_ORDER_COOP_2V1, 2)).toBe(0);
  });

  it("falls back to first slot if current is out of order", () => {
    const order: TurnOrder = { slots: [1, 2, 3] };
    expect(nextSlotInOrder(order, 99)).toBe(1);
  });
});

describe("custom team configurations", () => {
  it("supports asymmetric teams (3v1)", () => {
    const teams: readonly Team[] = [
      { id: TeamId("heroes"), playerSlots: [0, 1, 2], name: "Heroes" },
      { id: TeamId("boss"), playerSlots: [3], name: "Boss", isAi: true },
    ];
    expect(alliedSlots(teams, 0).slice().sort()).toEqual([1, 2]);
    expect(enemySlots(teams, 0)).toEqual([3]);
    expect(enemySlots(teams, 3).slice().sort()).toEqual([0, 1, 2]);
  });

  it("teamForSlot returns undefined for unassigned slots", () => {
    const teams = teams1v1();
    expect(teamForSlot(teams, 5)).toBeUndefined();
  });
});
