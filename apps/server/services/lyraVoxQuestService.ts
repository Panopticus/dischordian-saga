/* ═══════════════════════════════════════════════════════
   LYRA VOX QUEST SERVICE

   Runtime for the 5-step investigation shipped in
   apps/shared/lyraVoxQuestline.ts (PR #427).

   Step progression is linear: file → lab → testimony →
   confrontation → inscription. Each step writes the player's
   chosen flag (theory / door / witness / verdict) to the
   lyra_vox_progress row plus to npc_public_flags so the
   Antiquarian's Tome and other reactive systems can pick up
   the verdict.

   The inscription step is automatic once the verdict is
   issued — the Antiquarian writes the canonical record into
   vote_antiquarian_entries.
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import {
  lyraVoxProgress,
  npcPublicFlags,
  voteAntiquarianEntries,
} from "../../db/schema";
import {
  getStep,
  LYRA_VOX_INSCRIPTIONS,
  LYRA_VOX_STEPS,
  type LyraVoxStepId,
  type LyraVoxVerdict,
} from "../../shared/lyraVoxQuestline";
import { getDb } from "../db";
import { logger } from "../logger";

export interface LyraVoxStatus {
  currentStep: LyraVoxStepId;
  theoryChosen: string | null;
  doorOpened: string | null;
  witnessBelieved: string | null;
  verdict: LyraVoxVerdict | null;
  completed: boolean;
  /** True if the player has not yet started the questline. */
  notStarted: boolean;
}

export interface AdvanceResult {
  ok: boolean;
  reason?: "unknown_step" | "not_current_step" | "unknown_prompt";
  newStep?: LyraVoxStepId;
  flagSet?: string;
  inscription?: string;
}

const STEP_ORDER: readonly LyraVoxStepId[] = [
  "file",
  "lab",
  "testimony",
  "confrontation",
  "inscription",
];

async function readProgress(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(lyraVoxProgress)
    .where(eq(lyraVoxProgress.userId, userId))
    .limit(1);
  return row ?? null;
}

async function ensureRow(userId: number) {
  const existing = await readProgress(userId);
  if (existing) return existing;
  const db = await getDb();
  if (!db) return null;
  await db.insert(lyraVoxProgress).values({
    userId,
    currentStep: "file",
  });
  return readProgress(userId);
}

export async function getStatus(userId: number): Promise<LyraVoxStatus> {
  const row = await readProgress(userId);
  if (!row) {
    return {
      currentStep: "file",
      theoryChosen: null,
      doorOpened: null,
      witnessBelieved: null,
      verdict: null,
      completed: false,
      notStarted: true,
    };
  }
  return {
    currentStep: row.currentStep as LyraVoxStepId,
    theoryChosen: row.theoryChosen,
    doorOpened: row.doorOpened,
    witnessBelieved: row.witnessBelieved,
    verdict: (row.verdict as LyraVoxVerdict | null) ?? null,
    completed: row.completed,
    notStarted: false,
  };
}

/**
 * Pick a prompt at the player's current step. Validates that
 * the supplied promptId belongs to the current step and writes
 * the corresponding flag. Advances the step on completion.
 */
export async function pickPrompt(args: {
  userId: number;
  stepId: LyraVoxStepId;
  promptId: string;
}): Promise<AdvanceResult> {
  const db = await getDb();
  if (!db) return { ok: false, reason: "unknown_step" };

  const stepDef = getStep(args.stepId);
  if (!stepDef) return { ok: false, reason: "unknown_step" };

  const prompt = stepDef.prompts.find((p) => p.id === args.promptId);
  if (!prompt) return { ok: false, reason: "unknown_prompt" };

  const row = await ensureRow(args.userId);
  if (!row) return { ok: false, reason: "unknown_step" };

  if ((row.currentStep as LyraVoxStepId) !== args.stepId) {
    return { ok: false, reason: "not_current_step" };
  }

  // Write the chosen prompt to the row's per-step column.
  const updates: Partial<typeof lyraVoxProgress.$inferInsert> = {};
  switch (args.stepId) {
    case "file":
      updates.theoryChosen = args.promptId;
      break;
    case "lab":
      updates.doorOpened = args.promptId;
      break;
    case "testimony":
      updates.witnessBelieved = args.promptId;
      break;
    case "confrontation":
      // The promptId IS the verdict id (vindicated / complicit / both).
      updates.verdict = args.promptId;
      break;
    case "inscription":
      updates.completed = true;
      break;
  }

  // Advance to the next step (or stay at inscription).
  const stepIdx = STEP_ORDER.indexOf(args.stepId);
  const nextStep =
    stepIdx < STEP_ORDER.length - 1
      ? STEP_ORDER[stepIdx + 1]
      : args.stepId;
  updates.currentStep = nextStep;

  await db
    .update(lyraVoxProgress)
    .set(updates)
    .where(eq(lyraVoxProgress.id, row.id));

  // Write the flag to npc_public_flags so reactive systems pick
  // it up. Idempotent.
  try {
    await db
      .insert(npcPublicFlags)
      .values({
        userId: args.userId,
        flag: prompt.setsFlag,
        setBy: "lyra_vox",
      })
      .onDuplicateKeyUpdate({
        set: { flag: sql`${npcPublicFlags.flag}` },
      });
  } catch (err) {
    logger.warn("[lyraVox] flag write failed:", err);
  }

  // Cross-step writeable flags so subsequent steps can gate.
  const sentinelFlag = sentinelForStep(args.stepId);
  if (sentinelFlag) {
    try {
      await db
        .insert(npcPublicFlags)
        .values({
          userId: args.userId,
          flag: sentinelFlag,
          setBy: "lyra_vox",
        })
        .onDuplicateKeyUpdate({
          set: { flag: sql`${npcPublicFlags.flag}` },
        });
    } catch (err) {
      logger.warn("[lyraVox] sentinel flag write failed:", err);
    }
  }

  // After the verdict is issued at confrontation, write the
  // canonical Antiquarian inscription so it surfaces in the
  // Tome page.
  let inscription: string | undefined;
  if (args.stepId === "confrontation" && args.promptId) {
    const verdict = args.promptId as LyraVoxVerdict;
    inscription = LYRA_VOX_INSCRIPTIONS[verdict];
    if (inscription) {
      try {
        await db
          .insert(voteAntiquarianEntries)
          .values({
            voteId: `lyra_vox_verdict:${args.userId}`,
            winningOptionNumber: 1,
            body: inscription,
            annotation: null,
          })
          .onDuplicateKeyUpdate({
            set: { body: inscription },
          });
      } catch (err) {
        logger.warn("[lyraVox] tome write failed:", err);
      }
    }
  }

  return {
    ok: true,
    newStep: nextStep,
    flagSet: prompt.setsFlag,
    inscription,
  };
}

function sentinelForStep(step: LyraVoxStepId): string | null {
  switch (step) {
    case "file":
      return "lyra_vox:theory_chosen";
    case "lab":
      return "lyra_vox:lab_door_opened";
    case "testimony":
      return "lyra_vox:testimony_chosen";
    case "confrontation":
      return "lyra_vox:verdict_issued";
    case "inscription":
      return "lyra_vox:questline_complete";
  }
}

export { LYRA_VOX_STEPS };
