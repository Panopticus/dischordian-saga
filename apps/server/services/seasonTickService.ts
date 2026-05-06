/* ═══════════════════════════════════════════════════════
   SEASON TICK SERVICE — drives the season clock forward
   and fires per-user agenda ticks. Phase 6 of the items-
   matter / Game-of-Thrones arc — the engine that makes the
   world actually move.

   Two responsibilities:
   1. Phase transitions. When the current phase's
      phaseEndsAt has passed, advance to the next phase.
      Compute the new phaseEndsAt from SEASON_PHASE_DURATION_MS.
      On entry to `prologue`, increment seasonNumber and
      pick the next declaration.
   2. Agenda tick. Inside the `running` phase, when
      lastTickAt + SEASON_TICK_INTERVAL_MS has passed,
      increment tickNumber and run tickUserAgendas() for
      every active user (defined as: at least one row in
      tradeSubHouseReputation, signalling they've engaged
      with the political layer at all).

   Idempotent: each tick of runSeasonTick() compares
   wall-clock to the persisted state and applies whatever
   advances are due. Calling it twice in quick succession
   is a no-op the second time.

   Wired from apps/server/_core/index.ts as a 5-minute
   setInterval in production, mirroring the Living Universe
   pattern. Tests can call runSeasonTick() directly.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeSubHouseReputation } from "../../db/schema";
import { logger } from "../logger";

import {
  SEASON_PHASE_DURATION_MS,
  SEASON_TICK_INTERVAL_MS,
  nextPhase,
  type SeasonClockState,
  type SeasonDeclaration,
} from "@shared/tradeEmpire/season";
import { selectDeclarationForSeason } from "@shared/tradeEmpire/declarations";

import { seasonClockService } from "./seasonClockService";
import { tickUserAgendas } from "./agendaEngine";
import { postPublicKnowledge } from "./publicKnowledgeService";
import { maybeGenerateDemandForUser, sweepExpiredDemands } from "./demandService";

export interface SeasonTickOutcome {
  /** True if any state was changed during this run. */
  changed: boolean;
  /** Phases entered during this run (often 0 or 1). */
  phasesEntered: ReadonlyArray<string>;
  /** Number of agenda ticks fired (sum across users). */
  agendaTicks: number;
  /** New season number if a new season started. */
  newSeasonNumber?: number;
}

/**
 * Compute the next state given a current state and a wall clock.
 * Pure function — no DB, no public-knowledge writes. Returned
 * `transitions` lists every phase entered (could be > 1 if many
 * intervals elapsed since the last tick).
 *
 * Pulled out so unit tests can verify phase math without mocking
 * the DB.
 */
export function computeSeasonAdvance(
  state: SeasonClockState,
  now: number,
): {
  next: SeasonClockState;
  transitions: ReadonlyArray<{
    enteredPhase: string;
    newSeasonNumber?: number;
    declaration?: SeasonDeclaration;
  }>;
  agendaTickFired: boolean;
} {
  let cur: SeasonClockState = { ...state };
  const transitions: Array<{
    enteredPhase: string;
    newSeasonNumber?: number;
    declaration?: SeasonDeclaration;
  }> = [];

  // Phase transitions: cascade until the now-clock no longer
  // overruns the current phase's end.
  while (cur.phaseEndsAt !== null && cur.phaseEndsAt <= now) {
    const incoming = nextPhase(cur.phase);
    const startedAt = cur.phaseEndsAt;
    const duration = SEASON_PHASE_DURATION_MS[incoming];
    const endsAt = startedAt + duration;

    let newSeasonNumber = cur.seasonNumber;
    let declaration: SeasonDeclaration | null = cur.declaration;
    let tickNumber = cur.tickNumber;
    let lastTickAt: number | null = cur.lastTickAt;

    // Entering prologue: next season begins.
    if (incoming === "prologue") {
      newSeasonNumber = cur.seasonNumber + 1;
      declaration = selectDeclarationForSeason(newSeasonNumber);
      tickNumber = 0;
      lastTickAt = null;
    }
    // Leaving prologue (entering running): if the new season's
    // declaration was selected at boot, refresh now to be safe.
    if (incoming === "running" && !declaration) {
      declaration = selectDeclarationForSeason(cur.seasonNumber);
    }

    cur = {
      ...cur,
      phase: incoming,
      phaseStartedAt: startedAt,
      phaseEndsAt: endsAt,
      seasonNumber: newSeasonNumber,
      declaration,
      tickNumber,
      lastTickAt,
    };
    transitions.push({
      enteredPhase: incoming,
      newSeasonNumber: newSeasonNumber !== state.seasonNumber ? newSeasonNumber : undefined,
      declaration: declaration ?? undefined,
    });
  }

  // Agenda tick: only inside running. Tick when interval has
  // elapsed since the last tick (or since the running phase began).
  let agendaTickFired = false;
  if (cur.phase === "running") {
    const lastRef = cur.lastTickAt ?? cur.phaseStartedAt;
    if (now - lastRef >= SEASON_TICK_INTERVAL_MS) {
      cur = { ...cur, tickNumber: cur.tickNumber + 1, lastTickAt: now };
      agendaTickFired = true;
    }
  }

  return { next: cur, transitions, agendaTickFired };
}

/**
 * Server-side runner. Reads current state, computes advance,
 * persists, posts season_declaration events on phase enters that
 * carry a new declaration, and fires agenda ticks for active users.
 */
export async function runSeasonTick(now: number = Date.now()): Promise<SeasonTickOutcome> {
  await seasonClockService.hydrate();
  const before = seasonClockService.getState();
  const { next, transitions, agendaTickFired } = computeSeasonAdvance(before, now);

  let agendaTicks = 0;
  const phasesEntered = transitions.map(t => t.enteredPhase);

  if (transitions.length > 0 || agendaTickFired) {
    await seasonClockService.setState(next);
  }

  // Side-effects: declarations + active-user agenda ticks.
  for (const t of transitions) {
    if (t.declaration) {
      await postPublicKnowledge({
        userId: null,
        eventKind: "season_declaration",
        subjectHouseKey: t.declaration.issuingHouse,
        summary: t.declaration.headline,
        payload: {
          declarationKey: t.declaration.declarationKey,
          targetHouse: t.declaration.targetHouse,
          rivalryModifier: t.declaration.rivalryModifier,
          seasonNumber: next.seasonNumber,
        },
        seasonNumber: next.seasonNumber,
      }).catch(err => logger.warn("[seasonTick] declaration post failed:", err));
    }
  }

  if (agendaTickFired) {
    const userIds = await listActiveUserIds();
    for (const userId of userIds) {
      try {
        const results = await tickUserAgendas(userId);
        agendaTicks += results.length;
      } catch (err) {
        logger.error("[seasonTick] tickUserAgendas failed:", err);
      }
      // Phase 7: roll a demand for each active user once per agenda tick.
      try {
        await maybeGenerateDemandForUser(userId);
      } catch (err) {
        logger.error("[seasonTick] demand generation failed:", err);
      }
    }
  }

  // Sweep expired demands every run (cheap when the table is small).
  try {
    await sweepExpiredDemands();
  } catch (err) {
    logger.error("[seasonTick] demand sweep failed:", err);
  }

  return {
    changed: transitions.length > 0 || agendaTickFired,
    phasesEntered,
    agendaTicks,
    newSeasonNumber: transitions.find(t => t.newSeasonNumber !== undefined)?.newSeasonNumber,
  };
}

/**
 * Active users for agenda-tick purposes: anyone with at least one
 * sub-house reputation row. Avoids ticking against the entire user
 * table (most of whom have never engaged the political layer).
 *
 * For larger user bases this should batch / paginate; phase-6 keeps
 * it simple and fires each user sequentially.
 */
async function listActiveUserIds(): Promise<ReadonlyArray<number>> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .selectDistinct({ userId: tradeSubHouseReputation.userId })
      .from(tradeSubHouseReputation);
    return rows.map(r => r.userId);
  } catch (err) {
    logger.error("[seasonTick] listActiveUserIds failed:", err);
    return [];
  }
}
