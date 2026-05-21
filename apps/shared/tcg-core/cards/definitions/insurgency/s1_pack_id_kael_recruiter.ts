/**
 * s1_pack_id_kael_recruiter — Kael, the Recruiter
 *
 * Rare unit · Insurgency faction · 4 cost · 4/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give adjacent allies +1/+1.
 *    Before the infection, Kael built something worth believing in."
 *
 * Lore: Before Patient Zero, before the Source, Kael was the
 * Insurgency's most effective recruiter — a charismatic leader who
 * could turn strangers into soldiers with a single conversation.
 * This card captures Kael at the height of his pre-infection power:
 * a commander whose presence strengthens everyone around him.
 *
 * Identity variant: Kael arc (1/3) — insurgency phase, pre-infection.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Adjacent
 * +1/+1 buff ~1 stat (conditional, board-dependent). 9 - 1 = 8.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_kael_recruiter" as CardDefinition["id"],
  name: "Kael, the Recruiter",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "kr_buff_adjacent" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_id_kael_recruiter.webp"),
  flavorText:
    "Before the infection, Kael built something worth believing in. His soldiers would die for him. Many did.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
  unlockCondition: {
    kind: "arc_episode_complete",
    arcId: "arc.jericho_jones",
    episodeId: "successor_oath.chapter_1",
  },
};
