/**
 * s1_reward_draft_winner — Draft Master
 *
 * Rare unit · Neutral faction · 4 cost · 4/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 2, then discard 1.
 *    She builds winning decks from other people's leftovers."
 *
 * Lore: Winning 5 draft tournaments proves adaptability — the ability
 * to construct a winning strategy from random card pools. The Draft
 * Master brings that same resourcefulness to the board: she arrives
 * with a burst of options (draw 2) but demands discipline in return
 * (discard 1), mimicking the draft process of selecting the best and
 * cutting the rest.
 *
 * Reward: Win 5 draft tournaments.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Draw 2
 * discard 1 = net +1 with selection, ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_draft_winner" as CardDefinition["id"],
  name: "Draft Master",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "dm_draw_discard" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
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
  art: assetUrl("art/cards/s1_reward_draft_winner.webp"),
  flavorText:
    "She builds winning decks from other people's leftovers.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
