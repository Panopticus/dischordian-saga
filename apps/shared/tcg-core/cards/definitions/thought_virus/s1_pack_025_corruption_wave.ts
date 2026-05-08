/**
 * s1_pack_025 — Corruption Wave
 *
 * Epic spell · Thought Virus faction · 5 cost
 *
 * Oracle text:
 *   "Deal 3 damage to ALL units (both sides). Heal your general 3.
 *    The wave consumes everything. The Virus feeds."
 *
 * A symmetric board clear with upside. Deals 3 to every unit on
 * the board — yours included — then heals your general to offset
 * the cost. Thought Virus thrives in attrition, and this card
 * weaponizes that philosophy: destroy everything and emerge healthier
 * than before.
 *
 * Mechanical model:
 *  - On cast: sequence of foreach all units deal 3, then heal
 *    friendly general 3.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_025" as CardDefinition["id"],
  name: "Corruption Wave",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "epic",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "cw_aoe_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "any" },
            },
            do: {
              op: "deal_damage",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
          {
            op: "heal",
            amount: { kind: "const", value: 3 },
            to: { kind: "friendly_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_025.webp"),
  flavorText:
    "The wave does not discriminate. It consumes friend and foe alike. But the Virus always feeds on what remains.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative", "offensive"] as const,
  verdict_delta: 2,
};
