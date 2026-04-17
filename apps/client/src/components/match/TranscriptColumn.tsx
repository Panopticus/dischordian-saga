/**
 * Generic transcript column — reusable scrollable sidebar for
 * verdict-stream or witness-stream entries.
 *
 * §5.7 (public-witness) and §5.8 (Authority trial) both use this
 * layout. Callers pass entries, a running balance, a threshold,
 * and optional header/separator content.
 */

export interface TranscriptEntry {
  id: string;
  label: string;
  phaseNumber: number;
  delta: number;
}

export interface TranscriptColumnProps {
  balance: number;
  threshold: number;
  entries: readonly TranscriptEntry[];
  /** Column header text. Defaults to "Transcript". */
  headerText?: string;
  /** Separator text between pre-populated and live entries. */
  separatorText?: string;
  /** ARIA label for the region. */
  ariaLabel?: string;
}

export function TranscriptColumn({
  balance,
  threshold,
  entries,
  headerText = "Transcript",
  separatorText,
  ariaLabel = "Transcript",
}: TranscriptColumnProps) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="absolute right-3 top-16 bottom-52 z-20 w-56 flex flex-col rounded border border-stone-300/20 bg-stone-950/80 backdrop-blur-sm"
    >
      <div className="px-3 py-2 border-b border-stone-300/15">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400/60">
          {headerText}
        </p>
      </div>

      {separatorText && (
        <div className="px-3 py-1.5 border-b border-amber-400/30">
          <p className="font-serif text-[10px] italic text-amber-200/50 text-center">
            {separatorText}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {entries.length === 0 ? (
          <p className="font-mono text-[9px] text-stone-500/50 italic">
            No entries yet.
          </p>
        ) : (
          entries.map((e) => (
            <div
              key={e.id}
              className="flex items-baseline justify-between gap-2"
            >
              <p className="font-serif text-[11px] text-stone-100 truncate flex-1">
                {e.label}
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
