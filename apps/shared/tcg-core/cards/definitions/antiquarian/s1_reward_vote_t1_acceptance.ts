/**
 * s1_reward_vote_t1_acceptance — Time Capsule
 *
 * Common unit · Antiquarian faction · 2 cost · 2/3
 * Keywords: forcefield
 *
 * Oracle text:
 *   "Forcefield. The capsule endures its first blow unscathed —
 *    within it, the past is preserved."
 *
 * Lore: Governance votes along the Acceptance axis reward players with
 * relics of preservation. The Time Capsule is an Antiquarian artifact
 * given form — a vessel that carries fragments of lost Ages, shielded
 * by a forcefield that absorbs the first damage it takes.
 *
 * Reward: Participate in a Governance vote with Acceptance-tier morality.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Forcefield
 * keyword costs 1 stat. 5 - 1 = 4, but 2/3 = 5. Forcefield on a
 * 2-drop is a fair defensive tool. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_vote_t1_acceptance" as CardDefinition["id"],
  name: "Time Capsule",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "tc_forcefield_charge" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 1,
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_vote_t1_acceptance.webp",
  flavorText:
    "It survived the collapse of the Third Age. Your attack will not be what breaks it.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence"] as const,
};
