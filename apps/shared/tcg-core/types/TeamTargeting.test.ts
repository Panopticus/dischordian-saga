/**
 * Team-aware targeting selector tests.
 */
import { describe, it, expect } from "vitest";
import {
  resolveTeamSelector,
  isAllyOf,
  isEnemyOf,
  filterByController,
} from "./TeamTargeting";
import { teams1v1, teams2v2, teamsCoop2v1, teamsFfa4 } from "./Teams";

describe("isAllyOf / isEnemyOf", () => {
  it("self counts as ally, not enemy", () => {
    expect(isAllyOf(0, 0, teams1v1())).toBe(true);
    expect(isEnemyOf(0, 0, teams1v1())).toBe(false);
  });

  it("1v1: opposing slots are enemies, not allies", () => {
    const t = teams1v1();
    expect(isAllyOf(0, 1, t)).toBe(false);
    expect(isEnemyOf(0, 1, t)).toBe(true);
  });

  it("2v2: teammate is ally, opposing pair are enemies", () => {
    const t = teams2v2(); // team_a [0,2], team_b [1,3]
    expect(isAllyOf(0, 2, t)).toBe(true);
    expect(isAllyOf(0, 1, t)).toBe(false);
    expect(isAllyOf(0, 3, t)).toBe(false);
    expect(isEnemyOf(0, 1, t)).toBe(true);
    expect(isEnemyOf(0, 3, t)).toBe(true);
  });

  it("FFA: every other slot is enemy", () => {
    const t = teamsFfa4();
    for (let other = 1; other < 4; other++) {
      expect(isEnemyOf(0, other, t)).toBe(true);
      expect(isAllyOf(0, other, t)).toBe(false);
    }
  });

  it("co-op: humans ally each other, AI is enemy of both", () => {
    const t = teamsCoop2v1();
    expect(isAllyOf(0, 1, t)).toBe(true);
    expect(isEnemyOf(0, 2, t)).toBe(true);
    expect(isEnemyOf(1, 2, t)).toBe(true);
    expect(isAllyOf(2, 0, t)).toBe(false);
  });
});

describe("resolveTeamSelector — 1v1", () => {
  const t = teams1v1();

  it("self → [actor]", () => {
    expect(resolveTeamSelector("self", 0, t)).toEqual([0]);
  });

  it("ally_general / all_allies are empty in 1v1", () => {
    expect(resolveTeamSelector("ally_general", 0, t)).toEqual([]);
    expect(resolveTeamSelector("all_allies", 0, t)).toEqual([]);
  });

  it("enemy_team_generals returns the single opponent", () => {
    expect(resolveTeamSelector("enemy_team_generals", 0, t)).toEqual([1]);
    expect(resolveTeamSelector("enemy_team_generals", 1, t)).toEqual([0]);
  });

  it("self_or_allies is just [self] in 1v1", () => {
    expect(resolveTeamSelector("self_or_allies", 0, t)).toEqual([0]);
  });
});

describe("resolveTeamSelector — 2v2", () => {
  const t = teams2v2();

  it("ally_general returns the teammate", () => {
    expect(resolveTeamSelector("ally_general", 0, t)).toEqual([2]);
    expect(resolveTeamSelector("ally_general", 1, t)).toEqual([3]);
  });

  it("enemy_team_generals returns both opposing slots", () => {
    expect([...resolveTeamSelector("enemy_team_generals", 0, t)].sort()).toEqual([1, 3]);
    expect([...resolveTeamSelector("enemy_team_generals", 1, t)].sort()).toEqual([0, 2]);
  });

  it("self_or_allies includes both teammates", () => {
    expect([...resolveTeamSelector("self_or_allies", 0, t)].sort()).toEqual([0, 2]);
  });

  it("all_enemies covers the opposing team only", () => {
    expect([...resolveTeamSelector("all_enemies", 0, t)].sort()).toEqual([1, 3]);
  });
});

describe("resolveTeamSelector — co-op vs AI boss", () => {
  const t = teamsCoop2v1();

  it("humans see each other as allies", () => {
    expect(resolveTeamSelector("ally_general", 0, t)).toEqual([1]);
    expect(resolveTeamSelector("ally_general", 1, t)).toEqual([0]);
  });

  it("humans see boss as enemy", () => {
    expect(resolveTeamSelector("enemy_team_generals", 0, t)).toEqual([2]);
  });

  it("boss sees both humans as enemies", () => {
    expect([...resolveTeamSelector("all_enemies", 2, t)].sort()).toEqual([0, 1]);
  });
});

describe("filterByController", () => {
  const t2 = teams2v2();
  const ownerSlots = [0, 1, 2, 3];

  it("'self' keeps only actor's units", () => {
    expect(filterByController("self", ownerSlots, 0, t2)).toEqual([0]);
  });

  it("'ally' keeps actor + teammates", () => {
    expect([...filterByController("ally", ownerSlots, 0, t2)].sort()).toEqual([0, 2]);
  });

  it("'enemy' keeps only opposing-team units", () => {
    expect([...filterByController("enemy", ownerSlots, 0, t2)].sort()).toEqual([1, 3]);
  });

  it("'opponent' (legacy) keeps every non-actor — includes allies in 2v2", () => {
    // This is the documented 1v1 behavior preserved for legacy compat.
    expect([...filterByController("opponent", ownerSlots, 0, t2)].sort()).toEqual([1, 2, 3]);
  });

  it("'any' / undefined returns the input unchanged", () => {
    expect(filterByController("any", ownerSlots, 0, t2)).toEqual(ownerSlots);
    expect(filterByController(undefined, ownerSlots, 0, t2)).toEqual(ownerSlots);
  });
});
