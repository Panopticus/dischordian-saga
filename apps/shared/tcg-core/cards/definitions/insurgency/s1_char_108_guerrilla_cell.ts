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

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_108" as CardDefinition["id"],
  name: "Guerrilla Cell",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["backstab"],
  abilities: [
    // --- Combat Adaptation: gain +1/+0 permanently on kill ---
    {
      id: "guerrilla_kill_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "buff",
        stats: { power: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_108.webp"),
  flavorText:
    "The panopticon sees all directions but one. That is where they wait.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};
