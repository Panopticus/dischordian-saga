/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT UNLOCK TOAST — Cinematic full-width notification
   ───────────────────────────────────────────────────────
   Xbox-style achievement popup crossed with BioWare loyalty
   unlocked moment. Listens for "achievement-unlocked" custom
   events, queues multiple unlocks, and shows them sequentially.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Crown, Gem, Zap } from "lucide-react";
import type { TraitTier } from "@shared/achievementTraits";
import { KineticText } from "@/components/void";
import { isDialogActive } from "@/lib/dialogState";

/* ── Trait payload dispatched via custom event ── */
export interface UnlockPayload {
  id: string;
  name: string;
  tier: string;
  description: string;
  title?: string;
}

/* ── Helper to fire the custom event from anywhere ── */
export function dispatchAchievementUnlock(trait: UnlockPayload) {
  window.dispatchEvent(
    new CustomEvent("achievement-unlocked", { detail: trait }),
  );
}

/* ── Tier visual config ── */
const TIER_CONFIG: Record<string, {
  color: string;
  glow: string;
  icon: typeof Trophy;
  shimmer: string;
}> = {
  bronze: {
    color: "#CD7F32",
    glow: "0 0 30px rgba(205,127,50,0.5), 0 0 60px rgba(205,127,50,0.2)",
    icon: Trophy,
    shimmer: "linear-gradient(135deg, #CD7F32 0%, #E8A862 50%, #CD7F32 100%)",
  },
  silver: {
    color: "#C0C0C0",
    glow: "0 0 30px rgba(192,192,192,0.5), 0 0 60px rgba(192,192,192,0.25)",
    icon: Star,
    shimmer: "linear-gradient(135deg, #A0A0A0 0%, #E8E8E8 40%, #C0C0C0 60%, #F0F0F0 100%)",
  },
  gold: {
    color: "#FFD700",
    glow: "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2)",
    icon: Crown,
    shimmer: "linear-gradient(135deg, #FFD700 0%, #FFF7A0 30%, #FFD700 50%, #FFEC80 70%, #FFD700 100%)",
  },
  diamond: {
    color: "#B9F2FF",
    glow: "0 0 40px rgba(185,242,255,0.6), 0 0 80px rgba(185,242,255,0.3), 0 0 2px rgba(255,255,255,0.8)",
    icon: Gem,
    shimmer: "linear-gradient(135deg, #B9F2FF 0%, #E0FCFF 25%, #88E0EF 50%, #FFFFFF 75%, #B9F2FF 100%)",
  },
};

const DISPLAY_MS = 5000;
const GAP_MS = 1000;
const FALLBACK = TIER_CONFIG.bronze;

/* ── The component ── */
export default function AchievementUnlockToast() {
  const [current, setCurrent] = useState<UnlockPayload | null>(null);
  const queueRef = useRef<UnlockPayload[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showNext = useCallback(() => {
    // Don't show if a dialog is active — wait for it to close
    if (isDialogActive()) {
      timerRef.current = setTimeout(showNext, 1500);
      return;
    }
    const next = queueRef.current.shift();
    if (!next) { setCurrent(null); return; }
    setCurrent(next);
    window.dispatchEvent(new CustomEvent("play-sfx", { detail: { type: "achievement_unlock" } }));
    timerRef.current = setTimeout(() => {
      setCurrent(null);
      // gap before next in queue
      timerRef.current = setTimeout(showNext, GAP_MS);
    }, DISPLAY_MS);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const trait = (e as CustomEvent<UnlockPayload>).detail;
      if (!trait?.id) return;
      queueRef.current.push(trait);
      // kick off display if nothing is showing
      if (!current && queueRef.current.length === 1) showNext();
    };
    window.addEventListener("achievement-unlocked", handler);
    return () => {
      window.removeEventListener("achievement-unlocked", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, showNext]);

  const cfg = current ? (TIER_CONFIG[current.tier] ?? FALLBACK) : FALLBACK;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: `linear-gradient(180deg, rgba(10,10,14,0.97) 0%, rgba(18,18,24,0.95) 100%)`,
            borderBottom: `2px solid ${cfg.color}`,
            boxShadow: `0 4px 40px rgba(0,0,0,0.6), inset 0 -1px 0 ${cfg.color}40`,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* tier-colored edge glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse 60% 120% at 50% 0%, ${cfg.color}18 0%, transparent 70%)`,
          }} />

          <div style={{
            display: "flex", alignItems: "center", gap: 24,
            maxWidth: 960, margin: "0 auto", padding: "18px 32px",
            position: "relative",
          }}>
            {/* ── Left: Icon with glow pulse ── */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                flexShrink: 0, width: 56, height: 56,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 12,
                background: `${cfg.color}20`,
                boxShadow: cfg.glow,
              }}
            >
              <Icon size={32} color={cfg.color} strokeWidth={2} />
            </motion.div>

            {/* ── Center: Text block ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 3,
                  textTransform: "uppercase", color: "#888", marginBottom: 2,
                }}
              >
                <Zap size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
                Achievement Unlocked
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                  fontSize: 20, fontWeight: 800, color: cfg.color,
                  backgroundImage: cfg.shimmer,
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "achievementShimmer 3s linear infinite",
                  lineHeight: 1.2,
                }}
              >
                <KineticText text={current.name} mode="decode" speed={25} showCursor={false} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: 13, color: "#aaa", marginTop: 2 }}
              >
                {current.description}
              </motion.div>
            </div>

            {/* ── Right: Reward badge ── */}
            {current.title && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
                style={{
                  flexShrink: 0, padding: "6px 14px",
                  borderRadius: 8,
                  border: `1px solid ${cfg.color}50`,
                  background: `${cfg.color}12`,
                  fontSize: 12, fontWeight: 600,
                  color: cfg.color, textAlign: "center",
                  maxWidth: 160,
                }}
              >
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#666", marginBottom: 2 }}>
                  Title Earned
                </div>
                {current.title}
              </motion.div>
            )}
          </div>

          {/* shimmer keyframes injected once */}
          <style>{`
            @keyframes achievementShimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
