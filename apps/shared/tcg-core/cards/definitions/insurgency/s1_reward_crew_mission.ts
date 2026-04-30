/**
 * s1_reward_crew_mission — Mission Briefing
 *
 * Rare spell · Insurgency faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 2 cards. Give a friendly unit rush this turn.
 *    Twenty-five missions. Twenty-five debriefs. The crew knows every
 *    angle before the first shot is fired."
 *
 * Lore: Crew missions are the backbone of the Insurgency's field
 * operations. Completing 25 proves the player's crew is a seasoned
 * strike force. The Mission Briefing represents that hard-won tactical
 * mastery: intelligence (draw 2) and the ability to mobilize instantly
 * (granting rush to an ally).
 *
 * Reward: Complete 25 crew missions in the Crew system.
 *
 * Balance: 3 cost spell. Draw 2 ~2 mana, grant rush to ally ~1 mana.
 * Total ~3 mana of value. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_crew_mission" as CardDefinition["id"],
  name: "Mission Briefing",
  faction: "insurgency",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "mb_draw_and_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "self" },
              chooser: "player",
            },
            do: {
              op: "grant_keyword",
              keyword: "can_attack_this_turn",
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_crew_mission.webp"),
  flavorText:
    "Twenty-five missions deep. The crew doesn't need orders anymore — they need targets.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
