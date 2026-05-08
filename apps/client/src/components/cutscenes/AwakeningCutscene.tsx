/* ═══════════════════════════════════════════════════════
   AWAKENING CUTSCENE — Cutscene 1 of 5

   Beat: fires when the player first emerges from the cryo
   bay (Prelude beat 0). Three Seedance shots, 45s total.

   Shot specs (start frames, motion notes, color grade) are
   in `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` §1.
   This component is a thin scaffold around
   <AnimatedCutscenePlayer/>; the heavy lifting (shot chain,
   reduced-motion fallback, asset-error handling) lives there.
   ═══════════════════════════════════════════════════════ */
import {
  AnimatedCutscenePlayer,
  type AnimatedCutscenePlayerProps,
} from "@/components/cutscenes/AnimatedCutscenePlayer";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

const SUMMARY =
  "You wake inside Cryo Pod 47. The hatch hisses open in slow " +
  "amber light, mist falling around you, the chamber stretching " +
  "into shadow. Elara's voice resolves out of the static.";

export interface AwakeningCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

export function AwakeningCutscene({
  onComplete,
  reduced,
}: AwakeningCutsceneProps): JSX.Element {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_awakening}
      summary={SUMMARY}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default AwakeningCutscene;
