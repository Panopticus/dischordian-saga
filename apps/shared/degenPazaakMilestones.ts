/* ═══════════════════════════════════════════════════════
   DEGEN PAZAAK MILESTONES — sessionWins → narrative flag

   Distinct from `degenTrustGating.ts` (the per-hand trust
   state model). This module covers the narrative-flag
   milestones that fire when the player's cumulative
   sessionWins counter crosses fixed thresholds. The 5-win
   milestone gates `qm.degen_pazaak_5_wins.degen` — the
   quiet moment where the Degen surfaces his Dead Man's
   Circuit rumor.
   ═══════════════════════════════════════════════════════ */

export interface DegenPazaakMilestone {
  /** Cumulative sessionWins required to fire the flag. */
  readonly wins: number;
  /** Narrative flag fired when the threshold is crossed. */
  readonly flag: string;
}

export const DEGEN_PAZAAK_MILESTONES: ReadonlyArray<DegenPazaakMilestone> = [
  { wins: 1, flag: "degen_pazaak_wins_1" },
  { wins: 5, flag: "degen_pazaak_wins_5" },
  { wins: 10, flag: "degen_pazaak_wins_10" },
];

/** Returns the flags that should fire on a transition from
 *  `prevWins` to `nextWins`. Empty array on non-crossing transitions
 *  or decrements (the milestones are one-way ratchets — losing wins
 *  does not retract a previously-fired flag). */
export function milestonesCrossed(
  prevWins: number,
  nextWins: number,
): ReadonlyArray<string> {
  if (nextWins <= prevWins) return [];
  return DEGEN_PAZAAK_MILESTONES.filter(
    (m) => prevWins < m.wins && nextWins >= m.wins,
  ).map((m) => m.flag);
}
