/**
 * s1_reward_casino_poker — Nebula Shark
 *
 * Rare unit · New Babylon faction · 4 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, opponent discards 1 random card.
 *    She reads your hand before you've looked at it yourself."
 *
 * Lore: Nebula Poker is played in the smoke-filled back rooms of
 * New Babylon's orbital casinos, where fortunes and secrets change
 * hands with every deal. Winning 10 hands earns respect — and the
 * Nebula Shark, a card sharp who strips opponents of resources the
 * moment she enters play. Her discard mirrors the psychological
 * warfare of the poker table.
 *
 * Reward: Win 10 Nebula Poker hands.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Opponent
 * random discard ~2 stats. 9 - 2 = 7. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_casino_poker" as CardDefinition["id"],
  name: "Nebula Shark",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "ns_opponent_discard" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "discard",
        amount: { kind: "const", value: 1 },
        from: "opponent",
        mode: "random",
      },
    },
  ],
  art: "/art/cards/s1_reward_casino_poker.webp",
  flavorText:
    "She reads your hand before you've looked at it yourself.",
  rulesVersion: "1.0.0",
};
