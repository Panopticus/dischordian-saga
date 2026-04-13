/**
 * s1_pack_pet_spore_fungus_2 — Mycelial Bloom
 *
 * Rare unit · Insurgency faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On death, deal 1 damage to all adjacent enemies.
 *    The bloom is beautiful. The spores are not."
 *
 * Lore: The Mycelial Bloom is the second stage of the Spore Fungus
 * line — a deceptively vibrant fungal organism whose death releases
 * a toxic cloud of spores. Adjacent enemies take damage when it
 * falls, punishing anyone foolish enough to engage it in close
 * quarters. The Insurgency weaponizes everything, even its own
 * casualties.
 *
 * Pet Evolution: Spore Fungus stage 2 of 3.
 * Collect all 3 stages to unlock the Spore Fungus card back.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. On-death
 * deal 1 to adjacent enemies ~0.5 stat (conditional, positional).
 * 7 - 0.5 = 6.5. At 6 stats, slightly under. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_spore_fungus_2" as CardDefinition["id"],
  name: "Mycelial Bloom",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "mb_death_burst" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_spore_fungus_2.webp",
  flavorText:
    "The bloom is beautiful. The spores are not.",
  rulesVersion: "1.0.0",
};
