/* ═══════════════════════════════════════════════════════
   useRomanceActScene — splice the romance variant into act
   transitions

   Plan §A5. Companion to the act-completion gate. When the
   gate fires (act-intro / act-midpoint / act-close), this
   hook resolves whether a romance-conditional scene should
   play and exposes its line list.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import {
  pickActScene,
  type ActId,
  type RomanceActScene,
} from "@shared/romanceActScenes";
import { useGame } from "@/contexts/GameContext";

export interface UseRomanceActSceneResult {
  scene: RomanceActScene | null;
}

export function useRomanceActScene(
  actId: ActId,
  beat: RomanceActScene["beat"],
): UseRomanceActSceneResult {
  const { state } = useGame();
  const scene = useMemo(
    () => pickActScene(actId, beat, { flags: state.narrativeFlags }),
    [actId, beat, state.narrativeFlags],
  );
  return { scene };
}
