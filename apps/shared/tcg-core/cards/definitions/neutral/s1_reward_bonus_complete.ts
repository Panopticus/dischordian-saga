/**
 * s1_reward_bonus_complete — Objective Secured
 *
 * Rare spell · Neutral faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Give a friendly unit +2/+0 and rush this turn.
 *    Objective complete. Moving to next target."
 *
 * Lore: Completing twenty-five bonus objectives across the Saga's game
 * modes demonstrates relentless efficiency — the player never leaves
 * value on the table. Objective Secured translates that drive into a
 * burst combat trick: a friendly unit gains attack power and rush,
 * letting it strike immediately like an operative executing a mission.
 *
 * Reward: Complete 25 bonus objectives.
 *
 * Balance: 2 cost spell. +2/+0 ~1 mana, rush grant ~1 mana. Total
 * ~2 mana value. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_bonus_complete" as CardDefinition["id"],
  name: "Objective Secured",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "os_buff_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "buff",
              stats: { power: 2, health: 0 },
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
            {
              op: "grant_keyword",
              keyword: "can_attack_this_turn",
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_bonus_complete.webp"),
  flavorText:
    "Twenty-five objectives. Twenty-five clean executions. The operative does not celebrate — she checks the next briefing.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
