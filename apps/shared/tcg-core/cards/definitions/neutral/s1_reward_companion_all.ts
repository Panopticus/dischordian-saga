/**
 * s1_reward_companion_all — Trusted Ally
 *
 * Rare unit · Neutral faction · 5 cost · 4/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card and give self +1/+1.
 *    Those who earn every companion's trust carry a quiet authority."
 *
 * Lore: Bonding with every companion in the system proves the player's
 * capacity for connection. The Trusted Ally represents the cumulative
 * wisdom of those bonds — a versatile operative who arrives prepared
 * (draw) and empowered (self-buff) by the trust placed in them.
 *
 * Reward: Bond with all companions in Companion mode.
 *
 * Balance: 5 cost · 4/5 = 9 stats. Budget = 5*2+1 = 11. Draw 1 ~1
 * stat, self +1/+1 ~1 stat. 11 - 2 = 9. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_companion_all" as CardDefinition["id"],
  name: "Trusted Ally",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "ta_draw_and_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
          {
            op: "buff",
            stats: { power: 1, health: 1 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_companion_all.webp"),
  flavorText:
    "Every companion she ever bonded with left a mark. She carries them all into battle.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
