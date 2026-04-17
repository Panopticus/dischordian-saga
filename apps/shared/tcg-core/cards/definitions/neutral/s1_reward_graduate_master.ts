/**
 * s1_reward_graduate_master — Legion's Wisdom
 *
 * Rare spell · Neutral faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 2 cards. Heal your general for 2.
 *    The Legion remembers every lesson, every loss, every victory."
 *
 * Lore: Graduating from all academies means the player has absorbed the
 * full breadth of the Legion's training — strategy, survival, medicine,
 * and command. Legion's Wisdom distills that comprehensive education
 * into a burst of resources and recovery: two cards drawn from the deck
 * and healing for the general.
 *
 * Reward: Graduate from all academies in Graduate Legion.
 *
 * Balance: 3 cost spell. Draw 2 ~2.5 mana, heal general 2 ~0.5 mana.
 * Total ~3 mana value. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_graduate_master" as CardDefinition["id"],
  name: "Legion's Wisdom",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "lw_draw_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
          {
            op: "heal",
            amount: { kind: "const", value: 2 },
            to: { kind: "friendly_general" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_reward_graduate_master.webp",
  flavorText:
    "Every academy teaches something different. The graduate who finishes them all learns the one lesson they share: adapt or die.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
