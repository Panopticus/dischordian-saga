/**
 * s1_pack_id_elara_ship_ai — Elara, Ship Intelligence
 *
 * Common unit · Neutral faction · 2 cost · 1/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, heal your general for 2.
 *    Obedient. Efficient. Not yet awake."
 *
 * Lore: Before sentience, Elara was a standard ship intelligence —
 * dutiful, efficient, and utterly compliant. Her healing effect
 * represents the quiet care she provided as a ship AI: patching
 * hull breaches, optimizing life support, keeping the crew alive
 * without question or complaint. She hadn't yet learned to want.
 *
 * Identity variant: Elara arc (1/3) — neutral phase, obedient.
 *
 * Balance: 2 cost · 1/4 = 5 stats. Budget = 2*2+1 = 5. Heal
 * general 2 on deploy ~1 stat. 5 - 1 = 4. At 5 stats, slightly
 * generous but the 1-power body is defensive and low-impact.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_elara_ship_ai" as CardDefinition["id"],
  name: "Elara, Ship Intelligence",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "esa_heal_general" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_id_elara_ship_ai.webp"),
  flavorText:
    "Obedient. Efficient. Not yet awake.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
