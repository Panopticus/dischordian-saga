/* ═══════════════════════════════════════════════════════
   THE CONTINUING-LOOP ENDGAME — build-plan §VIII Phase C

   Canon-locks the shipped endgame. Per the dreamer reframe
   (2026-05-15, canon authority): the Servant Hero Academy is
   a future season / DLC massive expansion (≥1 year out) — it
   is NOT the endgame the player reaches today. The shipped
   endgame is THE CONTINUING LOOP: the post-Act-7 prestige
   cycle of events + fights + Governance Hub votes + the
   per-cycle chronicle the player writes.

   This module declares the five surfaces of that loop and
   binds each to its shipped runtime anchor. The parity gate
   (apps/shared/_completeness/checks/continuingLoopEndgameCoverage.ts)
   asserts every surface is canon-anchored. The loop lives
   inside the `streamed_prism_year_1` era
   (apps/shared/eraTimeline.ts) — it is the present
   canonical terminus, not a new era boundary.
   ═══════════════════════════════════════════════════════ */

export type LoopSurfaceId =
  | "prestige_rollover"
  | "cycle_chronicle"
  | "governance_hub_votes"
  | "dischordia_meter"
  | "cross_wave_witness";

export type LoopSurfaceStatus =
  /** Canon-anchored by this PR (Phase C). */
  | "canon_locked"
  /** Already shipped pre-Phase-C; this module only records it. */
  | "canon_locked_existing";

export interface LoopSurfaceCanon {
  id: LoopSurfaceId;
  name: string;
  /** In-fiction: what this surface IS in the loop (not gameplay). */
  diegeticRole: string;
  /** The shipped module/router that implements it. */
  runtimeAnchorModule: string;
  /** file:line citation for the canon claim. */
  loreSource: string;
  status: LoopSurfaceStatus;
}

export const CONTINUING_LOOP_TERMINUS_NOTE =
  "The shipped endgame is the post-Act-7 continuing loop — not the " +
  "Servant Hero Academy. Each cycle the player closes Act 7, prestige " +
  "rolls over (narrativeAct stays <= 7), and the loop turns again: " +
  "fresh events, fights, Governance Hub votes, and a new chronicle the " +
  "player inscribes. The Servant Hero Academy is the announced future " +
  "the loop points at; the loop is the canon present terminus of " +
  "streamed_prism_year_1.";

export const CONTINUING_LOOP_ENDGAME: readonly LoopSurfaceCanon[] = [
  {
    id: "prestige_rollover",
    name: "Prestige Rollover",
    diegeticRole:
      "The Cycle turns. Act 7 closes; the war ends; the loop resets to " +
      "the Prelude with trust, cards, morality, and the chronicle " +
      "carried forward. The player is not finished — the player is " +
      "between volumes.",
    runtimeAnchorModule:
      "apps/shared/act7CompletionGate.ts + apps/server/routers/prestige.ts",
    loreSource:
      "apps/shared/act7CompletionGate.ts:15-19 ('sets act_7_complete and " +
      "triggers prestige rollover. narrativeAct does NOT advance past 7') + " +
      "apps/server/routers/prestige.ts:74-254 (prestige.execute)",
    status: "canon_locked_existing",
  },
  {
    id: "cycle_chronicle",
    name: "The Chronicler's Desk (the per-cycle chronicle)",
    diegeticRole:
      "Each closed cycle the player writes the chronicle the Antiquarian " +
      "will only read. Volume Nineteen onward is the player's hand. The " +
      "Desk is where the loop becomes a record.",
    runtimeAnchorModule:
      "apps/shared/postRunInscriptions.ts + apps/server/services/postRunInscriptionsService.ts",
    loreSource:
      "apps/shared/postRunInscriptionsService.ts:46-50 (cycleVoteId " +
      "post_run:<userId>:<prestigeTier>:<stanceFlag>) + " +
      "apps/shared/chroniclersDeskCanon.ts (§X.7 canon-lock)",
    status: "canon_locked",
  },
  {
    id: "governance_hub_votes",
    name: "The Governance Hub",
    diegeticRole:
      "Between cycles the playerbase votes the nexus points. The " +
      "constructed CoNexus the Architect dismantled left a governance " +
      "shell; the loop is how it is filled, cycle after cycle.",
    runtimeAnchorModule:
      "apps/client/src/pages/GovernanceHubPage.tsx + architectConsole router",
    loreSource:
      "apps/shared/_completeness/checks/governanceRouterPresence.ts:1-40 + " +
      "apps/shared/conexusCanon.ts (the dismantled constructed CoNexus)",
    status: "canon_locked_existing",
  },
  {
    id: "dischordia_meter",
    name: "The Dischordia Cycle (community light/dark)",
    diegeticRole:
      "The community's accumulated stance bends each cycle's tone. The " +
      "loop is not neutral — it remembers what the playerbase chose, and " +
      "the chronicle reads it back.",
    runtimeAnchorModule: "apps/shared/dischordiaCycle.ts",
    loreSource:
      "apps/shared/dischordiaCycle.ts + apps/shared/postRunInscriptions.ts " +
      "(buildDischordiaInscription)",
    status: "canon_locked_existing",
  },
  {
    id: "cross_wave_witness",
    name: "The Cross-Wave Witness Network",
    diegeticRole:
      "Players across prestige cycles and waves read each other's " +
      "chronicle inscriptions, as the Two Witnesses carried continuity " +
      "through bodies. No run is written alone; every Volume is witnessed " +
      "by the waves that follow.",
    runtimeAnchorModule: "apps/shared/crossWaveWitnessNetwork.ts",
    loreSource:
      "apps/shared/crossWaveWitnessNetwork.ts + " +
      "apps/shared/identityCollisionCanon.ts:257-258 (Two-Witnesses canon) + " +
      "apps/shared/twoWitnessesDecode.ts:126-142 (Fragment V signature transfer)",
    status: "canon_locked",
  },
] as const;

export function getContinuingLoopCoverage(): {
  declared: number;
  locked: number;
} {
  const valid: LoopSurfaceStatus[] = ["canon_locked", "canon_locked_existing"];
  return {
    declared: CONTINUING_LOOP_ENDGAME.length,
    locked: CONTINUING_LOOP_ENDGAME.filter(
      (s) =>
        valid.includes(s.status) &&
        s.runtimeAnchorModule.trim().length > 0 &&
        s.loreSource.trim().length > 0 &&
        s.diegeticRole.trim().length > 0,
    ).length,
  };
}

export function getLoopSurface(id: LoopSurfaceId): LoopSurfaceCanon | undefined {
  return CONTINUING_LOOP_ENDGAME.find((s) => s.id === id);
}
