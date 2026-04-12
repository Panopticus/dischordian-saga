/**
 * s1_char_058 — Epoch Walker
 *
 * Legendary unit · Antiquarian faction · 8 cost · 9/10
 * Keywords: celerity, rebirth
 *
 * A chrono-displaced being that strikes twice and returns from death,
 * echoing the Antiquarian's mastery over stolen time.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_058" as CardDefinition["id"],
  name: "Epoch Walker",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 9, health: 10 },
  keywords: ["celerity", "rebirth"],
  abilities: [
    {
      id: "ew_temporal_reset" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
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
    "He has already lived through the end of every age. Each death is merely a bookmark in a story he has read before.",
  rulesVersion: "1.0.0",
};
