/**
 * s1_char_093 — Ironclad Veteran
 *
 * Legendary unit · Neutral · 7 cost · 7/9
 * Keywords: provoke, shield, rebirth
 *
 * A legendary neutral anchor — an ageless soldier who has
 * fought for every faction and died for none.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_093" as CardDefinition["id"],
  name: "Ironclad Veteran",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 7, health: 9 },
  keywords: ["provoke", "forcefield", "rebirth"],
  abilities: [
    {
      id: "iv_battle_hardened" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "repeat",
        times: { kind: "count_of", filter: { controller: "opponent" } },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "self" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "He has buried allies under every banner. Now he fights only for the war itself — because it is the one thing that never abandoned him.",
  rulesVersion: "1.0.0",
};
