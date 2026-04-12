/**
 * s1_char_108 — Guerrilla Cell
 *
 * Common unit · Insurgency faction · 3 cost · 3/3
 * Keywords: backstab
 *
 * Oracle text:
 *   "Strikes from behind for bonus damage. The Insurgency's covert
 *    operations cells operate in the blind spots of the panopticon."
 *
 * Lore: Guerrilla Cells are the Insurgency's distributed strike teams,
 * trained by Agent Zero herself in the art of asymmetric warfare. They
 * exploit the Architect's surveillance blind spots — positions the
 * panoptic grid cannot cover. Their backstab ability represents hitting
 * the enemy where they are most vulnerable, a doctrine born from the
 * Insurgency's years of fighting a technologically superior foe.
 *
 * Mechanical model:
 *  - Backstab: intrinsic keyword. Deals bonus damage when attacking
 *    from behind the target (i.e. attacking a unit from a position
 *    opposite to the direction it faces). Engine handles backstab
 *    damage calculation internally.
 *
 * Golden tests: test/cards/insurgency/s1_char_108_guerrilla_cell.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_108" as CardDefinition["id"],
  name: "Guerrilla Cell",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["backstab"],
  abilities: [],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/108_guerrilla_cell.png",
  flavorText:
    "The panopticon sees all directions but one. That is where they wait.",
  rulesVersion: "1.0.0",
};
