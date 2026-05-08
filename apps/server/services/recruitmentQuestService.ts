/* ═══════════════════════════════════════════════════════
   RECRUITMENT QUEST SERVICE — server-side state machine.

   Persists per-(user, npcKey) progress through a chain
   authored in apps/shared/recruitmentQuests.ts. Pure state
   machine on top of the DB table; the router consumes
   these helpers.

   State transitions:
     no row             → openChain()         → row at startStageId
     row at stage       → makeChoice(choice)  → row at next stage
                                              OR row with outcome
     row with outcome   → (terminal — npcRecruit.recruit
                            consumes recruitModifiers and
                            instantiates the crew member)
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { recruitmentQuestProgress } from "../../db/schema";
import {
  type RecruitmentChain,
  type RecruitmentChoice,
  type RecruitmentOutcome,
  getChoice,
  getRecruitmentChain,
  getStage,
} from "../../shared/recruitmentQuests";
import type { ResurrectableNpcKey } from "../../shared/resurrectionProtocols";

export interface RecruitmentProgress {
  /** Stage id the player is currently looking at. NULL = chain not opened. */
  currentStageId: string | null;
  /** Choice ids the player has picked, in order. */
  choiceHistory: readonly string[];
  /** Narrative flags accumulated. */
  flagsSet: readonly string[];
  /** Terminal outcome. NULL while the chain is in progress. */
  outcome: RecruitmentOutcome | null;
  /** Recruit modifiers — populated when outcome is "recruited_*". */
  recruitModifiers:
    | {
        startingLoyalty?: number;
        statTweaks?: Record<string, number>;
        relationshipTag?: string;
      }
    | null;
}

const EMPTY_PROGRESS: RecruitmentProgress = {
  currentStageId: null,
  choiceHistory: [],
  flagsSet: [],
  outcome: null,
  recruitModifiers: null,
};

/** Read the player's progress on a recruitment chain. */
export async function getProgress(
  userId: number,
  npcKey: ResurrectableNpcKey,
): Promise<RecruitmentProgress> {
  const db = await getDb();
  if (!db) return EMPTY_PROGRESS;
  const [row] = await db
    .select()
    .from(recruitmentQuestProgress)
    .where(
      and(
        eq(recruitmentQuestProgress.userId, userId),
        eq(recruitmentQuestProgress.npcKey, npcKey),
      ),
    )
    .limit(1);
  if (!row) return EMPTY_PROGRESS;
  return {
    currentStageId: row.currentStageId,
    choiceHistory: row.choiceHistory ?? [],
    flagsSet: row.flagsSet ?? [],
    outcome: (row.outcome as RecruitmentOutcome | null) ?? null,
    recruitModifiers: row.recruitModifiers ?? null,
  };
}

/** Open a recruitment chain at its start stage. Idempotent. */
export async function openChain(
  userId: number,
  npcKey: ResurrectableNpcKey,
): Promise<RecruitmentProgress> {
  const chain = getRecruitmentChain(npcKey);
  const existing = await getProgress(userId, npcKey);
  if (existing.currentStageId !== null) return existing;
  const db = await getDb();
  if (!db) {
    return {
      ...EMPTY_PROGRESS,
      currentStageId: chain.startStageId,
    };
  }
  await db
    .insert(recruitmentQuestProgress)
    .values({
      userId,
      npcKey,
      currentStageId: chain.startStageId,
      choiceHistory: [],
      flagsSet: [],
      outcome: null,
      recruitModifiers: null,
    })
    .onDuplicateKeyUpdate({
      // If a refused row exists, leave it untouched — the gate is
      // enforced at the router level.
      set: { updatedAt: new Date() },
    });
  return {
    currentStageId: chain.startStageId,
    choiceHistory: [],
    flagsSet: [],
    outcome: null,
    recruitModifiers: null,
  };
}

export type MakeChoiceResult =
  | {
      ok: true;
      progress: RecruitmentProgress;
      /** The choice the player just picked. */
      choice: RecruitmentChoice;
      /** True if this choice ended the chain. */
      terminal: boolean;
    }
  | { ok: false; reason: string };

/** Apply a player's choice. The choice id must belong to the current
 *  stage; the function validates and refuses otherwise. Updates the
 *  row's currentStageId / choiceHistory / flagsSet / outcome /
 *  recruitModifiers atomically. */
export async function makeChoice(
  userId: number,
  npcKey: ResurrectableNpcKey,
  choiceId: string,
): Promise<MakeChoiceResult> {
  const chain = getRecruitmentChain(npcKey);
  const progress = await getProgress(userId, npcKey);
  if (progress.currentStageId === null) {
    return { ok: false, reason: "Chain not opened. Call openChain() first." };
  }
  if (progress.outcome !== null) {
    return {
      ok: false,
      reason: `Chain already terminal (${progress.outcome}). Cannot pick further choices.`,
    };
  }
  const stage = getStage(chain, progress.currentStageId);
  if (!stage) {
    return {
      ok: false,
      reason: `Stage ${progress.currentStageId} not found in chain.`,
    };
  }
  const choice = getChoice(stage, choiceId);
  if (!choice) {
    return {
      ok: false,
      reason: `Choice ${choiceId} not available at stage ${stage.id}.`,
    };
  }

  const newChoiceHistory = [...progress.choiceHistory, choiceId];
  const newFlagsSet = Array.from(
    new Set([...progress.flagsSet, ...(choice.result.flagsToSet ?? [])]),
  );
  const isTerminal = choice.result.advanceTo === "end";
  const nextStageId = isTerminal ? null : choice.result.advanceTo;
  const nextOutcome = isTerminal ? choice.result.outcome ?? null : null;
  const nextRecruitModifiers =
    isTerminal &&
    nextOutcome &&
    nextOutcome !== "refused" &&
    (choice.result.startingLoyalty !== undefined ||
      choice.result.statTweaks !== undefined ||
      choice.result.relationshipTag !== undefined)
      ? {
          startingLoyalty: choice.result.startingLoyalty,
          statTweaks: choice.result.statTweaks as Record<string, number> | undefined,
          relationshipTag: choice.result.relationshipTag,
        }
      : progress.recruitModifiers;

  const db = await getDb();
  if (db) {
    await db
      .update(recruitmentQuestProgress)
      .set({
        currentStageId: nextStageId,
        choiceHistory: newChoiceHistory,
        flagsSet: newFlagsSet,
        outcome: nextOutcome,
        recruitModifiers: nextRecruitModifiers,
        resolvedAt: isTerminal ? new Date() : null,
      })
      .where(
        and(
          eq(recruitmentQuestProgress.userId, userId),
          eq(recruitmentQuestProgress.npcKey, npcKey),
        ),
      );
  }

  return {
    ok: true,
    choice,
    terminal: isTerminal,
    progress: {
      currentStageId: nextStageId,
      choiceHistory: newChoiceHistory,
      flagsSet: newFlagsSet,
      outcome: nextOutcome,
      recruitModifiers: nextRecruitModifiers,
    },
  };
}

/** True when the player has reached a terminal recruited_* outcome. */
export function isRecruitmentReady(p: RecruitmentProgress): boolean {
  return (
    p.outcome === "recruited_loyal" || p.outcome === "recruited_tense"
  );
}

/** True when the chain is locked because the player declined. */
export function isRecruitmentRefused(p: RecruitmentProgress): boolean {
  return p.outcome === "refused";
}

/** Convenience — verify the openGate flags, if any. The gate description
 *  is returned so the router/UI can display guidance copy. */
export function checkOpenGate(
  chain: RecruitmentChain,
  playerFlags: ReadonlySet<string>,
): { ok: true } | { ok: false; reason: string } {
  if (!chain.openGate) return { ok: true };
  const required = chain.openGate.requiresFlagsAll ?? [];
  for (const flag of required) {
    if (!playerFlags.has(flag)) {
      return { ok: false, reason: chain.openGate.description };
    }
  }
  return { ok: true };
}
