/**
 * s1_pack_pet_void_crawler_1 — Void Grub
 *
 * Common unit · Thought Virus faction · 1 cost · 1/2
 * Keywords: none
 *
 * Oracle text:
 *   "On death, deal 1 damage to the enemy general.
 *    It burrows into the space between thoughts and waits to die."
 *
 * Lore: The Void Grub is the first stage of the Void Crawler
 * evolution line — a parasitic larva from the spaces between
 * dimensions. Even its death is weaponized: the psychic backlash
 * of its demise sends a jolt of pain to the enemy general. The
 * Thought Virus faction ensures nothing dies without consequence.
 *
 * Pet Evolution: Void Crawler stage 1 of 3.
 * Collect all 3 stages to unlock the Void Crawler card back.
 *
 * Balance: 1 cost · 1/2 = 3 stats. Budget = 1*2+1 = 3. On-death
 * deal 1 to general ~0.5 stat (conditional). 3 - 0.5 = 2.5. At 3
 * stats, slightly over. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_void_crawler_1" as CardDefinition["id"],
  name: "Void Grub",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "vg_death_ping" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It burrows into the space between thoughts and waits to die.",
  rulesVersion: "1.0.0",
};
