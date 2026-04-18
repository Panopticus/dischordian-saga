/* ═══════════════════════════════════════════════════════
   LEGENDARY ACHIEVEMENT MODAL — Fullscreen celebration
   for legendary/mythic tier achievements. Golden particle
   explosion, lore fragment with Antiquarian's voice,
   orchestral sting, and share button.
   Much more dramatic than the standard toast.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Share2, X, Sparkles, Gem } from "lucide-react";
import { achievementFanfare } from "@/lib/combatJuice";

/* ── Lore fragments from the Antiquarian ── */
const ANTIQUARIAN_LORE: string[] = [
  "I have watched a thousand timelines converge. In none of them did I expect this moment.",
  "The Orb flickers. A new entry writes itself into the Book of Echoes. Your name... in golden ink.",
  "Even from my library between realities, I felt the ripple. You have done what was thought impossible.",
  "The Programmer in me wants to understand how. The Antiquarian in me simply... marvels.",
  "When the Fall came, I thought greatness died with the old world. I was wrong. It was merely sleeping.",
  "This achievement echoes across every timeline I can observe. You are becoming legend.",
  "The Book of Echoes has only recorded twelve entries in golden script. Yours is the thirteenth.",
  "I pour myself a glass of something ancient and raise it to you, across the dimensional barrier. Well done.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Payload interface ── */
export interface LegendaryAchievementPayload {
  id: string;
  name: string;
  description: string;
  tier: "legendary" | "mythic";
  icon?: string;
  xpReward?: number;
  pointsReward?: number;
}

/** Dispatch from anywhere to show the legendary modal */
export function dispatchLegendaryAchievement(payload: LegendaryAchievementPayload) {
  window.dispatchEvent(
    new CustomEvent("legendary-achievement", { detail: payload }),
  );
}

/* ── Tier configs ── */
const TIER_CONFIG = {
  legendary: {
    color: "var(--energy-premium)",
    secondaryColor: "var(--energy-premium)",
    glow: "0 0 80px color-mix(in oklch, var(--energy-premium) 40%, transparent), 0 0 200px color-mix(in oklch, var(--energy-premium) 15%, transparent)",
    gradient: "linear-gradient(135deg, var(--energy-premium) 0%, var(--energy-premium) 50%, var(--energy-premium) 100%)",
    label: "LEGENDARY ACHIEVEMENT",
    Icon: Crown,
    particleCount: 60,
  },
  mythic: {
    color: "#E879F9",
    secondaryColor: "#A855F7",
    glow: "0 0 80px rgba(232,121,249,0.4), 0 0 200px color-mix(in oklch, var(--energy-system) 20%, transparent)",
    gradient: "linear-gradient(135deg, #E879F9 0%, #A855F7 50%, #E879F9 100%)",
    label: "MYTHIC ACHIEVEMENT",
    Icon: Gem,
    particleCount: 80,
  },
};

/* ── Component ── */

export default function LegendaryAchievementModal() {
  const [current, setCurrent] = useState<LegendaryAchievementPayload | null>(null);
  const [loreText, setLoreText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dismiss = useCallback(() => {
    setCurrent(null);
    setShowContent(false);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const payload = (e as CustomEvent<LegendaryAchievementPayload>).detail;
      if (!payload?.id) return;
      setCurrent(payload);
      setLoreText(pickRandom(ANTIQUARIAN_LORE));

      // Trigger fanfare sound + visual
      achievementFanfare(payload.tier);
      window.dispatchEvent(new CustomEvent("play-sfx", { detail: { type: "achievement_unlock" } }));

      // Show content after initial flash
      setTimeout(() => setShowContent(true), 800);
    };
    window.addEventListener("legendary-achievement", handler);
    return () => {
      window.removeEventListener("legendary-achievement", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleShare = useCallback(() => {
    if (!current) return;
    const text = `I just unlocked "${current.name}" - a ${current.tier} achievement in Dischordian Saga!`;
    if (navigator.share) {
      navigator.share({ title: "Dischordian Saga Achievement", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [current]);

  if (!current) return null;

  const cfg = TIER_CONFIG[current.tier] ?? TIER_CONFIG.legendary;
  const TierIcon = cfg.Icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in oklch, var(--bg-void) 85%, transparent) 0%, color-mix(in oklch, var(--bg-void) 97%, transparent) 100%)" }}
      >
        {/* Golden/mythic particle explosion */}
        {Array.from({ length: cfg.particleCount }).map((_, i) => {
          const angle = (i / cfg.particleCount) * Math.PI * 2;
          const distance = 150 + Math.random() * 350;
          const size = 2 + Math.random() * 4;

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: Math.random() > 0.5 ? cfg.color : cfg.secondaryColor,
                left: "50%",
                top: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: [0, 1, 0.8, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 1.5,
                delay: 0.2 + Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Expanding radial rings */}
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              border: `2px solid ${cfg.color}`,
            }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{
              width: [0, 800 + i * 150],
              height: [0, 800 + i * 150],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2.5,
              delay: 0.1 + i * 0.25,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Central glow */}
        <motion.div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${cfg.color}20 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={18} className="text-white/40" />
        </button>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-lg px-6">
          {/* Tier label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles size={14} style={{ color: cfg.color }} />
            <span
              className="font-mono text-[11px] tracking-[0.4em] font-bold"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
            <Sparkles size={14} style={{ color: cfg.color }} />
          </motion.div>

          {/* Achievement icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 150, delay: 0.4 }}
            className="mx-auto mb-6"
          >
            <div
              className="w-28 h-28 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: `${cfg.color}15`,
                boxShadow: cfg.glow,
                border: `2px solid ${cfg.color}40`,
              }}
            >
              {current.icon ? (
                <span className="text-5xl">{current.icon}</span>
              ) : (
                <TierIcon size={56} style={{ color: cfg.color }} />
              )}
            </div>
          </motion.div>

          {/* Achievement name */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1
                className="font-display text-3xl sm:text-4xl font-black mb-2"
                style={{
                  backgroundImage: cfg.gradient,
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "legendaryShimmer 3s linear infinite",
                }}
              >
                {current.name}
              </h1>
              <p className="font-mono text-sm text-white/50 mb-6">
                {current.description}
              </p>
            </motion.div>
          )}

          {/* Rewards */}
          {showContent && (current.xpReward || current.pointsReward) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              {current.xpReward && (
                <span className="font-mono text-sm void-text-accent font-bold">
                  +{current.xpReward} XP
                </span>
              )}
              {current.pointsReward && (
                <span className="font-mono text-sm void-text-energy font-bold">
                  +{current.pointsReward} PTS
                </span>
              )}
            </motion.div>
          )}

          {/* Antiquarian lore fragment */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-xl border void-border void-bg-sunk/[0.03] mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full void-bg-sunk" />
                <span className="font-display text-[10px] tracking-[0.25em] void-text-accent">
                  THE ANTIQUARIAN
                </span>
                <div className="w-1.5 h-1.5 rounded-full void-bg-sunk" />
              </div>
              <p className="font-mono text-sm void-text-accent leading-relaxed italic">
                "{loreText}"
              </p>
            </motion.div>
          )}

          {/* Action buttons */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-3"
            >
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/60 font-mono text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Share2 size={14} />
                Share
              </button>
              <button
                onClick={dismiss}
                className="px-8 py-2.5 rounded-lg font-mono text-sm font-bold transition-colors flex items-center gap-2"
                style={{
                  background: `${cfg.color}20`,
                  borderColor: `${cfg.color}40`,
                  border: `1px solid ${cfg.color}40`,
                  color: cfg.color,
                }}
              >
                Continue
              </button>
            </motion.div>
          )}
        </div>

        {/* Shimmer keyframes */}
        <style>{`
          @keyframes legendaryShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
