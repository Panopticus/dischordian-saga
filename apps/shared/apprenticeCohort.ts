/* ═══════════════════════════════════════════════════════
   APPRENTICE COHORT — The Concurrent-Training Lift

   Original rule (apprentices.ts:11–13): one apprentice at a
   time. The previous one must die before a new one can be
   trained. That rule made the existing
   apprenticeBanter.ts (594 lines) and apprenticeRivalries.ts
   (126 lines) data un-firable — there was never more than
   one apprentice on the ship to banter with.

   This module lifts the rule to a Cohort of 3. The structure:

     • THE ACTIVE — companion slot, on-ship daily bonding.
       This is the apprentice who appears in dialogue, gets
       gifts, runs personal quests. (≡ the original "current".)

     • THE TRAINING PAIR — 2 apprentices in their own 28-day
       trials, staggered. They live in the Celebration park,
       not on the ship. Their bond rises from milestones not
       daily check-ins. Banter and rivalry data fires when
       paired with the active apprentice for a Commons scene
       or when a trial day overlaps.

   When the active apprentice graduates, dies, or is
   sacrificed, the player promotes one of the training pair
   into the active slot and recruits a new training-pair
   replacement. The pipeline is a rolling carousel rather
   than a sequence.

   Cross-cohort dynamics (the BioWare beat):
     • The Active observes the Training Pair's stage 3 choice
       and reacts (their personal quest gains a sub-task).
     • If two cohort members share a Doctrine, they pull each
       other's bond up (+0.4/day each).
     • If they hold dissonant Doctrines, they pull each other's
       corruption up (+0.3/day each).
     • A betrayal in the Training Pair triggers a forced
       dialogue with the Active about whether to harbor or
       expose them.

   Pure data + rules. The cohort state lives in a new DB table
   (apprenticeCohortSlots) — see schema.ts. This module is the
   logic layer.
   ═══════════════════════════════════════════════════════ */

import type { Apprentice } from "./apprentices";
import type { DoctrineId } from "./apprenticeDoctrines";
import { combinedBondMultiplier, combinedCorruptionMultiplier } from "./apprenticeDoctrines";

/* ─── Types ─── */

export type CohortSlotId = "active" | "training_a" | "training_b";

export interface CohortSlot {
  slotId: CohortSlotId;
  apprenticeId: string | null;
  /** Doctrine selected for this slot's apprentice. */
  doctrineId: DoctrineId | null;
  /** Day in trial — trainings are staggered so the pair rarely
   *  share an audit day. */
  trialDay: number;
  /** Wall-clock when the slot was filled. */
  filledAt: number | null;
}

export interface CohortState {
  slots: Record<CohortSlotId, CohortSlot>;
  /** Cumulative count of apprentices the player has ever recruited.
   *  Drives the title-grant pipeline (titleUnlockService). */
  totalRecruited: number;
  /** Cumulative count of apprentices who have graduated. */
  totalGraduated: number;
  /** Cumulative count of apprentices who have fallen. */
  totalFallen: number;
}

/* ─── Slot rules ─── */

export const COHORT_SLOT_IDS: readonly CohortSlotId[] = ["active", "training_a", "training_b"] as const;

export function emptyCohortState(): CohortState {
  return {
    slots: {
      active: emptySlot("active"),
      training_a: emptySlot("training_a"),
      training_b: emptySlot("training_b"),
    },
    totalRecruited: 0,
    totalGraduated: 0,
    totalFallen: 0,
  };
}

function emptySlot(id: CohortSlotId): CohortSlot {
  return { slotId: id, apprenticeId: null, doctrineId: null, trialDay: 0, filledAt: null };
}

/** True if the slot is occupied. */
export function isSlotOccupied(slot: CohortSlot): boolean {
  return slot.apprenticeId !== null;
}

/** True if any training slot has capacity. */
export function hasTrainingCapacity(state: CohortState): boolean {
  return !isSlotOccupied(state.slots.training_a) || !isSlotOccupied(state.slots.training_b);
}

/** Returns the next empty training slot id, or null if both full. */
export function nextEmptyTrainingSlot(state: CohortState): CohortSlotId | null {
  if (!isSlotOccupied(state.slots.training_a)) return "training_a";
  if (!isSlotOccupied(state.slots.training_b)) return "training_b";
  return null;
}

/** True if the active slot has capacity. */
export function hasActiveCapacity(state: CohortState): boolean {
  return !isSlotOccupied(state.slots.active);
}

/* ─── Recruitment + promotion ─── */

export function recruitIntoSlot(
  state: CohortState,
  slotId: CohortSlotId,
  apprentice: Apprentice,
  doctrineId: DoctrineId,
): CohortState {
  if (isSlotOccupied(state.slots[slotId])) {
    throw new Error(`Cohort slot ${slotId} is occupied by ${state.slots[slotId].apprenticeId}`);
  }
  const next: CohortState = {
    ...state,
    totalRecruited: state.totalRecruited + 1,
    slots: { ...state.slots, [slotId]: {
      slotId,
      apprenticeId: apprentice.id,
      doctrineId,
      trialDay: apprentice.trialDay,
      filledAt: Date.now(),
    } },
  };
  return next;
}

/**
 * Promote a training apprentice into the active slot. Caller verifies
 * the active slot is free; this throws if not.
 */
export function promoteToActive(
  state: CohortState,
  fromSlot: "training_a" | "training_b",
): CohortState {
  if (isSlotOccupied(state.slots.active)) {
    throw new Error("Active slot already occupied; current apprentice must vacate first.");
  }
  const trainingSlot = state.slots[fromSlot];
  if (!isSlotOccupied(trainingSlot)) {
    throw new Error(`Training slot ${fromSlot} is empty.`);
  }
  return {
    ...state,
    slots: {
      ...state.slots,
      active: { ...trainingSlot, slotId: "active" },
      [fromSlot]: emptySlot(fromSlot),
    },
  };
}

/** Vacate a slot (graduation, death, sacrifice). */
export function vacateSlot(
  state: CohortState,
  slotId: CohortSlotId,
  exitKind: "graduated" | "fallen" | "promoted_out" | "sacrificed",
): CohortState {
  return {
    ...state,
    totalGraduated: state.totalGraduated + (exitKind === "graduated" ? 1 : 0),
    totalFallen: state.totalFallen + (exitKind === "fallen" ? 1 : 0),
    slots: { ...state.slots, [slotId]: emptySlot(slotId) },
  };
}

/* ─── Cross-cohort dynamics ─── */

export interface CrossCohortPullup {
  /** Each occupied slot's bond delta from cross-cohort effects, per day. */
  bondDailyDelta: Record<CohortSlotId, number>;
  /** Each occupied slot's corruption delta from cross-cohort effects, per day. */
  corruptionDailyDelta: Record<CohortSlotId, number>;
  /** Diagnostic notes for the cohort UI panel. */
  notes: string[];
}

/**
 * Compute per-day bond / corruption pulls between cohort members. Pulls
 * are doctrine-driven: shared doctrine = bond resonance; dissonant
 * doctrine = corruption pressure. Pulls only fire when both
 * participating slots are occupied.
 */
export function computeCrossCohortPullup(state: CohortState): CrossCohortPullup {
  const out: CrossCohortPullup = {
    bondDailyDelta: { active: 0, training_a: 0, training_b: 0 },
    corruptionDailyDelta: { active: 0, training_a: 0, training_b: 0 },
    notes: [],
  };
  const occupied = COHORT_SLOT_IDS.filter(id => isSlotOccupied(state.slots[id]));
  if (occupied.length < 2) return out;
  for (let i = 0; i < occupied.length; i++) {
    for (let j = i + 1; j < occupied.length; j++) {
      const a = state.slots[occupied[i]];
      const b = state.slots[occupied[j]];
      if (!a.doctrineId || !b.doctrineId) continue;
      if (a.doctrineId === b.doctrineId) {
        out.bondDailyDelta[a.slotId] += 0.4;
        out.bondDailyDelta[b.slotId] += 0.4;
        out.notes.push(
          `${a.slotId} and ${b.slotId} share doctrine ${a.doctrineId}: +0.4 bond/day each.`,
        );
      } else if (areDoctrinesDissonant(a.doctrineId, b.doctrineId)) {
        out.corruptionDailyDelta[a.slotId] += 0.3;
        out.corruptionDailyDelta[b.slotId] += 0.3;
        out.notes.push(
          `${a.slotId} (${a.doctrineId}) and ${b.slotId} (${b.doctrineId}) hold dissonant doctrines: +0.3 corruption/day each.`,
        );
      }
    }
  }
  return out;
}

const DOCTRINE_DISSONANCE_PAIRS: ReadonlyArray<readonly [DoctrineId, DoctrineId]> = [
  ["compliant_mouth", "heretical_quiet"],
  ["compliant_mouth", "human_remainder"],
  ["cold_hand", "human_remainder"],
  ["cold_hand", "heretical_quiet"], // both Architect-bait but for opposite reasons
];

function areDoctrinesDissonant(a: DoctrineId, b: DoctrineId): boolean {
  return DOCTRINE_DISSONANCE_PAIRS.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
}

/* ─── Resolution helpers (combined per-slot daily math) ─── */

export interface ResolvedDailyMath {
  /** Bond multiplier including doctrine + cross-cohort pulls. */
  bondMultiplier: number;
  /** Corruption multiplier including doctrine + cross-cohort pulls. */
  corruptionMultiplier: number;
  /** Flat per-day bond delta (cross-cohort additive, not multiplied). */
  bondAdditive: number;
  /** Flat per-day corruption delta. */
  corruptionAdditive: number;
}

export function resolveDailyMath(
  state: CohortState,
  slotId: CohortSlotId,
  apprenticeArchetype: Apprentice["archetype"],
): ResolvedDailyMath {
  const slot = state.slots[slotId];
  if (!isSlotOccupied(slot) || !slot.doctrineId) {
    return { bondMultiplier: 1, corruptionMultiplier: 1, bondAdditive: 0, corruptionAdditive: 0 };
  }
  const pull = computeCrossCohortPullup(state);
  return {
    bondMultiplier: combinedBondMultiplier(apprenticeArchetype, slot.doctrineId),
    corruptionMultiplier: combinedCorruptionMultiplier(apprenticeArchetype, slot.doctrineId),
    bondAdditive: pull.bondDailyDelta[slotId],
    corruptionAdditive: pull.corruptionDailyDelta[slotId],
  };
}

/* ─── Triangle-event hooks ───
   When one cohort member crosses a betrayal threshold while
   another is bonded above 70, a triangle event fires. The
   triangle event is a forced dialogue with the bonded one
   about whether to expose, harbor, or break the falling one. */

export interface TriangleEventTrigger {
  fallingSlot: CohortSlotId;
  observingSlot: CohortSlotId;
  /** "warning" | "turn" | "declaration" — same stages as betrayal cascade. */
  stage: "warning" | "turn" | "declaration";
}

/**
 * Detect triangle events. Caller passes per-slot bond/corruption
 * snapshots; the function checks for cross-slot pressures.
 */
export function detectTriangleEvents(
  state: CohortState,
  perSlotState: Record<CohortSlotId, { bond: number; corruption: number } | null>,
): TriangleEventTrigger[] {
  const out: TriangleEventTrigger[] = [];
  for (const fallingId of COHORT_SLOT_IDS) {
    const falling = perSlotState[fallingId];
    if (!falling) continue;
    const stage =
      falling.corruption >= 90 ? "declaration" :
      falling.corruption >= 75 ? "turn" :
      falling.corruption >= 60 ? "warning" : null;
    if (!stage) continue;
    for (const observingId of COHORT_SLOT_IDS) {
      if (observingId === fallingId) continue;
      const observing = perSlotState[observingId];
      if (!observing) continue;
      if (observing.bond >= 70) {
        out.push({ fallingSlot: fallingId, observingSlot: observingId, stage });
      }
    }
  }
  return out;
}
