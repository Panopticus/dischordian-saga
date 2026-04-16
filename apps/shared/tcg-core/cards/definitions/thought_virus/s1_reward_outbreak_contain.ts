/**
 * s1_reward_outbreak_contain — Quarantine Field
 *
 * Rare spell · Thought Virus faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Deal 2 damage to all enemy units.
 *    Containment is just destruction with better paperwork."
 *
 * Lore: The Outbreak game mode challenges players to contain spreading
 * infections. Successfully containing an outbreak — without a cure —
 * requires the Thought Virus's own tools turned against it. The
 * Quarantine Field represents aggressive containment: scorching
 * infected zones to prevent spread, dealing AoE damage to all enemies.
 *
 * Reward: Successfully contain an outbreak in Outbreak mode.
 *
 * Balance: 3 cost spell. Deal 2 to all enemies is strong AoE (~3 mana
 * value depending on board). Fair at 3 cost for reward-exclusive.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_outbreak_contain" as CardDefinition["id"],
  name: "Quarantine Field",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "qf_aoe_damage" as CardDefinition["abilities"][number]["id"],
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
  art: "/art/cards/s1_reward_outbreak_contain.webp",
  flavorText:
    "The quarantine zone expanded three times. Each time, fewer voices came from inside.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
