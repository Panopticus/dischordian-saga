/* ═══════════════════════════════════════════════════════
   HELLBOX — Apprentice-only one-shot resurrection

   The Hellbox is salvage tech bench-built on the Inception
   Ark. It can restore a fallen *apprentice* once. It does
   NOT work on:
    - Recruited NPCs (those go through Resurrection
      Protocols — see resurrectionProtocols.ts).
    - Bred crew (the lineage continues via children, not
      restoration).
    - Apprentices who have already been Hellbox-restored
      once (cloneDegradation > 0). The salvage echo cannot
      be re-cycled; the pattern collapses.

   Why imperfect: the Resurrectionist Ne-Yon — the only
   known operator of the actual Samsara machine — has
   vanished from the universe along with the rest of the
   Ne-Yons except the Degen. With no cosmic mediator the
   bench tech runs uncorrected.

   Cost on use:
    - 100 dream + 50 materials + 5 voidCrystals.
    - One unread loredex entry permanently lost (stripped).
    - +1 Blood Weave alignment toward the Hierarchy.

   The restored apprentice has cloneDegradation = 1, a
   permanent stat-cap reduction, and a deathRecord that
   is preserved and visible — they remember dying.
   ═══════════════════════════════════════════════════════ */

import type { SerializedCrewMember } from "./crewPersistence";

/** Eligibility gate. Apprentice-only, one-shot. Returns the reason
 *  string if ineligible so the UI can surface it. */
export function eligibleForHellbox(
  member: SerializedCrewMember,
): { eligible: true } | { eligible: false; reason: string } {
  if (member.status !== "dead") {
    return { eligible: false, reason: "Member is not deceased." };
  }
  if (member.productionPath !== "trained") {
    return {
      eligible: false,
      reason:
        "Hellbox only restores apprentices. Recruited NPCs go through the Resurrection Protocols quest. Bred crew continue through their bloodline.",
    };
  }
  if ((member.cloneDegradation ?? 0) > 0) {
    return {
      eligible: false,
      reason:
        "This apprentice has already been Hellbox-restored once. The salvage pattern cannot be cycled twice — the Resurrectionist is no longer in the universe to clean up the echo.",
    };
  }
  if (!member.archetype) {
    return {
      eligible: false,
      reason: "Apprentice archetype missing — cannot pattern-match.",
    };
  }
  return { eligible: true };
}

/** Cost of one Hellbox restoration. Drained from the player's wallet
 *  on use. */
export const HELLBOX_COST = {
  dream: 100,
  materials: 50,
  voidCrystals: 5,
} as const;

/** Stat-cap reduction applied to a Hellbox-restored apprentice. The
 *  pattern doesn't come back fully fidelity — every stat clamped down
 *  by 10% from its pre-death value, with a hard floor of 1. */
export const HELLBOX_STAT_DEGRADATION = 0.1;

/** Apply the degradation to a fallen apprentice's stat block and return
 *  the restored member shape. Pure function. The caller persists. */
export function restoreApprentice(
  fallen: SerializedCrewMember,
  now: number,
): SerializedCrewMember {
  const e = eligibleForHellbox(fallen);
  if (!e.eligible) {
    throw new Error(`Hellbox restoration refused: ${e.reason}`);
  }
  const newStats = { ...fallen.stats } as typeof fallen.stats;
  for (const k of Object.keys(newStats) as Array<keyof typeof newStats>) {
    newStats[k] = Math.max(1, Math.round(newStats[k] * (1 - HELLBOX_STAT_DEGRADATION)));
  }
  return {
    ...fallen,
    status: "active" as const,
    health: 60,
    morale: 30,
    loyalty: Math.min(100, fallen.loyalty + 20),
    stats: newStats,
    cloneDegradation: (fallen.cloneDegradation ?? 0) + 1,
    /* Death record is preserved deliberately — they remember dying. */
    deathRecord: fallen.deathRecord,
    biography: [
      ...(fallen.biography ?? []),
      {
        cycle: fallen.age,
        text: `Restored by Hellbox. The pattern came back imperfectly — strength, reflexes, and intellect dimmed by ten percent. They remember dying. The deathRecord is theirs to read whenever they want.`,
        tag: "epitaph" as const,
      },
    ],
  };
}

/** The Blood Weave alignment delta applied by one Hellbox use. Hierarchy
 *  alignment reads this row to gate the Game-Master meta-arc. */
export const HELLBOX_BLOOD_WEAVE_DELTA = 1;
