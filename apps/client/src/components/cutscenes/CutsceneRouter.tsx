/* ═══════════════════════════════════════════════════════
   CUTSCENE ROUTER

   Watches `state.narrativeFlags` for the trigger flags
   declared in `apps/shared/cutsceneRegistry.ts` and renders
   the matching named cutscene. Mounted once at the App
   root; any page can fire a cutscene by setting the
   appropriate trigger flag (e.g. `cutscene_awakening_triggered`).

   This sits BESIDE the existing <CutsceneOverlay/> which
   handles per-quest dialog cutscenes — it does not replace
   that component. Animated (video) cutscenes go through
   here; dialog/lines cutscenes continue going through
   CutsceneOverlay.

   Producer asset specs:
   `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md`
   ═══════════════════════════════════════════════════════ */
import { useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  CUTSCENE_REGISTRY,
  type CutsceneDefinition,
} from "@shared/cutsceneRegistry";
import { AwakeningCutscene } from "@/components/cutscenes/AwakeningCutscene";
import { FirstHumanContactCutscene } from "@/components/cutscenes/FirstHumanContactCutscene";
import { ElaraMemoryRecoveryCutscene } from "@/components/cutscenes/ElaraMemoryRecoveryCutscene";
import { BreakingPointCutscene } from "@/components/cutscenes/BreakingPointCutscene";
import { ThoughtVirusManifestCutscene } from "@/components/cutscenes/ThoughtVirusManifestCutscene";
import { PrestigeResetCutscene } from "@/components/cutscenes/PrestigeResetCutscene";

type AnimatedCutsceneComponent = (props: {
  onComplete: () => void;
  reduced?: boolean;
}) => ReactElement;

const COMPONENT_BY_ID: Record<
  CutsceneDefinition["id"],
  AnimatedCutsceneComponent
> = {
  cutscene_awakening: AwakeningCutscene,
  cutscene_first_human_contact: FirstHumanContactCutscene,
  cutscene_elara_memory_recovery: ElaraMemoryRecoveryCutscene,
  cutscene_breaking_point: BreakingPointCutscene,
  cutscene_thought_virus_manifests: ThoughtVirusManifestCutscene,
  cutscene_prestige_reset: PrestigeResetCutscene,
};

export function CutsceneRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const active = useMemo<CutsceneDefinition | null>(() => {
    for (const def of Object.values(CUTSCENE_REGISTRY)) {
      const triggered = flags[def.triggerFlag] === true;
      const seenFlag = `cutscene_${def.id.replace(/^cutscene_/, "")}_seen`;
      const alreadySeen = flags[seenFlag] === true;
      if (triggered && !alreadySeen) return def;
    }
    return null;
  }, [flags]);

  if (!active) return null;

  const Component = COMPONENT_BY_ID[active.id];
  if (!Component) return null;

  const handleComplete = (): void => {
    // Clear the trigger so we don't loop, and stamp every
    // declared "setsFlags" entry true so downstream beats can
    // observe completion. Keep these idempotent — repeated
    // flag writes are cheap and safe.
    setNarrativeFlag(active.triggerFlag, false);
    for (const flag of active.setsFlags) {
      setNarrativeFlag(flag, true);
    }
  };

  return <Component onComplete={handleComplete} />;
}

export default CutsceneRouter;
