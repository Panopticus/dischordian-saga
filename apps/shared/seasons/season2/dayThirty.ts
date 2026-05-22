/* ═══════════════════════════════════════════════════════
   SEASON 2 — DAY 30 CLEANUP + LORE DRIFT TEST
   docs/design/NEXUS_TRIAL_PLAN.md → Post-Verdict Season 2

   The Day 30 patch wave:
     1. Removes the 5 unfired companion variants (other than
        the one that actually fired)
     2. Removes the 3 unfired ballot variants
     3. Removes the 2 unfired politician-fork variants
     4. Regenerates LORE_BIBLE.md from loredex-data.json
     5. Runs the drift test confirming the rewrite landed

   Sprint 14 ships the *computation* — the cleanup
   plan that names which directories to remove and the
   drift test predicate. The actual filesystem removal is
   a deploy-time script (apps/scripts/season2-day30-cleanup.ts,
   future work).
   ═══════════════════════════════════════════════════════ */

import type { WorldStateDelta } from "./types";
import { selectModules } from "./composer";

export interface Day30CleanupPlan {
  /** Module ids that fired and should be retained. */
  retained: readonly string[];
  /** Module ids that did NOT fire and should be removed. */
  removed: readonly string[];
}

/**
 * Compute the cleanup plan from the world-state delta. Pure /
 * deterministic. The full universe of module ids is:
 *   shared
 *   companion_sacrifice/elara_dies, companion_sacrifice/human_dies
 *   second_death/wraith_dies, second_death/lycos_dies,
 *   second_death/akai_dies, second_death/vex_dies
 *   politician_fork/seat_sealed, politician_fork/constrained_return,
 *   politician_fork/full_return
 * — 10 modules total. Day 1 activates 4; Day 30 removes the 6 that
 * didn't fire.
 */
export function planDay30Cleanup(delta: WorldStateDelta): Day30CleanupPlan {
  const retained = selectModules(delta).map((m) => m.id);
  const ALL_MODULES = [
    "shared",
    "companion_sacrifice/elara_dies",
    "companion_sacrifice/human_dies",
    "second_death/wraith_dies",
    "second_death/lycos_dies",
    "second_death/akai_dies",
    "second_death/vex_dies",
    "politician_fork/seat_sealed",
    "politician_fork/constrained_return",
    "politician_fork/full_return",
  ] as const;
  const retainedSet = new Set(retained);
  const removed = ALL_MODULES.filter((id) => !retainedSet.has(id));
  return { retained, removed };
}

/* ─── LORE DRIFT TEST ─── */

/**
 * Lore drift check input: a list of LORE_BIBLE.md character
 * references and the loredex-data.json status for each. The
 * drift test ensures past-tense rewrites for deceased characters
 * match between the two documents.
 */
export interface LoreReference {
  /** Character key (e.g. "locke", "elara"). */
  key: string;
  /** Whether the LORE_BIBLE mentions the character in past tense. */
  loreBiblePastTense: boolean;
  /** Whether the loredex-data.json status is deceased/in_memoriam. */
  loredexStatusDeceased: boolean;
}

export interface LoreDriftResult {
  passed: boolean;
  /** Characters where LORE_BIBLE present-tense disagrees with
   *  loredex deceased status — these must be rewritten. */
  driftedCharacters: readonly string[];
}

/**
 * Run the drift test. A character with `loredexStatusDeceased=true`
 * MUST also have `loreBiblePastTense=true`. Otherwise the LORE_BIBLE
 * is referencing them as still-alive and needs regeneration.
 *
 * Per CLAUDE.md's ship-check rules, this is the binding contract:
 * lore drift must be zero before the Day 30 patch is considered
 * applied.
 */
export function runLoreDriftTest(
  refs: readonly LoreReference[],
): LoreDriftResult {
  const drifted: string[] = [];
  for (const ref of refs) {
    if (ref.loredexStatusDeceased && !ref.loreBiblePastTense) {
      drifted.push(ref.key);
    }
  }
  return {
    passed: drifted.length === 0,
    driftedCharacters: drifted,
  };
}
