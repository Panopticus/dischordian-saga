/**
 * s1_pack_006 — Chrome Archon
 *
 * Legendary unit · Architect faction · 8 cost · 7/9
 *
 * Oracle text:
 *   "On deploy, silence all enemy units and draw 2 cards.
 *    The Archon descends and the Arena falls silent."
 *
 * THE Architect pack chase card. A massive body that arrives with a
 * devastating board-wide silence, stripping every enemy of abilities
 * and keywords, plus card advantage. Demands an immediate answer or
 * the game is effectively over. Premium in every sense.
 *
 * Mechanical model:
 *  - On deploy: sequence of foreach enemy silence, then draw 2.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_006" as CardDefinition["id"],
  name: "Chrome Archon",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 7, health: 9 },
  keywords: [],
  abilities: [
    {
      id: "ca_silence_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "opponent" },
            },
            do: {
              op: "silence",
              to: { kind: "it" },
            },
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
  art: assetUrl("art/cards/s1_pack_006.webp"),
  flavorText:
    "It spoke once. The word was 'comply.' Nothing on the board had the capacity to refuse.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
