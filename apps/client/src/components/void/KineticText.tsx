/**
 * KineticText — Physics-aware animated text reveal with per-character effects.
 *
 * Enhanced port of void-energy-ui's kinetic-text package.
 *
 * Modes:
 * - char: Classic typewriter, character by character
 * - word: Chunked reveal simulating AI streaming
 * - cycle: Rotating word list (loading states)
 * - decode: Scramble-to-resolve (random chars converge to target)
 *
 * Character-level effects (via per-span CSS variables):
 * - Each revealed character gets a unique --kt-index and --kt-seed
 * - Continuous effects (drift, pulse, breathe, etc.) use these seeds
 *   to create organic per-character phase offsets
 * - Physics-specific rendering: glass=opacity fade-in, retro=instant block
 *
 * Usage:
 *   <KineticText text="Hello world" mode="char" effect="drift" />
 *   <KineticText text="SYSTEM ALERT" mode="decode" effect="glitch" />
 */
import { useMemo } from "react";
import { useKinetic, type KineticMode } from "@/hooks/useKinetic";
import type { NarrativeEffect } from "@/engine/voidNarrative";

interface KineticTextProps {
  /** The target text to reveal */
  text: string;
  /** Animation mode */
  mode?: KineticMode;
  /** Speed in ms per unit. Default 40 */
  speed?: number;
  /** For cycle mode: words to rotate through */
  words?: string[];
  /** Cycle interval in ms. Default 2000 */
  cycleInterval?: number;
  /** Auto-start. Default true */
  autoStart?: boolean;
  /** Callback when complete */
  onComplete?: () => void;
  /** Render as specific element. Default span */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  /** CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
  /** Show cursor during reveal */
  showCursor?: boolean;
  /**
   * Per-character continuous effect applied after reveal.
   * Maps to data-narrative CSS effects with per-char phase offsets.
   * Only continuous effects are valid here (not one-shot).
   */
  effect?: NarrativeEffect;
  /**
   * Enable per-character rendering. When true, each character is
   * wrapped in a <span> with CSS custom properties for effects.
   * More expensive — only enable when using character effects.
   * Default: auto (true if effect is set, false otherwise)
   */
  perCharacter?: boolean;
}

/** Seeded PRNG for deterministic per-character seeds (matches upstream) */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string to a seed number */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

function getPhysics(): "glass" | "flat" | "retro" {
  if (typeof document === "undefined") return "flat";
  return (document.documentElement.dataset.physics as any) || "flat";
}

export default function KineticText({
  text,
  mode = "char",
  speed = 40,
  words,
  cycleInterval,
  autoStart = true,
  onComplete,
  as: Tag = "span",
  className = "",
  style,
  showCursor = true,
  effect,
  perCharacter,
}: KineticTextProps) {
  const { displayText, isComplete, isRunning } = useKinetic({
    mode,
    text,
    speed,
    words,
    cycleInterval,
    autoStart,
    onComplete,
  });

  const usePerChar = perCharacter ?? !!effect;
  const physics = getPhysics();

  // Generate deterministic per-character seeds
  const charSeeds = useMemo(() => {
    if (!usePerChar) return [];
    const rng = mulberry32(hashString(text));
    return Array.from({ length: text.length }, () => rng());
  }, [text, usePerChar]);

  // Per-character rendering with CSS custom properties
  if (usePerChar) {
    const revealedCount = displayText.length;
    return (
      <Tag className={`${className} kinetic-text-container`} style={style} aria-label={text}>
        {/* Visual layer — per-character spans */}
        <span aria-hidden="true">
          {text.split("").map((char, i) => {
            const isRevealed = i < revealedCount;
            const seed = charSeeds[i] ?? 0;

            // Per-character CSS variables for effect phasing
            const charStyle: React.CSSProperties = {
              "--kt-index": i,
              "--kt-seed": seed.toFixed(4),
              "--kt-delay": `${(seed * 2).toFixed(3)}s`,
              opacity: isRevealed ? 1 : 0,
              transition: physics === "retro" ? "none"
                : physics === "glass" ? "opacity 0.15s ease-out"
                : "opacity 0.08s ease-out",
              display: "inline-block",
              animationDelay: isRevealed && effect ? `${(seed * 1.5).toFixed(3)}s` : undefined,
            } as React.CSSProperties;

            // Apply effect as inline animation name when revealed + complete
            if (isRevealed && effect && isComplete) {
              Object.assign(charStyle, {
                animationName: `ve-${effect}`,
                animationDuration: getEffectDuration(effect),
                animationTimingFunction: physics === "retro" ? "steps(4)" : "ease-in-out",
                animationIterationCount: "infinite",
                animationFillMode: "both",
              });
            }

            return (
              <span key={i} className="kinetic-char" style={charStyle}>
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>

        {/* Cursor */}
        {showCursor && isRunning && !isComplete && (
          <span
            className="inline-block w-[2px] h-[1em] ml-[1px] align-text-bottom animate-pulse"
            style={{ background: "var(--void-primary, var(--energy-primary))" }}
          />
        )}

        {/* Semantic layer for screen readers */}
        <span className="sr-only">{displayText}</span>
      </Tag>
    );
  }

  // Simple rendering (no per-character wrapping)
  return (
    <Tag className={className} style={style}>
      {displayText}
      {showCursor && isRunning && !isComplete && (
        <span className="inline-block w-[2px] h-[1em] ml-[1px] align-text-bottom animate-pulse" style={{ background: "var(--void-primary, var(--energy-primary))" }} />
      )}
    </Tag>
  );
}

/** Map narrative effects to appropriate animation durations */
function getEffectDuration(effect: NarrativeEffect): string {
  if (!effect) return "0s";
  const durations: Record<string, string> = {
    drift: "6s", flicker: "0.15s", breathe: "4s", tremble: "0.1s",
    pulse: "2s", whisper: "3s", fade: "5s", burn: "1.5s",
    static: "0.08s", distort: "2s", sway: "3s",
    // One-shot effects (shorter)
    shake: "0.5s", quake: "0.8s", jolt: "0.3s", glitch: "0.6s",
    surge: "0.7s", warp: "0.8s", freeze: "0.3s",
  };
  return durations[effect] ?? "2s";
}
