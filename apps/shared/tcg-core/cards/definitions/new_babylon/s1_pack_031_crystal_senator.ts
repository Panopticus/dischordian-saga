/**
 * s1_pack_031 — Crystal Senator
 *
 * Rare unit · New Babylon faction · 5 cost · 4/6
 * Keywords: forcefield
 *
 * Oracle text:
 *   "Forcefield. On deploy, gain +1/+1. The Senate's finest —
 *    shielded by privilege and power."
 *
 * Premium midrange threat with built-in protection. Forcefield absorbs
 * the first hit, and the deploy buff brings it to an effective 5/7 —
 * extremely durable for 5 mana. A wall of crystallized political
 * power that demands multiple answers to remove.
 *
 * Mechanical model:
 *  - Forcefield: intrinsic keyword. On deploy, buff self +1/+1
 *    permanently.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_031" as CardDefinition["id"],
  name: "Crystal Senator",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "cs_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_031.webp"),
  flavorText:
    "The Senator's shield is not magic. It is money — crystallized into a barrier no blade can afford to breach.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
