/**
 * s1_spell_213 — Precognition
 *
 * Common spell · Dreamer faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit +0/+3 permanently. To foresee the blow
 *    is to endure it. The Dreamer's gift is survival."
 *
 * Defensive permanent buff. Turns fragile units into durable threats.
 * The Dreamer faction specializes in durability through foresight.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_213" as CardDefinition["id"],
  name: "Precognition",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "pc_buff_03" as CardDefinition["abilities"][number]["id"],
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
          stats: { health: 3 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_213.webp"),
  flavorText:
    "She saw the blade three seconds before it fell. Three seconds was enough.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
