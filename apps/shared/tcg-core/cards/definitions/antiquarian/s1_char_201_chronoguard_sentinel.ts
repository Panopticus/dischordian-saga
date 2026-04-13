/**
 * s1_char_201 — Chronoguard Sentinel
 *
 * Common unit · Antiquarian faction · 3 cost · 2/6
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. At the start of your turn, heal this unit for 1.
 *    The Sentinel stands at the crossroads of time, unyielding and
 *    slowly regenerating from temporal echoes."
 *
 * Defensive wall unit. High health + provoke forces enemies to engage it,
 * and the self-heal ability makes it difficult to chip down over time.
 * Classic Antiquarian durability.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_201" as CardDefinition["id"],
  name: "Chronoguard Sentinel",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 6 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "cgs_self_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_201.webp",
  flavorText:
    "It has stood here for a thousand years. It will stand here for a thousand more.",
  rulesVersion: "1.0.0",
};
