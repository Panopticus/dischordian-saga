/**
 * s1_char_092 — Ruin Stalker
 *
 * Rare unit · Neutral · 5 cost · 6/5
 * Keywords: stealth, pierce
 *
 * A deadly predator from the wastelands between factions,
 * emerging from ruins to ambush the unwary.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_092" as CardDefinition["id"],
  name: "Ruin Stalker",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 6, health: 5 },
  keywords: ["backstab", "pierce"],
  abilities: [
    {
      id: "rs_predator_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "buff",
        stats: { power: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_092.webp",
  flavorText:
    "In the ruins of the old world, something still hunts. It does not remember what it was — only what it is hungry for.",
  rulesVersion: "1.0.0",
};
