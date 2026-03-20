/* ═══════════════════════════════════════════════════════
   MORALITY THEME CONTEXT
   Applies CSS variable overrides based on the player's morality score.
   Machine alignment → cold reds/silvers/steel
   Humanity alignment → warm greens/blues/gold
   Balanced → default Void Energy cyan/amber
   
   The theme is "zero-sum" — as you gain one palette, you lose the other.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useGame } from "@/contexts/GameContext";
import { getMoralityTierDef } from "@/components/MoralityMeter";

/* ─── THEME PALETTES ─── */
interface ThemePalette {
  // Core energy colors
  neonCyan: string;
  electricBlue: string;
  orbOrange: string;
  deepPurple: string;
  signalGreen: string;
  alertRed: string;
  // Gradient
  brandGradient: string;
  // Primary/accent overrides
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  ring: string;
  // Glass tints
  glassBorder: string;
  glassShine: string;
  // Sidebar
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  // Chart accent
  chart1: string;
  chart2: string;
}

// Default Void Energy palette (Balanced)
const BALANCED_PALETTE: ThemePalette = {
  neonCyan: "#33E2E6",
  electricBlue: "#3875FA",
  orbOrange: "#FF8C00",
  deepPurple: "#A078FF",
  signalGreen: "#00E055",
  alertRed: "#FF3C40",
  brandGradient: "linear-gradient(135deg, #33E2E6 0%, #3875FA 100%)",
  primary: "#33E2E6",
  primaryForeground: "#010020",
  accent: "#FF8C00",
  accentForeground: "#010020",
  ring: "#33E2E6",
  glassBorder: "rgba(56, 117, 250, 0.2)",
  glassShine: "rgba(51, 226, 230, 0.15)",
  sidebarPrimary: "#33E2E6",
  sidebarPrimaryForeground: "#010020",
  chart1: "#33E2E6",
  chart2: "#FF8C00",
};

// Machine palette — cold reds, silvers, steel
const MACHINE_PALETTE: ThemePalette = {
  neonCyan: "#FF4444",
  electricBlue: "#8B8B8B",
  orbOrange: "#C0C0C0",
  deepPurple: "#666666",
  signalGreen: "#FF6B35",
  alertRed: "#FF1A1A",
  brandGradient: "linear-gradient(135deg, #FF4444 0%, #8B0000 100%)",
  primary: "#FF4444",
  primaryForeground: "#0A0A0A",
  accent: "#C0C0C0",
  accentForeground: "#0A0A0A",
  ring: "#FF4444",
  glassBorder: "rgba(255, 68, 68, 0.2)",
  glassShine: "rgba(255, 68, 68, 0.1)",
  sidebarPrimary: "#FF4444",
  sidebarPrimaryForeground: "#0A0A0A",
  chart1: "#FF4444",
  chart2: "#C0C0C0",
};

// Humanity palette — warm greens, blues, gold
const HUMANITY_PALETTE: ThemePalette = {
  neonCyan: "#22C55E",
  electricBlue: "#3B82F6",
  orbOrange: "#F59E0B",
  deepPurple: "#06B6D4",
  signalGreen: "#10B981",
  alertRed: "#EF4444",
  brandGradient: "linear-gradient(135deg, #22C55E 0%, #06B6D4 100%)",
  primary: "#22C55E",
  primaryForeground: "#010020",
  accent: "#F59E0B",
  accentForeground: "#010020",
  ring: "#22C55E",
  glassBorder: "rgba(34, 197, 94, 0.2)",
  glassShine: "rgba(34, 197, 94, 0.15)",
  sidebarPrimary: "#22C55E",
  sidebarPrimaryForeground: "#010020",
  chart1: "#22C55E",
  chart2: "#F59E0B",
};

/**
 * Interpolate between two palettes based on intensity (0 = balanced, 1 = full alignment)
 */
function lerpColor(a: string, b: string, t: number): string {
  // Only interpolate hex colors
  if (!a.startsWith("#") || !b.startsWith("#")) return t > 0.5 ? b : a;
  const parseHex = (hex: string) => {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b3 = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b3.toString(16).padStart(2, "0")}`;
}

function interpolatePalette(balanced: ThemePalette, target: ThemePalette, intensity: number): ThemePalette {
  const t = Math.min(1, Math.max(0, intensity));
  return {
    neonCyan: lerpColor(balanced.neonCyan, target.neonCyan, t),
    electricBlue: lerpColor(balanced.electricBlue, target.electricBlue, t),
    orbOrange: lerpColor(balanced.orbOrange, target.orbOrange, t),
    deepPurple: lerpColor(balanced.deepPurple, target.deepPurple, t),
    signalGreen: lerpColor(balanced.signalGreen, target.signalGreen, t),
    alertRed: lerpColor(balanced.alertRed, target.alertRed, t),
    brandGradient: t > 0.3 ? target.brandGradient : balanced.brandGradient,
    primary: lerpColor(balanced.primary, target.primary, t),
    primaryForeground: lerpColor(balanced.primaryForeground, target.primaryForeground, t),
    accent: lerpColor(balanced.accent, target.accent, t),
    accentForeground: lerpColor(balanced.accentForeground, target.accentForeground, t),
    ring: lerpColor(balanced.ring, target.ring, t),
    glassBorder: t > 0.3 ? target.glassBorder : balanced.glassBorder,
    glassShine: t > 0.3 ? target.glassShine : balanced.glassShine,
    sidebarPrimary: lerpColor(balanced.sidebarPrimary, target.sidebarPrimary, t),
    sidebarPrimaryForeground: lerpColor(balanced.sidebarPrimaryForeground, target.sidebarPrimaryForeground, t),
    chart1: lerpColor(balanced.chart1, target.chart1, t),
    chart2: lerpColor(balanced.chart2, target.chart2, t),
  };
}

interface MoralityThemeValue {
  side: "machine" | "humanity" | "balanced";
  level: number;
  intensity: number; // 0-1
  palette: ThemePalette;
  label: string;
}

const MoralityThemeContext = createContext<MoralityThemeValue>({
  side: "balanced",
  level: 1,
  intensity: 0,
  palette: BALANCED_PALETTE,
  label: "Balanced",
});

export function useMoralityTheme() {
  return useContext(MoralityThemeContext);
}

export function MoralityThemeProvider({ children }: { children: ReactNode }) {
  const { state } = useGame();
  const score = state.moralityScore;

  const themeValue = useMemo<MoralityThemeValue>(() => {
    const tier = getMoralityTierDef(score);
    const absScore = Math.abs(score);
    // Intensity ramps from 0 (balanced) to 1 (fully aligned)
    // Starts shifting noticeably at |score| >= 20
    const intensity = absScore < 20 ? 0 : Math.min(1, (absScore - 20) / 80);

    if (tier.side === "machine") {
      const palette = interpolatePalette(BALANCED_PALETTE, MACHINE_PALETTE, intensity);
      return { side: "machine", level: tier.level, intensity, palette, label: tier.label };
    } else if (tier.side === "humanity") {
      const palette = interpolatePalette(BALANCED_PALETTE, HUMANITY_PALETTE, intensity);
      return { side: "humanity", level: tier.level, intensity, palette, label: tier.label };
    }
    return { side: "balanced", level: 1, intensity: 0, palette: BALANCED_PALETTE, label: "Balanced" };
  }, [score]);

  // Apply CSS variable overrides to document root
  useEffect(() => {
    const root = document.documentElement;
    const p = themeValue.palette;

    // Energy spectrum
    root.style.setProperty("--neon-cyan", p.neonCyan);
    root.style.setProperty("--electric-blue", p.electricBlue);
    root.style.setProperty("--orb-orange", p.orbOrange);
    root.style.setProperty("--deep-purple", p.deepPurple);
    root.style.setProperty("--signal-green", p.signalGreen);
    root.style.setProperty("--alert-red", p.alertRed);
    root.style.setProperty("--brand-gradient", p.brandGradient);

    // Theme variables
    root.style.setProperty("--primary", p.primary);
    root.style.setProperty("--primary-foreground", p.primaryForeground);
    root.style.setProperty("--accent", p.accent);
    root.style.setProperty("--accent-foreground", p.accentForeground);
    root.style.setProperty("--ring", p.ring);
    root.style.setProperty("--border", p.glassBorder);
    root.style.setProperty("--sidebar-primary", p.sidebarPrimary);
    root.style.setProperty("--sidebar-primary-foreground", p.sidebarPrimaryForeground);
    root.style.setProperty("--sidebar-border", p.glassBorder);
    root.style.setProperty("--sidebar-ring", p.ring);
    root.style.setProperty("--chart-1", p.chart1);
    root.style.setProperty("--chart-2", p.chart2);

    // Add a data attribute for CSS selectors
    root.dataset.moralityTheme = themeValue.side;
    root.dataset.moralityLevel = String(themeValue.level);

    // Cleanup: restore defaults when unmounting
    return () => {
      root.dataset.moralityTheme = "";
      root.dataset.moralityLevel = "";
    };
  }, [themeValue]);

  return (
    <MoralityThemeContext.Provider value={themeValue}>
      {children}
    </MoralityThemeContext.Provider>
  );
}

export { BALANCED_PALETTE, MACHINE_PALETTE, HUMANITY_PALETTE };
