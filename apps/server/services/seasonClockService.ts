/* ═══════════════════════════════════════════════════════
   SEASON CLOCK SERVICE — singleton state for the political
   season. Phase 1 ships read/write + hydrate; the tick job
   that advances phases lands in phase 4 alongside agendas.

   Storage model mirrors dischordiaCycleService: in-memory
   cache is authoritative for synchronous reads, DB row is
   the durable backing store. `id = 1` is the single
   canonical row.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { seasonClockState as seasonClockTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../logger";

import {
  SEASON_PHASE_DURATION_MS,
  type SeasonClockState,
  type SeasonDeclaration,
  type SeasonPhase,
} from "@shared/tradeEmpire/season";

const SEASON_ROW_ID = 1;

const DEFAULT_STATE: SeasonClockState = {
  seasonNumber: 1,
  phase: "prologue",
  phaseStartedAt: Date.now(),
  phaseEndsAt: Date.now() + SEASON_PHASE_DURATION_MS.prologue,
  tickNumber: 0,
  lastTickAt: null,
  declaration: null,
};

let singletonState: SeasonClockState = { ...DEFAULT_STATE };
let hydrated = false;

async function persist(state: SeasonClockState): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .insert(seasonClockTable)
      .values({
        id: SEASON_ROW_ID,
        seasonNumber: state.seasonNumber,
        phase: state.phase,
        phaseStartedAt: new Date(state.phaseStartedAt),
        phaseEndsAt: state.phaseEndsAt !== null ? new Date(state.phaseEndsAt) : null,
        tickNumber: state.tickNumber,
        lastTickAt: state.lastTickAt !== null ? new Date(state.lastTickAt) : null,
        declaration: state.declaration as unknown as Record<string, unknown> | null,
      })
      .onDuplicateKeyUpdate({
        set: {
          seasonNumber: state.seasonNumber,
          phase: state.phase,
          phaseStartedAt: new Date(state.phaseStartedAt),
          phaseEndsAt: state.phaseEndsAt !== null ? new Date(state.phaseEndsAt) : null,
          tickNumber: state.tickNumber,
          lastTickAt: state.lastTickAt !== null ? new Date(state.lastTickAt) : null,
          declaration: state.declaration as unknown as Record<string, unknown> | null,
        },
      });
  } catch (err) {
    logger.error("[seasonClock] persist failed:", err);
  }
}

export const seasonClockService = {
  /**
   * Load state from DB into the in-memory cache. Call once at server
   * startup. If no row exists, write defaults so subsequent reads
   * are well-formed.
   */
  async hydrate(): Promise<void> {
    if (hydrated) return;
    const db = await getDb();
    if (!db) {
      hydrated = true;
      return;
    }
    try {
      const rows = await db
        .select()
        .from(seasonClockTable)
        .where(eq(seasonClockTable.id, SEASON_ROW_ID))
        .limit(1);
      if (rows.length === 0) {
        await persist(singletonState);
      } else {
        const r = rows[0];
        singletonState = {
          seasonNumber: r.seasonNumber,
          phase: r.phase as SeasonPhase,
          phaseStartedAt: r.phaseStartedAt.getTime(),
          phaseEndsAt: r.phaseEndsAt ? r.phaseEndsAt.getTime() : null,
          tickNumber: r.tickNumber,
          lastTickAt: r.lastTickAt ? r.lastTickAt.getTime() : null,
          declaration: (r.declaration as SeasonDeclaration | null) ?? null,
        };
      }
    } catch (err) {
      logger.error("[seasonClock] hydrate failed; using defaults:", err);
    } finally {
      hydrated = true;
    }
  },

  /** Synchronous read of the cached state. */
  getState(): SeasonClockState {
    return { ...singletonState };
  },

  /**
   * Replace the singleton with a new state and write through to DB.
   * Used by the tick job (phase 4) and by admin tools. Phase 1 only
   * surfaces this for tests.
   */
  async setState(next: SeasonClockState): Promise<void> {
    singletonState = { ...next };
    await persist(singletonState);
  },

  /** Test hook only. Resets cache; production code must not call. */
  _resetForTests(): void {
    singletonState = { ...DEFAULT_STATE, phaseStartedAt: Date.now(), phaseEndsAt: Date.now() + SEASON_PHASE_DURATION_MS.prologue };
    hydrated = false;
  },
};
