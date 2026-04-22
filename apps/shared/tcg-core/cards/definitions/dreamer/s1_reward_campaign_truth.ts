/**
 * s1_reward_campaign_truth — Oracle's Memory Fragment
 *
 * Rare unit · Dreamer faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card. The Oracle's fractured memories still hold
 *    truths that others have forgotten — each fragment is a revelation."
 *
 * Lore: When a player completes the campaign with the Truth moral axis
 * dominant, the Oracle rewards them with a shard of her original memory.
 * This card represents the player's commitment to uncovering what the
 * Architect tried to erase. The fragment whispers secrets — mechanically
 * modeled as card draw.
 *
 * Reward: Complete the campaign with Truth axis dominant.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. Draw 1 ~1 stat.
 * 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_campaign_truth" as CardDefinition["id"],
  name: "Oracle's Memory Fragment",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "omf_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_campaign_truth.webp"),
  flavorText:
    "She shattered herself rather than let the Architect possess her whole. Each shard still remembers what the world was meant to be.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
