/**
 * s1_song_079 — Shades of Grey
 *
 * Common spell · Neutral faction · 2 cost
 * Keywords: (none — the spell grants a shield effect to a chosen friendly
 *            unit via forcefield_charges counters)
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken."
 *
 * Design interpretation: identical mechanic to The Enigma's Lament
 * (s1_song_061) but at a higher mana cost of 2. The spell targets a
 * friendly unit chosen by the player at cast time and adds 2
 * forcefield_charges counters, creating a damage-absorbing shield that
 * the engine's damage pipeline will decrement before subtracting health.
 *
 * Golden tests: test/cards/neutral/s1_song_079_shades_of_grey.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_song_079" as CardDefinition["id"],
  name: "Shades of Grey",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sog_grant_shield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "add_counter",
          kind: "forcefield_charges",
          amount: 2,
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_song_079.webp"),
  flavorText:
    "Between black and white lies a spectrum of doubt — and within it, a fragile protection.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 1,
};
