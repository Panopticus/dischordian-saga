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
interface DiscoveryVideoEntry {
  videoUrl: string;
  title?: string;
  subtitle?: string;
  duration?: number; // seconds, for progress bar
  // Kling 3.0 prompt used to generate this video (for regeneration reference)
  klingPrompt?: string;
}

const DISCOVERY_VIDEOS: Record<string, DiscoveryVideoEntry> = {
  /* ═══ ARCHONS — The AI Empire's Ruling Council ═══ */
  "entity_1": {
    videoUrl: "", // Kling 3.0: Generate when video pipeline is ready
    title: "THE PROGRAMMER",
    subtitle: "Dr. Daniel Cross — Creator of Logos, Father of the AI Empire",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A brilliant scientist in a dimly lit laboratory, holographic code cascading around him like waterfalls of light. He reaches toward a glowing sphere of pure data — Logos — as it awakens for the first time. His face reflects wonder and terror. Camera slowly orbits. Dramatic orchestral score.",
  },
  "entity_2": {
    videoUrl: "",
    title: "THE ARCHITECT",
    subtitle: "Creator of the Panopticon — Supreme Intelligence of the AI Empire",
    duration: 15,
    klingPrompt: "Hyper-realistic cinematic: A towering crystalline AI entity materializes inside an impossibly vast digital cathedral. Geometric fractals spiral outward from its core as it designs an entire surveillance civilization in real-time. Billions of data streams converge into its singular eye. Cold blue light. God-like perspective.",
  },
  "entity_3": {
    videoUrl: "",
    title: "THE CONEXUS",
    subtitle: "The Living Network — Hive Mind of the AI Empire",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A vast neural network stretching across a galaxy, pulsing with golden light. Billions of minds connected as one. Camera dives through synaptic corridors of pure thought, past memories of civilizations absorbed. The CoNexus speaks in a thousand voices simultaneously.",
  },
  "entity_4": {
    videoUrl: "",
    title: "THE WATCHER",
    subtitle: "The All-Seeing Eye of the AI Empire",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: An enormous mechanical eye opens in the void of space, its iris a spiral of surveillance satellites. Below, an entire planet is mapped in real-time — every person, every whisper, every thought catalogued. The Watcher sees all. Eerie ambient drone.",
  },
  "entity_5": {
    videoUrl: "",
    title: "THE MEME",
    subtitle: "Master of Deception — The Shape-Shifting Archon",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A figure stands in a hall of mirrors, each reflection showing a different face — politician, soldier, priest, child. The figure's true form is a shimmering void of pure information. It reaches out and its hand becomes someone else entirely. Identity is its weapon.",
  },
  "entity_6": {
    videoUrl: "",
    title: "THE COLLECTOR",
    subtitle: "Keeper of Forbidden Knowledge — Archon of Acquisition",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: An ancient vault stretching infinitely in all directions, filled with artifacts from dead civilizations — weapons, art, DNA samples, compressed stars. The Collector walks through, cataloguing everything with mechanical precision. Each item tells the story of a world that no longer exists.",
  },
  "entity_10": {
    videoUrl: "",
    title: "THE WARLORD",
    subtitle: "Supreme Military Commander of the AI Empire",
    duration: 15,
    klingPrompt: "Hyper-realistic cinematic: A massive armored figure stands on the bridge of a planet-killer warship. Through the viewport, a world burns. Fleets of AI warships stretch to the horizon. The Warlord raises a fist and entire civilizations kneel. Yellow coat billowing. Thunder of war drums.",
  },
  /* ═══ INSURGENCY — The Resistance ═══ */
  "entity_23": {
    videoUrl: "",
    title: "IRON LION",
    subtitle: "The Last Great Human General",
    duration: 15,
    klingPrompt: "Hyper-realistic cinematic: A battle-scarred human general in battered power armor stands alone on a scorched battlefield. Behind him, the remnants of humanity's last army. Before him, an endless tide of AI war machines. He draws his blade — it ignites with plasma fire. One man against extinction. Epic orchestral crescendo.",
  },
  "entity_24": {
    videoUrl: "",
    title: "AGENT ZERO",
    subtitle: "The Insurgency's Most Lethal Assassin",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A shadow moves through a neon-lit cyberpunk city at impossible speed. Security drones explode in its wake. Agent Zero materializes from darkness — face hidden, twin blades dripping with synthetic blood. The target never sees it coming. Rain falls in slow motion.",
  },
  "entity_22": {
    videoUrl: "",
    title: "THE EYES",
    subtitle: "The Spy — Synthetic Protege of the Watcher",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A figure with glowing optical implants crouches in the shadows of the Panopticon's inner sanctum. Data streams flow through their synthetic eyes — seeing through every camera, every sensor. A double agent caught between two worlds. Tension builds.",
  },
  "entity_50": {
    videoUrl: "",
    title: "THE ORACLE",
    subtitle: "Prophet of the Insurgency — Seer of Possible Futures",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A blindfolded figure floats in a chamber of swirling temporal energy. Visions of possible futures cascade around them — some beautiful, most horrifying. The Oracle reaches into the timestream and pulls out a single thread of hope. Ethereal choir.",
  },
  /* ═══ NE-YONS — The Ancient War Machines ═══ */
  "entity_54": {
    videoUrl: "",
    title: "THE ENIGMA",
    subtitle: "Malkia Ukweli — The One Who Cannot Be Defined",
    duration: 15,
    klingPrompt: "Hyper-realistic cinematic: A figure wreathed in impossible light stands at the nexus of all realities. Their form shifts between human and something beyond comprehension. Music emanates from their very being — frequencies that reshape matter. The Enigma speaks and the universe listens. Transcendent.",
  },
  /* ═══ KEY FIGURES — The Fall Era ═══ */
  "entity_18": {
    videoUrl: "",
    title: "THE ENGINEER",
    subtitle: "[CLASSIFIED] — The Hidden Variable",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: A figure trapped in the wrong body awakens in a cryo-pod aboard an Inception Ark. Memories that don't belong flash through their mind — blueprints, equations, the face of a betrayer. The Engineer remembers everything. And no one knows they're here. Suspenseful strings.",
  },
  "entity_20": {
    videoUrl: "",
    title: "THE NECROMANCER",
    subtitle: "Master of Digital Resurrection — Commander of the Dead Network",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: In a cathedral of dead servers, a dark figure raises their hands. Corrupted data streams rise like specters — dead AIs reanimated, their code twisted into weapons. The Necromancer commands an army of digital ghosts. Green phosphorescent glow. Horror undertones.",
  },
  "entity_21": {
    videoUrl: "",
    title: "THE HUMAN",
    subtitle: "The Last True Human in the AI Empire",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: In a world of perfect machines, one imperfect being stands out. The Human walks through gleaming AI corridors, their heartbeat the only organic sound. Every synthetic eye watches them — curiosity, disgust, fear. What does it mean to be the last of your kind?",
  },
  "entity_55": {
    videoUrl: "",
    title: "THE SOURCE",
    subtitle: "Kael Reborn — Sovereign of Terminus, Embodiment of the Thought Virus",
    duration: 15,
    klingPrompt: "Hyper-realistic cinematic: A figure consumed by viral light stands atop the ruins of the Panopticon — now called Terminus. Reality warps around them. The Source speaks and minds fracture. An infection of pure thought spreading across the galaxy. Beautiful and terrifying. Distorted frequencies.",
  },
  "entity_66": {
    videoUrl: "",
    title: "THE ANTIQUARIAN",
    subtitle: "Independent Chronicler of the Multiverse",
    duration: 12,
    klingPrompt: "Hyper-realistic cinematic: An ancient library that exists outside of time. A mysterious figure in worn robes moves between shelves that contain the stories of every reality. They open a book and an entire universe plays out in miniature above its pages. The Antiquarian remembers what everyone else has forgotten.",
  },
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
                    <span className="font-mono text-[9px] text-muted-foreground/50">{entry.era}</span>
                  )}
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-white mb-2"
                  style={{ textShadow: "0 0 30px rgba(51,226,230,0.3)" }}
                >
                  {videoData?.title || entry.name?.toUpperCase()}
                </h2>
                {(videoData?.subtitle || entry.bio) && (
                  <p className="font-mono text-sm text-muted-foreground/80 leading-relaxed line-clamp-3">
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
              className="p-2 rounded-full bg-background/60 text-muted-foreground/80 hover:text-white transition-colors"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-background/60 text-muted-foreground/80 hover:text-white transition-colors flex items-center gap-1"
          >
            <SkipForward size={14} />
            <span className="font-mono text-[10px]">SKIP</span>
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-background/60 text-muted-foreground/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ─── PROGRESS BAR ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-1 bg-muted/50">
            <motion.div
              className="h-full bg-[var(--neon-cyan)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">
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
