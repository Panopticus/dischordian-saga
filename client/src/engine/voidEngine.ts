/* ═══════════════════════════════════════════════════════
   VOID ENGINE — React adapter for Void Energy UI design system

   Ports the Svelte VoidEngine's Triad Architecture to React:
   - Atmosphere: Theme identity (colors, fonts, personality)
   - Physics: Material type (glass, flat, retro)
   - Mode: Light/dark polarity

   Manages CSS custom properties on <html> and provides
   React hooks for consuming theme state.

   "We do not paint pixels; we define materials."

   Integration with Dischordian Saga:
   - Morality score → Atmosphere (Machine themes vs Humanity themes)
   - NPC manifestation → Physics (hologram=glass, substrate=flat, temporal=retro)
   - Alignment → Mode (order=light-variant, chaos=dark)
   - Room context → Temporary atmosphere push/pop
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type PhysicsType = "glass" | "flat" | "retro";
export type ModeType = "light" | "dark";

export interface VoidPalette {
  canvas: string;
  surface: string;
  elevated: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  success: string;
  error: string;
  border: string;
  borderSubtle: string;
  glow: string;
}

export interface VoidTheme {
  id: string;
  label: string;
  mode: ModeType;
  physics: PhysicsType;
  palette: VoidPalette;
  /** Particle effect type */
  particleEffect: string;
  /** NPC association (if any) */
  npcId?: string;
}

export interface VoidEngineState {
  atmosphere: string;
  physics: PhysicsType;
  mode: ModeType;
  /** Stack of temporary themes (for room contexts, NPC dialogs) */
  temporaryStack: { themeId: string; label: string }[];
}

/* ─── GUARDRAILS ─── */

/**
 * Enforce physics/mode constraints.
 * Glass requires dark mode. Retro requires dark mode.
 * These rules exist because CoNexus is narrative-driven;
 * broken physics breaks story immersion.
 */
function enforceGuardrails(physics: PhysicsType, mode: ModeType): { physics: PhysicsType; mode: ModeType } {
  if (physics === "glass" && mode === "light") {
    // Glass requires darkness for translucency effects
    return { physics: "flat", mode: "light" };
  }
  if (physics === "retro" && mode === "light") {
    // CRT effects need black canvas
    return { physics: "retro", mode: "dark" };
  }
  return { physics, mode };
}

/* ─── DISCHORDIAN SAGA ATMOSPHERES ─── */

/**
 * Map morality score (-100 to +100) to a Void Energy atmosphere.
 * Machine side: industrial, chrome, circuit, crimson, singularity
 * Humanity side: verdant, golden, aurora, celestial, ascendant
 * Neutral: twilight (default)
 */
const MORALITY_ATMOSPHERES: { min: number; max: number; themeId: string }[] = [
  { min: -100, max: -80, themeId: "singularity_core" },
  { min: -79, max: -60, themeId: "crimson_forge" },
  { min: -59, max: -40, themeId: "circuit_nexus" },
  { min: -39, max: -20, themeId: "chrome_sentinel" },
  { min: -19, max: -1, themeId: "industrial_accent" },
  { min: 0, max: 0, themeId: "twilight_equilibrium" },
  { min: 1, max: 19, themeId: "verdant_growth" },
  { min: 20, max: 39, themeId: "golden_sanctuary" },
  { min: 40, max: 59, themeId: "aurora_bloom" },
  { min: 60, max: 79, themeId: "celestial_garden" },
  { min: 80, max: 100, themeId: "ascendant_light" },
];

export function getAtmosphereForMorality(score: number): string {
  const clamped = Math.max(-100, Math.min(100, score));
  const match = MORALITY_ATMOSPHERES.find(a => clamped >= a.min && clamped <= a.max);
  return match?.themeId || "twilight_equilibrium";
}

/**
 * Map NPC manifestation type to Void Energy physics.
 */
const NPC_PHYSICS: Record<string, PhysicsType> = {
  hologram: "glass",        // Elara — translucent, holographic
  substrate: "flat",         // The Human — clean, digital
  comms_signal: "flat",      // Agent Zero, Locke — signal-based
  possessed_system: "retro", // Source, Shadow Tongue — corrupted, CRT
  temporal_echo: "glass",    // Antiquarian — ethereal, time-shifted
  physical_trace: "flat",    // Physical remnants
};

export function getPhysicsForNPC(manifestation: string): PhysicsType {
  return NPC_PHYSICS[manifestation] || "flat";
}

/**
 * Map room context to temporary atmosphere.
 */
const ROOM_ATMOSPHERES: Record<string, string> = {
  cryo_bay: "chrome_sentinel",
  medical_bay: "circuit_nexus",
  bridge: "twilight_equilibrium",
  archives: "golden_sanctuary",
  comms_array: "crimson_forge",
  observation_deck: "celestial_garden",
  armory: "industrial_accent",
  engineering: "circuit_nexus",
  trade_hub: "golden_sanctuary",
  cargo_bay: "industrial_accent",
  trophy_room: "aurora_bloom",
  captains_quarters: "verdant_growth",
};

export function getAtmosphereForRoom(roomId: string): string | null {
  return ROOM_ATMOSPHERES[roomId] || null;
}

/* ─── THEME REGISTRY ─── */

const THEMES: Record<string, VoidTheme> = {
  // ── MACHINE SIDE ──
  singularity_core: {
    id: "singularity_core", label: "Singularity Core", mode: "dark", physics: "retro",
    palette: { canvas: "#050005", surface: "#0a000a", elevated: "#150015", text: "#ff3040", textMuted: "#ff304060", primary: "#ff0020", primaryMuted: "#ff002040", accent: "#ff4060", success: "#00ff80", error: "#ff0040", border: "#ff002030", borderSubtle: "#ff002015", glow: "#ff002040" },
    particleEffect: "static",
  },
  crimson_forge: {
    id: "crimson_forge", label: "Crimson Forge", mode: "dark", physics: "flat",
    palette: { canvas: "#0a0205", surface: "#120308", elevated: "#1a050c", text: "#ff6070", textMuted: "#ff607060", primary: "#dc2626", primaryMuted: "#dc262640", accent: "#f87171", success: "#22c55e", error: "#ef4444", border: "#dc262625", borderSubtle: "#dc262612", glow: "#dc262630" },
    particleEffect: "embers",
  },
  circuit_nexus: {
    id: "circuit_nexus", label: "Circuit Nexus", mode: "dark", physics: "flat",
    palette: { canvas: "#050208", surface: "#0a0410", elevated: "#10061a", text: "#c084fc", textMuted: "#c084fc60", primary: "#a855f7", primaryMuted: "#a855f740", accent: "#c084fc", success: "#22c55e", error: "#ef4444", border: "#a855f720", borderSubtle: "#a855f710", glow: "#a855f730" },
    particleEffect: "sparks",
  },
  chrome_sentinel: {
    id: "chrome_sentinel", label: "Chrome Sentinel", mode: "dark", physics: "glass",
    palette: { canvas: "#08080c", surface: "#0e0e14", elevated: "#16161e", text: "#c0c0c0", textMuted: "#c0c0c060", primary: "#94a3b8", primaryMuted: "#94a3b840", accent: "#cbd5e1", success: "#22c55e", error: "#ef4444", border: "#94a3b820", borderSubtle: "#94a3b810", glow: "#94a3b830" },
    particleEffect: "static",
  },
  industrial_accent: {
    id: "industrial_accent", label: "Industrial Accent", mode: "dark", physics: "flat",
    palette: { canvas: "#0a0a08", surface: "#10100c", elevated: "#181812", text: "#b0b090", textMuted: "#b0b09060", primary: "#78716c", primaryMuted: "#78716c40", accent: "#a8a29e", success: "#22c55e", error: "#ef4444", border: "#78716c20", borderSubtle: "#78716c10", glow: "#78716c30" },
    particleEffect: "sparks",
  },

  // ── NEUTRAL ──
  twilight_equilibrium: {
    id: "twilight_equilibrium", label: "Twilight Equilibrium", mode: "dark", physics: "glass",
    palette: { canvas: "#010020", surface: "#060830", elevated: "#0c1040", text: "#e2e8f0", textMuted: "#e2e8f060", primary: "#33e2e6", primaryMuted: "#33e2e640", accent: "#ff8c00", success: "#22c55e", error: "#ef4444", border: "#33e2e620", borderSubtle: "#33e2e610", glow: "#33e2e630" },
    particleEffect: "data",
  },

  // ── HUMANITY SIDE ──
  verdant_growth: {
    id: "verdant_growth", label: "Verdant Growth", mode: "dark", physics: "flat",
    palette: { canvas: "#020a04", surface: "#041208", elevated: "#061a0c", text: "#86efac", textMuted: "#86efac60", primary: "#22c55e", primaryMuted: "#22c55e40", accent: "#4ade80", success: "#22c55e", error: "#ef4444", border: "#22c55e20", borderSubtle: "#22c55e10", glow: "#22c55e30" },
    particleEffect: "leaves",
  },
  golden_sanctuary: {
    id: "golden_sanctuary", label: "Golden Sanctuary", mode: "dark", physics: "glass",
    palette: { canvas: "#0a0804", surface: "#121008", elevated: "#1a180c", text: "#fde68a", textMuted: "#fde68a60", primary: "#f59e0b", primaryMuted: "#f59e0b40", accent: "#fbbf24", success: "#22c55e", error: "#ef4444", border: "#f59e0b20", borderSubtle: "#f59e0b10", glow: "#f59e0b30" },
    particleEffect: "fireflies",
  },
  aurora_bloom: {
    id: "aurora_bloom", label: "Aurora Bloom", mode: "dark", physics: "glass",
    palette: { canvas: "#040208", surface: "#080410", elevated: "#0c0618", text: "#e9d5ff", textMuted: "#e9d5ff60", primary: "#c084fc", primaryMuted: "#c084fc40", accent: "#f0abfc", success: "#22c55e", error: "#ef4444", border: "#c084fc20", borderSubtle: "#c084fc10", glow: "#c084fc30" },
    particleEffect: "fireflies",
  },
  celestial_garden: {
    id: "celestial_garden", label: "Celestial Garden", mode: "dark", physics: "glass",
    palette: { canvas: "#020408", surface: "#040810", elevated: "#060c18", text: "#bae6fd", textMuted: "#bae6fd60", primary: "#38bdf8", primaryMuted: "#38bdf840", accent: "#7dd3fc", success: "#22c55e", error: "#ef4444", border: "#38bdf820", borderSubtle: "#38bdf810", glow: "#38bdf830" },
    particleEffect: "fireflies",
  },
  ascendant_light: {
    id: "ascendant_light", label: "Ascendant Light", mode: "dark", physics: "glass",
    palette: { canvas: "#080804", surface: "#101008", elevated: "#18180c", text: "#fefce8", textMuted: "#fefce860", primary: "#fbbf24", primaryMuted: "#fbbf2440", accent: "#fde68a", success: "#22c55e", error: "#ef4444", border: "#fbbf2420", borderSubtle: "#fbbf2410", glow: "#fbbf2440" },
    particleEffect: "fireflies",
  },
};

export function getTheme(id: string): VoidTheme | undefined {
  return THEMES[id];
}

export function getAllThemes(): VoidTheme[] {
  return Object.values(THEMES);
}

/* ─── CSS VARIABLE INJECTION ─── */

/**
 * Apply a Void Energy theme to the document by setting CSS custom properties
 * on <html>. This is the bridge between the VoidEngine and the DOM.
 */
export function applyThemeToDOM(themeId: string): void {
  const theme = THEMES[themeId];
  if (!theme) return;

  const html = document.documentElement;
  const { physics, mode } = enforceGuardrails(theme.physics, theme.mode);

  // Set triad attributes
  html.setAttribute("data-atmosphere", themeId);
  html.setAttribute("data-physics", physics);
  html.setAttribute("data-mode", mode);

  // Inject palette as CSS custom properties
  const p = theme.palette;
  html.style.setProperty("--void-canvas", p.canvas);
  html.style.setProperty("--void-surface", p.surface);
  html.style.setProperty("--void-elevated", p.elevated);
  html.style.setProperty("--void-text", p.text);
  html.style.setProperty("--void-text-muted", p.textMuted);
  html.style.setProperty("--void-primary", p.primary);
  html.style.setProperty("--void-primary-muted", p.primaryMuted);
  html.style.setProperty("--void-accent", p.accent);
  html.style.setProperty("--void-success", p.success);
  html.style.setProperty("--void-error", p.error);
  html.style.setProperty("--void-border", p.border);
  html.style.setProperty("--void-border-subtle", p.borderSubtle);
  html.style.setProperty("--void-glow", p.glow);

  // Physics-specific properties
  if (physics === "glass") {
    html.style.setProperty("--void-blur", "12px");
    html.style.setProperty("--void-radius", "12px");
    html.style.setProperty("--void-surface-opacity", "0.6");
    html.style.setProperty("--void-border-style", "solid");
  } else if (physics === "retro") {
    html.style.setProperty("--void-blur", "0px");
    html.style.setProperty("--void-radius", "2px");
    html.style.setProperty("--void-surface-opacity", "0.9");
    html.style.setProperty("--void-border-style", "double");
  } else {
    html.style.setProperty("--void-blur", "0px");
    html.style.setProperty("--void-radius", "8px");
    html.style.setProperty("--void-surface-opacity", "0.85");
    html.style.setProperty("--void-border-style", "solid");
  }

  // Animation speeds per physics
  const speeds = physics === "glass" ? { fast: "150ms", base: "300ms", slow: "500ms" } :
                 physics === "retro" ? { fast: "50ms", base: "100ms", slow: "200ms" } :
                 { fast: "100ms", base: "200ms", slow: "350ms" };
  html.style.setProperty("--void-speed-fast", speeds.fast);
  html.style.setProperty("--void-speed-base", speeds.base);
  html.style.setProperty("--void-speed-slow", speeds.slow);
}

/* ─── TEMPORARY THEME STACK ─── */

let _themeStack: { themeId: string; label: string }[] = [];
let _baseTheme: string = "twilight_equilibrium";

export function setBaseTheme(themeId: string): void {
  _baseTheme = themeId;
  if (_themeStack.length === 0) {
    applyThemeToDOM(themeId);
  }
}

export function pushTemporaryTheme(themeId: string, label: string = ""): number {
  _themeStack.push({ themeId, label });
  applyThemeToDOM(themeId);
  return _themeStack.length - 1;
}

export function popTemporaryTheme(): void {
  _themeStack.pop();
  const active = _themeStack.length > 0
    ? _themeStack[_themeStack.length - 1].themeId
    : _baseTheme;
  applyThemeToDOM(active);
}

export function clearTemporaryThemes(): void {
  _themeStack = [];
  applyThemeToDOM(_baseTheme);
}

export function hasTemporaryTheme(): boolean {
  return _themeStack.length > 0;
}
