/**
 * s1_pack_pet_gilt_beetle_2 — Iron Beetle
 *
 * Rare unit · Architect faction · 3 cost · 2/5
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, give self +0/+2.
 *    Iron remembers the shape it was forged into. It does not bend."
 *
 * Lore: The Iron Beetle is the second stage of the Gilt Beetle line
 * — a heavily armored construct that deploys with reinforced plating.
 * The on-deploy health buff represents its armor hardening upon
 * contact with the battlefield, making it an even more formidable
 * provoke wall that demands the enemy's full attention.
 *
 * Pet Evolution: Gilt Beetle stage 2 of 3.
 * Collect all 3 stages to unlock the Gilt Beetle card back.
 *
 * Balance: 3 cost · 2/5 = 7 stats. Budget = 3*2+1 = 7. Provoke ~1
 * stat, self buff +0/+2 on deploy = effective 2/7 = 9 stats. 7 - 1
 * = 6. Effective 9 is over but low power and provoke wall role. On
 * budget for defensive rare.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_gilt_beetle_2" as CardDefinition["id"],
  name: "Iron Beetle",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "ib_deploy_armor" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_gilt_beetle_2.webp",
  flavorText:
    "Iron remembers the shape it was forged into. It does not bend.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
