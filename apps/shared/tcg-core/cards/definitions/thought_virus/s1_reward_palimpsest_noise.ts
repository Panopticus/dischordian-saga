/**
 * s1_reward_palimpsest_noise — Noise Agent
 *
 * Rare unit · Thought Virus faction · 3 cost · 4/2
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 2 damage to a random enemy.
 *    The noise does not obscure the truth — it replaces it."
 *
 * Lore: Reaching maximum noise in the Palimpsest means embracing the
 * Thought Virus's paradigm — that reality is just signal, and signal
 * can be overwritten. The Noise Agent is an emissary of that overwrite,
 * arriving with a burst of chaotic damage aimed at a random enemy. The
 * agent does not choose — the noise chooses for it.
 *
 * Reward: Reach maximum noise in Palimpsest.
 *
 * Balance: 3 cost · 4/2 = 6 stats. Budget = 3*2+1 = 7. Deal 2 random
 * ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_palimpsest_noise" as CardDefinition["id"],
  name: "Noise Agent",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "na_random_damage" as CardDefinition["abilities"][number]["id"],
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
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_palimpsest_noise.webp",
  flavorText:
    "She speaks in static. The words mean nothing. The damage is very real.",
  rulesVersion: "1.0.0",
};
