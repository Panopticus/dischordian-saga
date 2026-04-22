/**
 * s1_char_075 — Plague Herald
 *
 * Rare unit · Thought Virus faction · 4 cost · 4/5
 * Keywords: overcharge, drain
 *
 * A corrupted prophet whose first strike carries devastating viral payload.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_075" as CardDefinition["id"],
  name: "Plague Herald",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["overcharge", "drain"],
  abilities: [
    {
      id: "plh_overcharge" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    {
      id: "plh_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_075.webp"),
  flavorText:
    "His sermons are not metaphors. Every word is a live pathogen.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
