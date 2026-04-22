/**
 * s1_song_065 — Sixth Sense
 *
 * Rare spell · Neutral faction · 5 cost
 * Keywords: drain
 *
 * On cast, the player selects a friendly unit. That unit is healed
 * for 5 HP. The `drain` keyword is retained in the keywords array for
 * UI display and synergy tagging.
 *
 * Golden tests: test/cards/neutral/s1_song_065_sixth_sense.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_song_065" as CardDefinition["id"],
  name: "Sixth Sense",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: ["drain"],
  abilities: [
    {
      id: "ss_heal_5" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 5 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_song_065.webp"),
  flavorText:
    "Some call it intuition, others call it premonition — the healed simply call it a second chance.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
