/**
 * s1_pack_id_oracle_prisoner — The Prisoner
 *
 * Common unit · Dreamer faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, add 1 forcefield charge to self.
 *    Memory erased. Identity stripped. Only the shield remains."
 *
 * Lore: Before the Oracle recovered their prophecy, they were a
 * prisoner — memory erased, identity dissolved by the Collector's
 * Damnatio Memoriae protocol. The single forcefield charge is the
 * last fragment of prophetic power, an instinctive defensive barrier
 * that even total amnesia could not erase.
 *
 * Identity variant: Oracle arc (1/3) — dreamer phase, memory erased.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. 1 forcefield
 * charge ~0.5 stat. Slightly over but common rarity. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_oracle_prisoner" as CardDefinition["id"],
  name: "The Prisoner",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "op_deploy_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 1,
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_id_oracle_prisoner.webp"),
  flavorText:
    "Memory erased. Identity stripped. Only the shield remains.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
