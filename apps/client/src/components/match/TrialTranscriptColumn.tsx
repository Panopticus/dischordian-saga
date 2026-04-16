/**
 * §5.8 Authority trial — transcript column.
 *
 * Mounted on the right side of the match field during a §5.8 trial.
 * Shows each admissible card play as a transcript entry with its
 * verdict-stream delta. Per spec §4 the §5.7 transcript block
 * precedes the §5.8 live block with a "— trial convened —" separator;
 * §5.7 isn't built yet so this MVP version shows the live block only,
 * with a placeholder header. When §5.7 lands, the pre-populated
 * transcript gets prepended here with the brass separator rule.
 *
 * The running balance at the bottom reads from gameState.trial
 * directly. Entries are driven by a small event-buffer state the
 * parent collects from the reducer's `trial_balance_changed` events.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md §4.
 */
export interface TrialTranscriptEntry {
  /** Unique id — in practice the reducer's event sequence works. */
  id: string;
  /** Human-readable card name; the view-adapter supplies it. */
  cardName: string;
  /** Phase the play occurred in (1..10). */
  phaseNumber: number;
  /** Signed delta applied to the running balance. */
  delta: number;
}

interface TrialTranscriptColumnProps {
  /** Current running balance from gameState.trial.trialBalance. */
  balance: number;
  /** The threshold at which balance >= threshold → overturn. For MVP
   *  we display the base threshold (-2) as a label only; when the §5.7
   *  hand-off is wired, the offset from `openingVerdictBalance` adjusts
   *  the displayed threshold. */
  threshold: number;
  entries: readonly TrialTranscriptEntry[];
}

export function TrialTranscriptColumn({
  balance,
  threshold,
  entries,
}: TrialTranscriptColumnProps) {
  return (
    <div
      role="region"
      aria-label="Trial transcript"
      className="absolute right-3 top-16 bottom-52 z-20 w-56 flex flex-col rounded border border-stone-300/20 bg-stone-950/80 backdrop-blur-sm"
    >
      {/* Column header */}
      <div className="px-3 py-2 border-b border-stone-300/15">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400/60">
          Trial transcript
        </p>
      </div>

      {/* §5.7 block placeholder — when §5.7 ships, prepend its
          transcript cards here with the "— trial convened —" rule. */}
      <div className="px-3 py-1.5 border-b border-amber-400/30">
        <p className="font-serif text-[10px] italic text-amber-200/50 text-center">
          — trial convened —
        </p>
      </div>

      {/* Live §5.8 entries */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {entries.length === 0 ? (
          <p className="font-mono text-[9px] text-stone-500/50 italic">
            No cards played yet.
          </p>
        ) : (
          entries.map((e) => (
            <div
              key={e.id}
              className="flex items-baseline justify-between gap-2"
            >
              <p className="font-serif text-[11px] text-stone-100 truncate flex-1">
                {e.cardName}
              </p>
              <span className="font-mono text-[9px] text-stone-400/60 shrink-0">
                p{e.phaseNumber}
              </span>
              <span
                className={
                  "font-mono text-[10px] tabular-nums shrink-0 " +
                  (e.delta >= 0 ? "text-emerald-300/80" : "text-orange-300/80")
                }
              >
                {e.delta >= 0 ? "+" : ""}
                {e.delta}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Running balance footer */}
      <div className="px-3 py-2 border-t border-stone-300/15 flex items-baseline justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400/60">
          Balance
        </span>
        <span className="flex items-baseline gap-2">
          <span
            className={
              "font-mono text-sm font-bold tabular-nums " +
              (balance >= threshold ? "text-emerald-200" : "text-orange-300")
            }
          >
            {balance >= 0 ? "+" : ""}
            {balance}
          </span>
          <span className="font-mono text-[9px] text-stone-500/60">
            / {threshold >= 0 ? "+" : ""}
            {threshold}
          </span>
        </span>
      </div>
    </div>
  );
}
