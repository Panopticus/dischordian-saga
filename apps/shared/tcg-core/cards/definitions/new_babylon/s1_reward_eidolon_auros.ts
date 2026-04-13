/**
 * s1_reward_eidolon_auros — Auros, the Honor
 *
 * Rare unit · New Babylon faction · 4 cost · 4/4
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, give self +0/+2.
 *    He stands where others flee. Honor demands no less."
 *
 * Lore: Auros is a New Babylon Eidolon who embodies the faction's
 * ideal of honor through strength. At max bond, Auros manifests as
 * a provoke unit that fortifies itself on arrival — a sentinel who
 * forces engagement and grows tougher for it. His +0/+2 self-buff
 * reflects the way honor hardens those who uphold it.
 *
 * Reward: Reach max bond with Eidolon Auros.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Provoke ~1
 * stat, self buff +0/+2 on deploy ~1 stat. 9 - 2 = 7. At 8 base +2
 * effective = 10 stats total. Provoke tax brings it to 9. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_auros" as CardDefinition["id"],
  name: "Auros, the Honor",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "auros_self_fortify" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_eidolon_auros.webp",
  flavorText:
    "He stands where others flee. Honor demands no less.",
  rulesVersion: "1.0.0",
};
