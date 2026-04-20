/* ═══════════════════════════════════════════════════════
   PASSIVE BONUS AGGREGATOR

   Single entry point that consolidates every passive bonus
   system scattered across shared/. Given a player's state,
   returns a flat list of active bonuses + aggregate multipliers
   for each game system.

   This replaces the habit of importing systems ad-hoc into
   whichever component happens to need them — now each system
   is plugged in here, and any page that needs bonuses calls
   getAllActiveBonuses(state).

   Adding a new passive system:
     1. Import it here
     2. Add its resolver to the SYSTEMS list below
     3. Bonuses automatically flow to every consumer
   ═══════════════════════════════════════════════════════ */

import type { CitizenData } from "@shared/citizenTraits";
import { resolveSynergies } from "@shared/synergyBonuses";
import { resolveTalentEffects, getAvailableTalents, getTalentSlots } from "@shared/citizenTalents";
import { resolveCivilSkillBonuses } from "@shared/civilSkills";
import { getMasteryRank, getUnlockedPerks } from "@shared/classMastery";
import { findCombo, getElementAdvantages } from "@shared/elementalCombos";
import { calculateGearStats } from "@shared/equipmentStats";
import { computeCreationModifiers, getEndingBias, type CreationSignature } from "@shared/characterCreationImpact";
import { resolveCompanionBonuses, type CompanionId } from "@shared/companionSynergies";
import { getActiveBonusEffects, type BonusEffect } from "@shared/suitBonuses";

/* ─── UNIFIED BONUS SHAPE ─── */

export type GameSystem =
  | "fight" | "card_game" | "trade_empire" | "chess" | "quest"
  | "guild_war" | "crafting" | "all";

export interface AggregatedBonus {
  source: string;          // "synergy:fire-water-combo" | "talent:hp-boost" | etc
  sourceCategory: string;  // "synergy" | "talent" | "mastery" | "equipment" | "creation" | "civil_skill" | "companion" | "combo"
  system: GameSystem;
  type: "multiplier" | "flat" | "passive" | "unlock";
  target: string;
  value: number;
  label: string;
}

/* ─── PLAYER STATE INPUT ─── */

export interface PlayerStateForBonuses {
  citizen: CitizenData;
  /** Level of each civil skill (by key) */
  civilSkillLevels?: Record<string, number>;
  /** Class XP total */
  classXp?: number;
  /** Selected talent IDs */
  selectedTalentIds?: string[];
  /** Gear equipped (for equipment stats) */
  gear?: Record<string, unknown> | null;
  /** Active companions (by id) + relationship levels */
  companions?: Array<{ id: CompanionId; relationshipLevel: number }>;
  /** Player morality score (-100 to +100) */
  morality?: number;
  /** For elemental combo resolution: partner element if any */
  partnerElement?: string;
  /**
   * Section G — equipped-piece counts per suit set id.
   * Example: { "regalia-of-the-seeing-stylus": 4, "ember-bellows-array": 2 }.
   * Read by the suit-set resolver below; missing = no suit bonuses active.
   */
  equippedSuitCounts?: Readonly<Record<string, number>>;
}

/**
 * Map a suitBonuses BonusTarget to the aggregator's GameSystem so
 * consumers can filter by the field they actually read. Unknown
 * targets fall through to "all".
 */
function systemForSuitTarget(t: BonusEffect["target"]): GameSystem {
  switch (t) {
    case "tcg_encounter":
    case "boss_encounter":
      return "card_game";
    case "ark_event_roll":
      return "quest";
    case "crafting_success":
      return "crafting";
    case "dialog_check":
    case "dice_roll":
    case "casino_cap":
    case "shop_price":
    case "cutscene_silhouette":
    default:
      return "all";
  }
}

/* ─── MAIN AGGREGATOR ─── */

/**
 * Resolve all passive bonuses for the current player state.
 * Returns a flat list of AggregatedBonus entries. Safe to call
 * anywhere — skips any subsystem whose inputs are missing.
 */
export function getPassiveBonuses(state: PlayerStateForBonuses): AggregatedBonus[] {
  const bonuses: AggregatedBonus[] = [];
  const { citizen } = state;

  // 1. Hidden synergy bonuses (species × class × element × alignment)
  try {
    const resolved = resolveSynergies(citizen);
    for (const syn of resolved) {
      for (const eff of syn.effects) {
        bonuses.push({
          source: `synergy:${syn.synergy.key}`,
          sourceCategory: "synergy",
          system: (eff.system as GameSystem) ?? "all",
          type: eff.type as any,
          target: eff.target,
          value: eff.value,
          label: `${syn.synergy.name}: ${eff.label}`,
        });
      }
    }
  } catch { /* missing data, skip */ }

  // 2. Milestone talents (levels 5/10/15/20)
  try {
    if (state.selectedTalentIds && state.selectedTalentIds.length > 0) {
      const effects = resolveTalentEffects(state.selectedTalentIds, "all");
      for (const eff of effects) {
        bonuses.push({
          source: `talent:${eff.target}`,
          sourceCategory: "talent",
          system: (eff.system as GameSystem) ?? "all",
          type: eff.type as any,
          target: eff.target,
          value: eff.value,
          label: eff.label ?? `Talent: ${eff.target}`,
        });
      }
    }
  } catch { /* skip */ }

  // 3. Civil skill bonuses
  try {
    if (state.civilSkillLevels) {
      const civilBonuses = resolveCivilSkillBonuses(state.civilSkillLevels, "all");
      for (const b of civilBonuses) {
        bonuses.push({
          source: `civil_skill:${b.target}`,
          sourceCategory: "civil_skill",
          system: (b.system as GameSystem) ?? "all",
          type: b.type as any,
          target: b.target,
          value: b.value,
          label: b.label ?? `${b.target} Lv${b.level}`,
        });
      }
    }
  } catch { /* skip */ }

  // 4. Class mastery perks
  try {
    if (state.classXp !== undefined && citizen.characterClass) {
      const rank = getMasteryRank(state.classXp);
      const perks = getUnlockedPerks(citizen.characterClass as any, rank);
      for (const perk of perks) {
        bonuses.push({
          source: `mastery:${perk.key}`,
          sourceCategory: "mastery",
          system: "all",
          type: "passive",
          target: perk.key,
          value: 1,
          label: `Mastery Rank ${rank}: ${perk.name}`,
        });
      }
    }
  } catch { /* skip */ }

  // 5. Equipment stats
  try {
    if (state.gear) {
      const gearStats = calculateGearStats(state.gear);
      for (const [stat, val] of Object.entries(gearStats)) {
        if (typeof val === "number" && val !== 0) {
          bonuses.push({
            source: "equipment",
            sourceCategory: "equipment",
            system: "all",
            type: "flat",
            target: stat,
            value: val,
            label: `Equipment ${stat}: +${val}`,
          });
        }
      }
    }
  } catch { /* skip */ }

  // 6. Creation signature modifiers
  try {
    const sig: CreationSignature = {
      species: citizen.species as any,
      element: citizen.element as any,
      alignment: citizen.alignment as any,
      characterClass: citizen.characterClass as any,
    };
    const mods = computeCreationModifiers(sig);
    bonuses.push(
      { source: "creation:element_damage", sourceCategory: "creation", system: "fight", type: "multiplier", target: "element_damage", value: mods.elementDamageBonus, label: `+${(mods.elementDamageBonus * 100).toFixed(0)}% ${citizen.element} damage` },
      { source: "creation:element_resist", sourceCategory: "creation", system: "fight", type: "multiplier", target: "element_resist", value: mods.elementResistance, label: `-${(mods.elementResistance * 100).toFixed(0)}% resist ${citizen.element}` },
      { source: "creation:trust_aligned", sourceCategory: "creation", system: "quest", type: "multiplier", target: "trust_gain_aligned", value: mods.trustMultiplierAligned, label: `+25% trust with aligned NPCs` },
    );
  } catch { /* skip */ }

  // 7. Elemental combo (if partner element present)
  try {
    if (state.partnerElement && citizen.element) {
      const combo = findCombo(citizen.element as any, state.partnerElement as any);
      if (combo) {
        for (const eff of combo.effects) {
          bonuses.push({
            source: `combo:${combo.key}`,
            sourceCategory: "combo",
            system: "fight",
            type: "flat",
            target: eff.stat,
            value: eff.value,
            label: `${combo.name}: ${eff.stat} +${eff.value}`,
          });
        }
      }
    }
  } catch { /* skip */ }

  // 8. Companion synergies
  try {
    if (state.companions && state.companions.length > 0) {
      for (const comp of state.companions) {
        const resolved = resolveCompanionBonuses(
          comp.id,
          citizen,
          state.morality ?? 0,
          comp.relationshipLevel,
          "all",
        );
        for (const b of resolved.synergyBonuses) {
          bonuses.push({
            source: `companion:${comp.id}`,
            sourceCategory: "companion",
            system: (b.system as GameSystem) ?? "all",
            type: b.type as any,
            target: b.target,
            value: b.value,
            label: `${comp.id}: ${b.label}`,
          });
        }
      }
    }
  } catch { /* skip */ }

  // 9. Suit-set bonuses (Section G). Read equipped-piece counts,
  // fold every active tier's effects into the aggregator with
  // `sourceCategory: "suit_set"` so mode adapters can filter on it.
  try {
    const counts = state.equippedSuitCounts;
    if (counts) {
      for (const [setId, count] of Object.entries(counts)) {
        if (count <= 0) continue;
        let effects: readonly BonusEffect[];
        try {
          effects = getActiveBonusEffects(setId, count);
        } catch {
          continue; // unknown set id — silently skip rather than crash
        }
        for (const eff of effects) {
          bonuses.push({
            source: `suit-set:${setId}`,
            sourceCategory: "suit_set",
            system: systemForSuitTarget(eff.target),
            type: typeof eff.value === "number" ? "multiplier" : "passive",
            target: eff.target,
            value: typeof eff.value === "number" ? eff.value : 1,
            label: `${setId} (${count}pc): ${eff.label}`,
          });
        }
      }
    }
  } catch { /* skip */ }

  return bonuses;
}

/* ─── BY-SYSTEM FILTER ─── */

export function getBonusesForSystem(state: PlayerStateForBonuses, system: GameSystem): AggregatedBonus[] {
  return getPassiveBonuses(state).filter(b => b.system === system || b.system === "all");
}

/* ─── AGGREGATED MULTIPLIER PER TARGET ─── */

/** Multiply all `multiplier`-type bonuses targeting the same key. */
export function getMultiplierMap(bonuses: AggregatedBonus[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const b of bonuses) {
    if (b.type !== "multiplier") continue;
    m[b.target] = (m[b.target] ?? 1) * (1 + b.value);
  }
  return m;
}

/* ─── SOURCE BREAKDOWN (for UI display) ─── */

export function getBonusBreakdown(bonuses: AggregatedBonus[]): Record<string, number> {
  const byCategory: Record<string, number> = {};
  for (const b of bonuses) {
    byCategory[b.sourceCategory] = (byCategory[b.sourceCategory] ?? 0) + 1;
  }
  return byCategory;
}

/* ─── TALENT SLOTS AVAILABLE ─── */

export function getTalentInfo(citizenLevel: number) {
  return {
    slots: getTalentSlots(citizenLevel),
    available: getAvailableTalents(citizenLevel),
  };
}

/* ─── ENDING BIAS (for late-game forecast) ─── */

export function getPlayerEndingBias(citizen: CitizenData): Record<string, number> {
  return getEndingBias({
    species: citizen.species as any,
    element: citizen.element as any,
    alignment: citizen.alignment as any,
    characterClass: citizen.characterClass as any,
  });
}

/* ─── ELEMENT ADVANTAGES ─── */

export function getPlayerElementAdvantages(citizen: CitizenData) {
  if (!citizen.element) return { strong: [], weak: [] };
  return getElementAdvantages(citizen.element as any);
}
