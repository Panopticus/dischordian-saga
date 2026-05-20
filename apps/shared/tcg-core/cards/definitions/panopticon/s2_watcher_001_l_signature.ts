/**
 * s2_watcher_001 — The L. Signature
 *
 * Epic spell · Panopticon faction · 3 cost
 *
 * Unlocks at the_watcher arc E2 close (apps/shared/episodeMysteries.ts —
 * THE_WATCHER_MYSTERY). E2 is the episode where the player deduces that
 * the seven Trade Empire missions Locke has been dispatching are an
 * Ocularum reconnaissance cycle hiding inside Authority-sanctioned
 * commerce-intelligence work. This card depicts the wax seal embedded
 * in Locke's letters — the founding glyph visible only when the seal
 * is broken from the inside.
 *
 * Mechanically: a draw-and-reveal spell whose payoff scales with the
 * Ocularum's quiet methodology — the more you have already seen, the
 * more it shows you.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s2_watcher_001" as CardDefinition["id"],
  name: "The L. Signature",
  faction: "panopticon",
  cardType: "spell",
  rarity: "epic",
  cost: 3,
  keywords: [],
  abilities: [
    // --- The Signature: draw 2 ---
    {
      id: "watcher_l_signature_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/panopticon/l_signature.webp"),
  flavorText:
    "Every letter she sent you carried the glyph. You read 'L.' because that is what your eye knew how to see.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: -1,
  unlockCondition: {
    kind: "arc_episode_complete",
    arcId: "arc.the_watcher",
    episodeId: "watcher.e2",
  },
};
