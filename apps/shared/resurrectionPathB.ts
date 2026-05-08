/* ═══════════════════════════════════════════════════════
   RESURRECTION PATH B — Necromancer-event auto-return

   When a global Necromancer event fires (necromancerCycle
   phase enters "manifesting" or later) and there are
   outstanding Resurrection Protocols quests, the unmediated
   Samsara machine performs the resurrection without the
   player's tribute.

   The NPC returns:
    - Off-ship (NOT on the inception ark).
    - Not on the crew (they leave).
    - With reputation hit (-30 trust against the player).
    - With a transmission "I'm back. No thanks to you.".
    - With their world-block lifted so quests/access
      become available again.

   Also fires when an act-progression beat explicitly
   demands the NPC alive (story-flag: actNeedsNpc).

   See: resurrectionProtocols.ts, npcWorldDeathState.ts,
        necromancerCycle.ts
   ═══════════════════════════════════════════════════════ */

import {
  type ResurrectionQuestState,
  type ResurrectableNpcKey,
  resolveQuestPathB,
  pickPathBTransmission,
} from "./resurrectionProtocols";
import {
  type NpcWorldDeathRecord,
  markPathBResolved,
} from "./npcWorldDeathState";

export interface PathBOutcome {
  /** Updated quest state — set to completed_path_b. */
  quest: ResurrectionQuestState;
  /** Updated death record — resolvedPathB true; world block lifted. */
  worldDeathRecord: NpcWorldDeathRecord;
  /** The transmission body. The caller writes to transmissions inbox. */
  transmission: {
    npcKey: ResurrectableNpcKey;
    tone: string;
    lines: string[];
  };
  /** Reputation hit (NPC trust delta). Apply to the corresponding
   *  relationship adapter (e.g. `lockeRelationshipAdapter`). */
  reputationHit: { npcKey: ResurrectableNpcKey; trustDelta: number };
}

/** Reputation delta applied when Path B fires. The player ignored the
 *  Resurrection Protocols quest; the NPC is alive but unhappy about it. */
export const PATH_B_REPUTATION_HIT = -30;

/** Resolve a single open quest via Path B. Pure function — caller
 *  persists each side of the outcome to the appropriate table. */
export function resolveSingleQuestPathB(args: {
  quest: ResurrectionQuestState;
  worldDeath: NpcWorldDeathRecord;
  triggerSeed: number;
  now: number;
}): PathBOutcome {
  const { quest, worldDeath, triggerSeed, now } = args;
  const updatedQuest = resolveQuestPathB(quest, now);
  const updatedRec = markPathBResolved(worldDeath);
  const tx = pickPathBTransmission(updatedQuest, triggerSeed);
  return {
    quest: updatedQuest,
    worldDeathRecord: updatedRec,
    transmission: {
      npcKey: updatedQuest.npcKey,
      tone: tx.tone,
      lines: tx.lines,
    },
    reputationHit: {
      npcKey: updatedQuest.npcKey,
      trustDelta: PATH_B_REPUTATION_HIT,
    },
  };
}

/** Necromancer-cycle phase that triggers Path B. Anything in or after
 *  "manifesting" qualifies; "dormant" does not. */
export type NecromancerTriggerPhase =
  | "manifesting"
  | "returned"
  | "banishment_arc";

/** Should Path B fire for the given phase? */
export function shouldFirePathBForPhase(phase: string): boolean {
  return (
    phase === "manifesting" ||
    phase === "returned" ||
    phase === "banishment_arc"
  );
}

/** Batch resolution helper. Given the open quests + world-death records
 *  for a single user, resolve all of them via Path B. */
export function batchResolvePathB(args: {
  openQuests: ResurrectionQuestState[];
  worldDeathRecords: NpcWorldDeathRecord[];
  now: number;
  /** Seed source — typically `Date.now() + userId` or the
   *  necromancerCycle row's `phaseStartedAt` epoch. */
  triggerSeed: number;
}): PathBOutcome[] {
  const { openQuests, worldDeathRecords, now, triggerSeed } = args;
  const outcomes: PathBOutcome[] = [];
  for (let i = 0; i < openQuests.length; i++) {
    const q = openQuests[i];
    if (
      q.status === "completed_path_a" ||
      q.status === "completed_path_b"
    ) {
      continue;
    }
    const rec = worldDeathRecords.find(
      (r) => r.npcKey === q.npcKey && r.killedMemberKey === q.killedMemberKey,
    );
    if (!rec) continue;
    outcomes.push(
      resolveSingleQuestPathB({
        quest: q,
        worldDeath: rec,
        triggerSeed: triggerSeed + i,
        now,
      }),
    );
  }
  return outcomes;
}
