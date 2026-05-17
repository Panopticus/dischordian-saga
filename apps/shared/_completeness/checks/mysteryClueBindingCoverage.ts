/**
 * Mystery Engine — progression-critical clue binding coverage.
 *
 * The Mystery Engine advances episode→episode when the player
 * commits a deduction matching an authored edge whose
 * `unlocksEpisode` is set (see `gradeDeduction` in
 * apps/server/services/mysteryService.ts). The DeductionPanel only
 * lets the player pair clues they have actually found, and a clue
 * is "found" when a room-mystery hotspot verb-response carrying a
 * `mysteryBinding` credits it via `mysteryService.recordEvidence`.
 *
 * Therefore: every clue referenced by a progression-critical
 * deduction edge (one with `unlocksEpisode`) MUST be bound to some
 * room hotspot, or the arc dead-ends — the player can never collect
 * the clue pair the gating deduction needs. An arc that is openable
 * but has zero progression-critical clues bound is openable-only:
 * it strands the player on episode 1.
 *
 * Mechanism:
 *
 *   - Declared = the set of distinct clue ids referenced (clueA /
 *     clueB / clueC) by deduction edges that carry `unlocksEpisode`,
 *     across every episode of every arc in MYSTERY_DEFINITIONS.
 *   - Implemented = the subset of those clue ids that appear in at
 *     least one `mysteryBinding.cluesFound` array somewhere under
 *     apps/shared/roomMysteries/*.ts.
 *
 * The room side is text-scanned (the same parsing approach as
 * scripts/_audit-mystery-binding-integrity.mjs) so the check runs
 * fully inside the ship:check TS runtime with no shelling out. The
 * episode side imports MYSTERY_DEFINITIONS directly — the typed
 * source of truth — rather than re-parsing it.
 *
 * Ratcheted: only the Watcher arc is fully wired today; the other
 * 9 unbound arcs make this a large declared/implemented gap. The
 * ceiling in ratchet-state.json is the real current gap after the
 * Watcher arc is bound — it cannot regress and must tighten as the
 * remaining arcs are wired.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";
import { MYSTERY_DEFINITIONS } from "../../episodeMysteries";

const ROOM_DIR = path.join(REPO_ROOT, "apps/shared/roomMysteries");
const ROOM_SKIP = new Set([
  "_template.ts",
  "_speciesExclusive.ts",
  "index.ts",
]);

/**
 * Collect every clue id referenced by a progression-critical
 * deduction edge (one with `unlocksEpisode`) across all arcs.
 * Returns a map clueId → owning arc id so the missing-list can name
 * which arc is stranded.
 */
function collectProgressionCriticalClues(): Map<string, string> {
  const clueToArc = new Map<string, string>();
  for (const mystery of MYSTERY_DEFINITIONS) {
    for (const episode of mystery.episodes) {
      for (const edge of episode.deductions) {
        if (!edge.unlocksEpisode) continue;
        for (const clueId of [edge.clueA, edge.clueB, edge.clueC]) {
          if (!clueId) continue;
          if (!clueToArc.has(clueId as string)) {
            clueToArc.set(clueId as string, mystery.id as string);
          }
        }
      }
    }
  }
  return clueToArc;
}

/**
 * Scan every room-mystery module for `mysteryBinding.cluesFound`
 * arrays and return the set of every clue id any hotspot binds.
 * Mirrors the regex shape of scripts/_audit-mystery-binding-integrity.mjs.
 */
function collectBoundClueIds(): Set<string> {
  const bound = new Set<string>();
  if (!fs.existsSync(ROOM_DIR)) return bound;
  const files = fs
    .readdirSync(ROOM_DIR)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        !f.endsWith(".test.ts") &&
        !ROOM_SKIP.has(f),
    );
  const bindingRe = /mysteryBinding\s*:\s*\{([\s\S]*?)\}/g;
  for (const file of files) {
    const src = fs.readFileSync(path.join(ROOM_DIR, file), "utf-8");
    let m: RegExpExecArray | null;
    while ((m = bindingRe.exec(src)) !== null) {
      const body = m[1];
      const cluesMatch = body.match(/cluesFound\s*:\s*\[([\s\S]*?)\]/);
      if (!cluesMatch) continue;
      for (const c of cluesMatch[1].matchAll(/"([^"]+)"/g)) {
        bound.add(c[1]);
      }
    }
  }
  return bound;
}

export function checkMysteryClueBindingCoverage(): RawParityCount {
  const clueToArc = collectProgressionCriticalClues();
  const boundClueIds = collectBoundClueIds();

  const declared = clueToArc.size;
  let implemented = 0;
  const missingByArc = new Map<string, string[]>();

  for (const [clueId, arcId] of clueToArc) {
    if (boundClueIds.has(clueId)) {
      implemented++;
    } else {
      const list = missingByArc.get(arcId) ?? [];
      list.push(clueId);
      missingByArc.set(arcId, list);
    }
  }

  // One line per stranded arc (with a sample of its unbound
  // progression-critical clues) so the report names the arcs that
  // still dead-end rather than dumping every clue id.
  const missing: string[] = [];
  for (const [arcId, clues] of [...missingByArc.entries()].sort()) {
    const sample = clues.slice(0, 4).join(", ");
    const more = clues.length > 4 ? ` (+${clues.length - 4} more)` : "";
    missing.push(
      `${arcId}: ${clues.length} progression-critical clue(s) unbound — ${sample}${more}`,
    );
  }

  return { declared, implemented, missing };
}
