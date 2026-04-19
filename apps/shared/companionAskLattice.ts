/* ═══════════════════════════════════════════════════════
   COMPANION ASK LATTICE — act-filtered Q&A surface

   Closes audit item #5 from ACTS_2_7_COMPLETENESS_AUDIT.md:
   a shared "what can I ask right now?" aggregate view over
   companionAskTopics, companionComments, and the morality /
   trust / act variant registry.

   This module is pure data — it does not render anything.
   UI consumers (CompanionAskPanel, Loredex hub overlays,
   scripted wheels) call `buildAskLattice(input)` with the
   current player state and get back:

     - available: topics the player can ask right now
     - upcoming: topics that will unlock in a later act
                 (useful for hint surfaces and the "keep
                 witnessing" empty state)
     - byAct: map<act, topic[]> for grouped rendering
     - resolvedAnswers: map<topic.id, text> — the answer
                 each available topic currently resolves to
                 (pre-running resolveAskAnswer so consumers
                 can render without another pass)

   The lattice is additive. Existing consumers that call
   getAvailableAskTopics + getAskTopic directly continue to
   work; the lattice is for consumers that want the full
   view in a single call.
   ═══════════════════════════════════════════════════════ */

import {
  COMPANION_ASK_TOPICS,
  resolveAskAnswer,
  type AskSpeaker,
  type CompanionAskTopic,
} from "./companionAskTopics";

export interface AskLatticeInput {
  /** Which companion the surface is asking about. */
  speaker: AskSpeaker;
  /** Current narrative act (1-7). */
  currentAct: number;
  /** Narrative flags the player has set. */
  flags: ReadonlySet<string>;
}

export interface AskLatticeView {
  /** Topics the player can ask right now. */
  available: readonly CompanionAskTopic[];
  /** Topics that exist but have not unlocked yet (future acts or flags). */
  upcoming: readonly CompanionAskTopic[];
  /** Available topics grouped by the act they unlocked from. */
  byAct: ReadonlyMap<number, readonly CompanionAskTopic[]>;
  /**
   * Precomputed resolved answers for each available topic id.
   * Consumers should prefer this over reading topic.answer directly
   * so act-progressed alternates render correctly.
   */
  resolvedAnswers: ReadonlyMap<string, string>;
  /**
   * Count by speaker of available topics — useful for header badges
   * ("Elara — 3 topics open").
   */
  availableCounts: Readonly<Record<AskSpeaker, number>>;
}

/**
 * Build the full ask-lattice view for a given player state + speaker.
 * Pure function — runs through the registry once and returns a
 * frozen snapshot.
 */
export function buildAskLattice(input: AskLatticeInput): AskLatticeView {
  const { speaker, currentAct, flags } = input;

  const available: CompanionAskTopic[] = [];
  const upcoming: CompanionAskTopic[] = [];

  for (const t of COMPANION_ASK_TOPICS) {
    if (t.speaker !== speaker) continue;
    const actOk = currentAct >= t.unlockedFromAct;
    const flagOk = flags.has(t.unlockFlag);
    if (actOk && flagOk) {
      available.push(t);
    } else {
      // Upcoming = topic exists, but at least one gate is not yet passed.
      upcoming.push(t);
    }
  }

  // Sort by unlockedFromAct for consistent rendering order.
  available.sort(byActThenId);
  upcoming.sort(byActThenId);

  const byAct = new Map<number, CompanionAskTopic[]>();
  for (const t of available) {
    const bucket = byAct.get(t.unlockedFromAct) ?? [];
    bucket.push(t);
    byAct.set(t.unlockedFromAct, bucket);
  }

  const resolvedAnswers = new Map<string, string>();
  for (const t of available) {
    resolvedAnswers.set(t.id, resolveAskAnswer(t, currentAct, flags));
  }

  return {
    available,
    upcoming,
    byAct,
    resolvedAnswers,
    availableCounts: {
      elara: speaker === "elara" ? available.length : 0,
      human: speaker === "human" ? available.length : 0,
    },
  };
}

function byActThenId(a: CompanionAskTopic, b: CompanionAskTopic): number {
  if (a.unlockedFromAct !== b.unlockedFromAct) {
    return a.unlockedFromAct - b.unlockedFromAct;
  }
  return a.id.localeCompare(b.id);
}

/**
 * Return the count of topics that will become available on a given
 * future act, keyed by speaker. Used for preview surfaces that want
 * to say "three more topics unlock at Act 4."
 */
export function countUpcomingAtAct(
  targetAct: number,
  flags: ReadonlySet<string>
): Readonly<Record<AskSpeaker, number>> {
  let elara = 0;
  let human = 0;
  for (const t of COMPANION_ASK_TOPICS) {
    if (t.unlockedFromAct !== targetAct) continue;
    if (!flags.has(t.unlockFlag)) continue;
    if (t.speaker === "elara") elara++;
    else human++;
  }
  return { elara, human };
}

/**
 * Convenience builder that produces the lattice for both speakers at
 * once. Useful for hub renderers that show both columns side by side.
 */
export function buildBothSpeakerLattices(
  currentAct: number,
  flags: ReadonlySet<string>
): { elara: AskLatticeView; human: AskLatticeView } {
  return {
    elara: buildAskLattice({ speaker: "elara", currentAct, flags }),
    human: buildAskLattice({ speaker: "human", currentAct, flags }),
  };
}
