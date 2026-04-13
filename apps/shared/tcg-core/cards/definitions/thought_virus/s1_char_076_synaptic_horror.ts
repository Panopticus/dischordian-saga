/**
 * s1_char_076 — Synaptic Horror
 *
 * Epic unit · Thought Virus faction · 6 cost · 7/6
 * Keywords: stealth, deathwatch
 *
 * A nightmare made manifest — hidden until death triggers its emergence.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_076" as CardDefinition["id"],
  name: "Synaptic Horror",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 7, health: 6 },
  keywords: ["backstab", "deathwatch"],
  abilities: [
    {
      id: "sh_deathwatch_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_076.webp",
  flavorText:
    "It lives in the gap between a dying thought and the silence that follows.",
  rulesVersion: "1.0.0",
};
