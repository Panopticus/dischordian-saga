/* ═══════════════════════════════════════════════════════
   ARMY RECRUITMENT — mission completion counter

   Each Act 1-5 sector exposes "recruitment missions" that
   bring new units into the player's army. Completing enough
   of them gates Acts 6 and 7 (the narrative can't advance
   until the army is built).

   Roadmap Implication §5: "Army recruitment needs its own
   counter — gates Act 6 (5+) and Act 7 (15+)."

   Historically the GameState carried the array but no code
   path wrote to it, so Acts 6 and 7 were unreachable. This
   module pins the thresholds in one place, defines the
   idempotent "mark as completed" helper, and provides
   boolean threshold predicates for dashboards and gates.

   Pure module. No React, no server imports.
   ═══════════════════════════════════════════════════════ */

/**
 * Mission-count thresholds that gate act advancement.
 * Mirrored in narrativeActs.ts ACT_TRIGGERS so the numbers
 * can't drift between the shared helper and the gate itself.
 */
export const RECRUITMENT_THRESHOLDS = {
  /** Act 5 → Act 6 ("The Confession") requires 5 completed missions. */
  act6: 5,
  /** Act 6 → Act 7 ("The Convergence") requires 15 completed missions. */
  act7: 15,
} as const;

/**
 * Idempotent append: returns the same array when missionId is
 * already present, otherwise a new array with it appended.
 *
 * Idempotency is important because the callers are UI event
 * handlers that can fire twice in React strict mode and because
 * save/load cycles shouldn't double-count.
 */
export function addCompletedRecruitmentMission(
  current: readonly string[],
  missionId: string,
): string[] {
  if (!missionId) return current.slice();
  if (current.includes(missionId)) return current.slice();
  return [...current, missionId];
}

/**
 * Read the recruitment count from whatever the caller has. The
 * caller can pass the array directly or the count; both are
 * supported so gate predicates can be fed from tests without
 * constructing the full array.
 */
export function getRecruitmentMissionCount(input: {
  armyRecruitmentMissionsCompleted?: readonly string[] | null;
}): number {
  const list = input.armyRecruitmentMissionsCompleted;
  if (!Array.isArray(list)) return 0;
  return list.length;
}

/** True when the player has completed enough missions to advance to Act 6. */
export function hasReachedAct6Threshold(count: number): boolean {
  return count >= RECRUITMENT_THRESHOLDS.act6;
}

/** True when the player has completed enough missions to advance to Act 7. */
export function hasReachedAct7Threshold(count: number): boolean {
  return count >= RECRUITMENT_THRESHOLDS.act7;
}
