/**
 * Replay viewer types — client-side timeline scrubber (WS9).
 *
 * These types define the interface between the pure replay function
 * and the React UI layer. The viewer renders a timeline of actions
 * with a scrubber bar, letting users step forward/backward through
 * the match state.
 *
 * Spectator mode uses the same types but receives steps in real-time
 * via WebSocket instead of from a stored replay.
 */
import type { ReplayStep, ReplayResult } from "./replay";
import type { GameState, Action } from "../index";

/* ─── Viewer state ─── */

export interface ReplayViewerState {
  /** The full replay result (pre-computed). */
  replay: ReplayResult;
  /** Current step index (0 = initial state, 1..N = after action N). */
  currentStep: number;
  /** Whether the viewer is auto-playing. */
  playing: boolean;
  /** Playback speed multiplier (0.5x, 1x, 2x, 4x). */
  speed: number;
  /** Whether the viewer is in spectator mode (live). */
  spectatorMode: boolean;
}

export type ReplayViewerAction =
  | { kind: "set_step"; step: number }
  | { kind: "step_forward" }
  | { kind: "step_backward" }
  | { kind: "play" }
  | { kind: "pause" }
  | { kind: "set_speed"; speed: number }
  | { kind: "jump_to_start" }
  | { kind: "jump_to_end" }
  | { kind: "receive_live_step"; step: ReplayStep }; // spectator mode

/**
 * Pure reducer for the replay viewer state.
 */
export function replayViewerReducer(
  state: ReplayViewerState,
  action: ReplayViewerAction
): ReplayViewerState {
  switch (action.kind) {
    case "set_step":
      return {
        ...state,
        currentStep: clamp(action.step, 0, state.replay.steps.length),
        playing: false,
      };
    case "step_forward":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.replay.steps.length),
      };
    case "step_backward":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case "play":
      return { ...state, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "set_speed":
      return { ...state, speed: action.speed };
    case "jump_to_start":
      return { ...state, currentStep: 0, playing: false };
    case "jump_to_end":
      return { ...state, currentStep: state.replay.steps.length, playing: false };
    case "receive_live_step":
      // Spectator mode: append the new step and auto-advance.
      return {
        ...state,
        replay: {
          ...state.replay,
          steps: [...state.replay.steps, action.step],
          finalState: action.step.stateAfter,
        },
        currentStep: state.replay.steps.length + 1,
      };
    default:
      return state;
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Get the GameState at a given step index.
 * Step 0 = initialState, step N = after action N.
 */
export function getStateAtStep(replay: ReplayResult, step: number): GameState {
  if (step <= 0) return replay.initialState;
  if (step > replay.steps.length) return replay.finalState;
  return replay.steps[step - 1].stateAfter;
}

/**
 * Get the action that was applied at a given step.
 * Returns null for step 0 (initial state).
 */
export function getActionAtStep(replay: ReplayResult, step: number): Action | null {
  if (step <= 0 || step > replay.steps.length) return null;
  return replay.steps[step - 1].action;
}

/* ─── Timeline annotation ─── */

export interface TimelineMarker {
  step: number;
  label: string;
  kind: "turn_start" | "kill" | "spell" | "error" | "narrative";
  color?: string;
}

/**
 * Generate timeline markers from a replay for the scrubber bar.
 * Highlights key moments: turn transitions, kills, errors.
 */
export function generateTimelineMarkers(replay: ReplayResult): TimelineMarker[] {
  const markers: TimelineMarker[] = [];
  for (let i = 0; i < replay.steps.length; i++) {
    const step = replay.steps[i];
    if (step.action.kind === "end_turn") {
      markers.push({ step: i + 1, label: `Turn ${Math.ceil((i + 1) / 2)}`, kind: "turn_start" });
    }
    if (step.error) {
      markers.push({ step: i + 1, label: "Error", kind: "error", color: "#ef4444" });
    }
    for (const event of step.events) {
      if (event.type === "unit_destroyed") {
        markers.push({ step: i + 1, label: "Kill", kind: "kill", color: "#f59e0b" });
      }
    }
  }
  return markers;
}
