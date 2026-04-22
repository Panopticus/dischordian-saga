/**
 * s1_reward_eidolon_strain — Strain, the Redeemed
 *
 * Rare unit · Thought Virus faction · 4 cost · 4/4
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Deathwatch: whenever any unit dies, gain +1/+1.
 *    Strain was born in contagion. It found purpose in mourning."
 *
 * Lore: Strain is an Eidolon bonded through the Eidolon Bond system —
 * a Thought Virus entity that evolved beyond its destructive origin.
 * Where other viral constructs consume, Strain commemorates: each
 * death on the battlefield makes it stronger, a memento mori made
 * manifest. Its deathwatch ability grows it with every fallen unit.
 *
 * Reward: Reach maximum bond level with the Strain Eidolon.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Deathwatch
 * keyword costs 1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_strain" as CardDefinition["id"],
  name: "Strain, the Redeemed",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "str_deathwatch_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_eidolon_strain.webp"),
  flavorText:
    "It was a plague once. Now it grieves for every life it took. The grief makes it stronger — and that is its final cruelty.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};
