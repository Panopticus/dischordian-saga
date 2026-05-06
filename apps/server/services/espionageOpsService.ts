/* ═══════════════════════════════════════════════════════
   ESPIONAGE OPS SERVICE — Phase D.5 of the Lore-Aligned
   Galactic-Empire Overhaul.

   Reactivates tradeActiveCovers as an action sink. Player
   spends influence to run an op against a broker NPC or
   agenda. Outcomes:

     - "intel": learn an agenda's next stage early. Player
       gains a one-shot insight payload (returned to the
       client). Cover load increases; subsequent ops have
       lower success.

     - "sabotage": temporarily lock out a broker for N hours.
       Posts a sabotage event to public knowledge if successful;
       posts a cover_blown event if failed.

   Pure RNG-injectable for tests.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeActiveCovers, tradeBrokerEngagement, tradeEspionageOps } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../logger";

import { isKnownBrokerKey } from "@shared/tradeEmpire/brokers";

import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";

// --- Tunables ------------------------------------------------------------

/** Base success probability for any op with no cover load. */
const BASE_SUCCESS_PROB = 0.75;
/** Per-op cover load applied. Higher load = lower success on next op. */
const COVER_LOAD_INCREMENT = 0.1;
/** Influence cost per op. */
const INFLUENCE_COST = 50;
/** Sabotage broker lockout duration on success. */
const SABOTAGE_LOCKOUT_HOURS = 6;

export interface RunOpArgs {
  userId: number;
  opKind: "intel" | "sabotage";
  /** For intel: agenda key. For sabotage: broker key. */
  targetKey: string;
}

export type RunOpResult =
  | {
      ok: true;
      outcome: "success";
      opId: number;
      payload: Record<string, unknown>;
    }
  | {
      ok: true;
      outcome: "blown";
      opId: number;
    }
  | { ok: false; error: string };

/**
 * Run one espionage op. The caller (router) is responsible for
 * deducting INFLUENCE_COST from the player before invoking.
 */
export async function runEspionageOp(
  args: RunOpArgs,
  rng: () => number = Math.random,
): Promise<RunOpResult> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  // Player must have an active, non-blown cover.
  const [cover] = await db
    .select()
    .from(tradeActiveCovers)
    .where(
      and(
        eq(tradeActiveCovers.userId, args.userId),
        eq(tradeActiveCovers.cleared, false),
      ),
    )
    .limit(1);
  if (!cover) {
    return { ok: false, error: "no active cover; activate one first" };
  }

  // Compute cover load from prior ops in this cover's lifetime.
  const priorOps = await db
    .select({ id: tradeEspionageOps.id })
    .from(tradeEspionageOps)
    .where(
      and(
        eq(tradeEspionageOps.userId, args.userId),
        eq(tradeEspionageOps.coverId, cover.coverId),
      ),
    );
  const coverLoad = priorOps.length * COVER_LOAD_INCREMENT;
  const successProb = Math.max(0.1, BASE_SUCCESS_PROB - coverLoad);
  const succeeded = rng() < successProb;

  // Validate the target.
  if (args.opKind === "sabotage" && !isKnownBrokerKey(args.targetKey)) {
    return { ok: false, error: `unknown broker key ${args.targetKey}` };
  }

  const seasonNumber = seasonClockService.getState().seasonNumber;

  if (!succeeded) {
    // Cover blown: clear it + log.
    await db
      .update(tradeActiveCovers)
      .set({ cleared: true })
      .where(eq(tradeActiveCovers.id, cover.id));
    const [insert] = await db
      .insert(tradeEspionageOps)
      .values({
        userId: args.userId,
        coverId: cover.coverId,
        opKind: args.opKind,
        targetKey: args.targetKey,
        outcome: "blown",
        influenceSpent: INFLUENCE_COST,
      })
      .$returningId();
    await postPublicKnowledge({
      userId: args.userId,
      eventKind: "cover_blown",
      subjectHouseKey: null,
      summary: `Cover ${cover.coverId} blown attempting ${args.opKind} against ${args.targetKey}.`,
      payload: { opKind: args.opKind, targetKey: args.targetKey, coverId: cover.coverId },
      seasonNumber,
    }).catch(err => logger.warn("[espionage] blown post failed:", err));
    return { ok: true, outcome: "blown", opId: insert?.id ?? 0 };
  }

  // Success: apply the op effect.
  let payload: Record<string, unknown> = {};
  if (args.opKind === "sabotage") {
    // Lock out the broker for N hours.
    const expiresAt = new Date(Date.now() + SABOTAGE_LOCKOUT_HOURS * 60 * 60 * 1000);
    await db
      .insert(tradeBrokerEngagement)
      .values({
        userId: args.userId,
        brokerKey: args.targetKey,
        isLockedOut: true,
        lockedOutReason: `sabotaged ${expiresAt.toISOString()}`,
      })
      .onDuplicateKeyUpdate({
        set: {
          isLockedOut: true,
          lockedOutReason: `sabotaged ${expiresAt.toISOString()}`,
        },
      });
    payload = { lockoutHours: SABOTAGE_LOCKOUT_HOURS, expiresAtMs: expiresAt.getTime() };
  } else {
    // Intel: return a hint payload. Caller can decide what to expose
    // (e.g., next agenda stage label). Phase D.5 returns a generic
    // "you learned more" payload; richer hints land alongside the
    // agenda-engine integration.
    payload = { hint: `intel acquired on ${args.targetKey}`, coverLoad };
  }

  const [insert] = await db
    .insert(tradeEspionageOps)
    .values({
      userId: args.userId,
      coverId: cover.coverId,
      opKind: args.opKind,
      targetKey: args.targetKey,
      outcome: "success",
      influenceSpent: INFLUENCE_COST,
    })
    .$returningId();

  return { ok: true, outcome: "success", opId: insert?.id ?? 0, payload };
}

/** Read recent espionage ops for a user. */
export async function listMyEspionageOps(
  userId: number,
): Promise<ReadonlyArray<{
  id: number;
  opKind: string;
  targetKey: string;
  outcome: string;
  influenceSpent: number;
  createdAt: number;
}>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(tradeEspionageOps)
    .where(eq(tradeEspionageOps.userId, userId));
  return rows.map(r => ({
    id: r.id,
    opKind: r.opKind,
    targetKey: r.targetKey,
    outcome: r.outcome,
    influenceSpent: r.influenceSpent,
    createdAt: r.createdAt.getTime(),
  }));
}

export const ESPIONAGE_INFLUENCE_COST = INFLUENCE_COST;
