/**
 * s1_reward_vortex_close — Vortex Seal
 *
 * Rare spell · Dreamer faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Return an enemy unit to its owner's hand.
 *    The vortex opens. The Dreamer closes it. The thing inside goes back."
 *
 * Lore: Closing ten vortex incursions teaches the Dreamer the geometry
 * of dimensional boundaries — how to fold space so that what has arrived
 * is sent back to where it came from. Vortex Seal applies that knowledge
 * to the battlefield: an enemy unit is simply returned to hand, its
 * deployment undone.
 *
 * Reward: Close 10 vortex incursions.
 *
 * Balance: 3 cost spell. Bounce an enemy unit to hand is worth ~3 mana
 * (tempo removal without permanent destruction). On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_vortex_close" as CardDefinition["id"],
  name: "Vortex Seal",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "vs_bounce_enemy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "return_to_hand",
          to: { kind: "it" },
          owner: "original",
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_vortex_close.webp",
  flavorText:
    "The rift screamed as it closed. The creature on the other side screamed louder.",
  rulesVersion: "1.0.0",
};
