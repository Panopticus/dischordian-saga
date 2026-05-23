/* ═══════════════════════════════════════════════════════
   DEGEN PAZAAK MILESTONES — sessionWins → narrative flag

   Distinct from `degenTrustGating.ts` (the per-hand trust
   state model). This module covers the narrative-flag
   milestones that fire when the player's cumulative
   sessionWins counter crosses fixed thresholds. The 5-win
   milestone gates `qm.degen_pazaak_5_wins.degen` — the
   quiet moment where the Degen surfaces his Dead Man's
   Circuit rumor — and now also lands
   `act_4_5_casino_complete`, the Casino branch of the
   Act 4.5 completion gate. Both fire together: when the
   Degen has noticed you, you have named and paid your
   wager (the saga's identity-wager framing per §10 of
   the production bible).
   ═══════════════════════════════════════════════════════ */

export interface DegenPazaakMilestone {
  /** Cumulative sessionWins required to fire the flag. */
  readonly wins: number;
  /** Narrative flag(s) fired when the threshold is crossed. A single
   *  threshold can fire multiple flags — used for the 5-win milestone
   *  which lands both the Degen-quiet-moment flag and the Act 4.5
   *  casino-track completion flag in the same tick. */
  readonly flags: ReadonlyArray<string>;
}

export const DEGEN_PAZAAK_MILESTONES: ReadonlyArray<DegenPazaakMilestone> = [
  { wins: 1, flags: ["degen_pazaak_wins_1"] },
  {
    wins: 5,
    flags: [
      "degen_pazaak_wins_5",
      // Act 4.5 completion-gate track flag — see
      // apps/shared/act4_5CompletionGate.ts. The 5-win threshold is the
      // canon moment the Degen acknowledges the player as a serious
      // gambler; in identity-wager terms it's "named and paid."
      "act_4_5_casino_complete",
    ],
  },
  { wins: 10, flags: ["degen_pazaak_wins_10"] },
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
  ).flatMap((m) => m.flags);
}
