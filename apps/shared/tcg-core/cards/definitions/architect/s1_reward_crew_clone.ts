/**
 * s1_reward_crew_clone — Perfect Clone
 *
 * Rare unit · Architect faction · 2 cost · 2/2
 * Keywords: rebirth
 *
 * Oracle text:
 *   "Rebirth. On death, summon a 2/2 copy of this unit.
 *    The Architect's cloning bays produce flawless replicas. Death is
 *    merely a reboot."
 *
 * Lore: The Crew system's cloning mechanic allows players to duplicate
 * their best crew members. A successful clone proves the player has
 * mastered the Architect's replication technology. The Perfect Clone
 * embodies that mastery — it dies and returns, an endless loop of
 * identical persistence.
 *
 * Reward: Successfully clone a crew member in the Crew system.
 *
 * Balance: 2 cost · 2/2 = 4 stats. Budget = 2*2+1 = 5. Rebirth keyword
 * costs 1 stat. 5 - 1 = 4. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_crew_clone" as CardDefinition["id"],
  name: "Perfect Clone",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: ["rebirth"],
  abilities: [
    {
      id: "pc_rebirth_clone" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "summon",
        tokenId: "s1_token_perfect_clone",
        at: { kind: "origin_offset", dRow: 0, dCol: 0 },
        controller: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_crew_clone.webp",
  flavorText:
    "The Architect's cloning bays produce flawless replicas. Death is merely a reboot.",
  rulesVersion: "1.0.0",
};
