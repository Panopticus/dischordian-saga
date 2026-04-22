/**
 * s1_char_072 — Memetic Carrier
 *
 * Common unit · Thought Virus faction · 2 cost · 2/3
 * Keywords: deathwatch
 *
 * A shambling host that grows more dangerous as allies fall around it.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_072" as CardDefinition["id"],
  name: "Memetic Carrier",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "mc_deathwatch_power" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_072.webp"),
  flavorText:
    "It does not spread through contact. It spreads through comprehension.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};
