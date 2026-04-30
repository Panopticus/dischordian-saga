/**
 * s1_spell_124 — Ark Emergency Protocol
 *
 * Common spell · Neutral faction · 2 cost
 *
 * Oracle text:
 *   "Heal your general for 5. The Ark's emergency systems activate —
 *    a final safeguard from an Age that still remembers how to protect."
 *
 * Direct general heal — a universal survival tool available to all factions.
 * The Ark, that ancient vessel that carried civilization between Ages,
 * still maintains emergency protocols that anyone can invoke. A lifeline
 * from a more hopeful time.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_124" as CardDefinition["id"],
  name: "Ark Emergency Protocol",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "aep_heal_general_5" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 5 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_124.webp"),
  flavorText:
    "The Ark was built to endure the end of Ages. Its emergency systems still hum in the walls, waiting for someone desperate enough to ask.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
