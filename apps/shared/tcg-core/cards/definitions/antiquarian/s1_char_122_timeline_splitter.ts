/**
 * s1_char_122 — Timeline Splitter
 *
 * Rare unit · Antiquarian faction · 5 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "Fractures the timeline. On deploy, return an enemy unit to its
 *    owner's hand — the target was never deployed in this timeline."
 *
 * Lore: The Timeline Splitter is an Antiquarian operative trained in
 * temporal dislocation — the art of severing a moment from the timeline
 * and forcing it to un-happen. When deployed, the Splitter identifies
 * an enemy unit and fractures the timeline branch where that unit was
 * played, returning it to a state where it was still in its owner's
 * hand, undeployed. The Witness regards this ability as "the most
 * elegant violence" — no blood is spilled, no body falls. The enemy
 * simply never arrived.
 *
 * Mechanical model:
 *  - On deploy, the player targets an enemy unit. That unit is returned
 *    to its owner's hand (original owner). A tempo play that bounces
 *    a key enemy threat.
 *
 * Golden tests: test/cards/antiquarian/s1_char_122_timeline_splitter.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_122" as CardDefinition["id"],
  name: "Timeline Splitter",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    // --- Temporal Fracture: bounce an enemy on deploy ---
    {
      id: "tsplit_temporal_fracture" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "return_to_hand",
          to: { kind: "it" },
          owner: "original",
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_122.webp"),
  flavorText:
    "You were never here. The Splitter does not argue this point — she simply makes it true.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
  balanceException: {
    reason: "Removal/control utility: 3/5 body + on-deploy bounce-enemy-to-hand. The card is a bounce spell stapled to a tanky body. Sub-curve printed line is the cost of the spell-equivalent on-deploy effect.",
    reviewer: "panopticus",
  },
};
