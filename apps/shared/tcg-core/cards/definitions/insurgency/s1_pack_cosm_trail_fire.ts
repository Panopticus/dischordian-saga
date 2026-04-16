/**
 * s1_pack_cosm_trail_fire — Void Flame Runner
 *
 * Rare unit · Insurgency faction · 3 cost · 3/3
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 1 damage to all adjacent enemies.
 *    She leaves fire in her wake. The Void taught her that."
 *
 * Lore: The Void Flame Runner is an Insurgency operative who has
 * learned to channel Void energy into incendiary bursts. She strikes
 * fast (rush) and scorches everything near her landing zone. The
 * adjacent damage represents the trail of Void fire she leaves
 * behind — a signature that marks her every deployment.
 *
 * Cosmetic unlock: Collecting this card unlocks the Void Flame
 * trail effect.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Rush ~1 stat,
 * AoE 1 to adjacent enemies ~0.5 stat. 7 - 1.5 = 5.5. At 6 stats,
 * slightly generous but conditional on positioning. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_trail_fire" as CardDefinition["id"],
  name: "Void Flame Runner",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["rush"],
  abilities: [
    {
      id: "vfr_rush_grant" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    {
      id: "vfr_aoe_adjacent" as CardDefinition["abilities"][number]["id"],
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
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_cosm_trail_fire.webp",
  flavorText:
    "She leaves fire in her wake. The Void taught her that.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};
