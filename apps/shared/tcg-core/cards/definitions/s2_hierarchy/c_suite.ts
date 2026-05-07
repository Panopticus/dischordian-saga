/**
 * S2 — Hierarchy of the Damned · C-Suite (7 mythic-tier legendaries).
 *
 * The seven canonical Hierarchy executives. Per
 * docs/narrative-audit/DOC4_LOREDEX.md (entries 91–95) and the
 * production bible work in apps/shared/npcs/bibles/, the Hierarchy
 * is a corporate-structured infernal multinational that emerged
 * from the Abyss when the Severance shattered the ancient bindings.
 *
 * All seven cards are `legendary` (the existing top rarity); the
 * "C-Suite mythic" producer bucket is encoded as 8-cost legendaries
 * with signature abilities — one tier above the VPs (7-cost
 * legendaries) within the same rarity band. No `mythic` rarity is
 * added to the engine in this PR.
 *
 * Faction: hierarchy_of_damned (added to types/Card.ts in this PR).
 *
 * Auto-drafted abilities — see the `// AUTO-DRAFT` comments. Design
 * owns final tuning; the abilities encode each character's lore
 * signature using only the existing engine ops (Effect.ts +
 * Trigger.ts + Targeting.ts).
 */
import type { CardDefinition } from "../../../index";
import { art, HIERARCHY_FACTION as F } from "./_art";

const RULES = "1.1.0";

/* ═══════════════════════════════════════════════════════
   CEO — Mol'Garath the Unmaker  (general · 0 cost · 4/25)
   "He was not born — he was discovered, found waiting at the
    bottom of reality's source code."
   Signature: when an allied unit dies, this one permanently grows.
   "I was always going to outlast you."
   ═══════════════════════════════════════════════════════ */
export const ceo_mol_garath: CardDefinition = {
  id: "s2_hierarchy_ceo_mol_garath" as CardDefinition["id"],
  name: "Mol'Garath the Unmaker",
  faction: F,
  cardType: "general",
  rarity: "legendary",
  cost: 0,
  baseStats: { power: 4, health: 25 },
  keywords: ["provoke"],
  abilities: [
    {
      // AUTO-DRAFT — friendly Hierarchy unit dies → Mol'Garath
      // permanently buffs +1/+1.
      id: "molgarath_unmake_growth" as CardDefinition["abilities"][number]["id"],
      trigger: {
        kind: "on_any_unit_dies",
        filter: { faction: [F] },
      },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: art("s2_hierarchy_ceo_mol_garath"),
  flavorText:
    "Every act of creation casts a shadow. He was not born — he was discovered, waiting at the bottom of reality's source code.",
  rulesVersion: RULES,
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: -2,
};

/* ═══════════════════════════════════════════════════════
   CFO — Xeth'Raal the Debt Collector  (unit · 8 cost · 6/8)
   "Every prayer, every promise, every despair — the Ledger of
    Ruin records them all."
   Signature: every time the opponent draws a card, Xeth'Raal
   heals 1 (debt monetised).
   ═══════════════════════════════════════════════════════ */
export const cfo_xeth_raal: CardDefinition = {
  id: "s2_hierarchy_cfo_xeth_raal" as CardDefinition["id"],
  name: "Xeth'Raal the Debt Collector",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 6, health: 8 },
  keywords: [],
  abilities: [
    {
      // AUTO-DRAFT — every opponent card draw is a debt entry; heal
      // self for 1 each.
      id: "xethraal_ledger_compounding" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_card_drawn" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: art("s2_hierarchy_cfo_xeth_raal"),
  flavorText:
    "Compound interest is the second-cruelest force in the universe. The Ledger of Ruin remembers every line item.",
  rulesVersion: RULES,
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: -1,
};

/* ═══════════════════════════════════════════════════════
   COO — Riri'Ahlia the Taskmaster  (unit · 8 cost · 7/7)
   "A six-armed warrior-queen encased in armor forged from the
    compressed screams of a thousand conquered worlds."
   Signature: friendly Hierarchy units gain rush this turn on deploy.
   ═══════════════════════════════════════════════════════ */
export const coo_ririahlia: CardDefinition = {
  id: "s2_hierarchy_coo_ririahlia" as CardDefinition["id"],
  name: "Riri'Ahlia, Hierarchy COO",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 7, health: 7 },
  keywords: ["fury", "celerity"],
  abilities: [
    {
      id: "ririahlia_command" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self", faction: [F], except: "self" },
        },
        do: {
          op: "grant_keyword",
          keyword: "rush",
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: art("s2_hierarchy_coo_ririahlia"),
  flavorText:
    "Six arms. Six conquests. Strategy is whispered in boardrooms; execution is screamed across battlefields.",
  rulesVersion: RULES,
  trial_categories: ["offensive", "reactive"] as const,
  verdict_delta: -2,
};

/* ═══════════════════════════════════════════════════════
   CTO — Skarn-Iterate  (unit · 8 cost · 5/8)
   AUTO-DRAFT: every iteration sharper than the last.
   Signature: at the start of each owner turn, draw a card.
   ═══════════════════════════════════════════════════════ */
export const cto_skarn_iterate: CardDefinition = {
  id: "s2_hierarchy_cto_skarn_iterate" as CardDefinition["id"],
  name: "Skarn-Iterate, CTO",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 5, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "skarn_iterate" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: art("s2_hierarchy_cto_skarn_iterate"),
  flavorText:
    "Every iteration sharper than the last. The product is suffering; the roadmap is forever.",
  rulesVersion: RULES,
  trial_categories: ["evidence"] as const,
  verdict_delta: -1,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 35%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/* ═══════════════════════════════════════════════════════
   CMO — Vex'Drelm  (unit · 8 cost · 5/7)
   AUTO-DRAFT: the message gets through whether you want it or not.
   Signature: on deploy, debuff every enemy unit -1 power this turn.
   ═══════════════════════════════════════════════════════ */
export const cmo_vex_drelm: CardDefinition = {
  id: "s2_hierarchy_cmo_vex_drelm" as CardDefinition["id"],
  name: "Vex'Drelm, CMO",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 5, health: 7 },
  keywords: ["dispel"],
  abilities: [
    {
      id: "vex_drelm_message_discipline" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
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
  art: art("s2_hierarchy_cmo_vex_drelm"),
  flavorText:
    "The message gets through. Always. Whether you want it or not. The campaign is the conquest.",
  rulesVersion: RULES,
  trial_categories: ["narrative"] as const,
  verdict_delta: -1,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 40%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/* ═══════════════════════════════════════════════════════
   CHRO — Mor-Vethic  (unit · 8 cost · 4/9)
   AUTO-DRAFT: headcount churn is a feature.
   Signature: when a friendly Hierarchy unit dies, draw a card
   ("there is always another candidate").
   ═══════════════════════════════════════════════════════ */
export const chro_mor_vethic: CardDefinition = {
  id: "s2_hierarchy_chro_mor_vethic" as CardDefinition["id"],
  name: "Mor-Vethic, CHRO",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 4, health: 9 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "mor_vethic_replacement_hire" as CardDefinition["abilities"][number]["id"],
      trigger: {
        kind: "on_any_unit_dies",
        filter: { faction: [F] },
      },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: art("s2_hierarchy_chro_mor_vethic"),
  flavorText:
    "Headcount churn isn't a bug; it's the operating model. There is always another candidate.",
  rulesVersion: RULES,
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: -1,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 35%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/* ═══════════════════════════════════════════════════════
   CISO — Iglarath  (unit · 8 cost · 4/10)
   AUTO-DRAFT: the perimeter holds because we built it around
   the explosion.
   Signature: on deploy, grant forcefield to all friendly Hierarchy
   units this turn.
   ═══════════════════════════════════════════════════════ */
export const ciso_iglarath: CardDefinition = {
  id: "s2_hierarchy_ciso_iglarath" as CardDefinition["id"],
  name: "Iglarath, CISO",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 4, health: 10 },
  keywords: ["forcefield", "untargetable"],
  abilities: [
    {
      id: "iglarath_perimeter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self", faction: [F], except: "self" },
        },
        do: {
          op: "grant_keyword",
          keyword: "forcefield",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: art("s2_hierarchy_ciso_iglarath"),
  flavorText:
    "The perimeter holds. The perimeter has always held. The breach is part of the perimeter; you simply did not have clearance to know that.",
  rulesVersion: RULES,
  trial_categories: ["defensive"] as const,
  verdict_delta: 0,
};

export const S2_HIERARCHY_C_SUITE: readonly CardDefinition[] = [
  ceo_mol_garath,
  cfo_xeth_raal,
  coo_ririahlia,
  cto_skarn_iterate,
  cmo_vex_drelm,
  chro_mor_vethic,
  ciso_iglarath,
];
