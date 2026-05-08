/**
 * S2 — Hierarchy of the Damned · Lord-tier · Master of R'lyeh
 *
 * The second of the four canonical Hierarchy demon-lords surfaced in
 * apps/shared/hierarchyOfTheDamned.ts ("Sleeping Reader"). Until this
 * file landed, his entry was `status: "stub_with_reactions"` — encounter
 * prose existed but no card / engine surface backed it. This card brings
 * him to `fully_implemented`.
 *
 * Lore signature: catalogues nightmares before they become memory; the
 * cataloguing IS the corruption. He never wakes.
 *
 * Mechanical model: a slow, sleeping reader. Each turn he is on the
 * board, the opponent mills 1 card from their deck (the page being
 * filed under their name) and he buffs himself permanently — the
 * thumbprint that cannot be scrubbed off. Stat-budget: 8-cost legendary
 * sub-curve body (5/15 = 20 stats, perfectly on the cost-8 curve of 20).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "../../../../../client/src/lib/assetUrl";
import { HIERARCHY_FACTION as F } from "./_art";

const RULES = "1.1.0";

export const lord_master_of_rlyeh: CardDefinition = {
  id: "s2_hierarchy_lord_master_of_rlyeh" as CardDefinition["id"],
  name: "The Master of R'lyeh, the Sleeping Reader",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 5, health: 15 },
  keywords: ["provoke"],
  abilities: [
    // Cataloguing in his sleep — every owner turn-start, the opponent
    // mills the next page of their nightmare and he grows by a slow,
    // permanent +1/+1.
    {
      id: "rlyeh_cataloguing_in_sleep" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "mill",
            amount: { kind: "const", value: 1 },
            who: "opponent",
          },
          {
            op: "buff",
            stats: { power: 1, health: 1 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/hierarchy/lord_master_of_rlyeh.webp"),
  flavorText:
    "He does not wake. The book closes by its own slow weight. Your dream is still on the shelf — slightly thicker than before.",
  rulesVersion: RULES,
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: -2,
};
