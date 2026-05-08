/**
 * s1_pack_034 — Locke's Inner Circle
 *
 * Legendary unit · New Babylon faction · 7 cost · 5/8
 *
 * Oracle text:
 *   "On deploy, gain 3 permanent mana crystals and draw 2 cards.
 *    The Inner Circle controls the economy. The economy controls
 *    everything."
 *
 * THE New Babylon pack chase card. An absolute economic powerhouse
 * that permanently accelerates your mana while refueling your hand.
 * At 7 cost, the 3 permanent mana effectively makes the next turn
 * a 10+ mana turn, enabling massive plays. The 5/8 body is durable
 * enough to demand answers. Premium legendary.
 *
 * Mechanical model:
 *  - On deploy: sequence of gain 3 permanent mana, then draw 2.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_034" as CardDefinition["id"],
  name: "Locke's Inner Circle",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 5, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "lic_deploy_ramp_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "gain_mana",
            amount: { kind: "const", value: 3 },
            permanent: true,
          },
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_034.webp"),
  flavorText:
    "They do not rule New Babylon. They own it. And now they own whatever comes next.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
