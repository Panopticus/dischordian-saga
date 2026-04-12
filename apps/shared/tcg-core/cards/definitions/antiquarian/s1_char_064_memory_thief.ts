/**
 * s1_char_064 — Memory Thief
 *
 * Rare unit · Antiquarian faction · 3 cost · 4/3
 * Keywords: stealth, drain
 *
 * A covert operative who steals memories — and life force — from targets.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_064" as CardDefinition["id"],
  name: "Memory Thief",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["backstab", "drain"],
  abilities: [
    {
      id: "mt_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "He takes only what you will not miss — until you reach for it and find nothing there.",
  rulesVersion: "1.0.0",
};
