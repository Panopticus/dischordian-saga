/**
 * s1_spell_225 — Bounty Notice
 *
 * Uncommon spell · New Babylon faction · 3 cost
 *
 * Oracle text:
 *   "Destroy an enemy unit with exactly 1 health. The bounty is posted.
 *    The target is marked. There is no appeal."
 *
 * Conditional hard removal. Only works on units at exactly 1 health,
 * but destroys them outright regardless of other protections. Pairs well
 * with chip damage to set up the execution.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_225" as CardDefinition["id"],
  name: "Bounty Notice",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "bn_destroy_1hp" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent", maxStats: { health: 1 } },
          chooser: "player",
        },
        do: {
          op: "destroy",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_225.webp"),
  flavorText:
    "The notice goes up at dawn. By noon, the work is done.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
