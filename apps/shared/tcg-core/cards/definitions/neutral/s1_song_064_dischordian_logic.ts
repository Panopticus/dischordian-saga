/**
 * s1_song_064 — Dischordian Logic
 *
 * Epic spell · Neutral faction · 6 cost
 * Keywords: overcharge
 *
 * On cast, the player selects an enemy unit. That unit takes 5 damage.
 * The `overcharge` keyword is retained in the keywords array for UI
 * display and synergy tagging.
 *
 * Golden tests: test/cards/neutral/s1_song_064_dischordian_logic.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_song_064" as CardDefinition["id"],
  name: "Dischordian Logic",
  faction: "neutral",
  cardType: "spell",
  rarity: "epic",
  cost: 6,
  keywords: ["overcharge"],
  abilities: [
    {
      id: "dl_deal_damage_5" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 5 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_song_064.webp"),
  flavorText:
    "In the paradox engine of Dischord, contradictions are not errors — they are ammunition.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
