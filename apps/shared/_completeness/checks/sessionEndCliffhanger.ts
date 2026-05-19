/**
 * Session-end cliffhanger forward-hook parity check.
 *
 * getNextPhaseGuidance (the canonical "what beat comes next" resolver)
 * existed but was never surfaced at session end — the recap
 * cliffhanger showed only a static mood line, so a session closed
 * without pointing at a concrete next beat. The fix derives a
 * next-phase hook in generateRecap and renders it in the recap
 * overlay's cliffhanger.
 *
 * Hard parity (the value is only real if it's both computed AND
 * shown — a computed-but-unrendered hook is the hollow failure mode):
 *   1. RecapReport declares nextPhaseHook.
 *   2. generateRecap calls getNextPhaseGuidance with narrativeAct +
 *      flags and assigns nextPhaseHook.
 *   3. RecapOverlay actually renders recap.nextPhaseHook.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const RECAP = "apps/shared/recapSystem.ts";
const OVERLAY = "apps/client/src/components/RecapOverlay.tsx";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkSessionEndCliffhanger(): RawParityCount {
  const recap = read(RECAP);
  const overlay = read(OVERLAY);
  const missing: string[] = [];

  if (!/nextPhaseHook:\s*string\s*\|\s*null/.test(recap)) {
    missing.push(`${RECAP}: RecapReport.nextPhaseHook not declared`);
  }

  const computes =
    /getNextPhaseGuidance\(/.test(recap) &&
    /narrativeAct:\s*\(gameData\.narrativeAct/.test(recap) &&
    /flags:\s*narrativeFlags/.test(recap) &&
    /nextPhaseHook\s*=/.test(recap) &&
    /\bnextPhaseHook,\s*$/m.test(recap);
  if (!computes) {
    missing.push(
      `${RECAP}: generateRecap does not derive nextPhaseHook from getNextPhaseGuidance(narrativeAct, flags)`,
    );
  }

  if (!/recap\.nextPhaseHook\s*&&/.test(overlay) || !/\{recap\.nextPhaseHook\}/.test(overlay)) {
    missing.push(
      `${OVERLAY}: cliffhanger does not render recap.nextPhaseHook (computed but not shown)`,
    );
  }

  const declared = 3;
  return { declared, implemented: declared - missing.length, missing };
}
