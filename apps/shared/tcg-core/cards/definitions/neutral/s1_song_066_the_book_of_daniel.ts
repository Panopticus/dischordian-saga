/**
 * s1_song_066 — The Book of Daniel 2.0
 *
 * Epic spell · Neutral faction · 4 cost
 * Keywords: (none)
 *
 * On cast, the player selects a friendly unit. That unit receives
 * 3 forcefield_charges counters (shield) and a +3/0 stat buff that
 * lasts until end of turn. Both effects resolve as a sequence.
 *
 * Golden tests: test/cards/neutral/s1_song_066_the_book_of_daniel.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_song_066" as CardDefinition["id"],
  name: "The Book of Daniel 2.0",
  faction: "neutral",
  cardType: "spell",
  rarity: "epic",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "bod_shield_and_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "add_counter",
              kind: "forcefield_charges",
              amount: 3,
              to: { kind: "it" },
            },
            {
              op: "buff",
              stats: { power: 3, health: 0 },
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: "/art/cards/s1_song_066.webp",
  flavorText:
    "The second edition rewrites prophecy as a weapon — shield in one hand, fire in the other.",
  rulesVersion: "1.0.0",
};
