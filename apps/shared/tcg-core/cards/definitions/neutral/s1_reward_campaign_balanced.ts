/**
 * s1_reward_campaign_balanced — The Balanced Witness
 *
 * Rare unit · Neutral faction · 4 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card and heal your general for 2.
 *    The Witness sees all sides and takes none — yet benefits from each."
 *
 * Lore: Completing the campaign with a Balanced morality — refusing to
 * lean fully into any single axis — proves the player can hold
 * contradictions without breaking. The Balanced Witness is a figure
 * who exists between factions, gathering wisdom from each without
 * being claimed by any.
 *
 * Reward: Complete the campaign with Balanced morality alignment.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Draw 1 ~1 stat,
 * heal general 2 ~1 stat. 9 - 2 = 7. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_campaign_balanced" as CardDefinition["id"],
  name: "The Balanced Witness",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "bw_draw_heal" as CardDefinition["abilities"][number]["id"],
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
            op: "heal",
            amount: { kind: "const", value: 2 },
            to: { kind: "friendly_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_campaign_balanced.webp"),
  flavorText:
    "She watched the Truth-seekers burn and the Defiant fall. She watched the Empaths weep and the Stoics endure. Then she wrote it all down.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
