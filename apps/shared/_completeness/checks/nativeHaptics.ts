/**
 * Native haptics parity check.
 *
 * lib/haptics.ts drove everything through navigator.vibrate, which
 * iOS WKWebView does not implement — so on the native iOS shell (the
 * actual ship target) every haptic silently no-opped. The fix routes
 * through @capacitor/haptics on native with the web Vibration API as
 * the fallback.
 *
 * Hard parity:
 *   1. @capacitor/haptics is a declared dependency.
 *   2. haptics.ts lazy-imports it and exposes the native branch
 *      (isNativeHaptics + playNative).
 *   3. EVERY named HapticPatterns entry has an explicit
 *      HapticNativeMap mapping (no pattern silently lost on iOS).
 *   4. The primary entry point branches to native.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const PKG = "package.json";
const HAPTICS = "apps/client/src/lib/haptics.ts";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

/** Names declared inside a `const <obj> = { ... } as const|: type` block. */
function keysOf(src: string, marker: string): string[] {
  const start = src.indexOf(marker);
  if (start < 0) return [];
  const open = src.indexOf("{", start);
  let depth = 0;
  let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }
  // Strip line comments so keys that follow a comment line (or have a
  // trailing `// ...`) are still seen, then take every line-anchored
  // `identifier:` — the object-literal key form for both maps here.
  const body = src.slice(open + 1, end).replace(/\/\/[^\n]*/g, "");
  return [...body.matchAll(/(?:^|\n)\s*([A-Za-z_]\w*)\s*:/g)].map(
    (m) => m[1],
  );
}

export function checkNativeHaptics(): RawParityCount {
  const pkg = read(PKG);
  const h = read(HAPTICS);
  const missing: string[] = [];

  if (!/"@capacitor\/haptics"\s*:/.test(pkg)) {
    missing.push(`${PKG}: @capacitor/haptics not a declared dependency`);
  }

  if (
    !/import\(["']@capacitor\/haptics["']\)/.test(h) ||
    !/function isNativeHaptics/.test(h) ||
    !/function playNative/.test(h)
  ) {
    missing.push(
      `${HAPTICS}: native branch missing (lazy import / isNativeHaptics / playNative)`,
    );
  }

  if (!/if \(isNativeHaptics\(\)\)/.test(h)) {
    missing.push(`${HAPTICS}: hapticFeedback does not branch to native`);
  }

  // Every declared pattern must have an explicit native mapping.
  const patternKeys = keysOf(h, "export const HapticPatterns");
  const nativeKeys = new Set(keysOf(h, "HapticNativeMap"));
  for (const k of patternKeys) {
    if (!nativeKeys.has(k)) {
      missing.push(`${HAPTICS}: HapticNativeMap missing mapping for "${k}"`);
    }
  }

  // declared = 3 structural invariants + one per named pattern.
  const declared = 3 + patternKeys.length;
  return { declared, implemented: declared - missing.length, missing };
}
