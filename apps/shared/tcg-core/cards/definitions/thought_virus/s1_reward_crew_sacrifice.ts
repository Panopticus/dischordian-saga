/**
 * s1_reward_crew_sacrifice — The Sacrificed
 *
 * Epic unit · Thought Virus faction · 5 cost · 4/6
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Deathwatch: whenever any unit dies, gain +1/+0.
 *    Sacrificed during the Outbreak. Her crew remembers."
 *
 * Lore: The apprentice sacrifice mechanic in the Crew system forces
 * impossible choices — sometimes a crew member must be given up to
 * save the rest. The Sacrificed is the ghost of that choice: a
 * Thought Virus entity that feeds on death, growing stronger with
 * each fallen unit. It is grief weaponized.
 *
 * Reward: Use the apprentice sacrifice mechanic in the Crew system.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. Deathwatch
 * keyword costs 1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_crew_sacrifice" as CardDefinition["id"],
  name: "The Sacrificed",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "ts_deathwatch_power" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_crew_sacrifice.webp",
  flavorText:
    "Sacrificed during the Outbreak. Her crew remembers.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "reactive"] as const,
  verdict_delta: 2,
};
