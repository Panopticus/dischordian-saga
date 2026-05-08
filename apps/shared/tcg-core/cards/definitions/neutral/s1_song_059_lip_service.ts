/**
 * s1_song_059 — Lip Service
 *
 * Rare spell · Neutral faction · 4 cost
 * Keywords: (none)
 *
 * On cast, the player selects a friendly unit. That unit receives 2
 * forcefield_charges counters, granting it a damage-absorption shield
 * of 2. The engine's damage pipeline reads `forcefield_charges` on hit
 * and subtracts incoming damage from the counter before health.
 *
 * Golden tests: test/cards/neutral/s1_song_059_lip_service.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_song_059" as CardDefinition["id"],
  name: "Lip Service",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "ls_grant_shield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "add_counter",
          kind: "forcefield_charges",
          amount: 2,
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_song_059.webp"),
  flavorText:
    "Words may be hollow, but the right incantation can turn them into a barrier no blade can breach.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
