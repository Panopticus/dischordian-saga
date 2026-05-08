/**
 * s1_char_071 — Neural Parasite
 *
 * Common unit · Thought Virus faction · 1 cost · 2/1
 * Keywords: rush
 *
 * A fast, fragile infection vector that strikes immediately.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_071" as CardDefinition["id"],
  name: "Neural Parasite",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 2, health: 1 },
  keywords: ["rush"],
  abilities: [
    // --- Viral Explosion: deal 1 damage to ALL units (including self) on deploy ---
    {
      id: "parasite_deploy_aoe" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_071.webp"),
  flavorText:
    "It burrows through the ear canal and nests in the hippocampus. By then, you are already someone else.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
