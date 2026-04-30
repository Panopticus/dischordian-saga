/**
 * tcg-core rules version.
 *
 * Every match persists the rules version it was played under. Replays check
 * this on load to decide whether to replay against the current engine or a
 * pinned historical engine (see apps/shared/tcg-core/replay/replay.ts).
 *
 * Semver discipline:
 *  - PATCH (1.0.0 -> 1.0.1): bug fix with no state-shape change. Replays
 *    against a patched engine are still safe to replay-verify.
 *  - MINOR (1.0.x -> 1.1.0): rules change that alters outcomes for some
 *    existing action sequences. Replays need the pinned engine they were
 *    recorded against; current engine shows "archived" on mismatch.
 *  - MAJOR (1.x -> 2.0.0): state-shape change. Replays are archived; only
 *    the action log + final result are shown, not live state.
 *
 * Bump rules: any change that alters reduce() output for a given
 * (state, action) pair is at least a MINOR bump. Adding a new card
 * definition is NOT a rules bump (cards are data, not rules).
 */
export const RULES_VERSION = "1.1.0" as const;

export type RulesVersion = typeof RULES_VERSION;

/**
 * True if a replay recorded at `recorded` can be replay-verified against
 * the engine at `current` without archival treatment.
 */
export function isReplayCompatible(recorded: string, current: string): boolean {
  const r = parseVersion(recorded);
  const c = parseVersion(current);
  if (!r || !c) return false;
  // Same major and minor; patch differences are tolerated.
  return r.major === c.major && r.minor === c.minor;
}

function parseVersion(v: string): { major: number; minor: number; patch: number } | null {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}
