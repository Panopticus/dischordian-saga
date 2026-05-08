/* ═══════════════════════════════════════════════════════
   FIRST HUMAN CONTACT CUTSCENE — Cutscene 2 of 5

   Beat: fires when the Human narrator first joins the
   Yin/Yang dialog (NARRATIVE_ARCHITECTURE.md §1.4 beat 3,
   gated on `human_trust >= 10`). Two Seedance shots, 30s.

   Shot specs (start frames, motion notes, color grade) are
   in `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` §2.
   This component is a thin scaffold around
   <AnimatedCutscenePlayer/>; the heavy lifting (shot chain,
   reduced-motion fallback, asset-error handling) lives there.
   ═══════════════════════════════════════════════════════ */
import type { ReactElement } from "react";
import {
  AnimatedCutscenePlayer,
  type AnimatedCutscenePlayerProps,
} from "@/components/cutscenes/AnimatedCutscenePlayer";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

const SUMMARY =
  "Static resolves into a silhouette behind glass — a weathered " +
  "man, voice sandpapered by decades. The signal crackles. He " +
  "says your name as though he has been waiting for it.";

export interface FirstHumanContactCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

export function FirstHumanContactCutscene({
  onComplete,
  reduced,
}: FirstHumanContactCutsceneProps): ReactElement {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_first_human_contact}
      summary={SUMMARY}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default FirstHumanContactCutscene;
