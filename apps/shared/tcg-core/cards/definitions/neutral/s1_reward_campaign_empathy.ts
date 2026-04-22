/**
 * s1_reward_campaign_empathy — Compassion Protocol
 *
 * Rare spell · Neutral faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Heal all friendly units for 2. In a world built on control,
 *    compassion is the most radical protocol of all."
 *
 * Lore: Completing the campaign with the Empathy axis dominant reveals
 * that the Saga's deepest power lies not in destruction but in
 * preservation. The Compassion Protocol is an ancient subroutine
 * buried in the Ark's systems — activated only by those who chose
 * mercy at every crossroads.
 *
 * Reward: Complete the campaign with Empathy axis dominant.
 *
 * Balance: 2 cost spell. AoE heal 2 to friendly units is comparable
 * to a 2-cost heal spell. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_campaign_empathy" as CardDefinition["id"],
  name: "Compassion Protocol",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "cp_heal_all_friendly" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
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
  art: assetUrl("art/cards/s1_reward_campaign_empathy.webp"),
  flavorText:
    "The Ark's oldest protocol had no military purpose. It simply healed what it could reach.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
