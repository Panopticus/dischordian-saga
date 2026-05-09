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
  "edict.severance_alignment": {
    edictKey: "edict.severance_alignment",
    name: "Severance Alignment",
    loreContext:
      "Sign with Severance Division for a season. Acquisitions reads the alignment as preference; the player's missions through Severance lanes lock in clean.",
    costDeltas: [
      { houseKey: "hierarchy_acquisitions", delta: -12 },
    ],
    bonus: { kind: "mission_credit_bonus_pct", pct: 18 },
  },
  "edict.acquisitions_proxy": {
    edictKey: "edict.acquisitions_proxy",
    name: "Acquisitions Proxy",
    loreContext:
      "Lend the player's seal to an Acquisitions takeover. The blood-weave ledger thickens favourably; Severance files the alignment under leverage.",
    costDeltas: [
      { houseKey: "hierarchy_severance", delta: -10 },
      { houseKey: "thaloria_council", delta: -8 },
    ],
    bonus: { kind: "mission_influence_bonus", amount: 18 },
  },
  "edict.shelfmate_priority": {
    edictKey: "edict.shelfmate_priority",
    name: "Shelf-mate Priority",
    loreContext:
      "Direct provenance traffic through the Antiquarian Shelf-mates first. Daniel Cross writes a margin note. The Casino Floor's spread closes wider, in protest.",
    costDeltas: [
      { houseKey: "antiquarian_casino", delta: -12 },
    ],
    bonus: { kind: "demand_probability_reduction_pct", targetHouse: "antiquarian_shelfmates", pct: 60 },
  },
  "edict.freeport_charter": {
    edictKey: "edict.freeport_charter",
    name: "Free Ports Charter",
    loreContext:
      "Adopt the Coalition's barter charter for a season. Authority's Ledger refuses to honour your contracts in their core sectors; the Free Ports honour them everywhere.",
    costDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -10 },
    ],
    bonus: { kind: "mission_credit_bonus_pct", pct: 12 },
  },
  "edict.silent_year": {
    edictKey: "edict.silent_year",
    name: "Silent Year",
    loreContext:
      "Match the Wraith Hierophant's silence for a full season. The Council does not announce; the recovery ledger thickens. Authority interprets the silence as compliance.",
    costDeltas: [
      { houseKey: "hierarchy_syndicate_of_death", delta: -12 },
    ],
    bonus: { kind: "demand_probability_reduction_pct", targetHouse: "thaloria_council", pct: 75 },
  },
  "edict.archivist_audit": {
    edictKey: "edict.archivist_audit",
    name: "Archivist Audit",
    loreContext:
      "Commission the Cross-References Desk for a season-long audit. Provenance trails clean up; the Casino's spreads narrow. Disenchant value drops slightly.",
    costDeltas: [
      { houseKey: "antiquarian_casino", delta: -8 },
    ],
    bonus: { kind: "disenchant_dream_mult", mult: 0.85 },
  },
  "edict.frontier_conscription": {
    edictKey: "edict.frontier_conscription",
    name: "Frontier Conscription",
    loreContext:
      "Declare the frontier sectors a conscription zone. Mission rewards in those sectors balloon; Civic Engineers and Free Ports both refuse to acknowledge the order.",
    costDeltas: [
      { houseKey: "nb_civic_engineers", delta: -10 },
      { houseKey: "ind_freeports", delta: -10 },
    ],
    bonus: { kind: "mission_credit_bonus_pct", pct: 30 },
  },
  "edict.sovereigns_quietude": {
    edictKey: "edict.sovereigns_quietude",
    name: "Sovereign's Quietude",
    loreContext:
      "Negotiate a ceasefire of pretence with the Thought Virus's Sovereign's Circle. Most missions are safer; some Authority-aligned brokers refuse you entirely.",
    costDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -15 },
    ],
    bonus: { kind: "defense_wave_intensity_mult", mult: 0.55 },
  },
  "edict.architects_petition": {
    edictKey: "edict.architects_petition",
    name: "Architect's Petition",
    loreContext:
      "Petition the Architect's Court for a season of substrate cooperation. The lattice grants minor uplifts. The Substrate Rebels and the Human will not forget.",
    costDeltas: [
      { houseKey: "ae_substrate_rebels", delta: -15 },
    ],
    bonus: { kind: "mission_influence_bonus", amount: 30 },
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
