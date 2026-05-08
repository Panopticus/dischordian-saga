/**
 * AuthorityPhaseBar — ten-phase trial indicator for the finale.
 *
 * Fires in the `the_authority` match (Cycle C, Opponent 12 —
 * the Act 1 finale). The Authority does not have a hand. The
 * match is about playing coherent Dischordia through all ten
 * canonical legal phases without breaking a phase-restriction
 * and without the verdict stream landing below the execution
 * threshold.
 *
 * SCAFFOLD. Full UX spec at:
 *   docs/production/act1/authority-trial-phase-mechanic.md
 *   docs/archive/2026-05-08-superseded/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md §7.3
 *
 * Reads opening state from `VerdictStreamColumn`'s running
 * balance (handed off via `gameMasterVerdictStreamBalance`).
 */

import { useMemo } from "react";

export type AuthorityPhaseId =
  | "charge"
  | "opening_argument"
  | "evidence_presentation"
  | "cross_examination"
  | "closing_argument"
  | "verdict";

export interface AuthorityPhase {
  id: AuthorityPhaseId;
  label: string;
  /** Inclusive turn range. */
  turns: [number, number];
  /** Card-play restriction for this phase. */
  restriction: string;
}

/** Canonical ten-phase schedule per §5.8 of the source doc. */
export const AUTHORITY_PHASES: AuthorityPhase[] = [
  {
    id: "charge",
    label: "Charge",
    turns: [1, 1],
    restriction: "Defensive cards only.",
  },
  {
    id: "opening_argument",
    label: "Opening Argument",
    turns: [2, 2],
    restriction: "Narrative cards only (no attack).",
  },
  {
    id: "evidence_presentation",
    label: "Evidence",
    turns: [3, 5],
    restriction: "Evidence-category cards only.",
  },
  {
    id: "cross_examination",
    label: "Cross-Examination",
    turns: [6, 8],
    restriction: "Reaction and counter cards only.",
  },
  {
    id: "closing_argument",
    label: "Closing Argument",
    turns: [9, 9],
    restriction: "One summary card. Must cite evidence.",
  },
  {
    id: "verdict",
    label: "Verdict",
    turns: [10, 10],
    restriction: "No plays. Verdict stream resolves.",
  },
];

/** Execution-threshold — the verdict stream must stay above this. */
export const EXECUTION_THRESHOLD = -5;

export function phaseForTurn(turn: number): AuthorityPhase {
  return (
    AUTHORITY_PHASES.find((p) => turn >= p.turns[0] && turn <= p.turns[1]) ??
    AUTHORITY_PHASES[AUTHORITY_PHASES.length - 1]
  );
}

export interface AuthorityPhaseBarProps {
  currentTurn: number;
  /** Running verdict-stream balance handed off from §7.2. */
  verdictBalance: number;
}

export function AuthorityPhaseBar({
  currentTurn,
  verdictBalance,
}: AuthorityPhaseBarProps) {
  const active = useMemo(() => phaseForTurn(currentTurn), [currentTurn]);
  const belowThreshold = verdictBalance <= EXECUTION_THRESHOLD;

  return (
    <div
      data-testid="authority-phase-bar"
      data-active-phase={active.id}
      data-verdict-balance={verdictBalance}
      data-below-threshold={belowThreshold}
      className="flex w-full items-stretch border-b border-[#b8752d] bg-[#e8e8e8]/95 text-[#1c1a1a]"
    >
      {AUTHORITY_PHASES.map((phase) => {
        const isActive = phase.id === active.id;
        return (
          <div
            key={phase.id}
            data-active={isActive}
            className="flex flex-1 flex-col items-center border-r border-[#b8752d]/40 px-2 py-2 text-xs data-[active=true]:bg-[#d9a66a]/30"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#55606e]">
              T{phase.turns[0]}
              {phase.turns[0] !== phase.turns[1] && `–${phase.turns[1]}`}
            </span>
            <span className="font-medium">{phase.label}</span>
          </div>
        );
      })}
      <div
        className="flex w-24 flex-col items-center border-l-2 border-[#b8752d] px-2 py-2 text-xs"
        data-testid="verdict-balance-indicator"
      >
        <span className="text-[10px] uppercase tracking-widest text-[#55606e]">
          Stream
        </span>
        <span
          className="font-mono text-lg"
          data-below-threshold={belowThreshold}
        >
          {verdictBalance >= 0 ? "+" : ""}
          {verdictBalance}
        </span>
      </div>
    </div>
  );
}
