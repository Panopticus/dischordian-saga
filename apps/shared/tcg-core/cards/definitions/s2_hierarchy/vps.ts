/**
 * S2 — Hierarchy of the Damned · VPs (7 legendaries · 7-cost).
 *
 * Senior Vice President tier. One step below the C-Suite (8-cost).
 * Each VP carries a name-derived signature ability — stat shapes
 * are auto-drafted at 6/6 with a single keyword + on-deploy effect.
 * Design owns final tuning; AUTO-DRAFT comments mark every spot.
 *
 * Faction: hierarchy_of_damned. Art: hierarchyOfDamnedArtUrl().
 */
import type { CardDefinition } from "../../../index";
import { art, HIERARCHY_FACTION as F } from "./_art";

const RULES = "1.1.0";

/* Drask Vornal — Conqueror VP. Rush + on-deploy buff. */
export const vp_drask_vornal: CardDefinition = {
  id: "s2_hierarchy_vp_drask_vornal" as CardDefinition["id"],
  name: "Drask Vornal, VP of Acquisitions",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 6 },
  keywords: ["rush"],
  abilities: [
    {
      // AUTO-DRAFT
      id: "drask_acquisition_charge" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 2, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: art("s2_hierarchy_vp_drask_vornal"),
  flavorText: "Quarterly targets met by lunch. Annual targets met by Tuesday.",
  rulesVersion: RULES,
  trial_categories: ["offensive"] as const,
  verdict_delta: -1,
};

/* Kelv Orth — Operations VP. Provoke + heal allies on death. */
export const vp_kelv_orth: CardDefinition = {
  id: "s2_hierarchy_vp_kelv_orth" as CardDefinition["id"],
  name: "Kelv Orth, VP of Operations",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 5, health: 8 },
  keywords: ["provoke"],
  abilities: [
    {
      // AUTO-DRAFT — when any friendly hierarchy unit dies, heal
      // your general for 2.
      id: "kelv_continuity_plan" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies", filter: { faction: [F] } },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: art("s2_hierarchy_vp_kelv_orth"),
  flavorText: "Continuity is non-negotiable. The org chart is eternal even when its occupants are not.",
  rulesVersion: RULES,
  trial_categories: ["defensive"] as const,
  verdict_delta: 0,
};

/* Kragvex — Heavy enforcer. Provoke + permanent self-buff on damage. */
export const vp_kragvex: CardDefinition = {
  id: "s2_hierarchy_vp_kragvex" as CardDefinition["id"],
  name: "Kragvex, VP of Enforcement",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 7 },
  keywords: ["provoke", "fury"],
  abilities: [
    {
      // AUTO-DRAFT
      id: "kragvex_quarterly_review" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_taken" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: art("s2_hierarchy_vp_kragvex"),
  flavorText: "Every disagreement is a performance review. Every review is final.",
  rulesVersion: RULES,
  trial_categories: ["offensive", "reactive"] as const,
  verdict_delta: -1,
};

/* Nessith — Stealth/intelligence VP. Untargetable on deploy. */
export const vp_nessith: CardDefinition = {
  id: "s2_hierarchy_vp_nessith" as CardDefinition["id"],
  name: "Nessith, VP of Intelligence",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 7, health: 5 },
  keywords: ["backstab"],
  abilities: [
    {
      // AUTO-DRAFT
      id: "nessith_classified_briefing" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "untargetable",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: art("s2_hierarchy_vp_nessith"),
  flavorText: "There is a memo about you. There has always been a memo about you. You will never see it.",
  rulesVersion: RULES,
  trial_categories: ["narrative"] as const,
  verdict_delta: -1,
};

/* Shadow Tongue — Communications VP (canon character per LORE_BIBLE). */
export const vp_shadow_tongue: CardDefinition = {
  id: "s2_hierarchy_vp_shadow_tongue" as CardDefinition["id"],
  name: "The Shadow Tongue, SVP of Communications",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 5, health: 7 },
  keywords: ["dispel"],
  abilities: [
    {
      // Canon: the Shadow Tongue corrupts faith. Mechanical: silence
      // a chosen enemy on deploy.
      id: "shadow_tongue_corrupted_doctrine" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "silence",
        to: { kind: "trigger_source" },
      },
    },
  ],
  art: art("s2_hierarchy_vp_shadow_tongue"),
  flavorText: "The propagandist who promoted itself by editing the broadcast that named the promotion.",
  rulesVersion: RULES,
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: -2,
};

/* Thelv-Oss — Logistics VP. Draws a card on deploy. */
export const vp_thelv_oss: CardDefinition = {
  id: "s2_hierarchy_vp_thelv_oss" as CardDefinition["id"],
  name: "Thelv-Oss, VP of Logistics",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 5, health: 7 },
  keywords: [],
  abilities: [
    {
      // AUTO-DRAFT
      id: "thelv_oss_supply_chain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: art("s2_hierarchy_vp_thelv_oss"),
  flavorText: "Just-in-time inventory. Just-in-time conquest. Just-in-time grief.",
  rulesVersion: RULES,
  trial_categories: ["evidence"] as const,
  verdict_delta: -1,
};

/* Varkul — Acquisitions enforcer. Deals damage to enemy general on deploy. */
export const vp_varkul: CardDefinition = {
  id: "s2_hierarchy_vp_varkul" as CardDefinition["id"],
  name: "Varkul, VP of Hostile Takeovers",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 6 },
  keywords: ["pierce"],
  abilities: [
    {
      // AUTO-DRAFT
      id: "varkul_hostile_takeover" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 3 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: art("s2_hierarchy_vp_varkul"),
  flavorText: "The acquisition is the first conversation. Every subsequent conversation is debriefing.",
  rulesVersion: RULES,
  trial_categories: ["offensive"] as const,
  verdict_delta: -2,
};

export const S2_HIERARCHY_VPS: readonly CardDefinition[] = [
  vp_drask_vornal,
  vp_kelv_orth,
  vp_kragvex,
  vp_nessith,
  vp_shadow_tongue,
  vp_thelv_oss,
  vp_varkul,
];
