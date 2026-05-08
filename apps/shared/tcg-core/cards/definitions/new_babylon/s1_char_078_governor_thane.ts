/**
 * s1_char_078 — Governor Thane
 *
 * Legendary unit · New Babylon faction · 8 cost · 9/10
 * Keywords: provoke, forcefield
 *
 * The iron-fisted governor of New Babylon's outer districts,
 * an immovable bulwark of authoritarian order.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_078" as CardDefinition["id"],
  name: "Governor Thane",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 9, health: 10 },
  keywords: ["provoke", "forcefield"],
  abilities: [
    {
      id: "gt_rally_authority" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "repeat",
        times: { kind: "count_of", filter: { controller: "self", except: "self" } },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "self" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_078.webp"),
  flavorText:
    "He did not rise to power. He built the staircase and burned every other way up.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
