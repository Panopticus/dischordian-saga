/* ═══════════════════════════════════════════════════════
   WHEEL-REACTION ROUTER

   Watches narrativeFlags for the 6 producer-delivered wheel
   outcome cutscenes from `apps/shared/wheelReactionCutscenes.ts`:

     Act 3 fork (set by `apps/client/src/data/narrativeActs.ts`):
       act3_path_transparent_chosen / act3_path_pragmatic_chosen
       / act3_path_full_secret_chosen
     Act 4 outcome (set by Act4MatchPage handleGameEnd):
       act4_outcome_reconciled / _fragile_trust / _broken_trust

   Plays the matching MP4 once per outcome via the shared
   SingleVideoCutsceneOverlay primitive, then stamps
   `wheel_reaction_<outcome>_seen` so it's idempotent on replay.

   Pure resolver (`resolvePendingWheelReaction`) is exported
   separately for unit testing without a DOM.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  WHEEL_REACTION_CUTSCENES,
  type WheelReactionCutsceneDef,
} from "@shared/wheelReactionCutscenes";
import { SingleVideoCutsceneOverlay } from "./SingleVideoCutsceneOverlay";

export const wheelReactionSeenFlag = (id: string): string =>
  `wheel_reaction_${id}_seen`;

/** Pure resolver: given a narrative-flag map, return the first
 *  pending wheel-reaction cutscene whose trigger flag is true and
 *  whose seen flag is not yet set. Returns null when nothing's
 *  pending. Iteration order matches WHEEL_REACTION_CUTSCENES (act3
 *  first, then act4). */
export function resolvePendingWheelReaction(
  flags: Readonly<Record<string, unknown>>,
): WheelReactionCutsceneDef | null {
  for (const def of WHEEL_REACTION_CUTSCENES) {
    if (flags[def.triggerFlag] !== true) continue;
    if (flags[wheelReactionSeenFlag(def.id)] === true) continue;
    return def;
  }
  return null;
}

export function WheelReactionRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const active = useMemo<WheelReactionCutsceneDef | null>(
    () => resolvePendingWheelReaction(flags),
    [flags],
  );

  const handleComplete = useCallback(() => {
    if (!active) return;
    setNarrativeFlag(wheelReactionSeenFlag(active.id), true);
  }, [active, setNarrativeFlag]);

  if (!active) return null;

  const outcomeLabel = active.outcome
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={active.id}
      videoRelPath={active.videoRelPath}
      primaryLabel={`Act ${active.act} · Wheel`}
      secondaryLabel={outcomeLabel}
      onComplete={handleComplete}
    />
  );
}

export default WheelReactionRouter;
