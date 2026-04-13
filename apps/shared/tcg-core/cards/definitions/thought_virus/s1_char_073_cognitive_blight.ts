/**
 * s1_char_073 — Cognitive Blight
 *
 * Uncommon unit · Thought Virus faction · 3 cost · 4/3
 * Keywords: pierce
 *
 * A viral thought-form that bypasses mental defenses entirely.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_073" as CardDefinition["id"],
  name: "Cognitive Blight",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["pierce"],
  abilities: [
    // --- Cognitive Erosion: debuff a random enemy -1/-0 on deploy ---
    {
      id: "blight_deploy_debuff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "debuff",
          stats: { power: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_073.webp",
  flavorText:
    "It rewrites your beliefs one synapse at a time, until loyalty feels like a foreign language.",
  rulesVersion: "1.0.0",
};
