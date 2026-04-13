/**
 * tok_spore_1_1 — Spore
 *
 * Token · Thought Virus faction · 0 cost · 1/1
 * Keywords: deathwatch
 *
 * Summoned by Spore Burst. A parasitic spore that thrives on death,
 * growing more dangerous as bodies fall around it.
 */
import type { CardDefinition } from "../../index";

export const cardDef: CardDefinition = {
  id: "tok_spore_1_1" as CardDefinition["id"],
  name: "Spore",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 1, health: 1 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "spore_dw_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/tok_spore_1_1.webp",
  flavorText:
    "It feeds on endings. Every death is a season of plenty.",
  rulesVersion: "1.0.0",
};
