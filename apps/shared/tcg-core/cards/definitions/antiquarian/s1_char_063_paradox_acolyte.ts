/**
 * s1_char_063 — Paradox Acolyte
 *
 * Common unit · Antiquarian faction · 1 cost · 1/2
 * Keywords: rebirth
 *
 * A novice time-walker who returns from death with fragmented memories.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_063" as CardDefinition["id"],
  name: "Paradox Acolyte",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: ["rebirth"],
  abilities: [
    // --- Temporal Echo: heal friendly general 3 on death ---
    {
      id: "paradox_death_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 3 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/s1_char_063.webp",
  flavorText:
    "She has died a hundred times and learned nothing from any of them.",
  rulesVersion: "1.0.0",
};
