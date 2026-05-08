/* ═══════════════════════════════════════════════════════
   APPRENTICE PERSONAL QUESTS — service layer

   Reads/writes the apprentice_personal_quest_progress table
   and exposes a small surface the router consumes:

     - openQuest(userId, memberKey, archetype)
         creates the row at stage 1 if not present.
     - getProgress(userId, memberKey)
         returns the current row (or a fresh stage-0 shape).
     - advanceStage(userId, memberKey, fromStage)
         moves stage 1→2 or 2→3. No-op if fromStage doesn't
         match the persisted stage (idempotent re-submission).
     - resolveBreakingPoint(userId, memberKey, choice)
         locks in stage-3 resolution as "deepened" or "broken".
         Writes to the linked crew member's
         personalQuestStage / personalQuestResolution. When
         "broken", seeds initial corruption so the
         apprenticeBetrayal descent reaches the warning
         threshold on the next tick.

   The service is pure persistence — gating, eligibility, and
   reward computation live in the router. The routes hold the
   read-the-identity-table-and-decide logic.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { apprenticePersonalQuestProgress } from "../../db/schema";
import {
  loadCrewState,
  saveCrewState,
} from "./crewState";
import type { ApprenticeArchetype } from "../../shared/apprentices";

export interface PersonalQuestProgress {
  /** 0 — not yet opened. 1/2/3 — current stage. */
  stage: number;
  /** Set after stage 3 is resolved. */
  resolution: "deepened" | "broken" | null;
  /** ms epochs of stage transitions, keyed by stage. */
  stageStartedAt: Record<string, number>;
  /** Free-form quest flags accumulated across stages. */
  flags: Record<string, unknown>;
}

const EMPTY: PersonalQuestProgress = {
  stage: 0,
  resolution: null,
  stageStartedAt: {},
  flags: {},
};

/** Read the player's progress on this crew member's personal quest. */
export async function getQuestProgress(
  userId: number,
  memberKey: string,
): Promise<PersonalQuestProgress> {
  const db = await getDb();
  if (!db) return EMPTY;
  const [row] = await db
    .select()
    .from(apprenticePersonalQuestProgress)
    .where(
      and(
        eq(apprenticePersonalQuestProgress.userId, userId),
        eq(apprenticePersonalQuestProgress.memberKey, memberKey),
      ),
    )
    .limit(1);
  if (!row) return EMPTY;
  return {
    stage: row.stage,
    resolution: (row.resolution as "deepened" | "broken" | null) ?? null,
    stageStartedAt: row.stageStartedAt ?? {},
    flags: row.flags ?? {},
  };
}

/** Open the quest at stage 1. Idempotent — returns the current row. */
export async function openQuest(
  userId: number,
  memberKey: string,
  archetype: ApprenticeArchetype,
): Promise<PersonalQuestProgress> {
  const db = await getDb();
  if (!db) return { ...EMPTY, stage: 1, stageStartedAt: { "1": Date.now() } };
  const existing = await getQuestProgress(userId, memberKey);
  if (existing.stage > 0) return existing;
  const now = Date.now();
  await db
    .insert(apprenticePersonalQuestProgress)
    .values({
      userId,
      memberKey,
      archetype,
      stage: 1,
      resolution: null,
      stageStartedAt: { "1": now },
      flags: {},
    })
    .onDuplicateKeyUpdate({
      set: { stage: 1, archetype },
    });
  await syncMemberStage(userId, memberKey, 1, null);
  return {
    stage: 1,
    resolution: null,
    stageStartedAt: { "1": now },
    flags: {},
  };
}

/** Advance from `fromStage` to `fromStage + 1`. No-op if mismatch. */
export async function advanceStage(
  userId: number,
  memberKey: string,
  fromStage: 1 | 2,
): Promise<PersonalQuestProgress> {
  const db = await getDb();
  if (!db) {
    return {
      ...EMPTY,
      stage: fromStage + 1,
      stageStartedAt: { [String(fromStage + 1)]: Date.now() },
    };
  }
  const existing = await getQuestProgress(userId, memberKey);
  if (existing.stage !== fromStage) return existing;
  const nextStage = fromStage + 1;
  const now = Date.now();
  const nextStageStartedAt = {
    ...existing.stageStartedAt,
    [String(nextStage)]: now,
  };
  await db
    .update(apprenticePersonalQuestProgress)
    .set({
      stage: nextStage,
      stageStartedAt: nextStageStartedAt,
    })
    .where(
      and(
        eq(apprenticePersonalQuestProgress.userId, userId),
        eq(apprenticePersonalQuestProgress.memberKey, memberKey),
      ),
    );
  await syncMemberStage(userId, memberKey, nextStage, existing.resolution);
  return {
    ...existing,
    stage: nextStage,
    stageStartedAt: nextStageStartedAt,
  };
}

/** Resolve the stage-3 breaking-point choice. "deepened" → unlock
 *  romance lock-in path; "broken" → seed corruption to push the
 *  apprentice past the betrayal warning threshold next tick. */
export async function resolveBreakingPoint(
  userId: number,
  memberKey: string,
  choice: "deepened" | "broken",
): Promise<PersonalQuestProgress> {
  const db = await getDb();
  const existing = await getQuestProgress(userId, memberKey);
  if (existing.stage !== 3 || existing.resolution !== null) {
    return existing;
  }
  const now = Date.now();
  if (db) {
    await db
      .update(apprenticePersonalQuestProgress)
      .set({
        resolution: choice,
        flags: {
          ...existing.flags,
          resolvedAt: now,
        },
      })
      .where(
        and(
          eq(apprenticePersonalQuestProgress.userId, userId),
          eq(apprenticePersonalQuestProgress.memberKey, memberKey),
        ),
      );
  }
  await syncMemberStage(userId, memberKey, 3, choice);
  if (choice === "broken") {
    await seedBetrayalCorruption(userId, memberKey);
  }
  return {
    ...existing,
    resolution: choice,
    flags: { ...existing.flags, resolvedAt: now },
  };
}

/** Mirror progress onto the crew member's persisted state so any
 *  surface that reads `personalQuestStage` / `personalQuestResolution`
 *  (mission resolver, romance gate, ghost effects) sees the change. */
async function syncMemberStage(
  userId: number,
  memberKey: string,
  stage: number,
  resolution: "deepened" | "broken" | null,
): Promise<void> {
  try {
    const state = await loadCrewState(userId);
    if (!state) return;
    const idx = state.roster.members.findIndex((m) => m.id === memberKey);
    if (idx === -1) return;
    const member = state.roster.members[idx];
    if (
      member.personalQuestStage === stage &&
      member.personalQuestResolution === resolution
    ) {
      return;
    }
    const next = {
      ...state,
      roster: {
        ...state.roster,
        members: state.roster.members.map((m, i) =>
          i === idx
            ? { ...m, personalQuestStage: stage, personalQuestResolution: resolution }
            : m,
        ),
      },
    };
    await saveCrewState(userId, next);
  } catch {
    // Best-effort — quest progress is the source of truth; the mirror
    // catches up on the next tick if the save fails.
  }
}

/** Push the crew member's `corruption` field past the warning
 *  threshold so the next mission-tick fires the betrayal descent.
 *  See apprenticeBetrayal.ts BETRAYAL_THRESHOLDS — warning starts at
 *  60 — we set 65 to give the engine a small margin. */
async function seedBetrayalCorruption(
  userId: number,
  memberKey: string,
): Promise<void> {
  try {
    const state = await loadCrewState(userId);
    if (!state) return;
    const idx = state.roster.members.findIndex((m) => m.id === memberKey);
    if (idx === -1) return;
    const member = state.roster.members[idx];
    const newCorruption = Math.max(member.corruption ?? 0, 65);
    if (newCorruption === (member.corruption ?? 0)) return;
    const next = {
      ...state,
      roster: {
        ...state.roster,
        members: state.roster.members.map((m, i) =>
          i === idx ? { ...m, corruption: newCorruption } : m,
        ),
      },
    };
    await saveCrewState(userId, next);
  } catch {
    // Best-effort.
  }
}
