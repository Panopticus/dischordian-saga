/**
 * s1_char_113 — Terminus Sovereign
 *
 * Legendary unit · Thought Virus faction · 8 cost · 6/10
 * Keywords: none
 *
 * Oracle text:
 *   "Commands the Seven Bowls. At the start of your turn, deal
 *    1 damage to all enemy units — the plague spreads."
 *
 * Lore: The Terminus Sovereign is the apex predator of the Thought Virus
 * hierarchy, the entity that commands the Seven Bowls — seven stages of
 * cognitive infection that consume civilizations. The Witness identified
 * the Sovereign as the primary threat during the Fall of Reality, a
 * being that does not merely spread infection but orchestrates it like
 * a symphony of annihilation. Each turn it persists, the plague erodes
 * every enemy on the board, representing the relentless, systemic
 * nature of the Thought Virus's assault on the Living Universe.
 *
 * Mechanical model:
 *  - On turn start (owner: "self"), deal 1 damage to all enemy units.
 *    Uses foreach over all opponent-controlled units. The AoE tick
 *    represents the Seven Bowls' passive plague effect.
 *
 * Golden tests: test/cards/thought_virus/s1_char_113_terminus_sovereign.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_113" as CardDefinition["id"],
  name: "Terminus Sovereign",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 6, health: 10 },
  keywords: [],
  abilities: [
    // --- Seven Bowls: deal 1 to all enemies on turn start ---
    {
      id: "ts_seven_bowls" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_113.webp"),
  flavorText:
    "The first bowl is doubt. The second is fear. By the seventh, you have forgotten what it was to be whole.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
