import { describe, it, expect } from "vitest";
import { MAX_STAT, STAT_ORDER, distributeCrewXp } from "./crewXpCredit";
import type { CrewState, SerializedCrewMember } from "./crewPersistence";
import { createDefaultCrewState } from "./crewPersistence";

const mkMember = (over: Partial<SerializedCrewMember> = {}): SerializedCrewMember => ({
  id: "m1",
  name: "n",
  nickname: null,
  species: "human",
  gender: "female",
  bloodlineId: "iron_memory",
  generation: 1,
  parentIds: null,
  children: [],
  geneticTraits: [],
  role: null,
  stats: {
    resilience: 50, intellect: 50, reflexes: 50, empathy: 50, immunity: 50, adaptability: 50,
  },
  morale: 50,
  health: 100,
  loyalty: 50,
  status: "active",
  age: 20,
  maxAge: 80,
  missionHistory: [],
  relationships: {},
  birthCycle: 0,
  ...over,
});

const stateWith = (...members: SerializedCrewMember[]): CrewState => {
  const s = createDefaultCrewState();
  return { ...s, roster: { ...s.roster, members } };
};

describe("crewXpCredit — STAT_ORDER", () => {
  it("ships the canonical six stats in canonical order", () => {
    expect(STAT_ORDER).toEqual([
      "resilience", "intellect", "reflexes",
      "empathy", "immunity", "adaptability",
    ]);
  });
});

describe("crewXpCredit — distributeCrewXp", () => {
  it("returns applied: 0 when amount <= 0", () => {
    const state = stateWith(mkMember());
    expect(distributeCrewXp(state, 0).applied).toBe(0);
    expect(distributeCrewXp(state, -1).applied).toBe(0);
  });

  it("returns applied: 0 with no active crew", () => {
    const result = distributeCrewXp(stateWith(), 75);
    expect(result.applied).toBe(0);
    expect(result.perMember).toEqual([]);
  });

  it("does not mutate the original state", () => {
    const member = mkMember({ id: "m1" });
    const state = stateWith(member);
    distributeCrewXp(state, 12);
    expect(state.roster.members[0].stats.resilience).toBe(50);
  });

  it("on a single active member with capacity, applies the full amount", () => {
    const result = distributeCrewXp(stateWith(mkMember()), 12);
    expect(result.applied).toBe(12);
    const m = result.state.roster.members[0];
    // Round-robin: 12 / 6 = exactly 2 per stat
    expect(m.stats.resilience).toBe(52);
    expect(m.stats.intellect).toBe(52);
    expect(m.stats.reflexes).toBe(52);
    expect(m.stats.empathy).toBe(52);
    expect(m.stats.immunity).toBe(52);
    expect(m.stats.adaptability).toBe(52);
  });

  it("applies remainders to the leading stats first (deterministic)", () => {
    const result = distributeCrewXp(stateWith(mkMember()), 14);
    // 14 = 6 + 6 + 2 — so resilience and intellect each get one extra.
    const m = result.state.roster.members[0];
    expect(m.stats.resilience).toBe(53);
    expect(m.stats.intellect).toBe(53);
    expect(m.stats.reflexes).toBe(52);
    expect(m.stats.adaptability).toBe(52);
  });

  it("evenly splits across multiple active members; remainder to leading members", () => {
    const result = distributeCrewXp(stateWith(
      mkMember({ id: "a" }),
      mkMember({ id: "b" }),
      mkMember({ id: "c" }),
      mkMember({ id: "d" }),
    ), 75);
    // 75 / 4 = 18 each, remainder 3 — first three members get 19, fourth gets 18
    const shares = result.perMember.map(p => p.applied);
    expect(shares).toEqual([19, 19, 19, 18]);
    expect(result.applied).toBe(75);
  });

  it("excludes non-active members from the split", () => {
    const result = distributeCrewXp(stateWith(
      mkMember({ id: "a", status: "active" }),
      mkMember({ id: "b", status: "injured" }),
      mkMember({ id: "c", status: "active" }),
    ), 12);
    const ids = result.perMember.map(p => p.memberId);
    expect(ids).toEqual(["a", "c"]);
    expect(result.applied).toBe(12);
  });

  it("caps individual stats at MAX_STAT and discards leftover that can't fit", () => {
    const member = mkMember({
      stats: { resilience: 100, intellect: 100, reflexes: 100,
               empathy: 100, immunity: 100, adaptability: 99 },
    });
    const result = distributeCrewXp(stateWith(member), 50);
    // Only one slot of capacity (adaptability) — only 1 point applied total.
    expect(result.applied).toBe(1);
    expect(result.state.roster.members[0].stats.adaptability).toBe(100);
  });

  it("returns the same state reference when nothing was applied", () => {
    const allCapped = mkMember({
      stats: { resilience: 100, intellect: 100, reflexes: 100,
               empathy: 100, immunity: 100, adaptability: 100 },
    });
    const state = stateWith(allCapped);
    const result = distributeCrewXp(state, 75);
    expect(result.applied).toBe(0);
    expect(result.state).toBe(state);
  });

  it("perMember.bumps sums to perMember.applied for every member", () => {
    const result = distributeCrewXp(stateWith(
      mkMember({ id: "a" }), mkMember({ id: "b" }),
    ), 41);
    for (const pm of result.perMember) {
      const sum = STAT_ORDER.reduce((acc, s) => acc + pm.bumps[s], 0);
      expect(sum).toBe(pm.applied);
    }
  });
});

describe("crewXpCredit — MAX_STAT", () => {
  it("matches the engine's canonical stat ceiling (100)", () => {
    expect(MAX_STAT).toBe(100);
  });
});
