/**
 * s1_pack_pet_holo_fox_1 — Fox Kit
 *
 * Common unit · Dreamer faction · 1 cost · 1/2
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 1 damage to a random enemy.
 *    It blinked into existence smelling of ozone and starlight."
 *
 * Lore: The Fox Kit is the first stage of the Holographic Fox
 * evolution line, a translucent cub barely holding its form together.
 * It arrives with a tiny spark of holographic energy that arcs toward
 * the nearest threat — an instinctive defense mechanism more dazzle
 * than danger.
 *
 * Pet Evolution: Holographic Fox stage 1 of 3.
 * Collect all 3 stages to unlock the Holographic Fox card back.
 *
 * Balance: 1 cost · 1/2 = 3 stats. Budget = 1*2+1 = 3. Deal 1
 * random damage on deploy ~0.5 stat. Slightly over, but common
 * pack-exclusive pet card. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_holo_fox_1" as CardDefinition["id"],
  name: "Fox Kit",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "fk_deploy_ping" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It blinked into existence smelling of ozone and starlight.",
  rulesVersion: "1.0.0",
};
