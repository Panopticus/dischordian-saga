/**
 * s1_spell_120 — Timeline Collapse
 *
 * Rare spell · Antiquarian faction · 7 cost
 *
 * Oracle text:
 *   "Return all units to their owners' hands. The Antiquarian folds
 *    the timeline back upon itself, undoing everything."
 *
 * Full board bounce — returns every unit on both sides to hand. A nuclear
 * reset button that embodies the Antiquarian's mastery over temporal
 * mechanics. When the current Age produces an unacceptable outcome, the
 * Antiquarian simply collapses it and begins again.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_120" as CardDefinition["id"],
  name: "Timeline Collapse",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "rare",
  cost: 7,
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
  art: "/art/cards/s1_spell_120.webp",
  flavorText:
    "The Antiquarian closed the book of this Age. Its pages unraveled like ash, and the board stood empty — waiting to be written again.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};
