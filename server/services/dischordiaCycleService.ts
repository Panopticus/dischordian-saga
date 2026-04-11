/* ═══════════════════════════════════════════════════════
   DISCHORDIA CYCLE SERVICE — community-wide Light/Dark meter.

   Witnessing Narrative Proposal §3. Holds the galactic bulb
   state that multiple players write to via gameplay actions.

   This is the FIRST community-wide meter module in the repo.
   Unlike the pressure/universe system (which is event-driven
   and persisted to MySQL), the Dischordia Cycle is currently
   held in-memory as a singleton. The state resets when the
   server restarts.

   DB persistence is a follow-up task — the schema is not yet
   defined, and gating this service behind a schema migration
   would block the client sync work. When persistence ships:

     1. Add a `dischordiaCycleState` table (single row) and
        a `dischordiaEnergyEvents` audit table.
     2. Replace the in-memory `singletonState` below with a
        load-from-DB on service init and a write-through on
        every mutation.
     3. The public API of this service does not change; only
        the storage backend moves behind the scenes.

   Usage from a tRPC router:
     import { dischordiaCycleService } from "../services/dischordiaCycleService";
     const state = dischordiaCycleService.getState();
     dischordiaCycleService.applyEnergy("card_battle_light_win", userId);
   ═══════════════════════════════════════════════════════ */

import {
  applyEnergyGain,
  clampProximity,
  completeReclamation as pureCompleteReclamation,
  DEFAULT_DISCHORDIA_CYCLE_STATE,
  recomputeDerived,
  shouldTriggerVortexAdvance,
  triggerReclamation as pureTriggerReclamation,
  triggerVortexAdvance as pureTriggerVortexAdvance,
  type DischordiaCycleState,
  type EnergyGainActionId,
} from "@shared/dischordiaCycle";
import { logger } from "../logger";

/* ─── SINGLETON STORAGE ─── */

/**
 * Module-level state. This is the community-wide cycle — one
 * instance per server process. Tests can call
 * `dischordiaCycleService.__resetForTests()` to reset between
 * cases without having to tear down the module.
 */
let singletonState: DischordiaCycleState = { ...DEFAULT_DISCHORDIA_CYCLE_STATE };

/**
 * Audit trail of energy events. Kept in-memory alongside the
 * state. When DB persistence lands, this gets replaced with a
 * `dischordiaEnergyEvents` table insert.
 */
interface EnergyEventRecord {
  /** The player that caused the gain (null = system/server-initiated). */
  userId: number | null;
  actionId: string;
  lightDelta: number;
  darkDelta: number;
  vortexDelta: number;
  timestamp: number;
}

const auditTrail: EnergyEventRecord[] = [];
const MAX_AUDIT_TRAIL = 1000;

function recordAudit(record: EnergyEventRecord): void {
  auditTrail.push(record);
  if (auditTrail.length > MAX_AUDIT_TRAIL) {
    auditTrail.splice(0, auditTrail.length - MAX_AUDIT_TRAIL);
  }
}

/* ─── SERVICE OBJECT ─── */

export const dischordiaCycleService = {
  /**
   * Return a snapshot of the current cycle state. Safe to
   * serialize to JSON for tRPC transport. Pure read — never
   * mutates.
   */
  getState(): DischordiaCycleState {
    return { ...singletonState, history: [...singletonState.history] };
  },

  /**
   * Apply a §3.6 ENERGY_GAIN_TABLE row to the singleton.
   * Returns the new state. Logs the action to the audit trail.
   */
  applyEnergy(
    actionId: EnergyGainActionId,
    userId: number | null = null,
  ): DischordiaCycleState {
    const before = singletonState;
    const after = applyEnergyGain(before, actionId);
    singletonState = after;
    recordAudit({
      userId,
      actionId,
      lightDelta: after.lightEnergy - before.lightEnergy,
      darkDelta: after.darkEnergy - before.darkEnergy,
      vortexDelta: after.vortexProximity - before.vortexProximity,
      timestamp: Date.now(),
    });
    return this.getState();
  },

  /**
   * Apply a raw light/dark/vortex delta bypassing the gain table.
   * Used for slideshow rewards and one-off community events.
   */
  applyRawDelta(delta: {
    light?: number;
    dark?: number;
    vortex?: number;
    userId?: number | null;
    source?: string;
  }): DischordiaCycleState {
    const { light = 0, dark = 0, vortex = 0, userId = null, source } = delta;
    const before = singletonState;
    singletonState = recomputeDerived({
      ...before,
      lightEnergy: before.lightEnergy + light,
      darkEnergy: before.darkEnergy + dark,
      vortexProximity: clampProximity(before.vortexProximity + vortex),
    });
    recordAudit({
      userId,
      actionId: source ?? "raw_delta",
      lightDelta: light,
      darkDelta: dark,
      vortexDelta: vortex,
      timestamp: Date.now(),
    });
    return this.getState();
  },

  /**
   * Explicitly trigger the §3.3 Vortex Advance community event.
   * Called by the server's universe tick when the lit-sector
   * ratio falls below 20% or by admin tooling.
   */
  triggerVortexAdvance(): DischordiaCycleState {
    singletonState = pureTriggerVortexAdvance(singletonState);
    logger.info("[DischordiaCycle] Vortex Advance triggered");
    return this.getState();
  },

  /**
   * Explicitly trigger the §3.4 Reclamation community event.
   */
  triggerReclamation(): DischordiaCycleState {
    singletonState = pureTriggerReclamation(singletonState);
    logger.info("[DischordiaCycle] Reclamation triggered");
    return this.getState();
  },

  /**
   * Complete the current reclamation event with a count of
   * sectors that came back online.
   */
  completeReclamation(sectorsReclaimed: number): DischordiaCycleState {
    singletonState = pureCompleteReclamation(singletonState, sectorsReclaimed);
    logger.info(`[DischordiaCycle] Reclamation completed: ${sectorsReclaimed} sectors`);
    return this.getState();
  },

  /**
   * Check whether the Vortex Advance trigger condition is met
   * given the current lit-sector ratio. Does not fire the
   * event — callers must explicitly call `triggerVortexAdvance`
   * if this returns true.
   */
  checkVortexTrigger(litSectorRatio: number): boolean {
    return shouldTriggerVortexAdvance(singletonState, litSectorRatio);
  },

  /**
   * Return the last N audit trail entries. Used by admin
   * tooling and tests. Default is 50 entries.
   */
  getRecentAuditTrail(limit = 50): ReadonlyArray<EnergyEventRecord> {
    return auditTrail.slice(-limit).reverse();
  },

  /**
   * Reset the singleton to defaults. Exposed for tests and
   * admin tooling only.
   */
  __resetForTests(): void {
    singletonState = { ...DEFAULT_DISCHORDIA_CYCLE_STATE };
    auditTrail.length = 0;
  },
};
