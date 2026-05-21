/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Living Universe event emitter

   Pure function: given a mission's terminal outcome,
   returns the list of Living Universe events to publish.

   The server (apps/server/routers/wolfHunt.ts) calls this
   on mission close and forwards the events to the Living
   Universe state mutator (apps/shared/livingUniverseEvents.ts).

   Meters mutated by each event:

     - crucible.league_strength — decremented on kills and
       (less so) on spares. Hits 0 → arc-complete trigger.
     - crucible.hierarchy_influence — mirrors league_strength.
     - crucible.release_pressure — accumulates over time +
       per-escape. Hits 1.0 → arc-failure trigger.
   ═══════════════════════════════════════════════════════ */

import type { WolfHuntMissionState } from "./missionState";
import { getHeroTarget } from "./heroTargets/index";

export type WolfHuntLivingEventKind =
  | "league_member_killed"
  | "league_member_spared"
  | "league_member_escaped"
  | "lycos_died_on_mission"
  | "lord_lieutenant_defeated";

export interface WolfHuntLivingEvent {
  kind: WolfHuntLivingEventKind;
  targetId: string;
  corruptorLord: string;
  classKey: string;
  threatTier: number;
  /** Delta to apply to crucible.league_strength. Sign indicates direction. */
  leagueStrengthDelta: number;
  /** Delta to apply to crucible.hierarchy_influence. */
  hierarchyInfluenceDelta: number;
  /** Delta to apply to crucible.release_pressure. */
  releasePressureDelta: number;
}

function deltasFor(
  kind: WolfHuntLivingEventKind,
  threatTier: number,
): {
  leagueStrengthDelta: number;
  hierarchyInfluenceDelta: number;
  releasePressureDelta: number;
} {
  // Base magnitude scales with threatTier (1-5).
  const base = threatTier / 50; // 0.02 to 0.10
  switch (kind) {
    case "league_member_killed":
      return {
        leagueStrengthDelta: -base * 1.5,
        hierarchyInfluenceDelta: -base * 1.5,
        releasePressureDelta: -base,
      };
    case "league_member_spared":
      return {
        leagueStrengthDelta: -base * 0.5,
        hierarchyInfluenceDelta: -base * 0.5,
        releasePressureDelta: -base * 0.5,
      };
    case "league_member_escaped":
      return {
        leagueStrengthDelta: 0,
        hierarchyInfluenceDelta: 0,
        releasePressureDelta: base * 1.5,
      };
    case "lycos_died_on_mission":
      return {
        leagueStrengthDelta: 0,
        hierarchyInfluenceDelta: base * 0.5,
        releasePressureDelta: base,
      };
    case "lord_lieutenant_defeated":
      return {
        leagueStrengthDelta: -base * 2.5,
        hierarchyInfluenceDelta: -base * 2.5,
        releasePressureDelta: -base * 2,
      };
  }
}

/**
 * Emit zero-or-more events from a closed mission. Pure — no I/O.
 * Caller (server) merges the deltas into livingUniverseState.
 */
export function eventsFromMission(
  state: WolfHuntMissionState,
): ReadonlyArray<WolfHuntLivingEvent> {
  if (!state.outcome) return [];
  const target = getHeroTarget(state.targetId);
  const events: WolfHuntLivingEvent[] = [];

  switch (state.outcome) {
    case "killed":
      events.push({
        kind: "league_member_killed",
        targetId: state.targetId,
        corruptorLord: target.corruptorLord,
        classKey: target.classKey,
        threatTier: target.threatTier,
        ...deltasFor("league_member_killed", target.threatTier),
      });
      if (target.isBossLieutenant) {
        events.push({
          kind: "lord_lieutenant_defeated",
          targetId: state.targetId,
          corruptorLord: target.corruptorLord,
          classKey: target.classKey,
          threatTier: target.threatTier,
          ...deltasFor("lord_lieutenant_defeated", target.threatTier),
        });
      }
      break;
    case "spared":
      events.push({
        kind: "league_member_spared",
        targetId: state.targetId,
        corruptorLord: target.corruptorLord,
        classKey: target.classKey,
        threatTier: target.threatTier,
        ...deltasFor("league_member_spared", target.threatTier),
      });
      break;
    case "escaped":
      events.push({
        kind: "league_member_escaped",
        targetId: state.targetId,
        corruptorLord: target.corruptorLord,
        classKey: target.classKey,
        threatTier: target.threatTier,
        ...deltasFor("league_member_escaped", target.threatTier),
      });
      break;
    case "lycos_died":
      events.push({
        kind: "lycos_died_on_mission",
        targetId: state.targetId,
        corruptorLord: target.corruptorLord,
        classKey: target.classKey,
        threatTier: target.threatTier,
        ...deltasFor("lycos_died_on_mission", target.threatTier),
      });
      break;
  }

  return events;
}

/**
 * Crucible meter snapshot — stored in
 * `userProgress.gameData.livingUniverseState.crucible`.
 */
export interface CrucibleMeters {
  league_strength: number; // 0-1
  hierarchy_influence: number; // 0-1
  release_pressure: number; // 0-1
}

export function emptyCrucibleMeters(): CrucibleMeters {
  return {
    league_strength: 1.0,
    hierarchy_influence: 1.0,
    release_pressure: 0.0,
  };
}

export function applyEventsToMeters(
  meters: CrucibleMeters,
  events: ReadonlyArray<WolfHuntLivingEvent>,
): CrucibleMeters {
  const clamp = (n: number): number => Math.max(0, Math.min(1, n));
  return events.reduce<CrucibleMeters>(
    (acc, e) => ({
      league_strength: clamp(acc.league_strength + e.leagueStrengthDelta),
      hierarchy_influence: clamp(acc.hierarchy_influence + e.hierarchyInfluenceDelta),
      release_pressure: clamp(acc.release_pressure + e.releasePressureDelta),
    }),
    meters,
  );
}

/** Good-ending trigger: league_strength has been driven to zero. */
export function isGoodEndingReached(meters: CrucibleMeters): boolean {
  return meters.league_strength <= 0.05;
}

/** Bad-ending trigger: release_pressure has crossed the escape threshold. */
export function isBadEndingReached(meters: CrucibleMeters): boolean {
  return meters.release_pressure >= 0.95;
}
