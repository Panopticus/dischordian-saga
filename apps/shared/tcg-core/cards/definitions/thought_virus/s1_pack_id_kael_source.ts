/**
 * s1_pack_id_kael_source — Kael, the Source
 *
 * Legendary unit · Thought Virus faction · 8 cost · 6/10
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, deal 1 damage to ALL enemies.
 *    There is no Kael anymore. There is only the signal."
 *
 * Lore: Fully consumed by the Thought Virus, Kael has become the
 * Source itself — the origin node of the corrosive broadcast that
 * dissolves reality. Every turn, his mere presence damages all
 * enemies on the board, a constant tide of entropic signal that
 * erodes everything it touches. The man is gone; the signal remains.
 *
 * Identity variant: Kael arc (3/3) — thought_virus phase, fully consumed.
 *
 * Balance: 8 cost · 6/10 = 16 stats. Budget = 8*2+1 = 17. AoE 1
 * damage per turn to all enemies ~2 stats. 17 - 2 = 15. At 16 stats,
 * slightly generous but justified by legendary rarity and 8-cost
 * tempo loss. On budget for legendary.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_kael_source" as CardDefinition["id"],
  name: "Kael, the Source",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 6, health: 10 },
  keywords: [],
  abilities: [
    {
      id: "ks_aoe_tick" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_id_kael_source.webp"),
  flavorText:
    "There is no Kael anymore. There is only the signal.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
