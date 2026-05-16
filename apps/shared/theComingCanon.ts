/* ═══════════════════════════════════════════════════════
   THE COMING — two-stage canon binding (PR-21)

   Project-owner canon (2026-05-16): "the Coming" is not one
   event. It is a single prophecy with TWO fulfilments, and the
   whole act spine is bent toward the second:

     FIRST COMING — the Necromancer's Return.
       The HALFWAY point. The community resurrection-energy
       meter (necromancerReturn.ts) crosses its threshold; the
       dead walk. Pinned to the Act 4 close = saga phase 7
       ("Memento Dischordia cliffhanger"). Universally mistaken
       for the end; it is the midpoint. The rehearsal.

     FINAL COMING — the Politician's Return.
       The ENDGAME. The Politician (Archon position #7) is the
       one who never needed raising, only waiting. Lands on the
       Act 7 close = saga phase 13 ("War-Choice"). It does NOT
       terminate the saga — it IGNITES the already-canon-locked
       continuing loop (continuingLoopEndgameCanon, PR-16). The
       endgame is a door, not a wall.

   This module is the single source of that binding. It does
   not re-implement the Necromancer meter, the Politician arc,
   the saga phases, the act-close cutscenes, or the loop — it
   CITES them and the parity gate proves every citation
   resolves at runtime. A two-stage prophecy whose stages do
   not resolve their anchors is a canon failure.

   Supersedes the earlier single-stage "Coming = Necromancer
   endgame" framing. perspective.the_coming (PR-18) already
   carries the two-stage premise; actCloseCutsceneCanon (PR-20)
   already pins the Comings to Acts 4 and 7. This module is the
   keystone that asserts the whole binding is coherent.
   ═══════════════════════════════════════════════════════ */

export type ComingStageId = "first_coming" | "final_coming";

export interface ComingStageCanon {
  id: ComingStageId;
  /** In-fiction name of this fulfilment. */
  title: string;
  /** "halfway" | "endgame". */
  role: "halfway" | "endgame";
  /** The returning entity. */
  whoReturns: string;
  /** Act whose close delivers this Coming. */
  act: 4 | 7;
  /** Saga phase the Act maps to (sagaPhases.ts). */
  sagaPhase: 7 | 13;
  /** Mystery-Engine arc that anchors the returning entity. */
  anchorArcId: string;
  /** Terminal episode of that arc. */
  anchorEpisodeId: string;
  /** What this Coming does to the saga's shape. */
  consequence: string;
  loreSource: string;
}

export const THE_COMING: readonly ComingStageCanon[] = [
  {
    id: "first_coming",
    title: "The First Coming — the Necromancer's Return",
    role: "halfway",
    whoReturns: "The Necromancer",
    act: 4,
    sagaPhase: 7,
    anchorArcId: "arc.the_necromancer",
    anchorEpisodeId: "necromancer.e5",
    consequence:
      "The community resurrection-energy meter crosses its threshold and the dead walk. Read as the end; it is the midpoint. The rehearsal for the one who was always going to come back.",
    loreSource:
      "apps/shared/necromancerReturn.ts (RESURRECTION_THRESHOLDS) + apps/shared/necromancerCycle.ts + apps/shared/sagaPhases.ts (phase 7, Act 4) + apps/shared/actCloseCutsceneCanon.ts (act 4, comingStage 'first')",
  },
  {
    id: "final_coming",
    title: "The Final Coming — the Politician's Return",
    role: "endgame",
    whoReturns: "The Politician",
    act: 7,
    sagaPhase: 13,
    anchorArcId: "arc.the_politician",
    anchorEpisodeId: "politician.e5",
    consequence:
      "The Politician (Archon #7) returns — the one who never needed raising, only waiting. It does not end the saga; it ignites the continuing loop (PR-16). The endgame is a door.",
    loreSource:
      "apps/shared/archonCanon.ts (position 7, The Politician) + apps/shared/episodeMysteries.ts (arc.the_politician) + apps/shared/sagaPhases.ts (phase 13, Act 7) + apps/shared/continuingLoopEndgameCanon.ts (PR-16) + apps/shared/actCloseCutsceneCanon.ts (act 7, comingStage 'final', ignitesContinuingLoop)",
  },
];

/** Look up a Coming stage. */
export function getComingStage(
  id: ComingStageId,
): ComingStageCanon | undefined {
  return THE_COMING.find((c) => c.id === id);
}

/** Coverage snapshot for the parity gate. */
export function getTheComingCoverage(): { declared: number; stages: number } {
  return { declared: THE_COMING.length, stages: 2 };
}
