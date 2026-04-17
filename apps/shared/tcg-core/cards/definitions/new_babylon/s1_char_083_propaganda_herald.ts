/**
 * s1_char_083 — Propaganda Herald
 *
 * Common unit · New Babylon faction · 2 cost · 2/3
 * Keywords: rally_buff
 *
 * A state-sanctioned speaker who bolsters morale through carefully
 * crafted messaging.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_083" as CardDefinition["id"],
  name: "Propaganda Herald",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["rally_buff"],
  abilities: [
    {
      id: "ph_rally_health" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_083.webp",
  flavorText:
    "The truth is whatever the Spire says it is. He just makes it rhyme.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
