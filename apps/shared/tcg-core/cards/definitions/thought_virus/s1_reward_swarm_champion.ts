/**
 * s1_reward_swarm_champion — Terminus Protocol
 *
 * Epic spell · Thought Virus faction · 4 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Deal 2 damage to all enemy units.
 *    When the swarm reaches critical mass, there is only one protocol."
 *
 * Lore: Surviving wave 50 or beyond in the Terminus Swarm means the
 * player has mastered the art of controlled devastation — burning the
 * swarm back faster than it can regenerate. Terminus Protocol is the
 * nuclear option: a broad-spectrum purge that scorches every enemy
 * on the field.
 *
 * Reward: Survive wave 50+ in Terminus Swarm.
 *
 * Balance: 4 cost spell. Deal 2 to all enemies is strong AoE (~4 mana
 * value depending on board). Fair at 4 cost for reward-exclusive.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_swarm_champion" as CardDefinition["id"],
  name: "Terminus Protocol",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "epic",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "tp_aoe_damage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
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
    "Fifty waves. Then silence. The Protocol does not distinguish between the infected and the merely unlucky.",
  rulesVersion: "1.0.0",
};
