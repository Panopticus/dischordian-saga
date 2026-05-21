/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Mission reducer

   Pure function over (state, action, ctx) → result.
   Mirrors the apps/shared/tcg-core/engine/reducer.ts style
   but simpler — there's no Immer here because the state
   surface is small enough that explicit copies are clearer.

   The four-step machine:

     briefing → approach → engagement → aftermath

   The engagement step branches:
     - boss lieutenants → hand off to bossFight/ reducer
     - everyone else → text-resolution choice list

   Outcomes are written on the transition into aftermath.
   ═══════════════════════════════════════════════════════ */

import type {
  WolfHuntMissionState,
  MissionChoiceLogEntry,
  MissionOutcome,
} from "./missionState";
import { getHeroTarget } from "./heroTargets/index";
import {
  rollLycosDeath,
  deathRollSeed,
  type DeathRollResult,
} from "./lycosDeathRoll";

export type WolfHuntAction =
  | { kind: "advance_from_briefing" }
  | {
      kind: "approach_choice";
      choiceKey: "stealth" | "social" | "tactical" | "abort";
      /** Override risk grade for the choice; tests use this. */
      riskGradeOverride?: number;
    }
  | {
      kind: "engagement_choice";
      choiceKey: "hunt" | "restraint" | "mercy" | "withdraw";
      riskGradeOverride?: number;
    }
  | { kind: "aftermath_close" }
  /** Server-only — used after a boss-fight reducer's terminal state. */
  | {
      kind: "boss_fight_resolved";
      result: "wolf_wins" | "lieutenant_wins" | "lycos_dies";
    };

export interface ReducerContext {
  /** Crucible release-pressure at action time. Feeds the death-roll modifier. */
  releasePressure: number;
  /** Server-side timestamp for the choice log entry. */
  now: number;
}

export interface ReducerResult {
  state: WolfHuntMissionState;
  /** Side-effect requests the server should fulfill (flag writes, event emits). */
  effects: ReadonlyArray<ReducerEffect>;
}

export type ReducerEffect =
  | { kind: "emit_event"; eventKind: WolfHuntEventKind; payload: Record<string, unknown> }
  | { kind: "write_flag"; flag: string; value: boolean | string }
  | { kind: "start_boss_fight"; targetId: string };

export type WolfHuntEventKind =
  | "league_member_killed"
  | "league_member_spared"
  | "league_member_escaped"
  | "lycos_wounded"
  | "lycos_died_on_mission"
  | "lord_lieutenant_defeated"
  | "mission_aborted";

const RISK_GRADES = {
  stealth: 0.15,
  social: 0.25,
  tactical: 0.55,
  abort: 0.05,
  hunt: 0.85,
  restraint: 0.6,
  mercy: 0.35,
  withdraw: 0.2,
} as const satisfies Record<string, number>;

function appendChoice(
  state: WolfHuntMissionState,
  entry: MissionChoiceLogEntry,
): WolfHuntMissionState {
  return { ...state, choices: [...state.choices, entry] };
}

function runDeathRoll(
  state: WolfHuntMissionState,
  ctx: ReducerContext,
  riskGrade: number,
): DeathRollResult {
  const target = getHeroTarget(state.targetId);
  const seed = deathRollSeed(state.id, state.choices.length);
  return rollLycosDeath({
    threatTier: target.threatTier,
    riskGrade,
    releasePressure: ctx.releasePressure,
    seed,
  });
}

function applyDeathRoll(
  state: WolfHuntMissionState,
  result: DeathRollResult,
): { state: WolfHuntMissionState; lycosDied: boolean } {
  if (result === "died") {
    return {
      state: {
        ...state,
        lycosHealth: 0,
        step: "aftermath",
        outcome: "lycos_died",
        endedAt: state.endedAt ?? Date.now(),
      },
      lycosDied: true,
    };
  }
  if (result === "wounded") {
    return {
      state: { ...state, lycosHealth: Math.max(0, state.lycosHealth - 25) },
      lycosDied: false,
    };
  }
  return { state, lycosDied: false };
}

function resolveOutcomeFromEngagement(
  choice: "hunt" | "restraint" | "mercy" | "withdraw",
): MissionOutcome {
  switch (choice) {
    case "hunt":
      return "killed";
    case "restraint":
      return "killed";
    case "mercy":
      return "spared";
    case "withdraw":
      return "escaped";
  }
}

function eventKindForOutcome(outcome: MissionOutcome): WolfHuntEventKind | null {
  switch (outcome) {
    case "killed":
      return "league_member_killed";
    case "spared":
      return "league_member_spared";
    case "escaped":
      return "league_member_escaped";
    case "lycos_died":
      return "lycos_died_on_mission";
  }
}

export function reduceMission(
  state: WolfHuntMissionState,
  action: WolfHuntAction,
  ctx: ReducerContext,
): ReducerResult {
  if (state.outcome) {
    // Terminal — ignore further actions.
    return { state, effects: [] };
  }

  const effects: ReducerEffect[] = [];

  switch (action.kind) {
    case "advance_from_briefing": {
      if (state.step !== "briefing") return { state, effects: [] };
      return { state: { ...state, step: "approach" }, effects };
    }

    case "approach_choice": {
      if (state.step !== "approach") return { state, effects: [] };
      const riskGrade =
        action.riskGradeOverride ?? RISK_GRADES[action.choiceKey];

      // Abort short-circuits to aftermath with escaped outcome (the hero gets away).
      if (action.choiceKey === "abort") {
        const next: WolfHuntMissionState = {
          ...appendChoice(state, {
            step: "approach",
            choiceKey: action.choiceKey,
            riskGrade,
            committedAt: ctx.now,
          }),
          step: "aftermath",
          outcome: "escaped",
          endedAt: ctx.now,
        };
        effects.push({
          kind: "emit_event",
          eventKind: "mission_aborted",
          payload: { targetId: state.targetId },
        });
        effects.push({
          kind: "emit_event",
          eventKind: "league_member_escaped",
          payload: { targetId: state.targetId },
        });
        return { state: next, effects };
      }

      // Other approach choices roll for Lycos death.
      const rollResult = runDeathRoll(state, ctx, riskGrade);
      const choiceEntry: MissionChoiceLogEntry = {
        step: "approach",
        choiceKey: action.choiceKey,
        riskGrade,
        triggeredDeathRoll: true,
        deathRollResult: rollResult,
        committedAt: ctx.now,
      };

      const afterChoice = appendChoice(state, choiceEntry);
      const { state: afterRoll, lycosDied } = applyDeathRoll(
        afterChoice,
        rollResult,
      );

      if (lycosDied) {
        effects.push({
          kind: "emit_event",
          eventKind: "lycos_died_on_mission",
          payload: { targetId: state.targetId, step: "approach" },
        });
        return { state: afterRoll, effects };
      }

      if (rollResult === "wounded") {
        effects.push({
          kind: "emit_event",
          eventKind: "lycos_wounded",
          payload: { targetId: state.targetId, step: "approach" },
        });
      }

      // Advance to engagement. Boss lieutenants trigger the card module.
      const target = getHeroTarget(state.targetId);
      const advanced: WolfHuntMissionState = {
        ...afterRoll,
        step: "engagement",
        bossFightTriggered: target.isBossLieutenant,
      };
      if (target.isBossLieutenant) {
        effects.push({
          kind: "start_boss_fight",
          targetId: state.targetId,
        });
      }
      return { state: advanced, effects };
    }

    case "engagement_choice": {
      if (state.step !== "engagement") return { state, effects: [] };
      if (state.bossFightTriggered) {
        // Boss missions don't accept text-engagement choices —
        // they wait for the boss_fight_resolved action.
        return { state, effects: [] };
      }
      const riskGrade =
        action.riskGradeOverride ?? RISK_GRADES[action.choiceKey];

      const rollResult = runDeathRoll(state, ctx, riskGrade);
      const choiceEntry: MissionChoiceLogEntry = {
        step: "engagement",
        choiceKey: action.choiceKey,
        riskGrade,
        triggeredDeathRoll: true,
        deathRollResult: rollResult,
        committedAt: ctx.now,
      };
      const afterChoice = appendChoice(state, choiceEntry);
      const { state: afterRoll, lycosDied } = applyDeathRoll(
        afterChoice,
        rollResult,
      );

      if (lycosDied) {
        effects.push({
          kind: "emit_event",
          eventKind: "lycos_died_on_mission",
          payload: { targetId: state.targetId, step: "engagement" },
        });
        return { state: afterRoll, effects };
      }

      if (rollResult === "wounded") {
        effects.push({
          kind: "emit_event",
          eventKind: "lycos_wounded",
          payload: { targetId: state.targetId, step: "engagement" },
        });
      }

      const outcome = resolveOutcomeFromEngagement(action.choiceKey);
      const next: WolfHuntMissionState = {
        ...afterRoll,
        step: "aftermath",
        outcome,
        endedAt: ctx.now,
      };

      const evt = eventKindForOutcome(outcome);
      if (evt) {
        effects.push({
          kind: "emit_event",
          eventKind: evt,
          payload: { targetId: state.targetId, step: "engagement" },
        });
      }
      return { state: next, effects };
    }

    case "boss_fight_resolved": {
      if (state.step !== "engagement" || !state.bossFightTriggered) {
        return { state, effects: [] };
      }
      const target = getHeroTarget(state.targetId);
      let outcome: MissionOutcome;
      if (action.result === "wolf_wins") {
        outcome = "killed";
        effects.push({
          kind: "emit_event",
          eventKind: "lord_lieutenant_defeated",
          payload: { lordId: target.corruptorLord, targetId: state.targetId },
        });
      } else if (action.result === "lycos_dies") {
        outcome = "lycos_died";
      } else {
        outcome = "escaped";
      }
      const evt = eventKindForOutcome(outcome);
      if (evt) {
        effects.push({
          kind: "emit_event",
          eventKind: evt,
          payload: { targetId: state.targetId, step: "engagement_boss" },
        });
      }
      const choiceEntry: MissionChoiceLogEntry = {
        step: "engagement",
        choiceKey: `boss_${action.result}`,
        committedAt: ctx.now,
      };
      return {
        state: {
          ...appendChoice(state, choiceEntry),
          step: "aftermath",
          outcome,
          endedAt: ctx.now,
          lycosHealth: outcome === "lycos_died" ? 0 : state.lycosHealth,
        },
        effects,
      };
    }

    case "aftermath_close": {
      // No-op transition; the mission is already aftermath. This
      // exists so the client has a settle-the-state CTA.
      return { state, effects: [] };
    }
  }
}
