/**
 * s1_pack_cosm_armor_void — Void Sentinel
 *
 * Epic unit · Thought Virus faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give all friendly units forcefield this turn.
 *    The Void does not destroy. It shields those who surrender to it."
 *
 * Lore: The Void Sentinel is a Thought Virus entity that has
 * achieved a paradoxical state — the corrosive signal bent into
 * a protective shell. On deployment, the Sentinel extends that
 * protection to all allies, granting each a temporary forcefield.
 * The Void can destroy, but it can also preserve what it claims
 * as its own.
 *
 * Cosmetic unlock: Collecting this card unlocks the Void Sentinel
 * armor skin.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. AoE
 * grant forcefield this turn ~1-2 stats (scales with board).
 * 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_armor_void" as CardDefinition["id"],
  name: "Void Sentinel",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "vs_deploy_forcefield_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "add_counter",
          kind: "forcefield_charges",
          amount: 1,
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_cosm_armor_void.webp"),
  flavorText:
    "The Void does not destroy. It shields those who surrender to it.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
