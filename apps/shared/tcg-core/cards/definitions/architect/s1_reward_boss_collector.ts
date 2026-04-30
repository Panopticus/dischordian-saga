/**
 * s1_reward_boss_collector — Collector's Trophy
 *
 * Rare unit · Architect faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, silence an enemy unit.
 *    The Collector takes more than lives — he takes meaning."
 *
 * Lore: Mastering The Collector boss means learning every one of his
 * identity-erasing patterns and turning them back on him. The Trophy
 * is proof of that mastery — and it carries the Collector's Damnatio
 * Memoriae protocol as a deploy effect, stripping an enemy unit of
 * all abilities, keywords, and buffs.
 *
 * Reward: Master The Collector boss.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. Silence
 * on deploy ~1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_boss_collector" as CardDefinition["id"],
  name: "Collector's Trophy",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "ct_silence_enemy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_boss_collector.webp"),
  flavorText:
    "He collected names, faces, histories. This trophy remembers them all — silently.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
