/**
 * s1_song_070 — Traces of Something Spiritual
 *
 * Uncommon spell · Neutral faction · 3 cost
 * Keywords: (none — the spell grants a shield effect to a chosen friendly
 *            unit via forcefield_charges counters)
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken."
 *
 * Design interpretation: same forcefield-grant mechanic as The Enigma's
 * Lament (s1_song_061) and Shades of Grey (s1_song_079) — targets a
 * friendly unit chosen by the player at cast time and adds 2
 * forcefield_charges counters. Higher mana cost (3) for the same shield
 * value suggests the card carries additional value elsewhere (art,
 * flavor, or future synergy), or reflects draft-balance tuning. The
 * mechanical effect is identical: 2 forcefield_charges.
 *
 * Golden tests: test/cards/neutral/s1_song_070_traces_of_something_spiritual.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_song_070" as CardDefinition["id"],
  name: "Traces of Something Spiritual",
  faction: "neutral",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "tss_grant_shield_2" as CardDefinition["abilities"][number]["id"],
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
  art: "/art/cards/s1_song_070.webp",
  flavorText:
    "Not a ghost, not a god — something in between, lingering at the threshold of perception.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 1,
};
