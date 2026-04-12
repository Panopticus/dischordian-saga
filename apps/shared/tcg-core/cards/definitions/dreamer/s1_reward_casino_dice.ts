/**
 * s1_reward_casino_dice — Entropy Roll
 *
 * Common spell · Dreamer faction · 1 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Deal 2 damage to a random enemy unit.
 *    Chaos doesn't choose sides. It just chooses."
 *
 * Lore: Entropy Dice is the Dreamer's game of choice — a game where
 * probability itself is suspect and lucky sevens bend reality. Rolling
 * 7 ten times proves the player can nudge fate. Entropy Roll channels
 * that cosmic nudge into a bolt of random destruction, cheap and
 * unpredictable, just like the dice themselves.
 *
 * Reward: Roll 7 on Entropy Dice 10 times.
 *
 * Balance: 1 cost spell. Deal 2 random damage to an enemy unit is
 * worth ~1 mana. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_casino_dice" as CardDefinition["id"],
  name: "Entropy Roll",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "er_random_damage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Chaos doesn't choose sides. It just chooses.",
  rulesVersion: "1.0.0",
};
