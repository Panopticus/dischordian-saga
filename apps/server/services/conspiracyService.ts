/**
 * Conspiracy / Witnessing Discovery Race service.
 *
 * Server-side orchestration for clue drops, board solves, and
 * server-wide reveal events. Idempotent on every operation.
 */
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  conspiracyBoards as conspiracyBoardsTable,
  userClueProgress,
  guildClueProgress,
  discoveryEvents,
  guildMembers,
  userProgress,
} from "../../db/schema";
import {
  CONSPIRACY_BOARDS,
  getConspiracyBoard,
  getBoardsForClue,
} from "@shared/conspiracyBoards/definitions";
import { rollClueDrop, type DropSource } from "@shared/conspiracyBoards/clueDrops";
import { awardEligibleTitles } from "./titleService";
import { logger } from "../logger";

/**
 * Drop one clue from a given source (PvP win/loss, raid clear, narrative).
 * Returns the dropped clue key (or null), and any boards that this drop
 * advanced for the user.
 *
 * Auto-applies the drop to user_clue_progress and (if the user is in a
 * guild) increments the guild's aggregate. If solving the board outright
 * is now possible, caller can invoke `attemptSolve`.
 */
export async function dropClueFromEvent(
  userId: number,
  source: DropSource,
  rng: () => number = Math.random,
): Promise<{ clueKey: string | null; boardsAdvanced: string[] }> {
  const clueKey = rollClueDrop(source, rng);
  if (!clueKey) return { clueKey: null, boardsAdvanced: [] };
  const boards = getBoardsForClue(clueKey);
  if (boards.length === 0) return { clueKey: null, boardsAdvanced: [] };

  const db = await getDb();
  if (!db) return { clueKey, boardsAdvanced: [] };

  const guildId = await fetchGuildIdForUser(userId);
  const advanced: string[] = [];
  for (const board of boards) {
    const userAdvanced = await addClueToUser(userId, board.boardKey, clueKey);
    if (userAdvanced) advanced.push(board.boardKey);
    if (guildId) {
      await addClueToGuild(guildId, userId, board.boardKey, clueKey);
    }
  }
  return { clueKey, boardsAdvanced: advanced };
}

async function fetchGuildIdForUser(userId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select({ guildId: guildMembers.guildId })
    .from(guildMembers)
    .where(eq(guildMembers.userId, userId))
    .limit(1);
  return rows[0]?.guildId ?? null;
}

/**
 * Add a clue to a user's progress on a board. Returns true iff this was
 * a new clue (i.e. the user actually advanced, not a duplicate drop).
 */
async function addClueToUser(
  userId: number,
  boardKey: string,
  clueKey: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const existing = await db
    .select()
    .from(userClueProgress)
    .where(and(eq(userClueProgress.userId, userId), eq(userClueProgress.boardKey, boardKey)))
    .limit(1);
  if (existing[0]) {
    const current = existing[0].cluesGathered ?? [];
    if (current.includes(clueKey)) return false;
    const updated = [...current, clueKey];
    await db
      .update(userClueProgress)
      .set({ cluesGathered: updated })
      .where(eq(userClueProgress.id, existing[0].id));
    return true;
  }
  await db.insert(userClueProgress).values({
    userId,
    boardKey,
    cluesGathered: [clueKey],
  });
  return true;
}

/**
 * Add a clue contribution to the guild's aggregate. Increments
 * per-member contribution count and adds the clue to the union set
 * if not already present.
 */
async function addClueToGuild(
  guildId: number,
  contributorId: number,
  boardKey: string,
  clueKey: string,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db
    .select()
    .from(guildClueProgress)
    .where(and(eq(guildClueProgress.guildId, guildId), eq(guildClueProgress.boardKey, boardKey)))
    .limit(1);
  if (existing[0]) {
    const current = existing[0].cluesGathered ?? [];
    const contributors = existing[0].contributors ?? {};
    const contribKey = String(contributorId);
    contributors[contribKey] = (contributors[contribKey] ?? 0) + 1;
    if (!current.includes(clueKey)) {
      await db
        .update(guildClueProgress)
        .set({ cluesGathered: [...current, clueKey], contributors })
        .where(eq(guildClueProgress.id, existing[0].id));
    } else {
      await db
        .update(guildClueProgress)
        .set({ contributors })
        .where(eq(guildClueProgress.id, existing[0].id));
    }
    return;
  }
  await db.insert(guildClueProgress).values({
    guildId,
    boardKey,
    cluesGathered: [clueKey],
    contributors: { [String(contributorId)]: 1 } as Record<string, number>,
  });
}

/**
 * Attempt to solve a board for the user. If the user has all required
 * clues, marks them solved; if first-discoverer (globally), records the
 * discoveryEvent and triggers server-wide reveal.
 *
 * Returns a structured result so callers can surface UI toasts.
 */
export async function attemptSolveForUser(
  userId: number,
  boardKey: string,
): Promise<{
  solved: boolean;
  isFirstDiscoverer: boolean;
  serverWideRevealed: boolean;
  reason?: string;
}> {
  const def = getConspiracyBoard(boardKey);
  if (!def) return { solved: false, isFirstDiscoverer: false, serverWideRevealed: false, reason: "unknown_board" };

  const db = await getDb();
  if (!db) return { solved: false, isFirstDiscoverer: false, serverWideRevealed: false, reason: "no_db" };

  const progress = await db
    .select()
    .from(userClueProgress)
    .where(and(eq(userClueProgress.userId, userId), eq(userClueProgress.boardKey, boardKey)))
    .limit(1);
  if (!progress[0]) return { solved: false, isFirstDiscoverer: false, serverWideRevealed: false, reason: "no_progress" };
  if (progress[0].solvedAt) {
    return { solved: true, isFirstDiscoverer: progress[0].isFirstDiscoverer === 1, serverWideRevealed: false, reason: "already_solved" };
  }
  const gathered = progress[0].cluesGathered ?? [];
  const required = new Set(def.acceptedClues);
  const haveAllRequired = [...required].every((c) => gathered.includes(c));
  if (!haveAllRequired) {
    return { solved: false, isFirstDiscoverer: false, serverWideRevealed: false, reason: "incomplete" };
  }

  // Check whether this is the first global solve.
  const eventKey = `conspiracy_${boardKey}_solved`;
  const existingEvent = await db
    .select()
    .from(discoveryEvents)
    .where(eq(discoveryEvents.eventKey, eventKey))
    .limit(1);
  const isFirstDiscoverer = existingEvent.length === 0;

  let serverWideRevealed = false;
  if (isFirstDiscoverer) {
    const guildId = await fetchGuildIdForUser(userId);
    try {
      await db.insert(discoveryEvents).values({
        eventKey,
        firstDiscovererUserId: userId,
        firstDiscovererGuildId: guildId ?? undefined,
        serverWideRevealedAt: new Date(),
        factionAlignment: def.factionAlignment ?? undefined,
      });
      serverWideRevealed = true;
      // Promote the reveal flag globally (Tier 2B: per-player flags
      // OR'd with serverWideRevealed in expansionUnlockService).
      if (def.revealFlag) {
        // Bump every user's progressData[revealFlag] = true. This is
        // a coarse update; for very large playerbases it would be a
        // cron / background job. For now, do it inline.
        await db
          .update(userProgress)
          .set({
            progressData: sql`JSON_SET(COALESCE(progress_data, JSON_OBJECT()), CONCAT('$.', ${def.revealFlag}), TRUE)`,
          });
      }
      logger.info(
        "conspiracy_server_wide_reveal",
        "conspiracyService",
        { boardKey, eventKey, firstDiscovererUserId: userId, firstDiscovererGuildId: guildId },
      );
    } catch (err) {
      // Race: someone else inserted between our select and insert.
      // Treat as not-first.
      logger.warn(
        "conspiracy_first_discoverer_race",
        "conspiracyService",
        { boardKey, userId, error: String(err) },
      );
      return attemptSolveForUser(userId, boardKey);
    }
  }

  // Mark the user solved and (if first) flag their isFirstDiscoverer.
  await db
    .update(userClueProgress)
    .set({
      solvedAt: new Date(),
      isFirstDiscoverer: isFirstDiscoverer ? 1 : 0,
    })
    .where(eq(userClueProgress.id, progress[0].id));

  // If the user is in a guild, also flag the guild's row solved.
  const guildId = await fetchGuildIdForUser(userId);
  if (guildId) {
    await db
      .update(guildClueProgress)
      .set({
        solvedAt: sql`COALESCE(solved_at, NOW())`,
        isFirstDiscoverer: sql`GREATEST(is_first_discoverer, ${isFirstDiscoverer ? 1 : 0})`,
      })
      .where(and(eq(guildClueProgress.guildId, guildId), eq(guildClueProgress.boardKey, boardKey)));
  }

  // Title grant.
  awardEligibleTitles(userId, {
    kind: "mystery_solved",
    userId,
    boardKey,
    isFirstDiscoverer,
  }).catch((e) =>
    logger.warn("conspiracy_title_grant_failed", "conspiracyService", { userId, boardKey, error: String(e) }),
  );

  return { solved: true, isFirstDiscoverer, serverWideRevealed };
}

/** Convenience: single-shot drop + auto-solve attempt. */
export async function processClueDropEvent(
  userId: number,
  source: DropSource,
  rng?: () => number,
): Promise<{ clueKey: string | null; solvedBoards: string[] }> {
  const drop = await dropClueFromEvent(userId, source, rng);
  if (!drop.clueKey) return { clueKey: null, solvedBoards: [] };
  const solved: string[] = [];
  for (const boardKey of drop.boardsAdvanced) {
    const result = await attemptSolveForUser(userId, boardKey);
    if (result.solved) solved.push(boardKey);
  }
  return { clueKey: drop.clueKey, solvedBoards: solved };
}

export { CONSPIRACY_BOARDS };
