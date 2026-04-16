/**
 * s1_reward_palimpsest_signal — Signal Bearer
 *
 * Rare unit · Dreamer faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card.
 *    The signal is faint but true. Those who carry it see further."
 *
 * Lore: Reaching maximum signal in the Palimpsest proves the player
 * can discern truth from noise in a landscape of layered realities.
 * The Signal Bearer carries that clarity — a living antenna for the
 * Dreamer's frequency. On deployment, they share what they perceive,
 * granting the player a card from their deck.
 *
 * Reward: Reach maximum signal in Palimpsest.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. Draw 1 ~1
 * stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_palimpsest_signal" as CardDefinition["id"],
  name: "Signal Bearer",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "sb_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_palimpsest_signal.webp",
  flavorText:
    "In a world of overwritten truths, the Signal Bearer remembers the original text.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
