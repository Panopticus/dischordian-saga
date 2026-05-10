/* ═══════════════════════════════════════════════════════
   HUMAN REVEAL CUTSCENES — Cutscenes 7-10 (variants)

   Four single-shot variants the player sees once the path
   has settled (Act 6+). Branch is picked by
   `deriveHumanRevealBranch()` in apps/shared/humanRevealVariants.ts;
   the matching trigger flag is fired by useHumanRevealTrigger,
   and the CutsceneRouter renders the right wrapper component
   from this file.

   All four are thin wrappers around AnimatedCutscenePlayer —
   the shotFilenames override on each registry entry handles
   the producer's `human_reveal_to_<branch>.mp4` naming.
   ═══════════════════════════════════════════════════════ */
import type { ReactElement } from "react";
import {
  AnimatedCutscenePlayer,
  type AnimatedCutscenePlayerProps,
} from "@/components/cutscenes/AnimatedCutscenePlayer";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

export interface HumanRevealCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

const SUMMARIES = {
  convergence:
    "Both faction signals harmonise. The Human appears composed, " +
    "fully integrated — a man who has chosen to be seen.",
  fragment:
    "The Human's signal is partial, static-laced. Fragments of his " +
    "face resolve and then break apart. He chose Elara's place once; " +
    "he can only show you a fraction of himself in return.",
  full:
    "Full noir reveal — every line of his face, every reflection on " +
    "the glass. You chose him; he meets your gaze.",
  ghost:
    "Only silhouette and signal residue. The Human is here only as the " +
    "shape of an absence. You refused to choose; so does he.",
} as const;

export function HumanRevealConvergenceCutscene({
  onComplete,
  reduced,
}: HumanRevealCutsceneProps): ReactElement {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_human_reveal_convergence}
      summary={SUMMARIES.convergence}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export function HumanRevealFragmentCutscene({
  onComplete,
  reduced,
}: HumanRevealCutsceneProps): ReactElement {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_human_reveal_fragment}
      summary={SUMMARIES.fragment}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export function HumanRevealFullCutscene({
  onComplete,
  reduced,
}: HumanRevealCutsceneProps): ReactElement {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_human_reveal_full}
      summary={SUMMARIES.full}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export function HumanRevealGhostCutscene({
  onComplete,
  reduced,
}: HumanRevealCutsceneProps): ReactElement {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_human_reveal_ghost}
      summary={SUMMARIES.ghost}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}
