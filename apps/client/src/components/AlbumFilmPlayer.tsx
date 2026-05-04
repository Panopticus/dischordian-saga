/* ═══════════════════════════════════════════════════════
   ALBUM-AS-FILM PLAYER

   Plays an album end-to-end as a continuous slideshow film.
   The user's framing: "the entire albums are slideshow movies
   that tell the history and foretell the future." Album 4
   (West by God) was already authored as one continuous
   narrative; this driver finally gives it (and the others)
   the autoplay it deserves.

   Mechanism:
     - Drives SongSlideshow through each track in sequence.
     - On each onEnd, advances to the next track without
       remounting the overlay (a fade transition between).
     - "Awaken from the Album" pauses + bookmarks position
       so the player can resume later.
     - Calls trpc.dreamerVisions.markAlbumFilmComplete on
       end-to-end completion → earns the Album Film Witness
       cosmetic tier.

   Used by AlbumPage's "Watch as Film" CTA and the
   Antiquarian's Index album row.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { trpc } from "@/lib/trpc";
import { getSlideshow } from "@shared/songSlideshows";
import type { SongSlideshowDef } from "@shared/songSlideshow";

function deriveCurrentAct(
  flags: Readonly<Record<string, boolean>> | undefined,
): number {
  if (!flags) return 1;
  for (let n = 7; n >= 1; n--) {
    if (flags[`act${n}_started`] || flags[`act${n}_complete`]) {
      return n;
    }
  }
  return 1;
}

export interface AlbumFilmPlayerProps {
  /** Album slug (matches AlbumSlug in prophecyVisionMap.ts). */
  albumSlug: string;
  /** Ordered list of slideshow ids that make up the film. */
  slideshowIds: readonly string[];
  /** Optional starting trackId to resume from a bookmark. */
  resumeFromTrackId?: string;
  /** Fired after the film completes end-to-end. */
  onComplete?: () => void;
  /** Fired when the player chooses "Awaken from the Album". */
  onAwaken?: (bookmarkedTrackId: string | null) => void;
}

export default function AlbumFilmPlayer({
  albumSlug,
  slideshowIds,
  resumeFromTrackId,
  onComplete,
  onAwaken,
}: AlbumFilmPlayerProps) {
  const game = useGame();
  const playSlideshow = useWitnessingStore((s) => s.playSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);
  const closeActive = useWitnessingStore((s) => s.closeActiveSlideshow);

  // Resolve the starting index from the resume bookmark, if any.
  const startIndex = resumeFromTrackId
    ? slideshowIds.findIndex((id) => id === resumeFromTrackId)
    : -1;
  const [trackIndex, setTrackIndex] = useState(startIndex >= 0 ? startIndex : 0);
  const [done, setDone] = useState(false);

  const completeMutation = trpc.dreamerVisions.markAlbumFilmComplete.useMutation();
  const bookmarkMutation = trpc.dreamerVisions.setAlbumFilmBookmark.useMutation();

  const handleAwaken = useCallback(() => {
    const trackId = slideshowIds[trackIndex] ?? null;
    bookmarkMutation.mutate({ albumSlug, trackId });
    closeActive();
    onAwaken?.(trackId);
  }, [slideshowIds, trackIndex, bookmarkMutation, albumSlug, closeActive, onAwaken]);

  useEffect(() => {
    if (done) return;
    if (trackIndex >= slideshowIds.length) {
      setDone(true);
      const currentAct = deriveCurrentAct(game.state.narrativeFlags);
      completeMutation.mutate({ albumSlug, currentAct });
      onComplete?.();
      return;
    }

    const slideshowId = slideshowIds[trackIndex];
    const def: SongSlideshowDef | undefined = getSlideshow(slideshowId);
    if (!def) {
      // Skip missing tracks rather than break the film.
      setTrackIndex((i) => i + 1);
      return;
    }
    playSlideshow(def, {
      onComplete: () => {
        completeActive();
        // Advance after a brief inter-track fade.
        setTimeout(() => setTrackIndex((i) => i + 1), 400);
      },
      onClose: () => {
        // Treat close as awaken — the player wants out.
        handleAwaken();
      },
    });
  }, [
    trackIndex,
    slideshowIds,
    playSlideshow,
    completeActive,
    completeMutation,
    albumSlug,
    onComplete,
    handleAwaken,
    done,
    game.state.narrativeFlags,
  ]);

  // Floating "Awaken from the Album" affordance pinned bottom-left.
  // Doesn't block the slideshow chrome; sits above the stage.
  if (done) return null;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-6 left-6 z-[10000] rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 hover:bg-black/60 hover:text-white/90 transition-all"
      onClick={handleAwaken}
      aria-label="Awaken from the album"
    >
      awaken from the album
    </motion.button>
  );
}
