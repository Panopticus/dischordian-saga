/**
 * s1_pack_020 — Prophecy Incarnate
 *
 * Legendary unit · Dreamer faction · 8 cost · 6/8
 *
 * Oracle text:
 *   "On deploy, stun all enemy units and draw 2 cards.
 *    At the start of your turn, heal self 2.
 *    The prophecy walks among you."
 *
 * THE Dreamer pack chase card. A massive body that freezes the entire
 * enemy board on arrival, draws cards for fuel, and self-heals each
 * turn for incredible staying power. Combines control, card advantage,
 * and resilience into one legendary package.
 *
 * Mechanical model:
 *  - On deploy: sequence of foreach enemy stun 1 turn, then draw 2.
 *  - On turn start: heal self 2.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_020" as CardDefinition["id"],
  name: "Prophecy Incarnate",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 6, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "pi_deploy_stun_draw" as CardDefinition["abilities"][number]["id"],
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
              op: "stun",
              duration: { kind: "n_turns", n: 1 },
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
    {
      id: "pi_turn_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_020.webp"),
  flavorText:
    "The prophecy did not predict the end. It was the end — given a body and a voice that would not be silenced.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
