/**
 * s1_char_080 — District Enforcer
 *
 * Common unit · New Babylon faction · 2 cost · 3/2
 * Keywords: rush
 *
 * A fast-response unit deployed to quell unrest in the outer districts.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_080" as CardDefinition["id"],
  name: "District Enforcer",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "de_district_sweep" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_080.webp"),
  flavorText:
    "Justice in New Babylon is swift. Appeals are slower — by design.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
