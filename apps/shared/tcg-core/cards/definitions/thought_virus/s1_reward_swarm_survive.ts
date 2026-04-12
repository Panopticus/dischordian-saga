/**
 * s1_reward_swarm_survive — Swarm Survivor
 *
 * Rare unit · Thought Virus faction · 4 cost · 3/5
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On death, deal 2 damage to all adjacent enemies.
 *    The swarm learned to fear the ones who refused to fall."
 *
 * Lore: Surviving wave 25 of the Terminus Swarm means enduring a
 * relentless tide of infected organisms. The Swarm Survivor carries
 * the scars of that ordeal — a provoke wall that forces engagement,
 * and a death burst that punishes the swarm for finally bringing
 * them down.
 *
 * Reward: Survive wave 25 in Terminus Swarm.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Provoke
 * keyword ~1 stat. On-death AoE 2 adjacent ~0.5 stat (conditional).
 * 9 - 1.5 = 7.5 ~ 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_swarm_survive" as CardDefinition["id"],
  name: "Swarm Survivor",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "ss_death_burst" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
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
    "Wave twenty-five broke against her. She broke it back.",
  rulesVersion: "1.0.0",
};
