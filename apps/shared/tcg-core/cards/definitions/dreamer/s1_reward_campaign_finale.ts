/**
 * s1_reward_campaign_finale — Resurrection Protocol
 *
 * Epic spell · Dreamer faction · 5 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Return the last dead friendly unit to your hand.
 *    The Dreamer reaches across the boundary of death itself."
 *
 * Lore: Completing the Season Finale reveals the Dreamer's ultimate
 * protocol — the ability to pull fallen allies back from oblivion. This
 * mirrors the campaign's climactic revelation that death in the Saga is
 * not final, merely a transition between states of being.
 *
 * Reward: Complete the Season Finale campaign chapter.
 *
 * Balance: 5 cost spell. Returning a dead unit to hand is worth ~4-5
 * mana depending on the unit. On budget for a premium effect.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_campaign_finale" as CardDefinition["id"],
  name: "Resurrection Protocol",
  faction: "dreamer",
  cardType: "spell",
  rarity: "epic",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "rp_return_dead" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "return_to_hand",
        to: { kind: "previous_target" },
        owner: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_campaign_finale.webp",
  flavorText:
    "The Dreamer whispered into the void, and the void answered. What returns is changed — but it returns.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
