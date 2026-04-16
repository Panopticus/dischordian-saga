/**
 * s1_char_054 — Panoptic Drone
 *
 * Common unit · Panopticon faction · 1 cost · 1/2
 * Keywords: flying
 *
 * The cheapest Panopticon unit — a tiny aerial scout.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_054" as CardDefinition["id"],
  name: "Panoptic Drone",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: ["flying"],
  abilities: [
    // --- Data Transmitted: draw 1 card on death ---
    {
      id: "panoptic_death_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_char_054.webp",
  flavorText:
    "A speck against the grey sky — but it sees everything beneath it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive", "reactive"] as const,
};
