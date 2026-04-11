/* ═══════════════════════════════════════════════════════
   Tests for the Christmas in July crew holiday bonus
   aggregator. Exercises de-duplication, status filtering,
   and multi-member stacking rules.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  computeCrewHolidayBonus, applyTokenBonuses, EMPTY_HOLIDAY_BONUS,
} from "./christmasCrewBonuses";
import { createDefaultCrewState, type CrewState, type SerializedCrewMember } from "./crewPersistence";

function makeMember(overrides: Partial<SerializedCrewMember>): SerializedCrewMember {
  return {
    id: "m1",
    name: "Test Crew",
    gender: "non-binary",
    species: "demagi",
    bloodlineId: "void_resonance",
    generation: 1,
    parentIds: null,
    bornAt: 0,
    age: 20,
    role: null,
    stats: { resilience: 5, intellect: 5, reflexes: 5, empathy: 5, immunity: 5, adaptability: 5 },
    health: 100,
    loyalty: 50,
    morale: 50,
    status: "active",
    relationshipIds: [],
    traits: [],
    injuryIds: [],
    ...overrides,
  } as SerializedCrewMember;
}

function makeState(members: SerializedCrewMember[]): CrewState {
  const state = createDefaultCrewState();
  state.roster.members = members;
  return state;
}

describe("computeCrewHolidayBonus", () => {
  it("returns the empty bonus for an undefined state", () => {
    expect(computeCrewHolidayBonus(undefined)).toEqual(EMPTY_HOLIDAY_BONUS);
  });

  it("returns the empty bonus for an empty roster", () => {
    expect(computeCrewHolidayBonus(makeState([]))).toEqual(EMPTY_HOLIDAY_BONUS);
  });

  it("applies a single bloodline + role bonus to one member", () => {
    const state = makeState([
      makeMember({ id: "m1", bloodlineId: "iron_memory", role: "comms_officer" }),
    ]);
    const bonus = computeCrewHolidayBonus(state);
    expect(bonus.tokenMultiplier).toBeCloseTo(0.15); // 0.10 + 0.05
    expect(bonus.giftBonusTokens).toBe(0);
    expect(bonus.sourceBloodlines).toEqual(["iron_memory"]);
    expect(bonus.sourceRoles).toEqual(["comms_officer"]);
    expect(bonus.contributingMemberIds).toEqual(["m1"]);
  });

  it("does not double-count a bloodline across duplicate members", () => {
    const state = makeState([
      makeMember({ id: "m1", bloodlineId: "blood_weave", role: "trader" }),
      makeMember({ id: "m2", bloodlineId: "blood_weave", role: "medic" }),
    ]);
    const bonus = computeCrewHolidayBonus(state);
    // blood_weave gives +3 bonus tokens once; trader +1; medic +1 = 5
    expect(bonus.giftBonusTokens).toBe(5);
    expect(bonus.sourceBloodlines).toEqual(["blood_weave"]);
    expect(bonus.sourceRoles.sort()).toEqual(["medic", "trader"]);
  });

  it("ignores non-active members", () => {
    const state = makeState([
      makeMember({ id: "m1", bloodlineId: "iron_memory", role: "comms_officer", status: "dead" }),
      makeMember({ id: "m2", bloodlineId: "void_resonance", role: null, status: "active" }),
    ]);
    const bonus = computeCrewHolidayBonus(state);
    // Only m2 contributes — iron_memory / comms_officer are skipped
    expect(bonus.tokenMultiplier).toBe(0);
    expect(bonus.giftBonusTokens).toBe(2);
    expect(bonus.sourceBloodlines).toEqual(["void_resonance"]);
    expect(bonus.sourceRoles).toEqual([]);
  });

  it("stacks multiple distinct bloodlines + roles", () => {
    const state = makeState([
      makeMember({ id: "m1", bloodlineId: "iron_memory",    role: "comms_officer" }),
      makeMember({ id: "m2", bloodlineId: "echo_synthesis", role: "navigator" }),
      makeMember({ id: "m3", bloodlineId: "void_resonance", role: "trader" }),
    ]);
    const bonus = computeCrewHolidayBonus(state);
    // iron_memory 10% + echo_synthesis 10% + comms_officer 5% = 25%
    expect(bonus.tokenMultiplier).toBeCloseTo(0.25);
    // void_resonance +2 + navigator +2 + trader +1 = 5
    expect(bonus.giftBonusTokens).toBe(5);
  });
});

describe("applyTokenBonuses", () => {
  it("returns the base value when no bonus is present", () => {
    expect(applyTokenBonuses(10, EMPTY_HOLIDAY_BONUS)).toBe(10);
  });

  it("multiplies, then adds flat tokens", () => {
    const bonus = { ...EMPTY_HOLIDAY_BONUS, tokenMultiplier: 0.20, giftBonusTokens: 3 };
    // 10 * 1.20 = 12, +3 = 15
    expect(applyTokenBonuses(10, bonus)).toBe(15);
  });

  it("rounds the multiplied base before adding flats", () => {
    const bonus = { ...EMPTY_HOLIDAY_BONUS, tokenMultiplier: 0.15, giftBonusTokens: 1 };
    // 7 * 1.15 = 8.05 → round to 8, +1 = 9
    expect(applyTokenBonuses(7, bonus)).toBe(9);
  });
});
