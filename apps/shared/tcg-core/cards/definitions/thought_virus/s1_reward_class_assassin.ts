/**
 * s1_reward_class_assassin — Master Assassin
 *
 * Rare unit · Thought Virus faction · 3 cost · 4/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 2 damage to an enemy unit.
 *    The kill is decided before the blade is drawn."
 *
 * Lore: Mastering the Assassin class means the player has perfected
 * lethal precision — striking at the exact moment of vulnerability.
 * The Master Assassin arrives with explosive tempo: rush lets it attack
 * immediately, and its deploy ability picks off a weakened target. In
 * the Thought Virus faction, assassination is a form of infection —
 * the target's death spreads fear like a contagion.
 *
 * Reward: Master the Assassin class.
 *
 * Balance: 3 cost · 4/2 = 6 stats. Budget = 3*2+1 = 7. Rush keyword
 * costs 1 stat. Deploy deal 2 ~1 stat. 7 - 2 = 5. Slightly under but
 * rush + removal is premium tempo. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_class_assassin" as CardDefinition["id"],
  name: "Master Assassin",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "ma_rush_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    {
      id: "ma_deploy_damage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_class_assassin.webp"),
  flavorText:
    "The kill is decided before the blade is drawn.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
