/**
 * s1_spell_101 — Predetermined Outcome
 *
 * Uncommon spell · Architect faction · 3 cost
 *
 * Oracle text:
 *   "Give a friendly unit +2/+2 permanently. The result was never in doubt."
 *
 * Permanent stat buff to a chosen friendly unit. The Architect doesn't gamble —
 * outcomes are predetermined at the moment of design. This spell represents
 * deploying a calculated enhancement that was always part of the plan.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_101" as CardDefinition["id"],
  name: "Predetermined Outcome",
  faction: "architect",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "po_buff_unit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 2, health: 2 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_101.webp",
  flavorText:
    "The Architect foresaw the end long before anyone else glimpsed the beginning. Every enhancement is a correction toward inevitability.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
