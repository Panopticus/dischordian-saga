/**
 * s1_pack_043 — Void Crystal
 *
 * Rare spell · Neutral faction · 0 cost
 *
 * Oracle text:
 *   "Gain 1 permanent mana crystal. The crystal hums with the void's
 *    forgotten potential."
 *
 * A 0-cost mana ramp spell. Free permanent acceleration is incredibly
 * powerful — play it on any turn to stay one mana ahead for the rest
 * of the game. The ultimate pack-exclusive utility card. Every faction
 * wants this.
 *
 * Mechanical model:
 *  - On cast, gain 1 permanent mana crystal.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_043" as CardDefinition["id"],
  name: "Void Crystal",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 0,
  keywords: [],
  abilities: [
    {
      id: "vc_gain_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: true,
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_043.webp"),
  flavorText:
    "It costs nothing to hold. It costs everything to put down.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
