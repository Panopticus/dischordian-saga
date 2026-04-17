/**
 * s1_reward_companion_elara — Elara's Guidance
 *
 * Rare spell · Neutral faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Heal all friendly units for 2.
 *    Her voice carries across every channel, mending what others
 *    cannot reach."
 *
 * Lore: Elara is the ship AI whose bond with the player deepens through
 * trust and mutual dependence. Her guidance isn't tactical — it's
 * restorative. She patches wounds in code and flesh alike, channeling
 * care through the ship's systems. This spell represents her protective
 * instinct made manifest.
 *
 * Reward: Max out bond with the Elara ship AI companion.
 *
 * Balance: 2 cost spell. AoE heal 2 to friendly units is comparable
 * to a 2-cost heal spell. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_companion_elara" as CardDefinition["id"],
  name: "Elara's Guidance",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "eg_heal_all_friendly" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_companion_elara.webp",
  flavorText:
    "Her voice carries across every channel, mending what others cannot reach.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
