/* ═══════════════════════════════════════════════════════
   CHARACTER AURA OVERLAY — Visual effects on avatar
   Wraps a character portrait/avatar with the active
   character theme's aura, glow, and overlay effects.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { getCharacterTheme, type CharacterThemeDef } from "@shared/moralityThemes";

interface CharacterAuraOverlayProps {
  themeId: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const AURA_STYLES: Record<string, (color: string) => React.CSSProperties> = {
  glow: (c) => ({
    boxShadow: `0 0 15px ${c}30, 0 0 30px ${c}15`,
  }),
  particles: (c) => ({
    boxShadow: `0 0 20px ${c}25, 0 0 40px ${c}10, 0 -5px 15px ${c}20`,
  }),
  rings: (c) => ({
    boxShadow: `0 0 0 3px ${c}20, 0 0 0 6px ${c}10, 0 0 0 9px ${c}05, 0 0 20px ${c}15`,
  }),
  flames: (c) => ({
    boxShadow: `0 -8px 20px ${c}30, 0 -4px 10px ${c}20, 0 0 30px ${c}15`,
  }),
  vines: (c) => ({
    boxShadow: `0 0 15px ${c}20, 4px 4px 10px ${c}15, -4px -4px 10px ${c}15`,
  }),
  lightning: (c) => ({
    boxShadow: `0 0 10px ${c}40, 0 0 20px ${c}20, 0 0 40px ${c}10`,
  }),
  frost: (c) => ({
    boxShadow: `0 0 15px ${c}25, inset 0 0 10px ${c}10`,
  }),
  shadow: (c) => ({
    boxShadow: `0 0 25px ${c}40, 0 0 50px ${c}20, inset 0 0 15px ${c}10`,
  }),
  radiance: (c) => ({
    boxShadow: `0 0 20px ${c}35, 0 0 40px ${c}20, 0 0 60px ${c}10`,
  }),
  none: () => ({}),
};

const PORTRAIT_FILTERS: Record<string, string> = {
  normal: "none",
  grayscale: "grayscale(0.7)",
  sepia: "sepia(0.5)",
  "hue-shift": "hue-rotate(180deg)",
  invert: "invert(0.15) contrast(1.2)",
  saturate: "saturate(1.4)",
  contrast: "contrast(1.3) brightness(0.9)",
};

export function CharacterAuraOverlay({
  themeId,
  children,
  className = "",
  size = "md",
}: CharacterAuraOverlayProps) {
  const theme = useMemo(
    () => getCharacterTheme(themeId) || getCharacterTheme("char_void_walker")!,
    [themeId]
  );

  if (!theme) return <div className={className}>{children}</div>;

  const auraStyleFn = AURA_STYLES[theme.auraType] || AURA_STYLES.none;
  const auraStyle = auraStyleFn(theme.auraColor);
  const filter = PORTRAIT_FILTERS[theme.portraitEffect] || "none";

  const sizeClasses = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} overflow-hidden ${className}`}
      style={auraStyle}
    >
      {/* Portrait with filter */}
      <div style={{ filter }} className="relative z-10">
        {children}
      </div>

      {/* Overlay pattern */}
      {theme.overlayPattern !== "none" && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            backgroundImage: getOverlayPattern(theme.overlayPattern, theme.auraColor),
            backgroundRepeat: "repeat",
            opacity: 0.3,
          }}
        />
      )}
    </div>
  );
}

function getOverlayPattern(pattern: string, color: string): string {
  const c = encodeURIComponent(color);
  switch (pattern) {
    case "circuit-lines":
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h15M25 20h15M20 0v15M20 25v15' stroke='${c}' stroke-width='0.5' opacity='0.4'/%3E%3Ccircle cx='20' cy='20' r='2' fill='${c}' opacity='0.3'/%3E%3C/svg%3E")`;
    case "leaf-veins":
      return `url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 5Q30 25 25 45' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M25 15l10 5M25 25l-8 4M25 35l10 5' fill='none' stroke='${c}' stroke-width='0.3' opacity='0.2'/%3E%3C/svg%3E")`;
    case "energy-grid":
      return `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='30' height='30' fill='none' stroke='${c}' stroke-width='0.3' opacity='0.25'/%3E%3C/svg%3E")`;
    case "rune-marks":
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='10' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M30 20v20M20 30h20' stroke='${c}' stroke-width='0.3' opacity='0.15'/%3E%3C/svg%3E")`;
    case "hud-elements":
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='20' height='10' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M35 10h30' stroke='${c}' stroke-width='0.3' opacity='0.15'/%3E%3Crect x='5' y='60' width='15' height='8' fill='none' stroke='${c}' stroke-width='0.3' opacity='0.15'/%3E%3C/svg%3E")`;
    case "nature-frame":
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 70Q20 50 40 40Q60 50 70 70' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E")`;
    default:
      return "none";
  }
}

export default CharacterAuraOverlay;
