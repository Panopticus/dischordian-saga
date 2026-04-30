/**
 * s1_song_061 — The Enigma's Lament
 *
 * Common spell · Neutral faction · 1 cost
 * Keywords: (none on the spell itself — the spell grants the shield effect
 *            to a chosen friendly unit via counters)
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken."
 *
 * Ambiguity resolution: the source text reads as if spoken by a unit with
 * the shield keyword, but this is a *spell* — it has no board presence
 * itself. The only sensible interpretation is that the spell *grants*
 * shield to a target. We pick a chosen friendly unit (player picks at
 * cast time) and add 2 forcefield_charges counters, matching how the
 * engine models forcefield.
 *
 * Why not grant the `forcefield` keyword directly? Forcefield in our
 * model absorbs the first damage *instance* per turn, not a fixed total.
 * "Absorbs the first 2 damage taken" is a *shield*, i.e. a damage pool
 * that shrinks as it's consumed. Counters are the right abstraction:
 * the damage pipeline reads `forcefield_charges` on hit and subtracts
 * incoming damage from the counter before health.
 *
 * This is a spell, so its only trigger is `on_cast`. The ability uses
 * a `with_target` wrapper whose selector prompts the player for a
 * friendly unit, and the inner effect adds 2 forcefield_charges to "it"
 * (the resolved target, as opposed to "self" which would be meaningless
 * for a spell).
 *
 * Golden tests: test/cards/neutral/s1_song_061_the_enigmas_lament.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_song_061" as CardDefinition["id"],
  name: "The Enigma's Lament",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "elg_grant_shield_2" as CardDefinition["abilities"][number]["id"],
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
  art: assetUrl("art/cards/s1_song_061.webp"),
  flavorText:
    "A haunting meditation on identity and loss, this song channels the voice of The Enigma, the mysterious entity whose true nature is never what it first seems.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 1,
};
