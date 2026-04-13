/**
 * s1_reward_chess_win — Grandmaster's Gambit
 *
 * Rare unit · Architect faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, stun an enemy unit for 1 turn.
 *    The Grandmaster sees seven moves ahead. You are on move three."
 *
 * Lore: The Chess game mode tests pure strategic thinking — the
 * Architect's domain. Winning a Chess match proves the player can
 * think like the Architect: methodical, patient, decisive. The
 * Grandmaster's Gambit stuns an enemy on arrival, representing the
 * paralyzing effect of a perfectly anticipated move.
 *
 * Reward: Win a Chess match.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Stun 1 turn
 * ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_chess_win" as CardDefinition["id"],
  name: "Grandmaster's Gambit",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "gg_stun_enemy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The Architect plays chess with civilizations. The Grandmaster learned from watching.",
  rulesVersion: "1.0.0",
};
