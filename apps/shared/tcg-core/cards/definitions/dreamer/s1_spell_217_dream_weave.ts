/**
 * s1_spell_217 — Dream Weave
 *
 * Rare spell · Dreamer faction · 5 cost
 *
 * Oracle text:
 *   "Summon three 1/1 Dream Wisp tokens on random empty tiles.
 *    The Dreamer exhales, and the dreamscape populates itself."
 *
 * Board-flooding spell. Three tokens give the Dreamer cheap bodies for
 * trades, blocking, and buff targets. References tok_dream_wisp_1_1.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_217" as CardDefinition["id"],
  name: "Dream Weave",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "dw_summon_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "repeat",
        times: { kind: "const", value: 3 },
        do: {
          op: "summon",
          tokenId: "tok_dream_wisp_1_1",
          at: { kind: "random_empty" },
          controller: "self",
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_217.webp"),
  flavorText:
    "She dreamed of an army. When she woke, they were already marching.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
