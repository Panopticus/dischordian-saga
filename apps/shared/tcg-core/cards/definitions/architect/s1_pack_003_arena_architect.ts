/**
 * s1_pack_003 — Arena Architect
 *
 * Rare unit · Architect faction · 5 cost · 4/6
 *
 * Oracle text:
 *   "On deploy, summon a 1/1 Calculation token on a random empty tile.
 *    The Arena was not discovered — it was designed."
 *
 * A premium midrange body that generates board presence on arrival.
 * The Calculation token provides an extra body for trades, buffs,
 * or positional advantage. Two bodies from one card is strong value.
 *
 * Mechanical model:
 *  - On deploy, summon a tok_calculation (1/1) at a random empty tile.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_003" as CardDefinition["id"],
  name: "Arena Architect",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "aa_summon_token" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "summon",
        tokenId: "tok_calculation",
        at: { kind: "random_empty" },
        controller: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_003.webp"),
  flavorText:
    "She does not enter the Arena. She builds a new one around you — with you already inside.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
