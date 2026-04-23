/* ═══════════════════════════════════════════════════════
   ANIMATED PORTRAIT — Subtle idle animations for NPC portraits

   Wraps an NPC portrait image with:
   - Idle cycle: breathing (scale), parallax drift, blink
   - Speaking state: faster breathing, themed glow pulse
   - Expression crossfade with scale pop on change
   - Trust-based visual filters (desaturation / warmth)
   - The Human: progressive reveal (static → silhouette → full)
   - Respects prefers-reduced-motion
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNPCPortrait,
  getHumanRevealImage,
  HUMAN_REVEAL_STAGES,
  type NPCPortrait,
} from "@/game/npcPortraits";
import { FACTION_NPCS, type FactionNPCId } from "@/game/factionNPCs";
import { getCharacterSprite } from "@/game/characterSprites";
import { PortraitGlow } from "./PortraitGlow";
import { SpriteCharacter } from "./SpriteCharacter";

/* ─── REDUCED MOTION ─── */

const prefersReducedMotion =
  typeof matchMedia !== "undefined"
    ? matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

/* ─── KEYFRAMES (injected once) ─── */

const IDLE_KEYFRAMES = `
@keyframes portrait-breathe {
  0%, 100% { transform: scale(1) translate(0, 0); }
  50%      { transform: scale(1.005) translate(0, -0.5px); }
}
@keyframes portrait-breathe-speaking {
  0%, 100% { transform: scale(1) translate(0, 0); }
  50%      { transform: scale(1.008) translate(0, -0.8px); }
}
@keyframes portrait-drift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(0.7px, -0.4px); }
  50%  { transform: translate(-0.3px, 0.6px); }
  75%  { transform: translate(-0.8px, -0.2px); }
  100% { transform: translate(0, 0); }
}
@keyframes portrait-speaking-glow {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.7; }
}
@keyframes portrait-human-static {
  0%, 100% { opacity: 0.85; }
  15%      { opacity: 0.9; }
  30%      { opacity: 0.82; }
  50%      { opacity: 0.88; }
  70%      { opacity: 0.8; }
  85%      { opacity: 0.92; }
}
`;

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = IDLE_KEYFRAMES;
  document.head.appendChild(style);
  stylesInjected = true;
}

/* ─── TRUST-BASED FILTERS ─── */

function trustFilter(trustLevel: number): string {
  const t = Math.max(0, Math.min(100, trustLevel));
  if (t < 25) {
    // Low trust: desaturated, cooler tones
    const desat = 0.3 + (t / 25) * 0.3; // 0.3 → 0.6 saturation
    return `saturate(${desat}) brightness(0.92) sepia(0.08) hue-rotate(-8deg)`;
  }
  if (t > 75) {
    // High trust: warmer glow, slightly brighter
    const warmth = ((t - 75) / 25) * 0.12; // 0 → 0.12 sepia
    const bright = 1 + ((t - 75) / 25) * 0.08; // 1 → 1.08
    return `saturate(1.1) brightness(${bright}) sepia(${warmth})`;
  }
  return "none";
}

/* ─── BLINK HOOK ─── */

/** Returns true briefly every 3–7s to simulate an eye blink */
function useBlink(): boolean {
  const [blinking, setBlinking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleBlink = useCallback(() => {
    const delay = 3000 + Math.random() * 4000; // 3–7s
    timeoutRef.current = setTimeout(() => {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
        scheduleBlink();
      }, 150); // blink duration
    }, delay);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    scheduleBlink();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scheduleBlink]);

  return blinking;
}

/* ─── TYPES ─── */

interface AnimatedPortraitProps {
  /** NPC identifier (e.g. "elara", "the_human", "agent_zero") */
  npcId: string;
  /** Which expression to display (neutral, emotional1, emotional2, speaking) */
  expression?: keyof NPCPortrait["expressions"];
  /** Whether the NPC is currently talking — enables speaking effects */
  isSpeaking?: boolean;
  /** Live VO audio element. When present and a sprite bundle exists for
   *  this NPC, the portrait swaps to a sprite-driven talking head with
   *  real-time lip sync. */
  audio?: HTMLAudioElement | null;
  /** 0–100 trust level with the player */
  trustLevel?: number;
  /** Portrait crop size */
  size?: "bust" | "full";
  className?: string;
}

/* ─── COMPONENT ─── */

export function AnimatedPortrait({
  npcId,
  expression = "neutral",
  isSpeaking = false,
  audio = null,
  trustLevel = 50,
  size = "bust",
  className = "",
}: AnimatedPortraitProps) {
  ensureStyles();

  const portrait = useMemo(() => getNPCPortrait(npcId), [npcId]);
  const sprite = useMemo(() => getCharacterSprite(npcId), [npcId]);
  const blinking = useBlink();

  // Look up faction info for glow coloring
  const normalizedId = npcId.toLowerCase().replace(/[- ]/g, "_");
  const factionNpc = FACTION_NPCS[normalizedId as FactionNPCId];
  const faction = factionNpc?.faction;
  const npcColor = portrait?.color ?? factionNpc?.color ?? "#fbbf24";

  // ─── Resolve the image URL ───
  const isHumanPreReveal = normalizedId === "the_human" && trustLevel < 50;

  const imageUrl = useMemo(() => {
    if (!portrait) return null;

    // The Human progressive reveal
    if (isHumanPreReveal) {
      return getHumanRevealImage(trustLevel);
    }

    return portrait.expressions[expression] ?? portrait.expressions.neutral;
  }, [portrait, expression, trustLevel, isHumanPreReveal]);

  // Previous image for crossfade detection
  const prevImageRef = useRef(imageUrl);
  const [showPop, setShowPop] = useState(false);

  // Expression change → scale pop
  useEffect(() => {
    if (imageUrl !== prevImageRef.current) {
      prevImageRef.current = imageUrl;
      if (!prefersReducedMotion) {
        setShowPop(true);
        const t = setTimeout(() => setShowPop(false), 350);
        return () => clearTimeout(t);
      }
    }
  }, [imageUrl]);

  if (!portrait || !imageUrl) return null;

  // ─── Dimension classes ───
  const sizeClass = size === "full"
    ? "w-full max-w-[512px] aspect-[2/3]"
    : "w-full max-w-[256px] aspect-square";

  // ─── Filters ───
  const filter = trustFilter(trustLevel);
  const speakingBrightness = isSpeaking ? "brightness(1.1)" : "";
  const combinedFilter = [filter, speakingBrightness].filter(Boolean).join(" ") || "none";

  // ─── Static / reduced motion portrait ───
  if (prefersReducedMotion) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${sizeClass} ${className}`}>
        {sprite && !isHumanPreReveal ? (
          <SpriteCharacter npcId={npcId} audio={audio} isSpeaking={isSpeaking} />
        ) : (
          <img
            src={imageUrl}
            alt={portrait.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: combinedFilter }}
          />
        )}
      </div>
    );
  }

  // ─── Human progressive reveal stage label ───
  const humanStage = isHumanPreReveal
    ? HUMAN_REVEAL_STAGES.find(s => trustLevel >= s.minTrust && trustLevel <= s.maxTrust)
    : null;

  return (
    <PortraitGlow
      faction={faction}
      color={npcColor}
      trustLevel={trustLevel}
      className={`${sizeClass} ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg w-full h-full">
        {/* ─── BREATHING + DRIFT WRAPPER ─── */}
        <div
          style={{
            animation: isSpeaking
              ? "portrait-breathe-speaking 2.5s ease-in-out infinite"
              : "portrait-breathe 4s ease-in-out infinite",
          }}
        >
          <div
            style={{
              animation: "portrait-drift 7s ease-in-out infinite",
            }}
          >
            {/* ─── PORTRAIT BODY ─── */}
            {/* Sprite-driven 2.5D talking head when a sprite bundle exists
                AND we're not in the Human's pre-reveal stages (which still
                use the static signal-static / signal-ghost / etc images).
                Otherwise fall back to the 2D portrait crossfade. */}
            {sprite && !isHumanPreReveal ? (
              <div
                className="w-full h-full"
                style={{ filter: combinedFilter, transition: "filter 0.4s ease" }}
              >
                <SpriteCharacter npcId={npcId} audio={audio} isSpeaking={isSpeaking} />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageUrl}
                  src={imageUrl}
                  alt={portrait.name}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    scale: showPop ? 1.02 : 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.35 },
                    scale: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="w-full h-full object-cover object-top"
                  style={{
                    filter: combinedFilter,
                    transition: "filter 0.4s ease",
                  }}
                />
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ─── BLINK OVERLAY (eye region) ─── */}
        {blinking && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{
              top: "20%",
              height: "12%",
              background: "linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--bg-void) 15%, transparent) 40%, color-mix(in oklch, var(--bg-void) 15%, transparent) 60%, transparent 100%)",
            }}
          />
        )}

        {/* ─── SPEAKING GLOW ─── */}
        {isSpeaking && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{
              background: `linear-gradient(0deg, ${npcColor}30 0%, transparent 100%)`,
              animation: "portrait-speaking-glow 1.2s ease-in-out infinite",
            }}
          />
        )}

        {/* ─── INNER FRAME SHADOW ─── */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: `inset 0 0 20px ${npcColor}10, inset -1px 0 0 ${npcColor}15`,
          }}
        />

        {/* ─── THE HUMAN: PROGRESSIVE REVEAL EFFECTS ─── */}
        {isHumanPreReveal && (
          <>
            {/* CRT scanlines */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0, transparent 2px, color-mix(in oklch, var(--energy-error) 6%, transparent) 2px, color-mix(in oklch, var(--energy-error) 6%, transparent) 4px)",
                mixBlendMode: "overlay",
                animation: "portrait-human-static 3s ease-in-out infinite",
              }}
            />

            {/* Interference sweep */}
            <motion.div
              animate={{ top: ["-10%", "110%"] }}
              transition={{
                duration: 2.5 + trustLevel / 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-0 right-0 h-8 pointer-events-none z-20"
              style={{
                background: `linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--energy-error) calc((0.1 - trustLevel * 0.0015) * 100%), transparent) 40%, color-mix(in oklch, var(--energy-error) calc((0.1 - trustLevel * 0.0015) * 100%), transparent) 60%, transparent 100%)`,
              }}
            />

            {/* Glitch bars at very low trust */}
            {trustLevel < 30 && (
              <motion.div
                animate={{ opacity: [0, 1, 0], x: [0, -3, 2, 0] }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  repeatDelay: trustLevel < 10 ? 2.5 : trustLevel < 20 ? 1.5 : 0.7,
                }}
                className="absolute left-0 right-0 pointer-events-none z-20"
                style={{
                  top: "35%",
                  height: trustLevel < 10 ? "10px" : "5px",
                  background: `color-mix(in oklch, var(--energy-error) calc((trustLevel < 10 ? 0.22 : 0.1) * 100%), transparent)`,
                  mixBlendMode: "screen",
                }}
              />
            )}

            {/* Stage label */}
            {humanStage && (
              <div
                className="absolute bottom-0 left-0 right-0 p-2 z-30"
                style={{
                  background: "linear-gradient(0deg, color-mix(in oklch, var(--bg-void) 70%, transparent) 0%, transparent 100%)",
                }}
              >
                <p className="font-mono text-[7px] tracking-[0.3em] void-text-error text-center uppercase">
                  {humanStage.label}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PortraitGlow>
  );
}

export default AnimatedPortrait;
