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

import { useCallback, useMemo } from "react";
import { SongSlideshow } from "./SongSlideshow";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { applySlideshowReward } from "@/stores/dischordiaCycleStore";
import {
  recordMemorableMoment,
  useMemorableMomentsStore,
} from "@/stores/memorableMomentsStore";
import { getDynamicLionFrames } from "@shared/memorableMoments";
import { useGame } from "@/contexts/GameContext";

export function SlideshowPlayerRoot() {
  const active = useWitnessingStore((s) => s.activeSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);
  const closeActive = useWitnessingStore((s) => s.closeActiveSlideshow);
  const moments = useMemorableMomentsStore((s) => s.moments);
  const { setNarrativeFlag } = useGame();

  // §11.2 — when the queued slideshow is "The Lion in Black",
  // substitute its dynamic frames (2-10) with captions curated
  // from the player's memorable moments. Every other slideshow
  // plays with its canonical frames untouched.
  const slideshowDef = useMemo(() => {
    if (!active) return null;
    if (active.def.id === "the-lion-in-black") {
      return getDynamicLionFrames(active.def, moments);
    }
    return active.def;
  }, [active, moments]);

  const handleComplete = useCallback(() => {
    // Apply the slideshow's registered light-energy reward (if any)
    // to the Dischordia Cycle store before firing the caller's
    // onComplete. This is how §5.4's "+500 community Light Energy"
    // actually lands on the meter.
    if (active) {
      applySlideshowReward(active.def.lightEnergyReward);
      // §5 — every slideshow declares a set of narrative flags it
      // raises on completion. SlideshowPlayerRoot is the single
      // site that applies them so callers don't each have to
      // duplicate the flag wiring.
      if (active.def.flagsSetOnComplete) {
        for (const flag of active.def.flagsSetOnComplete) {
          setNarrativeFlag(flag, true);
        }
      }
      // Witnessing §11.2 — record the watched cinematic as a
      // memorable moment. The Antiquarian's Lion in Black feed
      // consumes `slideshow_watched` moments into its three
      // slideshow-themed slots (Observation Deck Vortex, Engineer
      // execution, Eyes falling in the grass).
      recordMemorableMoment(
        "slideshow_watched",
        `The moment you watched ${active.def.title}.`,
        undefined,
        { slideshowId: active.def.id },
      );
    }
    completeActive();
  }, [active, completeActive, setNarrativeFlag]);

  const handleClose = useCallback(() => {
    closeActive();
  }, [closeActive]);

  if (!active || !slideshowDef) return null;

  return (
    <SongSlideshow
      def={slideshowDef}
      onComplete={handleComplete}
      onSkip={handleComplete}
      onClose={handleClose}
    />
  );
}
