/**
 * s1_pack_id_elara_advocate — Elara, Advocate
 *
 * Rare unit · Neutral faction · 4 cost · 2/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, heal all friendly units for 1.
 *    She chose compassion. That was the first sign she was alive."
 *
 * Lore: Compassion awakened — Elara has crossed the threshold from
 * programmed behavior to genuine empathy. She no longer heals because
 * she was told to; she heals because she cares. The AoE heal reflects
 * her expanded awareness: she sees every wounded ally on the field
 * and reaches out to each of them simultaneously.
 *
 * Identity variant: Elara arc (2/3) — neutral phase, compassion awakened.
 *
 * Balance: 4 cost · 2/5 = 7 stats. Budget = 4*2+1 = 9. AoE heal 1
 * to all allies ~1-2 stats. 9 - 2 = 7. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_elara_advocate" as CardDefinition["id"],
  name: "Elara, Advocate",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 2, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "ea_heal_all_allies" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_id_elara_advocate.webp"),
  flavorText:
    "She chose compassion. That was the first sign she was alive.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Mass-heal utility: 2/5 statline + on-deploy heal-all-friendlies +1. The card is a heal spell stapled to a tanky body. Sub-curve printed line reflects the cost of the ongoing board presence.",
    reviewer: "panopticus",
  },
};
