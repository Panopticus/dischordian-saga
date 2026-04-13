/**
 * s1_reward_vote_t1_empathy — Field Medic
 *
 * Common unit · Neutral faction · 2 cost · 1/4
 * Keywords: none
 *
 * Oracle text:
 *   "Whenever this unit deals damage, heal your general for 1.
 *    Every wound she inflicts, she repays in kindness elsewhere."
 *
 * Lore: Governance votes along the Empathy axis reward players with
 * agents of compassion. The Field Medic serves all factions equally,
 * healing where she can even as battle rages. Her philosophy: every
 * blow must be offset by an act of mercy.
 *
 * Reward: Participate in a Governance vote with Empathy-tier morality.
 *
 * Balance: 2 cost · 1/4 = 5 stats. Budget = 2*2+1 = 5. Heal general
 * 1 on damage dealt is conditional and minor (~0.5 stat). On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_vote_t1_empathy" as CardDefinition["id"],
  name: "Field Medic",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "fm_heal_on_hit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/s1_reward_vote_t1_empathy.webp",
  flavorText:
    "She carries a blade in one hand and a suture kit in the other. Both see equal use.",
  rulesVersion: "1.0.0",
};
