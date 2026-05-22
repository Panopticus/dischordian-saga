/**
 * s1_pack_id_human_detective — The Detective
 *
 * Rare unit · Neutral faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, silence an enemy unit.
 *    Every lie unraveled. Every mask removed. The truth always costs more
 *    than the lie."
 *
 * Lore: The investigation phase of the Human's journey — following
 * threads of conspiracy through New Babylon's bureaucracy and the
 * Architect's layers of deception. The silence effect represents
 * the Detective stripping away false identities and hidden agendas,
 * exposing the truth beneath the surface.
 *
 * Identity variant: Human arc (2/3) — neutral phase, investigation.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Silence on
 * deploy ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_human_detective" as CardDefinition["id"],
  name: "The Detective",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "hd_deploy_silence" as CardDefinition["abilities"][number]["id"],
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
  art: assetUrl("art/cards/s1_pack_id_human_detective.webp"),
  flavorText:
    "Every lie unraveled. Every mask removed. The truth always costs more than the lie.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
  unlockCondition: {
    kind: "arc_episode_complete",
    arcId: "arc.memento_dischordia",
    episodeId: "md.chapter_1",
  },
};
