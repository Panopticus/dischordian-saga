/* ═══════════════════════════════════════════════════════
   VORTEX / TERMINUS RECONCILIATION CANON — PR-22

   Two of the saga's loose institutional/community threads.
   Project-owner ruling (2026-05-16, reaffirmed): the whole
   spine threads through the Necromancer (halfway) → the
   Politician (endgame). PR-22 reconciles these two threads
   against that spine.

   TERMINUS SWARM — RECONCILED.
     Three readings contended in code:
       (a) the Risen — the Necromancer's First-Coming
           manifestation (the revived swarm);
       (b) a Vortex manifestation;
       (c) Thought-Virus corruption.
     Canonical reading = (a) THE RISEN. The strongest existing
     code tie is necromancerReturn.ts (the `terminus` system
     gains "Zombie variant enemies … (revived swarm)" and the
     Risen as resurrection-energy climbs). The Terminus Swarm
     IS the First Coming made playable — it threads directly
     into theComingCanon `first_coming`. Readings (b) and (c)
     are NOT discarded: they are recorded as typed `alternate`
     interpretations (in-fiction misreadings the player may
     encounter), gate-then-stub style.

   THE VORTEX — CANON-PENDING.
     eraTimeline.ts:419 explicitly records "A9 The Vortex has
     era canon-pending". The doomsday-proximity meter exists
     (dischordiaCycle.getVortexProximityDescription) but the
     era's canonical placement awaits the dreamer. This thread
     is the tracked gap the ratchet carries; it is NOT forced
     to a reading here.

   The parity gate
   (apps/shared/_completeness/checks/vortexTerminusCoverage.ts)
   is RATCHET: a "reconciled" thread must carry a canonical
   reading + ≥1 recorded alternate + loreSource; a
   "canon_pending" thread (the Vortex) is the gap and must
   carry a loreSource + canonNote. The ceiling can only
   shrink (PR-future binds the Vortex when the dreamer rules).
   ═══════════════════════════════════════════════════════ */

export type ThreadStatus = "reconciled" | "canon_pending";

export interface ThreadAlternateReading {
  id: string;
  reading: string;
  /** Why it is an alternate, not the canon. */
  note: string;
}

export interface ReconciledThreadCanon {
  id: string;
  title: string;
  status: ThreadStatus;
  /** Set iff status === "reconciled". */
  canonicalReading?: string;
  /** Recorded, not discarded — the non-canon readings. */
  alternates?: readonly ThreadAlternateReading[];
  loreSource: string;
  canonNote?: string;
}

export const VORTEX_TERMINUS_THREADS: readonly ReconciledThreadCanon[] = [
  {
    id: "terminus_swarm",
    title: "The Terminus Swarm",
    status: "reconciled",
    canonicalReading:
      "The Risen — the Necromancer's First-Coming manifestation made playable. As community resurrection-energy climbs, the dead return as the swarm; the Terminus Swarm IS the First Coming on the board (theComingCanon.first_coming).",
    alternates: [
      {
        id: "terminus_vortex_manifestation",
        reading: "A manifestation of the Vortex doomsday thread.",
        note: "An in-fiction misreading: the swarm's timing correlates with Vortex proximity, but the mechanism is resurrection-energy, not the Vortex. Recorded, not canon.",
      },
      {
        id: "terminus_thought_virus",
        reading: "Thought-Virus corruption spreading through the legion.",
        note: "An in-fiction misreading propagated by Hierarchy comms; the Thought Virus is a distinct corruption vector. Recorded, not canon.",
      },
    ],
    loreSource:
      "apps/shared/necromancerReturn.ts (terminus system: 'Zombie variant enemies … revived swarm'; Risen) + apps/shared/theComingCanon.ts (first_coming) + apps/shared/featureRoadmap.ts (terminus_swarm)",
    canonNote:
      "Canonical reading bound to the First Coming per the project-owner spine ruling (Necromancer = halfway).",
  },
  {
    id: "the_vortex",
    title: "The Vortex",
    status: "canon_pending",
    loreSource:
      "apps/shared/eraTimeline.ts:419 (A9 The Vortex has era canon-pending) + apps/shared/dischordiaCycle.ts (getVortexProximityDescription — the doomsday-proximity meter)",
    canonNote:
      "Era placement deferred to the dreamer. The tracked gap; the ratchet ceiling shrinks when a future PR binds it. NOT forced to a reading here.",
  },
];

/** Look up a thread. */
export function getReconciledThread(
  id: string,
): ReconciledThreadCanon | undefined {
  return VORTEX_TERMINUS_THREADS.find((t) => t.id === id);
}

/** Coverage snapshot for the parity gate. */
export function getVortexTerminusCoverage(): {
  declared: number;
  reconciled: number;
  canonPending: number;
} {
  let reconciled = 0;
  let canonPending = 0;
  for (const t of VORTEX_TERMINUS_THREADS) {
    if (t.status === "reconciled") reconciled++;
    else canonPending++;
  }
  return {
    declared: VORTEX_TERMINUS_THREADS.length,
    reconciled,
    canonPending,
  };
}
