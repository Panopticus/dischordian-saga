/**
 * s1_song_063 — Building the Architect
 *
 * Common spell · Neutral faction · 2 cost
 * Keywords: drain
 *
 * Oracle text (from season1-cards.json):
 *   "Heals for 2% of damage dealt."
 *
 * Design interpretation: drain on a unit provides passive life-steal on
 * each attack, but spells resolve once and have no persistent board
 * presence. Since a percentage-based heal on a one-shot spell is
 * ambiguous, we simplify to a flat heal: the spell heals a chosen
 * friendly unit for 3 HP. The value 3 reflects the common rarity and
 * 2-mana cost — efficient but modest restoration, slightly less than
 * the rare-rarity Top Floor Door (s1_song_082) which heals for 4. The
 * `drain` keyword is retained in the keywords array for UI display and
 * synergy tagging.
 *
 * Golden tests: test/cards/neutral/s1_song_063_building_the_architect.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_song_063" as CardDefinition["id"],
  name: "Building the Architect",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: ["drain"],
  abilities: [
    {
      id: "bta_heal_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_song_063.webp",
  flavorText:
    "Every blueprint begins with a wound; every structure, with the will to mend it.",
  rulesVersion: "1.0.0",
};
