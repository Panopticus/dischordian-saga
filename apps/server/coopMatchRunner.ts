/**
 * Co-op match runner. Drives the boss AI side of a coop_card_session
 * through the existing 1v1 engine reducer.
 *
 * Architecture (per docs/built/TIER_3_LAYERED_ARCHITECTURE.md): the
 * engine still runs 1v1 — humans share Side 0 (with the WS layer
 * routing actions from either party member to the same player), and
 * the boss AI occupies Side 1 with phase-trigger scripted casts.
 *
 * The runner is kicked off when a coop_card_session row transitions
 * to status="pending" by `coopCard.startSession`. A poller in the
 * pvpWs boot path picks up unhandled sessions every few seconds and
 * spawns a runner per session.
 */
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { coopCardSessions, parties } from "../db/schema";
import {
  getCoopEncounter,
  type CoopEncounterDef,
  type CoopDifficulty,
} from "@shared/tcg-core/coop/encounters";
import { logger } from "./logger";

interface RunnerEntry {
  sessionId: string;
  encounter: CoopEncounterDef;
  difficulty: CoopDifficulty;
  partyMemberIds: number[];
  /** Set of phase HP fractions that have already fired this match. */
  firedPhaseFractions: Set<number>;
  /** Match id of the underlying 1v1 instance once spawned. */
  underlyingMatchId: string | null;
  startedAt: Date;
}

const activeRunners = new Map<string, RunnerEntry>();
let pollTimer: NodeJS.Timeout | null = null;

const POLL_INTERVAL_MS = 4000;

/** Start the background poller. Idempotent. */
export function startCoopRunnerPoller(): void {
  if (pollTimer) return;
  pollTimer = setInterval(() => {
    pollPendingSessions().catch((err) => {
      logger.warn("coop_runner_poll_failed", "coopMatchRunner", { error: String(err) });
    });
  }, POLL_INTERVAL_MS);
  // Run once immediately so a fresh deploy doesn't wait the first
  // interval to pick up sessions started right at boot.
  pollPendingSessions().catch((err) => {
    logger.warn("coop_runner_initial_poll_failed", "coopMatchRunner", { error: String(err) });
  });
}

export function stopCoopRunnerPoller(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function pollPendingSessions(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(coopCardSessions)
    .where(eq(coopCardSessions.outcome, "pending"))
    .limit(50);
  for (const row of rows) {
    if (activeRunners.has(row.sessionId)) continue;
    const def = getCoopEncounter(row.encounterKey);
    if (!def) {
      logger.warn("coop_runner_unknown_encounter", "coopMatchRunner", {
        sessionId: row.sessionId,
        encounterKey: row.encounterKey,
      });
      continue;
    }
    const memberIds = row.partyMemberIds ?? [];
    if (memberIds.length < 1 || memberIds.length > 2) {
      logger.warn("coop_runner_bad_party_size", "coopMatchRunner", {
        sessionId: row.sessionId,
        size: memberIds.length,
      });
      continue;
    }
    const entry: RunnerEntry = {
      sessionId: row.sessionId,
      encounter: def,
      difficulty: row.difficulty as CoopDifficulty,
      partyMemberIds: memberIds,
      firedPhaseFractions: new Set(),
      underlyingMatchId: null,
      startedAt: row.startedAt ? new Date(row.startedAt) : new Date(),
    };
    activeRunners.set(row.sessionId, entry);
    logger.info("coop_runner_spawned", "coopMatchRunner", {
      sessionId: row.sessionId,
      encounterKey: row.encounterKey,
      difficulty: row.difficulty,
      partyMemberIds: memberIds,
    });
    // Note: full match drive (1v1 instance + per-turn boss AI loop)
    // is delegated to the pvpWs match-spawn path. This poller's
    // responsibility is only to register the runner so the pvpWs
    // layer can pick it up when it sees an action arrive from a
    // party member with a session id in metadata.
    //
    // The spawn-on-action pattern avoids a chicken-and-egg with the
    // WS connection: clients only connect once the player navigates
    // to /pvp?coop=<sessionId>, at which point the WS layer reads
    // the active runner table and constructs the engine instance.
  }
}

/** Look up a registered runner by sessionId. WS layer calls this
 *  when a party member's first action arrives. */
export function getRunner(sessionId: string): RunnerEntry | null {
  return activeRunners.get(sessionId) ?? null;
}

/** Mark a runner as having spawned its underlying match. */
export function attachUnderlyingMatch(
  sessionId: string,
  matchId: string,
): void {
  const entry = activeRunners.get(sessionId);
  if (entry) entry.underlyingMatchId = matchId;
}

/** Mark a phase fraction as fired so the same phase doesn't re-trigger. */
export function recordPhaseFired(sessionId: string, hpFraction: number): void {
  const entry = activeRunners.get(sessionId);
  if (entry) entry.firedPhaseFractions.add(hpFraction);
}

/** Clear runner state when the session resolves. */
export async function finalizeRunner(
  sessionId: string,
  outcome: "victory" | "defeat" | "abandoned",
): Promise<void> {
  const entry = activeRunners.get(sessionId);
  if (!entry) return;
  const db = await getDb();
  if (db) {
    try {
      await db
        .update(coopCardSessions)
        .set({
          outcome,
          phasesFired: [...entry.firedPhaseFractions],
          underlyingMatchId: entry.underlyingMatchId ?? null,
          endedAt: new Date(),
        })
        .where(eq(coopCardSessions.sessionId, sessionId));
      // Release party from in_match.
      const sessRow = await db
        .select({ partyId: coopCardSessions.partyId })
        .from(coopCardSessions)
        .where(eq(coopCardSessions.sessionId, sessionId))
        .limit(1);
      if (sessRow[0]) {
        await db
          .update(parties)
          .set({ status: "forming", matchId: null })
          .where(eq(parties.partyId, sessRow[0].partyId));
      }
    } catch (err) {
      logger.warn("coop_runner_finalize_failed", "coopMatchRunner", {
        sessionId,
        error: String(err),
      });
    }
  }
  activeRunners.delete(sessionId);
  logger.info("coop_runner_finalized", "coopMatchRunner", { sessionId, outcome });
}

/** Diagnostic snapshot for the admin dashboard. */
export function getRunnerStatus(): {
  active: number;
  byEncounter: Record<string, number>;
} {
  const byEncounter: Record<string, number> = {};
  for (const r of activeRunners.values()) {
    byEncounter[r.encounter.encounterKey] = (byEncounter[r.encounter.encounterKey] ?? 0) + 1;
  }
  return { active: activeRunners.size, byEncounter };
}
