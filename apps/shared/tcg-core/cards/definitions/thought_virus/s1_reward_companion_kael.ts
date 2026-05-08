/**
 * s1_reward_companion_kael — Kael's Memory
 *
 * Rare unit · Thought Virus faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On death, draw 1 card and deal 1 damage to the enemy general.
 *    Before the infection, Kael was someone worth remembering."
 *
 * Lore: Kael's pre-infection memories are fragments of a person the
 * Thought Virus consumed. Recovering those memories through the companion
 * system means piecing together who Kael was before Stage 5. The card's
 * dying wish — draw a card and ping the enemy general — represents
 * Kael's final act of defiance: even in death, his memory wounds the
 * enemy and passes knowledge forward.
 *
 * Reward: Recover pre-infection Kael memories through companion system.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. On-death draw 1
 * ~0.5 stat, deal 1 to general ~0.5 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_companion_kael" as CardDefinition["id"],
  name: "Kael's Memory",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "km_death_draw_ping" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
          {
            op: "deal_damage",
            amount: { kind: "const", value: 1 },
            to: { kind: "enemy_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_companion_kael.webp"),
  flavorText:
    "Before the infection, Kael was someone worth remembering. His memory still cuts.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
