/**
 * s1_reward_eidolon_lux — Lux, the Light
 *
 * Rare unit · Dreamer faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, heal all friendly units for 2.
 *    Lux radiates warmth that mends what the Architect broke."
 *
 * Lore: Lux is an Eidolon — a spirit companion bonded through the
 * Eidolon Bond system. This luminous entity chose to follow those who
 * walk the Dreamer's path, its light a salve for wounds both physical
 * and existential. Earning Lux requires deepening the Eidolon Bond to
 * its fullest expression.
 *
 * Reward: Reach maximum bond level with the Lux Eidolon.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. AoE heal 2
 * ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_lux" as CardDefinition["id"],
  name: "Lux, the Light",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "lux_heal_allies" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_eidolon_lux.webp"),
  flavorText:
    "In the deepest recursion of the Dreamer's sleep, a light persisted. It called itself Lux, and it refused to go out.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
