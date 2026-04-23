/* ═══════════════════════════════════════════════════════
   MORALITY SHIFT TOAST — Triggered when morality changes
   by >= 5 points from a single action. Shows alignment
   direction with theme-matched colors and companion quote.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Cpu, ArrowRight } from "lucide-react";
import { ToastSlot } from "@/components/toast";

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

  const isHumanity = (current?.delta ?? 0) > 0;
  const magnitude = Math.abs(current?.delta ?? 0);
  // Humanity = success axis, Machine = error axis — sourced from Void
  // Energy tokens so atmosphere + physics propagate automatically.
  const tone: "success" | "error" = isHumanity ? "success" : "error";
  const directionLabel = isHumanity ? "Humanity" : "the Machine";
  const Icon = isHumanity ? Heart : Cpu;
  const quote = current
    ? pickRandom(isHumanity ? HUMANITY_QUOTES : MACHINE_QUOTES)
    : "";
  // We need a raw color string for the few inline style cases that CSS
  // variable pipelines can't handle (opacity-composed text-shadows).
  const color = isHumanity ? "var(--energy-success)" : "var(--energy-error)";

  return (
    <ToastSlot
      visible={!!current}
      onDismiss={dismiss}
      position="bottom-right"
      tone={tone}
      durationMs={5000}
      maxWidth={400}
      contentKey={current ? `${current.delta}-${current.newScore}` : undefined}
      role="alert"
      showCloseButton={false}
    >
      {current && (
        <>
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

          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={12} className="text-white/40" />
            <p className="font-display text-sm font-bold" style={{ color }}>
              Your alignment shifted toward {directionLabel}
            </p>
          </div>

          <div className="pl-3 border-l-2" style={{ borderColor: `${color}40` }}>
            <p className="font-mono text-[11px] text-white/60 leading-relaxed italic">
              "{quote}"
            </p>
            <p className="font-mono text-[8px] text-white/25 mt-1 tracking-wider">
              {isHumanity ? "- ELARA" : "- THE PANOPTICON"}
            </p>
          </div>

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
        </>
      )}
    </ToastSlot>
  );
}
