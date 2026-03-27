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
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const completedRef = useRef(false);

  // Show skip button after a short delay
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Try muted autoplay on mount — most browsers allow this
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start muted so autoplay succeeds
    video.muted = true;
    video.play()
      .then(() => {
        setStarted(true);
        // Now try to unmute — if the browser allows it, great
        video.muted = false;
        setIsMuted(false);
      })
      .catch(() => {
        // Even muted autoplay failed — wait for user tap
        setStarted(false);
      });
  }, []);

  /** Start the Saga Theme looping, then fade out the cinematic */
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    // Pause the video
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

  // Start / unmute on user tap
  const handleTap = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!started) {
      // First tap — start playback unmuted
      video.muted = false;
      setIsMuted(false);
      try {
        await video.play();
        setStarted(true);
      } catch {
        // If unmuted play fails, try muted
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setStarted(true);
        } catch {
          // Total failure — skip cinematic
          handleComplete();
        }
      }
    } else if (isMuted) {
      // Already playing muted — unmute on tap
      video.muted = false;
      setIsMuted(false);
    }
  }, [started, isMuted, handleComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: fadeOut ? 1.5 : 0.5 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        onClick={handleTap}
      >
        {/* Video — fullscreen cover */}
        <video
          ref={videoRef}
          src={CINEMATIC_VIDEO}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onError={() => {
            console.error("[Opening Cinematic] Video failed to load, skipping");
            handleComplete();
          }}
        />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
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
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.5em] text-cyan-400/50 mb-2">
            A DEGENEROUS DAO PRODUCTION
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-[0.15em] text-white/80">
            THE DISCHORDIAN SAGA
          </h1>
        </motion.div>

        {/* Click to start / unmute prompt */}
        {(!started || isMuted) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-400/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
                {!started ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400/80 ml-1">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400/80">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM14 3.23v2.06a6.51 6.51 0 010 13.42v2.06A8.5 8.5 0 0014 3.23z" fill="currentColor" />
                  </svg>
                )}
              </div>
              <p className="font-mono text-xs text-cyan-400/60 tracking-[0.3em]">
                {!started ? "TAP TO BEGIN" : "TAP TO UNMUTE"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Skip button */}
        <AnimatePresence>
          {showSkip && started && (
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
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(51,226,230,0.4)";
                e.currentTarget.style.color = "rgba(51,226,230,0.8)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
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
