/* ═══════════════════════════════════════════════════════
   STREAK COUNTER — Compact header badge for login streaks
   Shows flame icon + day count, next milestone indicator,
   and pulsing animation when close to a milestone.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

/* ── Milestone definitions ── */
const MILESTONES = [
  { day: 7, reward: "Rare Card Pack", label: "7-day" },
  { day: 14, reward: "500 Dream Tokens", label: "14-day" },
  { day: 30, reward: "Legendary Card Pack", label: "30-day" },
  { day: 60, reward: "Void Crystal x10", label: "60-day" },
  { day: 100, reward: "Mythic Title: Eternal Flame", label: "100-day" },
];

interface StreakCounterProps {
  currentStreak: number;
  className?: string;
}

export default function StreakCounter({ currentStreak, className = "" }: StreakCounterProps) {
  const nextMilestone = useMemo(
    () => MILESTONES.find(m => m.day > currentStreak),
    [currentStreak],
  );

  const daysToMilestone = nextMilestone ? nextMilestone.day - currentStreak : 0;
  const isCloseToMilestone = daysToMilestone > 0 && daysToMilestone <= 3;
  const isAtMilestone = MILESTONES.some(m => m.day === currentStreak);

  // Flame color based on streak length
  const flameColor = currentStreak >= 60
    ? "text-purple-400"
    : currentStreak >= 30
      ? "text-amber-400"
      : currentStreak >= 14
        ? "text-orange-400"
        : currentStreak >= 7
          ? "text-yellow-400"
          : "text-orange-300";

  const flameBg = currentStreak >= 60
    ? "bg-purple-500/10 border-purple-500/20"
    : currentStreak >= 30
      ? "bg-amber-500/10 border-amber-500/20"
      : currentStreak >= 7
        ? "bg-orange-500/10 border-orange-500/20"
        : "bg-orange-500/5 border-orange-500/10";

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`}>
      {/* Main badge */}
      <motion.div
        animate={
          isCloseToMilestone
            ? { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] }
            : isAtMilestone
              ? { scale: [1, 1.15, 1] }
              : undefined
        }
        transition={
          isCloseToMilestone || isAtMilestone
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${flameBg}`}
      >
        <Flame size={14} className={flameColor} />
        <span className={`font-mono text-xs font-bold ${flameColor}`}>
          {currentStreak}
        </span>
      </motion.div>

      {/* Next milestone indicator */}
      {nextMilestone && (
        <div className="hidden sm:flex items-center">
          <span className="font-mono text-[9px] text-white/30 leading-tight">
            {daysToMilestone === 1
              ? `1 day to ${nextMilestone.label} reward!`
              : `${daysToMilestone}d to ${nextMilestone.label}`
            }
          </span>
        </div>
      )}

      {/* Milestone reached glow */}
      {isAtMilestone && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            boxShadow: `0 0 12px rgba(255,215,0,0.4)`,
          }}
        />
      )}
    </div>
  );
}

export { MILESTONES as STREAK_MILESTONES };
