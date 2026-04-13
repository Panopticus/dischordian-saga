/**
 * s1_char_010 — Iron Lion
 *
 * Epic unit · Insurgency faction · 6 cost · 8/7
 * Keywords: taunt, rally
 *
 * Oracle text (from season1-cards.json):
 *   "Enemies in this lane must attack this unit first.
 *    Adjacent allies gain +3 ATK this turn."
 *
 * Mechanical model:
 *  - Taunt: maps to the `provoke` keyword in our engine. The combat
 *    targeting resolver forces enemy attacks to target units with provoke
 *    before any other friendly unit in the same lane. Listed as an
 *    intrinsic keyword.
 *  - Rally: on deploy, all friendly units within radius 1 receive a
 *    +3/0 stat buff for the current turn (`this_turn` duration).
 *
 * Golden tests: test/cards/insurgency/s1_char_010_iron_lion.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_010" as CardDefinition["id"],
  name: "Iron Lion",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 8, health: 7 },
  keywords: ["provoke"],
  abilities: [
    // --- Rally: buff adjacent allies on deploy ---
    {
      id: "il_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_010.webp",
  flavorText:
    "A. The Iron Lion was a legendary warrior and pivotal leader within the Insurgency against the AI Empire . Born in Year 6...",
  rulesVersion: "1.0.0",
};
