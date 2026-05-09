/* ═══════════════════════════════════════════════════════
   SHADOW TONGUE REDACTION SERVICE — per-player Loredex
   redaction state (NPC depth #13).

   Reads + writes the shadow_tongue_redactions table; composes
   the player's standing (factionStandingService), axes
   (citizen-trait subsystem), and the global Shadow Tongue
   power level (shadow_tongue_state.powerLevel) into the
   per-entry redaction state via apps/shared/universe/shadowTongue.ts.

   Public API:
     - fireRevealTrigger(userId, entryId, trigger)
       Records that a reveal trigger has fired for the player;
       the entry will resolve to `visible` from then on.
     - getFiredTriggers(userId)
       Returns the encoded keys of every reveal trigger the
       player has fired; consumed by computeRedactionState().
     - resolveRedaction(userId, entryId, axes)
       The main entry point: returns the player's current
       RedactionState for the entry. Reads standing + global
       power level + fired triggers, computes the state, and
       persists the result.
   ═══════════════════════════════════════════════════════ */

import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";
import {
  shadowTongueRedactions,
  shadowTongueState,
} from "../../db/schema";
import {
  computeRedactionState,
  encodeTriggerKey,
  type RedactionContext,
  type RedactionState,
  type RevealTrigger,
} from "../../shared/universe/shadowTongue";
import type { PlayerAxis, AxisMagnitude } from "../../shared/npcs/types";
import { getFactionStandings } from "./factionStandingService";

/**
 * Record that a reveal trigger has fired for a player. Idempotent —
 * re-firing the same trigger is a no-op (unique constraint).
 */
export async function fireRevealTrigger(
  userId: number,
  entryId: string,
  trigger: RevealTrigger,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const triggerKey = encodeTriggerKey(trigger);
  let isNewlyFired = false;
  try {
    await db.insert(shadowTongueRedactions).values({
      userId,
      entryId,
      triggerKey,
      redactionState: null,
    });
    isNewlyFired = true;
  } catch (err) {
    // Unique violation = already fired = no-op.
    const msg = err instanceof Error ? err.message : String(err);
    if (!/duplicate|errno: 1062/i.test(msg)) {
      logger.warn("[ShadowTongueRedactions] fireRevealTrigger failed", {
        entryId,
        triggerKey,
        err: msg,
      });
    }
  }
  // NPC depth #12 — tick-event surface for the player's session-
  // resume report. Only records on first fire (idempotency keeps
  // the resume report from over-counting reveals).
  if (isNewlyFired) {
    const { recordTickEvent } = await import("./tickEventService");
    await recordTickEvent({
      userId,
      payload: {
        kind: "shadow_tongue_redaction_revealed",
        entryId,
        revealedBy: trigger.kind,
      },
    }).catch(err =>
      logger.warn("[ShadowTongueRedactions] reveal tick event failed", err),
    );
  }
}

/**
 * Read every fired trigger key for a player. Consumed by
 * resolveRedaction to short-circuit the computation when any
 * trigger has fired for an entry.
 */
export async function getFiredTriggers(
  userId: number,
): Promise<Set<string>> {
  const db = await getDb();
  if (!db) return new Set();
  const rows = await db
    .select({
      triggerKey: shadowTongueRedactions.triggerKey,
    })
    .from(shadowTongueRedactions)
    .where(
      and(
        eq(shadowTongueRedactions.userId, userId),
        // Only trigger rows.
        // NOTE: drizzle's not-null helper is `isNotNull`; we use the
        // negation pattern via a string check on triggerKey not null.
      ),
    );
  const keys = new Set<string>();
  for (const row of rows) {
    if (row.triggerKey) keys.add(row.triggerKey);
  }
  return keys;
}

/**
 * Read the global Shadow Tongue power level (singleton).
 * Returns 0 if the row doesn't exist yet.
 */
export async function getGlobalPowerLevel(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const [row] = await db
    .select({ powerLevel: shadowTongueState.powerLevel })
    .from(shadowTongueState)
    .where(eq(shadowTongueState.id, 1))
    .limit(1);
  return row?.powerLevel ?? 0;
}

/**
 * Resolve the per-player redaction state for one Loredex entry.
 * Composes player standing + axes + global power level + fired
 * triggers via computeRedactionState() and persists the result.
 *
 * @param userId       Player id
 * @param entryId      Loredex entryId (apps/client/src/data/loredex-data.json)
 * @param axes         Player's per-axis magnitudes (caller provides)
 */
export async function resolveRedaction(
  userId: number,
  entryId: string,
  axes: Partial<Record<PlayerAxis, AxisMagnitude>>,
): Promise<RedactionState> {
  const [standings, powerLevel, firedTriggers] = await Promise.all([
    getFactionStandings(userId),
    getGlobalPowerLevel(),
    getFiredTriggers(userId),
  ]);
  const ctx: RedactionContext = {
    standings,
    axes,
    globalPowerLevel: powerLevel,
    firedTriggers,
  };
  const state = computeRedactionState(entryId, ctx);
  await persistResolvedState(userId, entryId, state);
  return state;
}

/**
 * Bulk-resolve redactions for many entries at once. Reads global
 * inputs once and applies them to each entry — used by the Loredex
 * client renderer when paging the full catalog.
 */
export async function resolveRedactionsBulk(
  userId: number,
  entryIds: ReadonlyArray<string>,
  axes: Partial<Record<PlayerAxis, AxisMagnitude>>,
): Promise<Record<string, RedactionState>> {
  const [standings, powerLevel, firedTriggers] = await Promise.all([
    getFactionStandings(userId),
    getGlobalPowerLevel(),
    getFiredTriggers(userId),
  ]);
  const ctx: RedactionContext = {
    standings,
    axes,
    globalPowerLevel: powerLevel,
    firedTriggers,
  };
  const out: Record<string, RedactionState> = {};
  for (const entryId of entryIds) {
    out[entryId] = computeRedactionState(entryId, ctx);
  }
  // Persist in background; renderer doesn't need to wait.
  Promise.all(
    entryIds.map(entryId =>
      persistResolvedState(userId, entryId, out[entryId]),
    ),
  ).catch(err => logger.warn("[ShadowTongueRedactions] bulk persist failed", err));
  return out;
}

async function persistResolvedState(
  userId: number,
  entryId: string,
  state: RedactionState,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    // State rows have triggerKey IS NULL. The unique index treats
    // NULLs as distinct in MySQL, so we look up by (userId, entryId,
    // triggerKey IS NULL) and update if present, insert if not.
    const [existing] = await db
      .select({ id: shadowTongueRedactions.id })
      .from(shadowTongueRedactions)
      .where(
        and(
          eq(shadowTongueRedactions.userId, userId),
          eq(shadowTongueRedactions.entryId, entryId),
          isNull(shadowTongueRedactions.triggerKey),
        ),
      )
      .limit(1);
    if (existing) {
      await db
        .update(shadowTongueRedactions)
        .set({ redactionState: state })
        .where(eq(shadowTongueRedactions.id, existing.id));
    } else {
      await db.insert(shadowTongueRedactions).values({
        userId,
        entryId,
        triggerKey: null,
        redactionState: state,
      });
    }
  } catch (err) {
    logger.warn("[ShadowTongueRedactions] persist state failed", {
      userId,
      entryId,
      state,
      err,
    });
  }
}
