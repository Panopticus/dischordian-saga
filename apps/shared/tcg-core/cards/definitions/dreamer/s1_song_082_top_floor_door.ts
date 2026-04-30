/**
 * s1_song_082 — Top Floor Door
 *
 * Rare spell · Dreamer faction · 4 cost
 * Keywords: drain
 *
 * Oracle text (from season1-cards.json):
 *   "Heals for 2% of damage dealt."
 *
 * Design interpretation: the drain keyword on a unit would provide
 * passive life-steal on each attack, but spells resolve once and have
 * no persistent board presence. Since a percentage-based heal on a
 * one-shot spell is ambiguous (2% of what damage?), we simplify this
 * to a flat heal: the spell heals a chosen friendly unit for 4 HP.
 * The value 4 reflects the rare rarity and 4-mana cost — a meaningful
 * but not game-breaking restoration. The `drain` keyword is retained
 * in the keywords array for UI display and synergy tagging.
 *
 * Golden tests: test/cards/dreamer/s1_song_082_top_floor_door.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_song_082" as CardDefinition["id"],
  name: "Top Floor Door",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: ["drain"],
  abilities: [
    {
      id: "tfd_heal_4" as CardDefinition["abilities"][number]["id"],
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
          amount: { kind: "const", value: 4 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_song_082.webp"),
  flavorText:
    "Behind the last door at the top of the stairwell, the Dreamer found not answers but restoration.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
