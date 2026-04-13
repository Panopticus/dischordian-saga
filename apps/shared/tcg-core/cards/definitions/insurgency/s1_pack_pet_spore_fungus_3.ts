/**
 * s1_pack_pet_spore_fungus_3 — Fungal Colossus
 *
 * Epic unit · Insurgency faction · 5 cost · 3/7
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Deathwatch: whenever any unit dies, gain +1/+1.
 *    It feeds on the fallen. Every battlefield is a garden."
 *
 * Lore: The Fungal Colossus is the final evolution of the Spore
 * Fungus line — a massive fungal entity that thrives on decay. Its
 * deathwatch ability lets it grow with every casualty on either side,
 * becoming an ever-expanding horror that turns the attrition of war
 * into its own nourishment. The Insurgency's ultimate expression of
 * turning destruction into growth.
 *
 * Pet Evolution: Spore Fungus stage 3 of 3.
 * Collect all 3 stages to unlock the Spore Fungus card back.
 *
 * Balance: 5 cost · 3/7 = 10 stats. Budget = 5*2+1 = 11. Deathwatch
 * keyword ~1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_spore_fungus_3" as CardDefinition["id"],
  name: "Fungal Colossus",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 3, health: 7 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "fc_deathwatch_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It feeds on the fallen. Every battlefield is a garden.",
  rulesVersion: "1.0.0",
};
