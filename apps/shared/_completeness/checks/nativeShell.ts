/**
 * Native shell (SplashScreen / StatusBar / Android back) parity check.
 *
 * The Capacitor config declared only Purchases + Preferences, so a
 * native build had: a splash that auto-dropped to a blank frame before
 * React mounted, a default (wrong-contrast) status bar over a black
 * app, and an unhandled Android hardware-back. The fix wires
 * @capacitor/splash-screen + status-bar + app behind the lazy native
 * probe, hidden/styled from lib/nativeShell after mount.
 *
 * Hard parity:
 *   1. The three plugins are declared dependencies.
 *   2. nativeShell.ts probes native and drives StatusBar.setStyle +
 *      SplashScreen.hide + an App backButton listener.
 *   3. main.tsx invokes initNativeShell().
 *   4. capacitor.config.ts keeps the splash up (launchAutoHide:false)
 *      and declares the StatusBar block.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const PKG = "package.json";
const SHELL = "apps/client/src/lib/nativeShell.ts";
const MAIN = "apps/client/src/main.tsx";
const CONFIG = "capacitor.config.ts";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkNativeShell(): RawParityCount {
  const pkg = read(PKG);
  const shell = read(SHELL);
  const main = read(MAIN);
  const config = read(CONFIG);
  const missing: string[] = [];

  for (const dep of [
    "@capacitor/app",
    "@capacitor/splash-screen",
    "@capacitor/status-bar",
  ]) {
    if (!new RegExp(`"${dep.replace("/", "\\/")}"\\s*:`).test(pkg)) {
      missing.push(`${PKG}: ${dep} not declared`);
    }
  }

  if (!/Capacitor\?\.\s*isNativePlatform\?\.\(\)/.test(shell)) {
    missing.push(`${SHELL}: no native-platform probe`);
  }
  if (
    !/import\(["']@capacitor\/status-bar["']\)/.test(shell) ||
    !/StatusBar\.setStyle/.test(shell)
  ) {
    missing.push(`${SHELL}: StatusBar style not set on native`);
  }
  if (
    !/import\(["']@capacitor\/splash-screen["']\)/.test(shell) ||
    !/SplashScreen\.hide\(\)/.test(shell)
  ) {
    missing.push(`${SHELL}: SplashScreen.hide() not called`);
  }
  if (
    !/import\(["']@capacitor\/app["']\)/.test(shell) ||
    !/addListener\(\s*["']backButton["']/.test(shell)
  ) {
    missing.push(`${SHELL}: Android backButton not handled`);
  }

  if (!/initNativeShell\(\)/.test(main)) {
    missing.push(`${MAIN}: initNativeShell() not invoked`);
  }

  if (!/launchAutoHide:\s*false/.test(config)) {
    missing.push(
      `${CONFIG}: SplashScreen launchAutoHide:false missing (manual-hide contract broken)`,
    );
  }
  if (!/StatusBar:\s*\{/.test(config)) {
    missing.push(`${CONFIG}: StatusBar config block missing`);
  }

  const declared = 9;
  return { declared, implemented: declared - missing.length, missing };
}
