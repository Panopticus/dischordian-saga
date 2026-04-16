/**
 * s1_reward_crew_bloodline — Bloodline Inheritor
 *
 * Rare unit · Neutral faction · 3 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give self +1/+1 for each other friendly unit that
 *    shares this unit's faction.
 *    The bloodline runs deeper than code. Each generation carries the
 *    weight of those before it."
 *
 * Lore: The Crew system's bloodline chains produce offspring that inherit
 * traits from their lineage. Completing a full bloodline chain unlocks
 * this card — a warrior whose strength scales with how many faction
 * allies stand beside them, representing the accumulated power of an
 * unbroken genetic lineage.
 *
 * Reward: Complete a bloodline chain in the Crew system.
 *
 * Balance: 3 cost · 3/4 = 7 stats. Budget = 3*2+1 = 7. +1/+1 per
 * same-faction ally is conditional (0-3 allies typical). Average ~+2/+2
 * = ~1 stat of value. Neutral faction means fewer same-faction allies
 * naturally, keeping it fair. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_crew_bloodline" as CardDefinition["id"],
  name: "Bloodline Inheritor",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "bi_deploy_faction_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "repeat",
        times: {
          kind: "count_of",
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "self" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_crew_bloodline.webp",
  flavorText:
    "The bloodline runs deeper than code. Each generation carries the weight of those before it.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};
