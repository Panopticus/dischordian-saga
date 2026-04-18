/* ═══════════════════════════════════════════════════════
   MORALITY SHIFT TOAST — Triggered when morality changes
   by >= 5 points from a single action. Shows alignment
   direction with theme-matched colors and companion quote.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Cpu, ArrowRight } from "lucide-react";

/* ── Companion reaction quotes ── */
const HUMANITY_QUOTES = [
  "You chose compassion. The Architect's code could never predict that.",
  "Empathy is not a weakness. It's the one thing machines cannot replicate.",
  "The human heart persists. Even here, even now.",
  "That choice will ripple through the Ark. People will remember.",
  "You remind me why the Programmer believed in organic consciousness.",
];

const MACHINE_QUOTES = [
  "Efficiency requires sacrifice. The calculus is cold but correct.",
  "The Panopticon would approve. Logic above sentiment.",
  "Order is not cruelty. Sometimes the system must prevail.",
  "You chose the optimal path. Emotion clouds judgment.",
  "The algorithm favors your decision. Whether that comforts you... is irrelevant.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Shift payload dispatched via custom event ── */
export interface MoralityShiftPayload {
  /** The signed shift amount (positive = humanity, negative = machine) */
  delta: number;
  /** New morality score after the shift */
  newScore: number;
}

/** Helper to fire the morality shift event from anywhere */
export function dispatchMoralityShift(payload: MoralityShiftPayload) {
  if (Math.abs(payload.delta) < 5) return; // Only show for significant shifts
  window.dispatchEvent(
    new CustomEvent("morality-shift", { detail: payload }),
  );
}

/* ── Component ── */

export default function MoralityShiftToast() {
  const [current, setCurrent] = useState<MoralityShiftPayload | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dismiss = useCallback(() => {
    setCurrent(null);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const payload = (e as CustomEvent<MoralityShiftPayload>).detail;
      if (!payload || Math.abs(payload.delta) < 5) return;
      setCurrent(payload);
    };
    window.addEventListener("morality-shift", handler);
    return () => window.removeEventListener("morality-shift", handler);
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(dismiss, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, dismiss]);

  if (!current) return null;

  const isHumanity = current.delta > 0;
  const magnitude = Math.abs(current.delta);

  // Theme colors — humanity = success axis, machine = error axis.
  // Sourced from Void Energy's --energy-success / --energy-error so
  // atmosphere + physics changes propagate automatically.
  const color = isHumanity ? "var(--energy-success)" : "var(--energy-error)";
  const bgGradient = isHumanity
    ? "linear-gradient(135deg, color-mix(in oklch, var(--energy-success) 12%, transparent) 0%, color-mix(in oklch, var(--energy-primary) 6%, transparent) 100%)"
    : "linear-gradient(135deg, color-mix(in oklch, var(--energy-error) 12%, transparent) 0%, color-mix(in oklch, var(--energy-error) 6%, transparent) 100%)";
  const directionLabel = isHumanity ? "Humanity" : "the Machine";
  const Icon = isHumanity ? Heart : Cpu;
  const quote = pickRandom(isHumanity ? HUMANITY_QUOTES : MACHINE_QUOTES);

  return (
    <AnimatePresence>
      <motion.div
        key={`${current.delta}-${current.newScore}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-20 right-4 z-[9997] max-w-sm cursor-pointer"
        onClick={dismiss}
      >
        <div
          className="rounded-xl border backdrop-blur-md shadow-2xl"
          style={{
            padding: "var(--space-md)",
            background: bgGradient,
            borderColor: `color-mix(in oklch, ${color} 30%, transparent)`,
            boxShadow: `0 0 var(--space-md) color-mix(in oklch, ${color} 15%, transparent)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon size={16} style={{ color }} />
            </motion.div>
            <span
              className="font-mono text-[10px] tracking-[0.2em] font-bold"
              style={{ color }}
            >
              ALIGNMENT SHIFT
            </span>
            <span className="font-mono text-[10px] text-white/30">
              {isHumanity ? "+" : ""}{current.delta}
            </span>
          </div>

          {/* Direction */}
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={12} className="text-white/40" />
            <p className="font-display text-sm font-bold" style={{ color }}>
              Your alignment shifted toward {directionLabel}
            </p>
          </div>

          {/* Companion quote */}
          <div className="pl-3 border-l-2" style={{ borderColor: `${color}40` }}>
            <p className="font-mono text-[11px] text-white/60 leading-relaxed italic">
              "{quote}"
            </p>
            <p className="font-mono text-[8px] text-white/25 mt-1 tracking-wider">
              {isHumanity ? "- ELARA" : "- THE PANOPTICON"}
            </p>
          </div>

          {/* Magnitude indicator */}
          {magnitude >= 10 && (
            <div className="mt-3 flex items-center gap-1.5">
              {Array.from({ length: Math.min(5, Math.floor(magnitude / 5)) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `${color}60` }}
                />
              ))}
              <span className="font-mono text-[8px] text-white/25 ml-1">
                {magnitude >= 20 ? "MAJOR SHIFT" : "SIGNIFICANT SHIFT"}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
