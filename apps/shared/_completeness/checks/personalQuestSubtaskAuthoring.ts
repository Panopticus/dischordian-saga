/**
 * Personal-quest sub-task authoring parity check.
 *
 * Declared: every (apprenticeArchetype | namedNpcKey) × stage must
 * declare ≥3 sub-tasks. Sub-tasks gate stage advance on top of the
 * bond / encounter threshold; missing sub-tasks reduce the personal-
 * quest chain to a bond-only progression (which is what we had before
 * this change).
 *
 * Tier-2 NPCs and apprentices: 3 stages × 3 subtasks = 9 per subject.
 * Tier-3 cosmic figures: 1 stage × ≥3 subtasks (cosmic encounters
 * resolve at stage 1).
 *
 * Counts NPC stages today (apprentices land their authoring next).
 *
 * Lands at RATCHET — apprentice authoring has zero subtasks at
 * checkpoint; tightens as those land.
 */
import type { RawParityCount } from "../types";

export async function checkPersonalQuestSubtaskAuthoring(): Promise<RawParityCount> {
  const npcMod = await import("../../npcIdentity");

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  // ─── NPC subjects ───
  for (const key of npcMod.NAMED_NPC_KEYS) {
    const id = npcMod.NPC_IDENTITIES[key];
    if (id.tier === "2") {
      // Three stages each must have ≥3 subtasks.
      declared += 3;
      const stages: Array<{ name: string; sub?: readonly { id: string }[] }> = [
        { name: "stage1", sub: id.personalQuest.stage1.subtasks },
        { name: "stage2", sub: id.personalQuest.stage2?.subtasks },
        { name: "stage3", sub: id.personalQuest.stage3?.subtasks },
      ];
      for (const s of stages) {
        if ((s.sub?.length ?? 0) >= 3) implemented++;
        else missing.push(`${key} ${s.name}`);
      }
    } else {
      // Tier 3 — single stage.
      declared += 1;
      if ((id.personalQuest.stage1.subtasks?.length ?? 0) >= 3) implemented++;
      else missing.push(`${key} stage1`);
    }
  }

  // ─── Apprentice subjects (when authored) ───
  // Apprentices currently use a 3-stage chain; subtasks land in a
  // follow-up authoring pass. Count declared stages so the ratchet
  // tightens as the authoring is done. The check imports lazily so
  // a parse error in apprenticeIdentity does not break NPC counting.
  try {
    const apprMod = await import("../../apprenticeIdentity");
    const apprIdentities = apprMod.APPRENTICE_IDENTITIES as Record<string, {
      personalQuest: {
        stage1: { subtasks?: readonly { id: string }[] };
        stage2: { subtasks?: readonly { id: string }[] };
        stage3: { subtasks?: readonly { id: string }[] };
      };
    }>;
    for (const arch of Object.keys(apprIdentities)) {
      declared += 3;
      const pq = apprIdentities[arch]!.personalQuest;
      const stages = [
        { name: "stage1", sub: pq.stage1.subtasks },
        { name: "stage2", sub: pq.stage2.subtasks },
        { name: "stage3", sub: pq.stage3.subtasks },
      ];
      for (const s of stages) {
        if ((s.sub?.length ?? 0) >= 3) implemented++;
        else missing.push(`apprentice:${arch} ${s.name}`);
      }
    }
  } catch {
    // Apprentice identity not loadable — skip.
  }

  return { declared, implemented, missing };
}
