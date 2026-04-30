/**
 * s1_reward_outbreak_cure — Vaccine Protocol
 *
 * Rare spell · Antiquarian faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Heal all units for 3. The Antiquarian's archives hold cures
 *    for plagues that haven't happened yet."
 *
 * Lore: The Outbreak game mode challenges players to contain a
 * spreading infection. Developing a cure demonstrates mastery of the
 * Antiquarian's medical archives — ancient knowledge that predates
 * the Thought Virus itself. The Vaccine Protocol heals ALL units,
 * friend and foe alike, reflecting the Antiquarian philosophy that
 * preservation transcends factional loyalty.
 *
 * Reward: Successfully develop a cure in Outbreak mode.
 *
 * Balance: 3 cost spell. AoE heal 3 to all units (both sides) is
 * strong healing but symmetric. On budget for a conditional effect.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_outbreak_cure" as CardDefinition["id"],
  name: "Vaccine Protocol",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "vp_heal_all_units" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_outbreak_cure.webp"),
  flavorText:
    "The cure was written before the disease existed. The Antiquarian always knew what was coming.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
