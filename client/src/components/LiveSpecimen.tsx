/**
 * LiveSpecimen — BioWare-quality companion portrait display.
 *
 * Designed for hyper-realistic specimen art. Inspired by Mass Effect
 * companion portraits and Dragon Age relationship panels:
 *
 * - Subtle idle breathing (micro-scale pulse, not bouncy)
 * - Parallax mouse tracking (portrait follows cursor slightly)
 * - Animated rim lighting in specimen's energy color
 * - Specular eye-glint that shifts with mouse position
 * - Bond-based warmth (warm filter at high bond, cold at low)
 * - Mood-driven color temperature overlays
 * - Species-specific ambient particles (photon dust, viral spores, etc.)
 * - Tap: portrait brightens + reaction text, subtle zoom
 * - Contextual floating thoughts on idle timer
 * - Evolution stage: fragment=faded/ghostly, companion=solid, ascended=radiant
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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

  const [thought, setThought] = useState<string | null>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [isPoking, setIsPoking] = useState(false);
  const thoughtTimer = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const imgX = useTransform(mouseX, [0, 1], [-3, 3]);
  const imgY = useTransform(mouseY, [0, 1], [-2, 2]);
  const glintX = useTransform(mouseX, [0, 1], [20, 80]);
  const glintY = useTransform(mouseY, [0, 1], [15, 45]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !interactive) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [interactive, mouseX, mouseY]);

  // Idle thoughts
  useEffect(() => {
    if (!showThoughts) return;
    const scheduleThought = () => {
      const delay = 10000 + Math.random() * 18000;
      thoughtTimer.current = setTimeout(() => {
        const thoughts = IDLE_THOUGHTS[specimenId] || IDLE_THOUGHTS.lux;
        setThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
        setTimeout(() => setThought(null), 4000);
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
    setTimeout(() => setIsPoking(false), 600);
    setTimeout(() => setThought(null), 3000);
  }, [specimenId, interactive]);

  // Bond-based color temperature (0=cold/blue, 100=warm/amber)
  const bondWarmth = Math.max(0, Math.min(100, bond));
  const warmthHue = bondWarmth > 50 ? 0 : 210; // warm vs cold tint
  const warmthSat = Math.abs(bondWarmth - 50) * 0.4; // intensity
  const warmthOverlay = bondWarmth > 50
    ? `rgba(255, 200, 100, ${(bondWarmth - 50) * 0.003})`
    : `rgba(100, 150, 255, ${(50 - bondWarmth) * 0.003})`;

  // Stage-based presentation
  const stageStyles = {
    fragment: {
      opacity: 0.6,
      filter: "brightness(0.6) saturate(0.4) contrast(0.9)",
      rimOpacity: 0.1,
      particleCount: 3,
    },
    companion: {
      opacity: 1,
      filter: "brightness(0.95) saturate(1) contrast(1)",
      rimOpacity: 0.3,
      particleCount: 6,
    },
    ascended: {
      opacity: 1,
      filter: "brightness(1.05) saturate(1.15) contrast(1.05)",
      rimOpacity: 0.5,
      particleCount: 10,
    },
  }[stage];

  // Mood-based color shifts
  const moodTint: Record<SpecimenMood, string> = {
    content: "transparent",
    excited: `${palette.energy}08`,
    wary: "rgba(255, 200, 0, 0.04)",
    hostile: "rgba(255, 50, 50, 0.06)",
    curious: `${palette.accent}06`,
    sleeping: "rgba(100, 100, 200, 0.05)",
    playful: `${palette.energy}06`,
  };

  const imgSize = size === "sm" ? px * 0.85 : px * 0.8;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: px, height: px, cursor: interactive ? "pointer" : "default" }}
      onClick={handlePoke}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
    >
      {/* Ambient rim glow — animated ring of energy color */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: size === "sm" ? 2 : 4,
          background: `radial-gradient(circle, transparent 55%, ${palette.energy}${Math.round(stageStyles.rimOpacity * 255).toString(16).padStart(2, "0")} 85%, transparent 100%)`,
          filter: "blur(6px)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.02, 1] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Species-specific ambient particles */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        {Array.from({ length: stageStyles.particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1.5 + Math.random() * 2,
              height: 1.5 + Math.random() * 2,
              background: palette.energy,
            }}
            initial={{
              x: `${30 + Math.random() * 40}%`,
              y: `${80 + Math.random() * 20}%`,
              opacity: 0,
            }}
            animate={{
              x: `${20 + Math.random() * 60}%`,
              y: [`${70 + Math.random() * 20}%`, `${10 + Math.random() * 30}%`],
              opacity: [0, 0.4 + Math.random() * 0.3, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Portrait image with parallax */}
      <motion.div
        className="relative z-10 overflow-hidden rounded-full"
        style={{
          width: imgSize,
          height: imgSize,
          x: imgX,
          y: imgY,
        }}
      >
        {/* Main portrait */}
        <motion.img
          src={artPath}
          alt={spec.name}
          draggable={false}
          className="w-full h-full object-cover select-none"
          style={{
            filter: stageStyles.filter,
            opacity: stageStyles.opacity,
          }}
          animate={isPoking ? {
            scale: [1, 1.06, 1],
            brightness: [1, 1.3, 1],
          } : {
            scale: [1, 1.008, 1], // Micro-breathing
          }}
          transition={isPoking
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: 4, ease: "easeInOut", repeat: Infinity }
          }
        />

        {/* Specular eye-glint — follows mouse */}
        {stage !== "fragment" && interactive && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: px * 0.06,
              height: px * 0.06,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
              filter: "blur(1px)",
              left: glintX as any,
              top: glintY as any,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Bond warmth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: warmthOverlay, mixBlendMode: "soft-light" }}
        />

        {/* Mood tint */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-1000"
          style={{ background: moodTint[mood] }}
        />

        {/* Fragment ghost effect */}
        {stage === "fragment" && (
          <div className="absolute inset-0 pointer-events-none specimen-ghost" />
        )}

        {/* Ascended radiance edge */}
        {stage === "ascended" && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              boxShadow: `inset 0 0 ${px * 0.15}px ${palette.energy}30`,
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Portrait frame ring */}
      <div
        className="absolute z-20 rounded-full pointer-events-none"
        style={{
          width: imgSize + 4,
          height: imgSize + 4,
          border: `1.5px solid ${palette.energy}${stage === "ascended" ? "60" : "25"}`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Sleeping indicator */}
      {mood === "sleeping" && (
        <div className="absolute top-1 right-1 z-30 font-mono text-xs" style={{ color: palette.energy, opacity: 0.5 }}>
          <motion.span animate={{ opacity: [0, 0.8, 0], y: [0, -6, -14] }} transition={{ duration: 2.5, repeat: Infinity }}>z</motion.span>
          <motion.span animate={{ opacity: [0, 0.8, 0], y: [0, -6, -14] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.7 }} className="text-sm ml-0.5">Z</motion.span>
        </div>
      )}

      {/* Bond heart — BioWare style (small, subtle) */}
      {bond >= 80 && stage !== "fragment" && (
        <motion.div
          className="absolute z-30"
          style={{
            bottom: size === "sm" ? 0 : 4,
            right: size === "sm" ? 0 : 4,
            fontSize: size === "sm" ? 8 : 12,
            color: palette.energy,
            filter: `drop-shadow(0 0 4px ${palette.energy})`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {"\u2764"}
        </motion.div>
      )}

      {/* Thought bubble — refined */}
      <AnimatePresence>
        {thought && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute z-40 pointer-events-none"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: size === "sm" ? 4 : 10,
              whiteSpace: "nowrap",
            }}
          >
            <div
              className="px-3 py-1.5 rounded-md font-mono italic"
              style={{
                fontSize: size === "sm" ? 8 : 10,
                background: "rgba(0,0,0,0.9)",
                border: `1px solid ${palette.energy}30`,
                color: palette.energy,
                boxShadow: `0 0 16px ${palette.energy}15, 0 4px 12px rgba(0,0,0,0.5)`,
                backdropFilter: "blur(8px)",
              }}
            >
              {thought}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: "100%",
                width: 0, height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: `4px solid ${palette.energy}30`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poke counter */}
      {pokeCount >= 10 && pokeCount % 10 === 0 && (
        <motion.div
          initial={{ opacity: 1, scale: 1.3, y: -15 }}
          animate={{ opacity: 0, y: -40 }}
          transition={{ duration: 1.2 }}
          className="absolute top-0 z-40 font-display text-xs font-bold"
          style={{ color: palette.accent, filter: `drop-shadow(0 0 6px ${palette.accent})` }}
        >
          x{pokeCount}!
        </motion.div>
      )}

      <style>{`
        .specimen-ghost {
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(255,255,255,0.03) 3px,
            rgba(255,255,255,0.03) 6px
          );
          animation: specimen-ghost-flicker 3s ease-in-out infinite;
        }
        @keyframes specimen-ghost-flicker {
          0%, 100% { opacity: 0.3; }
          30% { opacity: 0.1; }
          70% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
