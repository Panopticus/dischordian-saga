/**
 * s1_pack_049 — The Inception
 *
 * Legendary unit · Neutral faction · 9 cost · 8/10
 *
 * Oracle text:
 *   "On deploy, give all friendly units +2/+2 permanently and
 *    draw 2 cards. The Living Universe begins."
 *
 * THE ultimate pack chase card. A 9-cost neutral legendary with a
 * massive body and a deploy effect that permanently buffs your entire
 * board while refueling your hand. When this resolves, the game is
 * effectively over. The Inception represents the birth of the Living
 * Universe itself — everything that exists draws strength from its
 * arrival. The definitive Season 1 booster pack finisher.
 *
 * Mechanical model:
 *  - On deploy: sequence of foreach friendly buff +2/+2 permanently,
 *    then draw 2.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_049" as CardDefinition["id"],
  name: "The Inception",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 9,
  baseStats: { power: 8, health: 10 },
  keywords: [],
  abilities: [
    {
      id: "ti_deploy_buff_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self" },
            },
            do: {
              op: "buff",
              stats: { power: 2, health: 2 },
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_049.webp"),
  flavorText:
    "Before the Architect, before the Insurgency, before the Virus and the Dream — there was this. The moment everything began.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
