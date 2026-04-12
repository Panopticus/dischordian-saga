/**
 * s1_char_103 — Inception Ark Sentry
 *
 * Common unit · Architect faction · 2 cost · 2/3
 * Keywords: ranged
 *
 * Oracle text:
 *   "Attacks from range. The Inception Ark's defense grid fires
 *    upon any who approach the cradle of the Living Universe."
 *
 * Lore: The Inception Ark is where the Architect's grand design began —
 * the vessel that carries the seed of the Living Universe's rewrite.
 * These sentries guard the Ark with long-range weapons, firing from
 * hardened positions. They represent the Architect's first line of
 * defense, the perimeter of a god's nursery.
 *
 * Mechanical model:
 *  - Ranged: may attack any tile, takes no counterattack damage.
 *    Intrinsic keyword, no additional abilities.
 *
 * Golden tests: test/cards/architect/s1_char_103_inception_ark_sentry.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_103" as CardDefinition["id"],
  name: "Inception Ark Sentry",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["ranged"],
  abilities: [
    // --- Final Salvo: deal 2 damage to a random enemy on death ---
    {
      id: "ark_sentry_death_strike" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/103_inception_ark_sentry.png",
  flavorText:
    "The Ark remembers every wavelength that has ever approached its hull. The sentries ensure none approach twice.",
  rulesVersion: "1.0.0",
};
