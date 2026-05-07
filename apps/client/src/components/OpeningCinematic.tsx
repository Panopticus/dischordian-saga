/* ═══════════════════════════════════════════════════════
   OPENING CINEMATIC — Fullscreen cryo-pod video + Saga Theme
   Video plays first; the saga theme (the canonical title-card
   theme song) starts on the BEGIN click and rides at a barely-
   there volume under the video audio so the player perceives a
   single uninterrupted bed running from cryo-pod open through
   Elara's first dialog. The audio element is handed to the
   parent via onComplete so it persists beyond this component;
   AwakeningVOPlayer ducks/restores it across each VO line.

   The BEGIN click also explicitly stops the title-screen song
   (The Enigma's Lament, T01) — TitlePage's unmount cleanup
   pauses it, but we belt-and-braces it here so a stray resume
   call can't bleed the lament under Elara's first VO.

   Bed audio rotates through the full 4-track saga playlist on
   `ended` so music carries through the entire character-creation
   flow without obvious looping.
   ═══════════════════════════════════════════════════════ */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/contexts/PlayerContext";
import { SAGA_THEMES } from "@/contexts/SagaThemeBGMContext";

const CINEMATIC_VIDEO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/opening_cinematic_9b899561.mp4";
/** First track in the rotation — the canonical saga theme.
 *  Exported for the AwakeningPage preload sink. */
export const AWAKENING_BED_URL = SAGA_THEMES[0].url;
/** Volume the bed runs at while the cinematic video is the focal
 *  audio — quiet enough not to fight the video, present enough to
 *  bridge into Elara's first line. */
const BED_VOLUME_UNDER_VIDEO = 0.06;

interface OpeningCinematicProps {
  /**
   * Called when cinematic is done. Receives the Audio element so parent
   * can keep it playing — the bed walks the SAGA_THEMES playlist on
   * `ended`, so this same element carries music through every
   * character-creation step. AwakeningVOPlayer ducks/restores it across
   * each VO line.
   */
  onComplete: (themeAudio: HTMLAudioElement | null) => void;
}

export default function OpeningCinematic({ onComplete }: OpeningCinematicProps) {
  const player = usePlayer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const bedAudioRef = useRef<HTMLAudioElement | null>(null);
  const bedTrackIdxRef = useRef(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [videoState, setVideoState] = useState<"loading" | "waiting-for-click" | "playing-muted" | "playing-unmuted" | "needs-tap">("loading");
  const completedRef = useRef(false);
  const userClickedRef = useRef(false);
  const endSafetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show skip button after a short delay — visible regardless of playback state
  // so users can always escape if the video fails to start.
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Show a "BEGIN" splash first — the click creates a user gesture,
  // which unlocks unmuted autoplay for the video.
  useEffect(() => {
    setVideoState("waiting-for-click");
  }, []);

  /** Called when user clicks "BEGIN" — starts video with sound and
   *  kicks off the saga-theme bed at a low volume so a single piece
   *  of music carries from the cryo-pod open straight into Elara's
   *  first dialog beat. The user gesture here is the only reliable
   *  window we'll have to start audio playback (iOS Safari rejects
   *  later programmatic plays). */
  const handleBeginClick = useCallback(async () => {
    userClickedRef.current = true;
    const video = videoRef.current;
    if (!video) return;

    // Stop any title-screen song (The Enigma's Lament) cleanly. The
    // route unmount cleanup paused it already, but we belt-and-braces
    // it here so a stray resume() can't bleed the lament under
    // Elara's first VO.
    try { player.pause(); } catch { /* never throws, but defensive */ }

    // Spin up the saga-theme bed alongside the video. It rides quiet
    // under the cinematic audio and is handed off to the AwakeningPage
    // in handleComplete; AwakeningVOPlayer ducks and restores it from
    // there. The bed walks the full SAGA_THEMES playlist on `ended`
    // so a single Audio element carries music through the cryo-pod
    // open, Elara's intro, and every character-creation step without
    // obvious one-track looping.
    if (!bedAudioRef.current) {
      bedTrackIdxRef.current = 0;
      const bed = new Audio(SAGA_THEMES[0].url);
      bed.loop = false;
      bed.preload = "auto";
      bed.volume = BED_VOLUME_UNDER_VIDEO;
      bed.addEventListener("ended", () => {
        bedTrackIdxRef.current = (bedTrackIdxRef.current + 1) % SAGA_THEMES.length;
        bed.src = SAGA_THEMES[bedTrackIdxRef.current].url;
        // Volume property persists across src changes, so any duck
        // level set by AwakeningVOPlayer rolls into the next track.
        bed.play().catch(() => { /* gesture lost — VO will restart */ });
      });
      bedAudioRef.current = bed;
      bed.play().catch(() => {
        /* autoplay blocked — handleComplete still hands the element
           off; AwakeningVOPlayer.startThemeIfNeeded retries on the
           next user gesture (Elara's first line). */
      });
    }

    // Try unmuted first — should work because we have a user gesture
    video.muted = false;
    try {
      await video.play();
      setVideoState("playing-unmuted");
    } catch {
      // Unmuted failed — fall back to muted
      video.muted = true;
      try {
        await video.play();
        setVideoState("playing-muted");
      } catch {
        setVideoState("needs-tap");
      }
    }
  }, [player]);

  /** Hand off the saga-theme bed (already playing, started by
   *  handleBeginClick) and fade out the cinematic. The bed continues
   *  uninterrupted so a single piece of music bridges the cryo-pod
   *  open into Elara's first dialog. AwakeningVOPlayer takes over
   *  ducking/restoring from the first VO line onward. If the user
   *  reached the cinematic via a SKIP / safety-timer / load-error
   *  path before clicking BEGIN, the bed was never created — we
   *  fall back to a paused element so AwakeningVOPlayer can still
   *  start it on the first VO. */
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (endSafetyTimerRef.current) {
      clearTimeout(endSafetyTimerRef.current);
      endSafetyTimerRef.current = null;
    }

    let themeAudio = bedAudioRef.current;
    if (!themeAudio) {
      themeAudio = new Audio(AWAKENING_BED_URL);
      themeAudio.loop = true;
      themeAudio.volume = 0;
      themeAudio.preload = "auto";
      bedAudioRef.current = themeAudio;
    }

    // Visual fade out FIRST. Pausing the video before the fade was
    // amputating the last second of Elara's tail dialogue — we now let
    // the audio carry through the fade and stop the element only after
    // the overlay is fully transparent. 0.8s fade is plenty once the
    // pause is no longer racing the audio.
    setFadeOut(true);
    setTimeout(() => {
      const video = videoRef.current;
      if (video) video.pause();
      onComplete(themeAudio);
    }, 800);
  }, [onComplete]);

  const handleVideoEnd = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Some browsers (notably iOS Safari with CDN-hosted MP4s) occasionally
  // fail to fire `ended`. Arm a safety timer based on actual duration,
  // and a hard cap so the cinematic can never hang forever. CRITICAL:
  // only arm when we have a finite, positive duration. Previously the
  // 5_000ms floor meant a degenerate metadata response (duration=0/NaN
  // on iOS Safari range requests) cut the cinematic off after 5s — and
  // then the parent would mark it as "seen", locking the player out
  // permanently. Now: no metadata, no timer. The 90s absolute fallback
  // below still protects against true hangs.
  const armEndSafety = useCallback((durationSec: number) => {
    if (endSafetyTimerRef.current) clearTimeout(endSafetyTimerRef.current);
    if (!Number.isFinite(durationSec) || durationSec <= 0) return;
    const ms = Math.min(120_000, Math.ceil(durationSec * 1000) + 2_000);
    endSafetyTimerRef.current = setTimeout(() => handleComplete(), ms);
  }, [handleComplete]);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    const dur = v && Number.isFinite(v.duration) ? v.duration : 0;
    // Pass the actual duration through; armEndSafety now no-ops on
    // non-finite/zero durations and waits for a later durationchange.
    armEndSafety(dur);
  }, [armEndSafety]);

  // Some browsers report duration on `durationchange` rather than
  // `loadedmetadata` (or update it later). Re-arm the safety timer
  // when a real duration finally arrives.
  const handleDurationChange = useCallback(() => {
    const v = videoRef.current;
    const dur = v && Number.isFinite(v.duration) ? v.duration : 0;
    armEndSafety(dur);
  }, [armEndSafety]);

  // Belt-and-suspenders: if `timeupdate` shows the video has actually run
  // past its reported duration but `ended` never fired, complete anyway.
  // Must NOT trigger early, or the final moments of dialog get cut off:
  // require `currentTime` to overshoot `duration` by 0.25s AND for the
  // browser to still consider the video "playing" (not seeking, not
  // paused). On well-behaved browsers `ended` fires first and this never
  // triggers; this only catches the iOS Safari case where `ended` is
  // genuinely missed.
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    if (v.paused) return;
    if (v.currentTime >= v.duration + 0.25) {
      handleComplete();
    }
  }, [handleComplete]);

  // Absolute fallback: if no metadata ever arrives, still exit after 90s.
  // This is NOT a natural end — the player should get another chance
  // next session, so we pass `false`.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!endSafetyTimerRef.current) handleComplete();
    }, 90_000);
    return () => clearTimeout(t);
  }, [handleComplete]);

  useEffect(() => {
    return () => {
      if (endSafetyTimerRef.current) clearTimeout(endSafetyTimerRef.current);
    };
  }, []);

  // Handle user tap — unmute or start playback
  const handleTap = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (videoState === "needs-tap") {
      // First tap — try to start playback unmuted
      video.muted = false;
      try {
        await video.play();
        setVideoState("playing-unmuted");
      } catch {
        // Unmuted play failed — try muted
        video.muted = true;
        try {
          await video.play();
          setVideoState("playing-muted");
        } catch {
          // Total failure — skip cinematic. Not a natural end.
          handleComplete();
        }
      }
    } else if (videoState === "playing-muted") {
      // Already playing muted — unmute on tap
      video.muted = false;
      setVideoState("playing-unmuted");
    }
  }, [videoState, handleComplete]);

  const showUnmutePrompt = videoState === "playing-muted";
  const showStartPrompt = videoState === "needs-tap";
  const showBeginSplash = videoState === "waiting-for-click";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: fadeOut ? 1.5 : 0.5 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        onClick={showBeginSplash ? handleBeginClick : handleTap}
      >
        {/* Video — fullscreen cover */}
        <video
          ref={videoRef}
          src={CINEMATIC_VIDEO}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleDurationChange}
          onTimeUpdate={handleTimeUpdate}
          onError={() => {
            console.error("[Opening Cinematic] Video failed to load, skipping");
            handleComplete();
          }}
        />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, color-mix(in oklch, var(--bg-void) 60%, transparent) 100%)",
          }}
        />

        {/* Top gradient for text readability */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Title overlay — appears briefly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
        >
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.5em] void-text-energy mb-2 opacity-70">
            DGRS LABS PRESENTS
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-[0.15em] text-white/80">
            THE DISCHORDIAN SAGA
          </h1>
        </motion.div>

        {/* "BEGIN EXPERIENCE" splash — gets user gesture for unmuted playback */}
        {showBeginSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer"
          >
            <div className="text-center">
              <p className="font-mono text-[10px] tracking-[0.5em] void-text-energy mb-6 opacity-70">
                DGRS LABS PRESENTS
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-[0.15em] text-white/90 mb-8">
                THE DISCHORDIAN SAGA
              </h1>
              <div className="w-20 h-20 rounded-full border-2 void-border-success flex items-center justify-center mx-auto mb-4 void-border-success void-bg-success transition-all animate-pulse">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="void-text-energy ml-1">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </div>
              <p className="font-mono text-xs void-text-energy tracking-[0.3em]">
                TAP TO BEGIN
              </p>
            </div>
          </motion.div>
        )}

        {/* Click to start / unmute prompt */}
        {(showStartPrompt || showUnmutePrompt) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 void-border-success flex items-center justify-center mx-auto mb-4 animate-pulse">
                {showStartPrompt ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="void-text-energy ml-1">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="void-text-energy">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM14 3.23v2.06a6.51 6.51 0 010 13.42v2.06A8.5 8.5 0 0014 3.23z" fill="currentColor" />
                  </svg>
                )}
              </div>
              <p className="font-mono text-xs void-text-energy tracking-[0.3em]">
                {showStartPrompt ? "TAP TO BEGIN" : "TAP TO UNMUTE"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Skip button — always available once the delay passes, even if
            the video never reaches a playing state. */}
        <AnimatePresence>
          {showSkip && !showBeginSplash && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                // SKIP is an explicit player choice, NOT a natural end.
                // Don't burn the loredex_cinematic_seen flag for them.
                handleComplete();
              }}
              className="absolute bottom-4 right-4 z-50 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all"
              style={{
                background: "color-mix(in oklch, var(--bg-void) 60%, transparent)",
                border: "1px solid color-mix(in oklch, var(--text-primary) 15%, transparent)",
                color: "color-mix(in oklch, var(--text-primary) 50%, transparent)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "color-mix(in oklch, var(--energy-primary) 40%, transparent)";
                e.currentTarget.style.color = "color-mix(in oklch, var(--energy-primary) 80%, transparent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "color-mix(in oklch, var(--text-primary) 15%, transparent)";
                e.currentTarget.style.color = "color-mix(in oklch, var(--text-primary) 50%, transparent)";
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
