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

   THE VORTEX — RECONCILED (dreamer canon-lock 2026-05-16).
     The Vortex is ARCHON #9 (archonCanon.ts the_vortex): the
     sun-devourer that consumes stars to power the Empire — the
     Empire's cosmic energy source. The Engineer (Vex Solène /
     Engineer Zero) sets out to destroy it; the Engineer's
     Mystery-Engine arc (arc.vex_solene) IS the campaign
     against the Vortex, culminating in the Last Calibration on
     the DEC-7710 rig. The doomsday-proximity meter
     (dischordiaCycle.getVortexProximityDescription) is the
     player-facing pressure of that campaign. NOT a vague
     pending thread — a load-bearing Archon with a bound arc.

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
        reading: "A manifestation of the Vortex (Archon #9).",
        note: "An in-fiction misreading. The Vortex is the sun-devouring Archon the Engineer fights (vortexTerminusCanon the_vortex); it does not raise swarms. The swarm is the Necromancer's Risen. The two doomsday pressures are distinct. Recorded, not canon.",
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
    status: "reconciled",
    canonicalReading:
      "Archon #9: the sun-devourer that consumes stars to power the Empire — the Empire's cosmic energy source (archonCanon the_vortex, domain canon-locked 2026-05-16). The Engineer (Vex Solène / Engineer Zero) sets out to destroy it; the Engineer's Mystery-Engine arc (arc.vex_solene) IS the campaign against the Vortex, culminating in the Last Calibration. The dischordiaCycle Vortex-proximity meter is that campaign's player-facing pressure.",
    alternates: [
      {
        id: "vortex_era_placeholder",
        reading: "An era-timeline placeholder with no agent (eraTimeline.ts A9).",
        note: "Superseded. The Vortex is a load-bearing Archon with a bound arc, not a slot awaiting fill. Recorded to preserve the pre-2026-05-16 reading.",
      },
      {
        id: "vortex_unbound_doomsday_meter",
        reading: "A free-floating doomsday clock with no story.",
        note: "Superseded. The proximity meter is the player-facing pressure of the Engineer's campaign to destroy Archon #9, not an unbound mechanic. Recorded, not canon.",
      },
    ],
    loreSource:
      "apps/shared/archonCanon.ts (the_vortex, Archon #9, domain canon-locked 2026-05-16) + apps/shared/episodeMysteries.ts (arc.vex_solene — the Engineer's campaign) + apps/shared/dischordiaCycle.ts (getVortexProximityDescription)",
    canonNote:
      "Dreamer canon-lock 2026-05-16: the Vortex is the sun-devouring Archon powering the Empire; the Engineer (Vex Solène) arc is its destruction. Reconciled — no longer the tracked gap.",
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
