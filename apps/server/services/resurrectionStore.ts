/* ═══════════════════════════════════════════════════════
   RESURRECTION STORE — quest blob + world-death blob

   The Resurrection Protocols quests and the npcWorldDeath
   records live alongside the crew JSON blob under
   userProgress.gameData. A dedicated SQL table for quests
   would be appropriate at scale; for the v1 launch the
   blob keeps the migration footprint small and groups the
   data with the related crew state.

   Each user gets:
     gameData.resurrection: {
       quests: ResurrectionQuestState[];
       worldDeaths: NpcWorldDeathRecord[];
     }
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import type { ResurrectionQuestState } from "../../shared/resurrectionProtocols";
import type { NpcWorldDeathRecord } from "../../shared/npcWorldDeathState";

const FRANCHISE = "dischordian-saga";

export interface ResurrectionStore {
  quests: ResurrectionQuestState[];
  worldDeaths: NpcWorldDeathRecord[];
}

const empty: ResurrectionStore = { quests: [], worldDeaths: [] };

export async function loadResurrectionStore(
  userId: number,
): Promise<ResurrectionStore> {
  const db = await getDb();
  if (!db) return { ...empty };
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
  const gameData = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const r = (gameData.resurrection as ResurrectionStore | undefined) ?? empty;
  return {
    quests: Array.isArray(r.quests) ? r.quests : [],
    worldDeaths: Array.isArray(r.worldDeaths) ? r.worldDeaths : [],
  };
}

export async function saveResurrectionStore(
  userId: number,
  store: ResurrectionStore,
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
  const existing = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const next = { ...existing, resurrection: store };
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

export function upsertQuest(
  store: ResurrectionStore,
  quest: ResurrectionQuestState,
): ResurrectionStore {
  const idx = store.quests.findIndex((q) => q.id === quest.id);
  if (idx === -1) {
    return { ...store, quests: [...store.quests, quest] };
  }
  const next = store.quests.slice();
  next[idx] = quest;
  return { ...store, quests: next };
}

export function upsertWorldDeath(
  store: ResurrectionStore,
  rec: NpcWorldDeathRecord,
): ResurrectionStore {
  const idx = store.worldDeaths.findIndex(
    (r) => r.userId === rec.userId && r.npcKey === rec.npcKey,
  );
  if (idx === -1) {
    return { ...store, worldDeaths: [...store.worldDeaths, rec] };
  }
  const next = store.worldDeaths.slice();
  next[idx] = rec;
  return { ...store, worldDeaths: next };
}
