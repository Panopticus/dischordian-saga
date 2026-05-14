/**
 * s2_watcher_003 — Now You Are Ours
 *
 * Legendary spell · Panopticon faction · 6 cost
 *
 * Unlocks at the_watcher arc E5 close — the recruitment-by-recognition
 * moment where Locke names herself as Coordinator and the player is
 * canonically assigned a cell number in the Ocularum's continuity log
 * (apps/shared/ocularumCanon.ts). The card depicts the dossier's last
 * line: "Cell pending." Its mechanical effect is the recognition
 * closing into a name.
 *
 * Mechanically: a high-cost, identity-defining spell. Reads the
 * player's own field and rewards depth — the more units they have
 * already played in the discipline, the more this card returns.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s2_watcher_003" as CardDefinition["id"],
  name: "Now You Are Ours",
  faction: "panopticon",
  cardType: "spell",
  rarity: "legendary",
  cost: 6,
  keywords: [],
  abilities: [
    // --- Cell Assigned: draw 3 ---
    {
      id: "watcher_now_you_are_ours_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s2_watcher_003.webp"),
  flavorText:
    "You have been useful. You have been quiet. You have been mine. Now you are ours, if you wish.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: -2,
  unlockCondition: {
    kind: "arc_episode_complete",
    arcId: "arc.the_watcher",
    episodeId: "watcher.e5",
  },
};
