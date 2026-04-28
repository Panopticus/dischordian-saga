#!/usr/bin/env npx tsx
/**
 * Backfill: legacy userProgress.gameData.tradeEmpire JSON blob → 6
 * normalized Trade Empire tables.
 *
 * Phase 4 of the Trade Empire normalization moves all in-blob state
 * into:
 *   - tradeActiveMissions
 *   - tradeCompletedMissions
 *   - tradeSectorReputation
 *   - tradeActiveCovers
 *   - tradeClassSectorUnlocks
 *   - tradeEmpireUserAggregates
 *
 * The router stops reading the blob at this revision; this script
 * walks every user_progress row whose gameData.tradeEmpire blob is
 * non-empty and inserts the normalized rows. The blob itself is left
 * in place — a follow-up cleanup migration can drop it once we've
 * confirmed parity in production for a few weeks.
 *
 * Idempotency: every insert goes via ON DUPLICATE KEY UPDATE or a
 * pre-check, so re-running the script over the same dataset is safe.
 *
 * Usage:
 *   pnpm tsx apps/scripts/backfill-trade-empire-blob.ts
 *   pnpm tsx apps/scripts/backfill-trade-empire-blob.ts --dry-run
 *   pnpm tsx apps/scripts/backfill-trade-empire-blob.ts --user 123
 *
 * Requires DATABASE_URL.
 */
import { eq } from "drizzle-orm";
import { getDb } from "../server/db";
import {
  userProgress,
  tradeActiveMissions,
  tradeCompletedMissions,
  tradeSectorReputation,
  tradeActiveCovers,
  tradeClassSectorUnlocks,
  tradeEmpireUserAggregates,
} from "../db/schema";

interface LegacyMissionState {
  id: string;
  name: string;
  sectorId: string;
  dispatchedAt: number;
  durationMs: number;
  reward?: Record<string, unknown>;
}

interface LegacyTradeEmpireState {
  activeMissions?: LegacyMissionState[];
  completedMissionIds?: string[];
  totalMissionsCompleted?: number;
  totalDreamEarned?: number;
  totalInfluenceEarned?: number;
  sectors?: Record<string, { controlLevel?: number; reputation?: number }>;
  activeCover?: { id: string; target: string; expiresAt: number };
}

interface CliArgs {
  dryRun: boolean;
  userIdFilter: number | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = { dryRun: false, userIdFilter: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--user") {
      const v = argv[++i];
      if (!v) throw new Error("--user requires a numeric value");
      args.userIdFilter = Number.parseInt(v, 10);
    }
  }
  return args;
}

interface BackfillStats {
  usersScanned: number;
  usersBackfilled: number;
  activeMissionsInserted: number;
  completedMissionsInserted: number;
  sectorRowsUpserted: number;
  coverRowsInserted: number;
  classUnlocksInserted: number;
  aggregateRowsUpserted: number;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.dryRun) {
    console.log("[backfill] DRY RUN — no writes will be issued.");
  }

  const db = await getDb();
  if (!db) {
    console.error("[backfill] DATABASE_URL not set or pool failed to init.");
    process.exit(2);
  }

  const stats: BackfillStats = {
    usersScanned: 0,
    usersBackfilled: 0,
    activeMissionsInserted: 0,
    completedMissionsInserted: 0,
    sectorRowsUpserted: 0,
    coverRowsInserted: 0,
    classUnlocksInserted: 0,
    aggregateRowsUpserted: 0,
  };

  const rows = args.userIdFilter !== null
    ? await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, args.userIdFilter))
    : await db.select().from(userProgress);

  for (const row of rows) {
    stats.usersScanned++;
    const gameData = row.gameData as Record<string, unknown> | null;
    const blob = gameData?.tradeEmpire as LegacyTradeEmpireState | undefined;
    if (!blob) continue;
    const userId = row.userId;
    if (typeof userId !== "number") continue;

    let didWrite = false;

    // 1. Active missions.
    for (const m of blob.activeMissions ?? []) {
      if (!m?.id) continue;
      if (!args.dryRun) {
        await db
          .insert(tradeActiveMissions)
          .values({
            userId,
            missionId: m.id,
            name: m.name ?? m.id,
            sectorId: m.sectorId ?? "unknown",
            dispatchedAt: m.dispatchedAt ?? Date.now(),
            durationMs: m.durationMs ?? 0,
            reward: (m.reward ?? {}) as Record<string, unknown>,
          })
          .onDuplicateKeyUpdate({
            set: { name: m.name ?? m.id },
          });
      }
      stats.activeMissionsInserted++;
      didWrite = true;
    }

    // 2. Completed mission ids — split real completions from the
    //    "unlocked:<sectorId>" pseudo-IDs the legacy code stuffed in
    //    the same array.
    const completedIds = blob.completedMissionIds ?? [];
    for (const cid of completedIds) {
      if (!cid) continue;
      if (cid.startsWith("unlocked:")) {
        const sectorId = cid.slice("unlocked:".length);
        if (!args.dryRun) {
          await db
            .insert(tradeClassSectorUnlocks)
            .values({ userId, sectorId })
            .onDuplicateKeyUpdate({ set: { sectorId } });
        }
        stats.classUnlocksInserted++;
        didWrite = true;
      } else {
        // Real mission completion. We don't know per-completion
        // dream/influence (the blob never tracked those per-mission
        // — only as totals). Insert with zeros and rely on the
        // aggregates row carrying the correct sums.
        if (!args.dryRun) {
          await db.insert(tradeCompletedMissions).values({
            userId,
            missionId: cid,
            sectorId: blob.sectors
              ? Object.keys(blob.sectors)[0] ?? "unknown"
              : "unknown",
            dreamEarned: 0,
            influenceEarned: 0,
          });
        }
        stats.completedMissionsInserted++;
        didWrite = true;
      }
    }

    // 3. Sector reputation.
    for (const [sectorId, sec] of Object.entries(blob.sectors ?? {})) {
      if (!args.dryRun) {
        await db
          .insert(tradeSectorReputation)
          .values({
            userId,
            sectorId,
            controlLevel: sec.controlLevel ?? 0,
            reputation: sec.reputation ?? 0,
          })
          .onDuplicateKeyUpdate({
            set: {
              controlLevel: sec.controlLevel ?? 0,
              reputation: sec.reputation ?? 0,
            },
          });
      }
      stats.sectorRowsUpserted++;
      didWrite = true;
    }

    // 4. Active cover (Spy).
    if (blob.activeCover && blob.activeCover.id) {
      if (!args.dryRun) {
        await db.insert(tradeActiveCovers).values({
          userId,
          coverId: blob.activeCover.id,
          targetFactionId: blob.activeCover.target ?? "unknown",
          expiresAt: blob.activeCover.expiresAt ?? Date.now(),
        });
      }
      stats.coverRowsInserted++;
      didWrite = true;
    }

    // 5. Aggregates row (totals from blob — these are the ground truth).
    const totals = {
      totalMissionsCompleted: blob.totalMissionsCompleted ?? 0,
      totalDreamEarned: blob.totalDreamEarned ?? 0,
      totalInfluenceEarned: blob.totalInfluenceEarned ?? 0,
    };
    if (!args.dryRun) {
      await db
        .insert(tradeEmpireUserAggregates)
        .values({ userId, ...totals })
        .onDuplicateKeyUpdate({ set: totals });
    }
    stats.aggregateRowsUpserted++;
    didWrite = true;

    if (didWrite) stats.usersBackfilled++;
  }

  console.log("[backfill] complete:", stats);
}

main().catch((err) => {
  console.error("[backfill] failed:", err);
  process.exit(1);
});
