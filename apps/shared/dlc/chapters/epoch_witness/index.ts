/* ═══════════════════════════════════════════════════════
   EPOCH WITNESS DLC ADAPTER

   Wraps every NexusPointVote in the late-age epochs
   (Insurgency / Revelation / Fall of Reality) as a DLC
   chapter so the DLC registry surfaces them through the
   same prerequisite gate + status pipeline as the rest of
   the DLC content.

   The vote payload itself is the source of truth; this
   module derives the chapter shell. Casting the vote still
   flows through `apps/server/services/epochWitnessService.
   castVote()` — the DLC chapter is a discovery + gating
   surface, not a duplicate vote channel.

   Wave 4: ships chapters for the 16 late-age votes from
   `epochWitnessVotesLate.ts`. Privacy + Prophecy stay
   surface-only (their UI predates the DLC system).
   ═══════════════════════════════════════════════════════ */

import type { DlcChapter, DlcPrerequisite, DlcStep } from "../../types";
import {
  AGE_OF_INSURGENCY_VOTES,
  AGE_OF_REVELATION_VOTES,
  FALL_OF_REALITY_VOTES,
} from "../../../epochWitnessVotesLate";
import type { NexusPointVote } from "../../../epochWitnessVotes";

const LATE_VOTES: readonly NexusPointVote[] = [
  ...AGE_OF_INSURGENCY_VOTES,
  ...AGE_OF_REVELATION_VOTES,
  ...FALL_OF_REALITY_VOTES,
];

/** Chapter id for an epoch-witness DLC chapter. Stable: derived
 *  from the vote id with a `dlc_epoch_` prefix. Exported so
 *  external code can chain prerequisites without re-deriving. */
export function epochWitnessChapterId(voteId: string): string {
  return `dlc_epoch_${voteId}`;
}

/** Sequence ordering within a parent section. Vote ids follow
 *  `<prefix>_v<N>` for body votes and `<prefix>_close` for the
 *  epoch closer; closers sort last (sequence = 99). */
function deriveSequence(voteId: string): number {
  const m = /_v(\d+)$/.exec(voteId);
  if (m) return Number(m[1]);
  if (voteId.endsWith("_close")) return 99;
  return 1;
}

/** Build the steps for a chapter that wraps a vote. The vote's
 *  narrative metadata maps onto narration + a single choice step.
 *  Renderable via the standard DlcStep switch (narration + choice). */
function buildVoteSteps(vote: NexusPointVote): DlcStep[] {
  const steps: DlcStep[] = [];
  steps.push({
    kind: "narration",
    id: "official_history",
    speaker: "antiquarian",
    text: vote.officialHistory,
    subtitle: vote.nexusDescription,
  });
  if (vote.suppressedTruth) {
    steps.push({
      kind: "narration",
      id: "suppressed_truth",
      speaker: "antiquarian",
      text: vote.suppressedTruth,
      subtitle: "Suppressed Truth — surfaces at 60% community vote.",
    });
  }
  steps.push({
    kind: "choice",
    id: "cast_vote",
    speaker: "antiquarian",
    prompt: vote.title,
    options: vote.options.map((o) => ({
      id: o.id,
      text: o.text,
    })),
  });
  if (vote.shadowTongueEdit) {
    steps.push({
      kind: "narration",
      id: "shadow_tongue_edit",
      speaker: "antiquarian",
      text: vote.shadowTongueEdit,
      subtitle: "Shadow Tongue edit — surfaces if Dark path wins.",
    });
  }
  return steps;
}

/** Build the prerequisites a chapter inherits from its vote.
 *  At minimum every late-age chapter requires the player to have
 *  finished the previous epoch's spine; the vote's own
 *  `lockedUntil` flag rolls in as an extra flag prereq. */
function buildVotePrerequisites(vote: NexusPointVote): DlcPrerequisite[] {
  const prereqs: DlcPrerequisite[] = [];
  /* Each late-age epoch sits behind a different point in the
   * spine. Insurgency unlocks once Act 4 is complete (the
   * Insurgency-Rise spine); Revelation needs Act 5; Fall of
   * Reality needs the Act 7 finale. */
  switch (vote.epoch) {
    case "age_of_insurgency":
      prereqs.push({ kind: "act_completion", act: 4 });
      break;
    case "age_of_revelation":
      prereqs.push({ kind: "act_completion", act: 5 });
      break;
    case "fall_of_reality":
      prereqs.push({ kind: "act_completion", act: 7 });
      break;
    /* Privacy / Prophecy are surface-only (no DLC chapter), but
     * the switch is exhaustive for forwards-compat. */
    case "age_of_privacy":
    case "age_of_prophecy":
      break;
  }
  if (vote.lockedUntil) {
    prereqs.push({ kind: "flag", flag: vote.lockedUntil });
  }
  return prereqs;
}

/** Wrap a single vote as a DLC chapter. Pure / synchronous. */
export function buildDlcChapterFromVote(vote: NexusPointVote): DlcChapter {
  const id = epochWitnessChapterId(vote.id);
  return {
    id,
    title: vote.title,
    synopsis: vote.nexusDescription,
    parentSection: {
      kind: "epoch_witness",
      epoch: vote.epoch,
      archetype: vote.archetypeRequired,
    },
    sequence: deriveSequence(vote.id),
    prerequisites: buildVotePrerequisites(vote),
    steps: buildVoteSteps(vote),
    /* Connected loredex entries unlock when the chapter completes —
     * the existing castVote service writes the actual consequences
     * (light energy, faction trust, etc.) so we don't duplicate them
     * here. The loredex unlocks are the safe, declarative subset. */
    rewards: {
      loredexEntries: vote.connectedLoredexEntries,
    },
    setsFlagsOnComplete: [`dlc_chapter_${id}_complete`],
  };
}

/** All 16 late-age votes wrapped as DLC chapters. Frozen so the
 *  registry can spread it directly. */
export const ALL_EPOCH_WITNESS_DLC_CHAPTERS: readonly DlcChapter[] =
  Object.freeze(LATE_VOTES.map(buildDlcChapterFromVote));
