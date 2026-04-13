/**
 * s1_reward_xmas_gift — Holiday Surprise
 *
 * Common spell · Neutral faction · 0 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 1. A small gift, freely given."
 *
 * Lore: The Christmas in July gift exchange is a lighthearted seasonal
 * event where players trade surprise packages with strangers. Holiday
 * Surprise captures that generosity as a zero-cost cantrip — a small
 * gift that costs nothing to play and always brings something useful.
 * It's the Saga's reminder that not everything has to be earned
 * through blood.
 *
 * Reward: Participate in the Christmas in July gift exchange.
 *
 * Balance: 0 cost spell. Draw 1 at 0 mana is efficient but minimal
 * impact — essentially a free cycle. On budget for a seasonal reward.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_xmas_gift" as CardDefinition["id"],
  name: "Holiday Surprise",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 0,
  keywords: [],
  abilities: [
    {
      id: "hs_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_xmas_gift.webp",
  flavorText:
    "A small gift, freely given. The wrapping paper was nicer than the contents, but it's the thought that counts.",
  rulesVersion: "1.0.0",
};
