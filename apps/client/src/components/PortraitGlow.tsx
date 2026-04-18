/* ═══════════════════════════════════════════════════════
   PORTRAIT GLOW — CSS-only pulsing glow behind NPC portraits
   Color derived from faction, intensity from trust level.
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from "react";

/* ─── FACTION → GLOW COLOR MAP ─── */
const FACTION_GLOW_COLORS: Record<string, string> = {
  architect:     "var(--energy-primary)", // cyan
  dreamer:       "var(--energy-primary)", // cyan (Elara/Potentials — aligned with dreamer but uses cyan)
  insurgency:    "#ff6600", // orange
  new_babylon:   "#e040fb", // magenta
  thought_virus: "#ff1744", // red
  neutral:       "#fbbf24", // gold
};

/** Resolve a faction string to a glow color, falling back to gold */
function factionGlowColor(faction?: string): string {
  if (!faction) return FACTION_GLOW_COLORS.neutral;
  const key = faction.toLowerCase().replace(/[- ]/g, "_");
  return FACTION_GLOW_COLORS[key] ?? FACTION_GLOW_COLORS.neutral;
}

/* ─── KEYFRAME STYLES (injected once) ─── */
const GLOW_KEYFRAMES = `
@keyframes portrait-glow-pulse {
  0%   { opacity: var(--glow-min); transform: scale(1); }
  50%  { opacity: var(--glow-max); transform: scale(1.02); }
  100% { opacity: var(--glow-min); transform: scale(1); }
}
@keyframes portrait-glow-shift {
  0%   { filter: hue-rotate(0deg); }
  50%  { filter: hue-rotate(8deg); }
  100% { filter: hue-rotate(0deg); }
}
`;

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = GLOW_KEYFRAMES;
  document.head.appendChild(style);
  stylesInjected = true;
}

/* ─── COMPONENT ─── */

interface PortraitGlowProps {
  /** Faction key (architect, dreamer, insurgency, etc.) */
  faction?: string;
  /** Explicit color override — takes precedence over faction */
  color?: string;
  /** 0–100 trust level controls intensity */
  trustLevel?: number;
  /** Wrap children with the glow behind them */
  children: ReactNode;
  className?: string;
}

export function PortraitGlow({
  faction,
  color,
  trustLevel = 50,
  children,
  className = "",
}: PortraitGlowProps) {
  ensureStyles();

  const glowColor = color ?? factionGlowColor(faction);

  // Intensity ramps: low trust = dim, high trust = bright
  const clampedTrust = Math.max(0, Math.min(100, trustLevel));
  const minOpacity = 0.08 + clampedTrust * 0.002; // 0.08 → 0.28
  const maxOpacity = 0.15 + clampedTrust * 0.004; // 0.15 → 0.55
  const blurPx = 12 + clampedTrust * 0.18;        // 12 → 30

  return (
    <div className={`relative ${className}`}>
      {/* Glow layer behind the portrait */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none -z-10"
        style={{
          "--glow-min": minOpacity,
          "--glow-max": maxOpacity,
          background: `radial-gradient(ellipse at center, ${glowColor}40 0%, ${glowColor}15 40%, transparent 70%)`,
          filter: `blur(${blurPx}px)`,
          animation: "portrait-glow-pulse 4s ease-in-out infinite, portrait-glow-shift 12s ease-in-out infinite",
        } as React.CSSProperties}
      />

      {/* Children sit above the glow */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default PortraitGlow;
