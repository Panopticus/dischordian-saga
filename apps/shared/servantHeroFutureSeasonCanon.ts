/* ═══════════════════════════════════════════════════════
   SERVANT HERO ACADEMY — FUTURE-SEASON DEFERRAL CANON
   build-plan §VIII Phase C (C6 + C7 Servant-Hero portion)

   Per the dreamer (2026-05-15, canon authority): the
   Servant Hero Academy is a future season / DLC massive
   expansion, ≥1 year out. It is NOT the endgame to build
   now (the continuing loop is — see
   apps/shared/continuingLoopEndgameCanon.ts).

   This module formally DEFERS C6 (Servant Hero onboarding
   cinematic) and C7 (Servant-Hero curriculum) as typed
   future-season hooks. The pattern mirrors
   apps/shared/imprintSummoningCanon.ts's typed-status hooks
   (produced | pending | retired): "deferred_future_season"
   is a VALID classification — the gate-then-stub pattern —
   so the Phase-C surface is fully accounted for and the
   parity gate PASSES without blocking on a season that is
   a year out.

   The Act7 → Phase 14 transition seam is NOT an orphaned
   bug. Phase 14 ("Servant Hero Academy Era",
   apps/shared/sagaPhases.ts:281-294) is only returned by
   resolveCurrentSagaPhase when narrativeAct >= 8 ||
   flags.servant_hero_academy_onboarded. The prestige
   rollover keeps narrativeAct <= 7
   (apps/shared/act7CompletionGate.ts:15-19) and never sets
   that flag, so Phase 14 is STRUCTURALLY UNREACHABLE in the
   shipped loop — a deliberate not-yet-launched boundary,
   canon-locked here as intentional.

   When the Servant Hero season ships (future PR), these
   items flip to "current_loop_shipped" and a Phase-14
   reachability gate is added then; this gate's contract is
   unchanged.
   ═══════════════════════════════════════════════════════ */

export type FutureSeasonItemStatus =
  /** Announced; ≥1 year out; the seam is the deliberate boundary. */
  | "deferred_future_season"
  /** Reserved for the future PR that ships the season. */
  | "current_loop_shipped";

export interface DeferredEndgameItem {
  id: string;
  buildPlanRef: string;
  status: FutureSeasonItemStatus;
  reason: string;
  /** The seam module(s) that gate the deferral (file:line). */
  seamModule: string;
  /** The Act7→Phase14 boundary is deliberate, not an orphan. */
  seamIsIntentional: true;
}

export const SERVANT_HERO_SEASON_NOTE =
  "The Servant Hero Academy is a future season / DLC massive " +
  "expansion (≥1 year out, 2027+). The shipped endgame is the " +
  "continuing loop. The Act7→Phase14 seam is the deliberate " +
  "not-yet-launched boundary — Phase 14 is structurally unreachable " +
  "while narrativeAct <= 7.";

export const DEFERRED_ENDGAME_ITEMS: readonly DeferredEndgameItem[] = [
  {
    id: "C6_servant_hero_onboarding_cinematic",
    buildPlanRef: "§VIII Phase C — C6 (Phase 14 Servant Hero Academy onboarding cinematic + transition)",
    status: "deferred_future_season",
    reason:
      "Servant Hero Academy is a future season / DLC massive expansion " +
      "(≥1 year out). Not built in the present loop endgame.",
    seamModule:
      "apps/shared/sagaPhases.ts:281-294 (Phase 14 def; unreachable " +
      "while narrativeAct<=7) + apps/shared/act7CompletionGate.ts:15-19 " +
      "(prestige rollover keeps narrativeAct<=7)",
    seamIsIntentional: true,
  },
  {
    id: "C7_servant_hero_curriculum",
    buildPlanRef: "§VIII Phase C — C7 (Servant Hero Academy curriculum)",
    status: "deferred_future_season",
    reason:
      "The Servant-Hero curriculum is future-season content. The " +
      "current-loop C7 surfaces (Chronicler's Desk, Apprentice Loop " +
      "continuation, Cross-Wave Witness Network) ship now; the " +
      "Servant-Hero-specific curriculum is deferred with the season.",
    seamModule:
      "apps/shared/sagaPhases.ts:281-294 + apps/shared/eraTimeline.ts:299-316 " +
      "(streamed_prism_year_1 canonNote — Phase 14 is a phase within, not " +
      "an era boundary)",
    seamIsIntentional: true,
  },
] as const;

export function getServantHeroDeferralCoverage(): {
  declared: number;
  classified: number;
} {
  const valid: FutureSeasonItemStatus[] = [
    "deferred_future_season",
    "current_loop_shipped",
  ];
  return {
    declared: DEFERRED_ENDGAME_ITEMS.length,
    classified: DEFERRED_ENDGAME_ITEMS.filter(
      (i) =>
        valid.includes(i.status) &&
        i.seamIsIntentional === true &&
        i.seamModule.trim().length > 0,
    ).length,
  };
}
