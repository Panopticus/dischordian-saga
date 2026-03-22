/* ═══════════════════════════════════════════════════════
   SHIP THEME OVERLAY — Visual effects applied to the Ark
   Renders background patterns, particle effects, and
   glow based on the active ship theme.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { getShipTheme, type ShipThemeDef } from "@shared/moralityThemes";
import { useGame } from "@/contexts/GameContext";

/** Background pattern SVG generators */
const PATTERNS: Record<string, (color: string) => string> = {
  circuit: (c) => `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h40v40H10z' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.5' opacity='0.15'/%3E%3Ccircle cx='10' cy='10' r='2' fill='${encodeURIComponent(c)}' opacity='0.2'/%3E%3Ccircle cx='50' cy='50' r='2' fill='${encodeURIComponent(c)}' opacity='0.2'/%3E%3Cpath d='M10 30h20M30 10v20' stroke='${encodeURIComponent(c)}' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
  hex: (c) => `url("data:image/svg+xml,%3Csvg width='56' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34z' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.5' opacity='0.12'/%3E%3C/svg%3E")`,
  organic: (c) => `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.3' opacity='0.08'/%3E%3Ccircle cx='40' cy='40' r='15' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E")`,
  crystal: (c) => `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
  void: (c) => `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='${encodeURIComponent(c)}' opacity='0.15'/%3E%3Ccircle cx='20' cy='80' r='0.5' fill='${encodeURIComponent(c)}' opacity='0.1'/%3E%3Ccircle cx='80' cy='20' r='0.5' fill='${encodeURIComponent(c)}' opacity='0.1'/%3E%3C/svg%3E")`,
  flame: (c) => `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5Q35 25 30 35Q25 25 30 5z' fill='${encodeURIComponent(c)}' opacity='0.06'/%3E%3C/svg%3E")`,
  frost: (c) => `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60M10 10l40 40M50 10L10 50' stroke='${encodeURIComponent(c)}' stroke-width='0.3' opacity='0.08'/%3E%3C/svg%3E")`,
  nature: (c) => `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10Q50 30 40 50Q30 30 40 10z' fill='${encodeURIComponent(c)}' opacity='0.05'/%3E%3Cpath d='M20 40Q30 55 20 70Q10 55 20 40z' fill='${encodeURIComponent(c)}' opacity='0.04'/%3E%3C/svg%3E")`,
  chrome: (c) => `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.3' opacity='0.08'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='${encodeURIComponent(c)}' stroke-width='0.2' opacity='0.05'/%3E%3C/svg%3E")`,
  industrial: (c) => `url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='25' cy='25' r='3' fill='${encodeURIComponent(c)}' opacity='0.12'/%3E%3Crect x='5' y='5' width='40' height='40' fill='none' stroke='${encodeURIComponent(c)}' stroke-width='0.5' opacity='0.08' stroke-dasharray='4 4'/%3E%3C/svg%3E")`,
};

export function ShipThemeOverlay() {
  const { state } = useGame();
  const themeId = (state as any).activeShipTheme || "ship_twilight_equilibrium";

  const theme = useMemo(() => getShipTheme(themeId) || getShipTheme("ship_twilight_equilibrium")!, [themeId]);

  if (!theme) return null;

  const patternFn = PATTERNS[theme.bgPattern] || PATTERNS.void;
  const pattern = patternFn(theme.glowColor);

  return (
    <>
      {/* Background pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: pattern,
          backgroundRepeat: "repeat",
          opacity: 0.6,
        }}
      />
      {/* Edge glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          boxShadow: `inset 0 0 80px ${theme.glowColor}08, inset 0 0 200px ${theme.glowColor}04`,
        }}
      />
    </>
  );
}

export default ShipThemeOverlay;
