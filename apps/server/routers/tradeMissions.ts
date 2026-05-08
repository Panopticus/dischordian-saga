/* ═══════════════════════════════════════════════════════
   TRADE MISSIONS ROUTER — Coda Agency vertical slice.

   Per CANON Rev 7 §2 (The Coda) and INCOMPLETE_DESIGNS_AUDIT
   2026-05-08 §6 item 1: this is the first working slice of the
   browse → accept → complete → reward loop that delivers the
   Vex Solène / Engineer Zero reveal cadence.

   Endpoints:
   - listAvailable() — joined catalog + per-user rows; auto-tops
     up the user's active+available pool to 5 from the catalog
   - accept({ id })  — flips an `available` row to `active`
   - complete({ id }) — flips `active` → `completed`, applies
     the reward payload (credits, dream, voidCrystals, agency
     standing deltas, narrative flags) inside a single transaction
   - getAgencyStanding() — reads the per-(user,agencyId) standing
     ledger for the sidebar widget

   Mutations are wrapped in db.transaction(...) per the
   economic-transaction gate in CLAUDE.md §"Definition of Shipped".
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, sql, inArray } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  tradeMissions,
  tradeAgencyStanding,
  characterSheets,
  dreamBalance,
  userProgress,
} from "../../db/schema";
import {
  TRADE_MISSION_CATALOG,
  getTradeMissionDef,
  pickRefreshMissionIds,
  type TradeMissionDefinition,
  type TradeMissionAgencyId,
  type TradeMissionReward,
} from "@shared/tradeMissionCatalog";

const TARGET_OPEN_MISSION_POOL = 5;

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

/** Compute expiry timestamp (ms-epoch) from offeredAt + durationHours. */
function expiresAtMs(offeredAt: Date, durationHours: number): number {
  return offeredAt.getTime() + durationHours * 60 * 60 * 1000;
}

/**
 * Set narrative flags on userProgress.gameData.narrativeFlags. Mirrors
 * the helper in apps/server/routers/potentialIdentity.ts (kept inline
 * here so the gate's `setNarrativeFlag(` pattern scan finds the
 * writer call inside this router's transaction).
 *
 * Accepts a tx-bound db so the write rolls back with the rest of the
 * complete() mutation.
 */
async function setNarrativeFlag(
  tx: Parameters<Parameters<NonNullable<Awaited<ReturnType<typeof getDb>>>["transaction"]>[0]>[0],
  userId: number,
  flagsToSet: ReadonlyArray<string>,
): Promise<void> {
  if (flagsToSet.length === 0) return;
  const [progress] = await tx
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  if (!progress) return; // best-effort: missing-progress users get the standing/credits but no flag write
  const gameData = (progress.gameData ?? {}) as Record<string, unknown>;
  const currentFlags = (gameData.narrativeFlags ?? {}) as Record<string, boolean>;
  for (const flag of flagsToSet) currentFlags[flag] = true;
  gameData.narrativeFlags = currentFlags;
  await tx
    .update(userProgress)
    .set({ gameData: gameData as Record<string, unknown> })
    .where(eq(userProgress.userId, userId));
}

interface ListedMission {
  id: number;
  def: TradeMissionDefinition;
  status: "available" | "active" | "completed" | "failed" | "expired";
  offeredAt: number;
  acceptedAt: number | null;
  completedAt: number | null;
  expiresAtMs: number;
}

export const tradeMissionsRouter = router({
  /**
   * Lists the player's mission pool. If they have fewer than
   * TARGET_OPEN_MISSION_POOL rows in `available`+`active`, instantiate
   * the next slice of the catalog (rolling refresh). Auto-creation is
   * idempotent — completed/failed/expired rows are not re-offered.
   */
  listAvailable: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();

    // Pull every non-terminal row for the user (available + active).
    const open = await db
      .select()
      .from(tradeMissions)
      .where(
        and(
          eq(tradeMissions.userId, ctx.user.id),
          inArray(tradeMissions.status, ["available", "active"]),
        ),
      );

    // Top-up with deterministic catalog ids the player isn't already
    // holding. We exclude every row in any state so a mission a user
    // has already completed doesn't re-roll into their pool.
    if (open.length < TARGET_OPEN_MISSION_POOL) {
      const allRows = await db
        .select({ missionDefId: tradeMissions.missionDefId })
        .from(tradeMissions)
        .where(eq(tradeMissions.userId, ctx.user.id));
      const heldIds = allRows.map((r) => r.missionDefId);
      const toCreate = pickRefreshMissionIds(
        TARGET_OPEN_MISSION_POOL - open.length,
        heldIds,
      );
      if (toCreate.length > 0) {
        await db.insert(tradeMissions).values(
          toCreate.map((defId) => {
            const def = getTradeMissionDef(defId)!;
            return {
              userId: ctx.user.id,
              missionDefId: defId,
              status: "available" as const,
              agencyId: def.agencyId ?? null,
            };
          }),
        );
        // Re-read with the fresh rows.
        const refreshed = await db
          .select()
          .from(tradeMissions)
          .where(
            and(
              eq(tradeMissions.userId, ctx.user.id),
              inArray(tradeMissions.status, ["available", "active"]),
            ),
          );
        return mapRows(refreshed);
      }
    }

    return mapRows(open);
  }),

  /**
   * Move an `available` mission to `active`. Returns the updated row.
   * Wrapped in a transaction so concurrent accept calls can't double-
   * accept the same row.
   */
  accept: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();

      return db.transaction(async (tx) => {
        const [row] = await tx
          .select()
          .from(tradeMissions)
          .where(
            and(
              eq(tradeMissions.id, input.id),
              eq(tradeMissions.userId, ctx.user.id),
            ),
          )
          .limit(1);
        if (!row) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Mission not found" });
        }
        if (row.status !== "available") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Mission is ${row.status}, not available`,
          });
        }
        await tx
          .update(tradeMissions)
          .set({ status: "active", acceptedAt: new Date() })
          .where(eq(tradeMissions.id, row.id));
        return { success: true as const, id: row.id };
      });
    }),

  /**
   * Move an `active` mission to `completed`, then apply the reward
   * payload from the catalog definition. All economy writes (credits,
   * dream, agency standing, narrative flags) live in the same
   * transaction as the status flip so a partial failure rolls back.
   */
  complete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();

      return db.transaction(async (tx) => {
        const [row] = await tx
          .select()
          .from(tradeMissions)
          .where(
            and(
              eq(tradeMissions.id, input.id),
              eq(tradeMissions.userId, ctx.user.id),
            ),
          )
          .limit(1);
        if (!row) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Mission not found" });
        }
        if (row.status !== "active") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Mission is ${row.status}, not active`,
          });
        }
        const def = getTradeMissionDef(row.missionDefId);
        if (!def) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Mission def ${row.missionDefId} no longer in catalog`,
          });
        }

        const reward: TradeMissionReward = def.reward;

        // 1) Credits → characterSheets.credits.
        if (reward.credits && reward.credits > 0) {
          await tx
            .update(characterSheets)
            .set({ credits: sql`${characterSheets.credits} + ${reward.credits}` })
            .where(eq(characterSheets.userId, ctx.user.id));
        }

        // 2) Dream → dreamBalance.dreamTokens. Insert a zero-balance
        //    row first if missing (mirrors dailyQuests.ts §C3).
        if (reward.dream && reward.dream > 0) {
          const existing = await tx
            .select()
            .from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id))
            .limit(1);
          if (existing[0]) {
            await tx
              .update(dreamBalance)
              .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${reward.dream}` })
              .where(eq(dreamBalance.userId, ctx.user.id));
          } else {
            await tx.insert(dreamBalance).values({
              userId: ctx.user.id,
              dreamTokens: reward.dream,
              soulBoundDream: 0,
            });
          }
        }

        // 3) Void crystals — surfaced on dreamBalance.gems for the
        //    slice (the canonical voidCrystals economy table is
        //    out-of-scope here; gems is the closest existing premium
        //    bucket and is the single column the reward path can
        //    write to without stepping on other systems).
        if (reward.voidCrystals && reward.voidCrystals > 0) {
          const existing = await tx
            .select()
            .from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id))
            .limit(1);
          if (existing[0]) {
            await tx
              .update(dreamBalance)
              .set({ gems: sql`${dreamBalance.gems} + ${reward.voidCrystals}` })
              .where(eq(dreamBalance.userId, ctx.user.id));
          } else {
            await tx.insert(dreamBalance).values({
              userId: ctx.user.id,
              dreamTokens: 0,
              soulBoundDream: 0,
              gems: reward.voidCrystals,
            });
          }
        }

        // 4) Agency standing — upsert per (userId, agencyId).
        if (reward.standing) {
          for (const [agencyId, delta] of Object.entries(reward.standing) as Array<
            [TradeMissionAgencyId, number]
          >) {
            if (!delta) continue;
            const [existing] = await tx
              .select()
              .from(tradeAgencyStanding)
              .where(
                and(
                  eq(tradeAgencyStanding.userId, ctx.user.id),
                  eq(tradeAgencyStanding.agencyId, agencyId),
                ),
              )
              .limit(1);
            if (existing) {
              await tx
                .update(tradeAgencyStanding)
                .set({
                  standing: sql`${tradeAgencyStanding.standing} + ${delta}`,
                })
                .where(eq(tradeAgencyStanding.id, existing.id));
            } else {
              await tx.insert(tradeAgencyStanding).values({
                userId: ctx.user.id,
                agencyId,
                standing: delta,
              });
            }
          }
        }

        // 5) Narrative flags — userProgress.gameData.narrativeFlags.
        if (reward.narrativeFlags && reward.narrativeFlags.length > 0) {
          await setNarrativeFlag(tx, ctx.user.id, reward.narrativeFlags);
        }

        // 6) Flip status + freeze the reward payload onto the row so
        //    later audits can reconstruct what was actually granted
        //    (in case the catalog is edited).
        await tx
          .update(tradeMissions)
          .set({
            status: "completed",
            completedAt: new Date(),
            rewardPayload: reward as unknown as Record<string, unknown>,
          })
          .where(eq(tradeMissions.id, row.id));

        return {
          success: true as const,
          id: row.id,
          reward,
        };
      });
    }),

  /** Reads the per-agency standing ledger for the sidebar widget. */
  getAgencyStanding: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    const rows = await db
      .select()
      .from(tradeAgencyStanding)
      .where(eq(tradeAgencyStanding.userId, ctx.user.id));
    return rows.map((r) => ({
      agencyId: r.agencyId,
      standing: r.standing,
      updatedAt: r.updatedAt instanceof Date ? r.updatedAt.getTime() : Date.now(),
    }));
  }),
});

/** Map raw `tradeMissions` rows to the client-facing shape. */
function mapRows(
  rows: Array<typeof tradeMissions.$inferSelect>,
): ListedMission[] {
  const out: ListedMission[] = [];
  for (const row of rows) {
    const def = getTradeMissionDef(row.missionDefId);
    if (!def) continue; // catalog-edited-out rows are silently dropped
    const offered =
      row.offeredAt instanceof Date ? row.offeredAt : new Date(row.offeredAt);
    out.push({
      id: row.id,
      def,
      status: row.status,
      offeredAt: offered.getTime(),
      acceptedAt: row.acceptedAt
        ? (row.acceptedAt instanceof Date
            ? row.acceptedAt.getTime()
            : new Date(row.acceptedAt).getTime())
        : null,
      completedAt: row.completedAt
        ? (row.completedAt instanceof Date
            ? row.completedAt.getTime()
            : new Date(row.completedAt).getTime())
        : null,
      expiresAtMs: expiresAtMs(offered, def.durationHours),
    });
  }
  // Stable sort: tier asc, then id asc.
  out.sort((a, b) => a.def.tier - b.def.tier || a.id - b.id);
  return out;
}

/** Re-export for any consumer that wants to enumerate the catalog directly. */
export { TRADE_MISSION_CATALOG };
