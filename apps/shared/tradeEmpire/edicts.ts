// apps/shared/tradeEmpire/edicts.ts
//
// Edict registry — Phase D of the Lore-Aligned Galactic-Empire
// Overhaul. Player-issued season-long modifiers. One active edict
// per season per player. Each edict pairs a *bonus* (resource boost,
// trust boost, raid suppression, etc.) with a *cost* (sub-house rep
// hit) — the player must accept the cost to claim the bonus.
//
// Foundation for revolts: when an edict's cost pushes a sub-house
// below -50, that house can canonically open an internal-revolt
// agenda the next season. Phase D ships the edict primitive; the
// revolt agenda is content-authoring in Phase D.5.

import type { SubHouseKey } from "./houses";

export interface EdictDef {
  edictKey: string;
  name: string;
  loreContext: string;
  /** Sub-house rep deltas applied at edict issuance. */
  costDeltas: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
  /** The mechanical bonus, surfaced via the activeEdictKey query. */
  bonus: EdictBonus;
  /** Optional saga-act minimum. */
  minAct?: number;
}

export type EdictBonus =
  /** Per-mission credit reward bonus, percent. */
  | { kind: "mission_credit_bonus_pct"; pct: number }
  /** Influence gained per mission completed, flat. */
  | { kind: "mission_influence_bonus"; amount: number }
  /** Defense wave intensity multiplier. */
  | { kind: "defense_wave_intensity_mult"; mult: number }
  /** Disenchant Dream multiplier (TCG). */
  | { kind: "disenchant_dream_mult"; mult: number }
  /** Reduce a sub-house's demand probability, percent. */
  | {
      kind: "demand_probability_reduction_pct";
      targetHouse: SubHouseKey;
      pct: number;
    };

// --- Reference edict registry --------------------------------------------

export const EDICT_REGISTRY: Readonly<Record<string, EdictDef>> = {
  "edict.industrial_levy": {
    edictKey: "edict.industrial_levy",
    name: "Industrial Levy",
    loreContext:
      "Direct every functioning forge in your control to a wartime production tempo. Civic Engineers will read the order as a wage cut; Authority's Ledger will note the throughput.",
    costDeltas: [
      { houseKey: "nb_civic_engineers", delta: -15 },
    ],
    bonus: { kind: "mission_credit_bonus_pct", pct: 25 },
  },
  "edict.recognition_of_revival": {
    edictKey: "edict.recognition_of_revival",
    name: "Recognition of the Wraith Hierophant's Revival",
    loreContext:
      "Issue a public recognition of the Thalorian revival. The Hierophant gains immediate standing; the Authority and the Syndicate of Death will respond.",
    costDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -20 },
      { houseKey: "hierarchy_syndicate_of_death", delta: -10 },
    ],
    bonus: { kind: "mission_influence_bonus", amount: 25 },
  },
  "edict.ledger_compliance": {
    edictKey: "edict.ledger_compliance",
    name: "Comply with the Ledger",
    loreContext:
      "File a season's-worth of cooperation with the Authority's Ledger. The Hierophant will note the compliance; the Quietwork will go quieter.",
    costDeltas: [
      { houseKey: "thaloria_council", delta: -15 },
      { houseKey: "thaloria_quietwork", delta: -10 },
    ],
    bonus: {
      kind: "demand_probability_reduction_pct",
      targetHouse: "nb_authoritys_ledger",
      pct: 50,
    },
  },
  "edict.casino_partnership": {
    edictKey: "edict.casino_partnership",
    name: "Casino Partnership",
    loreContext:
      "Sign a season-long partnership with the Casino Floor. Every disenchant is now a tradable spread; the Shelf-mates lose access to your provenance trail.",
    costDeltas: [
      { houseKey: "antiquarian_shelfmates", delta: -10 },
    ],
    bonus: { kind: "disenchant_dream_mult", mult: 1.4 },
  },
  "edict.fortified_stance": {
    edictKey: "edict.fortified_stance",
    name: "Fortified Stance",
    loreContext:
      "Declare a defensive season. Every tower defense wave is gentler; rivals may interpret the stance as weakness.",
    costDeltas: [
      { houseKey: "hierarchy_acquisitions", delta: -8 },
      { houseKey: "insurgency_zero_doctrine", delta: -8 },
    ],
    bonus: { kind: "defense_wave_intensity_mult", mult: 0.7 },
  },
};

export type EdictKey = keyof typeof EDICT_REGISTRY;

export function allEdictKeys(): ReadonlyArray<string> {
  return Object.keys(EDICT_REGISTRY);
}

export function getEdict(key: string): EdictDef | undefined {
  return EDICT_REGISTRY[key];
}

export function validateEdictRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  for (const [k, def] of Object.entries(EDICT_REGISTRY)) {
    if (def.edictKey !== k) errors.push(`${k}: edictKey mismatch (${def.edictKey})`);
    if (!k.startsWith("edict.")) errors.push(`${k}: must start with "edict."`);
    if (def.costDeltas.length === 0) {
      errors.push(`${k}: edict must have at least one costDelta`);
    }
    for (const d of def.costDeltas) {
      if (d.delta >= 0) errors.push(`${k}: costDelta must be negative (got ${d.delta})`);
    }
  }
  return errors;
}
