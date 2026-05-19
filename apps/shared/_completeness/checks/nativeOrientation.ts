/**
 * Native orientation-lock parity check.
 *
 * LandscapeEnforcer locked orientation via the web
 * screen.orientation.lock API, which native iOS WKWebView does not
 * support (it silently throws) — so on the native ship target the
 * lock never took and players got the "rotate your device" overlay
 * instead of the OS rotating the app. The fix locks through
 * @capacitor/screen-orientation on native (web API + overlay kept as
 * the browser fallback).
 *
 * Hard parity:
 *   1. @capacitor/screen-orientation is a declared dependency.
 *   2. LandscapeEnforcer probes the native platform, and on native
 *      lock()s AND unlock()s landscape via the plugin.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const PKG = "package.json";
const ENFORCER = "apps/client/src/components/LandscapeEnforcer.tsx";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkNativeOrientation(): RawParityCount {
  const pkg = read(PKG);
  const src = read(ENFORCER);
  const missing: string[] = [];

  if (!/"@capacitor\/screen-orientation"\s*:/.test(pkg)) {
    missing.push(`${PKG}: @capacitor/screen-orientation not declared`);
  }

  if (!/Capacitor\?\.\s*isNativePlatform\?\.\(\)/.test(src)) {
    missing.push(`${ENFORCER}: no native-platform probe`);
  }
  if (
    !/import\(["']@capacitor\/screen-orientation["']\)/.test(src) ||
    !/ScreenOrientation\.lock\(\{\s*orientation:\s*["']landscape["']/.test(
      src,
    )
  ) {
    missing.push(
      `${ENFORCER}: does not lock landscape via @capacitor/screen-orientation on native`,
    );
  }
  if (!/ScreenOrientation\.unlock\(\)/.test(src)) {
    missing.push(
      `${ENFORCER}: native orientation lock is not released on cleanup (unlock missing)`,
    );
  }

  const declared = 4;
  return { declared, implemented: declared - missing.length, missing };
}
