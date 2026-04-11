/* ═══════════════════════════════════════════════════════
   BOARD EFFECTS — Dynamic visual effects for the card battlefield
   Energy fields, faction banners, weather/atmosphere, dynamic lighting
   ═══════════════════════════════════════════════════════ */
import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Flame, Zap, Crown, Skull } from "lucide-react";

/* ─── ENERGY FIELD OVERLAY ─── 
   Pulsing energy field that intensifies based on total field power */
export function EnergyFieldOverlay({
  playerFieldPower,
  enemyFieldPower,
  turn,
}: {
  playerFieldPower: number;
  enemyFieldPower: number;
  turn: "player" | "enemy";
}) {
  const playerIntensity = Math.min(1, playerFieldPower / 30);
  const enemyIntensity = Math.min(1, enemyFieldPower / 30);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Player energy field (bottom half) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        animate={{
          opacity: [0.15 + playerIntensity * 0.2, 0.25 + playerIntensity * 0.3, 0.15 + playerIntensity * 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse at 50% 100%, rgba(51,226,230,${0.04 + playerIntensity * 0.08}) 0%, transparent 70%)`,
        }}
      />

      {/* Enemy energy field (top half) */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2"
        animate={{
          opacity: [0.15 + enemyIntensity * 0.2, 0.25 + enemyIntensity * 0.3, 0.15 + enemyIntensity * 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(239,68,68,${0.04 + enemyIntensity * 0.08}) 0%, transparent 70%)`,
        }}
      />

      {/* Active turn indicator glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: turn === "player" ? [0, 0.08, 0] : [0, 0.06, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: turn === "player"
            ? "linear-gradient(0deg, rgba(51,226,230,0.1) 0%, transparent 40%)"
            : "linear-gradient(180deg, rgba(239,68,68,0.08) 0%, transparent 40%)",
        }}
      />

      {/* Energy tendrils along the edges when field is strong */}
      {playerIntensity > 0.5 && (
        <>
          <motion.div
            className="absolute bottom-0 left-0 w-px"
            animate={{ height: ["0%", `${20 + playerIntensity * 30}%`, "0%"], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
            style={{ background: "linear-gradient(0deg, rgba(51,226,230,0.4), transparent)" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-px"
            animate={{ height: ["0%", `${20 + playerIntensity * 30}%`, "0%"], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
            style={{ background: "linear-gradient(0deg, rgba(51,226,230,0.4), transparent)" }}
          />
        </>
      )}
      {enemyIntensity > 0.5 && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-px"
            animate={{ height: ["0%", `${20 + enemyIntensity * 30}%`, "0%"], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
            style={{ background: "linear-gradient(180deg, rgba(239,68,68,0.4), transparent)" }}
          />
          <motion.div
            className="absolute top-0 right-0 w-px"
            animate={{ height: ["0%", `${20 + enemyIntensity * 30}%`, "0%"], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
            style={{ background: "linear-gradient(180deg, rgba(239,68,68,0.4), transparent)" }}
          />
        </>
      )}
    </div>
  );
}

/* ─── FACTION BANNERS ─── 
   Animated faction banners on each side of the battlefield */
export function FactionBanners({
  playerFaction,
  enemyFaction,
}: {
  playerFaction?: string;
  enemyFaction?: string;
}) {
  const getFactionColor = (faction?: string) => {
    switch (faction?.toLowerCase()) {
      case "architect": return { primary: "#33e2e6", secondary: "#1a7a7d", icon: Crown };
      case "dreamer": return { primary: "#a855f7", secondary: "#6b21a8", icon: Zap };
      case "order": return { primary: "#3b82f6", secondary: "#1d4ed8", icon: Shield };
      case "chaos": return { primary: "#ef4444", secondary: "#b91c1c", icon: Flame };
      default: return { primary: "#6b7280", secondary: "#374151", icon: Shield };
    }
  };

  const pFaction = getFactionColor(playerFaction);
  const eFaction = getFactionColor(enemyFaction);

  return (
    <>
      {/* Player faction banner — left side */}
      <div className="absolute left-0 bottom-1/4 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [-2, 0, -2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 sm:w-1.5 h-20 sm:h-28 rounded-r-sm"
          style={{
            background: `linear-gradient(180deg, transparent, ${pFaction.primary}66, ${pFaction.primary}44, transparent)`,
            boxShadow: `2px 0 12px ${pFaction.primary}22`,
          }}
        />
      </div>

      {/* Enemy faction banner — right side */}
      <div className="absolute right-0 top-1/4 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [2, 0, 2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="w-1 sm:w-1.5 h-20 sm:h-28 rounded-l-sm"
          style={{
            background: `linear-gradient(180deg, transparent, ${eFaction.primary}66, ${eFaction.primary}44, transparent)`,
            boxShadow: `-2px 0 12px ${eFaction.primary}22`,
          }}
        />
      </div>
    </>
  );
}

/* ─── WEATHER / ATMOSPHERE EFFECTS ─── 
   Dynamic atmospheric effects based on game state */
export function WeatherEffects({
  turnNumber,
  playerHP,
  playerMaxHP,
  enemyHP,
  enemyMaxHP,
}: {
  turnNumber: number;
  playerHP: number;
  playerMaxHP: number;
  enemyHP: number;
  enemyMaxHP: number;
}) {
  const [embers, setEmbers] = useState<Array<{ id: number; x: number; delay: number; size: number; speed: number }>>([]);

  const gamePhase = useMemo(() => {
    const avgHP = ((playerHP / playerMaxHP) + (enemyHP / enemyMaxHP)) / 2;
    if (avgHP > 0.7) return "calm";
    if (avgHP > 0.4) return "tense";
    return "critical";
  }, [playerHP, playerMaxHP, enemyHP, enemyMaxHP]);

  // Generate embers for critical phase
  useEffect(() => {
    if (gamePhase === "critical") {
      const newEmbers = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 4,
        size: 1 + Math.random() * 2,
        speed: 3 + Math.random() * 4,
      }));
      setEmbers(newEmbers);
    } else {
      setEmbers([]);
    }
  }, [gamePhase]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Calm phase: subtle star-like twinkles */}
      {gamePhase === "calm" && (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                width: 2,
                height: 2,
                background: "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </>
      )}

      {/* Tense phase: slow-moving fog wisps */}
      {gamePhase === "tense" && (
        <>
          <motion.div
            className="absolute w-full h-32"
            animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              top: "40%",
              background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <motion.div
            className="absolute w-full h-24"
            animate={{ x: ["10%", "-10%", "10%"], opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{
              top: "55%",
              background: "radial-gradient(ellipse, rgba(51,226,230,0.06) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />
        </>
      )}

      {/* Critical phase: rising embers + red vignette */}
      {gamePhase === "critical" && (
        <>
          {/* Red vignette */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(239,68,68,0.08) 100%)",
            }}
          />

          {/* Rising embers */}
          {embers.map(ember => (
            <motion.div
              key={`ember-${ember.id}`}
              className="absolute rounded-full"
              animate={{
                y: ["110vh", "-10vh"],
                x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
                opacity: [0, 0.8, 0.6, 0],
              }}
              transition={{
                duration: ember.speed,
                repeat: Infinity,
                delay: ember.delay,
                ease: "linear",
              }}
              style={{
                left: `${ember.x}%`,
                width: ember.size,
                height: ember.size,
                background: `rgba(${200 + Math.random() * 55}, ${50 + Math.random() * 50}, 0, 0.7)`,
                boxShadow: `0 0 ${ember.size * 2}px rgba(255,100,0,0.4)`,
              }}
            />
          ))}

          {/* Danger pulse on the divider area */}
          <motion.div
            className="absolute left-0 right-0 h-8"
            style={{ top: "48%" }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.2), transparent)",
            }} />
          </motion.div>
        </>
      )}

      {/* Late-game intensity: subtle screen-edge glow after turn 8 */}
      {turnNumber > 8 && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 0.04, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            boxShadow: "inset 0 0 60px rgba(251,191,36,0.05)",
          }}
        />
      )}
    </div>
  );
}

/* ─── DYNAMIC BOARD LIGHTING ─── 
   Responsive lighting that changes based on game events */
export function DynamicBoardLighting({
  lastAction,
  turn,
  turnNumber,
}: {
  lastAction?: string;
  turn: "player" | "enemy";
  turnNumber: number;
}) {
  const [lightPulse, setLightPulse] = useState<{ color: string; intensity: number } | null>(null);

  useEffect(() => {
    if (!lastAction) return;

    if (lastAction.includes("attacks") || lastAction.includes("damage")) {
      setLightPulse({ color: "rgba(239,68,68,0.12)", intensity: 0.8 });
    } else if (lastAction.includes("plays") || lastAction.includes("summon")) {
      setLightPulse({ color: "rgba(51,226,230,0.1)", intensity: 0.6 });
    } else if (lastAction.includes("heal") || lastAction.includes("restore")) {
      setLightPulse({ color: "rgba(34,197,94,0.1)", intensity: 0.5 });
    } else if (lastAction.includes("destroy") || lastAction.includes("killed")) {
      setLightPulse({ color: "rgba(168,85,247,0.12)", intensity: 0.9 });
    }

    const timer = setTimeout(() => setLightPulse(null), 600);
    return () => clearTimeout(timer);
  }, [lastAction]);

  return (
    <AnimatePresence>
      {lightPulse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: lightPulse.intensity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${lightPulse.color} 0%, transparent 60%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─── CARD DEPLOY TRAIL ─── 
   Trail effect when a card is played from hand to field */
export function CardDeployTrail({ active, color = "#33e2e6" }: { active: boolean; color?: string }) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: [0, 1, 0], opacity: [0, 0.4, 0] }}
      transition={{ duration: 0.5 }}
      className="absolute left-1/2 -translate-x-1/2 w-px pointer-events-none z-20"
      style={{
        top: "60%",
        height: "30%",
        background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 8px ${color}44`,
        transformOrigin: "bottom",
      }}
    />
  );
}

/* ─── FIELD SLOT GLOW ─── 
   Glowing slot indicators when hovering to play a card */
export function FieldSlotGlow({ active, color = "rgba(51,226,230,0.15)" }: { active: boolean; color?: string }) {
  if (!active) return null;

  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        border: `1px dashed ${color}`,
        boxShadow: `inset 0 0 12px ${color}, 0 0 8px ${color}`,
      }}
    />
  );
}

/* ─── COMBO COUNTER ─── 
   Shows combo count when multiple actions happen in sequence */
export function ComboCounter({ count }: { count: number }) {
  if (count < 2) return null;

  return (
    <motion.div
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0.8] }}
      className="absolute top-4 right-4 z-30 pointer-events-none"
    >
      <div className="px-3 py-1.5 rounded-lg" style={{
        background: "rgba(251,191,36,0.15)",
        border: "1px solid rgba(251,191,36,0.3)",
        boxShadow: "0 0 20px rgba(251,191,36,0.1)",
      }}>
        <span className="font-display text-xs tracking-[0.3em] text-amber-400">
          {count}x COMBO
        </span>
      </div>
    </motion.div>
  );
}

/* ─── GRAVEYARD SOULS ─── 
   Floating soul wisps from the graveyard when cards die */
export function GraveyardSouls({ playerGraveyardCount, enemyGraveyardCount }: {
  playerGraveyardCount: number;
  enemyGraveyardCount: number;
}) {
  const totalSouls = Math.min(8, playerGraveyardCount + enemyGraveyardCount);
  if (totalSouls === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: totalSouls }, (_, i) => {
        const isPlayer = i < playerGraveyardCount;
        return (
          <motion.div
            key={`soul-${i}`}
            className="absolute rounded-full"
            animate={{
              y: [0, -20 - Math.random() * 30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: isPlayer ? `${60 + Math.random() * 20}%` : `${10 + Math.random() * 20}%`,
              width: 3 + Math.random() * 2,
              height: 3 + Math.random() * 2,
              background: isPlayer ? "rgba(51,226,230,0.3)" : "rgba(239,68,68,0.3)",
              boxShadow: isPlayer
                ? "0 0 8px rgba(51,226,230,0.2)"
                : "0 0 8px rgba(239,68,68,0.2)",
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </div>
  );
}
