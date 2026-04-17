/**
 * s1_reward_raid_perfect — Unscathed Victor
 *
 * Legendary unit · Neutral faction · 7 cost · 6/8
 * Keywords: forcefield
 *
 * Oracle text:
 *   "Forcefield. On deploy, give self forcefield.
 *    Not a scratch. Not a single scratch."
 *
 * Lore: Completing a raid with zero casualties is a feat of near-impossible
 * coordination and skill. The Unscathed Victor embodies that perfection —
 * a warrior so flawless in defense that the first blow against them simply
 * fails to land. The forcefield represents their legendary invulnerability.
 *
 * Reward: Complete a Coop Raid with zero casualties.
 *
 * Balance: 7 cost · 6/8 = 14 stats. Budget = 7*2+1 = 15. Forcefield
 * keyword costs 1 stat. 15 - 1 = 14. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_raid_perfect" as CardDefinition["id"],
  name: "Unscathed Victor",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 8 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "uv_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 1,
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_raid_perfect.webp",
  flavorText:
    "They asked how she survived the Colossus raid without a wound. She said she didn't survive — she won.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};
