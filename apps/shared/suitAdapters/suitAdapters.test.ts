import { describe, expect, it } from "vitest";

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import {
  hasInfiltrationSetBonus,
  mergeCircuitSuitBonuses,
  toArkEventModifiers,
  toCasinoModifiers,
  toChessModifiers,
  toDiplomacyModifiers,
  toFightingModifiers,
  toFpsSuitBonuses,
  toInfiltrationModifiers,
  toPetBattleModifiers,
  toTcgPreMatchModifiers,
  toTerminusModifiers,
  toTradeEmpireDealModifiers,
} from "./index";

/**
 * Synthesize an AggregatedBonus entry that mimics the one
 * passiveBonusAggregator produces for a suit-set bonus tier.
 */
function suitBonus(setId: string, pieces: number): AggregatedBonus {
  return {
    source: `suit-set:${setId}`,
    sourceCategory: "suit_set",
    system: "all",
    type: "passive",
    target: "cutscene_silhouette",
    value: 1,
    label: `${setId} (${pieces}pc): test`,
  };
}

/**
 * Build a bonus list that emits every tier up to N pieces for a set,
 * mirroring what getActiveBonusEffects → aggregator would actually
 * produce when N pieces are equipped.
 */
function bonusesUpTo(setId: string, pieces: number): readonly AggregatedBonus[] {
  const out: AggregatedBonus[] = [];
  for (const tier of [2, 4, 7, 10]) {
    if (pieces >= tier) out.push(suitBonus(setId, tier));
  }
  return out;
}

describe("suitAdapters — baseline behavior", () => {
  it("empty bonuses → all-default modifiers", () => {
    const empty: AggregatedBonus[] = [];
    expect(toFightingModifiers(empty).hpBonus).toBe(0);
    expect(toPetBattleModifiers(empty).petDamageMult).toBe(1);
    expect(toTcgPreMatchModifiers(empty).extraCards).toBe(0);
    expect(toTradeEmpireDealModifiers(empty).freeDealReveals).toBe(0);
    expect(toArkEventModifiers(empty).eventRollBonus).toBe(0);
    expect(toCasinoModifiers(empty).vipRoomUnlocked).toBe(false);
    expect(toDiplomacyModifiers(empty).previewDemandUses).toBe(0);
    expect(toChessModifiers(empty).takeBacksPerGame).toBe(0);
    expect(toFpsSuitBonuses(empty).shield_rate_mult).toBe(1);
    expect(toTerminusModifiers(empty).extraStartingTurrets).toBe(0);
  });

  it("ignores non-suit bonuses", () => {
    const noise: AggregatedBonus[] = [
      {
        source: "synergy:fire-water-combo",
        sourceCategory: "synergy",
        system: "all",
        type: "flat",
        target: "damage",
        value: 10,
        label: "Synergy bonus (4pc): red herring",
      },
    ];
    // The "4pc" in the label should NOT be picked up because
    // sourceCategory !== "suit_set".
    expect(toFightingModifiers(noise).hpBonus).toBe(0);
    expect(toFpsSuitBonuses(noise).reload_speed).toBe(1);
  });
});

describe("suitAdapters — fighting", () => {
  it("Bulwark 4pc → +5% HP; below 4pc → no HP", () => {
    expect(toFightingModifiers(bonusesUpTo("bulwark-of-the-eighth-column", 2)).hpBonus).toBe(0);
    expect(toFightingModifiers(bonusesUpTo("bulwark-of-the-eighth-column", 4)).hpBonus).toBeCloseTo(0.05);
    expect(toFightingModifiers(bonusesUpTo("bulwark-of-the-eighth-column", 10)).hpBonus).toBeCloseTo(0.05);
  });

  it("Black-Crepe 4pc → +10% speed", () => {
    expect(toFightingModifiers(bonusesUpTo("black-crepe-weave", 4)).speedBonus).toBeCloseTo(0.1);
  });

  it("Ember-Bellows 7pc → +8% damage", () => {
    expect(toFightingModifiers(bonusesUpTo("ember-bellows-array", 7)).damageBonus).toBeCloseTo(0.08);
    expect(toFightingModifiers(bonusesUpTo("ember-bellows-array", 4)).damageBonus).toBe(0);
  });
});

describe("suitAdapters — tcg", () => {
  it("Oracle 2pc → +1 card in opening hand; 4pc → Foresee unlocks", () => {
    const twoPc = toTcgPreMatchModifiers(
      bonusesUpTo("regalia-of-the-seeing-stylus", 2),
    );
    expect(twoPc.extraCards).toBe(1);
    expect(twoPc.canForesee).toBe(false);
    const fourPc = toTcgPreMatchModifiers(
      bonusesUpTo("regalia-of-the-seeing-stylus", 4),
    );
    expect(fourPc.canForesee).toBe(true);
  });
});

describe("suitAdapters — pet battles", () => {
  it("inherits 50% of the operator's damage bonus", () => {
    const fullEmber = bonusesUpTo("ember-bellows-array", 10);
    const mods = toPetBattleModifiers(fullEmber);
    expect(mods.petDamageMult).toBeCloseTo(1 + 0.08 * 0.5);
  });
});

describe("suitAdapters — casino + chess + diplomacy", () => {
  it("Dicewright 10pc unlocks the VIP room + chess cosmetics + one takeback", () => {
    const full = bonusesUpTo("dicewrights-motley", 10);
    expect(toCasinoModifiers(full).vipRoomUnlocked).toBe(true);
    expect(toChessModifiers(full).takeBacksPerGame).toBe(1);
    expect(toChessModifiers(full).cosmeticBoardSkinId).toBe("dicewrights-motley");
  });

  it("Oracle 10pc → preview-next-demand use in diplomacy", () => {
    expect(
      toDiplomacyModifiers(bonusesUpTo("regalia-of-the-seeing-stylus", 10))
        .previewDemandUses,
    ).toBe(1);
  });
});

describe("suitAdapters — infiltration", () => {
  it("reports equipped tiers for each known set", () => {
    const mix = [
      ...bonusesUpTo("low-profile-tailoring", 4),
      ...bonusesUpTo("pressure-loom-harness", 7),
    ];
    const mods = toInfiltrationModifiers(mix);
    expect(mods.equippedTiers["low-profile-tailoring"]).toBe(4);
    expect(mods.equippedTiers["pressure-loom-harness"]).toBe(7);
    expect(hasInfiltrationSetBonus(mods, "low-profile-tailoring", 4)).toBe(true);
    expect(hasInfiltrationSetBonus(mods, "low-profile-tailoring", 7)).toBe(false);
  });
});

describe("suitAdapters — CADES FPS", () => {
  it("Mourner's Coat 10pc multiplies shield rate", () => {
    const full = bonusesUpTo("the-mourners-coat", 10);
    expect(toFpsSuitBonuses(full).shield_rate_mult).toBeCloseTo(1.15);
  });
  it("Soldier 2pc improves reload speed", () => {
    const twoPc = bonusesUpTo("bulwark-of-the-eighth-column", 2);
    expect(toFpsSuitBonuses(twoPc).reload_speed).toBeCloseTo(1.1);
  });
});

describe("suitAdapters — Dead Man's Circuit", () => {
  it("applies bonuses on top of a baseline player_clone without mutating it", () => {
    const baseline = {
      neural_sync: 5,
      physical_integrity: 5,
      velocity_ceiling: 5,
      surface_grip: 5,
      survival_instinct: 5,
    };
    const merged = mergeCircuitSuitBonuses(baseline, [
      ...bonusesUpTo("pressure-loom-harness", 4),
      ...bonusesUpTo("black-crepe-weave", 7),
      ...bonusesUpTo("null-weaver-mantle", 10),
    ]);
    expect(merged.physical_integrity).toBe(6);
    expect(merged.velocity_ceiling).toBe(6);
    expect(merged.survival_instinct).toBe(6);
    // Unmutated baseline.
    expect(baseline.physical_integrity).toBe(5);
  });
});

describe("suitAdapters — Terminus Swarm", () => {
  it("Engineer 10pc grants +1 starting turret", () => {
    const mods = toTerminusModifiers(
      bonusesUpTo("pressure-loom-harness", 10),
    );
    expect(mods.extraStartingTurrets).toBe(1);
    expect(mods.startingCurrency).toBe(50);
  });
  it("Arcane 7pc slows the virus tick", () => {
    expect(
      toTerminusModifiers(bonusesUpTo("arcane-rune-regalia", 7))
        .virusTickReduction,
    ).toBeCloseTo(0.9);
  });
});

describe("suitAdapters — ark events + trade empire", () => {
  it("Oracle 7pc gives +5 to event roll and reroll-on-min", () => {
    const mods = toArkEventModifiers(
      bonusesUpTo("regalia-of-the-seeing-stylus", 7),
    );
    expect(mods.eventRollBonus).toBe(5);
    expect(mods.rerollOnMin).toBe(true);
  });

  it("Spy 4pc reveals one extra trade-empire tile", () => {
    expect(
      toTradeEmpireDealModifiers(bonusesUpTo("low-profile-tailoring", 4))
        .extraVisibleTiles,
    ).toBe(1);
  });
});
