/* ═══════════════════════════════════════════════════════
   HUMAN-LIFE VIDEO OVERLAY — global, sequence-aware

   Reads the canonical 4-video sequence from
   apps/shared/humanLifeVideoSequence.ts and surfaces the
   first triggered-but-unseen video as a full-screen overlay.

   Behavior:
     - Watches narrativeFlags for any video's triggerFlag
     - Renders the first pending video via the existing
       SingleVideoCutsceneOverlay primitive (poster fallback
       if the producer file is missing)
     - On complete: clears the trigger, sets the seen flag,
       advances to the next pending video on the next paint

   Mounted once at App root (in App.tsx).
   ═══════════════════════════════════════════════════════ */

import { useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import { pendingHumanLifeVideo } from "@shared/humanLifeVideoSequence";
import { SingleVideoCutsceneOverlay } from "@/components/cutscenes/SingleVideoCutsceneOverlay";

export function HumanLifeVideoOverlay(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();

  const flags = useMemo(
    () =>
      new Set(
        Object.entries(state.narrativeFlags ?? {})
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [state.narrativeFlags],
  );

  const video = useMemo(() => pendingHumanLifeVideo(flags), [flags]);

  if (!video) return null;

  const handleComplete = (): void => {
    setNarrativeFlag(video.triggerFlag, false);
    setNarrativeFlag(video.seenFlag, true);
  };

  return (
    <SingleVideoCutsceneOverlay
      videoRelPath={video.videoRelPath}
      cutsceneId={video.id}
      primaryLabel={video.primaryLabel}
      secondaryLabel={video.secondaryLabel}
      frameLine={video.frameLine}
      onComplete={handleComplete}
      diagnosticDeliveryHint={`The Human's ${video.era} life-arc video — ${video.videoRelPath}`}
    />
  );
}

export default HumanLifeVideoOverlay;
