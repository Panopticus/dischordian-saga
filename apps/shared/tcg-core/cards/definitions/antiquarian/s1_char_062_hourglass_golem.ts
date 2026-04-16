/**
 * s1_char_062 — Hourglass Golem
 *
 * Common unit · Antiquarian faction · 4 cost · 5/4
 * Keywords: provoke
 *
 * A construct of frozen sand and warped glass, blocking passage through time.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_062" as CardDefinition["id"],
  name: "Hourglass Golem",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 4,
  baseStats: { power: 5, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Temporal Reinforcement: give self +0/+3 on deploy ---
    {
      id: "hourglass_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { health: 3 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_062.webp",
  flavorText:
    "When the last grain falls, the golem shatters — and time resumes its march.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
