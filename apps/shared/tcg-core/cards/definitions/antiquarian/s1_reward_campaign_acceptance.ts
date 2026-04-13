/**
 * s1_reward_campaign_acceptance — Stoic Guardian
 *
 * Rare unit · Antiquarian faction · 3 cost · 2/5
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, give self +0/+2.
 *    Acceptance is not weakness. It is the foundation upon which
 *    walls are built."
 *
 * Lore: Completing the campaign with the Acceptance axis dominant
 * shows the player embraces what is rather than raging against it.
 * The Stoic Guardian embodies this philosophy — an ancient Antiquarian
 * sentinel who protects through endurance. Its provoke forces enemies
 * to reckon with it, and its self-buff reflects the inner fortitude
 * that acceptance grants.
 *
 * Reward: Complete the campaign with Acceptance axis dominant.
 *
 * Balance: 3 cost · 2/5 = 7 stats. Budget = 3*2+1 = 7. Provoke
 * keyword costs 1, self +0/+2 ~1 stat. 7 - 2 = 5 base, but effective
 * 2/7 = 9. Provoke on a high-health body is strong but fair at 3 mana.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_campaign_acceptance" as CardDefinition["id"],
  name: "Stoic Guardian",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "sg_self_fortify" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_campaign_acceptance.webp",
  flavorText:
    "The Antiquarian taught that time destroys all things. The Guardian simply asked: 'And what survives?'",
  rulesVersion: "1.0.0",
};
