/* ═══════════════════════════════════════════════════════
   NPC DIALOGUE SERVICE — server-side state for the 12
   named-NPC BioWare topic trees.

   Storage shares apprentice_dialogue_progress (same table)
   keyed on (userId, memberKey, topicId) — for NPC dialogues
   the memberKey column holds the canonical NamedNpcKey
   ("the_seer", "the_antiquarian", …). NPC topic ids
   ("the_seer_past", "the_antiquarian_calling", …) are
   distinct from apprentice topic ids so the table is safe
   to share.

   The service is a thin wrapper over the apprentice
   service's helpers — same path-resolution + sealing rules,
   different topic registry.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { apprenticeDialogueProgress } from "../../db/schema";
import {
  NPC_DIALOGUES,
  type NpcDialogueChoice,
  type NpcDialogueTopic,
} from "../../shared/npcDialogues";
import type { NamedNpcKey } from "../../shared/npcIdentity";

export interface NpcDialogueProgress {
  pathChoices: readonly string[];
  flagsSet: readonly string[];
  bondDeltaApplied: number;
  playedAt: number;
  sealed: boolean;
}

const EMPTY: NpcDialogueProgress = {
  pathChoices: [],
  flagsSet: [],
  bondDeltaApplied: 0,
  playedAt: 0,
  sealed: false,
};

export function getNpcTopic(topicId: string): NpcDialogueTopic | null {
  for (const k of Object.keys(NPC_DIALOGUES) as NamedNpcKey[]) {
    const set = NPC_DIALOGUES[k];
    for (const t of [set.past, set.calling, set.mortality, set.us]) {
      if (t.id === topicId) return t;
    }
  }
  return null;
}

export function resolveNpcCurrentChoices(
  topic: NpcDialogueTopic,
  pathChoices: readonly string[],
): {
  pickedSoFar: NpcDialogueChoice[];
  nextChoices: NpcDialogueChoice[];
  sealed: boolean;
} {
  const pickedSoFar: NpcDialogueChoice[] = [];
  let cursor = topic.choices as NpcDialogueChoice[];
  for (const choiceId of pathChoices) {
    const next = cursor.find((c) => c.id === choiceId);
    if (!next) return { pickedSoFar, nextChoices: [], sealed: true };
    pickedSoFar.push(next);
    if (!next.followups || next.followups.length === 0) {
      return { pickedSoFar, nextChoices: [], sealed: true };
    }
    cursor = next.followups as NpcDialogueChoice[];
  }
  return { pickedSoFar, nextChoices: cursor, sealed: false };
}

export async function getNpcProgress(
  userId: number,
  npcKey: NamedNpcKey,
  topicId: string,
): Promise<NpcDialogueProgress> {
  const db = await getDb();
  if (!db) return EMPTY;
  const [row] = await db
    .select()
    .from(apprenticeDialogueProgress)
    .where(
      and(
        eq(apprenticeDialogueProgress.userId, userId),
        eq(apprenticeDialogueProgress.memberKey, npcKey),
        eq(apprenticeDialogueProgress.topicId, topicId),
      ),
    )
    .limit(1);
  if (!row) return EMPTY;
  const topic = getNpcTopic(topicId);
  const { sealed } = topic
    ? resolveNpcCurrentChoices(topic, row.pathChoices ?? [])
    : { sealed: true };
  return {
    pathChoices: row.pathChoices ?? [],
    flagsSet: row.flagsSet ?? [],
    bondDeltaApplied: row.bondDeltaApplied,
    playedAt: row.playedAt?.getTime?.() ?? 0,
    sealed,
  };
}

export async function listNpcProgress(
  userId: number,
  npcKey: NamedNpcKey,
): Promise<Record<string, NpcDialogueProgress>> {
  const db = await getDb();
  if (!db) return {};
  const rows = await db
    .select()
    .from(apprenticeDialogueProgress)
    .where(
      and(
        eq(apprenticeDialogueProgress.userId, userId),
        eq(apprenticeDialogueProgress.memberKey, npcKey),
      ),
    );
  const out: Record<string, NpcDialogueProgress> = {};
  for (const row of rows) {
    const topic = getNpcTopic(row.topicId);
    const { sealed } = topic
      ? resolveNpcCurrentChoices(topic, row.pathChoices ?? [])
      : { sealed: true };
    out[row.topicId] = {
      pathChoices: row.pathChoices ?? [],
      flagsSet: row.flagsSet ?? [],
      bondDeltaApplied: row.bondDeltaApplied,
      playedAt: row.playedAt?.getTime?.() ?? 0,
      sealed,
    };
  }
  return out;
}

export type NpcPickChoiceResult =
  | {
      ok: true;
      progress: NpcDialogueProgress;
      pickedChoice: NpcDialogueChoice;
      nextChoices: NpcDialogueChoice[];
      sealed: boolean;
    }
  | { ok: false; reason: string };

export async function pickNpcChoice(
  userId: number,
  npcKey: NamedNpcKey,
  topicId: string,
  choiceId: string,
): Promise<NpcPickChoiceResult> {
  const topic = getNpcTopic(topicId);
  if (!topic) return { ok: false, reason: `Topic ${topicId} not found.` };
  const existing = await getNpcProgress(userId, npcKey, topicId);
  if (existing.sealed) {
    return { ok: false, reason: "Topic already sealed for this NPC." };
  }
  const resolved = resolveNpcCurrentChoices(topic, existing.pathChoices);
  const candidate = resolved.nextChoices.find((c) => c.id === choiceId);
  if (!candidate) {
    return {
      ok: false,
      reason: `Choice ${choiceId} not available at this depth.`,
    };
  }
  const newPath = [...existing.pathChoices, choiceId];
  const newFlags = Array.from(
    new Set([...existing.flagsSet, ...(candidate.flagToSet ? [candidate.flagToSet] : [])]),
  );
  const newBond = existing.bondDeltaApplied + candidate.bondDelta;
  const now = Date.now();
  const after = resolveNpcCurrentChoices(topic, newPath);
  const db = await getDb();
  if (db) {
    await db
      .insert(apprenticeDialogueProgress)
      .values({
        userId,
        memberKey: npcKey,
        topicId,
        pathChoices: newPath,
        flagsSet: newFlags,
        bondDeltaApplied: newBond,
      })
      .onDuplicateKeyUpdate({
        set: {
          pathChoices: newPath,
          flagsSet: newFlags,
          bondDeltaApplied: newBond,
        },
      });
  }
  return {
    ok: true,
    pickedChoice: candidate,
    nextChoices: after.nextChoices,
    sealed: after.sealed,
    progress: {
      pathChoices: newPath,
      flagsSet: newFlags,
      bondDeltaApplied: newBond,
      playedAt: now,
      sealed: after.sealed,
    },
  };
}
