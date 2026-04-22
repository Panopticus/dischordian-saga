/**
 * s1_char_091 — Border Scout
 *
 * Common unit · Neutral · 2 cost · 2/2
 * Keywords: ranged, stealth
 *
 * A reconnaissance unit that hides at the edges of contested territory,
 * picking off targets from cover.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_091" as CardDefinition["id"],
  name: "Border Scout",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: ["ranged", "backstab"],
  abilities: [
    {
      id: "bs_snipe_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_091.webp"),
  flavorText:
    "The borderlands belong to no faction — only to those quiet enough to survive them.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
