/**
 * s1_reward_crew_incubator — Incubator Prime
 *
 * Rare unit · Neutral faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, heal self for 1.
 *    Ten cycles of growth. Ten cycles of patience. The Incubator
 *    endures what others cannot."
 *
 * Lore: The Crew system's incubation mechanic requires patience —
 * tending to developing crew members across multiple cycles. Completing
 * ten cycles proves dedication to the process. The Incubator Prime is
 * the machine that made it possible: a self-sustaining construct that
 * heals itself each turn, embodying the patience the player demonstrated.
 *
 * Reward: Complete 10 incubation cycles in the Crew system.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Heal self 1
 * per turn ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_crew_incubator" as CardDefinition["id"],
  name: "Incubator Prime",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "ip_turn_start_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_crew_incubator.webp"),
  flavorText:
    "Ten cycles of growth. Ten cycles of patience. The Incubator endures what others cannot.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
