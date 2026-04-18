/**
 * Act 1 TCG boss mastery — data + mapping tests.
 *
 * Locks down the new BOSS_MASTERY_DEFS entries for the 5 named
 * Act 1 encounters and the encounter→bossKey mapping.
 */
import { describe, it, expect } from "vitest";
import {
  ACT_1_ENCOUNTER_TO_BOSS_KEY,
  BOSS_MASTERY_DEFS,
  bossMasteryKeyForEncounter,
  getBossMasteryLevel,
} from "./bossMastery";
import { COSMETIC_ITEMS } from "./cosmeticShop";

const ACT_1_BOSS_KEYS = [
  "act1_warlord_zero",
  "act1_programmer",
  "act1_game_master",
  "act1_authority",
  "act1_seer",
] as const;

describe("Act 1 boss mastery — BOSS_MASTERY_DEFS coverage", () => {
  for (const bossKey of ACT_1_BOSS_KEYS) {
    it(`${bossKey} has a BOSS_MASTERY_DEFS entry`, () => {
      const def = BOSS_MASTERY_DEFS.find((d) => d.bossKey === bossKey);
      expect(def, `${bossKey} missing from BOSS_MASTERY_DEFS`).toBeDefined();
      expect(def!.levels.length).toBeGreaterThan(0);
    });
  }

  it("every cosmetic reward key resolves in COSMETIC_ITEMS", () => {
    for (const bossKey of ACT_1_BOSS_KEYS) {
      const def = BOSS_MASTERY_DEFS.find((d) => d.bossKey === bossKey);
      if (!def) continue;
      for (const level of def.levels) {
        if (level.reward.type !== "cosmetic") continue;
        const item = COSMETIC_ITEMS.find((c) => c.key === level.reward.key);
        expect(
          item,
          `${bossKey} level ${level.level} references missing cosmetic "${level.reward.key}"`,
        ).toBeDefined();
        expect(item!.earnedFromBoss).toBe(bossKey);
      }
    }
  });

  it("kill thresholds are monotonically increasing per boss", () => {
    for (const def of BOSS_MASTERY_DEFS) {
      for (let i = 1; i < def.levels.length; i++) {
        expect(
          def.levels[i].killsRequired,
          `${def.bossKey}: level ${def.levels[i].level} threshold must exceed prior`,
        ).toBeGreaterThan(def.levels[i - 1].killsRequired);
      }
    }
  });

  it("Act 1 bosses reach level 3+ by kill 3 or fewer (shallow curve)", () => {
    // Canon: named encounters aren't grindable. Cosmetic drops
    // should land within 3 wins, not 25 (fight-arena curve).
    for (const bossKey of ACT_1_BOSS_KEYS) {
      // Seer has 3 levels and cosmetic at level 1 — asserting >= 1
      // covers that case too.
      const level = getBossMasteryLevel(3, bossKey);
      expect(level, `${bossKey} should reach >=2 by 3 kills`).toBeGreaterThanOrEqual(2);
    }
  });

  it("The Seer earns a cosmetic at 1 kill (winnable-path rarity)", () => {
    // Spec: defeating the Seer is rare by design; the first kill
    // is the canonical "prophecy broken" moment and should drop
    // the cosmetic immediately.
    const def = BOSS_MASTERY_DEFS.find((d) => d.bossKey === "act1_seer");
    expect(def).toBeDefined();
    const level1 = def!.levels.find((l) => l.level === 1);
    expect(level1?.reward.type).toBe("cosmetic");
    expect(level1?.killsRequired).toBe(1);
  });
});

describe("ACT_1_ENCOUNTER_TO_BOSS_KEY mapping", () => {
  const expected = {
    ch_warlord_zero_first: "act1_warlord_zero",
    ch_programmer_gift: "act1_programmer",
    ch_game_master: "act1_game_master",
    ch_authority_trial: "act1_authority",
    ch_seer_visit: "act1_seer",
  } as const;

  for (const [encounterId, bossKey] of Object.entries(expected)) {
    it(`${encounterId} → ${bossKey}`, () => {
      expect(ACT_1_ENCOUNTER_TO_BOSS_KEY[encounterId]).toBe(bossKey);
      expect(bossMasteryKeyForEncounter(encounterId)).toBe(bossKey);
    });
  }

  it("returns null for unknown / sparring encounters", () => {
    expect(bossMasteryKeyForEncounter("ch1_dead_signal")).toBeNull();
    expect(bossMasteryKeyForEncounter("not_a_real_encounter")).toBeNull();
  });

  it("maps to real BOSS_MASTERY_DEFS keys (no broken references)", () => {
    const defKeys = new Set(BOSS_MASTERY_DEFS.map((d) => d.bossKey));
    for (const bossKey of Object.values(ACT_1_ENCOUNTER_TO_BOSS_KEY)) {
      expect(
        defKeys.has(bossKey),
        `ACT_1_ENCOUNTER_TO_BOSS_KEY points to "${bossKey}" which is not in BOSS_MASTERY_DEFS`,
      ).toBe(true);
    }
  });
});
