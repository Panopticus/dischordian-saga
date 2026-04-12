/**
 * CREW TABLE SYNC — Opt-in projection from CrewState JSON → native tables
 * ──────────────────────────────────────────────────────────────────────
 * The crew router uses userProgress.gameData.crew as the source of truth.
 * This module writes a mirrored projection of that state into the native
 * crew_members / crew_bloodlines / crew_incubator_pods / crew_missions
 * tables so cross-user queries (leaderboards, syndicate analytics, etc.)
 * can run without deserializing every player's JSON blob.
 *
 * Called as a best-effort side-effect from the router's saveState() —
 * if the sync fails we log and move on; the JSON blob is authoritative.
 */
import { eq, and, inArray } from "drizzle-orm";
import { getDb } from "../db";
import {
  crewMembers,
  crewBloodlines,
  crewIncubatorPods,
  crewMissions as crewMissionsTable,
} from "../../db/schema";
import type { CrewState } from "../../shared/crewPersistence";

/** Sync the full CrewState into the native tables. Idempotent — upserts
 *  every row keyed on (userId, memberKey/slot/missionKey). */
export async function syncCrewStateToTables(userId: number, state: CrewState): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    // 1) Members (living + deceased)
    const allMembers = [...state.roster.members, ...state.roster.deceased];
    // Delete rows for this user that are no longer in the roster
    const keepKeys = allMembers.map(m => m.id);
    if (keepKeys.length > 0) {
      // Purge members whose memberKey is NOT in keepKeys
      const existing = await db
        .select({ memberKey: crewMembers.memberKey })
        .from(crewMembers)
        .where(eq(crewMembers.userId, userId));
      const toDelete = existing
        .map(r => r.memberKey)
        .filter(k => !keepKeys.includes(k));
      if (toDelete.length > 0) {
        await db
          .delete(crewMembers)
          .where(
            and(
              eq(crewMembers.userId, userId),
              inArray(crewMembers.memberKey, toDelete),
            ),
          );
      }
    } else {
      await db.delete(crewMembers).where(eq(crewMembers.userId, userId));
    }

    for (const m of allMembers) {
      const row = {
        userId,
        memberKey: m.id,
        name: m.name,
        nickname: m.nickname,
        species: m.species,
        gender: m.gender,
        bloodlineKey: m.bloodlineId,
        generation: m.generation,
        parentIds: m.parentIds,
        children: m.children,
        geneticTraits: m.geneticTraits,
        role: m.role,
        stats: m.stats as Record<string, number>,
        morale: m.morale,
        health: m.health,
        loyalty: m.loyalty,
        status: m.status,
        age: m.age,
        maxAge: m.maxAge,
        birthCycle: m.birthCycle,
        missionHistory: m.missionHistory,
        relationships: m.relationships,
        deathRecord: m.deathRecord ?? null,
      };
      const existing = await db
        .select()
        .from(crewMembers)
        .where(
          and(eq(crewMembers.userId, userId), eq(crewMembers.memberKey, m.id)),
        )
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(crewMembers)
          .set(row)
          .where(
            and(eq(crewMembers.userId, userId), eq(crewMembers.memberKey, m.id)),
          );
      } else {
        await db.insert(crewMembers).values(row);
      }
    }

    // 2) Bloodlines
    const foundedKeys = Object.keys(state.bloodlines);
    if (foundedKeys.length > 0) {
      const existingBl = await db
        .select({ key: crewBloodlines.bloodlineKey })
        .from(crewBloodlines)
        .where(eq(crewBloodlines.userId, userId));
      const toDelBl = existingBl
        .map(r => r.key)
        .filter(k => !foundedKeys.includes(k));
      if (toDelBl.length > 0) {
        await db
          .delete(crewBloodlines)
          .where(
            and(
              eq(crewBloodlines.userId, userId),
              inArray(crewBloodlines.bloodlineKey, toDelBl),
            ),
          );
      }
    } else {
      await db.delete(crewBloodlines).where(eq(crewBloodlines.userId, userId));
    }

    for (const [key, bl] of Object.entries(state.bloodlines)) {
      if (!bl) continue;
      const row = {
        userId,
        bloodlineKey: key,
        generationCount: bl.generationCount,
        geneticDrift: Math.round(bl.geneticDrift),
        diversityIndex: Math.round(bl.diversityIndex),
        activeTraits: bl.activeTraits,
        recessiveTraits: bl.recessiveTraits,
        metadata: {
          name: bl.name,
          motto: bl.motto,
          color: bl.color,
          power: bl.power,
          founderTemplateId: bl.founderTemplateId,
        },
      };
      const existingRow = await db
        .select()
        .from(crewBloodlines)
        .where(
          and(
            eq(crewBloodlines.userId, userId),
            eq(crewBloodlines.bloodlineKey, key),
          ),
        )
        .limit(1);
      if (existingRow.length > 0) {
        await db
          .update(crewBloodlines)
          .set(row)
          .where(
            and(
              eq(crewBloodlines.userId, userId),
              eq(crewBloodlines.bloodlineKey, key),
            ),
          );
      } else {
        await db.insert(crewBloodlines).values(row);
      }
    }

    // 3) Incubator pods — always 6 slots, upsert by (userId, podSlot)
    for (const pod of state.incubator.pods) {
      const row = {
        userId,
        podSlot: pod.id,
        status: pod.status,
        templateId: pod.templateId,
        bloodlineKey: pod.bloodlineId,
        generation: pod.generation,
        parentIds: pod.parentIds,
        timeRemainingSeconds: Math.round(pod.timeRemainingHours * 3600),
        totalTimeSeconds: Math.round(pod.totalTimeHours * 3600),
        geneticIntegrity: pod.geneticIntegrity,
        traits: pod.traits,
      };
      const existingPod = await db
        .select()
        .from(crewIncubatorPods)
        .where(
          and(
            eq(crewIncubatorPods.userId, userId),
            eq(crewIncubatorPods.podSlot, pod.id),
          ),
        )
        .limit(1);
      if (existingPod.length > 0) {
        await db
          .update(crewIncubatorPods)
          .set(row)
          .where(
            and(
              eq(crewIncubatorPods.userId, userId),
              eq(crewIncubatorPods.podSlot, pod.id),
            ),
          );
      } else {
        await db.insert(crewIncubatorPods).values(row);
      }
    }

    // 4) Missions
    const missionKeys = state.missions.map(m => m.id);
    if (missionKeys.length > 0) {
      const existingMissions = await db
        .select({ key: crewMissionsTable.missionKey })
        .from(crewMissionsTable)
        .where(eq(crewMissionsTable.userId, userId));
      const toDelM = existingMissions
        .map(r => r.key)
        .filter(k => !missionKeys.includes(k));
      if (toDelM.length > 0) {
        await db
          .delete(crewMissionsTable)
          .where(
            and(
              eq(crewMissionsTable.userId, userId),
              inArray(crewMissionsTable.missionKey, toDelM),
            ),
          );
      }
    } else {
      await db.delete(crewMissionsTable).where(eq(crewMissionsTable.userId, userId));
    }

    for (const m of state.missions) {
      const row = {
        userId,
        missionKey: m.id,
        templateId: m.templateId,
        name: m.name,
        sectorId: m.sectorId,
        difficulty: m.difficulty,
        status: m.status,
        assignedCrewIds: m.assignedCrewIds,
        successChance: Math.round(m.successChance * 100),
        dispatchedAt: new Date(m.dispatchedAt),
        completesAt: new Date(m.completesAt),
        resolvedAt: m.resolution ? new Date(m.resolution.resolvedAt) : null,
        resolution: (m.resolution ?? null) as unknown as any,
      };
      const existingMission = await db
        .select()
        .from(crewMissionsTable)
        .where(
          and(
            eq(crewMissionsTable.userId, userId),
            eq(crewMissionsTable.missionKey, m.id),
          ),
        )
        .limit(1);
      if (existingMission.length > 0) {
        await db
          .update(crewMissionsTable)
          .set(row)
          .where(
            and(
              eq(crewMissionsTable.userId, userId),
              eq(crewMissionsTable.missionKey, m.id),
            ),
          );
      } else {
        await db.insert(crewMissionsTable).values(row);
      }
    }
  } catch (err) {
    // Best-effort. The JSON blob is authoritative.
    // eslint-disable-next-line no-console
    console.warn("[crew] syncCrewStateToTables failed:", err);
  }
}
