/* ═══════════════════════════════════════════════════════
   CINEMATIC GATE — Generic flag-driven cinematic player

   A reusable shell for narrative video beats. Takes a video
   URL and a unique `cinematicId`, plays it fullscreen, fires
   `onComplete` when it finishes, and persists a per-cinematic
   "seen" flag so the same beat does not replay forever.

   Same playback hardening as OpeningCinematic:
     - SKIP / load-error / safety-timer ⇒ NOT marked as seen
       (so the player gets another shot next session).
     - Only `onEnded` (or `currentTime >= duration`) marks it
       seen permanently.
     - The `loadedmetadata` safety timer no-ops on zero/NaN
       durations and re-arms on `durationchange`. The 90 s
       absolute fallback still protects against true hangs.

   Usage — paste a CDN URL into your data file's `videoUrl`
   field, then mount the gate where the beat should play:

     {beat.videoUrl && (
       <CinematicGate
         cinematicId={beat.id}
         videoUrl={beat.videoUrl}
         onComplete={(reachedEnd) => advanceBeat(beat.id, reachedEnd)}
       />
     )}

   No URL ⇒ render nothing. This lets the data layer keep a
   `videoUrl: null` placeholder until the asset lands without
   breaking the scene graph.
   ═══════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEEN_KEY_PREFIX = "loredex_cinematic_seen:";

interface CinematicGateProps {
  /** Stable identifier used to persist the per-cinematic "seen" flag. */
  cinematicId: string;
  /** Direct URL to the video asset (S3/CloudFront). Render is skipped if missing. */
  videoUrl: string;
  /** Optional poster frame shown while the video loads. */
  posterUrl?: string;
  /**
   * Called when the cinematic exits — by reaching its end naturally,
   * by SKIP, or by load failure. The boolean argument distinguishes
   * those cases so callers can advance state appropriately.
   */
  onComplete: (reachedEndNaturally: boolean) => void;
  /**
   * When true, the gate refuses to mount if the cinematicId has
   * already been marked seen in localStorage. Defaults to true.
   * Set false for rewatchable cinematics (e.g. theater mode).
   */
  oncePerSession?: boolean;
  /** Delay in ms before the SKIP button appears. */
  skipAfterMs?: number;
}

export default function CinematicGate({
  cinematicId,
  videoUrl,
  posterUrl,
  onComplete,
  oncePerSession = true,
  skipAfterMs = 2000,
}: CinematicGateProps) {
  const seenKey = `${SEEN_KEY_PREFIX}${cinematicId}`;

  // Compute up-front (synchronously, before mount) whether we should
  // skip rendering entirely because the player already finished this
  // beat. Lazy initial state keeps the read off the render path on
  // every re-render, and lets us drive an early-return AFTER all hooks
  // are called — required by react-hooks/rules-of-hooks.
  const [alreadySeen] = useState<boolean>(() => {
    if (!oncePerSession) return false;
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(seenKey) === "1";
    } catch { return false; }
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const completedRef = useRef(false);
  const endSafetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If the cinematic was already seen, fire onComplete on next tick so
  // the parent can advance state without a synchronous setState during
  // render. The render path below short-circuits to null below the
  // hooks block so React's hook ordering invariant is preserved.
  useEffect(() => {
    if (!alreadySeen) return;
    onComplete(true);
  }, [alreadySeen, onComplete]);

  const handleComplete = useCallback((reachedEndNaturally: boolean) => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (endSafetyTimerRef.current) {
      clearTimeout(endSafetyTimerRef.current);
      endSafetyTimerRef.current = null;
    }

    const v = videoRef.current;
    if (v) v.pause();

    if (reachedEndNaturally) {
      try { window.localStorage.setItem(seenKey, "1"); } catch { /* storage full */ }
    }

    setFadeOut(true);
    setTimeout(() => onComplete(reachedEndNaturally), 1500);
  }, [onComplete, seenKey]);

  // Show SKIP after the configured delay so users can always escape
  // even when the video never reaches a playing state.
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), skipAfterMs);
    return () => clearTimeout(t);
  }, [skipAfterMs]);

  const handleVideoEnd = useCallback(() => handleComplete(true), [handleComplete]);

  // Same hardening as OpeningCinematic — only arm when we have a real
  // duration. Zero/NaN means metadata hasn't fully resolved (iOS Safari
  // range-request quirk); wait for `durationchange` instead.
  const armEndSafety = useCallback((durationSec: number) => {
    if (endSafetyTimerRef.current) clearTimeout(endSafetyTimerRef.current);
    if (!Number.isFinite(durationSec) || durationSec <= 0) return;
    const ms = Math.min(120_000, Math.ceil(durationSec * 1000) + 2_000);
    endSafetyTimerRef.current = setTimeout(() => handleComplete(false), ms);
  }, [handleComplete]);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    const dur = v && Number.isFinite(v.duration) ? v.duration : 0;
    armEndSafety(dur);
  }, [armEndSafety]);

  const handleDurationChange = useCallback(() => {
    const v = videoRef.current;
    const dur = v && Number.isFinite(v.duration) ? v.duration : 0;
    armEndSafety(dur);
  }, [armEndSafety]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    if (v.currentTime >= v.duration) handleComplete(true);
  }, [handleComplete]);

  // Absolute fallback against true hangs. Skipped when alreadySeen so
  // we don't fire a phantom onComplete after the parent already
  // advanced past this beat.
  useEffect(() => {
    if (alreadySeen) return;
    const t = setTimeout(() => {
      if (!endSafetyTimerRef.current) handleComplete(false);
    }, 90_000);
    return () => clearTimeout(t);
  }, [alreadySeen, handleComplete]);

  useEffect(() => {
    return () => {
      if (endSafetyTimerRef.current) clearTimeout(endSafetyTimerRef.current);
    };
  }, []);

  // Post-hooks short-circuit: nothing to render when this beat is
  // already done. Hooks above ran in their stable order so React's
  // ordering invariant holds across mount/unmount.
  if (alreadySeen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: fadeOut ? 1.5 : 0.5 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleDurationChange}
          onTimeUpdate={handleTimeUpdate}
          onError={() => handleComplete(false)}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, color-mix(in oklch, var(--bg-void) 60%, transparent) 100%)",
          }}
        />

        <AnimatePresence>
          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                handleComplete(false);
              }}
              className="absolute bottom-4 right-4 z-50 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all"
              style={{
                background: "color-mix(in oklch, var(--bg-void) 60%, transparent)",
                border: "1px solid color-mix(in oklch, var(--text-primary) 15%, transparent)",
                color: "color-mix(in oklch, var(--text-primary) 50%, transparent)",
              }}
            >
              SKIP &gt;&gt;
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
