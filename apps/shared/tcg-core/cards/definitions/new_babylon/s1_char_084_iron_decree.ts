/**
 * s1_char_084 — Iron Decree
 *
 * Epic unit · New Babylon faction · 6 cost · 6/8
 * Keywords: provoke, shield
 *
 * A massive armored construct embodying the unyielding law of New Babylon.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_084" as CardDefinition["id"],
  name: "Iron Decree",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 6, health: 8 },
  keywords: ["provoke", "forcefield"],
  abilities: [
    // --- Iron Edict: give all friendly units +0/+1 on deploy ---
    {
      id: "iron_decree_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
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
  art: "/art/cards/s1_char_084.webp",
  flavorText:
    "It does not enforce the law. It is the law — cast in iron and set loose upon the guilty.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
