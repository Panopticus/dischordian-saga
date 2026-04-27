// apps/shared/npcs/askTopics.ts
//
// Generalized NPC ask-topic registry — Phase 6 Infrastructure Deliverable 1.
//
// Generalizes apps/shared/companionAskTopics.ts (Elara/Human-only) to all
// 13 priority-roster NPC keys, adding band/reveal/axis gating + VO clip key
// + cross-NPC public-flag side effects so per-character ask-banks can match
// the Phase 6 BioWare-depth scope per the writers' guide.
//
// The Elara/Human banks remain in companionAskTopics.ts unchanged; this
// module adopts them via a thin import-bridge in askTopics/index.ts so the
// existing dialog-wheel surface keeps working without migration.

import type {
  NpcKey,
  TrustBand,
  RevealStage,
  PlayerAxisGate,
} from "./types";

/**
 * Act-progressed alternate answer. If multiple alternates match, the one
 * with the highest unlockedFromAct that is ≤ the current act wins. Used for
 * canonical multi-act alternate-answer arcs (e.g. Locke "Who are you?"
 * Acts 1/4/7; Vex "Who are you?" 4-stage reveal; Oracle "Who are you?"
 * Acts 4/5/6/7).
 */
export interface AskTopicAlternateAnswer {
  /** Lowest act at which this alternate supersedes the base answer. */
  unlockedFromAct: number;
  /** The replacement answer body. */
  answer: string;
  /** Optional additional flag the player must have set. */
  requiredFlag?: string;
  /** Optional reveal-stage gate (Vex / Hierophant / Meme / Oracle / etc.). */
  requiresRevealStage?: RevealStage;
  /** Optional VO clip override for this alternate. */
  voId?: string;
}

export interface AskTopic {
  /** Globally unique id. Convention: "ask_{npcKey}_{topic}". */
  id: string;
  npcKey: NpcKey;
  /** Short topic label shown on the ask sub-wheel button (≤ 24 chars). */
  label: string;
  /** The player's framing of the question. */
  question: string;
  /** Base / earliest-unlock answer body. */
  answer: string;

  /** Required narrative flag (topic invisible until set). */
  unlockFlag: string;
  /** Lowest act at which the topic appears. */
  unlockedFromAct: number;

  /** Optional follow-up topic for one-tap continuation. */
  followUp?: string;

  /** Act-progressed alternate answers. */
  alternateAnswers?: ReadonlyArray<AskTopicAlternateAnswer>;

  // --- Phase 6 generalization ----------------------------------------

  /** Required trust band (resolved against the NPC's NpcProfile.trustBands). */
  requiresTrustBand?: TrustBand;

  /** Required reveal-stage. */
  requiresRevealStage?: RevealStage;

  /** Player-axis personality gate (per-NPC axis-of-interest). */
  playerAxisGate?: PlayerAxisGate;

  /** ElevenLabs VO clip key — vo/{npcKey}/{lineId}.mp3 convention. */
  voId?: string;

  /** Cross-NPC public flags written when the topic is asked. */
  setsPublicFlags?: ReadonlyArray<string>;

  /** Per-NPC narrative flags set when the topic is asked. */
  setsFlags?: ReadonlyArray<string>;
}

// --- Resolution context ----------------------------------------------------

export interface AskTopicResolutionContext {
  currentAct: number;
  flags: ReadonlySet<string>;
  publicFlags?: ReadonlySet<string>;
  trustBand?: TrustBand;
  revealStage?: RevealStage;
}

/**
 * Resolve the answer text for a topic under the current state. Picks the
 * highest-act alternate that is both ≤ the current act and gate-satisfied;
 * falls back to the base answer.
 *
 * Specificity-scoring follows the same pattern as selector.ts: alternate
 * with more matched gates wins ties at the same unlockedFromAct.
 */
export function resolveAskAnswer(
  topic: AskTopic,
  ctx: AskTopicResolutionContext,
): string {
  if (!topic.alternateAnswers || topic.alternateAnswers.length === 0) {
    return topic.answer;
  }
  const candidates = topic.alternateAnswers.filter((a) => {
    if (ctx.currentAct < a.unlockedFromAct) return false;
    if (a.requiredFlag && !ctx.flags.has(a.requiredFlag)) return false;
    if (a.requiresRevealStage && ctx.revealStage !== a.requiresRevealStage) {
      return false;
    }
    return true;
  });
  if (candidates.length === 0) return topic.answer;
  // Sort by act descending; tie-break by gate-specificity descending.
  candidates.sort((a, b) => {
    if (b.unlockedFromAct !== a.unlockedFromAct) {
      return b.unlockedFromAct - a.unlockedFromAct;
    }
    return scoreAlternate(b) - scoreAlternate(a);
  });
  return candidates[0]?.answer ?? topic.answer;
}

function scoreAlternate(a: AskTopicAlternateAnswer): number {
  return (
    (a.requiredFlag ? 1 : 0) +
    (a.requiresRevealStage ? 1 : 0)
  );
}

/**
 * Filter topics that are currently visible to the player given act + flags
 * + optional trust/reveal/public-flag context. Topics with unmet gates are
 * hidden so the ask-wheel never offers an unanswerable question.
 */
export function getAvailableAskTopics(
  topics: ReadonlyArray<AskTopic>,
  npcKey: NpcKey,
  ctx: AskTopicResolutionContext,
): ReadonlyArray<AskTopic> {
  return topics.filter((t) => {
    if (t.npcKey !== npcKey) return false;
    if (ctx.currentAct < t.unlockedFromAct) return false;
    if (!ctx.flags.has(t.unlockFlag)) return false;
    if (t.requiresTrustBand && ctx.trustBand !== t.requiresTrustBand) {
      return false;
    }
    if (t.requiresRevealStage && ctx.revealStage !== t.requiresRevealStage) {
      return false;
    }
    return true;
  });
}

export function getAskTopic(
  topics: ReadonlyArray<AskTopic>,
  id: string,
): AskTopic | undefined {
  return topics.find((t) => t.id === id);
}
