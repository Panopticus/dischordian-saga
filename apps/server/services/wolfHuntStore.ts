/* ═══════════════════════════════════════════════════════
   WOLF-HUNT STORE — mission + crucible-meters JSON blob

   Persists the Wolf-Anara solo hunt arc's state under
   userProgress.gameData.wolfHunt. A dedicated DB table is
   appropriate at scale but the JSON blob keeps the
   migration footprint zero and groups the data with the
   related arc state.

   Per user:
     gameData.wolfHunt: {
       activeMission: WolfHuntMissionState | null;
       pastMissions: WolfHuntMissionState[];     // closed missions
       activeBossFight: BossState | null;        // when boss step
       meters: CrucibleMeters;                   // league/influence/pressure
       resolvedTargetIds: string[];              // every closed mission's targetId
     }
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import type {
  WolfHuntMissionState,
  BossState,
  CrucibleMeters,
} from "../../shared/wolfHunt";
import { emptyCrucibleMeters } from "../../shared/wolfHunt";

const FRANCHISE = "dischordian-saga";

export interface WolfHuntStore {
  activeMission: WolfHuntMissionState | null;
  pastMissions: WolfHuntMissionState[];
  activeBossFight: BossState | null;
  meters: CrucibleMeters;
  resolvedTargetIds: string[];
}

function emptyStore(): WolfHuntStore {
  return {
    activeMission: null,
    pastMissions: [],
    activeBossFight: null,
    meters: emptyCrucibleMeters(),
    resolvedTargetIds: [],
  };
}

function coerce(raw: unknown): WolfHuntStore {
  if (!raw || typeof raw !== "object") return emptyStore();
  const r = raw as Record<string, unknown>;
  return {
    activeMission: (r.activeMission as WolfHuntMissionState | null) ?? null,
    pastMissions: Array.isArray(r.pastMissions)
      ? (r.pastMissions as WolfHuntMissionState[])
      : [],
    activeBossFight: (r.activeBossFight as BossState | null) ?? null,
    meters: {
      ...emptyCrucibleMeters(),
      ...((r.meters as Partial<CrucibleMeters> | undefined) ?? {}),
    },
    resolvedTargetIds: Array.isArray(r.resolvedTargetIds)
      ? (r.resolvedTargetIds as string[])
      : [],
  };
}

export async function loadWolfHuntStore(
  userId: number,
): Promise<WolfHuntStore> {
  const db = await getDb();
  if (!db) return emptyStore();
  const rows = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  const gameData =
    (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  return coerce(gameData.wolfHunt);
}

export async function saveWolfHuntStore(
  userId: number,
  store: WolfHuntStore,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  const existing =
    (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const next = { ...existing, wolfHunt: store };
  if (rows.length > 0) {
    await db
      .update(userProgress)
      .set({ gameData: next })
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.franchiseId, FRANCHISE),
        ),
      );
  } else {
    await db.insert(userProgress).values({
      userId,
      franchiseId: FRANCHISE,
      xp: 0,
      level: 1,
      points: 0,
      gameData: next,
    });
  }
}

/** Write the narrativeFlags map back to userProgress.gameData.narrativeFlags. */
export async function writeWolfHuntFlags(
  userId: number,
  flagMutations: Record<string, boolean | string>,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  if (rows.length === 0) return;
  const existing =
    (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const flags =
    (existing.narrativeFlags as Record<string, unknown> | undefined) ?? {};
  const nextFlags = { ...flags, ...flagMutations };
  const nextGameData = { ...existing, narrativeFlags: nextFlags };
  await db
    .update(userProgress)
    .set({ gameData: nextGameData })
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    );
}
