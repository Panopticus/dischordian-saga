/**
 * s1_char_060 — Relic Keeper
 *
 * Common unit · Antiquarian faction · 2 cost · 2/3
 * Keywords: shield
 *
 * A custodian of ancient artifacts, shielded by the relics she guards.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_060" as CardDefinition["id"],
  name: "Relic Keeper",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["forcefield"],
  abilities: [
    // --- Relic Ward: add 2 forcefield_charges to self on deploy ---
    {
      id: "relic_deploy_charges" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_060.webp"),
  flavorText:
    "The relics protect themselves. She merely gives them someone to protect.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 1,
};
