/* ═══════════════════════════════════════════════════════
   CHESS CINEMATIC — Opening video for The Architect's Gambit
   Plays a cinematic before the chess match begins.
   Shows once per session, skippable after 2s.
   ═══════════════════════════════════════════════════════ */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

const CHESS_CINEMATIC_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/chess_cinematic_59606f32.mp4";

interface ChessCinematicProps {
  opponentName?: string;
  onComplete: () => void;
}

export default function ChessCinematic({ opponentName, onComplete }: ChessCinematicProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);

  // Show skip button after a short delay
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  /** Fade out and hand off to game */
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    const video = videoRef.current;
    if (video) video.pause();

    setFadeOut(true);
    setTimeout(() => onComplete(), 1200);
  }, [onComplete]);

  const handleVideoEnd = useCallback(() => {
    // Small pause after video ends before transitioning
    setTimeout(() => handleComplete(), 600);
  }, [handleComplete]);

  const handleStart = useCallback(async () => {
    if (started) return;
    setStarted(true);
    const video = videoRef.current;
    if (video) {
      try { await video.play(); } catch { /* autoplay blocked */ }
    }
  }, [started]);

  // Try autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    const tryAutoplay = async () => {
      if (video) {
        try {
          await video.play();
          setStarted(true);
        } catch { /* wait for click */ }
      }
    };
    tryAutoplay();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: fadeOut ? 1.2 : 0.5 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        onClick={!started ? handleStart : undefined}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={CHESS_CINEMATIC_URL}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted={false}
          onEnded={handleVideoEnd}
          preload="auto"
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

        {/* Title overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown size={16} className="text-amber-400/60" />
            <span className="font-mono text-[10px] tracking-[0.5em] text-amber-400/50">
              THE ARCHITECT'S GAMBIT
            </span>
            <Crown size={16} className="text-amber-400/60" />
          </div>
          {opponentName && (
            <p className="font-display text-lg sm:text-xl font-bold tracking-wider text-white/70">
              vs <span className="text-amber-300/80">{opponentName}</span>
            </p>
          )}
        </motion.div>

        {/* Click to start */}
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-400/80 ml-1">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </div>
              <p className="font-mono text-xs text-amber-400/60 tracking-[0.3em]">TAP TO BEGIN</p>
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
                e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)";
                e.currentTarget.style.color = "rgba(251,191,36,0.8)";
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
