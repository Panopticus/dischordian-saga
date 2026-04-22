import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   TITLE-SCREEN THEME RESOLVER

   The title screen renders an act- and alignment-aware
   keyart + palette instead of a static background. This
   module owns the resolution logic so renderers can stay
   pure.

   Selection priority (first match wins):
     1. Unauthenticated viewer       → `unauth`
     2. phase === "FIRST_VISIT"      → `preludeVoid`
     3. narrativeAct >= 3 && dark    → `machineAscendant`
     4. narrativeAct >= 3 && light   → `humanityRising`
     5. byAct[narrativeAct] if set   → that theme
     6. Fallback                     → `preludeVoid`

   Art paths point at WebP exports of the AAA concept art
   prompts. When an asset is missing on disk the renderer
   falls back to the existing `title-bg.png` — no code
   change needed to ship themes incrementally.
   ═══════════════════════════════════════════════════════ */

export interface TitleTheme {
  id: string;
  /** Relative URL to the 16:9 background render. */
  artUrl: string;
  /** CSS color tokens layered onto the vignette + scanlines. */
  palette: {
    void: string;       // deepest background tint
    accent: string;     // dominant glow (cyan / red / green)
    warm: string;       // warm highlight (amber / gold)
    alarm?: string;     // optional — used for alignment=dark overrides
  };
  /** Eyebrow/ticker tone: "cool" / "warm" / "alarm" / "archive". */
  mood: "cool" | "warm" | "alarm" | "archive" | "transcendent";
  /** Human label for debug/overlay. */
  label: string;
}

/* ─── Palette + art per theme ─── */

const PRELUDE_VOID: TitleTheme = {
  id: "preludeVoid",
  artUrl: assetUrl("art/ui/title/preludeVoid.webp"),
  palette: { void: "#010020", accent: "#33E2E6", warm: "#A078FF" },
  mood: "cool",
  label: "Prelude — Cryo Drift",
};

const UNAUTH: TitleTheme = {
  ...PRELUDE_VOID,
  id: "unauth",
  label: "Handshake Required",
};

const HUMANITY_RISING: TitleTheme = {
  id: "humanityRising",
  artUrl: assetUrl("art/ui/title/humanityRising.webp"),
  palette: { void: "#0a1810", accent: "#22C55E", warm: "#F59E0B" },
  mood: "warm",
  label: "Humanity Rising",
};

const MACHINE_ASCENDANT: TitleTheme = {
  id: "machineAscendant",
  artUrl: assetUrl("art/ui/title/machineAscendant.webp"),
  palette: { void: "#0d0405", accent: "#FF3C40", warm: "#C0C0C0", alarm: "#FF3C40" },
  mood: "alarm",
  label: "Machine Ascendant",
};

/* ─── Act baselines (Act 0 = Prelude; Act 7 = Singularity) ─── */

const ACT_ONE: TitleTheme = {
  id: "actOne_kindergarten",
  artUrl: assetUrl("art/ui/title/actOne_kindergarten.webp"),
  palette: { void: "#2a1410", accent: "#4BA3B5", warm: "#B5563C" },
  mood: "warm",
  label: "Act 1 — The Twelve Steps",
};

const ACT_TWO: TitleTheme = {
  id: "actTwo_workshop",
  artUrl: assetUrl("art/ui/title/actTwo_workshop.webp"),
  palette: { void: "#0c0a14", accent: "#33E2E6", warm: "#F59E0B" },
  mood: "warm",
  label: "Act 2 — The Engineer's Bench",
};

const ACT_THREE: TitleTheme = {
  id: "actThree_dossier",
  artUrl: assetUrl("art/ui/title/actThree_dossier.webp"),
  palette: { void: "#100608", accent: "#FF3C40", warm: "#D4A574" },
  mood: "alarm",
  label: "Act 3 — Eyes in the Dark",
};

const ACT_FOUR: TitleTheme = {
  id: "actFour_cell",
  artUrl: assetUrl("art/ui/title/actFour_cell.webp"),
  palette: { void: "#050608", accent: "#FF3C40", warm: "#E8F4F8" },
  mood: "alarm",
  label: "Act 4 — The Prisoner",
};

const ACT_FIVE: TitleTheme = {
  id: "actFive_terminus",
  artUrl: assetUrl("art/ui/title/actFive_terminus.webp"),
  palette: { void: "#050010", accent: "#FF3C40", warm: "#F59E0B", alarm: "#22C55E" },
  mood: "transcendent",
  label: "Act 5 — The Reckoning",
};

const ACT_SIX: TitleTheme = {
  id: "actSix_archive",
  artUrl: assetUrl("art/ui/title/actSix_archive.webp"),
  palette: { void: "#010020", accent: "#33E2E6", warm: "#A078FF" },
  mood: "archive",
  label: "Act 6 — The Hidden Ledger",
};

const ACT_SEVEN: TitleTheme = {
  id: "actSeven_singularity",
  artUrl: assetUrl("art/ui/title/actSeven_singularity.webp"),
  palette: { void: "#010020", accent: "#FFFFFF", warm: "#F59E0B", alarm: "#FF3C40" },
  mood: "transcendent",
  label: "Act 7 — The Reckoning's End",
};

const BY_ACT: Record<number, TitleTheme> = {
  0: PRELUDE_VOID,
  1: ACT_ONE,
  2: ACT_TWO,
  3: ACT_THREE,
  4: ACT_FOUR,
  5: ACT_FIVE,
  6: ACT_SIX,
  7: ACT_SEVEN,
};

export const THEMES = {
  unauth: UNAUTH,
  preludeVoid: PRELUDE_VOID,
  humanityRising: HUMANITY_RISING,
  machineAscendant: MACHINE_ASCENDANT,
  byAct: BY_ACT,
};

/* ─── Resolver ─── */

interface ResolverInputs {
  isAuthenticated: boolean;
  phase: string | null | undefined;
  narrativeAct: number;
  lightDarkAlignment: "light" | "dark" | null;
}

export function resolveTitleTheme(inputs: ResolverInputs): TitleTheme {
  if (!inputs.isAuthenticated) return UNAUTH;
  if (inputs.phase === "FIRST_VISIT") return PRELUDE_VOID;

  if (inputs.narrativeAct >= 3 && inputs.lightDarkAlignment === "dark") {
    return MACHINE_ASCENDANT;
  }
  if (inputs.narrativeAct >= 3 && inputs.lightDarkAlignment === "light") {
    return HUMANITY_RISING;
  }

  return BY_ACT[inputs.narrativeAct] ?? PRELUDE_VOID;
}
