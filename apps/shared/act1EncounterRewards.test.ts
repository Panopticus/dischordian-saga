/**
 * Act 1 encounter rewards — structural + coverage tests.
 *
 * The rewards table (act1EncounterRewards.ts) is the single source
 * of truth for `(encounter, outcome) → campaign delta` mappings.
 * These tests lock down:
 *   1. Every named boss has both a win AND loss row.
 *   2. Rows reference real narrative flags (string shape).
 *   3. The named-boss list matches the table's keys for the 5
 *      canon bosses.
 *   4. Lookup helper returns defined rows and undefined for
 *      unknown encounters.
 */
import { describe, it, expect } from "vitest";
import {
  ACT_1_ENCOUNTER_REWARDS,
  ACT_1_NAMED_BOSS_ENCOUNTERS,
  getEncounterReward,
} from "./act1EncounterRewards";

describe("ACT_1_ENCOUNTER_REWARDS — named boss coverage", () => {
  for (const encounterId of ACT_1_NAMED_BOSS_ENCOUNTERS) {
    it(`${encounterId} has a win row`, () => {
      const row = ACT_1_ENCOUNTER_REWARDS[encounterId];
      expect(row, `${encounterId} missing from rewards table`).toBeDefined();
      expect(row?.win, `${encounterId} missing win row`).toBeDefined();
    });

    it(`${encounterId} has a loss row`, () => {
      const row = ACT_1_ENCOUNTER_REWARDS[encounterId];
      expect(row?.loss, `${encounterId} missing loss row`).toBeDefined();
    });
  }

  it("ACT_1_NAMED_BOSS_ENCOUNTERS is exactly the 5 canonical bosses", () => {
    expect([...ACT_1_NAMED_BOSS_ENCOUNTERS].sort()).toEqual(
      [
        "ch_authority_trial",
        "ch_game_master",
        "ch_programmer_gift",
        "ch_seer_visit",
        "ch_warlord_zero_first",
      ].sort(),
    );
  });

  it("every table key is also listed as a named boss (no orphans)", () => {
    const tableKeys = Object.keys(ACT_1_ENCOUNTER_REWARDS).sort();
    const named = [...ACT_1_NAMED_BOSS_ENCOUNTERS].sort();
    expect(tableKeys).toEqual(named);
  });
});

describe("ACT_1_ENCOUNTER_REWARDS — flag shape", () => {
  it("all authored flagsToSet entries start with the act1_ namespace", () => {
    for (const [encounterId, rows] of Object.entries(ACT_1_ENCOUNTER_REWARDS)) {
      for (const outcome of ["win", "loss"] as const) {
        const row = rows[outcome];
        if (!row?.flagsToSet) continue;
        for (const flag of row.flagsToSet) {
          expect(
            flag.startsWith("act1_"),
            `${encounterId}.${outcome} flag "${flag}" must start with act1_`,
          ).toBe(true);
        }
      }
    }
  });

  it("narratorBondDelta values are in the legal -5..+5 range", () => {
    for (const [encounterId, rows] of Object.entries(ACT_1_ENCOUNTER_REWARDS)) {
      for (const outcome of ["win", "loss"] as const) {
        const row = rows[outcome];
        if (row?.narratorBondDelta === undefined) continue;
        expect(
          Math.abs(row.narratorBondDelta),
          `${encounterId}.${outcome} bond delta ${row.narratorBondDelta} out of range`,
        ).toBeLessThanOrEqual(5);
      }
    }
  });

  it("win rows grant >= as much bond as loss rows for every named boss", () => {
    // Canon: winning an Act 1 encounter should not yield less bond
    // than losing it. Equal is fine (§5.5 Warlord was always lossy
    // under spec); winning strictly less would invert the bond
    // economy.
    for (const encounterId of ACT_1_NAMED_BOSS_ENCOUNTERS) {
      const rows = ACT_1_ENCOUNTER_REWARDS[encounterId];
      const winDelta = rows?.win?.narratorBondDelta ?? 0;
      const lossDelta = rows?.loss?.narratorBondDelta ?? 0;
      expect(
        winDelta,
        `${encounterId}: win bond ${winDelta} < loss bond ${lossDelta}`,
      ).toBeGreaterThanOrEqual(lossDelta);
    }
  });
});

describe("getEncounterReward", () => {
  it("returns the win row for a known encounter", () => {
    const row = getEncounterReward("ch_warlord_zero_first", "win");
    expect(row).toBeDefined();
    expect(row?.flagsToSet).toContain("act1_warlord_zero_defeated");
  });

  it("returns the loss row for a known encounter", () => {
    const row = getEncounterReward("ch_warlord_zero_first", "loss");
    expect(row).toBeDefined();
    expect(row?.flagsToSet).toContain("act1_warlord_zero_escaped");
  });

  it("returns undefined for an unknown encounter", () => {
    expect(getEncounterReward("ch1_dead_signal", "win")).toBeUndefined();
    expect(getEncounterReward("not_a_real_encounter", "loss")).toBeUndefined();
  });
});
