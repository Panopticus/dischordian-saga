/**
 * §5.8 Authority trial — transcript column.
 *
 * Thin §5.8-specific wrapper over the shared TranscriptColumn.
 * Supplies the Trial transcript chrome (title, "— trial convened —"
 * separator, balance/threshold footer). The generic rendering
 * lives in ./TranscriptColumn so §5.7 (Public-witness verdict
 * stream) can reuse it without forking the markup.
 *
 * Mounted on the right side of the match field during a §5.8 trial.
 * Shows each admissible card play as a transcript entry with its
 * verdict-stream delta. Per spec §4 the §5.7 transcript block
 * precedes the §5.8 live block with a "— trial convened —" separator;
 * §5.7 isn't built yet so this MVP version shows the live block only.
 * When §5.7 lands, its entries get prepended here and pass through
 * the same TranscriptColumn surface.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md §4.
 */

import {
  TranscriptColumn,
  type TranscriptEntry,
} from "./TranscriptColumn";

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

/** Map a §5.8-shaped entry into the generic TranscriptColumn row. */
function toGenericEntry(e: TrialTranscriptEntry): TranscriptEntry {
  return {
    id: e.id,
    label: e.cardName,
    delta: e.delta,
    tag: `p${e.phaseNumber}`,
  };
}

export function TrialTranscriptColumn({
  balance,
  threshold,
  entries,
}: TrialTranscriptColumnProps) {
  return (
    <TranscriptColumn
      title="Trial transcript"
      entries={entries.map(toGenericEntry)}
      emptyText="No cards played yet."
      separatorText="— trial convened —"
      balance={{ value: balance, threshold, label: "Balance" }}
    />
  );
}
