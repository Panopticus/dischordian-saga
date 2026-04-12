/**
 * s1_char_056 — Registry Clerk
 *
 * Common unit · Panopticon faction · 2 cost · 3/2
 * Keywords: rally_buff
 *
 * A bureaucratic cog that buffs adjacent allies through strict order.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_056" as CardDefinition["id"],
  name: "Registry Clerk",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rally_buff"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Every citizen has a file. Every file has a purpose. Every purpose serves the Spire.",
  rulesVersion: "1.0.0",
};
