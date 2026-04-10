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
import { applySlideshowReward } from "@/stores/dischordiaCycleStore";

export function SlideshowPlayerRoot() {
  const active = useWitnessingStore((s) => s.activeSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);
  const closeActive = useWitnessingStore((s) => s.closeActiveSlideshow);

  const handleComplete = useCallback(() => {
    // Apply the slideshow's registered light-energy reward (if any)
    // to the Dischordia Cycle store before firing the caller's
    // onComplete. This is how §5.4's "+500 community Light Energy"
    // actually lands on the meter.
    if (active) {
      applySlideshowReward(active.def.lightEnergyReward);
    }
    completeActive();
  }, [active, completeActive]);

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
