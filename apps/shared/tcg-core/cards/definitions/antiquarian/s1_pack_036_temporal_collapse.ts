/**
 * s1_pack_036 — Temporal Collapse
 *
 * Epic spell · Antiquarian faction · 5 cost
 *
 * Oracle text:
 *   "Return ALL units to their owners' hands. The Antiquarian
 *    erases the present and begins again."
 *
 * Full board bounce at a premium rate. Returns every unit on both
 * sides to hand — a nuclear reset that undoes all board development.
 * At 5 cost (cheaper than Timeline Collapse), this is a powerful
 * tempo play that rewards decks with cheap, high-impact deploy effects.
 * Pack-exclusive board reset.
 *
 * Mechanical model:
 *  - On cast, foreach all units (both sides), return to owner's hand.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_036" as CardDefinition["id"],
  name: "Temporal Collapse",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "epic",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "tc_bounce_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "return_to_hand",
          to: { kind: "it" },
          owner: "original",
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The Antiquarian closed the chapter. Every character returned to the page they came from.",
  rulesVersion: "1.0.0",
};
