/**
 * s1_char_055 — Thought Censor
 *
 * Rare unit · Panopticon faction · 5 cost · 5/7
 * Keywords: forcefield
 *
 * An elite psych-operative who suppresses dissent at the cognitive level.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_055" as CardDefinition["id"],
  name: "Thought Censor",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 7 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "tc_silence_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_055.webp"),
  flavorText:
    "She does not burn books. She burns the desire to read them.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
