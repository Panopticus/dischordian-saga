/* ═══════════════════════════════════════════════════════
   APPRENTICE DIALOGUE SERVICE — server-side state machine
   for BioWare-style branching topics.

   Each (user × memberKey × topicId) row records:
     - the path of choices the player picked
     - flags set by the chosen branches
     - cumulative bond delta applied at play time

   Topics are one-shot per crew member: once the topic ends
   (a non-followup choice was picked, or a follow-up choice
   was picked), the row is sealed. Re-opening returns the
   stored path so the UI can display it as "(heard)".

   The service is pure persistence + a small lookup helper
   (getNodeForChoice) to decide whether the next click ends
   the topic or moves to a follow-up node. Bond deltas are
   applied once, atomically, when the topic seals.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { apprenticeDialogueProgress } from "../../db/schema";
import {
  APPRENTICE_DIALOGUES,
  type DialogueChoice,
  type DialogueTopic,
} from "../../shared/apprenticeDialogues";
import type { ApprenticeArchetype } from "../../shared/apprentices";
import {
  loadCrewState,
  saveCrewState,
} from "./crewState";

export interface DialogueProgress {
  /** Choice ids picked in order. */
  pathChoices: readonly string[];
  /** Narrative flags set by the chosen branches. */
  flagsSet: readonly string[];
  /** Cumulative bond delta applied. */
  bondDeltaApplied: number;
  /** ms epoch when the topic was last touched. */
  playedAt: number;
  /** True when no further choice is reachable from the path so far. */
  sealed: boolean;
}

const EMPTY: DialogueProgress = {
  pathChoices: [],
  flagsSet: [],
  bondDeltaApplied: 0,
  playedAt: 0,
  sealed: false,
};

/** Look up a topic across the registry. */
export function getTopic(topicId: string): DialogueTopic | null {
  for (const arch of Object.keys(APPRENTICE_DIALOGUES) as ApprenticeArchetype[]) {
    const set = APPRENTICE_DIALOGUES[arch];
    for (const t of [set.past, set.calling, set.mortality, set.us]) {
      if (t.id === topicId) return t;
    }
  }
  return null;
}

/** Resolve the choice list at the current depth of the path.
 *  Returns the array of valid next choices, plus the choice that was
 *  *just* picked (so the UI can render its npcReply). */
export function resolveCurrentChoices(
  topic: DialogueTopic,
  pathChoices: readonly string[],
): {
  /** The chosen choice for each step taken so far. */
  pickedSoFar: DialogueChoice[];
  /** Choices that the player can pick next. Empty when sealed. */
  nextChoices: DialogueChoice[];
  /** True when the path has reached a leaf (no more choices available). */
  sealed: boolean;
} {
  const pickedSoFar: DialogueChoice[] = [];
  let cursor = topic.choices as DialogueChoice[];
  for (const choiceId of pathChoices) {
    const next = cursor.find((c) => c.id === choiceId);
    if (!next) {
      // Path is invalid — treat as sealed at this point.
      return { pickedSoFar, nextChoices: [], sealed: true };
    }
    pickedSoFar.push(next);
    if (!next.followups || next.followups.length === 0) {
      // No follow-ups → sealed after this pick.
      return { pickedSoFar, nextChoices: [], sealed: true };
    }
    cursor = next.followups as DialogueChoice[];
  }
  return { pickedSoFar, nextChoices: cursor, sealed: false };
}

/** Read progress for a topic on a member. */
export async function getProgress(
  userId: number,
  memberKey: string,
  topicId: string,
): Promise<DialogueProgress> {
  const db = await getDb();
  if (!db) return EMPTY;
  const [row] = await db
    .select()
    .from(apprenticeDialogueProgress)
    .where(
      and(
        eq(apprenticeDialogueProgress.userId, userId),
        eq(apprenticeDialogueProgress.memberKey, memberKey),
        eq(apprenticeDialogueProgress.topicId, topicId),
      ),
    )
    .limit(1);
  if (!row) return EMPTY;
  const topic = getTopic(topicId);
  const { sealed } = topic
    ? resolveCurrentChoices(topic, row.pathChoices ?? [])
    : { sealed: true };
  return {
    pathChoices: row.pathChoices ?? [],
    flagsSet: row.flagsSet ?? [],
    bondDeltaApplied: row.bondDeltaApplied,
    playedAt: row.playedAt?.getTime?.() ?? 0,
    sealed,
  };
}

/** List progress across all topics for one member — used by the UI to
 *  render the topic list with unlocked/heard/sealed states. */
export async function listProgressForMember(
  userId: number,
  memberKey: string,
): Promise<Record<string, DialogueProgress>> {
  const db = await getDb();
  if (!db) return {};
  const rows = await db
    .select()
    .from(apprenticeDialogueProgress)
    .where(
      and(
        eq(apprenticeDialogueProgress.userId, userId),
        eq(apprenticeDialogueProgress.memberKey, memberKey),
      ),
    );
  const out: Record<string, DialogueProgress> = {};
  for (const row of rows) {
    const topic = getTopic(row.topicId);
    const { sealed } = topic
      ? resolveCurrentChoices(topic, row.pathChoices ?? [])
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

export type PickChoiceResult =
  | {
      ok: true;
      progress: DialogueProgress;
      /** The choice the player just picked (NPC reply lives here). */
      pickedChoice: DialogueChoice;
      /** Next available choices (empty when sealed). */
      nextChoices: DialogueChoice[];
      sealed: boolean;
    }
  | { ok: false; reason: string };

/** Apply a player choice. Validates the choice belongs to the current
 *  depth, appends to pathChoices, accumulates bond + flags. When the
 *  pick seals the topic (no follow-ups), apply the cumulative bond
 *  delta to the crew member's loyalty stat. */
export async function pickChoice(
  userId: number,
  memberKey: string,
  topicId: string,
  choiceId: string,
): Promise<PickChoiceResult> {
  const topic = getTopic(topicId);
  if (!topic) return { ok: false, reason: `Topic ${topicId} not found.` };

  const existing = await getProgress(userId, memberKey, topicId);
  if (existing.sealed) {
    return { ok: false, reason: "Topic already sealed for this member." };
  }
  const resolved = resolveCurrentChoices(topic, existing.pathChoices);
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

  // Resolve again to determine whether THIS choice sealed the topic.
  const after = resolveCurrentChoices(topic, newPath);

  const db = await getDb();
  if (db) {
    await db
      .insert(apprenticeDialogueProgress)
      .values({
        userId,
        memberKey,
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

  // When the topic seals on this pick, apply the bond delta to the
  // member's loyalty (clamped 0..100). Idempotent — we apply only the
  // delta accumulated *during this conversation*, not the whole row.
  if (after.sealed && newBond !== 0) {
    try {
      const state = await loadCrewState(userId);
      if (state) {
        const idx = state.roster.members.findIndex((m) => m.id === memberKey);
        if (idx !== -1) {
          const member = state.roster.members[idx];
          const newLoyalty = Math.max(
            0,
            Math.min(100, member.loyalty + newBond),
          );
          if (newLoyalty !== member.loyalty) {
            await saveCrewState(userId, {
              ...state,
              roster: {
                ...state.roster,
                members: state.roster.members.map((m, i) =>
                  i === idx ? { ...m, loyalty: newLoyalty } : m,
                ),
              },
            });
          }
        }
      }
    } catch {
      // Best-effort — the dialog progress is the source of truth.
    }
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
