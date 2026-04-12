/**
 * s1_reward_syndicate_build — Syndicate Foreman
 *
 * Rare unit · New Babylon faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, gain 1 permanent mana crystal.
 *    Build twenty structures and the Syndicate notices. Build more
 *    and the Syndicate promotes."
 *
 * Lore: Building twenty structures in Syndicate World proves the player
 * can fuel New Babylon's industrial machine. The Syndicate Foreman is
 * a project lead who brings lasting economic advantage — each deployment
 * permanently expands the player's mana reserves, reflecting the
 * Syndicate's philosophy that infrastructure is power.
 *
 * Reward: Build 20 structures in Syndicate World.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Gain 1
 * permanent mana ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_syndicate_build" as CardDefinition["id"],
  name: "Syndicate Foreman",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "sf_gain_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: true,
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "He poured the foundations for twenty towers. The twenty-first was his own.",
  rulesVersion: "1.0.0",
};
