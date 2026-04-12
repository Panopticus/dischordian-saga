/**
 * s1_song_062 — The Two Witnesses
 *
 * Uncommon spell · Neutral faction · 3 cost
 * Keywords: overcharge
 *
 * Oracle text (from season1-cards.json):
 *   "Deals +2 damage on first attack, then takes 1 self-damage."
 *
 * Design interpretation: overcharge on a unit grants a one-time damage
 * bonus on its first attack at the cost of self-harm. As a spell, there
 * is no persistent attacker — the card resolves once and leaves play.
 * We interpret the overcharge flavor as a single burst of damage: the
 * spell deals 3 damage to a chosen enemy unit. The value 3 matches the
 * mana cost and reflects the +2 overcharge bonus folded into a base
 * effect. Self-damage has no meaningful target on a spell, so it is
 * omitted. The `overcharge` keyword is retained for UI display and
 * synergy tagging.
 *
 * Golden tests: test/cards/neutral/s1_song_062_the_two_witnesses.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_song_062" as CardDefinition["id"],
  name: "The Two Witnesses",
  faction: "neutral",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: ["overcharge"],
  abilities: [
    {
      id: "ttw_deal_damage_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/placeholder_s1_song_062.png",
  flavorText:
    "They speak in unison, and where their voices converge, the world fractures.",
  rulesVersion: "1.0.0",
};
