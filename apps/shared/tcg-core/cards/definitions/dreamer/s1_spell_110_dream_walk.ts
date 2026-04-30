/**
 * s1_spell_110 — Dream Walk
 *
 * Common spell · Dreamer faction · 2 cost
 *
 * Oracle text:
 *   "Teleport a friendly unit to a random empty tile. In dreams,
 *    distance is a suggestion."
 *
 * Repositioning tool — move a friendly unit anywhere on the board.
 * The Dreamer dissolves physical constraints through altered perception.
 * The target steps out of consensus reality and reappears where the
 * Oracle's vision places them.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_110" as CardDefinition["id"],
  name: "Dream Walk",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "dw_teleport_friendly" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "teleport",
          target: { kind: "it" },
          to: { kind: "random_empty" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_110.webp"),
  flavorText:
    "She dreamed of standing elsewhere, and the Arena obliged. Reality is only stubborn for those who lack imagination.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
