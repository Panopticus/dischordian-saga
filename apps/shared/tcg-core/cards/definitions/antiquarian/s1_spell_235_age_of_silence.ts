/**
 * s1_spell_235 — Age of Silence
 *
 * Rare spell · Antiquarian faction · 5 cost
 *
 * Oracle text:
 *   "Silence ALL units on the board. The Antiquarian invokes an era
 *    before language, before thought — an age where nothing speaks."
 *
 * Mass silence. Strips abilities, keywords, and ongoing effects from every
 * unit on both sides. Devastating against ability-heavy boards, but also
 * hits your own units. The nuclear option for the temporal scholar.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_235" as CardDefinition["id"],
  name: "Age of Silence",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "aos_mass_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_235.webp"),
  flavorText:
    "Before the first word was spoken, there was the silence. The Antiquarian remembers it well.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
