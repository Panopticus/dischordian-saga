/**
 * s1_char_085 — Sector Warden
 *
 * Rare unit · New Babylon faction · 5 cost · 5/6
 * Keywords: ranged, forcefield
 *
 * A mid-rank officer who oversees a city sector from fortified
 * watchtowers, striking from range behind protective barriers.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_085" as CardDefinition["id"],
  name: "Sector Warden",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["ranged", "forcefield"],
  abilities: [
    {
      id: "sw_patrol_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_end", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_085.webp",
  flavorText:
    "From the watchtower, every street is a firing lane. Every citizen, a potential target.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
