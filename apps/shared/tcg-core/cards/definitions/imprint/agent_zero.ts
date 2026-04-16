/**
 * Imprint Set — Agent Zero (5 tiers). Phase F10.
 *
 * Five TCG cards forged from the player's accumulated fragments of
 * Agent Zero across every game mode. Each tier is unlocked at the
 * canonical fragment threshold (10/25/50/100/200). Rarity climbs
 * Common → Uncommon → Rare → Epic → Legendary, and so does the
 * character's mechanical signature — each tier is a sharper, more
 * dangerous read of the same person.
 *
 * Design philosophy: every tier should feel like "the same Agent
 * Zero" — Insurgency faction, stealth + pierce vocabulary, decisive
 * strikes. The tier numbers scale the personality, not replace it.
 *
 * Tier id convention: s1_imprint_agent_zero_t{1..5}
 */
import type { CardDefinition } from "../../../index";

/* ═══════════════════════════════════════════════════════
   TIER 1 — COMMON
   "You remember her name. You remember nothing else."
   ═══════════════════════════════════════════════════════ */
export const agent_zero_t1: CardDefinition = {
  id: "s1_imprint_agent_zero_t1" as CardDefinition["id"],
  name: "Imprint: Agent Zero (Common)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_agent_zero_t1.webp",
  flavorText:
    "A silhouette at the edge of your memory. The shape of her moves before you know what you were seeing.",
  rulesVersion: "1.0.0",
};

/* ═══════════════════════════════════════════════════════
   TIER 2 — UNCOMMON
   She begins to have a face. And a favorite exit.
   ═══════════════════════════════════════════════════════ */
export const agent_zero_t2: CardDefinition = {
  id: "s1_imprint_agent_zero_t2" as CardDefinition["id"],
  name: "Imprint: Agent Zero (Uncommon)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "az_t2_stealth_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "untargetable",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_agent_zero_t2.webp",
  flavorText:
    "Stealth — 1 turn. The shape of her teaching you to look away from where she actually is.",
  rulesVersion: "1.0.0",
};

/* ═══════════════════════════════════════════════════════
   TIER 3 — RARE
   Stealth sharpens — reveal on attack, longer window.
   ═══════════════════════════════════════════════════════ */
export const agent_zero_t3: CardDefinition = {
  id: "s1_imprint_agent_zero_t3" as CardDefinition["id"],
  name: "Imprint: Agent Zero (Rare)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "az_t3_stealth_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "untargetable",
        duration: { kind: "n_turns", n: 2 },
        to: { kind: "self" },
      },
    },
    {
      id: "az_t3_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_agent_zero_t3.webp",
  flavorText:
    "Stealth — 2 turns. Reveals when she strikes. You start to see the moves she would have made last week if she had needed to.",
  rulesVersion: "1.0.0",
  trial_categories: ["confession"] as const,
};

/* ═══════════════════════════════════════════════════════
   TIER 4 — EPIC
   Reveal on attack. Full pierce. The Zero the Insurgency
   remembers in its own recruitment pitch.
   ═══════════════════════════════════════════════════════ */
export const agent_zero_t4: CardDefinition = {
  id: "s1_imprint_agent_zero_t4" as CardDefinition["id"],
  name: "Imprint: Agent Zero (Epic)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 6, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "az_t4_stealth_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "untargetable",
            duration: { kind: "n_turns", n: 3 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "stealth_turns",
            amount: 3,
            to: { kind: "self" },
          },
        ],
      },
    },
    {
      id: "az_t4_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    {
      id: "az_t4_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_agent_zero_t4.webp",
  flavorText:
    "Stealth — 3 turns. Ignores 3 enemy armor. Reveals when she strikes. You can feel the shape of the real Agent Zero now, and she is entirely made of decisions you would not have thought to make.",
  rulesVersion: "1.0.0",
  trial_categories: ["confession", "evidence", "narrative"] as const,
};

/* ═══════════════════════════════════════════════════════
   TIER 5 — LEGENDARY
   The woman who stole the Ark. Rush + stealth + pierce.
   The signature card. Full power.
   ═══════════════════════════════════════════════════════ */
export const agent_zero_t5: CardDefinition = {
  id: "s1_imprint_agent_zero_t5" as CardDefinition["id"],
  name: "Agent Zero, The First Strike",
  faction: "insurgency",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 7, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "az_t5_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "rush",
            duration: { kind: "this_turn" },
            to: { kind: "self" },
          },
          {
            op: "grant_keyword",
            keyword: "untargetable",
            duration: { kind: "n_turns", n: 3 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "stealth_turns",
            amount: 3,
            to: { kind: "self" },
          },
        ],
      },
    },
    {
      id: "az_t5_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    {
      id: "az_t5_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_agent_zero_t5.webp",
  flavorText:
    "Rush. Stealth — 3 turns. Ignores 3 enemy armor. She stole Ark 1047 from the Panopticon's docking systems without raising a single alarm. The Warlord killed her for it. The Insurgency brought her back anyway, and she has not once acted like somebody with anything left to lose.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
};

/** All five Agent Zero imprint tiers as a frozen array, tier order
 *  (common → legendary). Imported by the imprint set registry. */
export const AGENT_ZERO_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  agent_zero_t1,
  agent_zero_t2,
  agent_zero_t3,
  agent_zero_t4,
  agent_zero_t5,
]);
