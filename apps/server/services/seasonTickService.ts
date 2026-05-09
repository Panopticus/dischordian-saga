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
import { tradeSectorReputation, tradeSubHouseReputation } from "../../db/schema";
import { and, eq, lt } from "drizzle-orm";
import { logger } from "../logger";

import {
  SEASON_PHASE_DURATION_MS,
  SEASON_TICK_INTERVAL_MS,
  nextPhase,
  type SeasonClockState,
  type SeasonDeclaration,
} from "@shared/tradeEmpire/season";
import { selectDeclarationForSeason } from "@shared/tradeEmpire/declarations";
import {
  pickEventsToFire,
  REFERENCE_GALACTIC_EVENTS,
  type GalacticEventDef,
  type TriggerContext,
} from "@shared/tradeEmpire/galacticEvents";
import { pickFrontierRotation } from "@shared/tradeEmpire/frontier";

import { seasonClockService } from "./seasonClockService";
import { tickUserAgendas } from "./agendaEngine";
import { postPublicKnowledge, getRecentPublicKnowledge } from "./publicKnowledgeService";
import { applySubHouseRepDelta } from "./subHouseReputationService";
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

    // Entering prologue: next season begins. Frontier rotation
    // (§8.10) is dispatched from runSeasonTick once the transition
    // list is built, since it requires async helpers.
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

  // §8.10 Frontier Rotation — fire on the interregnum→prologue
  // boundary. Convergence Climax open phase freezes rotation.
  if (transitions.some(t => t.enteredPhase === "prologue")) {
    try {
      const { rotateFrontier } = await import("./frontierRotationService");
      const { getConvergenceClimaxState } = await import("./convergenceClimaxService");
      const climax = await getConvergenceClimaxState();
      rotateFrontier(next.seasonNumber, climax?.phase === "open");
    } catch (err) {
      logger.warn("[seasonTick] frontier rotate failed:", err);
    }
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
    // §8.4 Living Sector Economies — once per agenda tick, simulate
    // NPC factions trading without the player. Saturation moves
    // whether or not anyone logs in.
    try {
      const { runNpcDriftTick } = await import("./npcEconomyDriftService");
      await runNpcDriftTick();
    } catch (err) {
      logger.warn("[seasonTick] npc drift failed:", err);
    }
  }

  // Phase B: galactic events. World-level events fire whether or not
  // the player is active; the universe takes its own actions. Events
  // post to the public-knowledge feed and apply sub-house rep deltas.
  // These fire on every run that advances the season clock OR an
  // agenda tick — i.e. whenever something happened.
  if (transitions.length > 0 || agendaTickFired) {
    try {
      const phaseEntered = transitions.length > 0
        ? transitions[transitions.length - 1].enteredPhase
        : undefined;
      const recentNews = getRecentPublicKnowledge(50);
      const recentFlags = new Set<string>();
      for (const item of recentNews) {
        const payload = item.payload as { publicFlag?: string } | null;
        if (payload?.publicFlag) recentFlags.add(payload.publicFlag);
      }
      const triggerCtx: TriggerContext = {
        phaseEntered,
        recentPublicFlags: recentFlags,
        resolvedAgendaKeys: new Set<string>(),
      };
      const fired = pickEventsToFire(REFERENCE_GALACTIC_EVENTS, triggerCtx);
      for (const event of fired) {
        await fireGalacticEvent(event, next.seasonNumber);
      }
    } catch (err) {
      logger.error("[seasonTick] galactic events failed:", err);
    }
  }

  // Sweep expired demands every run (cheap when the table is small).
  try {
    await sweepExpiredDemands();
  } catch (err) {
    logger.error("[seasonTick] demand sweep failed:", err);
  }

  // Phase 9: sector flip on season boundary. Any per-user sector with
  // reputation < 0 resets controlLevel to 0 and posts a sector_flipped
  // event the moment the season enters interregnum.
  if (phasesEntered.includes("interregnum")) {
    try {
      await flipNegativeRepSectors(next.seasonNumber);
    } catch (err) {
      logger.error("[seasonTick] sector flip failed:", err);
    }

    // Phase B: frontier rotation. One independent sector becomes
    // contested; one previously-contested sector relaxes. Posts a
    // sector_flipped event surfaced as a "frontier rotation" entry
    // in the news feed.
    try {
      const lastOpened = readLastFrontier();
      const rotation = pickFrontierRotation(lastOpened);
      writeLastFrontier(rotation.opening);
      await postPublicKnowledge({
        userId: null,
        eventKind: "sector_flipped",
        subjectHouseKey: null,
        summary:
          rotation.relaxing !== null
            ? `Frontier rotation: ${rotation.opening} now contested, ${rotation.relaxing} relaxes.`
            : `Frontier rotation: ${rotation.opening} now contested.`,
        payload: {
          frontierOpening: rotation.opening,
          frontierRelaxing: rotation.relaxing,
        },
        seasonNumber: next.seasonNumber,
      }).catch(err =>
        logger.warn("[seasonTick] frontier post failed:", err),
      );
    } catch (err) {
      logger.error("[seasonTick] frontier rotation failed:", err);
    }
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
// Phase B: in-memory tracker for the last frontier rotation. The
// season clock state is the canonical store, but reading from there
// requires extending the DB row — for now we keep the rotation in
// memory (server restart re-rolls, which is acceptable since the
// frontier state is mostly narrative).
let _lastFrontierOpened: string | null = null;
function readLastFrontier(): string | null {
  return _lastFrontierOpened;
}
function writeLastFrontier(sectorId: string): void {
  _lastFrontierOpened = sectorId;
}

/**
 * Phase B: fire one galactic event. Posts to the public-knowledge log
 * (system-attributed; userId null) and applies sub-house deltas as
 * a world action. Per-user effects (counters, demand generation)
 * remain handled by the agenda + demand engines.
 */
async function fireGalacticEvent(
  event: GalacticEventDef,
  seasonNumber: number,
): Promise<void> {
  await postPublicKnowledge({
    userId: null,
    eventKind: event.effect.eventKind ?? "agenda_step",
    subjectHouseKey: event.effect.subHouseDeltas?.[0]?.houseKey ?? null,
    summary: event.effect.summary,
    payload: {
      eventKey: event.eventKey,
      publicFlag: event.effect.publicFlag,
    },
    seasonNumber,
  }).catch(err => logger.warn("[seasonTick] event post failed:", err));

  // World-level rep deltas. Apply as a *system* delta (no userId);
  // they shift the global narrative weight rather than a specific
  // player's standing. Per-user response happens via agenda counters.
  // We reuse applySubHouseRepDelta with a sentinel system userId of 0
  // for now — a future Phase B.1 may add a globalSubHouseRep table.
  for (const delta of event.effect.subHouseDeltas ?? []) {
    await applySubHouseRepDelta(
      0, // system actor (no specific user)
      delta.houseKey,
      delta.delta,
      `galactic event ${event.eventKey}`,
    ).catch(err => logger.warn("[seasonTick] event rep delta failed:", err));
  }
}

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

/**
 * Flip every sector with rep < 0 (per user). Resets controlLevel to
 * 0 and posts a sector_flipped public-knowledge event so dialog and
 * the news feed can reference it. Idempotent — sectors with
 * controlLevel already 0 are skipped.
 */
async function flipNegativeRepSectors(seasonNumber: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  try {
    const flips = await db
      .select()
      .from(tradeSectorReputation)
      .where(lt(tradeSectorReputation.reputation, 0));
    let count = 0;
    for (const row of flips) {
      if (row.controlLevel === 0) continue;
      await db
        .update(tradeSectorReputation)
        .set({ controlLevel: 0 })
        .where(
          and(
            eq(tradeSectorReputation.userId, row.userId),
            eq(tradeSectorReputation.sectorId, row.sectorId),
          ),
        );
      await postPublicKnowledge({
        userId: row.userId,
        eventKind: "sector_flipped",
        subjectHouseKey: null,
        summary: `Player lost control of sector ${row.sectorId} (rep ${row.reputation}).`,
        payload: {
          sectorId: row.sectorId,
          previousControlLevel: row.controlLevel,
          reputation: row.reputation,
        },
        seasonNumber,
      }).catch(err =>
        logger.warn("[seasonTick] sector flip public knowledge failed:", err),
      );
      count += 1;
    }
    return count;
  } catch (err) {
    logger.error("[seasonTick] flipNegativeRepSectors failed:", err);
    return 0;
  }
}
