/**
 * s1_char_200 — Cortex Ravager
 *
 * Uncommon unit · Thought Virus faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "Whenever this unit deals damage, the opponent discards 1 random card.
 *    The Ravager doesn't just wound the body — it shreds the mind."
 *
 * Aggressive disruption unit. Each time it lands damage (via attack or
 * effects), it forces a random discard from the opponent. Pressure + hand
 * disruption is the Thought Virus signature.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_200" as CardDefinition["id"],
  name: "Cortex Ravager",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "cr_on_dmg_discard" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "discard",
        amount: { kind: "const", value: 1 },
        from: "opponent",
        mode: "random",
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_200.webp"),
  flavorText:
    "It does not speak. It does not need to. Every blow is a sentence erased from your memory.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
