/**
 * s1_pack_id_oracle_prophet — The Oracle, Prophet
 *
 * Epic unit · Dreamer faction · 5 cost · 3/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 2.
 *    The prophecy returns in fragments. Each piece burns brighter
 *    than the last."
 *
 * Lore: The Oracle has begun recovering their stolen prophecy —
 * fragments of foresight reassembling into a coherent vision. The
 * draw 2 represents the flood of prophetic knowledge returning:
 * visions of futures that were supposed to stay buried. The Prophet
 * is dangerous not because of strength, but because of what they know.
 *
 * Identity variant: Oracle arc (2/3) — dreamer phase, prophecy recovered.
 *
 * Balance: 5 cost · 3/6 = 9 stats. Budget = 5*2+1 = 11. Draw 2 on
 * deploy ~2 stats. 11 - 2 = 9. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_oracle_prophet" as CardDefinition["id"],
  name: "The Oracle, Prophet",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 3, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "opr_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_id_oracle_prophet.webp"),
  flavorText:
    "The prophecy returns in fragments. Each piece burns brighter than the last.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
