/**
 * s1_song_084 — Judgment Day
 *
 * Uncommon spell · Neutral faction · 2 cost
 * Keywords: (none — the spell grants a shield effect to a chosen friendly
 *            unit via forcefield_charges counters)
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken."
 *
 * Design interpretation: mechanically identical to Shades of Grey
 * (s1_song_079) — targets a friendly unit chosen by the player at cast
 * time and adds 2 forcefield_charges counters. The only difference is
 * rarity (uncommon vs. common), which affects deckbuilding limits and
 * draft weight but not in-game mechanics.
 *
 * Golden tests: test/cards/neutral/s1_song_084_judgment_day.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_song_084" as CardDefinition["id"],
  name: "Judgment Day",
  faction: "neutral",
  cardType: "spell",
  rarity: "uncommon",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "jdy_grant_shield_2" as CardDefinition["abilities"][number]["id"],
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
  art: "/art/cards/s1_song_084.webp",
  flavorText:
    "When the reckoning arrives, only the shielded will endure its verdict.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
};
