/* ═══════════════════════════════════════════════════════
   SLIDESHOW PLAYER ROOT — global host for SongSlideshow.

   Mount this once near the app root. It subscribes to the
   witnessing store's activeSlideshow slot and mounts a
   <SongSlideshow /> whenever a caller queues one via
   `useWitnessingStore.getState().playSlideshow(id, opts)`
   (or the convenience `playSlideshow(id, opts)` helper).

   Keeps slideshow playback decoupled from whatever view the
   player is on — a narrative act in the card game can fire
   a slideshow and it just plays over whatever's rendered.
   ═══════════════════════════════════════════════════════ */

import { useCallback } from "react";
import { SongSlideshow } from "./SongSlideshow";
import { useWitnessingStore } from "@/stores/witnessingStore";

export function SlideshowPlayerRoot() {
  const active = useWitnessingStore((s) => s.activeSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);
  const closeActive = useWitnessingStore((s) => s.closeActiveSlideshow);

  const handleComplete = useCallback(() => {
    completeActive();
  }, [completeActive]);

  const handleClose = useCallback(() => {
    closeActive();
  }, [closeActive]);

  if (!active) return null;

  return (
    <SongSlideshow
      def={active.def}
      onComplete={handleComplete}
      onSkip={handleComplete}
      onClose={handleClose}
    />
  );
}
