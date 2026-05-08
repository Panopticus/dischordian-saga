/**
 * s1_char_035 — The Jailer
 *
 * Rare unit · Architect faction · 3 cost · 7/7
 * Keywords: taunt, drain
 *
 * Oracle text (from season1-cards.json):
 *   "Enemies in this lane must attack this unit first.
 *    Heals for 2% of damage dealt."
 *
 * Mechanical model:
 *  - Provoke (taunt): listed as an intrinsic keyword. The combat
 *    targeting resolver forces enemy attacks to target units with provoke
 *    before any other friendly unit in the same lane.
 *  - Drain: on_damage_dealt by self, heal self for 1 HP via a permanent
 *    +0/+1 buff. This is the flat approximation of "2% of damage dealt"
 *    used across the drain keyword family (percentage healing is not yet
 *    in the effect DSL). The +0/+1 buff gives a small but meaningful
 *    sustain to the tanky provoke body.
 *
 * Golden tests: test/cards/architect/s1_char_035_the_jailer.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_035" as CardDefinition["id"],
  name: "The Jailer",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Drain: heal 1 per hit via +0/+1 buff ---
    {
      id: "jail_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_035.webp"),
  flavorText:
    "He began as the Oracle, a revered figure who journeyed to Thaloria and bested the Collector in a philosophical debate, c...",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
