/* ═══════════════════════════════════════════════════════
   THEME COMPLIANCE CHECKER — Morality Theme Coverage Verification
   Static analysis tool that reads component source files and checks
   for hardcoded colors vs CSS variable usage. Ensures all UI
   components respect the VoidEngine morality theme system.
   ═══════════════════════════════════════════════════════ */

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, join, basename } from "path";

// ── Component Types That Must Respect Morality Themes ────────────────

export interface ComponentThemeRequirement {
  /** Display name for the component type */
  componentType: string;
  /** Glob patterns to find source files for this component type */
  filePatterns: string[];
  /** CSS variables this component type MUST use (no hardcoded equivalents) */
  requiredVars: string[];
}

/**
 * All component types that must use theme-aware CSS variables
 * instead of hardcoded color values.
 */
export const THEME_COMPONENT_REQUIREMENTS: ComponentThemeRequirement[] = [
  {
    componentType: "buttons",
    filePatterns: ["client/src/components/ui/button*.tsx", "client/src/components/ui/Button*.tsx"],
    requiredVars: ["--energy-primary", "--text-primary", "--material-border"],
  },
  {
    componentType: "modals",
    filePatterns: [
      "client/src/components/*Modal*.tsx",
      "client/src/components/ui/dialog*.tsx",
      "client/src/components/ui/Dialog*.tsx",
    ],
    requiredVars: ["--bg-surface", "--bg-elevated", "--text-primary", "--material-border", "--energy-primary"],
  },
  {
    componentType: "toasts",
    filePatterns: ["client/src/components/*Toast*.tsx", "client/src/components/ui/toast*.tsx"],
    requiredVars: ["--bg-elevated", "--text-primary", "--material-border", "--energy-primary"],
  },
  {
    componentType: "cards",
    filePatterns: [
      "client/src/components/GameCard.tsx",
      "client/src/components/*Card*.tsx",
      "client/src/components/ui/card*.tsx",
    ],
    requiredVars: ["--bg-surface", "--text-primary", "--material-border", "--energy-primary", "--material-glow"],
  },
  {
    componentType: "chess-board",
    filePatterns: ["client/src/components/ChessBoard.tsx", "client/src/components/Chess*.tsx"],
    requiredVars: ["--bg-surface", "--bg-elevated", "--energy-primary", "--text-primary", "--material-border"],
  },
  {
    componentType: "card-game-board",
    filePatterns: [
      "client/src/components/*Battle*.tsx",
      "client/src/components/*CardBattle*.tsx",
    ],
    requiredVars: ["--bg-void", "--bg-surface", "--energy-primary", "--energy-error", "--text-primary", "--material-border"],
  },
  {
    componentType: "pet-battles-ui",
    filePatterns: ["client/src/components/*Pet*.tsx", "client/src/components/*Mascot*.tsx"],
    requiredVars: ["--bg-surface", "--energy-primary", "--energy-success", "--energy-error", "--text-primary"],
  },
  {
    componentType: "loading-screens",
    filePatterns: ["client/src/components/Loading*.tsx"],
    requiredVars: ["--bg-void", "--energy-primary", "--text-primary", "--text-dim"],
  },
  {
    componentType: "dialog-wheel",
    filePatterns: ["client/src/components/DialogWheel.tsx", "client/src/components/Dialog*.tsx"],
    requiredVars: ["--bg-surface", "--bg-elevated", "--text-primary", "--energy-primary", "--material-border"],
  },
  {
    componentType: "fight-hud",
    filePatterns: [
      "client/src/components/FightHUD.tsx",
      "client/src/components/*HUD*.tsx",
      "client/src/components/*Fight*.tsx",
    ],
    requiredVars: [
      "--bg-surface", "--energy-primary", "--energy-error", "--energy-success",
      "--text-primary", "--material-border",
    ],
  },
  {
    componentType: "quest-tracker",
    filePatterns: ["client/src/components/QuestTracker.tsx", "client/src/components/Quest*.tsx"],
    requiredVars: ["--bg-surface", "--energy-primary", "--energy-accent", "--text-primary", "--text-dim", "--material-border"],
  },
  {
    componentType: "achievement-popups",
    filePatterns: [
      "client/src/components/Achievement*.tsx",
      "client/src/components/*Achievement*.tsx",
    ],
    requiredVars: ["--bg-elevated", "--energy-primary", "--energy-premium", "--text-primary", "--material-glow"],
  },
];

// ── Compliance Result Types ──────────────────────────────────────────

export type ComplianceStatus = "compliant" | "partial" | "non-compliant";

export interface ComplianceResult {
  component: string;
  missingVars: string[];
  status: ComplianceStatus;
  /** Files that were analyzed */
  filesAnalyzed: string[];
  /** Hardcoded hex colors found (potential violations) */
  hardcodedColors: HardcodedColorViolation[];
}

export interface HardcodedColorViolation {
  file: string;
  line: number;
  color: string;
  lineContent: string;
}

// ── Hex Color Detection ──────────────────────────────────────────────

/**
 * Regex to match hex color codes in source files.
 * Matches #RGB, #RGBA, #RRGGBB, #RRGGBBAA formats.
 * Excludes colors inside CSS variable definitions (var(--..., #xxx))
 * and common non-color hex patterns (IDs, import hashes).
 */
const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;

/**
 * Lines that legitimately contain hex colors and should not be flagged:
 * - CSS variable fallback definitions (var(--xxx, #color))
 * - Comments
 * - Import/require statements
 * - String ID patterns (e.g., "boss-#1")
 * - Tailwind class opacity modifiers (e.g., bg-white/50, #33e2e620)
 */
const IGNORE_LINE_PATTERNS = [
  /^\s*\/\//,                     // Single-line comments
  /^\s*\*/,                       // Block comment lines
  /^\s*\/\*\*/,                   // JSDoc comment lines
  /import\s/,                     // Import statements
  /require\(/,                    // Require calls
  /console\./,                    // Console logging
  /\.test\.(ts|tsx)/,             // Test file references
  /^\s*\*\s/,                     // JSDoc/comment continuation
];

function isIgnorableLine(line: string): boolean {
  return IGNORE_LINE_PATTERNS.some((pattern) => pattern.test(line));
}

// ── File Resolution ──────────────────────────────────────────────────

function resolveProjectRoot(): string {
  // Walk up from this file's directory until we find package.json
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, "package.json")) && existsSync(join(dir, "client"))) {
      return dir;
    }
    dir = resolve(dir, "..");
  }
  // Fallback: assume standard project layout
  return resolve(__dirname, "..");
}

/**
 * Simple glob-like file matcher using only Node built-ins.
 * Supports patterns like "client/src/components/*Modal*.tsx".
 * Splits on the last "/" to get directory + filename wildcard.
 */
function resolveFiles(patterns: string[], root: string): string[] {
  const files = new Set<string>();
  for (const pattern of patterns) {
    const lastSlash = pattern.lastIndexOf("/");
    const dir = resolve(root, pattern.substring(0, lastSlash));
    const filePattern = pattern.substring(lastSlash + 1);

    if (!existsSync(dir)) continue;

    // Convert simple glob pattern to regex:
    // "*" matches any non-slash characters, "?" matches single char
    const regexStr = "^" + filePattern
      .replace(/\./g, "\\.")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".") + "$";
    const regex = new RegExp(regexStr);

    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        if (regex.test(entry)) {
          files.add(join(dir, entry));
        }
      }
    } catch {
      // Directory unreadable — skip
    }
  }
  return Array.from(files);
}

// ── Core Analysis ────────────────────────────────────────────────────

/**
 * Check if a file's source code references a given CSS variable.
 * Looks for the variable name in any context (var(), string literal, comment reference).
 */
function fileUsesVariable(source: string, varName: string): boolean {
  // Check for var(--name) usage or the raw variable name in strings
  return source.includes(varName);
}

/**
 * Find hardcoded hex color codes in a source file that likely
 * should be replaced with CSS variable references.
 */
function findHardcodedColors(filePath: string, source: string): HardcodedColorViolation[] {
  const violations: HardcodedColorViolation[] = [];
  const lines = source.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip ignorable lines
    if (isIgnorableLine(line)) continue;

    // Skip lines that are CSS variable definitions/fallbacks
    // e.g., var(--void-text, #e2e8f0) — these are fine
    if (line.includes("var(--") && line.includes(",")) continue;

    // Find all hex colors on this line
    let match: RegExpExecArray | null;
    const regex = new RegExp(HEX_COLOR_REGEX.source, "g");
    while ((match = regex.exec(line)) !== null) {
      const color = match[0];

      // Skip very short matches that might be false positives
      if (color.length < 4) continue;

      // Skip colors that are part of a CSS variable fallback: var(--xxx, #color)
      const before = line.substring(0, match.index);
      if (/var\(--[\w-]+,\s*$/.test(before)) continue;

      violations.push({
        file: filePath,
        line: i + 1,
        color,
        lineContent: line.trim(),
      });
    }
  }

  return violations;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Run the full theme compliance check across all registered component types.
 * Returns a report for each component type indicating whether it properly
 * uses the required CSS variables and avoids hardcoded colors.
 */
export function verifyThemeCompliance(): ComplianceResult[] {
  const root = resolveProjectRoot();
  const results: ComplianceResult[] = [];

  for (const req of THEME_COMPONENT_REQUIREMENTS) {
    const files = resolveFiles(req.filePatterns, root);

    if (files.length === 0) {
      // No files found for this component type — mark as non-compliant
      // (the component type is expected to exist)
      results.push({
        component: req.componentType,
        missingVars: req.requiredVars,
        status: "non-compliant",
        filesAnalyzed: [],
        hardcodedColors: [],
      });
      continue;
    }

    // Read all source files for this component type
    const sources: { path: string; content: string }[] = [];
    for (const filePath of files) {
      try {
        const content = readFileSync(filePath, "utf-8");
        sources.push({ path: filePath, content });
      } catch {
        // File unreadable — skip silently
      }
    }

    // Check which required vars are used across ALL files for this component type
    const combinedSource = sources.map((s) => s.content).join("\n");
    const missingVars = req.requiredVars.filter(
      (v) => !fileUsesVariable(combinedSource, v)
    );

    // Find hardcoded colors across all files
    const hardcodedColors: HardcodedColorViolation[] = [];
    for (const src of sources) {
      hardcodedColors.push(...findHardcodedColors(src.path, src.content));
    }

    // Determine compliance status
    let status: ComplianceStatus;
    if (missingVars.length === 0 && hardcodedColors.length === 0) {
      status = "compliant";
    } else if (missingVars.length === req.requiredVars.length) {
      status = "non-compliant";
    } else {
      status = "partial";
    }

    results.push({
      component: req.componentType,
      missingVars,
      status,
      filesAnalyzed: files,
      hardcodedColors,
    });
  }

  return results;
}

/**
 * Generate a human-readable compliance report string.
 */
export function formatComplianceReport(results: ComplianceResult[]): string {
  const lines: string[] = [
    "═══ MORALITY THEME COMPLIANCE REPORT ═══",
    "",
  ];

  const compliant = results.filter((r) => r.status === "compliant");
  const partial = results.filter((r) => r.status === "partial");
  const nonCompliant = results.filter((r) => r.status === "non-compliant");

  lines.push(`Compliant:     ${compliant.length}/${results.length}`);
  lines.push(`Partial:       ${partial.length}/${results.length}`);
  lines.push(`Non-compliant: ${nonCompliant.length}/${results.length}`);
  lines.push("");

  for (const result of results) {
    const icon =
      result.status === "compliant"
        ? "[OK]"
        : result.status === "partial"
          ? "[!!]"
          : "[XX]";

    lines.push(`${icon} ${result.component} (${result.status})`);
    lines.push(`    Files: ${result.filesAnalyzed.length > 0 ? result.filesAnalyzed.length : "NONE FOUND"}`);

    if (result.missingVars.length > 0) {
      lines.push(`    Missing vars: ${result.missingVars.join(", ")}`);
    }

    if (result.hardcodedColors.length > 0) {
      lines.push(`    Hardcoded colors: ${result.hardcodedColors.length} violations`);
      // Show first 3 violations as examples
      for (const v of result.hardcodedColors.slice(0, 3)) {
        lines.push(`      L${v.line}: ${v.color} in ${v.lineContent.substring(0, 80)}`);
      }
      if (result.hardcodedColors.length > 3) {
        lines.push(`      ... and ${result.hardcodedColors.length - 3} more`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}
