/* ═══════════════════════════════════════════════════════
   APPRENTICE / NPC QUEST SUB-TASK SERVICE

   Validators for the five PersonalQuestSubtaskKind kinds.
   Each validator returns a boolean: "is this sub-task
   complete for this user (and optional memberKey)?"

   Used by:
     - apprenticePersonalQuests.advance() — gates stage
       transition on bond AND all sub-tasks complete.
     - PersonalQuestPanel.tsx — renders the per-stage
       checklist with completion state.

   Storage reads (no per-subtask table):
     loredex_read           → crew_member_loredex_carry (read=1) joined
     mission_tag_complete   → crew_mission_completion_log (tags JSON contains)
     gift_given             → apprentice_gift_log (giftId match)
     dialogue_topic_played  → apprentice_dialogue_progress (topicId match)
     commons_scene_witnessed→ commons_scenes_witnessed (sceneId match)
   ═══════════════════════════════════════════════════════ */
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  crewMemberLoredexCarry,
  crewMissionCompletionLog,
  apprenticeGiftLog,
  apprenticeDialogueProgress,
  commonsScenesWitnessed,
} from "../../db/schema";
import type { PersonalQuestSubtaskRef } from "@shared/personalQuestSubtasks";

/** Validator: player has opened the loredex entry (any of their
 *  carry rows for this entry has read=1 — or, equivalently, they
 *  have an entry in the user-side reader log). The simpler heuristic:
 *  if any carry row for this entryId is `read=1`, the player has
 *  read it. */
export async function validateLoredexRead(
  userId: number,
  entryId: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select({ id: crewMemberLoredexCarry.id })
    .from(crewMemberLoredexCarry)
    .where(and(
      eq(crewMemberLoredexCarry.userId, userId),
      eq(crewMemberLoredexCarry.loredexEntryId, entryId),
      eq(crewMemberLoredexCarry.read, 1),
    ));
  return rows.length > 0;
}

/** Validator: player has resolved at least one mission (success
 *  outcome) carrying the given tag. The tag is the literal value
 *  stored in the mission's `tags` JSON, e.g. "faction:coda". */
export async function validateMissionTagComplete(
  userId: number,
  tag: string,
  memberKey?: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  // MySQL JSON_CONTAINS — we stored tags as a JSON array, so check
  // whether the array contains the literal tag string.
  const where = memberKey
    ? and(
        eq(crewMissionCompletionLog.userId, userId),
        eq(crewMissionCompletionLog.memberKey, memberKey),
        sql`JSON_CONTAINS(${crewMissionCompletionLog.tags}, JSON_QUOTE(${tag}))`,
      )
    : and(
        eq(crewMissionCompletionLog.userId, userId),
        sql`JSON_CONTAINS(${crewMissionCompletionLog.tags}, JSON_QUOTE(${tag}))`,
      );
  const rows = await db
    .select({ id: crewMissionCompletionLog.id })
    .from(crewMissionCompletionLog)
    .where(where);
  return rows.length > 0;
}

/** Validator: player has gifted the specified item to the subject
 *  (memberKey). */
export async function validateGiftGiven(
  userId: number,
  memberKey: string,
  giftId: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select({ id: apprenticeGiftLog.id })
    .from(apprenticeGiftLog)
    .where(and(
      eq(apprenticeGiftLog.userId, userId),
      eq(apprenticeGiftLog.memberKey, memberKey),
      eq(apprenticeGiftLog.giftId, giftId),
    ));
  return rows.length > 0;
}

/** Validator: player has played the specified dialogue topic at least
 *  once (any path). The memberKey filter is required because dialogue
 *  progress is per-(member, topic). For NPC dialogues, memberKey holds
 *  the npcKey via the same column (services treat them identically). */
export async function validateDialogueTopicPlayed(
  userId: number,
  memberKey: string,
  topicId: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select({ id: apprenticeDialogueProgress.id })
    .from(apprenticeDialogueProgress)
    .where(and(
      eq(apprenticeDialogueProgress.userId, userId),
      eq(apprenticeDialogueProgress.memberKey, memberKey),
      eq(apprenticeDialogueProgress.topicId, topicId),
    ));
  return rows.length > 0;
}

/** Validator: player has watched the specified Commons scene to its
 *  conclusion. Inserted by the CommonsRoom UI when the scene's last
 *  beat plays out. */
export async function validateCommonsSceneWitnessed(
  userId: number,
  sceneId: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select({ id: commonsScenesWitnessed.id })
    .from(commonsScenesWitnessed)
    .where(and(
      eq(commonsScenesWitnessed.userId, userId),
      eq(commonsScenesWitnessed.sceneId, sceneId),
    ));
  return rows.length > 0;
}

/** Compose all validators for a single subtask. */
export async function validateSubtask(
  userId: number,
  subjectKey: string,
  subtask: PersonalQuestSubtaskRef,
): Promise<boolean> {
  switch (subtask.type) {
    case "loredex_read":
      return validateLoredexRead(userId, subtask.targetId);
    case "mission_tag_complete":
      return validateMissionTagComplete(userId, subtask.targetId, subjectKey);
    case "gift_given":
      return validateGiftGiven(userId, subjectKey, subtask.targetId);
    case "dialogue_topic_played":
      return validateDialogueTopicPlayed(userId, subjectKey, subtask.targetId);
    case "commons_scene_witnessed":
      return validateCommonsSceneWitnessed(userId, subtask.targetId);
  }
}

/** Evaluate every subtask in a stage. Returns the per-subtask
 *  completion booleans (in the same order as the input list) and a
 *  composite `allComplete` flag. */
export async function evaluateAllSubtasks(
  userId: number,
  subjectKey: string,
  subtasks: readonly PersonalQuestSubtaskRef[],
): Promise<{ completed: boolean[]; allComplete: boolean }> {
  if (!subtasks.length) {
    return { completed: [], allComplete: true };
  }
  const completed = await Promise.all(
    subtasks.map((s) => validateSubtask(userId, subjectKey, s)),
  );
  const allComplete = completed.every(Boolean);
  return { completed, allComplete };
}
