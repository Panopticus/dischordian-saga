/**
 * Imprint Set — The Iron Lion (5 tiers). Phase F11.
 *
 * The Insurgency general who charges first and apologizes never.
 * Mechanical vocabulary: provoke + rush. Each tier scales the
 * frontline-charge identity rather than replacing it.
 *
 * Tier id convention: s1_imprint_iron_lion_t{1..5}
 */
import type { CardDefinition } from "../../../index";

/* ═══════════════════════════════════════════════════════
   TIER 1 — COMMON
   ═══════════════════════════════════════════════════════ */
export const iron_lion_t1: CardDefinition = {
  id: "s1_imprint_iron_lion_t1" as CardDefinition["id"],
  name: "Imprint: The Iron Lion (Common)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_iron_lion_t1.webp",
  flavorText:
    "A roar at the edge of the perimeter. Whatever is coming, it has already committed to the charge.",
  rulesVersion: "1.0.0",
};

/* ═══════════════════════════════════════════════════════
   TIER 2 — UNCOMMON — Provoke enters
   ═══════════════════════════════════════════════════════ */
export const iron_lion_t2: CardDefinition = {
  id: "s1_imprint_iron_lion_t2" as CardDefinition["id"],
  name: "Imprint: The Iron Lion (Uncommon)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_iron_lion_t2.webp",
  flavorText:
    "Provoke. You stand between your people and the approaching thing whether or not the thing is approaching your people.",
  rulesVersion: "1.0.0",
};

/* ═══════════════════════════════════════════════════════
   TIER 3 — RARE — Rush on deploy
   ═══════════════════════════════════════════════════════ */
export const iron_lion_t3: CardDefinition = {
  id: "s1_imprint_iron_lion_t3" as CardDefinition["id"],
  name: "Imprint: The Iron Lion (Rare)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 5, health: 4 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "il_t3_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "rush",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_iron_lion_t3.webp",
  flavorText:
    "Provoke. Rush. The Iron Lion does not believe in pacing. He believes in arrival.",
  rulesVersion: "1.0.0",
};

/* ═══════════════════════════════════════════════════════
   TIER 4 — EPIC — Rally buff on deploy
   ═══════════════════════════════════════════════════════ */
export const iron_lion_t4: CardDefinition = {
  id: "s1_imprint_iron_lion_t4" as CardDefinition["id"],
  name: "Imprint: The Iron Lion (Epic)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 6, health: 6 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "il_t4_rush" as CardDefinition["abilities"][number]["id"],
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
            op: "buff",
            stats: { power: 2, health: 0 },
            duration: { kind: "this_turn" },
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_iron_lion_t4.webp",
  flavorText:
    "Provoke. Rush. +2 power this turn on deploy. When he shows up, the people next to him remember why they signed up.",
  rulesVersion: "1.0.0",
};

/* ═══════════════════════════════════════════════════════
   TIER 5 — LEGENDARY
   The Iron Lion in full roar. Frenzy + provoke + rush +
   rally. The Insurgency's signature card.
   ═══════════════════════════════════════════════════════ */
export const iron_lion_t5: CardDefinition = {
  id: "s1_imprint_iron_lion_t5" as CardDefinition["id"],
  name: "The Iron Lion, First Roar",
  faction: "insurgency",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 7, health: 8 },
  keywords: ["provoke", "frenzy"],
  abilities: [
    {
      id: "il_t5_rush" as CardDefinition["abilities"][number]["id"],
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
            op: "buff",
            stats: { power: 3, health: 0 },
            duration: { kind: "this_turn" },
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_iron_lion_t5.webp",
  flavorText:
    "Provoke. Frenzy. Rush. +3 power this turn on deploy. The Insurgency was a rumor before the Iron Lion showed up. After he showed up it was the shape of a fist, and the fist was already moving.",
  rulesVersion: "1.0.0",
};

/** All five Iron Lion imprint tiers in tier order. */
export const IRON_LION_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  iron_lion_t1,
  iron_lion_t2,
  iron_lion_t3,
  iron_lion_t4,
  iron_lion_t5,
]);
