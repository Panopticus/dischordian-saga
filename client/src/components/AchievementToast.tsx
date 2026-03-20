/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT TOAST — Pop-up notification when earned
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

const TIER_COLORS: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  platinum: "#e5e4e2",
  legendary: "#ff6b35",
};

export default function AchievementToast() {
  const { newAchievement, dismissNewAchievement } = useGamification();

  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(dismissNewAchievement, 5000);
      return () => clearTimeout(timer);
    }
  }, [newAchievement, dismissNewAchievement]);

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -80, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -80, x: "-50%" }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-4 left-1/2 z-[9999] cursor-pointer"
          onClick={dismissNewAchievement}
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-lg border backdrop-blur-md shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${TIER_COLORS[newAchievement.tier]}15, ${TIER_COLORS[newAchievement.tier]}08)`,
              borderColor: TIER_COLORS[newAchievement.tier] + "50",
              boxShadow: `0 0 30px ${TIER_COLORS[newAchievement.tier]}20`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: TIER_COLORS[newAchievement.tier] + "20" }}
            >
              {newAchievement.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Trophy size={12} style={{ color: TIER_COLORS[newAchievement.tier] }} />
                <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: TIER_COLORS[newAchievement.tier] }}>
                  ACHIEVEMENT UNLOCKED
                </span>
              </div>
              <div className="font-display text-sm font-bold text-white">{newAchievement.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground/70">{newAchievement.description}</div>
            </div>
            <div className="text-right ml-2">
              <div className="font-mono text-[10px] text-amber-400">+{newAchievement.xpReward} XP</div>
              <div className="font-mono text-[10px] text-cyan-400">+{newAchievement.pointsReward} PTS</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
