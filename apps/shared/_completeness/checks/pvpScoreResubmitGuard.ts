/**
 * tier5Pvp.submitScore once-per-player guard parity check.
 *
 * submitScore had no resubmission guard: re-calling it after the match
 * completed overwrote the caller's score AND re-ran the completion
 * block (mirrorRating +20 ELO, awardEligibleTitles) every time — an
 * unbounded rating/title farm. The fix rejects a submission once the
 * caller's score column is already set. This gate keeps that guard
 * present so a refactor of the (intricate) status/winner branch can't
 * silently drop it and reopen the farm.
 *
 * Hard parity: the handler must reject when the caller's score is
 * already recorded.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const FILE = "apps/server/routers/tier5Pvp.ts";

export function checkPvpScoreResubmitGuard(): RawParityCount {
  const abs = path.join(REPO_ROOT, FILE);
  const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
  const missing: string[] = [];

  const start = src.indexOf("submitScore:");
  const slice =
    start >= 0 ? src.slice(start, src.indexOf("getMyMatches:", start)) : "";

  const hasGuard =
    /alreadySubmitted/.test(slice) &&
    /Score already submitted for this match/.test(slice);
  if (!hasGuard) {
    missing.push(
      `${FILE}: submitScore lost its once-per-player resubmission guard — ELO/title farm reopened (re-POST after completion re-runs mirrorRating + awardEligibleTitles)`,
    );
  }

  return { declared: 1, implemented: 1 - missing.length, missing };
}
