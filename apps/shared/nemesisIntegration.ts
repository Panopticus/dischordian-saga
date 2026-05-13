/* ═══════════════════════════════════════════════════════
   NEMESIS INTEGRATION — surface-side hook helpers

   Other game systems (Trade Empire, Casino, Apprentice
   corruption, Hub votes) call into these helpers when their
   surface generates a Nemesis-relevant event. The helpers
   return the canonical encounter-kind + detail string the
   surface should pass to `trpc.nemesis.recordEncounter`.

   The integration helpers DO NOT call tRPC directly — they
   return the data the caller needs to record. This keeps
   the integration discipline tight: each surface owns its
   own server-call, and the Nemesis system stays decoupled
   from any one surface's tRPC client.

   Per dreamer-canon (2026-05-13): the Nemesis tries to
   thwart the player in Trade Empire AND other aspects.
   These helpers are the four surface integration touch-
   points.
   ═══════════════════════════════════════════════════════ */

import type {
  NemesisEncounterKind,
} from "./nemesisMemory";
import type {
  NemesisPlanKind,
} from "./nemesisPlans";

/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE INTEGRATION
   ═══════════════════════════════════════════════════════ */

export interface TradeRouteOutcomeInput {
  routeName: string;
  /** True if the Nemesis successfully sabotaged the route. */
  sabotaged: boolean;
  /** Whether the player had an active sabotage-plan to
   *  disrupt (used to drive plan disruption recording). */
  hadActivePlanToDisrupt: boolean;
}

export interface TradeRouteOutcomeRecord {
  encounterKind: NemesisEncounterKind;
  detail: string;
  /** Whether the encounter should also disrupt the plan. */
  disruptPlanKind: NemesisPlanKind | null;
}

/** Resolve a Trade Empire route outcome into a Nemesis
 *  encounter-record + optional plan-disrupt directive. */
export function tradeRouteOutcome(
  input: TradeRouteOutcomeInput,
): TradeRouteOutcomeRecord {
  if (input.sabotaged) {
    return {
      encounterKind: "route_sabotaged",
      detail: input.routeName,
      disruptPlanKind: null,
    };
  }
  return {
    encounterKind: "route_sabotage_blocked",
    detail: input.routeName,
    disruptPlanKind: input.hadActivePlanToDisrupt
      ? "trade_route_sabotage"
      : null,
  };
}

/* ═══════════════════════════════════════════════════════
   CASINO INTEGRATION
   ═══════════════════════════════════════════════════════ */

export interface CasinoOutcomeInput {
  tableName: string;
  /** True if the Nemesis succeeded in rigging the odds. */
  rigSucceeded: boolean;
  hadActivePlanToDisrupt: boolean;
}

export interface CasinoOutcomeRecord {
  encounterKind: NemesisEncounterKind;
  detail: string;
  disruptPlanKind: NemesisPlanKind | null;
}

export function casinoOutcome(
  input: CasinoOutcomeInput,
): CasinoOutcomeRecord {
  if (input.rigSucceeded) {
    return {
      encounterKind: "casino_odds_rigged",
      detail: input.tableName,
      disruptPlanKind: null,
    };
  }
  return {
    encounterKind: "casino_odds_rigging_blocked",
    detail: input.tableName,
    disruptPlanKind: input.hadActivePlanToDisrupt
      ? "casino_odds_rigging"
      : null,
  };
}

/* ═══════════════════════════════════════════════════════
   APPRENTICE CORRUPTION INTEGRATION
   ═══════════════════════════════════════════════════════ */

export interface ApprenticeCorruptionInput {
  trialDay: number;
  breakingPointFear: string;
  /** True if the Nemesis whisper landed (apprentice's
   *  resilience/trust/clarity dropped from the whisper). */
  whisperLanded: boolean;
  hadActivePlanToDisrupt: boolean;
}

export interface ApprenticeCorruptionRecord {
  encounterKind: NemesisEncounterKind;
  detail: string;
  disruptPlanKind: NemesisPlanKind | null;
}

export function apprenticeCorruptionOutcome(
  input: ApprenticeCorruptionInput,
): ApprenticeCorruptionRecord {
  const detail = `Day ${input.trialDay} ${input.breakingPointFear}`;
  if (input.whisperLanded) {
    return {
      encounterKind: "apprentice_whisper_landed",
      detail,
      disruptPlanKind: null,
    };
  }
  return {
    encounterKind: "apprentice_whisper_blocked",
    detail,
    disruptPlanKind: input.hadActivePlanToDisrupt
      ? "apprentice_breaking_point_whisper"
      : null,
  };
}

/* ═══════════════════════════════════════════════════════
   HUB-VOTE INTEGRATION
   ═══════════════════════════════════════════════════════ */

export interface HubVoteOutcomeInput {
  voteTitle: string;
  /** True if the Nemesis's counter-vote campaign carried. */
  counterVoteCarried: boolean;
  hadActivePlanToDisrupt: boolean;
}

export interface HubVoteOutcomeRecord {
  encounterKind: NemesisEncounterKind;
  detail: string;
  disruptPlanKind: NemesisPlanKind | null;
}

export function hubVoteOutcome(
  input: HubVoteOutcomeInput,
): HubVoteOutcomeRecord {
  if (input.counterVoteCarried) {
    return {
      encounterKind: "hub_counter_vote_landed",
      detail: input.voteTitle,
      disruptPlanKind: null,
    };
  }
  return {
    encounterKind: "hub_counter_vote_blocked",
    detail: input.voteTitle,
    disruptPlanKind: input.hadActivePlanToDisrupt
      ? "hub_counter_vote_campaign"
      : null,
  };
}

/* ═══════════════════════════════════════════════════════
   KILL / FLEE / MOCK EVENTS (combat-surface integration)
   ═══════════════════════════════════════════════════════ */

export interface DirectCombatEventInput {
  surfaceDetail: string;
  outcome: "player_killed_nemesis" | "nemesis_fled" | "player_mocked";
}

export interface DirectCombatEventRecord {
  encounterKind: NemesisEncounterKind;
  detail: string;
  disruptPlanKind: NemesisPlanKind | null;
}

export function directCombatEvent(
  input: DirectCombatEventInput,
): DirectCombatEventRecord {
  const kindMap: Record<
    DirectCombatEventInput["outcome"],
    NemesisEncounterKind
  > = {
    player_killed_nemesis: "killed_by_player",
    nemesis_fled: "fled_player",
    player_mocked: "mocked_by_player",
  };
  return {
    encounterKind: kindMap[input.outcome],
    detail: input.surfaceDetail,
    disruptPlanKind: null,
  };
}
