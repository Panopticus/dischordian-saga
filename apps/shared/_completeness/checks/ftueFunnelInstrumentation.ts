/**
 * FTUE funnel instrumentation parity check.
 *
 * The FTUE engine (tutorialOrchestrator + useTutorialOrchestrator) is
 * well-built but emitted ZERO step-level analytics — you could not see
 * where new players drop out of onboarding, and D1 retention you can't
 * measure you can't fix. This gate keeps the funnel wired: a refactor
 * that drops the trackEvent calls (or removes the catalog events) fails
 * the gate instead of silently blinding the funnel again.
 *
 * Invariants (hard parity):
 *   1. GameEvents declares the 5 FTUE funnel events.
 *   2. useTutorialOrchestrator imports trackEvent and emits the three
 *      load-bearing funnel signals: STEP_SHOWN (entered stage),
 *      STEP_COMPLETED (advanced), SKIPPED (bailed — the key drop-off).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const ANALYTICS = "apps/client/src/lib/analytics.ts";
const HOOK = "apps/client/src/hooks/useTutorialOrchestrator.ts";

const REQUIRED_EVENTS = [
  "FTUE_STEP_SHOWN",
  "FTUE_STEP_COMPLETED",
  "FTUE_STEP_DISMISSED",
  "FTUE_SKIPPED",
  "FTUE_COMPLETED",
] as const;

const REQUIRED_EMISSIONS = [
  "GameEvents.FTUE_STEP_SHOWN",
  "GameEvents.FTUE_STEP_COMPLETED",
  "GameEvents.FTUE_SKIPPED",
] as const;

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkFtueFunnelInstrumentation(): RawParityCount {
  const analytics = read(ANALYTICS);
  const hook = read(HOOK);
  const missing: string[] = [];

  for (const ev of REQUIRED_EVENTS) {
    if (!new RegExp(`${ev}\\s*:`).test(analytics)) {
      missing.push(`${ANALYTICS}: GameEvents missing ${ev}`);
    }
  }

  if (!/from\s+["']@\/lib\/analytics["']/.test(hook)) {
    missing.push(`${HOOK}: no import from @/lib/analytics — funnel unwired`);
  }
  for (const emit of REQUIRED_EMISSIONS) {
    if (!hook.includes(emit)) {
      missing.push(`${HOOK}: no longer emits ${emit}`);
    }
  }

  const declared = REQUIRED_EVENTS.length + 1 + REQUIRED_EMISSIONS.length;
  return { declared, implemented: declared - missing.length, missing };
}
