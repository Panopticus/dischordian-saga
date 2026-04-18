/**
 * VerdictStreamColumn — the parallel public-resolution UI.
 *
 * Fires in the `the_game_master_original` match (Cycle C,
 * Opponent 11). Every Game Master card play resolves TWICE:
 * once privately (affecting match scoring) and once publicly
 * (displayed here). The two resolutions can have different
 * effects; winning the private match does NOT clear the
 * Engineer's name. The verdict stream's running balance is
 * handed off to the §5.8 Authority match as its opening
 * state.
 *
 * SCAFFOLD. Full UX spec at:
 *   docs/production/act1/public-witness-ui-spec.md
 *   docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md §7.2
 *
 * Visual treatment:
 *   - 20% right-hand rail
 *   - clinical-white background (#e8e8e8)
 *   - thin 2px brass border (#b8752d)
 *   - divergence warnings flash rust-orange (#c66b3d)
 */

import { useEffect, useState } from "react";

/** One public-resolution event. */
export interface VerdictEntry {
  turn: number;
  /** Short label shown in the stream (e.g. "Admitted: coerced testimony"). */
  publicLabel: string;
  /** Signed delta to the running balance. */
  balanceDelta: number;
  /** True if the public resolution diverged from the private one. */
  diverged: boolean;
  /** Monotonic timestamp for animation ordering. */
  t: number;
}

export interface VerdictStreamColumnProps {
  entries: VerdictEntry[];
  /** Current running balance, range -10 to +10. */
  balance: number;
  /** Called when a divergence flash completes; used to advance turn. */
  onDivergenceSettle?: (entry: VerdictEntry) => void;
}

/** Clamp balance to the canonical range. */
export function clampVerdictBalance(n: number): number {
  if (n < -10) return -10;
  if (n > 10) return 10;
  return Math.round(n);
}

/**
 * Reducer helper — callers use this to fold a new entry into
 * both the list and the balance on each Game Master card play.
 */
export function applyVerdictEntry(
  prev: { entries: VerdictEntry[]; balance: number },
  next: VerdictEntry,
): { entries: VerdictEntry[]; balance: number } {
  return {
    entries: [...prev.entries, next],
    balance: clampVerdictBalance(prev.balance + next.balanceDelta),
  };
}

export function VerdictStreamColumn({
  entries,
  balance,
  onDivergenceSettle,
}: VerdictStreamColumnProps) {
  const [lastFlashedT, setLastFlashedT] = useState<number>(0);

  useEffect(() => {
    const latest = entries[entries.length - 1];
    if (!latest) return;
    if (latest.diverged && latest.t > lastFlashedT) {
      setLastFlashedT(latest.t);
      const handle = setTimeout(
        () => onDivergenceSettle?.(latest),
        650,
      );
      return () => clearTimeout(handle);
    }
  }, [entries, lastFlashedT, onDivergenceSettle]);

  return (
    <aside
      data-testid="verdict-stream-column"
      data-balance={balance}
      className="absolute top-0 right-0 h-full w-1/5 border-l-2 border-[#b8752d] bg-[#e8e8e8] text-[#1c1a1a]"
    >
      <header className="border-b border-[#b8752d] p-3">
        <div className="text-xs uppercase tracking-widest text-[#55606e]">
          Verdict Stream
        </div>
        <div
          className="mt-1 font-mono text-2xl"
          data-testid="verdict-balance"
        >
          {balance >= 0 ? "+" : ""}
          {balance}
        </div>
      </header>
      <ol className="divide-y divide-[#b8752d]/30">
        {entries.map((e) => (
          <li
            key={`${e.turn}-${e.t}`}
            data-diverged={e.diverged}
            className="p-3 text-sm data-[diverged=true]:bg-[#c66b3d]/10"
          >
            <div className="text-xs text-[#55606e]">Turn {e.turn}</div>
            <div>{e.publicLabel}</div>
            <div
              className="font-mono text-xs"
              data-testid={`delta-${e.turn}`}
            >
              {e.balanceDelta >= 0 ? "+" : ""}
              {e.balanceDelta}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
