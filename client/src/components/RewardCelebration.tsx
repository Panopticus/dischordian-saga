/* ═══════════════════════════════════════════════════════
   REWARD CELEBRATION — Particle effects, screen flash, and
   dramatic animations for major quest reward claims.
   Triggers on rewards with 100+ Dream Tokens.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Coins, Star, Gift, Zap } from "lucide-react";

/* ─── PARTICLE SYSTEM ─── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  spin: number;
  type: "spark" | "star" | "diamond" | "ring" | "glyph";
  delay: number;
  opacity: number;
}

const PARTICLE_COLORS = [
  "#FFB74D", // amber
  "#00E5FF", // cyan
  "#E040FB", // purple
  "#76FF03", // green
  "#FF5252", // red
  "#FFD740", // gold
  "#40C4FF", // light blue
  "#FFAB40", // orange
];

const GLYPH_CHARS = ["◆", "✦", "⬡", "◈", "✧", "⬢", "◇", "★", "⬟", "✶"];

function generateParticles(count: number, tier: "standard" | "major" | "legendary"): Particle[] {
  const particles: Particle[] = [];
  const baseCount = tier === "legendary" ? count * 2 : tier === "major" ? Math.floor(count * 1.5) : count;

  for (let i = 0; i < baseCount; i++) {
    const types: Particle["type"][] = ["spark", "star", "diamond", "ring", "glyph"];
    particles.push({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 10,
      size: Math.random() * 8 + 3,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      angle: Math.random() * 360,
      speed: Math.random() * 300 + 100,
      spin: (Math.random() - 0.5) * 720,
      type: types[Math.floor(Math.random() * types.length)],
      delay: Math.random() * 0.3,
      opacity: Math.random() * 0.5 + 0.5,
    });
  }
  return particles;
}

function ParticleRenderer({ particle }: { particle: Particle }) {
  const endX = particle.x + Math.cos((particle.angle * Math.PI) / 180) * particle.speed / 5;
  const endY = particle.y + Math.sin((particle.angle * Math.PI) / 180) * particle.speed / 5;

  const renderShape = () => {
    switch (particle.type) {
      case "spark":
        return (
          <div
            className="rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        );
      case "star":
        return (
          <div
            style={{
              fontSize: particle.size * 1.5,
              color: particle.color,
              textShadow: `0 0 ${particle.size}px ${particle.color}`,
              lineHeight: 1,
            }}
          >
            ✦
          </div>
        );
      case "diamond":
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.color,
              transform: "rotate(45deg)",
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            }}
          />
        );
      case "ring":
        return (
          <div
            className="rounded-full"
            style={{
              width: particle.size * 1.5,
              height: particle.size * 1.5,
              border: `1.5px solid ${particle.color}`,
              boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
            }}
          />
        );
      case "glyph":
        return (
          <div
            style={{
              fontSize: particle.size * 1.2,
              color: particle.color,
              textShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              fontFamily: "monospace",
              lineHeight: 1,
            }}
          >
            {GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]}
          </div>
        );
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      initial={{ opacity: particle.opacity, scale: 0 }}
      animate={{
        opacity: [particle.opacity, particle.opacity * 0.8, 0],
        scale: [0, 1.2, 0.3],
        x: `${(endX - particle.x)}vw`,
        y: `${(endY - particle.y)}vh`,
        rotate: particle.spin,
      }}
      transition={{
        duration: 1.8 + Math.random() * 0.8,
        delay: particle.delay,
        ease: "easeOut",
      }}
    >
      {renderShape()}
    </motion.div>
  );
}

/* ─── SCREEN FLASH ─── */
function ScreenFlash({ tier }: { tier: "standard" | "major" | "legendary" }) {
  const flashColor = tier === "legendary"
    ? "rgba(255,183,77,0.25)"
    : tier === "major"
    ? "rgba(0,229,255,0.15)"
    : "rgba(255,183,77,0.1)";

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[200]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.6, times: [0, 0.15, 1] }}
      style={{ background: `radial-gradient(ellipse at center, ${flashColor}, transparent 70%)` }}
    />
  );
}

/* ─── REWARD TIER BADGE ─── */
function TierBadge({ tier }: { tier: "standard" | "major" | "legendary" }) {
  if (tier === "standard") return null;

  const config = tier === "legendary"
    ? { label: "LEGENDARY REWARD", color: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "0 0 20px rgba(255,183,77,0.3)" }
    : { label: "MAJOR REWARD", color: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-500/30", glow: "0 0 15px rgba(0,229,255,0.2)" };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} border ${config.border} mb-2`}
      style={{ boxShadow: config.glow }}
    >
      <Star size={10} className={config.color} />
      <span className={`font-display text-[9px] font-bold tracking-[0.2em] ${config.color}`}>
        {config.label}
      </span>
    </motion.div>
  );
}

/* ─── REWARD VALUE COUNTER ─── */
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{display}</span>;
}

/* ─── MAIN CELEBRATION OVERLAY ─── */
export interface CelebrationData {
  questTitle: string;
  dreamTokens: number;
  xp: number;
  points: number;
  cardReward?: string;
  description: string;
  forceTier?: "standard" | "major" | "legendary";
}

export function determineTier(dreamTokens: number): "standard" | "major" | "legendary" {
  if (dreamTokens >= 150) return "legendary";
  if (dreamTokens >= 100) return "major";
  return "standard";
}

export default function RewardCelebration({
  data,
  onComplete,
}: {
  data: CelebrationData | null;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"flash" | "particles" | "reveal" | "done">("flash");

  const tier = useMemo(() => data ? (data.forceTier || determineTier(data.dreamTokens)) : "standard", [data]);
  const particles = useMemo(
    () => data ? generateParticles(tier === "legendary" ? 60 : tier === "major" ? 40 : 25, tier) : [],
    [data, tier]
  );

  useEffect(() => {
    if (!data) return;
    setPhase("flash");
    const t1 = setTimeout(() => setPhase("particles"), 200);
    const t2 = setTimeout(() => setPhase("reveal"), 600);
    const t3 = setTimeout(() => setPhase("done"), tier === "legendary" ? 5000 : 4000);
    const t4 = setTimeout(onComplete, tier === "legendary" ? 5500 : 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [data, tier, onComplete]);

  if (!data) return null;

  const isMajor = tier === "major" || tier === "legendary";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <div className="fixed inset-0 z-[199] pointer-events-none">
          {/* Screen Flash */}
          {(phase === "flash" || phase === "particles") && <ScreenFlash tier={tier} />}

          {/* Particles */}
          {(phase === "particles" || phase === "reveal") && (
            <div className="absolute inset-0 overflow-hidden">
              {particles.map(p => (
                <ParticleRenderer key={p.id} particle={p} />
              ))}
            </div>
          )}

          {/* Shockwave ring (major/legendary only) */}
          {isMajor && phase === "particles" && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 600, height: 600, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                border: tier === "legendary"
                  ? "2px solid rgba(255,183,77,0.5)"
                  : "2px solid rgba(0,229,255,0.4)",
                boxShadow: tier === "legendary"
                  ? "0 0 40px rgba(255,183,77,0.2), inset 0 0 40px rgba(255,183,77,0.1)"
                  : "0 0 30px rgba(0,229,255,0.15), inset 0 0 30px rgba(0,229,255,0.08)",
              }}
            />
          )}

          {/* Central Reward Reveal */}
          {phase === "reveal" && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={onComplete}
            >
              <div
                className="rounded-2xl p-6 sm:p-8 max-w-sm mx-auto"
                style={{
                  background: "linear-gradient(135deg, rgba(1,0,32,0.97) 0%, rgba(10,12,43,0.97) 100%)",
                  border: tier === "legendary"
                    ? "1px solid rgba(255,183,77,0.5)"
                    : tier === "major"
                    ? "1px solid rgba(0,229,255,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: tier === "legendary"
                    ? "0 0 80px rgba(255,183,77,0.2), 0 0 160px rgba(255,183,77,0.05)"
                    : tier === "major"
                    ? "0 0 60px rgba(0,229,255,0.15), 0 0 120px rgba(0,229,255,0.05)"
                    : "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {/* Tier Badge */}
                <TierBadge tier={tier} />

                {/* Icon */}
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="mb-3"
                >
                  {tier === "legendary" ? (
                    <div className="w-14 h-14 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center"
                      style={{ boxShadow: "0 0 30px rgba(255,183,77,0.2)" }}>
                      <Trophy size={28} className="text-amber-400" />
                    </div>
                  ) : tier === "major" ? (
                    <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center"
                      style={{ boxShadow: "0 0 20px rgba(0,229,255,0.15)" }}>
                      <Sparkles size={24} className="text-cyan-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Gift size={20} className="text-amber-400" />
                    </div>
                  )}
                </motion.div>

                {/* Quest Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-sm font-bold tracking-[0.15em] text-white mb-1"
                >
                  {data.questTitle}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-mono text-[10px] text-muted-foreground/60 mb-4"
                >
                  {data.description}
                </motion.p>

                {/* Reward Values with Animated Counters */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {data.dreamTokens > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/15 px-3 py-2">
                      <Coins size={14} className="text-amber-400 shrink-0" />
                      <div>
                        <p className="font-mono text-sm font-bold text-amber-400">
                          +<AnimatedCounter value={data.dreamTokens} />
                        </p>
                        <p className="font-mono text-[8px] text-amber-400/50">DREAM TOKENS</p>
                      </div>
                    </div>
                  )}
                  {data.xp > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-cyan-500/5 border border-cyan-500/15 px-3 py-2">
                      <Zap size={14} className="text-cyan-400 shrink-0" />
                      <div>
                        <p className="font-mono text-sm font-bold text-cyan-400">
                          +<AnimatedCounter value={data.xp} />
                        </p>
                        <p className="font-mono text-[8px] text-cyan-400/50">CITIZEN XP</p>
                      </div>
                    </div>
                  )}
                  {data.points > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-purple-500/5 border border-purple-500/15 px-3 py-2">
                      <Star size={14} className="text-purple-400 shrink-0" />
                      <div>
                        <p className="font-mono text-sm font-bold text-purple-400">
                          +<AnimatedCounter value={data.points} />
                        </p>
                        <p className="font-mono text-[8px] text-purple-400/50">POINTS</p>
                      </div>
                    </div>
                  )}
                  {data.cardReward && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/5 border border-green-500/15 px-3 py-2">
                      <Gift size={14} className="text-green-400 shrink-0" />
                      <div>
                        <p className="font-mono text-xs font-bold text-green-400">CARD</p>
                        <p className="font-mono text-[8px] text-green-400/50">UNLOCKED</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Tap to dismiss */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.3] }}
                  transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                  className="font-mono text-[9px] text-muted-foreground/50 mt-4 tracking-wider"
                >
                  TAP TO CONTINUE
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Vignette overlay for legendary */}
          {tier === "legendary" && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              style={{
                background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
              }}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
