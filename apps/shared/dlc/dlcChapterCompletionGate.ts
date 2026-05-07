/* ═══════════════════════════════════════════════════════
   DLC CHAPTER COMPLETION GATE

   Pure-function evaluator: given a chapter and a player's
   progression snapshot (narrative flags + entitlements),
   decide whether the chapter is available, complete, or
   blocked on specific prerequisites.

   No I/O. Mirrors the shape of
   `apps/shared/act{2..7}CompletionGate.ts`.
   ═══════════════════════════════════════════════════════ */

import type {
  DlcChapter,
  DlcChapterStatus,
  DlcPrerequisite,
} from "./types";
import { dlcChapterCompletionFlag } from "./dlcChapterRegistry";

/** Player snapshot the gate needs. Sourced server-side from
 *  `gameData.narrativeFlags` + the entitlements bag, or
 *  client-side from the cached game state. */
export interface DlcChapterGateInput {
  readonly chapter: DlcChapter;
  /** Truthy values count as set; matches the convention used
   *  by the act-completion gates. */
  readonly flags: Readonly<Record<string, unknown>>;
  /** Per-player entitlements (battle-pass / founder / etc).
   *  Keyed by entitlement name; truthy = held. */
  readonly entitlements: Readonly<Record<string, unknown>>;
  /** Bloodline generations completed per BloodClassification.
   *  Optional — chapters without bloodline_threshold prereqs
   *  ignore it. Sourced server-side from gameData.bloodlineGenerations. */
  readonly bloodlineGenerations?: Readonly<Record<string, number>>;
}

function isTruthy(v: unknown): boolean {
  return v === true || v === 1 || v === "true";
}

/** True iff a single prerequisite is satisfied. */
export function isPrerequisiteMet(
  prereq: DlcPrerequisite,
  input: Pick<
    DlcChapterGateInput,
    "flags" | "entitlements" | "bloodlineGenerations"
  >,
): boolean {
  switch (prereq.kind) {
    case "flag":
      return isTruthy(input.flags[prereq.flag]);
    case "act_completion":
      return isTruthy(input.flags[`act_${prereq.act}_complete`]);
    case "secret":
      return isTruthy(input.flags[`act_${prereq.act}_secret_revealed`]);
    case "dlc_chapter_completion":
      return isTruthy(
        input.flags[dlcChapterCompletionFlag(prereq.chapterId)],
      );
    case "entitlement":
      return isTruthy(input.entitlements[prereq.key]);
    case "bloodline_threshold": {
      const generations = input.bloodlineGenerations?.[prereq.classification] ?? 0;
      return generations >= prereq.minGenerations;
    }
  }
}

/** Compute a chapter's status for the active player. Pure. */
export function deriveDlcChapterStatus(
  input: DlcChapterGateInput,
): DlcChapterStatus {
  const { chapter, flags, entitlements, bloodlineGenerations } = input;
  const alreadyComplete = isTruthy(
    flags[dlcChapterCompletionFlag(chapter.id)],
  );
  const missing: DlcPrerequisite[] = [];
  for (const prereq of chapter.prerequisites) {
    if (
      !isPrerequisiteMet(prereq, { flags, entitlements, bloodlineGenerations })
    ) {
      missing.push(prereq);
    }
  }
  return {
    chapterId: chapter.id,
    available: missing.length === 0,
    alreadyComplete,
    missingPrerequisites: missing,
  };
}

/** Filter helper: return only chapters whose prerequisites are met
 *  AND which the player hasn't already completed. The default
 *  view for "what DLC can I play right now?" lists. */
export function getAvailableDlcChapters(
  chapters: readonly DlcChapter[],
  flags: Readonly<Record<string, unknown>>,
  entitlements: Readonly<Record<string, unknown>>,
  bloodlineGenerations?: Readonly<Record<string, number>>,
): DlcChapter[] {
  const out: DlcChapter[] = [];
  for (const chapter of chapters) {
    const status = deriveDlcChapterStatus({
      chapter,
      flags,
      entitlements,
      bloodlineGenerations,
    });
    if (status.available && !status.alreadyComplete) {
      out.push(chapter);
    }
  }
  return out;
}
