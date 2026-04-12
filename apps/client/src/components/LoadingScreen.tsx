/**
 * LoadingScreen — Immersive loading screens with art from /art/loading/.
 *
 * Picks a contextual or random loading image, adds ambient effects:
 * - Slow Ken Burns drift on the background
 * - Breathing ambient glow
 * - Scanline overlay
 * - Animated loading bar with lore flavor text
 * - Floating dust particles
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { KineticText } from "@/components/void";
import { useLoadingWithFallback } from "@/hooks/useLoadingProgress";

const LOADING_SCREENS = [
  { id: "bridge", src: "/art/loading/loading-bridge.png", label: "INITIALIZING BRIDGE SYSTEMS", color: "#33E2E6" },
  { id: "combat", src: "/art/loading/loading-combat.png", label: "COMBAT SIMULATOR ONLINE", color: "#ef4444" },
  { id: "terminus", src: "/art/loading/loading-terminus.png", label: "TERMINUS DEFENSE GRID ACTIVE", color: "#a855f7" },
  { id: "trade", src: "/art/loading/loading-trade.png", label: "CONNECTING TRADE NETWORK", color: "#f59e0b" },
  { id: "archives", src: "/art/loading/loading-archives.png", label: "INDEXING ARCHIVES", color: "#6366f1" },
  { id: "matrix", src: "/art/loading/loading-matrix-of-dreams.png", label: "ENTERING THE MATRIX OF DREAMS", color: "#c084fc" },
  { id: "celebration", src: "/art/loading/loading-celebration.png", label: "WELCOME TO CELEBRATION", color: "#f472b6" },
];

/** Map route prefixes to preferred loading screens */
const ROUTE_SCREEN_MAP: Record<string, string> = {
  "/fight": "combat",
  "/pvp": "combat",
  "/boss": "combat",
  "/chess": "bridge",
  "/board": "bridge",
  "/timeline": "bridge",
  "/trade": "trade",
  "/marketplace": "trade",
  "/store": "trade",
  "/search": "archives",
  "/codex": "archives",
  "/entity": "archives",
  "/terminus": "terminus",
  "/tower-defense": "terminus",
  "/common-room": "matrix",
  "/guild": "matrix",
  "/apprentice": "celebration",
  "/house-cup": "celebration",
  "/cohort": "celebration",
};

const FLAVOR_TEXT = [
  "Bypassing encryption layer seven...",
  "Decoding transmission...",
  "Source: classified.",
  "Clearance: unauthorized.",
  "Calibrating neural interface...",
  "Scanning for anomalies...",
  "Synchronizing with Ark 1047...",
  "Elara is watching...",
  "The Antiquarian remembers this moment...",
  "Reality is loading. Please hold.",
  "The Meme says hello.",
  "Shadow Tongue has edited this loading screen.",
  "Void Energy levels nominal.",
  "The Collector catalogues your patience.",
];

interface LoadingScreenProps {
  /** Hint for which screen to show (route-based) */
  context?: string;
  /** Short label override */
  label?: string;
  /** Allow the user to skip the loading screen (calls onSkip) */
  skippable?: boolean;
  /** Called when the user skips — parent should unmount the loading screen */
  onSkip?: () => void;
  /** Called when real loading completes (progress reaches 100) */
  onComplete?: () => void;
  /** Minimum display time in ms before skip / auto-dismiss (default 1200) */
  minDisplayMs?: number;
}

export default function LoadingScreen({
  context,
  label,
  skippable = false,
  onSkip,
  onComplete,
  minDisplayMs = 1200,
}: LoadingScreenProps) {
  const screen = useMemo(() => {
    // Try route-based match
    if (context) {
      for (const [prefix, screenId] of Object.entries(ROUTE_SCREEN_MAP)) {
        if (context.startsWith(prefix)) {
          const match = LOADING_SCREENS.find(s => s.id === screenId);
          if (match) return match;
        }
      }
    }
    // Random
    return LOADING_SCREENS[Math.floor(Math.random() * LOADING_SCREENS.length)];
  }, [context]);

  const [flavor, setFlavor] = useState(FLAVOR_TEXT[Math.floor(Math.random() * FLAVOR_TEXT.length)]);

  // Real progress tracking (falls back to simulated when no tasks registered)
  const { progress, label: taskLabel, isComplete, isReal } = useLoadingWithFallback();

  // Minimum display time gate — prevents flash-of-loading
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), minDisplayMs);
    return () => clearTimeout(timer);
  }, [minDisplayMs]);

  // Fire onComplete when real progress hits 100 and min time has passed
  useEffect(() => {
    if (isComplete && minTimeElapsed && onComplete) {
      onComplete();
    }
  }, [isComplete, minTimeElapsed, onComplete]);

  // Skip handler — keyboard (Escape / Space / Enter) and click
  const handleSkip = useCallback(() => {
    if (skippable && minTimeElapsed && onSkip) {
      onSkip();
    }
  }, [skippable, minTimeElapsed, onSkip]);

  useEffect(() => {
    if (!skippable) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skippable, handleSkip]);

  // Cycle flavor text — use real task label when available
  useEffect(() => {
    if (isReal) return; // real labels come from loadingManager
    const interval = setInterval(() => {
      setFlavor(FLAVOR_TEXT[Math.floor(Math.random() * FLAVOR_TEXT.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isReal]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* Background image with Ken Burns drift */}
      <div className="absolute inset-0">
        <img
          src={screen.src}
          alt=""
          className="loading-screen-drift"
          style={{
            width: "115%",
            height: "115%",
            objectFit: "cover",
            position: "absolute",
            top: "-7.5%",
            left: "-7.5%",
            opacity: 0.35,
            filter: "brightness(0.5) contrast(1.2) saturate(1.1)",
          }}
        />
      </div>

      {/* Ambient color glow */}
      <div
        className="absolute inset-0 loading-screen-pulse"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${screen.color}12 0%, transparent 60%)`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
        }}
      />

      {/* Dust particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full loading-screen-particle"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              background: screen.color,
              opacity: 0.15 + Math.random() * 0.25,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${4 + i * 0.8}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* System label — kinetic decode reveal */}
        <div
          className="font-mono text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: screen.color, opacity: 0.7 }}
        >
          <KineticText text={label || screen.label} mode="decode" speed={25} showCursor={false} />
        </div>

        {/* Spinner */}
        <div className="mx-auto mb-6" style={{ width: 40, height: 40 }}>
          <div
            className="w-full h-full rounded-full animate-spin"
            style={{
              border: `2px solid ${screen.color}20`,
              borderTopColor: screen.color,
            }}
          />
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-[2px] rounded-full mb-4 overflow-hidden"
          style={{ background: `${screen.color}15` }}
        >
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${screen.color}60, ${screen.color})`,
              boxShadow: `0 0 8px ${screen.color}80`,
            }}
          />
        </div>

        {/* Flavor text / real task label */}
        <p
          className="font-mono text-[10px] tracking-[0.15em] italic"
          style={{ color: `${screen.color}90` }}
        >
          <KineticText
            key={isReal ? taskLabel : flavor}
            text={isReal ? taskLabel : flavor}
            mode="char"
            speed={20}
            showCursor={false}
          />
        </p>

        {/* Skip hint */}
        {skippable && minTimeElapsed && (
          <button
            onClick={handleSkip}
            className="mt-4 font-mono text-[9px] tracking-[0.2em] uppercase transition-opacity duration-500 opacity-60 hover:opacity-100 cursor-pointer bg-transparent border-none outline-none"
            style={{ color: screen.color }}
          >
            Press ESC or click to skip
          </button>
        )}
      </div>

      {/* Bottom signal */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full loading-screen-dot"
          style={{ background: screen.color }}
        />
        <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: `${screen.color}50` }}>
          ARK 1047 · LOREDEX OS
        </span>
      </div>

      <style>{`
        @keyframes loading-drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-2%, -1%) scale(1.03); }
          66% { transform: translate(1%, -2%) scale(1.01); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes loading-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes loading-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
          50% { transform: translateY(-40px) translateX(10px); opacity: 0.4; }
        }
        @keyframes loading-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .loading-screen-drift { animation: loading-drift 20s ease-in-out infinite; }
        .loading-screen-pulse { animation: loading-pulse 3s ease-in-out infinite; }
        .loading-screen-particle { animation: loading-particle 5s ease-in-out infinite; }
        .loading-screen-dot { animation: loading-dot 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
