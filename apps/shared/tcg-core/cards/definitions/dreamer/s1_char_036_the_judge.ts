/**
 * s1_char_036 — The Judge
 *
 * Rare unit · Dreamer faction · 5 cost · 7/6
 * Keywords: taunt, pierce
 *
 * Oracle text (from season1-cards.json):
 *   "Enemies in this lane must attack this unit first.
 *    Ignores 2 points of enemy armor."
 *
 * Mechanical model:
 *  - Taunt: maps to the `provoke` keyword (intrinsic). The combat
 *    targeting resolver forces enemy attacks to target units with provoke
 *    before any other friendly unit in the same lane.
 *  - Pierce: passive aura on self grants `ignore_armor_3` keyword
 *    permanently. The spec rounds "2 points" up to the standard
 *    `ignore_armor_3` keyword granularity used across the engine.
 *
 * Golden tests: test/cards/dreamer/s1_char_036_the_judge.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_036" as CardDefinition["id"],
  name: "The Judge",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 7, health: 6 },
  keywords: ["provoke"],
  abilities: [
    // --- Pierce: ignore 3 armor permanently ---
    {
      id: "judge_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_036.webp",
  flavorText:
    "Deciding the fate of individuals, civilizations, and ideologies, the Judge is guided solely by their perception of balan...",
  rulesVersion: "1.0.0",
};
