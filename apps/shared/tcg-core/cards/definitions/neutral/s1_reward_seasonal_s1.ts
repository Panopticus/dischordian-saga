/**
 * s1_reward_seasonal_s1 — Season's End
 *
 * Epic spell · Neutral faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Give all friendly units +1/+1 permanently.
 *    When the season ends, those who survived carry its lessons forever."
 *
 * Lore: The Season 1 seasonal event marks the conclusion of an era in
 * the Dischordian Saga. Season's End channels the accumulated
 * experience of an entire season into a permanent blessing for all
 * allied units — the lessons of survival made manifest.
 *
 * Reward: Complete the Season 1 seasonal event.
 *
 * Balance: 3 cost spell. Permanent AoE +1/+1 is worth ~3-4 mana
 * depending on board state. On budget for a conditional AoE buff.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_seasonal_s1" as CardDefinition["id"],
  name: "Season's End",
  faction: "neutral",
  cardType: "spell",
  rarity: "epic",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "se_buff_all_allies" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_seasonal_s1.webp",
  flavorText:
    "The Saga does not end. It transforms. And those who endure the transformation are remade.",
  rulesVersion: "1.0.0",
};
