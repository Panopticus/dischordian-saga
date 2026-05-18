/**
 * Mastery-track coverage — the "play → grow → invest" gate (W4).
 *
 * The audit flagged "no traditional RPG progression spine." The
 * progression parts shipped (classMastery, bossMastery, the per-
 * mode reward engine); what was missing was the contract that the
 * grow loop covers EVERY system the story reveals.
 *
 * HARD PARITY, spine-driven: every NARRATIVE_SPINE premise MUST
 * have exactly one MASTERY_TRACKS entry, and every track's anchor
 * module MUST exist on disk. A spine system with no growth track
 * (or one bound to a missing module) is the exact failure — the
 * "play stronger" loop must reach the whole game.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import { NARRATIVE_SPINE } from "../../narrativeSpine";
import { getGameModePremise } from "../../gameModeNarrativePremises";
import { MASTERY_TRACKS } from "../../masteryTracks";
import type { RawParityCount } from "../types";

export function checkMasteryTrackCoverage(): RawParityCount {
  const premises = [
    ...new Set(
      NARRATIVE_SPINE.map((b) => b.revealsPremiseId).filter(
        (p) => getGameModePremise(p) !== undefined,
      ),
    ),
  ];
  const missing: string[] = [];
  let bound = 0;

  for (const p of premises) {
    const tracks = MASTERY_TRACKS.filter((t) => t.premiseId === p);
    if (tracks.length === 0) {
      missing.push(
        `spine system '${p}' has no mastery track — the play→grow→` +
          `invest loop does not reach it`,
      );
      continue;
    }
    if (tracks.length > 1) {
      missing.push(
        `spine system '${p}' has ${tracks.length} mastery tracks — a ` +
          `system grows on exactly one track`,
      );
      continue;
    }
    const anchor = tracks[0].anchorModule;
    if (!fs.existsSync(path.join(REPO_ROOT, anchor))) {
      missing.push(
        `mastery track '${tracks[0].track}' anchor ${anchor} does not ` +
          `exist on disk`,
      );
      continue;
    }
    bound++;
  }

  // Two-way: a track pointing at a non-spine premise is also a defect.
  for (const t of MASTERY_TRACKS) {
    if (!premises.includes(t.premiseId)) {
      missing.push(
        `mastery track '${t.track}' targets '${t.premiseId}' which is ` +
          `not a spine system`,
      );
    }
  }

  return { declared: premises.length, implemented: bound, missing };
}
