/**
 * s1_reward_raid_boss — Raid Champion
 *
 * Rare unit · Neutral faction · 6 cost · 5/7
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 3 damage to an enemy unit and heal your general
 *    for 3. The Champion walks out of the wreckage carrying trophies."
 *
 * Lore: Coop raids pit entire warbands against massive bosses that
 * require coordinated strategy to defeat. The Raid Champion is the
 * warrior who struck the killing blow — emerging from the carnage
 * invigorated, dealing damage to a foe while mending the general's
 * wounds with the momentum of victory.
 *
 * Reward: Defeat a raid boss in Coop Raids.
 *
 * Balance: 6 cost · 5/7 = 12 stats. Budget = 6*2+1 = 13. Deal 3
 * targeted ~1.5 stat, heal general 3 ~1 stat. 13 - 2.5 = 10.5.
 * Slightly above at 12 stats, but dual-effect deploy is fair for
 * a reward card. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_raid_boss" as CardDefinition["id"],
  name: "Raid Champion",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: [],
  abilities: [
    {
      id: "rc_deploy_dmg_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "opponent" },
              chooser: "player",
            },
            do: {
              op: "deal_damage",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
          {
            op: "heal",
            amount: { kind: "const", value: 3 },
            to: { kind: "friendly_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_raid_boss.webp"),
  flavorText:
    "The boss fell. The Champion stood in the crater, grinning through the blood. Not all of it was hers.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 1,
};
