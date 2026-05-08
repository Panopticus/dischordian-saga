/* ═══════════════════════════════════════════════════════
   ELARA MEMORY RECOVERY CUTSCENE — Cutscene 3 of 5

   Beat: fires on the first Elara trust-100 milestone after
   Memorial Corridor unlock (gated on `elara_trust >= 60` +
   Chapter 6 complete). Four Seedance shots, 60s total.

   Shot specs (Atarion crystal spires, Senator Voss, the
   Panopticon transfer, Ark 1047 reveal) are in
   `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` §3. This
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
  "Elara's first life unspools — Senator Voss of Atarion, " +
  "speaking truth as her crystal circlet cracks; the Panopticon " +
  "consciousness transfer; and the long, scarred drift of Ark " +
  "1047 carrying what she became.";

export interface ElaraMemoryRecoveryCutsceneProps {
  onComplete: AnimatedCutscenePlayerProps["onComplete"];
  reduced?: boolean;
}

export function ElaraMemoryRecoveryCutscene({
  onComplete,
  reduced,
}: ElaraMemoryRecoveryCutsceneProps): JSX.Element {
  return (
    <AnimatedCutscenePlayer
      definition={CUTSCENE_REGISTRY.cutscene_elara_memory_recovery}
      summary={SUMMARY}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default ElaraMemoryRecoveryCutscene;
