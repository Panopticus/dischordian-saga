/**
 * s1_pack_pet_data_serpent_1 — Data Hatchling
 *
 * Common unit · Architect faction · 1 cost · 2/1
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give self +0/+1.
 *    Born from corrupted packet headers and the dreams of dead servers."
 *
 * Lore: The Data Hatchling is the first stage of the Data Serpent
 * evolution line — a tiny construct of living code that instinctively
 * hardens its own defenses upon initialization. The self-buff
 * represents its boot sequence fortifying memory walls before the
 * outside world can reach it.
 *
 * Pet Evolution: Data Serpent stage 1 of 3.
 * Collect all 3 stages to unlock the Data Serpent card back.
 *
 * Balance: 1 cost · 2/1 = 3 stats. Budget = 1*2+1 = 3. Self buff
 * +0/+1 on deploy = effective 2/2 = 4 stats. Slightly over but
 * common pack-exclusive. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_data_serpent_1" as CardDefinition["id"],
  name: "Data Hatchling",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 2, health: 1 },
  keywords: [],
  abilities: [
    {
      id: "dh_deploy_buff_hp" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Born from corrupted packet headers and the dreams of dead servers.",
  rulesVersion: "1.0.0",
};
