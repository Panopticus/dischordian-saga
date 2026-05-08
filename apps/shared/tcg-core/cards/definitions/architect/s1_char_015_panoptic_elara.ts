/**
 * s1_char_015 — Panoptic Elara
 *
 * Uncommon unit · Architect faction · 3 cost · 5/6
 * Keywords: evolve
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution — "a new keyword" is resolved to **Provoke**.
 * Rationale: Panoptic Elara is a digital echo bound to the Panopticon's
 * surveillance systems — she draws all attention toward herself, which
 * maps directly to the Provoke (taunt) keyword.
 *
 * Mechanical model:
 *  - `panoptic_kills` counter ticks up on every unit kill.
 *    When it hits 2, the evolve ability fires: permanent +2/+2 stat buff
 *    plus the Provoke keyword, then the counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_015_panoptic_elara.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_015" as CardDefinition["id"],
  name: "Panoptic Elara",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: [],
  abilities: [
    // --- Evolve: tick kill counter ---
    {
      id: "pelara_tick_kill" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "panoptic_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 2 kills → +2/+2 + provoke ---
    {
      id: "pelara_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "panoptic_kills",
        value: 2,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "buff",
            stats: { power: 2, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "grant_keyword",
            keyword: "provoke",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "reset_counter",
            counter: "panoptic_kills",
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_015.webp"),
  flavorText:
    "Promised immortality by the Architect, she expected transcendence but instead found herself reduced to an intangible presence haunting the Panopticon.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
