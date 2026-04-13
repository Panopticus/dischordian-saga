/**
 * FighterIntroOverlay — Cinematic fighter introduction sequences
 * 
 * Renders animated title cards, epithets, quotes, and entrance effects
 * for each fighter during the VS screen phase. Replaces the simple
 * VS splash with a dramatic cinematic introduction.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FighterData } from "./gameData";
import { getFighterIntro, type FighterIntro } from "./cinematicDesign";

/* ─── ENTRANCE EFFECT CONFIGS ─── */
const EFFECT_PARTICLES: Record<string, { count: number; color: string; shape: "circle" | "square" | "line"; spread: number }> = {
  teleport: { count: 20, color: "#22d3ee", shape: "square", spread: 200 },
  shadow_emerge: { count: 15, color: "#6b21a8", shape: "circle", spread: 150 },
  lightning: { count: 25, color: "#fbbf24", shape: "line", spread: 300 },
  fire_burst: { count: 30, color: "#ef4444", shape: "circle", spread: 250 },
  glitch_in: { count: 20, color: "#22d3ee", shape: "square", spread: 180 },
  void_tear: { count: 18, color: "#7c3aed", shape: "line", spread: 200 },
  nanobot_assemble: { count: 40, color: "#94a3b8", shape: "square", spread: 300 },
  phase_shift: { count: 15, color: "#818cf8", shape: "circle", spread: 160 },
  blood_portal: { count: 20, color: "#dc2626", shape: "circle", spread: 200 },
  light_descend: { count: 25, color: "#fef08a", shape: "line", spread: 250 },
  ground_slam: { count: 30, color: "#78716c", shape: "square", spread: 350 },
  smoke_reveal: { count: 35, color: "#64748b", shape: "circle", spread: 300 },
  digital_compile: { count: 25, color: "#34d399", shape: "square", spread: 200 },
  ice_shatter: { count: 30, color: "#67e8f9", shape: "square", spread: 280 },
  corruption_spread: { count: 20, color: "#a855f7", shape: "circle", spread: 200 },
  time_warp: { count: 15, color: "#fbbf24", shape: "line", spread: 180 },
  dream_fade: { count: 20, color: "#818cf8", shape: "circle", spread: 200 },
  storm_arrive: { count: 30, color: "#3b82f6", shape: "line", spread: 300 },
  crystal_form: { count: 25, color: "#a78bfa", shape: "square", spread: 220 },
  howl_entrance: { count: 20, color: "#94a3b8", shape: "line", spread: 250 },
};

interface FighterIntroOverlayProps {
  player: FighterData;
  opponent: FighterData;
  arenaName: string;
  arenaColor: string;
  onComplete: () => void;
}

type IntroPhase = "arena_reveal" | "p1_entrance" | "vs_clash" | "p2_entrance" | "fight_ready";

export default function FighterIntroOverlay({
  player,
  opponent,
  arenaName,
  arenaColor,
  onComplete,
}: FighterIntroOverlayProps) {
  const [phase, setPhase] = useState<IntroPhase>("arena_reveal");
  const [skippable, setSkippable] = useState(false);

  const p1Intro = getFighterIntro(player.id);
  const p2Intro = getFighterIntro(opponent.id);

  // Phase timing
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSkippable(true), 1000));
    timers.push(setTimeout(() => setPhase("p1_entrance"), 2200));
    timers.push(setTimeout(() => setPhase("vs_clash"), 4400));
    timers.push(setTimeout(() => setPhase("p2_entrance"), 5800));
    timers.push(setTimeout(() => setPhase("fight_ready"), 8000));
    timers.push(setTimeout(() => onComplete(), 9500));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (skippable) onComplete();
  }, [skippable, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-40 overflow-hidden cursor-pointer"
      style={{ background: "radial-gradient(ellipse at 50% 50%, #0a0a1a 0%, #000000 100%)" }}
      onClick={handleSkip}
    >
      {/* Skip hint */}
      {skippable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-3 right-3 z-50 font-mono text-[10px] text-white/30"
        >
          TAP TO SKIP
        </motion.div>
      )}

      {/* ═══ ARENA REVEAL ═══ */}
      <AnimatePresence>
        {(phase === "arena_reveal" || phase === "p1_entrance") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-1/2 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${arenaColor}, transparent)` }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center relative z-10"
            >
              <div className="font-mono text-[10px] tracking-[0.5em] mb-2" style={{ color: arenaColor + "80" }}>
                THE ARENA
              </div>
              <div
                className="font-display text-2xl sm:text-4xl font-black tracking-[0.3em]"
                style={{ color: arenaColor, textShadow: `0 0 30px ${arenaColor}60, 0 0 60px ${arenaColor}30` }}
              >
                {arenaName.toUpperCase()}
              </div>
            </motion.div>
            {/* Arena ambient particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`arena-p-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: arenaColor,
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.2 + Math.random() * 1.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ P1 ENTRANCE ═══ */}
      <AnimatePresence>
        {(phase === "p1_entrance" || phase === "vs_clash") && (
          <FighterEntranceCard
            fighter={player}
            intro={p1Intro}
            side="left"
            delay={0}
          />
        )}
      </AnimatePresence>

      {/* ═══ VS CLASH ═══ */}
      <AnimatePresence>
        {phase === "vs_clash" && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="relative">
              <motion.span
                className="font-display text-5xl sm:text-7xl font-black tracking-[0.2em]"
                style={{
                  color: "#ef4444",
                  textShadow: "0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.4)",
                }}
                animate={{
                  textShadow: [
                    "0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.4)",
                    "0 0 60px rgba(239,68,68,1), 0 0 120px rgba(239,68,68,0.6)",
                    "0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.4)",
                  ],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                VS
              </motion.span>
              {/* Impact lines */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <motion.div
                    key={`vs-line-${i}`}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: 2,
                      height: 40,
                      background: "linear-gradient(to bottom, #ef4444, transparent)",
                      transformOrigin: "center top",
                      transform: `translate(-50%, 0) rotate(${angle}rad)`,
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6, delay: 0.1 * i }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ P2 ENTRANCE ═══ */}
      <AnimatePresence>
        {(phase === "p2_entrance" || phase === "fight_ready") && (
          <FighterEntranceCard
            fighter={opponent}
            intro={p2Intro}
            side="right"
            delay={0}
          />
        )}
      </AnimatePresence>

      {/* ═══ FIGHT READY ═══ */}
      <AnimatePresence>
        {phase === "fight_ready" && (
          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
          >
            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 0.3, repeat: 3 }}
              className="font-display text-4xl sm:text-6xl font-black tracking-[0.4em]"
              style={{
                color: "#22d3ee",
                textShadow: "0 0 40px rgba(34,211,238,0.8), 0 0 80px rgba(34,211,238,0.4)",
              }}
            >
              FIGHT!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen flash on phase transitions */}
      <AnimatePresence>
        {(phase === "vs_clash" || phase === "fight_ready") && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ background: phase === "fight_ready" ? "#22d3ee" : "#ffffff" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── FIGHTER ENTRANCE CARD ─── */
interface FighterEntranceCardProps {
  fighter: FighterData;
  intro: FighterIntro | undefined;
  side: "left" | "right";
  delay: number;
}

function FighterEntranceCard({ fighter, intro, side, delay }: FighterEntranceCardProps) {
  const isLeft = side === "left";
  const accentColor = intro?.accentColor || fighter.color;
  const effectConfig = intro ? EFFECT_PARTICLES[intro.entranceEffect] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -200 : 200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -100 : 100 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`absolute inset-y-0 ${isLeft ? "left-0 right-1/2" : "left-1/2 right-0"} flex flex-col items-center justify-center z-20`}
    >
      {/* Entrance effect particles */}
      {effectConfig && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: effectConfig.count }).map((_, i) => {
            const x = 50 + (Math.random() - 0.5) * effectConfig.spread / 2;
            const y = 50 + (Math.random() - 0.5) * effectConfig.spread / 2;
            return (
              <motion.div
                key={`eff-${side}-${i}`}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: effectConfig.shape === "line" ? 2 : effectConfig.shape === "square" ? 4 : 6,
                  height: effectConfig.shape === "line" ? 12 : effectConfig.shape === "square" ? 4 : 6,
                  borderRadius: effectConfig.shape === "circle" ? "50%" : 0,
                  background: effectConfig.color,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                }}
                transition={{
                  duration: 1 + Math.random(),
                  delay: delay + Math.random() * 0.8,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Fighter portrait */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4, type: "spring" }}
        className="relative mb-4"
      >
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2"
          style={{ borderColor: accentColor + "80" }}
        >
          {fighter.image ? (
            <img src={fighter.image} alt={fighter.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: accentColor + "20" }}>
              <span className="font-display text-3xl font-bold" style={{ color: accentColor }}>
                {fighter.name[0]}
              </span>
            </div>
          )}
        </div>
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-2 rounded-xl pointer-events-none"
          style={{ boxShadow: `0 0 30px ${accentColor}40, inset 0 0 20px ${accentColor}20` }}
          animate={{
            boxShadow: [
              `0 0 30px ${accentColor}40, inset 0 0 20px ${accentColor}20`,
              `0 0 50px ${accentColor}60, inset 0 0 30px ${accentColor}30`,
              `0 0 30px ${accentColor}40, inset 0 0 20px ${accentColor}20`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Title card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.4, duration: 0.3 }}
        className="text-center px-4"
      >
        {intro?.titleCard && (
          <div
            className="font-mono text-[9px] tracking-[0.4em] mb-1"
            style={{ color: accentColor + "80" }}
          >
            {intro.titleCard}
          </div>
        )}
        <div
          className="font-display text-lg sm:text-2xl font-black tracking-[0.2em]"
          style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}60` }}
        >
          {fighter.name.toUpperCase()}
        </div>
        {intro?.epithet && (
          <div className="font-mono text-[10px] text-white/50 mt-1 tracking-wider">
            {intro.epithet}
          </div>
        )}
      </motion.div>

      {/* Entrance quote */}
      {intro?.quote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.8, duration: 0.5 }}
          className="mt-3 px-6 max-w-[280px]"
        >
          <p className="font-mono text-[10px] sm:text-xs text-white/40 italic text-center leading-relaxed">
            "{intro.quote}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
