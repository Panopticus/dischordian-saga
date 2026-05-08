/**
 * s1_reward_guild_victory — War Dividend
 *
 * Epic spell · New Babylon faction · 4 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 3 cards, then discard 1. War is costly — but for New Babylon,
 *    it always turns a profit."
 *
 * Lore: Winning a Guild War proves that conquest pays dividends. This
 * spell represents the spoils of guild-scale warfare — a flood of
 * resources (draw 3) tempered by the costs of conflict (discard 1).
 * In New Babylon, even war is a transaction.
 *
 * Reward: Win a Guild Wars campaign.
 *
 * Balance: 4 cost spell. Draw 3 discard 1 = net +2 cards with
 * selection. Worth ~3-4 mana. Fair at 4 cost.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_guild_victory" as CardDefinition["id"],
  name: "War Dividend",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "epic",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "wd_draw_discard" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 3 },
            who: "self",
          },
          {
            op: "discard",
            amount: { kind: "const", value: 1 },
            from: "self",
            mode: "choose",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_guild_victory.webp"),
  flavorText:
    "The guild war ended. Locke's accountants moved in before the smoke cleared.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
