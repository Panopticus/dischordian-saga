/**
 * s1_pack_pet_holo_fox_2 — Spectral Fox
 *
 * Rare unit · Dreamer faction · 3 cost · 3/3
 * Keywords: flying
 *
 * Oracle text:
 *   "Flying. On deploy, draw 1 card.
 *    Between worlds, it learned to walk on light."
 *
 * Lore: The Spectral Fox is the second stage of the Holographic Fox
 * line — the cub has grown into a shimmering predator that phases
 * between dimensions. Its flying keyword reflects its ability to
 * traverse any terrain as holographic light, and the draw on deploy
 * represents the knowledge it gathers from the spaces between.
 *
 * Pet Evolution: Holographic Fox stage 2 of 3.
 * Collect all 3 stages to unlock the Holographic Fox card back.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Flying
 * keyword ~1 stat, draw 1 on deploy ~1 stat. 7 - 2 = 5. Slightly
 * below at 6 but flying + cantrip is high utility. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_holo_fox_2" as CardDefinition["id"],
  name: "Spectral Fox",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["flying"],
  abilities: [
    {
      id: "sf_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Between worlds, it learned to walk on light.",
  rulesVersion: "1.0.0",
};
