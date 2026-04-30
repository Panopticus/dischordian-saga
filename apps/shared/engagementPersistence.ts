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
    version: ENGAGEMENT_STATE_VERSION,
  };
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
