/* ═══════════════════════════════════════════════════════
   LOREDEX COMPLETION FLAG WATCHER

   Listens to LoredexContext.discoveredIds and fires the
   narrative flags listed in LOREDEX_COMPLETION_TARGETS via
   GameContext.setNarrativeFlag the moment a target's
   required entries are all discovered.

   Renders nothing — pure side effect. Mount once near the
   top of the provider tree, INSIDE both LoredexProvider and
   GameProvider.

   Audit follow-up: closes the four "no producer" entries in
   narrativeFlagAudit.test.ts:42 KNOWN_ORPHANS list.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGame } from "@/contexts/GameContext";
import {
  flagsToFireForDiscovery,
} from "@shared/loredexCompletionTargets";

export function LoredexCompletionFlagWatcher(): null {
  const { discoveredIds } = useLoredex();
  const { state, setNarrativeFlag } = useGame();
  // Track which flags we've already fired this session so
  // re-renders don't spam setNarrativeFlag. The narrative-flag
  // store itself is also idempotent on duplicate sets, so this
  // is belt-and-suspenders.
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const ready = flagsToFireForDiscovery(discoveredIds);
    for (const flag of ready) {
      if (firedRef.current.has(flag)) continue;
      // Already in narrativeFlags? Mark fired and move on.
      if (state.narrativeFlags?.[flag]) {
        firedRef.current.add(flag);
        continue;
      }
      setNarrativeFlag(flag, true);
      firedRef.current.add(flag);
    }
  }, [discoveredIds, state.narrativeFlags, setNarrativeFlag]);

  return null;
}
