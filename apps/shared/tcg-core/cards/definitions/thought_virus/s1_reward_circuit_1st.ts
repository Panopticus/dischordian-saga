/**
 * s1_reward_circuit_1st — Clone Racer
 *
 * Rare unit · Thought Virus faction · 3 cost · 4/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On kill, gain +1/+1.
 *    In the Circuit, identity is disposable. Victory is not."
 *
 * Lore: Dead Man's Circuit is a brutal racing mode where cloned
 * contestants are destroyed and rebuilt between laps. Winning first
 * place proves the player can thrive in the Thought Virus's domain —
 * a world where the self is expendable. The Clone Racer strikes fast
 * (rush) and grows stronger with each kill, feeding on the identities
 * of the fallen.
 *
 * Reward: Win first place in Dead Man's Circuit.
 *
 * Balance: 3 cost · 4/2 = 6 stats. Budget = 3*2+1 = 7. Rush keyword
 * costs 1 stat. On-kill +1/+1 is conditional ~0.5 stat. 7 - 1.5 =
 * 5.5 ~ 6. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_circuit_1st" as CardDefinition["id"],
  name: "Clone Racer",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "cr_rush_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    {
      id: "cr_on_kill_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "unit" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_circuit_1st.webp"),
  flavorText:
    "They clone him at the starting line and recycle him at the finish. He has won forty-seven races. He remembers none of them.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive", "reactive"] as const,
  verdict_delta: 1,
};
