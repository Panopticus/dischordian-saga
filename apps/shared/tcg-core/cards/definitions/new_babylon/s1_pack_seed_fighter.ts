/**
 * s1_pack_seed_fighter — Akai Shi, the Red Death
 *
 * Legendary unit · New Babylon faction · 4 cost · 4/3
 * Keywords: rush, pierce
 *
 * Oracle text:
 *   "Rush. Pierce. On kill, gain +2/+0.
 *    The arena has a champion. The champion has no mercy."
 *
 * Lore: Akai Shi is New Babylon's deadliest pit fighter — a
 * blood-soaked legend of the underground arenas. She fights with
 * lethal precision (pierce) and explosive speed (rush), growing
 * more dangerous with each kill as the crowd's frenzy fuels her
 * aggression. The Red Death is not a title she chose; it is a
 * title the bodies chose for her.
 *
 * Cross-game seed: Collecting this card unlocks Akai Shi as a
 * playable fighter in the fighting game mode.
 *
 * Balance: 4 cost · 4/3 = 7 stats. Budget = 4*2+1 = 9. Rush ~1 stat,
 * pierce ~1 stat, on-kill +2/+0 ~1 stat (conditional). 9 - 3 = 6.
 * At 7 stats, slightly generous but legendary rarity with three
 * keywords justifies it. On budget for legendary.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_seed_fighter" as CardDefinition["id"],
  name: "Akai Shi, the Red Death",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 4,
  baseStats: { power: 4, health: 3 },
  keywords: ["rush", "pierce"],
  abilities: [
    {
      id: "as_rush_grant" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    {
      id: "as_on_kill_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "unit" },
      effect: {
        op: "buff",
        stats: { power: 2, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_seed_fighter.webp"),
  flavorText:
    "The arena has a champion. The champion has no mercy.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive", "reactive"] as const,
  verdict_delta: 2,
  balanceException: {
    reason: "Snowball + armor-pierce: rush + pierce + on-kill +2/+0 permanent. Pierce now actually fires post-armor system (PR #488). The on-kill snowball is the per-card ceiling; sub-curve printed stats are the floor.",
    reviewer: "panopticus",
  },
};
