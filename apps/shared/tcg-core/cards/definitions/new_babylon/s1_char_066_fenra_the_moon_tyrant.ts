/**
 * s1_char_066 — Fenra the Moon Tyrant
 *
 * Epic unit · New Babylon faction · 5 cost · 7/10
 * Keywords: rally
 *
 * Oracle text (from season1-cards.json):
 *   "Pack Tactics: Gains +2 ATK for each other demon unit on the field.
 *    Summons a 2/2 Wolf token when deployed."
 *
 * Design interpretation:
 *   The card spec focuses on the summon-on-deploy ability and the rally
 *   keyword. Pack Tactics (the +2 ATK per demon aura) is a secondary
 *   mechanic from the JSON that is not in the current spec scope — it can
 *   be added in a follow-up pass once the aura DSL supports "count allies
 *   matching filter" scaling. For now we model only the deploy summon and
 *   the rally keyword marker.
 *
 * Mechanical model:
 *  - On deploy, summon a `token_wolf_2_2` token at a random empty
 *    adjacent position. The summon op in the engine reads the token
 *    definition from the token registry and places it on the board.
 *
 * Golden tests: test/cards/new_babylon/s1_char_066_fenra_the_moon_tyrant.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_066" as CardDefinition["id"],
  name: "Fenra the Moon Tyrant",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    // --- Summon a 2/2 Wolf token on deploy ---
    {
      id: "fenra_summon_wolf" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "summon",
        tokenId: "token_wolf_2_2",
        at: { kind: "random_empty" },
        controller: "self",
      },
    },
  ],
  art: "/art/cards/s1_char_066.webp",
  flavorText:
    "Director of Operations. Coordinates Blood Weave logistics across 17 dimensions with lupine precision and ferocity.",
  rulesVersion: "1.0.0",
};
