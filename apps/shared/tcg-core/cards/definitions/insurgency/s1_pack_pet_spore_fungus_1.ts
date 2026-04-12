/**
 * s1_pack_pet_spore_fungus_1 — Spore Seedling
 *
 * Common unit · Insurgency faction · 1 cost · 0/2
 * Keywords: none
 *
 * Oracle text:
 *   "On death, summon a 1/1 Spore token.
 *    Kill it and it spreads. Ignore it and it spreads.
 *    There is no good option."
 *
 * Lore: The Spore Seedling is the first stage of the Spore Fungus
 * evolution line — a tiny fungal growth that propagates upon
 * destruction. It has no attack, posing no immediate threat, but
 * its death-trigger ensures that removing it only creates more
 * problems. A perfect embodiment of the Insurgency's guerrilla
 * persistence.
 *
 * Pet Evolution: Spore Fungus stage 1 of 3.
 * Collect all 3 stages to unlock the Spore Fungus card back.
 *
 * Balance: 1 cost · 0/2 = 2 stats. Budget = 1*2+1 = 3. On-death
 * summon 1/1 token ~1 stat (conditional). 3 - 1 = 2. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_spore_fungus_1" as CardDefinition["id"],
  name: "Spore Seedling",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 0, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "ss_death_spawn" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "summon",
        tokenId: "s1_token_spore",
        at: { kind: "origin_offset", dRow: 0, dCol: 0 },
        controller: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Kill it and it spreads. Ignore it and it spreads. There is no good option.",
  rulesVersion: "1.0.0",
};
