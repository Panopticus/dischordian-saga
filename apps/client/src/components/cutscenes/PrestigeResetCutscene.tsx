/* ═══════════════════════════════════════════════════════
   PRESTIGE RESET CUTSCENE — Cutscene 6 of 6

   Bible §6 (docs/production/NANO_BANANA_VEO_FULL_PROMPT_BOOK.md
   line 1107) — 4 sequential POV shots (player → Elara → Human →
   Antiquarian) + final freeze, ~50s total, no music. Fires when
   the player confirms the prestige cycle ceremony on
   PrestigeCycleResetPage.

   Thin scaffold around <AnimatedCutscenePlayer/> — the shot-
   chain plumbing, reduced-motion fallback, and asset-error
   handling all live there.
   ═══════════════════════════════════════════════════════ */
import type { ReactElement } from "react";
import {
  AnimatedCutscenePlayer,
  type AnimatedCutscenePlayerProps,
} from "@/components/cutscenes/AnimatedCutscenePlayer";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

const SUMMARY =
  "Four POVs in turn — your hand, then Elara, then the Human, " +
  "then the Antiquarian writing it down. The Ark resets. Somewhere, " +
  "a new Potential opens their eyes.";

export interface PrestigeResetCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

export function PrestigeResetCutscene({
  onComplete,
  reduced,
}: PrestigeResetCutsceneProps): ReactElement {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_prestige_reset}
      summary={SUMMARY}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default PrestigeResetCutscene;
