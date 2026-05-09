/* ═══════════════════════════════════════════════════════
   RUN TRACKER OVERLAY
   audit/16 PR 23 (finding Strm3 — Streamer persona).

   Draggable corner overlay for streamers / VOD authors. Shows:
     - Current act (0–7)
     - Total decisions made (narrativeActChoices.length)
     - Cumulative morality shift (sum of moralityShift across
       all choices)
     - Elapsed time since the overlay was first opened

   Position is persisted to localStorage; visibility toggles
   via a small button in SettingsPage's Streamer section
   (queued — for now the overlay can be enabled by setting
   `loredex_streamer_run_tracker_enabled` to true).

   No external state — reads from useGame() each render. The
   audit'd intent is "VOD context for short-form clip editors":
   the overlay tells the streamer (and their viewers) what act
   the player is in, how many decisions they've made, and how
   long they've been recording — without breaking the
   immersion of the room/cinematic surfaces underneath.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Activity, Clock, GitBranch, Scale } from "lucide-react";

const STORAGE_KEY_POSITION = "loredex_streamer_run_tracker_position:v1";
const STORAGE_KEY_VISIBLE = "loredex_streamer_run_tracker_enabled";

interface OverlayPosition {
  /** CSS left in px. */
  x: number;
  /** CSS top in px. */
  y: number;
}

const DEFAULT_POSITION: OverlayPosition = { x: 24, y: 24 };

function readPosition(): OverlayPosition {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSITION);
    if (!raw) return DEFAULT_POSITION;
    const parsed = JSON.parse(raw) as OverlayPosition;
    if (
      typeof parsed?.x === "number" &&
      typeof parsed?.y === "number" &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return parsed;
    }
  } catch {
    // ignore — fall through to default
  }
  return DEFAULT_POSITION;
}

function writePosition(pos: OverlayPosition): void {
  try {
    localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(pos));
  } catch {
    // localStorage unavailable; position stays in-memory only
  }
}

/** Format a duration in milliseconds as HH:MM:SS. */
export function formatRunDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function RunTrackerOverlay() {
  const { state } = useGame();
  const [position, setPosition] = useState<OverlayPosition>(() => readPosition());
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [now, setNow] = useState(() => Date.now());
  const startTime = useRef<number>(Date.now());

  // Tick every second to keep the timer current.
  useEffect(() => {
    const handle = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(handle);
  }, []);

  // Mouse drag handlers — written long-form so the cleanup
  // detaches the body listeners cleanly when the user lifts.
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      dx: e.clientX - position.x,
      dy: e.clientY - position.y,
    };
  };
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const next = {
        x: e.clientX - dragOffset.current.dx,
        y: e.clientY - dragOffset.current.dy,
      };
      // Clamp inside the viewport so the overlay can't get
      // dragged off-screen and lost.
      next.x = Math.max(0, Math.min(window.innerWidth - 220, next.x));
      next.y = Math.max(0, Math.min(window.innerHeight - 100, next.y));
      setPosition(next);
    };
    const onUp = () => {
      setIsDragging(false);
      // Persist final position once on lift.
      setPosition((p) => {
        writePosition(p);
        return p;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const elapsedMs = now - startTime.current;
  const decisions = state.narrativeActChoices?.length ?? 0;
  const moralitySum = (state.narrativeActChoices ?? []).reduce(
    (s, c) => s + (c.moralityShift ?? 0),
    0,
  );
  const moralityLabel =
    moralitySum > 0 ? `+${moralitySum}` : `${moralitySum}`;

  return (
    <div
      className="fixed z-[100] select-none rounded-lg border void-border bg-black/85 backdrop-blur-sm shadow-lg cursor-move"
      style={{ left: position.x, top: position.y, width: 220 }}
      onMouseDown={onMouseDown}
      data-testid="run-tracker-overlay"
      data-dragging={isDragging ? "true" : "false"}
    >
      <div className="px-3 py-2 border-b void-border">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 flex items-center gap-1.5">
          <Activity size={10} /> Run Tracker
        </p>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
          <span className="text-white/50 flex items-center gap-1.5">
            <GitBranch size={10} /> Act
          </span>
          <span className="void-text-energy" data-testid="run-tracker-act">
            {state.narrativeAct ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
          <span className="text-white/50 flex items-center gap-1.5">
            <Activity size={10} /> Decisions
          </span>
          <span className="void-text-energy" data-testid="run-tracker-decisions">
            {decisions}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
          <span className="text-white/50 flex items-center gap-1.5">
            <Scale size={10} /> Morality Δ
          </span>
          <span
            className={
              moralitySum > 0 ? "void-text-energy" : moralitySum < 0 ? "text-rose-300" : "text-white/60"
            }
            data-testid="run-tracker-morality"
          >
            {moralityLabel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
          <span className="text-white/50 flex items-center gap-1.5">
            <Clock size={10} /> Elapsed
          </span>
          <span className="text-white/70 font-mono" data-testid="run-tracker-elapsed">
            {formatRunDuration(elapsedMs)}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Hook + helper for visibility — Settings UI toggles via this
 *  helper; the overlay's mount point checks it. */
export function getRunTrackerEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_VISIBLE) === "true";
  } catch {
    return false;
  }
}

export function setRunTrackerEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_VISIBLE, String(enabled));
    window.dispatchEvent(
      new CustomEvent("streamer-settings-changed", {
        detail: { key: "runTrackerEnabled", value: enabled },
      }),
    );
  } catch {
    // ignore
  }
}

/** Component that mounts the overlay only when the streamer
 *  has enabled it. Mount once near the app root. */
export function RunTrackerOverlayMount() {
  const [enabled, setEnabled] = useState(() => getRunTrackerEnabled());
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string; value: unknown }>).detail;
      if (!detail || detail.key !== "runTrackerEnabled") return;
      setEnabled(Boolean(detail.value));
    };
    window.addEventListener("streamer-settings-changed", onChange);
    return () => window.removeEventListener("streamer-settings-changed", onChange);
  }, []);
  if (!enabled) return null;
  return <RunTrackerOverlay />;
}
