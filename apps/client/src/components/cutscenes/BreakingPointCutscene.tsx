/* ═══════════════════════════════════════════════════════
   BREAKING POINT CUTSCENE — Cutscene 4 of 5

   Beat: fires at the Act 2 → Act 3 transition (highest-tension
   morality choice). Five Seedance shots — 3 setup + 2 branched
   consequence — totalling ~45s plus the player-controlled
   choice moment in Shot 4.C.

   Shot specs (split-screen symmetry, tension build, branched
   consequences for Save Elara / Save Human / Refuse) are in
   `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` §4.

   The branched-consequence wiring is intentionally NOT in this
   scaffold — the gate only requires the component to exist and
   carry the right name. Branch selection will land in a later
   PR alongside the asset delivery.
   ═══════════════════════════════════════════════════════ */
import {
  AnimatedCutscenePlayer,
  type AnimatedCutscenePlayerProps,
} from "@/components/cutscenes/AnimatedCutscenePlayer";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

const SUMMARY =
  "Split-screen symmetry: Elara on the warm side, the Human on " +
  "the cold side, both speaking at once. The seam between them " +
  "narrows. A choice is asked, and you cannot defer it.";

export interface BreakingPointCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

export function BreakingPointCutscene({
  onComplete,
  reduced,
}: BreakingPointCutsceneProps): JSX.Element {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_breaking_point}
      summary={SUMMARY}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default BreakingPointCutscene;
