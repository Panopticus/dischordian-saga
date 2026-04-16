/**
 * s1_pack_021 — Starlight Familiar
 *
 * Common unit · Dreamer faction · 1 cost · 1/1
 * Keywords: flying
 *
 * Oracle text:
 *   "Flying. On death, draw 1 card. A mote of light that burns briefly
 *    but leaves knowledge in its wake."
 *
 * A 1-mana flying cantrip. The tiny body trades poorly, but flying
 * allows it to reach backline threats, and the death draw ensures
 * it always replaces itself. Excellent for early chip damage and
 * maintaining hand size in the Dreamer's card-advantage strategy.
 *
 * Mechanical model:
 *  - Flying: intrinsic keyword. On death, draw 1 card.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_021" as CardDefinition["id"],
  name: "Starlight Familiar",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 1 },
  keywords: ["flying"],
  abilities: [
    {
      id: "sf_death_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_pack_021.webp",
  flavorText:
    "It lived for the span of a single thought. But what a thought it was.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive", "reactive"] as const,
};
