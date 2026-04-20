/* ═══════════════════════════════════════════════════════
   WITNESSING TAROT HOTSPOT — archives reading-plinth

   The Seer's burnt tarot card, laid on the central reading-
   plinth in the archives room at 50% / 60%. Click fires the
   20-slide Light/Dark choice pillar from
   LastWordsWitnessing.tsx.

   The post-choice alignment feedback (Light or Dark tint on
   the plinth's brass rim + the card's unburnt quadrant) is
   painted by vfx_choice_pillar_light_dark_split and a new
   tint applied to this anchor.
   ═══════════════════════════════════════════════════════ */

import type { PreludeAnchorColor } from "./preludeRoomAnchors";

export interface WitnessingTarotHotspotConfig {
  id: string;
  displayName: string;
  label: string;
  position: { leftPct: number; topPct: number };
  color: PreludeAnchorColor;
  examinedFlag: string;
  /** Flag raised after the Light/Dark choice commits. */
  alignmentCommittedFlag: string;
}

export const WITNESSING_TAROT_HOTSPOT: WitnessingTarotHotspotConfig = {
  id: "witnessing_burnt_tarot",
  displayName: "Seer's Burnt Tarot Card",
  label: "Examine the Seer's burnt tarot card",
  position: { leftPct: 50, topPct: 60 },
  color: "amber",
  examinedFlag: "prelude_witnessing_tarot_examined",
  alignmentCommittedFlag: "act1_witnessing_alignment_committed",
};
