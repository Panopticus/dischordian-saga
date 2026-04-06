/**
 * LiveSpecimen — Animated, interactive companion display.
 *
 * Renders the specimen art with lifelike behaviors:
 * - Idle breathing animation (gentle scale pulse)
 * - Ambient glow in specimen's energy color
 * - Floating particles in specimen's palette
 * - Mood-based posture shifts
 * - Tap/click interactions: poke → reaction animation + thought bubble
 * - Contextual floating thoughts on idle timer
 * - Evolution stage visual differences (fragment=dim, companion=solid, ascended=radiant)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type SpecimenId,
  type SpecimenMood,
  type EvolutionStage,
  SPECIMENS,
  getSpecimenArtPath,
} from "@/game/arkSpecimens";

interface LiveSpecimenProps {
  specimenId: SpecimenId;
  stage: EvolutionStage;
  mood?: SpecimenMood;
  bond?: number;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  showThoughts?: boolean;
  className?: string;
}

const SIZE_MAP = { sm: 80, md: 140, lg: 220, xl: 320 };

const IDLE_THOUGHTS: Record<string, string[]> = {
  lux: ["*phases through your hand*", "*light frequency shifts warmly*", "*chases a photon*", "*nuzzles your holographic display*"],
  cipher: ["*scrolls code scales lazily*", "*hisses at corrupted data*", "*coils around your wrist*", "*decrypts something nobody asked about*"],
  flicker: ["*static crackles between wings*", "*perches on the nearest antenna*", "*electromagnetic pulse of contentment*", "*watches the void intently*"],
  gilt: ["*polishes shell smugly*", "*evaluates nearby objects*", "*clicks mandibles approvingly*", "*hoards a tiny crystal*"],
  spore: ["*tendrils pulse gently*", "*reaches toward a signal*", "*symbiotic warmth spreads*", "*absorbs ambient energy*"],
  echo: ["*phases slightly out of time*", "*chases its own afterimage*", "*purrs across two timelines*", "*temporal hiccup*"],
  glyph: ["*wings display a new word*", "*reads over your shoulder*", "*lands on an open book*", "*text shifts to a secret*"],
};

const POKE_REACTIONS: Record<string, string[]> = {
  lux: ["*happy flash!*", "*spins in a light helix*", "*blinks at you warmly*"],
  cipher: ["*coils tighter, then relaxes*", "*scales ripple with data*", "*tongue-flicks curiously*"],
  flicker: ["*static burst!*", "*ruffles feathers indignantly*", "*chirps in radio frequency*"],
  gilt: ["*shell glows brighter*", "*clicks mandibles twice*", "*offers a tiny gem*"],
  spore: ["*tendrils tickle back*", "*pulses red, then calm*", "*purrs virally*"],
  echo: ["*meows from 3 seconds ago*", "*temporal purr loop*", "*phases and reappears*"],
  glyph: ["*wings spell 'HELLO'*", "*flutters excitedly*", "*lands on your finger*"],
};

const MOOD_ANIMATIONS: Record<SpecimenMood, { rotate: number; scale: number; y: number }> = {
  content: { rotate: 0, scale: 1, y: 0 },
  excited: { rotate: -3, scale: 1.05, y: -4 },
  wary: { rotate: 2, scale: 0.95, y: 2 },
  hostile: { rotate: -5, scale: 1.08, y: -2 },
  curious: { rotate: -8, scale: 1.02, y: -6 },
  sleeping: { rotate: 5, scale: 0.92, y: 4 },
  playful: { rotate: -4, scale: 1.04, y: -8 },
};

export default function LiveSpecimen({
  specimenId,
  stage,
  mood = "content",
  bond = 50,
  size = "md",
  interactive = true,
  showThoughts = true,
  className = "",
}: LiveSpecimenProps) {
  const spec = SPECIMENS[specimenId];
  if (!spec) return null;

  const px = SIZE_MAP[size];
  const artPath = getSpecimenArtPath(specimenId, stage);
  const palette = spec.basePalette;
  const moodAnim = MOOD_ANIMATIONS[mood];

  const [thought, setThought] = useState<string | null>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [isPoking, setIsPoking] = useState(false);
  const thoughtTimer = useRef<ReturnType<typeof setTimeout>>();

  // Idle thoughts on timer
  useEffect(() => {
    if (!showThoughts) return;
    const scheduleThought = () => {
      const delay = 8000 + Math.random() * 15000; // 8-23 seconds
      thoughtTimer.current = setTimeout(() => {
        const thoughts = IDLE_THOUGHTS[specimenId] || IDLE_THOUGHTS.lux;
        setThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
        setTimeout(() => setThought(null), 3500);
        scheduleThought();
      }, delay);
    };
    scheduleThought();
    return () => clearTimeout(thoughtTimer.current);
  }, [specimenId, showThoughts]);

  // Poke interaction
  const handlePoke = useCallback(() => {
    if (!interactive) return;
    setIsPoking(true);
    setPokeCount(c => c + 1);

    const reactions = POKE_REACTIONS[specimenId] || POKE_REACTIONS.lux;
    setThought(reactions[Math.floor(Math.random() * reactions.length)]);

    setTimeout(() => setIsPoking(false), 400);
    setTimeout(() => setThought(null), 2500);
  }, [specimenId, interactive]);

  // Stage-based visual intensity
  const stageGlow = stage === "ascended" ? 0.6 : stage === "companion" ? 0.3 : 0.12;
  const stageFilter = stage === "fragment"
    ? "brightness(0.7) saturate(0.6)"
    : stage === "ascended"
    ? "brightness(1.1) saturate(1.3) contrast(1.05)"
    : "brightness(1) saturate(1)";

  // Breathing speed based on mood
  const breatheSpeed = mood === "sleeping" ? 4 : mood === "excited" ? 1.2 : 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: px, height: px, cursor: interactive ? "pointer" : "default" }}
      onClick={handlePoke}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.energy}${Math.round(stageGlow * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          animation: `specimen-glow ${breatheSpeed * 1.5}s ease-in-out infinite`,
          filter: "blur(12px)",
        }}
      />

      {/* Floating particles (6 motes) */}
      {stage !== "fragment" && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                background: palette.energy,
                opacity: 0.3 + Math.random() * 0.4,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animation: `specimen-particle ${3 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Specimen image */}
      <motion.img
        src={artPath}
        alt={spec.name}
        draggable={false}
        animate={{
          scale: isPoking
            ? [1, 1.15, 0.9, 1.05, 1]
            : [1 * moodAnim.scale, 1.02 * moodAnim.scale, 1 * moodAnim.scale],
          rotate: isPoking ? [0, -10, 10, -5, 0] : moodAnim.rotate,
          y: isPoking ? [0, -12, 0] : [moodAnim.y, moodAnim.y - 3, moodAnim.y],
        }}
        transition={
          isPoking
            ? { duration: 0.4, ease: "easeInOut" }
            : { duration: breatheSpeed, ease: "easeInOut", repeat: Infinity }
        }
        className="relative z-10 select-none"
        style={{
          width: px * 0.75,
          height: px * 0.75,
          objectFit: "contain",
          filter: stageFilter,
          drop_shadow: `0 0 ${stageGlow * 20}px ${palette.energy}`,
        }}
      />

      {/* Sleeping Z's */}
      {mood === "sleeping" && (
        <div className="absolute top-1 right-1 z-20 font-mono text-xs" style={{ color: palette.energy, opacity: 0.6 }}>
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [0, -8, -16] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            z
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [0, -8, -16] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="text-sm ml-0.5"
          >
            Z
          </motion.span>
        </div>
      )}

      {/* Bond hearts (high bond indicator) */}
      {bond >= 80 && stage !== "fragment" && (
        <motion.div
          className="absolute -top-1 -right-1 z-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: palette.accent, fontSize: size === "sm" ? 10 : 14 }}
        >
          {"\u2764"}
        </motion.div>
      )}

      {/* Thought bubble */}
      <AnimatePresence>
        {thought && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute z-30 pointer-events-none"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: 8,
              whiteSpace: "nowrap",
            }}
          >
            <div
              className="px-3 py-1.5 rounded-lg font-mono text-[10px] italic"
              style={{
                background: "rgba(0,0,0,0.85)",
                border: `1px solid ${palette.energy}40`,
                color: palette.energy,
                boxShadow: `0 0 12px ${palette.energy}20`,
              }}
            >
              {thought}
            </div>
            {/* Tail */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: "100%",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `5px solid ${palette.energy}40`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poke counter (easter egg) */}
      {pokeCount >= 10 && pokeCount % 10 === 0 && (
        <motion.div
          initial={{ opacity: 1, scale: 1.5, y: -20 }}
          animate={{ opacity: 0, y: -50 }}
          transition={{ duration: 1 }}
          className="absolute top-0 z-30 font-display text-xs font-bold"
          style={{ color: palette.accent }}
        >
          x{pokeCount}!
        </motion.div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes specimen-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes specimen-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-15px) translateX(5px); opacity: 0.6; }
          50% { transform: translateY(-25px) translateX(-3px); opacity: 0.4; }
          75% { transform: translateY(-10px) translateX(8px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
