/**
 * Co-op encounter registry + boss AI tests.
 */
import { describe, it, expect } from "vitest";
import {
  COOP_ENCOUNTERS,
  getCoopEncounter,
  listCoopEncounters,
  maxBossHp,
} from "./encounters";
import { nextPendingPhase } from "../ai/coopBossAI";

describe("coop encounter registry", () => {
  it("every encounterKey is unique", () => {
    const seen = new Set<string>();
    for (const e of COOP_ENCOUNTERS) {
      expect(seen.has(e.encounterKey)).toBe(false);
      seen.add(e.encounterKey);
    }
  });

  it("getCoopEncounter round-trips", () => {
    for (const e of COOP_ENCOUNTERS) {
      expect(getCoopEncounter(e.encounterKey)).toBe(e);
    }
  });

  it("listCoopEncounters returns the full catalog", () => {
    expect(listCoopEncounters().length).toBe(COOP_ENCOUNTERS.length);
  });

  it("each encounter has bossDeck of 30 cards", () => {
    for (const e of COOP_ENCOUNTERS) {
      expect(e.bossDeck.length).toBe(30);
    }
  });

  it("each encounter's HP multiplier is highest at mythic", () => {
    for (const e of COOP_ENCOUNTERS) {
      expect(e.bossHpMultiplier.mythic).toBeGreaterThan(e.bossHpMultiplier.heroic);
      expect(e.bossHpMultiplier.heroic).toBeGreaterThan(e.bossHpMultiplier.normal);
    }
  });

  it("each encounter's mana bonus is monotonic", () => {
    for (const e of COOP_ENCOUNTERS) {
      expect(e.bossManaBonus.mythic).toBeGreaterThanOrEqual(e.bossManaBonus.heroic);
      expect(e.bossManaBonus.heroic).toBeGreaterThanOrEqual(e.bossManaBonus.normal);
    }
  });

  it("each encounter's phases are descending by hpFraction", () => {
    for (const e of COOP_ENCOUNTERS) {
      for (let i = 1; i < e.phases.length; i++) {
        expect(e.phases[i].hpFraction).toBeLessThan(e.phases[i - 1].hpFraction);
      }
    }
  });

  it("each encounter has at least one reward", () => {
    for (const e of COOP_ENCOUNTERS) {
      expect(
        e.rewards.dreamTokens > 0 ||
        !!e.rewards.titleKeyOnFirstClear ||
        !!e.rewards.clueDropKey,
      ).toBe(true);
    }
  });
});

describe("maxBossHp", () => {
  it("scales by encounter difficulty", () => {
    const e = COOP_ENCOUNTERS[0];
    const baseHp = 25;
    expect(maxBossHp(baseHp, e, "normal")).toBe(Math.round(baseHp * e.bossHpMultiplier.normal));
    expect(maxBossHp(baseHp, e, "mythic")).toBe(Math.round(baseHp * e.bossHpMultiplier.mythic));
  });
});

describe("nextPendingPhase", () => {
  const e = COOP_ENCOUNTERS[0]; // The Warden Descends — phases at 0.66, 0.33, 0.10

  it("returns null when boss is full HP", () => {
    expect(nextPendingPhase(e, 1.0, new Set())).toBeNull();
  });

  it("returns the highest pending phase when crossed", () => {
    const phase = nextPendingPhase(e, 0.65, new Set());
    expect(phase?.hpFraction).toBe(0.66);
  });

  it("skips already-fired phases", () => {
    const phase = nextPendingPhase(e, 0.30, new Set([0.66]));
    expect(phase?.hpFraction).toBe(0.33);
  });

  it("returns null when all eligible phases have fired", () => {
    expect(nextPendingPhase(e, 0.20, new Set([0.66, 0.33]))).toBeNull();
  });

  it("can return the lowest phase if HP dropped past everything in one tick", () => {
    const phase = nextPendingPhase(e, 0.05, new Set());
    expect(phase?.hpFraction).toBe(0.66);
  });
});
