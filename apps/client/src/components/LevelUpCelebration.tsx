/* ═══════════════════════════════════════════════════════
   LEVEL-UP CELEBRATION — Fullscreen modal with fanfare
   Elara congratulates the player with level-appropriate
   dialog, expanding golden rings, and unlock list.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, ChevronRight, Lock } from "lucide-react";

/* ── Level-specific Elara dialog ── */
const ELARA_LINES: { minLevel: number; line: string }[] = [
  { minLevel: 50, line: "Level {level}. You've transcended every model I was built to predict. The Architect would kneel." },
  { minLevel: 40, line: "Level {level}. The Source itself takes notice. You are reshaping reality." },
  { minLevel: 30, line: "Level {level}! Even the Architect would notice you now. The Ark bends to your will." },
  { minLevel: 25, line: "Level {level}! The Panopticon is watching closely. You've become a variable they can't control." },
  { minLevel: 20, line: "Level {level}. Your neural pattern is evolving faster than any Potential I've monitored." },
  { minLevel: 15, line: "Level {level}! The Ark's systems are responding to you now. That... shouldn't happen." },
  { minLevel: 10, line: "Level {level}! The Ark recognizes your potential. I can feel the ship responding to you." },
  { minLevel: 5, line: "Level {level}. You're progressing well. The other Potentials could learn from your resolve." },
  { minLevel: 1, line: "Level {level}! Every step matters on this ship. You're growing stronger, Potential." },
];

function getElaraLine(level: number): string {
  const match = ELARA_LINES.find(l => level >= l.minLevel);
  return (match?.line ?? ELARA_LINES[ELARA_LINES.length - 1].line).replace("{level}", String(level));
}

/* ── Unlock definitions by level ── */
const LEVEL_UNLOCKS: Record<number, string[]> = {
  2: ["Daily Rewards"],
  3: ["Card Crafting Basics"],
  5: ["Chess Challenges", "PvP Arena Access"],
  7: ["Companion Gift System"],
  10: ["Legendary Card Crafting", "Morality Census"],
  15: ["Advanced Deck Strategies", "Trade Empire"],
  20: ["Mythic Card Fusion"],
  25: ["Restricted Deck Access", "Elite Battle Pass"],
  30: ["Void Crystal Forge"],
  40: ["Architect's Archive"],
  50: ["Source Protocols"],
};

interface LevelUpCelebrationProps {
  newLevel: number;
  onContinue: () => void;
}

export default function LevelUpCelebration({ newLevel, onContinue }: LevelUpCelebrationProps) {
  const [showContent, setShowContent] = useState(false);
  const unlocks = LEVEL_UNLOCKS[newLevel] ?? [];

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Trigger sfx
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("play-sfx", { detail: { type: "achievement_unlock" } }));
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
      >
        {/* Expanding golden rings */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 void-border"
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{
              width: [0, 600 + i * 200],
              height: [0, 600 + i * 200],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              delay: 0.3 + i * 0.3,
              ease: "easeOut",
            }}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 40px color-mix(in oklch, var(--energy-premium) 30%, transparent), inset 0 0 40px color-mix(in oklch, var(--energy-premium) 10%, transparent)`,
            }}
          />
        ))}

        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-1 h-1 rounded-full void-bg-sunk"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: (Math.random() - 0.5) * 500,
              y: (Math.random() - 0.5) * 500,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: 0.5 + Math.random() * 1,
              ease: "easeOut",
            }}
            style={{ left: "50%", top: "50%" }}
          />
        ))}

        {/* Central content */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
          className="relative z-10 text-center max-w-md px-6"
        >
          {/* Level number */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 250, delay: 0.4 }}
          >
            <div className="relative inline-block">
              <Sparkles
                size={24}
                className="absolute -top-4 -right-4 void-text-accent"
              />
              <Star
                size={20}
                className="absolute -top-3 -left-3 void-text-accent"
              />
              <p className="font-mono text-[10px] tracking-[0.4em] void-text-accent mb-2">
                LEVEL UP
              </p>
              <div
                className="font-display text-8xl font-black"
                style={{
                  background: "linear-gradient(180deg, var(--energy-premium) 0%, var(--energy-premium) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 30px color-mix(in oklch, var(--energy-premium) 50%, transparent))",
                }}
              >
                {newLevel}
              </div>
            </div>
          </motion.div>

          {/* Elara dialog */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full void-bg-success animate-pulse" />
                <span className="font-display text-xs tracking-[0.2em] void-text-energy">
                  ELARA
                </span>
              </div>
              <p className="font-mono text-sm text-white/80 leading-relaxed italic">
                "{getElaraLine(newLevel)}"
              </p>
            </motion.div>
          )}

          {/* Unlocks list */}
          {showContent && unlocks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl border void-border void-bg-sunk"
            >
              <p className="font-mono text-[9px] tracking-[0.3em] void-text-accent mb-3">
                NEWLY UNLOCKED
              </p>
              <div className="space-y-2">
                {unlocks.map((unlock, i) => (
                  <motion.div
                    key={unlock}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    className="flex items-center gap-2 text-left"
                  >
                    <Lock size={12} className="void-text-accent flex-shrink-0" />
                    <span className="font-mono text-xs void-text-accent">{unlock}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Continue button */}
          {showContent && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onContinue}
              className="mt-8 px-8 py-3 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm font-bold void-bg-sunk transition-colors flex items-center gap-2 mx-auto"
            >
              CONTINUE
              <ChevronRight size={16} />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
