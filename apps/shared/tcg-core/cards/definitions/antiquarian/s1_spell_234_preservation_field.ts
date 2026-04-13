/**
 * s1_spell_234 — Preservation Field
 *
 * Common spell · Antiquarian faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit +0/+4 permanently. The Antiquarian encases
 *    the unit in a temporal stasis shell — time cannot touch it."
 *
 * Heavy defensive buff. +4 health makes almost any unit a durable blocker.
 * The Antiquarian specializes in preservation — keeping things alive
 * far beyond their natural expiration.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_234" as CardDefinition["id"],
  name: "Preservation Field",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "pf_buff_04" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { health: 4 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_234.webp",
  flavorText:
    "The field hums with deep time. Inside it, entropy is merely a suggestion.",
  rulesVersion: "1.0.0",
};
