/**
 * s1_reward_syndicate_empire — Syndicate Overlord
 *
 * Epic unit · New Babylon faction · 6 cost · 5/7
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 2 cards.
 *    Five worlds kneel. The Overlord collects tribute from each."
 *
 * Lore: Controlling five worlds in Syndicate World establishes a
 * galactic empire of commerce and coercion. The Syndicate Overlord
 * sits atop that empire — every deployment brings a flood of resources
 * from across the player's holdings, modeled as drawing two cards.
 *
 * Reward: Control 5 worlds in Syndicate World.
 *
 * Balance: 6 cost · 5/7 = 12 stats. Budget = 6*2+1 = 13. Draw 2
 * ~2 stats. 13 - 2 = 11. At 12 stats, slightly above, but draw 2
 * on a 6-drop is fair for reward-tier. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_syndicate_empire" as CardDefinition["id"],
  name: "Syndicate Overlord",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: [],
  abilities: [
    {
      id: "so_draw_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_syndicate_empire.webp",
  flavorText:
    "The fifth world fell without a shot. Its governor took one look at the Overlord's fleet and signed the treaty.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
