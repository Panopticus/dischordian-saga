/**
 * s1_reward_prestige_t3 — Threefold Reborn
 *
 * Rare unit · Neutral faction · 4 cost · 4/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card.
 *    Three deaths. Three rebirths. Each time, the eyes open knowing more."
 *
 * Lore: Prestige Tier 3 means the player has cycled through the game's
 * progression three full times — dying and being reborn with accumulated
 * wisdom. The Threefold Reborn draws a card on arrival, representing
 * the knowledge gained through repeated ascension. A solid, efficient
 * body that replaces itself in hand.
 *
 * Reward: Reach Prestige Tier 3.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Draw 1 ~1
 * stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_prestige_t3" as CardDefinition["id"],
  name: "Threefold Reborn",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "tr_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_prestige_t3.webp"),
  flavorText:
    "Three deaths. Three rebirths. Each time, the eyes open knowing more.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
