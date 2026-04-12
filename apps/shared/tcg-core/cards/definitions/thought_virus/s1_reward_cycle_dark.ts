/**
 * s1_reward_cycle_dark — Dusk Herald
 *
 * Rare unit · Thought Virus faction · 3 cost · 3/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 2 damage to the enemy general.
 *    When the Cycle turns dark, the Herald is the first to announce it."
 *
 * Lore: The Dischordia Cycle's dark phase is the Thought Virus's domain
 * — a period when entropy accelerates and the boundaries between
 * identities blur. The Dusk Herald rides the wave of darkness,
 * striking directly at the enemy's leadership on arrival. Players who
 * survive the full dark cycle earn this card.
 *
 * Reward: Complete a full dark phase of the Dischordia Cycle.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Deal 2 to
 * enemy general ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_cycle_dark" as CardDefinition["id"],
  name: "Dusk Herald",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "dh_burn_general" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 2 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The light dies in stages. The Herald names each stage as it passes, like a priest reading last rites.",
  rulesVersion: "1.0.0",
};
