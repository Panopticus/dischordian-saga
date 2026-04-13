/**
 * s1_reward_circuit_survive — Identity Fragment
 *
 * Rare unit · Thought Virus faction · 4 cost · 3/5
 * Keywords: rebirth
 *
 * Oracle text:
 *   "Rebirth. On death, leaves a 0/1 egg that hatches next turn.
 *    What the Circuit destroys, the Fragment remembers."
 *
 * Lore: Surviving Dead Man's Circuit — not just winning, but enduring
 * its identity-erasing gauntlet — proves the player can hold onto
 * themselves in the Thought Virus's domain. The Identity Fragment is
 * a piece of selfhood that refuses to die, returning from destruction
 * through the rebirth keyword.
 *
 * Reward: Survive a full Dead Man's Circuit run.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Rebirth
 * keyword costs 1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_circuit_survive" as CardDefinition["id"],
  name: "Identity Fragment",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["rebirth"],
  abilities: [
    {
      id: "if_rebirth_egg" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "summon",
        tokenId: "s1_token_egg",
        at: { kind: "origin_offset", dRow: 0, dCol: 0 },
        controller: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_circuit_survive.webp",
  flavorText:
    "The Circuit stripped away everything — name, face, memory. But something persisted. Something small and stubborn and alive.",
  rulesVersion: "1.0.0",
};
