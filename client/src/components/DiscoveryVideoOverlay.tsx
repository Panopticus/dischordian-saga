/* ═══════════════════════════════════════════════════════
   DISCOVERY VIDEO OVERLAY
   Fullscreen cinematic overlay that plays when a character
   is first discovered. Triggered from conspiracy board,
   research minigame, or Ark exploration.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, SkipForward } from "lucide-react";
import { useLoredex } from "@/contexts/LoredexContext";

/* ─── VIDEO REGISTRY ─── */
// Maps entity IDs to their discovery video URLs
// Videos can be Kling 3.0 generated clips or any hosted video
// Add entries here as videos are produced
const DISCOVERY_VIDEOS: Record<string, {
  videoUrl: string;
  title?: string;
  subtitle?: string;
  duration?: number; // seconds, for progress bar
}> = {
  // Example entries — replace with actual Kling-generated video URLs
  // "the-architect": {
  //   videoUrl: "https://cdn.example.com/discovery/architect.mp4",
  //   title: "THE ARCHITECT",
  //   subtitle: "Creator of the Panopticon",
  // },
};

/* ─── DISCOVERY OVERLAY CONTEXT ─── */
// This is a lightweight event system so any component can trigger a discovery video
type DiscoveryListener = (entityId: string) => void;
const listeners = new Set<DiscoveryListener>();

export function triggerDiscoveryVideo(entityId: string) {
  listeners.forEach(fn => fn(entityId));
}

export function useDiscoveryVideoListener(callback: DiscoveryListener) {
  useEffect(() => {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }, [callback]);
}

/* ─── MAIN OVERLAY COMPONENT ─── */
export default function DiscoveryVideoOverlay() {
  const { getEntry, getEntryById } = useLoredex();
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Listen for discovery events
  const handleDiscovery = useCallback((entityId: string) => {
    // Check if we have a video for this entity
    const videoData = DISCOVERY_VIDEOS[entityId];
    if (videoData) {
      setActiveEntity(entityId);
      setIsPlaying(true);
      setProgress(0);
      setShowInfo(false);
      setFallbackMode(false);
    } else {
      // No video — use the cinematic fallback with entity image
      const entry = getEntryById(entityId) || getEntry(entityId);
      if (entry && entry.image) {
        setActiveEntity(entityId);
        setIsPlaying(true);
        setProgress(0);
        setShowInfo(false);
        setFallbackMode(true);
      }
    }
  }, [getEntry]);

  useDiscoveryVideoListener(handleDiscovery);

  // Auto-close after video ends or fallback timer
  useEffect(() => {
    if (!isPlaying) return;

    if (fallbackMode) {
      // Fallback: show cinematic image reveal for 5 seconds
      const showInfoTimer = setTimeout(() => setShowInfo(true), 800);
      const closeTimer = setTimeout(() => handleClose(), 6000);
      progressInterval.current = setInterval(() => {
        setProgress(prev => Math.min(prev + (100 / 60), 100)); // 6s = 60 ticks at 100ms
      }, 100);
      return () => {
        clearTimeout(showInfoTimer);
        clearTimeout(closeTimer);
        if (progressInterval.current) clearInterval(progressInterval.current);
      };
    }
  }, [isPlaying, fallbackMode]);

  const handleClose = useCallback(() => {
    setIsPlaying(false);
    setActiveEntity(null);
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
  }, []);

  const handleVideoEnd = useCallback(() => {
    // Show info card for 3 seconds after video ends, then close
    setShowInfo(true);
    setTimeout(() => handleClose(), 3000);
  }, [handleClose]);

  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  }, []);

  if (!activeEntity || !isPlaying) return null;

  const entry = getEntryById(activeEntity) || getEntry(activeEntity);
  const videoData = DISCOVERY_VIDEOS[activeEntity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black"
      >
        {/* ─── VIDEO or FALLBACK IMAGE ─── */}
        {videoData && !fallbackMode ? (
          <video
            ref={videoRef}
            src={videoData.videoUrl}
            autoPlay
            muted={muted}
            playsInline
            onEnded={handleVideoEnd}
            onTimeUpdate={handleVideoTimeUpdate}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : entry?.image ? (
          /* Cinematic image fallback with Ken Burns effect */
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            <img
              src={entry.image}
              alt={entry.name}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.5) contrast(1.2)" }}
            />
            {/* Dramatic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            {/* Scanline effect */}
            <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" />
          </motion.div>
        ) : null}

        {/* ─── DISCOVERY HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
            <span className="font-mono text-[10px] text-[var(--neon-cyan)]/80 tracking-[0.4em]">
              NEW ENTITY DISCOVERED
            </span>
          </div>
        </motion.div>

        {/* ─── ENTITY INFO CARD ─── */}
        <AnimatePresence>
          {showInfo && entry && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-20 left-4 right-4 sm:left-8 sm:right-8 z-10"
            >
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-2">
                  {entry.type && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border tracking-wider"
                      style={{
                        borderColor: entry.type === "character" ? "rgba(51,226,230,0.4)" :
                          entry.type === "location" ? "rgba(255,176,0,0.4)" :
                          entry.type === "faction" ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.2)",
                        color: entry.type === "character" ? "var(--neon-cyan)" :
                          entry.type === "location" ? "var(--amber-glow)" :
                          entry.type === "faction" ? "#a855f7" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {entry.type?.toUpperCase()}
                    </span>
                  )}
                  {entry.era && (
                    <span className="font-mono text-[9px] text-white/30">{entry.era}</span>
                  )}
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-white mb-2"
                  style={{ textShadow: "0 0 30px rgba(51,226,230,0.3)" }}
                >
                  {videoData?.title || entry.name?.toUpperCase()}
                </h2>
                {(videoData?.subtitle || entry.bio) && (
                  <p className="font-mono text-sm text-white/60 leading-relaxed line-clamp-3">
                    {videoData?.subtitle || entry.bio}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── CONTROLS ─── */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {videoData && !fallbackMode && (
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-full bg-black/50 text-white/60 hover:text-white transition-colors"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-black/50 text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            <SkipForward size={14} />
            <span className="font-mono text-[10px]">SKIP</span>
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-black/50 text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ─── PROGRESS BAR ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-1 bg-white/10">
            <motion.div
              className="h-full bg-[var(--neon-cyan)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
            <span className="font-mono text-[9px] text-white/30 tracking-wider">
              ENTITY DATABASE UPDATED
            </span>
            <span className="font-mono text-[9px] text-[var(--neon-cyan)]/50 tracking-wider">
              LOREDEX OS // CLASSIFIED
            </span>
          </div>
        </div>

        {/* ─── GLITCH FLASH (on entry) ─── */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute inset-0 z-30 bg-[var(--neon-cyan)] pointer-events-none"
          style={{ mixBlendMode: "overlay" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
