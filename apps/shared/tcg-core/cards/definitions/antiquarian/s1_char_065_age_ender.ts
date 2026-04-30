/**
 * s1_char_065 — Age-Ender
 *
 * Epic unit · Antiquarian faction · 6 cost · 7/7
 * Keywords: pierce, forcefield
 *
 * A cataclysmic entity summoned to close an era by force.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_065" as CardDefinition["id"],
  name: "Age-Ender",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 7, health: 7 },
  keywords: ["pierce", "forcefield"],
  abilities: [
    {
      id: "ae_opening_strike" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_065.webp"),
  flavorText:
    "It does not destroy civilizations. It simply marks where one ends and silence begins.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative", "offensive"] as const,
  verdict_delta: 2,
};
