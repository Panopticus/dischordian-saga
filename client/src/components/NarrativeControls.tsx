/* ═══════════════════════════════════════════════════════
   NARRATIVE CONTROLS — Universal skip, pacing, and log
   system for all dialog, tutorials, and cinematics.

   Design philosophy (BioWare-inspired):
   - Player controls the pace, ALWAYS
   - Nothing auto-advances without player input
   - Skip is always available but never forced
   - A log preserves everything for re-reading
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";

/* ─── NARRATIVE LOG ─── */

export interface LogEntry {
  id: string;
  speaker: "elara" | "human" | "system" | "player" | "narrator";
  text: string;
  timestamp: number;
  game?: string; // which game/context it came from
}

class NarrativeLogStore {
  private entries: LogEntry[] = [];
  private listeners: Set<() => void> = new Set();
  private maxEntries = 200;

  add(speaker: LogEntry["speaker"], text: string, game?: string) {
    this.entries.push({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      speaker,
      text,
      timestamp: Date.now(),
      game,
    });
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
    this.listeners.forEach(fn => fn());
  }

  getAll(): LogEntry[] {
    return [...this.entries];
  }

  getRecent(count: number = 20): LogEntry[] {
    return this.entries.slice(-count);
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  clear() {
    this.entries = [];
    this.listeners.forEach(fn => fn());
  }
}

export const narrativeLog = new NarrativeLogStore();

/* ─── SKIP BUTTON COMPONENT ─── */

/**
 * Universal skip button. Appears on all narrative overlays.
 * Two modes:
 * - "skip step" advances to next beat
 * - "skip all" jumps to completion
 *
 * Fades in after a short delay so it doesn't distract from the opening.
 */
export interface SkipButtonProps {
  onSkipStep?: () => void;
  onSkipAll?: () => void;
  /** Delay before the skip button appears (ms). Default 1500 */
  appearDelay?: number;
  /** Label for the skip-all button */
  skipAllLabel?: string;
  /** Whether to show the "skip step" button (vs only skip all) */
  showSkipStep?: boolean;
}

// Export as a named function for use in JSX
export function SkipButton({
  onSkipStep,
  onSkipAll,
  appearDelay = 1500,
  skipAllLabel = "SKIP ALL",
  showSkipStep = true,
}: SkipButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), appearDelay);
    return () => clearTimeout(timer);
  }, [appearDelay]);

  if (!visible) return null;

  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2 animate-in fade-in duration-500">
      {showSkipStep && onSkipStep && (
        <button
          onClick={onSkipStep}
          className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white/30 font-mono text-[10px] hover:text-white/60 hover:border-white/20 transition-colors"
        >
          SKIP ▶
        </button>
      )}
      {onSkipAll && (
        <button
          onClick={onSkipAll}
          className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white/30 font-mono text-[10px] hover:text-white/60 hover:border-white/20 transition-colors"
        >
          {skipAllLabel} ▶▶
        </button>
      )}
    </div>
  );
}

/* ─── TAP TO CONTINUE INDICATOR ─── */

/**
 * Pulsing "▼" indicator that appears when text is fully revealed.
 * BioWare-style: tells the player "I'm done talking, your turn."
 */
export function ContinueIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="flex justify-center mt-3 animate-bounce">
      <span className="text-white/20 text-xs">▼</span>
    </div>
  );
}

/* ─── DIALOG LINE WITH PACING ─── */

/**
 * A single line of dialog with typewriter reveal and tap-to-continue.
 * No auto-advance — the player decides when to move on.
 *
 * Usage:
 * <DialogLine speaker="elara" text="Welcome, Potential." onComplete={() => advance()} />
 */
export interface DialogLineProps {
  speaker: "elara" | "human" | "system" | "narrator";
  text: string;
  /** Called when player taps to continue */
  onComplete: () => void;
  /** Typing speed in ms per character. Default 20 */
  typeSpeed?: number;
  /** Speaker display name */
  speakerName?: string;
  /** Speaker accent color */
  speakerColor?: string;
  /** Whether text has corruption effect (for The Human) */
  corrupted?: boolean;
}

export function DialogLine({
  speaker,
  text,
  onComplete,
  typeSpeed = 20,
  speakerName,
  speakerColor,
  corrupted = false,
}: DialogLineProps) {
  const [revealed, setRevealed] = useState(0);
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const displayName = speakerName || (
    speaker === "elara" ? "ELARA" :
    speaker === "human" ? "THE HUMAN" :
    speaker === "system" ? "SYSTEM" :
    "NARRATOR"
  );

  const color = speakerColor || (
    speaker === "elara" ? "#22d3ee" :
    speaker === "human" ? "#f87171" :
    speaker === "system" ? "#fbbf24" :
    "#94a3b8"
  );

  useEffect(() => {
    setRevealed(0);
    setComplete(false);
    intervalRef.current = setInterval(() => {
      setRevealed(prev => {
        if (prev >= text.length) {
          clearInterval(intervalRef.current);
          setComplete(true);
          // Log to narrative log
          narrativeLog.add(speaker, text);
          return prev;
        }
        return prev + 1;
      });
    }, typeSpeed);
    return () => clearInterval(intervalRef.current);
  }, [text, typeSpeed, speaker]);

  const handleClick = () => {
    if (!complete) {
      // Fast-forward: reveal all text immediately
      clearInterval(intervalRef.current);
      setRevealed(text.length);
      setComplete(true);
      narrativeLog.add(speaker, text);
    } else {
      // Text fully revealed — advance to next line
      onComplete();
    }
  };

  const displayText = corrupted
    ? text.slice(0, revealed).split("").map((ch, i) =>
        Math.random() < 0.08 ? String.fromCharCode(ch.charCodeAt(0) + Math.floor(Math.random() * 5) - 2) : ch
      ).join("")
    : text.slice(0, revealed);

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 rounded-xl border bg-black/80 backdrop-blur-md transition-all hover:bg-black/90"
      style={{ borderColor: color + "30" }}
    >
      {/* Speaker name */}
      <p className="font-mono text-[10px] tracking-[0.3em] mb-2" style={{ color: color + "80" }}>
        {displayName}
      </p>

      {/* Dialog text */}
      <p className={`text-sm leading-relaxed ${corrupted ? "font-mono" : ""}`}
        style={{ color: corrupted ? "#f87171" : "#e2e8f0" }}>
        {displayText}
        {!complete && <span className="animate-pulse ml-0.5" style={{ color }}>▌</span>}
      </p>

      {/* Continue indicator */}
      <ContinueIndicator visible={complete} />
    </button>
  );
}

/* ─── NARRATIVE DOCKED PANEL (for in-game messages) ─── */

/**
 * Replaces the floating overlay for in-game narrative text.
 * Docks to the side/top, doesn't block gameplay.
 * Player dismisses when ready.
 */
export interface DockedNarrativeProps {
  messages: Array<{ speaker: LogEntry["speaker"]; text: string }>;
  onDismiss: () => void;
  /** Whether to show as "new transmission" notification or full panel */
  mode?: "notification" | "panel";
  game?: string;
}

export function DockedNarrative({ messages, onDismiss, mode = "panel", game }: DockedNarrativeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (mode === "notification" && messages.length > 0) {
    return (
      <button
        onClick={() => {
          // Log all messages and dismiss
          messages.forEach(m => narrativeLog.add(m.speaker, m.text, game));
          onDismiss();
        }}
        className="absolute top-2 right-2 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-amber-500/30 text-amber-400 font-mono text-[10px] hover:bg-black/80 animate-pulse transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        NEW TRANSMISSION ({messages.length})
      </button>
    );
  }

  const current = messages[currentIndex];
  if (!current) return null;

  const color = current.speaker === "elara" ? "#22d3ee" :
                current.speaker === "human" ? "#f87171" :
                "#fbbf24";

  return (
    <div className="absolute top-2 left-2 right-2 z-20 max-w-lg mx-auto">
      <button
        onClick={() => {
          narrativeLog.add(current.speaker, current.text, game);
          if (currentIndex < messages.length - 1) {
            setCurrentIndex(i => i + 1);
          } else {
            onDismiss();
          }
        }}
        className="w-full text-left p-3 rounded-xl border bg-black/80 backdrop-blur-md"
        style={{ borderColor: color + "30" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] tracking-wider" style={{ color: color + "80" }}>
            {current.speaker === "elara" ? "ELARA" : current.speaker === "human" ? "THE HUMAN" : "TRANSMISSION"}
          </span>
          <span className="font-mono text-[8px] text-white/20">
            {currentIndex + 1}/{messages.length} • tap to continue
          </span>
        </div>
        <p className="text-xs leading-relaxed text-white/80">{current.text}</p>
      </button>
    </div>
  );
}
