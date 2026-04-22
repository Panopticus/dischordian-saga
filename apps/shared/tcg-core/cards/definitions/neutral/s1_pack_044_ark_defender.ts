/**
 * s1_pack_044 — Ark Defender
 *
 * Common unit · Neutral faction · 3 cost · 3/4
 *
 * Oracle text:
 *   "On deploy, gain +0/+1. Forged in the Ark's foundries —
 *    built to endure."
 *
 * A neutral common with solid stats. The deploy buff creates an
 * effective 3/5 for 3 mana — above the vanilla curve and a
 * reliable body for any faction's deck. Simple, effective, and
 * universally playable.
 *
 * Mechanical model:
 *  - On deploy, buff self +0/+1 permanently. Effective statline: 3/5.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_044" as CardDefinition["id"],
  name: "Ark Defender",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "ad_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_044.webp"),
  flavorText:
    "The Ark's defenders were built without faction markings. They defend the ship, not the ideology.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
