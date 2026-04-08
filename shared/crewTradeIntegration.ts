/* ═══════════════════════════════════════════════════════
   CREW ↔ TRADE EMPIRE INTEGRATION

   Wires the crew management system's bonuses into the
   Trade Empire's existing bonus pipeline. Crew roles,
   bloodline powers, and genetic traits all modify
   trade performance.

   Called alongside resolveTradeEmpireBonuses() to layer
   crew bonuses on top of citizen trait bonuses.

   Design: Every filled role matters. Every empty role hurts.
   Your crew IS your trade empire's backbone.
   ═══════════════════════════════════════════════════════ */

/* ─── CREW BONUS OUTPUT (mirrors TradeEmpireBonuses shape) ─── */

export interface CrewTradeBonus {
  combatPowerBonus: number;
  shieldDamageReduction: number;
  tradePriceDiscount: number;
  tradeCreditsBonus: number;
  hazardResistance: number;
  xpBonus: number;
  bonusTurns: number;
  cardDropRateBonus: number;
  scanRangeBonus: number;
  colonyIncomeMultiplier: number;
  missionSuccessBonus: number;
  breakdown: Array<{ source: string; effect: string }>;
}

/* ─── ROLE → TRADE BONUS MAPPING ─── */

type CrewRoleId = "navigator" | "engineer" | "medic" | "security" | "trader" | "scientist" | "comms_officer" | "quartermaster";

interface RoleTradeBonusDef {
  roleId: CrewRoleId;
  roleName: string;
  /** Bonuses when role is filled (scaled by fitness 0-1) */
  filledBonus: Partial<CrewTradeBonus>;
  /** Penalties when role is empty */
  emptyPenalty: Partial<CrewTradeBonus>;
}

const ROLE_TRADE_BONUSES: RoleTradeBonusDef[] = [
  {
    roleId: "navigator", roleName: "Navigator",
    filledBonus: { scanRangeBonus: 2, hazardResistance: 0.05, missionSuccessBonus: 0.05 },
    emptyPenalty: { scanRangeBonus: -1, hazardResistance: -0.10 },
  },
  {
    roleId: "engineer", roleName: "Engineer",
    filledBonus: { shieldDamageReduction: 0.08, colonyIncomeMultiplier: 1.05 },
    emptyPenalty: { shieldDamageReduction: -0.05, colonyIncomeMultiplier: 0.90 },
  },
  {
    roleId: "medic", roleName: "Medic",
    filledBonus: { hazardResistance: 0.10, missionSuccessBonus: 0.05 },
    emptyPenalty: { hazardResistance: -0.08 },
  },
  {
    roleId: "security", roleName: "Security Officer",
    filledBonus: { combatPowerBonus: 15, shieldDamageReduction: 0.05 },
    emptyPenalty: { combatPowerBonus: -10 },
  },
  {
    roleId: "trader", roleName: "Trader",
    filledBonus: { tradePriceDiscount: 0.08, tradeCreditsBonus: 50, colonyIncomeMultiplier: 1.10 },
    emptyPenalty: { tradePriceDiscount: -0.05, tradeCreditsBonus: -30, colonyIncomeMultiplier: 0.85 },
  },
  {
    roleId: "scientist", roleName: "Scientist",
    filledBonus: { xpBonus: 5, cardDropRateBonus: 0.05, scanRangeBonus: 1 },
    emptyPenalty: { xpBonus: -3, cardDropRateBonus: -0.03 },
  },
  {
    roleId: "comms_officer", roleName: "Comms Officer",
    filledBonus: { scanRangeBonus: 2, missionSuccessBonus: 0.08 },
    emptyPenalty: { scanRangeBonus: -2, missionSuccessBonus: -0.05 },
  },
  {
    roleId: "quartermaster", roleName: "Quartermaster",
    filledBonus: { colonyIncomeMultiplier: 1.08, tradeCreditsBonus: 30 },
    emptyPenalty: { colonyIncomeMultiplier: 0.92, tradeCreditsBonus: -20 },
  },
];

/* ─── BLOODLINE POWER → TRADE BONUS MAPPING ─── */

interface BloodlineTradeBonusDef {
  stat: string;
  /** How the bloodline power translates to trade bonuses */
  tradeEffect: Partial<CrewTradeBonus>;
}

const BLOODLINE_TRADE_MAP: Record<string, BloodlineTradeBonusDef> = {
  trade_income: { stat: "trade_income", tradeEffect: { tradeCreditsBonus: 1, colonyIncomeMultiplier: 1.001 } },
  xp_gain: { stat: "xp_gain", tradeEffect: { xpBonus: 1 } },
  security_rating: { stat: "security_rating", tradeEffect: { combatPowerBonus: 1, shieldDamageReduction: 0.001 } },
  research_speed: { stat: "research_speed", tradeEffect: { xpBonus: 0.5, cardDropRateBonus: 0.001 } },
  system_efficiency: { stat: "system_efficiency", tradeEffect: { bonusTurns: 0.1, hazardResistance: 0.001 } },
  crafting_success: { stat: "crafting_success", tradeEffect: { colonyIncomeMultiplier: 1.001 } },
  crew_morale: { stat: "crew_morale", tradeEffect: { missionSuccessBonus: 0.002, tradeCreditsBonus: 0.5 } },
  quarantine_resistance: { stat: "quarantine_resistance", tradeEffect: { hazardResistance: 0.002 } },
  combat_power: { stat: "combat_power", tradeEffect: { combatPowerBonus: 1.5, tradePriceDiscount: 0.001 } },
};

/* ─── GENETIC TRAIT → TRADE BONUS ─── */

const TRAIT_TRADE_BONUSES: Record<string, Partial<CrewTradeBonus>> = {
  silver_tongue: { tradePriceDiscount: 0.03, tradeCreditsBonus: 15 },
  born_leader: { missionSuccessBonus: 0.05, combatPowerBonus: 5 },
  brilliant: { xpBonus: 3, scanRangeBonus: 1 },
  void_adapted: { hazardResistance: 0.05 },
  quick_reflexes: { combatPowerBonus: 5 },
  collectors_eye: { cardDropRateBonus: 0.03, scanRangeBonus: 1 },
  thought_virus_resistant: { hazardResistance: 0.10 },
  soul_contract_echo: { tradePriceDiscount: 0.05, tradeCreditsBonus: 25 },
  infernal_charisma: { tradePriceDiscount: 0.04, missionSuccessBonus: 0.06 },
  the_hunger: { missionSuccessBonus: 0.08, combatPowerBonus: 10 },
  blood_weave_veins: { combatPowerBonus: 12 },
  predator_instinct: { combatPowerBonus: 8 },
  eidetic: { xpBonus: 5 },
  charismatic: { tradePriceDiscount: 0.02 },
  calm_under_fire: { combatPowerBonus: 5, hazardResistance: 0.03 },
  iron_constitution: { hazardResistance: 0.04 },
  archons_echo: { missionSuccessBonus: 0.08, xpBonus: 5 },
  dreamers_mark: { scanRangeBonus: 2, cardDropRateBonus: 0.05 },
  necromancers_gift: { missionSuccessBonus: 0.10 },
};

/* ─── MAIN RESOLVER ─── */

export interface CrewTradeInput {
  /** Which roles are filled (roleId -> fitness 0-100) */
  filledRoles: Record<string, number>;
  /** Active bloodline powers: stat -> value */
  bloodlinePowers: Record<string, number>;
  /** All genetic traits across active crew */
  activeTraits: string[];
  /** Overall crew efficiency (0-100, from calculateCrewBonuses) */
  overallEfficiency: number;
  /** Active crew count */
  crewCount: number;
}

export function resolveCrewTradeBonuses(input: CrewTradeInput): CrewTradeBonus {
  const breakdown: Array<{ source: string; effect: string }> = [];
  const result: CrewTradeBonus = {
    combatPowerBonus: 0, shieldDamageReduction: 0,
    tradePriceDiscount: 0, tradeCreditsBonus: 0,
    hazardResistance: 0, xpBonus: 0, bonusTurns: 0,
    cardDropRateBonus: 0, scanRangeBonus: 0,
    colonyIncomeMultiplier: 1.0, missionSuccessBonus: 0,
    breakdown,
  };

  if (input.crewCount === 0) {
    breakdown.push({ source: "No Crew", effect: "Ship running on automation only. All penalties active." });
    // Apply all empty penalties
    for (const roleDef of ROLE_TRADE_BONUSES) {
      applyPartial(result, roleDef.emptyPenalty);
    }
    return result;
  }

  // 1. Role bonuses/penalties
  for (const roleDef of ROLE_TRADE_BONUSES) {
    const fitness = input.filledRoles[roleDef.roleId];
    if (fitness !== undefined && fitness > 0) {
      const scale = fitness / 100;
      applyPartialScaled(result, roleDef.filledBonus, scale);
      breakdown.push({ source: `${roleDef.roleName} (${fitness}% fit)`, effect: describeBonuses(roleDef.filledBonus, scale) });
    } else {
      applyPartial(result, roleDef.emptyPenalty);
      breakdown.push({ source: `No ${roleDef.roleName}`, effect: describeBonuses(roleDef.emptyPenalty, 1) });
    }
  }

  // 2. Bloodline powers
  for (const [stat, value] of Object.entries(input.bloodlinePowers)) {
    const mapping = BLOODLINE_TRADE_MAP[stat];
    if (!mapping) continue;
    applyPartialScaled(result, mapping.tradeEffect, value);
    breakdown.push({ source: `Bloodline: ${stat}`, effect: `Power level ${value}` });
  }

  // 3. Genetic trait bonuses (deduplicated)
  const uniqueTraits = [...new Set(input.activeTraits)];
  for (const traitId of uniqueTraits) {
    const bonus = TRAIT_TRADE_BONUSES[traitId];
    if (!bonus) continue;
    applyPartial(result, bonus);
    breakdown.push({ source: `Trait: ${traitId}`, effect: describeBonuses(bonus, 1) });
  }

  // 4. Crew efficiency multiplier (scales all bonuses)
  const efficiencyScale = input.overallEfficiency / 100;
  if (efficiencyScale < 1.0) {
    result.combatPowerBonus = Math.round(result.combatPowerBonus * efficiencyScale);
    result.tradeCreditsBonus = Math.round(result.tradeCreditsBonus * efficiencyScale);
    result.xpBonus = Math.round(result.xpBonus * efficiencyScale);
    breakdown.push({ source: `Crew Efficiency: ${input.overallEfficiency}%`, effect: `Bonuses scaled to ${input.overallEfficiency}%` });
  }

  return result;
}

/* ─── HELPERS ─── */

function applyPartial(target: CrewTradeBonus, partial: Partial<CrewTradeBonus>) {
  for (const [key, value] of Object.entries(partial)) {
    if (key === "breakdown" || typeof value !== "number") continue;
    if (key === "colonyIncomeMultiplier") {
      (target as any)[key] *= value;
    } else {
      (target as any)[key] = ((target as any)[key] || 0) + value;
    }
  }
}

function applyPartialScaled(target: CrewTradeBonus, partial: Partial<CrewTradeBonus>, scale: number) {
  for (const [key, value] of Object.entries(partial)) {
    if (key === "breakdown" || typeof value !== "number") continue;
    if (key === "colonyIncomeMultiplier") {
      const delta = (value - 1) * scale;
      (target as any)[key] *= (1 + delta);
    } else {
      (target as any)[key] = ((target as any)[key] || 0) + value * scale;
    }
  }
}

function describeBonuses(partial: Partial<CrewTradeBonus>, scale: number): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(partial)) {
    if (key === "breakdown" || typeof value !== "number") continue;
    const scaled = Math.round(value * scale * 100) / 100;
    if (scaled === 0) continue;
    const sign = scaled > 0 ? "+" : "";
    const label = key.replace(/([A-Z])/g, " $1").toLowerCase().trim();
    if (key === "colonyIncomeMultiplier") {
      const pct = Math.round((scaled - 1) * 100);
      if (pct !== 0) parts.push(`${pct > 0 ? "+" : ""}${pct}% colony income`);
    } else if (key.includes("Reduction") || key.includes("Resistance") || key.includes("Discount") || key.includes("Rate") || key.includes("Success")) {
      parts.push(`${sign}${Math.round(scaled * 100)}% ${label}`);
    } else {
      parts.push(`${sign}${scaled} ${label}`);
    }
  }
  return parts.join(", ") || "no effect";
}

/* ─── MERGE WITH EXISTING TRADE EMPIRE BONUSES ─── */

/**
 * Merges crew bonuses into the existing TradeEmpireBonuses object.
 * Call this after resolveTradeEmpireBonuses() to layer crew bonuses on top.
 */
export function mergeCrewBonuses(
  existing: {
    combatPowerBonus: number; shieldDamageReduction: number;
    tradePriceDiscount: number; tradeCreditsBonus: number;
    hazardResistance: number; xpBonus: number; bonusTurns: number;
    cardDropRateBonus: number; scanRangeBonus: number;
    colonyIncomeMultiplier: number;
    breakdown: Array<{ source: string; effect: string }>;
  },
  crewBonus: CrewTradeBonus,
): void {
  existing.combatPowerBonus += crewBonus.combatPowerBonus;
  existing.shieldDamageReduction = Math.min(0.75, existing.shieldDamageReduction + crewBonus.shieldDamageReduction);
  existing.tradePriceDiscount = Math.min(0.50, existing.tradePriceDiscount + crewBonus.tradePriceDiscount);
  existing.tradeCreditsBonus += crewBonus.tradeCreditsBonus;
  existing.hazardResistance = Math.min(0.80, existing.hazardResistance + crewBonus.hazardResistance);
  existing.xpBonus += crewBonus.xpBonus;
  existing.bonusTurns += Math.floor(crewBonus.bonusTurns);
  existing.cardDropRateBonus = Math.min(0.50, existing.cardDropRateBonus + crewBonus.cardDropRateBonus);
  existing.scanRangeBonus += crewBonus.scanRangeBonus;
  existing.colonyIncomeMultiplier *= crewBonus.colonyIncomeMultiplier;

  // Add crew breakdown entries
  for (const entry of crewBonus.breakdown) {
    existing.breakdown.push({ source: `[Crew] ${entry.source}`, effect: entry.effect });
  }
}
