/**
 * s1_reward_companion_max — Bond of Trust
 *
 * Common spell · Neutral faction · 1 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Give a friendly unit +2/+2 this turn.
 *    Trust is the strongest bond — and the most fleeting."
 *
 * Lore: Maximizing a companion's bond level in the Companion system
 * reveals the power of genuine trust. Bond of Trust channels that
 * connection into a burst of temporary strength for any allied unit.
 * The buff fades when the moment passes — trust must be renewed.
 *
 * Reward: Max out a companion's bond level in Companion mode.
 *
 * Balance: 1 cost spell. +2/+2 this turn is equivalent to ~1 mana of
 * burst. On budget for a temporary combat trick.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_companion_max" as CardDefinition["id"],
  name: "Bond of Trust",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "bot_temp_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 2, health: 2 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_companion_max.webp",
  flavorText:
    "The bond lasted only a heartbeat. But in that heartbeat, they were invincible.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
