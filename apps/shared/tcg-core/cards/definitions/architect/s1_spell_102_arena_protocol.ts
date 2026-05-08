/**
 * s1_spell_102 — Arena Protocol
 *
 * Rare spell · Architect faction · 4 cost
 *
 * Oracle text:
 *   "Teleport a friendly unit to any empty tile. The Arena reshapes
 *    itself to the Architect's specifications."
 *
 * Positional control spell — teleport a chosen friendly unit to any empty tile
 * on the board. In a positional tactics game, this is premium. The Architect
 * built the Arena; moving pieces within it is trivial.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_102" as CardDefinition["id"],
  name: "Arena Protocol",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "ap_teleport_friendly" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
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
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_102.webp"),
  flavorText:
    "The walls listen. The floor obeys. Every corridor and chamber is an extension of the Architect's will.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
