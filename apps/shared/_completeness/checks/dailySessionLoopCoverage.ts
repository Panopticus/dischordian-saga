/**
 * Daily-session-loop coverage — the "today" through-line gate (W5).
 *
 * The audit flagged "no defined session/daily loop … no designed
 * 'what do I do for 8 minutes today' loop." Every part already
 * shipped; what was missing was the designed sequence binding them
 * (apps/shared/dailySessionLoop.ts).
 *
 * HARD PARITY: every loop step's anchor module MUST exist on disk
 * (an orphaned step = a loop pointing at nothing), AND the total
 * session budget MUST stay in the designed 5–12 minute band (the
 * "~8 minute" session contract). declared = steps; implemented =
 * steps whose anchor exists; a budget-band violation folds into
 * the gap so the session-length design is itself enforced.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import {
  DAILY_SESSION_LOOP,
  getDailySessionMinutes,
} from "../../dailySessionLoop";
import type { RawParityCount } from "../types";

const MIN_BAND = 5;
const MAX_BAND = 12;

export function checkDailySessionLoopCoverage(): RawParityCount {
  const missing: string[] = [];
  let anchored = 0;

  for (const step of DAILY_SESSION_LOOP) {
    if (fs.existsSync(path.join(REPO_ROOT, step.anchorModule))) {
      anchored++;
    } else {
      missing.push(
        `daily-loop step '${step.id}' anchor module ` +
          `${step.anchorModule} does not exist — the step points at ` +
          `nothing`,
      );
    }
  }

  const minutes = getDailySessionMinutes();
  let budgetOk = true;
  if (minutes < MIN_BAND || minutes > MAX_BAND) {
    budgetOk = false;
    missing.push(
      `daily session budget ${minutes}m is outside the designed ` +
        `${MIN_BAND}–${MAX_BAND}m band (the "~8 minute" contract)`,
    );
  }

  const declared = DAILY_SESSION_LOOP.length;
  const implemented = budgetOk ? anchored : Math.min(anchored, declared - 1);
  return { declared, implemented, missing };
}
