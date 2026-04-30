/**
 * s1_char_101 — Panoptic Warden Foucault
 *
 * Rare unit · Architect faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "Chrome jaw, genetic reveal. When this unit kills an enemy,
 *    draw a card — surveillance data extracted."
 *
 * Lore: Warden Foucault serves the Architect's panoptic surveillance
 * network. His chrome jaw is a prosthetic installed after a failed
 * Insurgency assassination; his genetic reveal protocols force citizens
 * to bare their DNA to the regime. Every kill yields intelligence.
 *
 * Mechanical model:
 *  - On kill (any unit type), the controller draws 1 card.
 *    This represents the surveillance data harvested from each
 *    defeated enemy.
 *
 * Golden tests: test/cards/architect/s1_char_101_panoptic_warden_foucault.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_101" as CardDefinition["id"],
  name: "Panoptic Warden Foucault",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    // --- Surveillance: draw on kill ---
    {
      id: "foucault_draw_on_kill" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_101.webp"),
  flavorText:
    "His chrome jaw clicks with each question. The answers are already known — the interrogation is merely ceremony.",
  rulesVersion: "1.1.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};
