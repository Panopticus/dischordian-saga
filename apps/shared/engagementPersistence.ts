/* ═══════════════════════════════════════════════════════
   ENGAGEMENT PERSISTENCE — shared state shape

   The engagement layer (apps/server/routers/engagement.ts) is the
   single integration seam between the five NPC-paired engagement
   modules and the userProgress.gameData JSON blob. State lives
   under `gameData.engagement`, parallel to `gameData.crew` and
   `gameData.tradeEmpire`.

   Each system claims one slice of this state:
     • bloodlineWitnesses — Dr. Lyra Vox witness reports
     • vexCommissions     — Vex Solène commissions
     • gameMastersByApprentice — Game Masters interventions per
                                  apprentice (redeemed days + held boons)
     • engineerJournal    — Engineer journal recovery progress
     • lockeLedger        — Locke confidential-ledger completions

   Pure module: no React, no server. Mirrors the structure of
   crewPersistence.ts (createDefault + ensure + version).
   ═══════════════════════════════════════════════════════ */

import type { WitnessReport } from "./lyraVoxBloodlineWitness";
import type {
  CommissionMilestone,
  OperationalDirective,
} from "./vexSoleneCommissions";
import type { InterventionDay } from "./gameMastersTrialIntervention";
import type { CurriculumProgress } from "./engineerShadowCurriculum";
import type { LedgerPayoutKind } from "./lockeConfidentialLedger";

/* ─── PER-APPRENTICE GAME MASTERS STATE ─── */

/**
 * Game Masters intervention state, keyed by apprentice id. Each
 * apprentice has independent redemption + held-boon tracking so
 * trial state never leaks across runs.
 */
export interface ApprenticeInterventionState {
  apprenticeId: string;
  /** Sanctuary days the player has already redeemed (1-4 per the canonical 7/14/21/28). */
  redeemedDays: InterventionDay[];
  /** Days the apprentice is currently holding a Matrix Boon for. */
  heldBoonDays: InterventionDay[];
}

/* ─── COMMISSION RECEIPT (per-milestone record) ─── */

export interface CommissionReceipt {
  milestone: CommissionMilestone;
  receivedAt: number;
  /** The directive unlocked alongside this commission, captured at
   *  receipt time so a later code change can't retroactively rewrite
   *  what the player was awarded. */
  directive: OperationalDirective;
}

/* ─── PENDING PAYOUTS (Locke's cross-system accumulators) ─── */

/**
 * Each Locke ledger contract that pays out in a non-trade currency
 * (crew XP, army recruitment, celebration bond, mechronis approval,
 * trade reputation) credits the relevant kind here. The receiving
 * subsystem reads + decrements the accumulator at its convenience.
 *
 * Server-authoritative durable storage means a player can sign a
 * contract on Page A and claim the payout later from Page B — the
 * payout doesn't depend on the page where it was earned still
 * being mounted.
 */
export type PendingPayouts = Record<LedgerPayoutKind, number>;

export const ZERO_PAYOUTS: PendingPayouts = {
  crew_xp: 0,
  army_recruitment: 0,
  celebration_bond: 0,
  mechronis_approval: 0,
  trade_reputation: 0,
};

/* ─── ROOT STATE ─── */

export interface EngagementState {
  version: number;

  /* Breeding × Lyra Vox */
  bloodlineWitnesses: WitnessReport[];

  /* Army Recruiting × Vex Solène */
  vexCommissions: CommissionReceipt[];
  /** The last mission count we processed for commission triggering.
   *  Stored so the router can correctly compute milestone deltas
   *  even if the recruitment counter ticks while the player is
   *  offline (next visit replays the gap). */
  vexLastMissionCount: number;

  /* Celebration × Game Masters */
  gameMastersByApprentice: ApprenticeInterventionState[];

  /* Mechronis × the Engineer's journal */
  engineerJournal: CurriculumProgress;

  /* Trade Empire × Adjudicator Locke */
  lockeCompletedEntryIds: string[];
  /** Cross-system payouts Locke has credited but the player has
   *  not yet claimed into the receiving subsystem. */
  lockePendingPayouts: PendingPayouts;
}

export const ENGAGEMENT_STATE_VERSION = 1;

export function createDefaultEngagementState(): EngagementState {
  return {
    version: ENGAGEMENT_STATE_VERSION,
    bloodlineWitnesses: [],
    vexCommissions: [],
    vexLastMissionCount: 0,
    gameMastersByApprentice: [],
    engineerJournal: {
      pagesUnlocked: [],
      chaptersCompleted: [],
      equippedChapter: null,
    },
    lockeCompletedEntryIds: [],
    lockePendingPayouts: { ...ZERO_PAYOUTS },
  };
}

/**
 * Defensive parse of unknown input into a well-formed
 * EngagementState. Old saves missing fields get the defaults; an
 * unrecognisable shape returns the full default. Mirrors the
 * defensive ensureCrewState() pattern in crewPersistence.ts.
 */
export function ensureEngagementState(raw: unknown): EngagementState {
  const defaults = createDefaultEngagementState();
  if (!raw || typeof raw !== "object") return defaults;
  const incoming = raw as Partial<EngagementState>;
  return {
    ...defaults,
    ...incoming,
    bloodlineWitnesses: Array.isArray(incoming.bloodlineWitnesses)
      ? incoming.bloodlineWitnesses
      : [],
    vexCommissions: Array.isArray(incoming.vexCommissions)
      ? incoming.vexCommissions
      : [],
    vexLastMissionCount:
      typeof incoming.vexLastMissionCount === "number" ? incoming.vexLastMissionCount : 0,
    gameMastersByApprentice: Array.isArray(incoming.gameMastersByApprentice)
      ? incoming.gameMastersByApprentice
      : [],
    engineerJournal: incoming.engineerJournal ?? defaults.engineerJournal,
    lockeCompletedEntryIds: Array.isArray(incoming.lockeCompletedEntryIds)
      ? incoming.lockeCompletedEntryIds
      : [],
    lockePendingPayouts: ensurePendingPayouts(incoming.lockePendingPayouts),
    version: ENGAGEMENT_STATE_VERSION,
  };
}

/** Defensive parse of the payout accumulator. Missing kinds default
 *  to zero; non-numeric values are coerced to zero. */
export function ensurePendingPayouts(raw: unknown): PendingPayouts {
  const out: PendingPayouts = { ...ZERO_PAYOUTS };
  if (!raw || typeof raw !== "object") return out;
  const incoming = raw as Partial<Record<LedgerPayoutKind, unknown>>;
  for (const k of Object.keys(out) as LedgerPayoutKind[]) {
    const v = incoming[k];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      out[k] = Math.floor(v);
    }
  }
  return out;
}

/** Add a payout amount to the accumulator; returns a new object. */
export function creditPayout(
  current: PendingPayouts,
  kind: LedgerPayoutKind,
  amount: number,
): PendingPayouts {
  if (amount <= 0) return current;
  return { ...current, [kind]: current[kind] + amount };
}

/** Decrement the accumulator by an amount (clamped at 0); returns a new object. */
export function debitPayout(
  current: PendingPayouts,
  kind: LedgerPayoutKind,
  amount: number,
): PendingPayouts {
  if (amount <= 0) return current;
  return { ...current, [kind]: Math.max(0, current[kind] - amount) };
}

/* ─── PER-APPRENTICE HELPER ─── */

/**
 * Find or initialise the intervention state for an apprentice.
 * Always returns a non-null record; the caller is expected to
 * mutate (or replace) it and write the resulting state back.
 */
export function getApprenticeState(
  state: EngagementState,
  apprenticeId: string,
): ApprenticeInterventionState {
  const found = state.gameMastersByApprentice.find(a => a.apprenticeId === apprenticeId);
  if (found) return found;
  return { apprenticeId, redeemedDays: [], heldBoonDays: [] };
}

/**
 * Replace (or insert) the per-apprentice intervention record. Returns
 * a new gameMastersByApprentice array; caller composes it back into
 * the EngagementState. Pure.
 */
export function upsertApprenticeState(
  state: EngagementState,
  next: ApprenticeInterventionState,
): ApprenticeInterventionState[] {
  const without = state.gameMastersByApprentice.filter(
    a => a.apprenticeId !== next.apprenticeId,
  );
  return [...without, next];
}
