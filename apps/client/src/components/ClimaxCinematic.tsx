/* ═══════════════════════════════════════════════════════
   CLIMAX CINEMATIC — modal video player for act climaxes

   May 2026 producer drop ships three climax MP4s
   (architect_awakens, terminus_breach, watcher_eye) plus
   five climax stills (the MP4 trio + insurgency_rises +
   seer_prophecy as still-only beats). This component plays
   the matching MP4 when one exists, falls back to a Ken-Burns
   still pan when only the still is shipped, and uses any of
   the three expansion_loops as the menu-screen idle ambient
   layer via `ExpansionLoopAmbient` below.

   Used by act-climax surfaces to spend ~12-30s of cinematic
   time on the player's choice landing.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  climaxVideoUrl,
  climaxStillUrl,
  expansionLoopUrl,
  type ClimaxVideoId,
  type ClimaxStillId,
  type ExpansionLoopId,
} from "@shared/aaaArtArchive";

/** Beat ids surface-callable from any act/witnessing/cycle component.
 *  A beat is a (still, optional video) pair — when video exists, it
 *  plays; otherwise the still is shown with a slow Ken-Burns pan. */
export type ClimaxBeatId =
  | "architect_awakens"
  | "terminus_breach"
  | "watcher_eye"
  | "insurgency_rises"
  | "seer_prophecy";

interface BeatSources {
  readonly still: ClimaxStillId;
  readonly video: ClimaxVideoId | null;
}

const BEATS: Record<ClimaxBeatId, BeatSources> = {
  architect_awakens: {
    still: "climax_architect_awakens",
    video: "climax_architect_awakens",
  },
  terminus_breach: {
    still: "climax_terminus_breach",
    video: "climax_terminus_breach",
  },
  watcher_eye: {
    still: "climax_watcher_eye_opens",
    video: "climax_watcher_eye",
  },
  insurgency_rises: {
    still: "climax_insurgency_rises",
    video: null,
  },
  seer_prophecy: {
    still: "climax_seer_prophecy",
    video: null,
  },
};

interface Props {
  /** Which climax beat to show; null hides the modal. */
  beat: ClimaxBeatId | null;
  /** Called when the player dismisses, the video ends, or (for
   *  still-only beats) the 12-second pan finishes. */
  onComplete: () => void;
}

export function ClimaxCinematic({ beat, onComplete }: Props) {
  const [stillTimedOut, setStillTimedOut] = useState(false);

  useEffect(() => {
    if (!beat) return;
    const src = BEATS[beat];
    if (src.video) return;
    // Still-only beat — auto-complete after 12s pan.
    setStillTimedOut(false);
    const t = window.setTimeout(() => setStillTimedOut(true), 12000);
    return () => window.clearTimeout(t);
  }, [beat]);

  useEffect(() => {
    if (stillTimedOut) onComplete();
  }, [stillTimedOut, onComplete]);

  const src = beat ? BEATS[beat] : null;

  return (
    <AnimatePresence>
      {beat && src ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[110] bg-black"
          onClick={onComplete}
          data-testid="climax-cinematic"
          role="dialog"
          aria-label={`Climax cinematic: ${beat.replace(/_/g, " ")}`}
        >
          {src.video ? (
            <video
              src={climaxVideoUrl(src.video)}
              poster={climaxStillUrl(src.still)}
              autoPlay
              playsInline
              onEnded={onComplete}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <motion.img
              src={climaxStillUrl(src.still)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.18 }}
              transition={{ duration: 12, ease: "linear" }}
            />
          )}
          <button
            type="button"
            className="absolute bottom-6 right-6 text-xs font-mono uppercase tracking-[0.25em] text-white/60 hover:text-white/95 underline-offset-4 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
          >
            Continue
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ─── ExpansionLoopAmbient ──────────────────────────────
   Decorative full-bleed looping plate. Three plates ship —
   New Babylon skyline, Thaloria valley, and a void-drift
   field. Picked at random on mount unless the caller pins
   a specific loopId. Suitable as a menu-screen idle layer
   or behind a witness-axis transmission card. */

interface AmbientProps {
  /** Pin a specific loop. Default = stable per-mount random. */
  loopId?: ExpansionLoopId;
  /** Tailwind classes for the wrapping <img>. */
  className?: string;
  /** Opacity overlay applied to the image. Default 0.5. */
  opacity?: number;
}

const LOOP_IDS: readonly ExpansionLoopId[] = [
  "loop_new_babylon_skyline",
  "loop_thaloria_valley",
  "loop_void_drift",
];

export function ExpansionLoopAmbient({ loopId, className, opacity = 0.5 }: AmbientProps) {
  const [resolved] = useState<ExpansionLoopId>(
    () => loopId ?? LOOP_IDS[Math.floor(Math.random() * LOOP_IDS.length)],
  );
  return (
    <img
      src={expansionLoopUrl(resolved)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={className ?? "absolute inset-0 w-full h-full object-cover pointer-events-none"}
      style={{ opacity }}
    />
  );
}
