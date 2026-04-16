/**
 * s1_reward_casino_slots — Lucky Spinner
 *
 * Common unit · Neutral faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 1 damage to a random enemy.
 *    Pull the lever. Watch the reels. Hope the universe cooperates."
 *
 * Lore: The Void Slots are a hypnotic trap of light and sound — most
 * players walk away empty-handed, but those who hit three jackpots
 * earn the Lucky Spinner, a minor automaton infused with residual
 * Casino luck. It arrives on the field and immediately lashes out at
 * a random foe, mimicking the unpredictable payout of the slots.
 *
 * Reward: Hit 3 jackpots in Void Slots.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Deal 1
 * random damage ~0.5 stat. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_casino_slots" as CardDefinition["id"],
  name: "Lucky Spinner",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "ls_random_damage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_casino_slots.webp",
  flavorText:
    "Three cherries. Three jackpots. Three enemies who wished they'd stayed in bed.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
