/**
 * S2 — Hierarchy of the Damned · Lord-tier · Reckoning Daughter
 *
 * Fourth and final canonical Hierarchy demon-lord
 * (apps/shared/hierarchyOfTheDamned.ts, "the Hierarchy's Auditor").
 * Audits the Hierarchy itself; the OTHER lords fear her arrival. She
 * arrives only when the books are wrong — her presence is the Vortex's
 * correction, not its punishment.
 *
 * Mechanical model: a silent sweeper. On deploy, every enemy unit is
 * dispelled (the audit closes, ongoing effects on the opponent's board
 * are reconciled away — this models "the silence is the audit"). On
 * the controller's subsequent turn-starts she debuffs every enemy unit
 * by -1 power for the turn (the ledger has merely been confirmed; the
 * other side cannot hit as hard while the audit is open). Stat-budget:
 * 9-cost legendary; cost-9 curve is 23 ± 30%, [16, 30]. 6/19 = 25 — on
 * curve. The board-wide deploy + recurring debuff is a sweeper-tier
 * legendary effect; balanceException records the design rationale.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "../../../../../client/src/lib/assetUrl";
import { HIERARCHY_FACTION as F } from "./_art";

const RULES = "1.1.0";

export const lord_reckoning_daughter: CardDefinition = {
  id: "s2_hierarchy_lord_reckoning_daughter" as CardDefinition["id"],
  name: "The Reckoning Daughter, Hierarchy Auditor",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 9,
  baseStats: { power: 6, health: 19 },
  keywords: ["dispel", "untargetable"],
  abilities: [
    // The audit closes — on deploy, dispel every enemy unit.
    {
      id: "reckoning_audit_closes" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: { kind: "all", filter: { controller: "opponent" } },
        do: { op: "dispel", to: { kind: "it" } },
      },
    },
    // The silence is the audit — every owner turn-start, every enemy
    // unit takes -1 power for the turn while she remains in play.
    {
      id: "reckoning_silence_is_audit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "foreach",
        over: { kind: "all", filter: { controller: "opponent" } },
        do: {
          op: "debuff",
          stats: { power: 1, health: 0 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/hierarchy/lord_reckoning_daughter.webp"),
  flavorText:
    "Her arrival is the OTHER lords going quiet. The audit closes. Whatever you did was reconcilable — she would still be present otherwise.",
  rulesVersion: RULES,
  trial_categories: ["defensive", "evidence", "reactive"] as const,
  verdict_delta: -3,
  balanceException: {
    reason:
      "Top-tier 9-cost legendary lord-of-lords sweeper: 6/19 + dispel + untargetable, with on-deploy board-wide enemy dispel and a per-turn -1 power debuff while she remains in play. Stats are on curve for cost 9 (25 vs expected 23, inside the ±30% tolerance window) but the dual-axis ongoing effect (board reset + recurring sweep) plus untargetable+dispel keyword stack pushes effective value above the printed line. Encodes the lore beat that the Reckoning Daughter is the audit the other Hierarchy lords fear.",
    reviewer: "claude-2026-05-08",
  },
};
