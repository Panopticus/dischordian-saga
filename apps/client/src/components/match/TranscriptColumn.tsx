/**
 * TranscriptColumn — reusable verdict-stream transcript.
 *
 * Extracted from the §5.8 Authority trial's TrialTranscriptColumn
 * so §5.7 (Public-witness verdict stream) can reuse the same list
 * + balance footer + separator chrome without the §5.8-specific
 * labels. Roadmap Implication §3: "Component patterns should be
 * reusable (PlayRejectionToast, TranscriptColumn, ChoicePillar)."
 *
 * Shape:
 *   - Header row with the title
 *   - Optional separator row (e.g. "— trial convened —")
 *   - Scrollable entry list (name + optional phase + signed delta)
 *   - Optional balance footer (signed balance + signed threshold)
 *
 * Pure presentational. No store imports, no side effects.
 */

export interface TranscriptEntry {
  /** Unique id — reducer event sequence works for this. */
  id: string;
  /** Primary line. Usually a card name, may be any short label. */
  label: string;
  /** Signed delta applied to the running balance. */
  delta: number;
  /** Optional small right-side tag (e.g. phase number "p3"). */
  tag?: string;
}

export interface TranscriptColumnProps {
  /** Column header label (all-caps, letter-spaced). */
  title: string;
  /** Entries in display order. Newest at the bottom. */
  entries: readonly TranscriptEntry[];
  /** Placeholder text when entries is empty. */
  emptyText?: string;
  /** Optional rule shown between the title and the list. */
  separatorText?: string;
  /** Optional balance footer. Omit to render without one. */
  balance?: {
    /** Current signed running balance. */
    value: number;
    /** Signed threshold the balance is compared against. */
    threshold: number;
    /** Label for the balance row (defaults to "BALANCE"). */
    label?: string;
  };
  /** Extra className for layout/positioning concerns. */
  className?: string;
}

const DEFAULT_CLASS =
  "absolute right-3 top-16 bottom-52 z-20 w-56 flex flex-col rounded border void-border void-bg-canvas backdrop-blur-sm";

export function TranscriptColumn({
  title,
  entries,
  emptyText = "No entries yet.",
  separatorText,
  balance,
  className,
}: TranscriptColumnProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className={className ?? DEFAULT_CLASS}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b void-border">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] void-text-dim">
          {title}
        </p>
      </div>

      {/* Optional separator rule */}
      {separatorText ? (
        <div className="px-3 py-1.5 border-b void-border">
          <p className="font-serif text-[10px] italic void-text-accent text-center">
            {separatorText}
          </p>
        </div>
      ) : null}

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {entries.length === 0 ? (
          <p className="font-mono text-[9px] void-text-dim italic">
            {emptyText}
          </p>
        ) : (
          entries.map((e) => (
            <div
              key={e.id}
              className="flex items-baseline justify-between gap-2"
            >
              <p className="font-serif text-[11px] void-text truncate flex-1">
                {e.label}
              </p>
              {e.tag ? (
                <span className="font-mono text-[9px] void-text-dim shrink-0">
                  {e.tag}
                </span>
              ) : null}
              <span
                className={
                  "font-mono text-[10px] tabular-nums shrink-0 " +
                  (e.delta >= 0 ? "void-text-energy" : "void-text-premium")
                }
              >
                {e.delta >= 0 ? "+" : ""}
                {e.delta}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Optional balance footer */}
      {balance ? (
        <div className="px-3 py-2 border-t void-border flex items-baseline justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] void-text-dim">
            {balance.label ?? "Balance"}
          </span>
          <span className="flex items-baseline gap-2">
            <span
              className={
                "font-mono text-sm font-bold tabular-nums " +
                (balance.value >= balance.threshold
                  ? "void-text-energy"
                  : "void-text-premium")
              }
            >
              {balance.value >= 0 ? "+" : ""}
              {balance.value}
            </span>
            <span className="font-mono text-[9px] void-text-dim">
              / {balance.threshold >= 0 ? "+" : ""}
              {balance.threshold}
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
