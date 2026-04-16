/**
 * s1_spell_204 — Architect's Mandate
 *
 * Uncommon spell · Architect faction · 4 cost
 *
 * Oracle text:
 *   "Summon two 1/1 Calculation tokens on random empty tiles.
 *    The Architect's will given physical form — twice."
 *
 * Board-presence spell. Two tokens give the Architect faction cheap bodies
 * for trades, buff targets, or positional blocking. References tok_calculation.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_204" as CardDefinition["id"],
  name: "Architect's Mandate",
  faction: "architect",
  cardType: "spell",
  rarity: "uncommon",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "am_summon_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "repeat",
        times: { kind: "const", value: 2 },
        do: {
          op: "summon",
          tokenId: "tok_calculation",
          at: { kind: "random_empty" },
          controller: "self",
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_204.webp",
  flavorText:
    "Two points of data. Two vectors of control. The Arena expands at the Architect's whim.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
