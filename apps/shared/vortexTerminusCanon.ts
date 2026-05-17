/* ═══════════════════════════════════════════════════════
   VORTEX / TERMINUS RECONCILIATION CANON — PR-22

   Two of the saga's loose institutional/community threads.
   Project-owner ruling (2026-05-17): both are now BOUND.
   The parity gate is a hard PASS — neither thread is
   canon_pending.

   TERMINUS SWARM — RECONCILED (dreamer canon-lock 2026-05-17).
     Three readings contended in code:
       (a) the Risen — the Necromancer's First-Coming
           manifestation (the revived swarm);
       (b) a Vortex manifestation;
       (c) the Thought Virus itself.
     Canonical reading = (c) THE THOUGHT VIRUS. The Terminus
     Swarm IS the intergalactic Thought-Virus plague made
     flesh — an INDEPENDENT institutional threat, neither the
     Necromancer's Risen nor a Vortex manifestation. Over
     centuries the virus mutated and evolved inside Kael, who
     became its galaxy-spanning vector; his end-state is The
     Source, gone insane, sealed in the heart of Terminus —
     the rogue planet that was once the Panopticon. The virus
     zombifies living AND artificial minds alike; it even
     conquered and infected the Hierarchy. Terminus is ringed
     by the floating, virus-dormant corpses of gigantic
     Inspector demon-lords who died in the final battle of
     the Panopticon, attempting to seize reality as it fell.
     The first wave of Potentials chose war, struck an organic
     satellite, and crash-landed virus-infected on Terminus —
     awakening the undead insectoid demon zombies and spore
     tyrants. Readings (a) and (b) are NOT discarded: they are
     recorded as typed `alternate` interpretations (in-fiction
     misreadings — the Risen reading is Hierarchy-spread
     propaganda). The long-shipping LORE_BIBLE Terminus Swarm
     dossier already carries the Thought-Virus reading; this
     binding realigns the reconciliation surface to the bible.

   THE VORTEX — RECONCILED & HARD-LOCKED (dreamer 2026-05-17).
     The Vortex is the saga's DOOMSDAY-CLOCK TERMINAL STATE —
     the end-state the whole spine bends toward, and it FEEDS
     THE FINAL COMING (theComingCanon.final_coming). It is
     ARCHON #9 (archonCanon.ts the_vortex): the colossal
     sentient star-devouring starship the Architect built as
     the Empire's inexhaustible energy source. The Engineer
     (Vex Solène / Engineer Zero) arc (arc.vex_solene) IS the
     campaign against it; the Engineer destroys the Vortex
     right before his execution by the Politician (Archon #7)
     — and that execution IS the Final Coming. The
     dischordiaCycle Vortex-proximity meter is the literal
     doomsday clock: the player-facing pressure counting down
     to the terminal state. NO canon-pending status remains.

   The parity gate
   (apps/shared/_completeness/checks/vortexTerminusCoverage.ts)
   is a hard PASS: both threads are "reconciled" and each
   carries a canonical reading + ≥1 recorded alternate +
   loreSource. The "canon_pending" branch in the check is
   retained only as defensive scaffolding; no thread is
   pending. The ratchet target is 0 and stays 0.
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
      "The Thought Virus itself — the intergalactic mind-plague made flesh, an INDEPENDENT institutional threat (not the Necromancer's Risen, not a Vortex manifestation). Over centuries the virus mutated and evolved inside Kael, who became its galaxy-spanning vector; his end-state is The Source, gone insane, sealed in the heart of Terminus — the rogue planet that was once the Panopticon. The virus zombifies living and artificial minds alike and has even conquered and infected the Hierarchy. Terminus is ringed by the floating, virus-dormant corpses of gigantic Inspector demon-lords who died in the final battle of the Panopticon. The first wave of Potentials chose war, struck an organic satellite, and crash-landed virus-infected on Terminus, awakening the undead insectoid demon zombies and spore tyrants.",
    alternates: [
      {
        id: "terminus_risen_first_coming",
        reading:
          "The Risen — the Necromancer's First-Coming manifestation (the revived swarm climbing with community resurrection-energy).",
        note: "An in-fiction misreading spread by Hierarchy comms (and a pre-2026-05-17 code reading). The Necromancer's Return / resurrection meter is real and IS the First Coming (theComingCanon.first_coming, necromancerReturn.ts) — but it is a DISTINCT thread; the Terminus Swarm is the Thought Virus, not the Risen. Recorded, not canon.",
      },
      {
        id: "terminus_vortex_manifestation",
        reading: "A manifestation of the Vortex (Archon #9).",
        note: "An in-fiction misreading. The Vortex is the sun-devouring Archon the Engineer fights (the_vortex below); it does not raise swarms. The Swarm is the Thought-Virus plague. The two doomsday pressures are distinct. Recorded, not canon.",
      },
    ],
    loreSource:
      "apps/shared/thoughtVirus.ts (infection mechanics) + docs/built/LORE_BIBLE.md (The Terminus Swarm dossier — Thought-Virus-spawned, The Source, the Panopticon ruin) + apps/shared/perspectiveCanon.ts (perspective.terminus_swarm) + apps/shared/necromancerReturn.ts (the Risen system — recorded as the alternate, not canon)",
    canonNote:
      "Dreamer canon-lock 2026-05-17: the Terminus Swarm IS the Thought Virus — an independent institutional threat. Vector = Kael → The Source, sealed in the heart of Terminus (the rogue ex-Panopticon planet). Zombifies living and artificial minds; conquered the Hierarchy. Ringed by the dormant-infected corpses of Inspector demon-lords who fell in the final battle of the Panopticon. The first Potentials' war-choice crash awakened the undead insectoid demon zombies and spore tyrants. Realigns the reconciliation surface to the long-shipping LORE_BIBLE dossier; the Risen / First-Coming and Vortex-manifestation readings are preserved as typed in-fiction alternates.",
  },
  {
    id: "the_vortex",
    title: "The Vortex",
    status: "reconciled",
    canonicalReading:
      "The saga's DOOMSDAY-CLOCK TERMINAL STATE — the end-state the whole spine bends toward, and it FEEDS THE FINAL COMING (theComingCanon.final_coming). Mechanically it is Archon #9 (archonCanon the_vortex, full bible canon-locked 2026-05-16): a colossal sentient starship the Architect built on Day 25 of Convergence, Year 500 A.A. as the Empire's inexhaustible energy source — it consumes entire stars, converting their mass to energy and annihilating their solar systems. Canonically deployed to Zenon to eat Zenon's sun (the Vex Solène / Game Master theatre). The Engineer (Vex Solène / Engineer Zero) arc (arc.vex_solene) IS the campaign against it; SPOILER: the Engineer destroys the Vortex right before the Engineer's execution by the Politician (Archon #7) — and that execution IS the Final Coming. The dischordiaCycle Vortex-proximity meter is the literal doomsday clock: the player-facing pressure counting down to the terminal state.",
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
      "apps/shared/archonCanon.ts (the_vortex, Archon #9, full bible canon-locked 2026-05-16) + apps/shared/episodeMysteries.ts (arc.vex_solene — the Engineer's campaign) + apps/shared/theComingCanon.ts (final_coming — the Politician executes the Engineer) + apps/shared/dischordiaCycle.ts (getVortexProximityDescription)",
    canonNote:
      "HARD-LOCKED (dreamer 2026-05-17): the Vortex is the saga's doomsday-clock terminal state that feeds the Final Coming — no canon-pending status remains. Dreamer canon-lock 2026-05-16 (full bible entry): sentient star-consuming starship, the Architect's creation (Y500 A.A.), deployed to Zenon. Spoiler-protected fate: destroyed by the Engineer right before his execution by the Politician — that execution is the Final Coming / endgame. Reconciled — not a tracked gap.",
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
