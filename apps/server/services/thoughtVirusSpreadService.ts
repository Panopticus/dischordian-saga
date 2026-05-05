/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS SPREAD SERVICE

   Runtime for the Thought Virus spread mechanic shipped in
   apps/shared/thoughtVirusSpread.ts (PR #427). Distinct from
   the older thoughtVirusService.ts which handles residue-log
   tracking — this service implements the per-sector infection
   meter from item 9 of the choice-impact follow-up.

   Each sector has a per-user infection level (0-100) that:

     - Starts at the sector's `baseInfection` on first read
     - Grows by `dailyGrowth` per in-game day until cleansed
     - Decreases (or increases) when a containment action runs
     - Caps at 100 (saturated) and floors at 0 (clean)

   Containment actions cost Dream tokens, may set narrative
   flags, and have per-action cooldowns. Public API:

     getSectorStatus(userId)         all 5 sectors with current
                                     levels + bands
     applyContainment(userId, ...)   apply a chosen action;
                                     returns new level + side
                                     effects (flag set, dream
                                     cost deducted)
     applyDailyGrowth()              tick every player's
                                     sectors by dailyGrowth
                                     (run once per in-game day)
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import { dreamBalance, npcPublicFlags, thoughtVirusInfection } from "../../db/schema";
import {
  bandFor,
  clampInfection,
  getAction,
  getSector,
  VIRUS_SECTORS,
  type ContainmentAction,
  type InfectionBand,
  type VirusSectorId,
} from "../../shared/thoughtVirusSpread";
import { getDb } from "../db";
import { logger } from "../logger";

const SECTOR_IDS = VIRUS_SECTORS.map((s) => s.id);

export interface SectorStatus {
  sectorId: VirusSectorId;
  name: string;
  description: string;
  level: number;
  band: InfectionBand;
  /** Per-action availability — false when within cooldown. */
  actionAvailability: Record<string, boolean>;
  lastContainmentAt: Date | null;
}

export interface ApplyResult {
  ok: boolean;
  reason?: "unknown_sector" | "unknown_action" | "on_cooldown" | "insufficient_dream";
  newLevel?: number;
  flagSet?: string;
}

async function readRow(userId: number, sectorId: VirusSectorId) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(thoughtVirusInfection)
    .where(and(
      eq(thoughtVirusInfection.userId, userId),
      eq(thoughtVirusInfection.sectorId, sectorId),
    ))
    .limit(1);
  return row ?? null;
}

async function readDream(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  try {
    const [row] = await db
      .select({ tokens: dreamBalance.dreamTokens })
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);
    return row?.tokens ?? 0;
  } catch {
    return 0;
  }
}

export function isOnCooldown(
  action: ContainmentAction,
  lastAt: Date | null,
  now: Date = new Date(),
): boolean {
  const days = action.cooldownDays ?? 1;
  if (!lastAt) return false;
  const elapsedDays = (now.getTime() - lastAt.getTime()) / (1000 * 60 * 60 * 24);
  return elapsedDays < days;
}

export async function getSectorStatus(userId: number): Promise<SectorStatus[]> {
  const db = await getDb();
  const rowsByid = new Map<VirusSectorId, { level: number; lastContainmentAt: Date | null }>();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(thoughtVirusInfection)
        .where(eq(thoughtVirusInfection.userId, userId));
      for (const r of rows) {
        rowsByid.set(r.sectorId as VirusSectorId, {
          level: r.level,
          lastContainmentAt: r.lastContainmentAt,
        });
      }
    } catch (err) {
      logger.warn("[thoughtVirusSpread] read failed:", err);
    }
  }

  return VIRUS_SECTORS.map((s) => {
    const row = rowsByid.get(s.id);
    const level = row?.level ?? s.baseInfection;
    const lastAt = row?.lastContainmentAt ?? null;
    const availability: Record<string, boolean> = {};
    for (const a of s.actions) availability[a.id] = !isOnCooldown(a, lastAt);
    return {
      sectorId: s.id,
      name: s.name,
      description: s.description,
      level,
      band: bandFor(level),
      actionAvailability: availability,
      lastContainmentAt: lastAt,
    };
  });
}

export async function applyContainment(args: {
  userId: number;
  sectorId: VirusSectorId;
  actionId: string;
}): Promise<ApplyResult> {
  const db = await getDb();
  if (!db) return { ok: false, reason: "unknown_sector" };

  const sector = getSector(args.sectorId);
  if (!sector) return { ok: false, reason: "unknown_sector" };
  const action = getAction(args.sectorId, args.actionId);
  if (!action) return { ok: false, reason: "unknown_action" };

  const row = await readRow(args.userId, args.sectorId);
  const currentLevel = row?.level ?? sector.baseInfection;
  const lastAt = row?.lastContainmentAt ?? null;
  if (isOnCooldown(action, lastAt)) {
    return { ok: false, reason: "on_cooldown" };
  }

  if (action.dreamCost && action.dreamCost > 0) {
    const dream = await readDream(args.userId);
    if (dream < action.dreamCost) {
      return { ok: false, reason: "insufficient_dream" };
    }
  }

  const newLevel = clampInfection(currentLevel + action.infectionDelta);
  const now = new Date();

  if (row) {
    await db
      .update(thoughtVirusInfection)
      .set({ level: newLevel, lastContainmentAt: now })
      .where(eq(thoughtVirusInfection.id, row.id));
  } else {
    await db.insert(thoughtVirusInfection).values({
      userId: args.userId,
      sectorId: args.sectorId,
      level: newLevel,
      lastContainmentAt: now,
    });
  }

  if (action.dreamCost && action.dreamCost > 0) {
    await db
      .update(dreamBalance)
      .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${action.dreamCost}` })
      .where(eq(dreamBalance.userId, args.userId));
  }

  if (action.setsFlag) {
    try {
      await db
        .insert(npcPublicFlags)
        .values({
          userId: args.userId,
          flag: action.setsFlag,
          setBy: "thought_virus_spread",
        })
        .onDuplicateKeyUpdate({
          set: { flag: sql`${npcPublicFlags.flag}` },
        });
    } catch (err) {
      logger.warn("[thoughtVirusSpread] flag write failed:", err);
    }
  }

  return {
    ok: true,
    newLevel,
    flagSet: action.setsFlag,
  };
}

/**
 * Daily growth tick — adds dailyGrowth to every sector for
 * every player. Run once per in-game day from a cron / poller.
 * Skips sectors at or above 100 (saturated).
 */
export async function applyDailyGrowth(): Promise<{ rowsTouched: number }> {
  const db = await getDb();
  if (!db) return { rowsTouched: 0 };
  let rowsTouched = 0;
  for (const sector of VIRUS_SECTORS) {
    try {
      await db
        .update(thoughtVirusInfection)
        .set({
          level: sql`LEAST(100, ${thoughtVirusInfection.level} + ${sector.dailyGrowth})`,
        })
        .where(and(
          eq(thoughtVirusInfection.sectorId, sector.id),
          sql`${thoughtVirusInfection.level} < 100`,
        ));
      rowsTouched += 1; // Approximate; mysql2 affectedRows shape varies.
    } catch (err) {
      logger.warn(`[thoughtVirusSpread] daily growth ${sector.id} failed:`, err);
    }
  }
  return { rowsTouched };
}

export { SECTOR_IDS };
