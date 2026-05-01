/* ═══════════════════════════════════════════════════════
   SLIDESHOW FRAMES — pure-visual renderer driven by currentTimeMs

   Renders the active frame from a SlideshowFrame[] array based
   on a caller-supplied currentTimeMs. NO audio. NO internal
   timer. The caller (TitleAlbumIntro for the title flow,
   LoginMemeBroadcast for the post-login modal) drives time
   from PlayerContext.currentTime so the slideshow stays in
   lock-step with audio across pause/scrub/route-change.

   containerMode:
     - "fullscreen" — fixed inset-0 z-[9999], for the title flow
     - "embedded"   — relative w-full h-full, for in-modal use

   Existing legacy SongSlideshow.tsx is unchanged; this is a
   richer, sync-only renderer for the new use cases.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SlideshowFrame } from "@shared/songSlideshow";

export interface SlideshowFramesProps {
  frames: readonly SlideshowFrame[];
  /** Caller-controlled time in milliseconds. The active frame is
   *  the one whose [startMs, endMs) interval contains this value.
   *  Before the first frame the first is shown; after the last
   *  the last is held. */
  currentTimeMs: number;
  /** Layout mode. Defaults to "embedded". */
  containerMode?: "fullscreen" | "embedded";
  /** Fires exactly once when currentTimeMs first crosses the last
   *  frame's endMs. Useful for completion notification when the
   *  caller would rather not separately watch the audio engine. */
  onLastFrameComplete?: () => void;
  /** Optional dim factor applied to the image (0..1). Defaults to
   *  0.6 so dialog overlays remain readable. */
  brightness?: number;
}

/** Exported for testing — finds the active frame index for a given
 *  timeMs. Before the first frame returns 0; after the last returns
 *  the last index; empty array returns -1. */
export function findActiveFrameIndex(
  frames: readonly SlideshowFrame[],
  timeMs: number,
): number {
  if (frames.length === 0) return -1;
  if (timeMs < frames[0].startMs) return 0;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (timeMs >= f.startMs && timeMs < f.endMs) return i;
  }
  return frames.length - 1;
}

export default function SlideshowFrames({
  frames,
  currentTimeMs,
  containerMode = "embedded",
  onLastFrameComplete,
  brightness = 0.6,
}: SlideshowFramesProps) {
  const activeIndex = useMemo(
    () => findActiveFrameIndex(frames, currentTimeMs),
    [frames, currentTimeMs],
  );
  const frame = activeIndex >= 0 ? frames[activeIndex] : null;
  const isLastFrame = activeIndex === frames.length - 1 && frames.length > 0;

  const completedRef = useRef(false);
  useEffect(() => {
    if (completedRef.current) return;
    if (!frames.length) return;
    const lastEnd = frames[frames.length - 1].endMs;
    if (currentTimeMs >= lastEnd) {
      completedRef.current = true;
      onLastFrameComplete?.();
    }
  }, [currentTimeMs, frames, onLastFrameComplete]);

  // Ken Burns: compute the scale factor based on the fraction of
  // time elapsed within the current frame's window. startScale →
  // endScale linearly. If no kenBurns spec, hold at 1.0.
  const kbScale = useMemo(() => {
    if (!frame?.kenBurns) return 1;
    const total = Math.max(1, frame.endMs - frame.startMs);
    const elapsed = Math.max(0, Math.min(total, currentTimeMs - frame.startMs));
    const t = elapsed / total;
    const { startScale, endScale } = frame.kenBurns;
    return startScale + (endScale - startScale) * t;
  }, [frame, currentTimeMs]);

  const containerClass =
    containerMode === "fullscreen"
      ? "fixed inset-0 z-[9999] bg-black overflow-hidden"
      : "relative w-full h-full overflow-hidden bg-black";

  return (
    <div
      className={containerClass}
      role="img"
      aria-label={frame?.caption ?? "Album slideshow frame"}
    >
      <AnimatePresence mode="wait">
        {frame && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={frame.imageUrl}
              alt={frame.caption ?? ""}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover select-none"
              style={{
                filter: `brightness(${brightness})`,
                transform: `scale(${kbScale})`,
                transformOrigin: "center center",
                transition: "transform 200ms linear, filter 200ms ease-out",
              }}
            />
            {frame.dialogOverlay && (
              <div className="relative z-10 h-full flex items-end justify-center pb-12 px-8 pointer-events-none">
                <p
                  className="font-display text-lg sm:text-2xl text-emerald-50 max-w-3xl text-center leading-relaxed"
                  style={{
                    textShadow:
                      "0 2px 24px rgba(0,0,0,0.85), 0 0 8px rgba(16,185,129,0.4)",
                  }}
                >
                  {frame.dialogOverlay}
                </p>
              </div>
            )}
            {frame.caption && (
              <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 pointer-events-none">
                {frame.caption}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Progress ribbon — narrow line along the bottom showing
          how far through the slideshow we are. */}
      {frames.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 pointer-events-none">
          <div
            className="h-full bg-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
            style={{
              width: `${Math.min(100, ((activeIndex + 1) / frames.length) * 100)}%`,
              transition: "width 200ms ease-out",
            }}
            aria-hidden
          />
        </div>
      )}
      {/* Last-frame badge — gently signals "outro is here" to the
          caller's overlay layer without changing layout. */}
      {isLastFrame && (
        <div
          className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/60 pointer-events-none"
          aria-hidden
        >
          ▸ end of transmission
        </div>
      )}
    </div>
  );
}
