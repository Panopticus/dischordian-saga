/**
 * s1_pack_pet_flicker_imp_3 — Inferno Djinn
 *
 * Epic unit · Insurgency faction · 5 cost · 5/4
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 2 damage to all adjacent enemies.
 *    The Insurgency doesn't knock. It detonates."
 *
 * Lore: The Inferno Djinn is the final evolution of the Flicker Imp
 * line — a towering elemental of concentrated insurgent fury. It
 * arrives with rush and an explosive shockwave that scorches all
 * adjacent enemies, embodying the Insurgency's doctrine of shock
 * and awe. Maximum violence, minimum warning.
 *
 * Pet Evolution: Flicker Imp stage 3 of 3.
 * Collect all 3 stages to unlock the Flicker Imp card back.
 *
 * Balance: 5 cost · 5/4 = 9 stats. Budget = 5*2+1 = 11. Rush ~1
 * stat, deal 2 to adjacent enemies on deploy ~1.5 stats
 * (positional). 11 - 2.5 = 8.5. At 9 stats, slightly over but
 * epic pack-exclusive capstone. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_flicker_imp_3" as CardDefinition["id"],
  name: "Inferno Djinn",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 4 },
  keywords: ["rush"],
  abilities: [
    {
      id: "id_deploy_aoe" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
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
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_flicker_imp_3.webp",
  flavorText:
    "The Insurgency doesn't knock. It detonates.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
