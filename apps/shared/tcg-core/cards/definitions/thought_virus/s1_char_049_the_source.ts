/**
 * s1_char_049 — The Source
 *
 * Legendary unit · Thought Virus faction · 7 cost · 8/12
 * Keywords: drain, pierce
 *
 * Oracle text (from season1-cards.json):
 *   "Heals for 4% of damage dealt. Deals +4 damage on first attack,
 *    then takes 3 self-damage. Ignores 4 points of enemy armor."
 *
 * Design interpretation:
 *   The spec adjusts base stats to 8/12 (JSON has 10/12) and narrows
 *   pierce to "ignores 3 points" (JSON says 4). The overcharge keyword
 *   from the JSON is not in the spec scope — we model only drain and
 *   pierce as specified.
 *
 * Mechanical model:
 *  - Drain: on_damage_dealt by self, heal self for 2 HP. This is the
 *    simplified flat approximation of "4% of damage dealt."
 *  - Pierce: passive_aura on self grants `ignore_armor_3` keyword
 *    permanently, same pattern as Agent Zero (s1_char_002). The combat
 *    pipeline reads this keyword and subtracts 3 from any armor reduction
 *    when The Source is the damage source.
 *
 * Golden tests: test/cards/thought_virus/s1_char_049_the_source.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_049" as CardDefinition["id"],
  name: "The Source",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 8, health: 9 },
  keywords: [],
  abilities: [
    // --- Drain: heal 2 on each hit (simplified 4%) ---
    {
      id: "src_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
    // --- Pierce: ignore 3 armor permanently ---
    {
      id: "src_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_049.webp"),
  flavorText:
    "Yet, through the twisted schemes of Project Vector, Kael\u2019s fate was reshaped into something monstrous and eternal. Infec...",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
