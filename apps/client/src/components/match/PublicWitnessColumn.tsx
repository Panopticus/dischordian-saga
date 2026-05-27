/**
 * §5.7 Game Master public-witness column.
 *
 * Thin §5.7-specific wrapper over the shared TranscriptColumn.
 * Mounted on the right edge of the match field during a §5.7
 * Game Master match. Shows the verdict stream — one entry per
 * Game Master card play — with the running public balance at
 * the bottom.
 *
 * Per spec §5.7 §2.2 the header reads "VERDICT" (brass on white).
 * Per §2.3 each row shows publicLabel + signed publicDelta. The
 * optional divergence border (spec §3) is deferred until the
 * inner TranscriptColumn gains a per-row emphasis prop; for now
 * diverged entries get a bracketed tag so the asymmetry is
 * readable without new UI surface.
 *
 * Spec: docs/production/act1/public-witness-ui-spec.md.
 */

import {
  TranscriptColumn,
  type TranscriptEntry,
} from "./TranscriptColumn";
import { PUBLIC_WITNESS_THRESHOLDS } from "@shared/tcg-core/types/PublicWitness";

export interface PublicWitnessEntryView {
  /** Unique id — the reducer actionSeq works. */
  id: string;
  /** Turn the play resolved on (shown as the row's right-side tag). */
  turnNumber: number;
  /** Short public-record label ("admission", "deflection", etc.). */
  publicLabel: string;
  /** Signed delta applied to the running public balance. */
  publicDelta: number;
  /** Private-side delta for the same play. Drives the divergence
   *  bracket tag when signs disagree. */
  privateDelta: number;
}

interface PublicWitnessColumnProps {
  /** Current running balance from gameState.publicWitness.balance. */
  balance: number;
  entries: readonly PublicWitnessEntryView[];
  /**
   * Phase A7 — optional Stakes Stream `public_witness` axis value
   * from `gameState.stakes.axes.public_witness`. Present only when
   * the encounter declares `stakesMode` with the public_witness axis
   * (today: chAuthorityTrial only). Rendered as a parallel row below
   * the existing card-driven balance — the player sees the
   * dialog-driven shift independently from card plays.
   *
   * Transitional dual-render: collapses to one row when the
   * trialMode→stakesMode full migration lands and state.publicWitness
   * is removed in favor of state.stakes.axes.public_witness alone.
   */
  stakesPublicWitness?: number;
}

/** Divergence check — mirrors shared/publicWitness.ts isEntryDiverged,
 *  inlined so the UI module stays self-contained (no React→engine
 *  import coupling). */
function isDiverged(e: PublicWitnessEntryView): boolean {
  if (e.publicDelta === 0 || e.privateDelta === 0) return false;
  return (
    (e.publicDelta > 0 && e.privateDelta < 0) ||
    (e.publicDelta < 0 && e.privateDelta > 0)
  );
}

function toGenericEntry(e: PublicWitnessEntryView): TranscriptEntry {
  // Diverged rows get a bracketed `⟨!⟩` tag alongside the turn
  // number so the asymmetry is visible in the row. Full rust-
  // orange border (spec §3) lands when TranscriptColumn accepts
  // per-row emphasis — tracked as a follow-up.
  const diverged = isDiverged(e);
  return {
    id: e.id,
    label: e.publicLabel,
    delta: e.publicDelta,
    tag: diverged ? `t${e.turnNumber} ⟨!⟩` : `t${e.turnNumber}`,
  };
}

export function PublicWitnessColumn({
  balance,
  entries,
  stakesPublicWitness,
}: PublicWitnessColumnProps) {
  // The §5.8 warm threshold (+3) is the canonical "reaching warm"
  // marker per spec §4. The footer's comparison colors the balance
  // green at or above this line.
  return (
    <div>
      <TranscriptColumn
        title="Verdict"
        entries={entries.map(toGenericEntry)}
        emptyText="Awaiting the record."
        balance={{
          value: balance,
          threshold: PUBLIC_WITNESS_THRESHOLDS.warm,
          label: "Balance",
        }}
      />
      {typeof stakesPublicWitness === "number" && (
        // Phase A7 — Stakes Stream dialog-influence row. Distinct
        // from the card-driven Balance above; signed integer with
        // a + prefix on positives so the asymmetry is readable.
        <div
          className="mt-1 px-2 py-1 text-right font-mono text-[10px] uppercase tracking-wider void-text-dim"
          data-testid="stakes-public-witness-row"
        >
          <span className="opacity-70 mr-2">Dialog Influence</span>
          <span
            className={
              stakesPublicWitness > 0
                ? "void-text-premium"
                : stakesPublicWitness < 0
                  ? "void-text-warning"
                  : "void-text-dim"
            }
          >
            {stakesPublicWitness > 0 ? "+" : ""}
            {stakesPublicWitness}
          </span>
        </div>
      )}
    </div>
  );
}
