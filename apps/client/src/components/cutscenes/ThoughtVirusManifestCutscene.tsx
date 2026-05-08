/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS MANIFEST CUTSCENE — Cutscene 5 of 5

   Beat: fires the first time the Thought Virus infects an NPC
   (Act 4+ trigger; gated on Chapter 8 OR corruption > 75%).
   Two Seedance shots, 30s total.

   Shot specs (ship blueprint with red infection tendrils, the
   final Bridge ping at 0:29) are in
   `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` §5. This
   component is a thin scaffold around
   <AnimatedCutscenePlayer/>; the heavy lifting (shot chain,
   reduced-motion fallback, asset-error handling) lives there.
   ═══════════════════════════════════════════════════════ */
import {
  AnimatedCutscenePlayer,
  type AnimatedCutscenePlayerProps,
} from "@/components/cutscenes/AnimatedCutscenePlayer";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

const SUMMARY =
  "An ark blueprint glows cyan. A red tendril blooms in Comms " +
  "and branches outward, room by room. Only the Bridge holds. " +
  "After total silence, a single soft cyan ping ripples across " +
  "the infected ship.";

export interface ThoughtVirusManifestCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

export function ThoughtVirusManifestCutscene({
  onComplete,
  reduced,
}: ThoughtVirusManifestCutsceneProps) {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_thought_virus_manifests}
      summary={SUMMARY}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default ThoughtVirusManifestCutscene;
