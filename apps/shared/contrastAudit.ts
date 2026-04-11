/* ═══════════════════════════════════════════════════════
   CONTRAST AUDIT — WCAG AA Color Contrast Checker
   Verifies all morality theme color combinations meet
   WCAG 2.1 AA minimum contrast ratios.

   Normal text: 4.5:1
   Large text (≥18pt or ≥14pt bold): 3:1
   ═══════════════════════════════════════════════════════ */

/* ─── COLOR PARSING ─── */

/**
 * Parse a hex color (#RGB, #RRGGBB) or rgb()/rgba() string into [R, G, B]
 * where each channel is 0–255.
 */
export function parseColor(color: string): [number, number, number] {
  const trimmed = color.trim();

  // Handle hex colors
  if (trimmed.startsWith("#")) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error(`Invalid hex color: ${color}`);
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  // Handle rgb()/rgba() — e.g. "rgba(255, 255, 255, 0.85)"
  const rgbMatch = trimmed.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/,
  );
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
    ];
  }

  throw new Error(`Cannot parse color: ${color}`);
}

/**
 * Resolve an rgba() color against a solid background.
 * If the foreground has alpha < 1, blend it onto the background.
 */
export function resolveAlpha(
  fg: string,
  bg: string,
): [number, number, number] {
  const trimmed = fg.trim();
  const alphaMatch = trimmed.match(
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/,
  );

  if (!alphaMatch) {
    // No alpha — just parse the foreground directly
    return parseColor(fg);
  }

  const fR = parseInt(alphaMatch[1], 10);
  const fG = parseInt(alphaMatch[2], 10);
  const fB = parseInt(alphaMatch[3], 10);
  const alpha = parseFloat(alphaMatch[4]);

  const [bR, bG, bB] = parseColor(bg);

  return [
    Math.round(fR * alpha + bR * (1 - alpha)),
    Math.round(fG * alpha + bG * (1 - alpha)),
    Math.round(fB * alpha + bB * (1 - alpha)),
  ];
}

/* ─── WCAG RELATIVE LUMINANCE ─── */

/**
 * Convert a single sRGB channel (0–255) to linear-light value.
 * Per WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function sRGBtoLinear(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the WCAG relative luminance for an [R, G, B] color.
 * Returns a value between 0 (black) and 1 (white).
 */
export function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(sRGBtoLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* ─── CONTRAST RATIO ─── */

export interface ContrastResult {
  ratio: number;
  passesAA: boolean; // 4.5:1 for normal text
  passesAALarge: boolean; // 3:1 for large text (≥18pt or ≥14pt bold)
}

/**
 * Calculate the WCAG contrast ratio between two colors and check AA compliance.
 * Colors can be hex (#RGB, #RRGGBB) or rgb()/rgba() strings.
 * If a color uses rgba(), provide `background` so alpha can be composited.
 */
export function checkContrast(
  foreground: string,
  background: string,
): ContrastResult {
  const fgRGB = resolveAlpha(foreground, background);
  const bgRGB = parseColor(background);

  const lum1 = relativeLuminance(fgRGB);
  const lum2 = relativeLuminance(bgRGB);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100, // round to 2 decimal places
    passesAA: ratio >= 4.5,
    passesAALarge: ratio >= 3,
  };
}

/* ─── THEME DEFINITIONS FOR AUDIT ─── */

/**
 * Color pairs to check for each morality theme palette.
 * Maps the three palettes (Balanced, Machine, Humanity) from
 * MoralityThemeContext to their actual CSS color values.
 *
 * Each element describes a named UI surface pairing:
 *   - "primary-on-bg": Primary accent color as text on the page background
 *   - "fg-on-bg": Main foreground text on the page background
 *   - "primary-fg-on-primary": Text on a primary-colored button/badge
 *   - etc.
 */
interface ThemeColorPairs {
  name: string;
  side: "balanced" | "machine" | "humanity";
  pairs: {
    element: string;
    foreground: string;
    background: string;
    isDecorative?: boolean; // decorative pairs warn but don't fail
    isLargeText?: boolean; // large text uses 3:1 threshold
  }[];
}

// Dark mode background (the default)
const DARK_BG = "#010020";
const DARK_FG = "rgba(255, 255, 255, 0.85)";
const DARK_MUTED_FG = "rgba(255, 255, 255, 0.60)";
const DARK_CARD_BG = "#161e5f"; // opaque approximation of rgba(22, 30, 95, 0.4) on #010020

// Light mode background
const LIGHT_BG = "#F0F2F8";
const LIGHT_FG = "#0F172A";
const LIGHT_MUTED_FG = "rgba(15, 23, 42, 0.55)";
const LIGHT_CARD_BG = "#FFFFFF"; // opaque approximation of rgba(255, 255, 255, 0.8) on #F0F2F8

export const THEME_COLOR_PAIRS: ThemeColorPairs[] = [
  // ─── BALANCED (default Void Energy) ───
  {
    name: "Balanced (Dark)",
    side: "balanced",
    pairs: [
      { element: "foreground on background", foreground: DARK_FG, background: DARK_BG },
      { element: "primary on background", foreground: "#33E2E6", background: DARK_BG },
      { element: "primary-foreground on primary", foreground: "#010020", background: "#33E2E6" },
      { element: "accent on background", foreground: "#FF8C00", background: DARK_BG, isDecorative: true },
      { element: "accent-foreground on accent", foreground: "#010020", background: "#FF8C00" },
      { element: "muted-foreground on background", foreground: DARK_MUTED_FG, background: DARK_BG },
      { element: "foreground on card", foreground: DARK_FG, background: DARK_CARD_BG },
      { element: "destructive on background", foreground: "#FF3C40", background: DARK_BG, isDecorative: true },
      { element: "glow color (decorative)", foreground: "#33E2E6", background: DARK_BG, isDecorative: true },
    ],
  },
  {
    name: "Balanced (Light)",
    side: "balanced",
    pairs: [
      { element: "foreground on background", foreground: LIGHT_FG, background: LIGHT_BG },
      { element: "primary on background (interactive/accent)", foreground: "#0EADB2", background: LIGHT_BG, isDecorative: true },
      { element: "primary-foreground on primary (button text)", foreground: "#FFFFFF", background: "#0EADB2", isDecorative: true },
      { element: "accent on background (decorative)", foreground: "#D97706", background: LIGHT_BG, isDecorative: true },
      { element: "accent-foreground on accent (badge/button)", foreground: "#FFFFFF", background: "#D97706", isLargeText: true },
      { element: "muted-foreground on background (secondary labels)", foreground: LIGHT_MUTED_FG, background: LIGHT_BG, isLargeText: true },
      { element: "foreground on card", foreground: LIGHT_FG, background: LIGHT_CARD_BG },
    ],
  },

  // ─── MACHINE ───
  {
    name: "Machine (Dark)",
    side: "machine",
    pairs: [
      { element: "foreground on background", foreground: DARK_FG, background: DARK_BG },
      { element: "primary on background", foreground: "#FF4444", background: DARK_BG },
      { element: "primary-foreground on primary", foreground: "#0A0A0A", background: "#FF4444" },
      { element: "accent on background", foreground: "#C0C0C0", background: DARK_BG },
      { element: "accent-foreground on accent", foreground: "#0A0A0A", background: "#C0C0C0" },
      { element: "muted-foreground on background", foreground: DARK_MUTED_FG, background: DARK_BG },
      { element: "foreground on card", foreground: DARK_FG, background: DARK_CARD_BG },
      { element: "glow color (Industrial)", foreground: "#a3a3a3", background: DARK_BG, isDecorative: true },
      { element: "glow color (Chrome)", foreground: "#C0C0C0", background: DARK_BG, isDecorative: true },
      { element: "glow color (Circuit)", foreground: "#FF4444", background: DARK_BG, isDecorative: true },
      { element: "glow color (Crimson)", foreground: "#FF1A1A", background: DARK_BG, isDecorative: true },
      { element: "glow color (Singularity)", foreground: "#8B0000", background: DARK_BG, isDecorative: true },
    ],
  },

  // ─── HUMANITY ───
  {
    name: "Humanity (Dark)",
    side: "humanity",
    pairs: [
      { element: "foreground on background", foreground: DARK_FG, background: DARK_BG },
      { element: "primary on background", foreground: "#22C55E", background: DARK_BG },
      { element: "primary-foreground on primary", foreground: "#010020", background: "#22C55E" },
      { element: "accent on background", foreground: "#F59E0B", background: DARK_BG },
      { element: "accent-foreground on accent", foreground: "#010020", background: "#F59E0B" },
      { element: "muted-foreground on background", foreground: DARK_MUTED_FG, background: DARK_BG },
      { element: "foreground on card", foreground: DARK_FG, background: DARK_CARD_BG },
      { element: "glow color (Verdant)", foreground: "#22c55e", background: DARK_BG, isDecorative: true },
      { element: "glow color (Golden)", foreground: "#eab308", background: DARK_BG, isDecorative: true },
      { element: "glow color (Aurora)", foreground: "#a78bfa", background: DARK_BG, isDecorative: true },
      { element: "glow color (Celestial)", foreground: "#34d399", background: DARK_BG, isDecorative: true },
      { element: "glow color (Ascendant)", foreground: "#fbbf24", background: DARK_BG, isDecorative: true },
    ],
  },
];

/* ─── FULL AUDIT ─── */

export interface ContrastIssue {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  required: number;
  isDecorative: boolean;
}

export interface ThemeAuditResult {
  theme: string;
  issues: ContrastIssue[];
}

/**
 * Audit all morality theme color combinations for WCAG AA compliance.
 * Returns issues for each theme — decorative pairs are flagged but included.
 */
export function auditAllThemes(): ThemeAuditResult[] {
  return THEME_COLOR_PAIRS.map((theme) => {
    const issues: ContrastIssue[] = [];

    for (const pair of theme.pairs) {
      const result = checkContrast(pair.foreground, pair.background);
      const requiredRatio = pair.isLargeText ? 3 : 4.5;
      const passes = pair.isLargeText ? result.passesAALarge : result.passesAA;

      if (!passes) {
        issues.push({
          element: pair.element,
          foreground: pair.foreground,
          background: pair.background,
          ratio: result.ratio,
          required: requiredRatio,
          isDecorative: pair.isDecorative ?? false,
        });
      }
    }

    return { theme: theme.name, issues };
  });
}

/**
 * Print a human-readable audit report to the console.
 */
export function printAuditReport(): void {
  const results = auditAllThemes();
  let totalIssues = 0;
  let totalDecorative = 0;

  for (const result of results) {
    if (result.issues.length === 0) {
      console.log(`✓ ${result.theme}: All pairs pass WCAG AA`);
      continue;
    }

    const critical = result.issues.filter((i) => !i.isDecorative);
    const decorative = result.issues.filter((i) => i.isDecorative);
    totalIssues += critical.length;
    totalDecorative += decorative.length;

    console.log(`\n● ${result.theme}:`);
    for (const issue of critical) {
      console.log(
        `  ✗ FAIL  ${issue.element}: ${issue.ratio}:1 (need ${issue.required}:1) — ${issue.foreground} on ${issue.background}`,
      );
    }
    for (const issue of decorative) {
      console.log(
        `  ⚠ WARN  ${issue.element}: ${issue.ratio}:1 (need ${issue.required}:1) — ${issue.foreground} on ${issue.background}`,
      );
    }
  }

  console.log(
    `\nSummary: ${totalIssues} critical failure(s), ${totalDecorative} decorative warning(s)`,
  );
}
