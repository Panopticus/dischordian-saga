/* ═══════════════════════════════════════════════════════
   DISCHORDIA CYCLE SERVICE — community-wide Light/Dark meter.

   Witnessing Narrative Proposal §3. Holds the galactic bulb
   state that multiple players write to via gameplay actions.

   Storage model:
   - In-memory `singletonState` is the authoritative cache.
     Every read (getState) is synchronous and returns this
     cache for snappy tRPC responses.
   - On server startup, `hydrate()` loads the state from the
     `dischordia_cycle_state` MySQL row (migration 0036) into
     the cache. If the row doesn't exist yet, we write the
     defaults back and start fresh.
   - Every mutation (applyEnergy, applyRawDelta, triggerX, etc.)
     updates the cache synchronously and fires a fire-and-forget
     DB write. Failures are logged but do not block the caller —
     the cache stays consistent even if the DB momentarily drops.
   - When `getDb()` returns null (tests, dev without DB), the
     service degrades gracefully to in-memory-only mode. The
     22 existing service tests exercise exactly this code path.

   Usage from a tRPC router:
     import { dischordiaCycleService } from "../services/dischordiaCycleService";
     const state = dischordiaCycleService.getState();
     dischordiaCycleService.applyEnergy("card_battle_light_win", userId);

   Usage from server startup:
     await dischordiaCycleService.hydrate();
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
import { getDb } from "../db";
import {
  dischordiaCycleState as cycleStateTable,
  dischordiaEnergyEvents as energyEventsTable,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../logger";

/** The single-row primary key for the cycle state table. */
const CYCLE_ROW_ID = 1;

/* ─── IN-MEMORY CACHE ─── */

let singletonState: DischordiaCycleState = { ...DEFAULT_DISCHORDIA_CYCLE_STATE };

/**
 * In-memory audit trail. Still kept for admin debug views that
 * want cheap recent-history access without round-tripping to
 * MySQL. The authoritative record is the
 * `dischordia_energy_events` table.
 */
interface EnergyEventRecord {
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

/* ─── DB PERSISTENCE HELPERS ─── */

/**
 * Write the current singleton back to the cycle state row.
 * Fire-and-forget: swallows errors into logger.error so the
 * cache update in the caller is never blocked.
 */
async function persistStateToDb(state: DischordiaCycleState): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .insert(cycleStateTable)
      .values({
        id: CYCLE_ROW_ID,
        phase: state.phase,
        phaseStartedAt: new Date(state.phaseStartedAt),
        cycleNumber: state.cycleNumber,
        lightEnergy: state.lightEnergy,
        darkEnergy: state.darkEnergy,
        vortexProximity: state.vortexProximity,
        energyBalance: state.energyBalance,
        history: state.history as unknown as Array<Record<string, unknown>>,
      })
      .onDuplicateKeyUpdate({
        set: {
          phase: state.phase,
          phaseStartedAt: new Date(state.phaseStartedAt),
          cycleNumber: state.cycleNumber,
          lightEnergy: state.lightEnergy,
          darkEnergy: state.darkEnergy,
          vortexProximity: state.vortexProximity,
          energyBalance: state.energyBalance,
          history: state.history as unknown as Array<Record<string, unknown>>,
        },
      });
  } catch (e) {
    logger.error("[DischordiaCycle] Failed to persist state:", e);
  }
}

/**
 * Insert an audit row into dischordia_energy_events.
 * Fire-and-forget — same error handling as persistStateToDb.
 */
async function persistAuditToDb(record: EnergyEventRecord): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(energyEventsTable).values({
      userId: record.userId,
      actionId: record.actionId,
      lightDelta: record.lightDelta,
      darkDelta: record.darkDelta,
      vortexDelta: record.vortexDelta,
    });
  } catch (e) {
    logger.error("[DischordiaCycle] Failed to persist audit:", e);
  }
}

/* ─── SERVICE OBJECT ─── */

export const dischordiaCycleService = {
  /**
   * Load the canonical cycle state from MySQL into the cache.
   * Called once at server startup. If the DB has no row yet
   * (fresh install), writes the defaults back and returns
   * them.
   *
   * Safe to call multiple times — each call overwrites the
   * cache with the latest DB snapshot. When `getDb()` returns
   * null, this is a no-op and the cache keeps its current
   * value.
   */
  async hydrate(): Promise<DischordiaCycleState> {
    const db = await getDb();
    if (!db) {
      logger.info("[DischordiaCycle] hydrate: no DB available, staying in-memory");
      return this.getState();
    }
    try {
      const rows = await db
        .select()
        .from(cycleStateTable)
        .where(eq(cycleStateTable.id, CYCLE_ROW_ID))
        .limit(1);
      if (rows.length === 0) {
        // Fresh install — seed the row with defaults.
        await persistStateToDb(DEFAULT_DISCHORDIA_CYCLE_STATE);
        singletonState = { ...DEFAULT_DISCHORDIA_CYCLE_STATE };
        logger.info("[DischordiaCycle] hydrate: seeded fresh row with defaults");
        return this.getState();
      }
      const row = rows[0];
      singletonState = {
        phase: row.phase as DischordiaCycleState["phase"],
        phaseStartedAt: row.phaseStartedAt.toISOString(),
        cycleNumber: row.cycleNumber,
        lightEnergy: row.lightEnergy,
        darkEnergy: row.darkEnergy,
        vortexProximity: row.vortexProximity,
        energyBalance: row.energyBalance as DischordiaCycleState["energyBalance"],
        history:
          (row.history as unknown as DischordiaCycleState["history"]) ?? [],
      };
      logger.info(
        `[DischordiaCycle] hydrate: loaded phase=${singletonState.phase} light=${singletonState.lightEnergy} dark=${singletonState.darkEnergy}`,
      );
    } catch (e) {
      logger.error("[DischordiaCycle] hydrate failed:", e);
    }
    return this.getState();
  },

  /**
   * Return a snapshot of the current cycle state. Safe to
   * serialize to JSON for tRPC transport. Pure read from the
   * in-memory cache — never blocks on IO.
   */
  getState(): DischordiaCycleState {
    return { ...singletonState, history: [...singletonState.history] };
  },

  /**
   * Apply a §3.6 ENERGY_GAIN_TABLE row to the singleton.
   * Updates the cache synchronously; persists to DB
   * fire-and-forget.
   */
  applyEnergy(
    actionId: EnergyGainActionId,
    userId: number | null = null,
  ): DischordiaCycleState {
    const before = singletonState;
    const after = applyEnergyGain(before, actionId);
    singletonState = after;
    const record: EnergyEventRecord = {
      userId,
      actionId,
      lightDelta: after.lightEnergy - before.lightEnergy,
      darkDelta: after.darkEnergy - before.darkEnergy,
      vortexDelta: after.vortexProximity - before.vortexProximity,
      timestamp: Date.now(),
    };
    recordAudit(record);
    void persistStateToDb(after);
    void persistAuditToDb(record);
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
    const record: EnergyEventRecord = {
      userId,
      actionId: source ?? "raw_delta",
      lightDelta: light,
      darkDelta: dark,
      vortexDelta: vortex,
      timestamp: Date.now(),
    };
    recordAudit(record);
    void persistStateToDb(singletonState);
    void persistAuditToDb(record);
    return this.getState();
  },

  /**
   * Explicitly trigger the §3.3 Vortex Advance community event.
   */
  triggerVortexAdvance(): DischordiaCycleState {
    singletonState = pureTriggerVortexAdvance(singletonState);
    logger.info("[DischordiaCycle] Vortex Advance triggered");
    void persistStateToDb(singletonState);
    return this.getState();
  },

  /**
   * Explicitly trigger the §3.4 Reclamation community event.
   */
  triggerReclamation(): DischordiaCycleState {
    singletonState = pureTriggerReclamation(singletonState);
    logger.info("[DischordiaCycle] Reclamation triggered");
    void persistStateToDb(singletonState);
    return this.getState();
  },

  /**
   * Complete the current reclamation event with a count of
   * sectors that came back online.
   */
  completeReclamation(sectorsReclaimed: number): DischordiaCycleState {
    singletonState = pureCompleteReclamation(singletonState, sectorsReclaimed);
    logger.info(`[DischordiaCycle] Reclamation completed: ${sectorsReclaimed} sectors`);
    void persistStateToDb(singletonState);
    return this.getState();
  },

  /**
   * Check whether the Vortex Advance trigger condition is met
   * given the current lit-sector ratio.
   */
  checkVortexTrigger(litSectorRatio: number): boolean {
    return shouldTriggerVortexAdvance(singletonState, litSectorRatio);
  },

  /**
   * Return the last N entries from the in-memory audit trail.
   * For DB-backed historical queries, use the
   * `getAuditTrailFromDb` method instead.
   */
  getRecentAuditTrail(limit = 50): ReadonlyArray<EnergyEventRecord> {
    return auditTrail.slice(-limit).reverse();
  },

  /**
   * Reset the in-memory state to defaults. Does NOT touch the
   * DB — exposed for tests and admin tooling only.
   */
  __resetForTests(): void {
    singletonState = { ...DEFAULT_DISCHORDIA_CYCLE_STATE };
    auditTrail.length = 0;
  },
};
