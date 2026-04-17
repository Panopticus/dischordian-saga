/**
 * §5.8 Authority trial — transcript column (thin wrapper).
 *
 * Delegates to the generic TranscriptColumn with trial-specific
 * defaults: "Trial transcript" header, "— trial convened —"
 * separator, and the TrialTranscriptEntry → TranscriptEntry mapping.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md §4.
 */
import {
  TranscriptColumn,
  type TranscriptEntry,
} from "./TranscriptColumn";

export interface TrialTranscriptEntry {
  id: string;
  cardName: string;
  phaseNumber: number;
  delta: number;
}

interface TrialTranscriptColumnProps {
  balance: number;
  threshold: number;
  entries: readonly TrialTranscriptEntry[];
}

function toGenericEntry(e: TrialTranscriptEntry): TranscriptEntry {
  return { id: e.id, label: e.cardName, phaseNumber: e.phaseNumber, delta: e.delta };
}

export function TrialTranscriptColumn({
  balance,
  threshold,
  entries,
}: TrialTranscriptColumnProps) {
  return (
    <TranscriptColumn
      balance={balance}
      threshold={threshold}
      entries={entries.map(toGenericEntry)}
      headerText="Trial transcript"
      separatorText="— trial convened —"
      ariaLabel="Trial transcript"
    />
  );
}
