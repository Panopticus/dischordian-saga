/**
 * s1_pack_pet_gilt_beetle_3 — Gilt Juggernaut
 *
 * Epic unit · Architect faction · 6 cost · 4/8
 * Keywords: provoke, forcefield
 *
 * Oracle text:
 *   "Provoke. Forcefield. On deploy, give self +0/+3.
 *    It was built to outlast civilizations. So far, it has."
 *
 * Lore: The Gilt Juggernaut is the final evolution of the Gilt Beetle
 * line — a titanic golden scarab whose carapace absorbs the first
 * blow each turn and whose mass demands the attention of every enemy
 * nearby. The on-deploy health buff stacks its defenses to an
 * imposing 4/11 effective body, a living fortress that embodies the
 * Architect's belief that true power is endurance.
 *
 * Pet Evolution: Gilt Beetle stage 3 of 3.
 * Collect all 3 stages to unlock the Gilt Beetle card back.
 *
 * Balance: 6 cost · 4/8 = 12 stats. Budget = 6*2+1 = 13. Provoke
 * ~1 stat, forcefield ~1 stat, self buff +0/+3 on deploy = effective
 * 4/11 = 15 stats. 13 - 2 = 11. At 12 base + 3 buff, over but
 * purely defensive and epic pack-exclusive capstone. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_gilt_beetle_3" as CardDefinition["id"],
  name: "Gilt Juggernaut",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 4, health: 8 },
  keywords: ["provoke", "forcefield"],
  abilities: [
    {
      id: "gj_deploy_fortify" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 3 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_gilt_beetle_3.webp",
  flavorText:
    "It was built to outlast civilizations. So far, it has.",
  rulesVersion: "1.0.0",
};
