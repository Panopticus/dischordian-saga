/**
 * WarlordLockoutChip — three-move-lockout HUD countdown.
 *
 * Fires in the `the_warlord_zero_first` match (Cycle C,
 * Opponent 9). On the Warlord's third turn, her deck locks
 * three consecutive player turns (4, 5, 6) to reduced option
 * sets — player hand forcibly narrowed to two playable cards
 * per turn. The chip is a top-right 64×64 HUD element showing
 * the countdown "3 → 2 → 1".
 *
 * SCAFFOLD. Full UX spec at:
 *   docs/production/act1/warlord-three-move-mechanic.md
 *   docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md §7.4
 */

export interface WarlordLockoutChipProps {
  /** Current turn number. Lockout fires on turns 4, 5, 6. */
  currentTurn: number;
  /** True when the lockout is active this turn. */
  locked: boolean;
  /** Optional explicit override for the remaining count. */
  remaining?: number;
}

const LOCKOUT_TURNS = [4, 5, 6] as const;

export function remainingLockoutTurns(currentTurn: number): number {
  if (currentTurn < LOCKOUT_TURNS[0]) return 3;
  if (currentTurn > LOCKOUT_TURNS[LOCKOUT_TURNS.length - 1]) return 0;
  return LOCKOUT_TURNS[LOCKOUT_TURNS.length - 1] - currentTurn + 1;
}

export function WarlordLockoutChip({
  currentTurn,
  locked,
  remaining,
}: WarlordLockoutChipProps) {
  const remain = remaining ?? remainingLockoutTurns(currentTurn);
  if (remain <= 0) return null;

  return (
    <div
      data-testid="warlord-lockout-chip"
      data-turn={currentTurn}
      data-remaining={remain}
      data-locked={locked}
      className="pointer-events-none absolute top-4 right-4 h-16 w-16 rounded-md border border-[#b8752d] bg-[#6b5a48]/95 text-[#e06a1a] shadow-md data-[locked=true]:animate-pulse"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="font-mono text-xl">
          {remain}
          <span className="text-[#6b5a48] text-[#e06a1a]/50">/3</span>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              data-lit={i <= remain}
              className="h-1 w-3 rounded-sm bg-[#b8752d]/30 data-[lit=true]:bg-[#e06a1a]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
