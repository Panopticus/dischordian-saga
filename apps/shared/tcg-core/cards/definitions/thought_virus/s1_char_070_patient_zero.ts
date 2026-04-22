/**
 * s1_char_070 — Patient Zero
 *
 * Legendary unit · Thought Virus faction · 7 cost · 8/9
 * Keywords: deathwatch, drain
 *
 * The original carrier of the Thought Virus — a walking plague
 * that feeds on death around it.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_070" as CardDefinition["id"],
  name: "Patient Zero",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 8, health: 9 },
  keywords: ["deathwatch", "drain"],
  abilities: [
    {
      id: "pz_deathwatch_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "deal_damage",
            amount: { kind: "const", value: 1 },
            to: { kind: "enemy_general" },
          },
          {
            op: "heal",
            amount: { kind: "const", value: 1 },
            to: { kind: "self" },
          },
        ],
      },
    },
    {
      id: "pz_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_070.webp"),
  flavorText:
    "The first mind to crack open and let the signal through. Every infection since has been an echo of that original scream.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative", "offensive", "reactive"] as const,
  verdict_delta: 2,
};
