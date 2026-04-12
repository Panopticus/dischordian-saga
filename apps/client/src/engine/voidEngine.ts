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
  sunk: string;             // Recessed depth: inputs, wells, sidebars
  spotlight: string;         // Ambient lighting for depth perception
  text: string;
  textDim: string;           // Medium-emphasis text (labels, captions)
  textMuted: string;
  primary: string;
  primaryMuted: string;
  secondary: string;         // Supporting accent (charts, secondary actions)
  accent: string;
  success: string;
  error: string;
  premium: string;           // Premium/paid content gold
  system: string;            // System-level UI purple
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
  /** Atmosphere-specific fonts (family strings with fallbacks) */
  fonts: {
    heading: string;
    body: string;
  };
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
/**
 * Active constraint enforcement — not just validation but correction.
 * Immutable physics laws that the engine silently enforces:
 * - Glass + Light is forbidden (glass requires darkness for translucency/glow)
 * - Retro + Light is forbidden (CRT phosphor effects need black canvas)
 */
function enforceGuardrails(physics: PhysicsType, mode: ModeType): { physics: PhysicsType; mode: ModeType } {
  if (physics === "glass" && mode === "light") {
    console.warn("[VoidEngine] Constraint: glass + light forbidden → corrected to flat + light");
    return { physics: "flat", mode: "light" };
  }
  if (physics === "retro" && mode === "light") {
    console.warn("[VoidEngine] Constraint: retro + light forbidden → corrected to retro + dark");
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
  hologram: "glass",          // Elara — translucent, holographic
  substrate: "flat",           // The Human — clean, digital
  comms_signal: "flat",        // Agent Zero, Locke — signal-based
  possessed_system: "retro",   // Source, Shadow Tongue — corrupted, CRT
  temporal_echo: "glass",      // Antiquarian — ethereal, time-shifted
  physical_trace: "flat",      // Physical remnants
  electrical_pattern: "glass", // Voltari — electrical consciousness, pattern-based
  resurrection_echo: "retro",  // Necromancer — dead-frequency broadcasts
  arena_broadcast: "retro",    // Collector Clone-007 — fight-cam aesthetic
  steampunk_ledger: "flat",    // Adjudicator Locke — bureaucratic, physical records
};

export function getPhysicsForNPC(manifestation: string): PhysicsType {
  return NPC_PHYSICS[manifestation] || "flat";
}

/**
 * Map room context to temporary atmosphere.
 */
const ROOM_ATMOSPHERES: Record<string, string> = {
  // ── Ark rooms (actual ship layout) ──
  cryo_bay: "chrome_sentinel",
  medical_bay: "circuit_nexus",
  comms_array: "crimson_forge",
  observation_deck: "celestial_garden",
  captains_quarters: "verdant_growth",
  chaos_forge: "crimson_forge",
  guild_sanctum: "golden_sanctuary",
  oracle_sanctum: "aurora_bloom",
  quantum_lab: "circuit_nexus",
  shadow_vault: "singularity_core",
  social_hub: "golden_sanctuary",
  synthesis_chamber: "circuit_nexus",
  war_room: "industrial_accent",

  // ── Awakening ceremony locations (see shared/levelingAsEvent.ts) ──
  medbay: "circuit_nexus",
  archive: "golden_sanctuary",
  chapel: "crimson_forge",
  bridge: "twilight_equilibrium",
  cathedral: "singularity_core",
  courtroom: "industrial_accent",
  chamber: "aurora_bloom",
  observatory: "celestial_garden",
  cycle_room: "ascendant_light",
  the_garden: "verdant_growth",

  // ── Special event locations ──
  degens_casino: "crimson_forge",          // retro aesthetic, casino neon
  gamemasters_arena: "singularity_core",   // arena broadcast vibe
  violetta: "aurora_bloom",                // Voltari purple-storm planet
  necromancer_sanctum: "singularity_core", // dead-frequency chamber
  the_between: "ascendant_light",          // Ne-Yon liminal space

  // ── Collector's Arena — per arena void atmosphere ──
  arena_new_babylon: "circuit_nexus",       // corrupt trade city, electric purple
  arena_panopticon: "singularity_core",     // surveillance megastructure, crimson CRT
  arena_thaloria: "celestial_garden",       // crystal homeworld, ethereal blue
  arena_terminus: "crimson_forge",          // viral megastructure, blood red
  arena_mechronis: "verdant_growth",        // dark academy, institutional green
  arena_crucible: "industrial_accent",      // gladiatorial, gritty orange-gray
  arena_blood_weave: "crimson_forge",       // organic nightmare, pulsing red
  arena_shadow_sanctum: "aurora_bloom",     // ancient temple, purple mysticism

  // ── Guild Common Rooms — per guild atmosphere ──
  guild_the_chorus: "aurora_bloom",         // orchestral, purple-indigo
  guild_the_eyes: "chrome_sentinel",        // surveillance, cold silver
  guild_the_archive: "golden_sanctuary",    // curator, warm amber
  guild_the_between: "aurora_bloom",        // reality-shifting, purple
  guild_the_influencers: "aurora_bloom",    // trending, pink-purple
  guild_the_yellow_coats: "industrial_accent", // military, tactical gray
  guild_the_congress: "circuit_nexus",      // political, purple-neon
  guild_the_locks: "verdant_growth",        // containment, emerald
  guild_the_grey_gamers: "twilight_equilibrium", // game design, cyan
  guild_the_living: "singularity_core",     // resurrection, dark red
  guild_the_forge: "crimson_forge",         // engineering, hot orange
  guild_the_architects_study: "chrome_sentinel", // detective, cold stone
};

export function getAtmosphereForRoom(roomId: string): string | null {
  return ROOM_ATMOSPHERES[roomId] || null;
}

/* ─── THEME REGISTRY ─── */

/* ─── FONT FAMILIES ───
   Atmosphere-specific font stacks. Each theme gets its own
   typographic personality, matching the upstream void-energy-ui
   font registry pattern. Fonts load from Google Fonts / system. */

const FONTS = {
  tech:      "'Hanken Grotesk', 'Inter', system-ui, sans-serif",
  clean:     "'Inter', system-ui, sans-serif",
  code:      "'Courier Prime', 'Courier New', monospace",
  horror:    "'Merriweather', Georgia, serif",
  nature:    "'Lora', Georgia, serif",
  arcane:    "'Cinzel', 'Times New Roman', serif",
  mystic:    "'Exo 2', 'Inter', sans-serif",
  geometric: "'Poppins', system-ui, sans-serif",
  sharp:     "'Space Grotesk', system-ui, sans-serif",
  display:   "'Playfair Display', Georgia, serif",
  elegant:   "'Raleway', system-ui, sans-serif",
} as const;

const THEMES: Record<string, VoidTheme> = {
  // ── MACHINE SIDE ──
  singularity_core: {
    id: "singularity_core", label: "Singularity Core", mode: "dark", physics: "retro",
    fonts: { heading: FONTS.code, body: FONTS.code },
    palette: {
      canvas: "#050005", surface: "#0a000a", elevated: "#150015",
      sunk: "#020002", spotlight: "#1a0010",
      text: "#ff3040", textDim: "#ff3040b0", textMuted: "#ff304060",
      primary: "#ff0020", primaryMuted: "#ff002040", secondary: "#ff6040",
      accent: "#ff4060", success: "#00ff80", error: "#ff0040",
      premium: "#ff8c00", system: "#ff4080",
      border: "#ff002030", borderSubtle: "#ff002015", glow: "#ff002040",
    },
    particleEffect: "static",
  },
  crimson_forge: {
    id: "crimson_forge", label: "Crimson Forge", mode: "dark", physics: "flat",
    fonts: { heading: FONTS.sharp, body: FONTS.tech },
    palette: {
      canvas: "#0a0205", surface: "#120308", elevated: "#1a050c",
      sunk: "#060103", spotlight: "#200810",
      text: "#ff6070", textDim: "#ff6070b0", textMuted: "#ff607060",
      primary: "#dc2626", primaryMuted: "#dc262640", secondary: "#f87171",
      accent: "#f87171", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#dc262625", borderSubtle: "#dc262612", glow: "#dc262630",
    },
    particleEffect: "embers",
  },
  circuit_nexus: {
    id: "circuit_nexus", label: "Circuit Nexus", mode: "dark", physics: "flat",
    fonts: { heading: FONTS.mystic, body: FONTS.tech },
    palette: {
      canvas: "#050208", surface: "#0a0410", elevated: "#10061a",
      sunk: "#030105", spotlight: "#140818",
      text: "#c084fc", textDim: "#c084fcb0", textMuted: "#c084fc60",
      primary: "#a855f7", primaryMuted: "#a855f740", secondary: "#7c3aed",
      accent: "#c084fc", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#a855f720", borderSubtle: "#a855f710", glow: "#a855f730",
    },
    particleEffect: "sparks",
  },
  chrome_sentinel: {
    id: "chrome_sentinel", label: "Chrome Sentinel", mode: "dark", physics: "glass",
    fonts: { heading: FONTS.sharp, body: FONTS.clean },
    palette: {
      canvas: "#08080c", surface: "#0e0e14", elevated: "#16161e",
      sunk: "#050508", spotlight: "#1a1a24",
      text: "#c0c0c0", textDim: "#c0c0c0b0", textMuted: "#c0c0c060",
      primary: "#94a3b8", primaryMuted: "#94a3b840", secondary: "#64748b",
      accent: "#cbd5e1", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#94a3b820", borderSubtle: "#94a3b810", glow: "#94a3b830",
    },
    particleEffect: "static",
  },
  industrial_accent: {
    id: "industrial_accent", label: "Industrial Accent", mode: "dark", physics: "flat",
    fonts: { heading: FONTS.geometric, body: FONTS.clean },
    palette: {
      canvas: "#0a0a08", surface: "#10100c", elevated: "#181812",
      sunk: "#060604", spotlight: "#1c1c16",
      text: "#b0b090", textDim: "#b0b090b0", textMuted: "#b0b09060",
      primary: "#78716c", primaryMuted: "#78716c40", secondary: "#a8a29e",
      accent: "#a8a29e", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#78716c20", borderSubtle: "#78716c10", glow: "#78716c30",
    },
    particleEffect: "sparks",
  },

  // ── NEUTRAL ──
  twilight_equilibrium: {
    id: "twilight_equilibrium", label: "Twilight Equilibrium", mode: "dark", physics: "glass",
    fonts: { heading: FONTS.elegant, body: FONTS.clean },
    palette: {
      canvas: "#010020", surface: "#060830", elevated: "#0c1040",
      sunk: "#000018", spotlight: "#101448",
      text: "#e2e8f0", textDim: "#e2e8f0b0", textMuted: "#e2e8f060",
      primary: "#33e2e6", primaryMuted: "#33e2e640", secondary: "#06b6d4",
      accent: "#ff8c00", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#33e2e620", borderSubtle: "#33e2e610", glow: "#33e2e630",
    },
    particleEffect: "data",
  },

  // ── HUMANITY SIDE ──
  verdant_growth: {
    id: "verdant_growth", label: "Verdant Growth", mode: "dark", physics: "flat",
    fonts: { heading: FONTS.nature, body: FONTS.clean },
    palette: {
      canvas: "#020a04", surface: "#041208", elevated: "#061a0c",
      sunk: "#010602", spotlight: "#081e10",
      text: "#86efac", textDim: "#86efacb0", textMuted: "#86efac60",
      primary: "#22c55e", primaryMuted: "#22c55e40", secondary: "#16a34a",
      accent: "#4ade80", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#22c55e20", borderSubtle: "#22c55e10", glow: "#22c55e30",
    },
    particleEffect: "leaves",
  },
  golden_sanctuary: {
    id: "golden_sanctuary", label: "Golden Sanctuary", mode: "dark", physics: "glass",
    fonts: { heading: FONTS.display, body: FONTS.nature },
    palette: {
      canvas: "#0a0804", surface: "#121008", elevated: "#1a180c",
      sunk: "#060402", spotlight: "#1e1c10",
      text: "#fde68a", textDim: "#fde68ab0", textMuted: "#fde68a60",
      primary: "#f59e0b", primaryMuted: "#f59e0b40", secondary: "#d97706",
      accent: "#fbbf24", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#f59e0b20", borderSubtle: "#f59e0b10", glow: "#f59e0b30",
    },
    particleEffect: "fireflies",
  },
  aurora_bloom: {
    id: "aurora_bloom", label: "Aurora Bloom", mode: "dark", physics: "glass",
    fonts: { heading: FONTS.arcane, body: FONTS.elegant },
    palette: {
      canvas: "#040208", surface: "#080410", elevated: "#0c0618",
      sunk: "#020105", spotlight: "#10081c",
      text: "#e9d5ff", textDim: "#e9d5ffb0", textMuted: "#e9d5ff60",
      primary: "#c084fc", primaryMuted: "#c084fc40", secondary: "#a855f7",
      accent: "#f0abfc", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#c084fc20", borderSubtle: "#c084fc10", glow: "#c084fc30",
    },
    particleEffect: "fireflies",
  },
  celestial_garden: {
    id: "celestial_garden", label: "Celestial Garden", mode: "dark", physics: "glass",
    fonts: { heading: FONTS.elegant, body: FONTS.clean },
    palette: {
      canvas: "#020408", surface: "#040810", elevated: "#060c18",
      sunk: "#010305", spotlight: "#08101c",
      text: "#bae6fd", textDim: "#bae6fdb0", textMuted: "#bae6fd60",
      primary: "#38bdf8", primaryMuted: "#38bdf840", secondary: "#0ea5e9",
      accent: "#7dd3fc", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#38bdf820", borderSubtle: "#38bdf810", glow: "#38bdf830",
    },
    particleEffect: "fireflies",
  },
  ascendant_light: {
    id: "ascendant_light", label: "Ascendant Light", mode: "dark", physics: "glass",
    fonts: { heading: FONTS.display, body: FONTS.elegant },
    palette: {
      canvas: "#080804", surface: "#101008", elevated: "#18180c",
      sunk: "#040402", spotlight: "#1c1c10",
      text: "#fefce8", textDim: "#fefce8b0", textMuted: "#fefce860",
      primary: "#fbbf24", primaryMuted: "#fbbf2440", secondary: "#f59e0b",
      accent: "#fde68a", success: "#22c55e", error: "#ef4444",
      premium: "#ff8c00", system: "#a078ff",
      border: "#fbbf2420", borderSubtle: "#fbbf2410", glow: "#fbbf2440",
    },
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
/**
 * Apply theme with optional View Transitions API for smooth cross-fade.
 * Falls back to instant application when:
 * - Browser doesn't support View Transitions
 * - User prefers reduced motion
 * - Called during initial boot (no existing atmosphere)
 */
export function applyThemeToDOM(themeId: string): void {
  const theme = THEMES[themeId];
  if (!theme) return;

  const html = document.documentElement;
  const currentAtmosphere = html.getAttribute("data-atmosphere");
  const supportsViewTransitions = typeof document !== "undefined" && "startViewTransition" in document;
  const prefersReducedMotion = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Use View Transitions for atmosphere changes (not initial boot)
  if (supportsViewTransitions && currentAtmosphere && currentAtmosphere !== themeId && !prefersReducedMotion) {
    (document as any).startViewTransition(() => applyThemeToDOM_inner(theme, html));
    return;
  }

  applyThemeToDOM_inner(theme, html);
}

function applyThemeToDOM_inner(theme: VoidTheme, html: HTMLElement): void {
  const { physics, mode } = enforceGuardrails(theme.physics, theme.mode);

  // Set triad attributes (also persist for anti-FOUC bootloader)
  html.setAttribute("data-atmosphere", theme.id);
  html.setAttribute("data-physics", physics);
  html.setAttribute("data-mode", mode);
  try {
    localStorage.setItem("ve-atmosphere", theme.id);
    localStorage.setItem("ve-physics", physics);
    localStorage.setItem("ve-mode", mode);
  } catch { /* storage full or blocked */ }

  // Inject palette as CSS custom properties
  const p = theme.palette;
  html.style.setProperty("--void-canvas", p.canvas);
  html.style.setProperty("--void-surface", p.surface);
  html.style.setProperty("--void-elevated", p.elevated);
  html.style.setProperty("--void-sunk", p.sunk);
  html.style.setProperty("--void-spotlight", p.spotlight);
  html.style.setProperty("--void-text", p.text);
  html.style.setProperty("--void-text-dim", p.textDim);
  html.style.setProperty("--void-text-muted", p.textMuted);
  html.style.setProperty("--void-primary", p.primary);
  html.style.setProperty("--void-primary-muted", p.primaryMuted);
  html.style.setProperty("--void-secondary", p.secondary);
  html.style.setProperty("--void-accent", p.accent);
  html.style.setProperty("--void-success", p.success);
  html.style.setProperty("--void-error", p.error);
  html.style.setProperty("--void-premium", p.premium);
  html.style.setProperty("--void-system", p.system);
  html.style.setProperty("--void-border", p.border);
  html.style.setProperty("--void-border-subtle", p.borderSubtle);
  html.style.setProperty("--void-glow", p.glow);

  // Inject atmosphere-specific fonts
  html.style.setProperty("--void-font-heading", theme.fonts.heading);
  html.style.setProperty("--void-font-body", theme.fonts.body);

  // Physics-specific properties are handled by void-materials.css
  // (consolidated from the old void-physics.css + void-materials.css).
  // The CSS file owns material behavior — computed shadows, blur,
  // radius, border-style, transitions, scrollbars, depth tiers.
  // We only set the triad attributes + palette variables here.

  // Remove any stale inline physics overrides from old system
  html.style.removeProperty("--void-blur");
  html.style.removeProperty("--void-radius");
  html.style.removeProperty("--void-surface-opacity");
  html.style.removeProperty("--void-border-style");

  // Animation speeds — kept as CSS vars for components that need them
  const speeds = physics === "glass" ? { fast: "150ms", base: "300ms", slow: "500ms" } :
                 physics === "retro" ? { fast: "0ms", base: "0ms", slow: "50ms" } :
                 { fast: "100ms", base: "200ms", slow: "350ms" };
  html.style.setProperty("--void-speed-fast", speeds.fast);
  html.style.setProperty("--void-speed-base", speeds.base);
  html.style.setProperty("--void-speed-slow", speeds.slow);

  // Density (persisted from user preference)
  const density = localStorage.getItem("ve-density") || "standard";
  html.setAttribute("data-density", density);
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

/* ─── NARRATIVE EVENT ATMOSPHERES ─── */

/**
 * Atmospheres for major narrative events. Pushed temporarily
 * during the event, popped when it ends.
 */
const EVENT_ATMOSPHERES: Record<string, string> = {
  // Awakening thresholds (see shared/levelingAsEvent.ts)
  awakening_quiet: "twilight_equilibrium",
  awakening_milestone: "aurora_bloom",
  awakening_witnessed: "golden_sanctuary",
  awakening_threshold: "ascendant_light",

  // Death / resurrection
  player_death: "singularity_core",
  resurrection: "ascendant_light",

  // Special moments
  voltari_contact: "aurora_bloom",
  necromancer_revival: "singularity_core",
  virus_encounter: "crimson_forge",
  cutscene_finale: "ascendant_light",
};

export function getAtmosphereForEvent(eventId: string): string | null {
  return EVENT_ATMOSPHERES[eventId] || null;
}

/**
 * Convenience helper for narrative events: push an atmosphere and
 * get back a disposer function. Call the disposer when the event ends.
 *
 *   const dispose = pushEventAtmosphere("awakening_threshold", "Level 25");
 *   // ...ceremony plays...
 *   dispose();
 */
export function pushEventAtmosphere(eventId: string, label: string = ""): () => void {
  const themeId = EVENT_ATMOSPHERES[eventId];
  if (!themeId) return () => {};
  const handle = pushTemporaryTheme(themeId, label || eventId);
  return () => {
    // Only pop if this is still the top of the stack
    if (_themeStack.length > 0 && _themeStack.length - 1 === handle) {
      popTemporaryTheme();
    }
  };
}
