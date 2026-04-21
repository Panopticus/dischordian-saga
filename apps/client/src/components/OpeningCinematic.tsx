/* ═══════════════════════════════════════════════════════
   OPENING CINEMATIC — Fullscreen video + Saga Theme
   Video plays first (no music). When video ends (or is skipped),
   the Saga Theme begins looping as background music for the
   entire Awakening sequence. The audio element is passed back
   to the parent via onComplete so it persists beyond this component.
   ═══════════════════════════════════════════════════════ */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CINEMATIC_VIDEO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/opening_cinematic_9b899561.mp4";
export const SAGA_THEME_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/SagaTheme_0cd5de9a.mp3";

interface OpeningCinematicProps {
  /** Called when cinematic is done. Receives the Audio element so parent can keep it playing. */
  onComplete: (themeAudio: HTMLAudioElement | null) => void;
}

export default function OpeningCinematic({ onComplete }: OpeningCinematicProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  /** Called when user clicks "BEGIN" — starts video with sound */
  const handleBeginClick = useCallback(async () => {
    userClickedRef.current = true;
    const video = videoRef.current;
    if (!video) return;

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
  }, []);

  /** Start the Saga Theme looping, then fade out the cinematic */
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (endSafetyTimerRef.current) {
      clearTimeout(endSafetyTimerRef.current);
      endSafetyTimerRef.current = null;
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    // Create and start the theme song audio — it will loop
    const themeAudio = new Audio(SAGA_THEME_URL);
    themeAudio.loop = true;
    themeAudio.volume = 0;
    themeAudio.play().catch(() => {});

    // Fade the theme in over ~1.5s
    let vol = 0;
    const fadeInInterval = setInterval(() => {
      vol = Math.min(0.55, vol + 0.03);
      themeAudio.volume = vol;
      if (vol >= 0.55) clearInterval(fadeInInterval);
    }, 50);

    // Visual fade out, then hand off
    setFadeOut(true);
    setTimeout(() => onComplete(themeAudio), 1500);
  }, [onComplete]);

  // When video ends naturally
  const handleVideoEnd = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Some browsers (notably iOS Safari with CDN-hosted MP4s) occasionally
  // fail to fire `ended`. Arm a safety timer based on actual duration,
  // and a hard cap so the cinematic can never hang forever.
  const armEndSafety = useCallback((durationSec: number) => {
    if (endSafetyTimerRef.current) clearTimeout(endSafetyTimerRef.current);
    const ms = Math.min(120_000, Math.max(5_000, Math.ceil(durationSec * 1000) + 2_000));
    endSafetyTimerRef.current = setTimeout(() => handleComplete(), ms);
  }, [handleComplete]);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    const dur = v && Number.isFinite(v.duration) ? v.duration : 0;
    armEndSafety(dur > 0 ? dur : 90);
  }, [armEndSafety]);

  // Belt-and-suspenders: if `timeupdate` shows we've reached the end
  // but `ended` hasn't fired, complete anyway.
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    if (v.currentTime >= v.duration - 0.15) {
      handleComplete();
    }
  }, [handleComplete]);

  // Absolute fallback: if no metadata ever arrives, still exit after 90s.
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
          // Total failure — skip cinematic
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
          <p className="font-mono text-[9px] sm:text-[11px] tracking-[0.5em] void-text-energy mb-0.5 opacity-70">
            DGRS LABS PRESENTS
          </p>
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.5em] void-text-energy mb-2">
            A PANO PRODUCTION
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
              <p className="font-mono text-[9px] tracking-[0.5em] void-text-energy mb-1 opacity-70">
                DGRS LABS PRESENTS
              </p>
              <p className="font-mono text-[10px] tracking-[0.5em] void-text-energy mb-6">
                A PANO PRODUCTION
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
