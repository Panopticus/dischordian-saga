/**
 * s1_pack_cosm_badge_s1 — Season One Commemorative
 *
 * Common unit · Neutral faction · 2 cost · 2/2
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1.
 *    You were there when it all began. This proves it."
 *
 * Lore: A commemorative card marking participation in Season One
 * of the Dischordian Saga. Simple, efficient, and meaningful only
 * to those who were there. The card draw represents the memories
 * collected during the first season — small moments that become
 * precious with time.
 *
 * Cosmetic unlock: Collecting this card unlocks the S1 Collector
 * badge.
 *
 * Balance: 2 cost · 2/2 = 4 stats. Budget = 2*2+1 = 5. Draw 1 on
 * deploy ~1 stat. 5 - 1 = 4. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_badge_s1" as CardDefinition["id"],
  name: "Season One Commemorative",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "soc_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_pack_cosm_badge_s1.webp",
  flavorText:
    "You were there when it all began. This proves it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
